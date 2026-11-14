#include "epaper_ui/keyboard_controller.h"

#include <algorithm>

namespace epaper_ui {
namespace {

int WrapIndex(int index, int count)
{
    if (count <= 0) {
        return 0;
    }
    int wrapped = index % count;
    if (wrapped < 0) {
        wrapped += count;
    }
    return wrapped;
}

void NormalizeCursor(KeyboardInputState& input)
{
    input.cursor_index =
        std::clamp(input.cursor_index < 0 ? static_cast<int>(input.value_text.size())
                                          : input.cursor_index,
                   0,
                   static_cast<int>(input.value_text.size()));
}

bool InsertText(KeyboardInputState& input, char character)
{
    if (character == '\0' || input.value_text.size() >= input.max_length) {
        return false;
    }

    NormalizeCursor(input);
    input.value_text.insert(input.value_text.begin() + input.cursor_index, character);
    ++input.cursor_index;
    return true;
}

bool Backspace(KeyboardInputState& input)
{
    NormalizeCursor(input);
    if (input.cursor_index <= 0 || input.value_text.empty()) {
        return false;
    }

    input.value_text.erase(static_cast<size_t>(input.cursor_index - 1), 1);
    --input.cursor_index;
    return true;
}

}  // namespace

bool KeyboardController::MoveFocus(KeyboardState& state, int delta)
{
    const int key_count = static_cast<int>(KeyboardKeyCount(state.layout));
    if (key_count <= 0) {
        state.selected_key_index = 0;
        return false;
    }
    if (delta == 0) {
        return false;
    }
    ClampSelection(state);

    int row = 0;
    int column = 0;
    if (KeyboardKeyAt(state.layout, static_cast<size_t>(state.selected_key_index), &row,
                      &column) == nullptr) {
        return false;
    }
    const KeyboardLayoutSpec& layout = GetKeyboardLayout(state.layout);
    const int row_count = static_cast<int>(layout.row_count);
    const int row_keys = static_cast<int>(layout.rows[row].key_count);

    int next = state.selected_key_index;
    if (state.row_entered) {
        // Across the entered row, wrapping at its ends.
        next = KeyboardFlatIndex(state.layout, row, WrapIndex(column + delta, row_keys));
    } else {
        // Whole rows. Keep roughly the same horizontal position so entering a row lands near
        // where the previous row was entered (rows have different key counts).
        const int next_row = WrapIndex(row + delta, row_count);
        const int next_keys = static_cast<int>(layout.rows[next_row].key_count);
        const int next_column =
            row_keys <= 1 ? 0 : std::min(next_keys - 1, (column * next_keys) / row_keys);
        next = KeyboardFlatIndex(state.layout, next_row, next_column);
    }
    if (next < 0 || next == state.selected_key_index) {
        return false;
    }
    state.selected_key_index = next;
    return true;
}

bool KeyboardController::ExitRow(KeyboardState& state)
{
    if (!state.row_entered) {
        return false;
    }
    state.row_entered = false;
    return true;
}

int KeyboardController::SelectedRow(const KeyboardState& state)
{
    int row = 0;
    if (KeyboardKeyAt(state.layout, static_cast<size_t>(state.selected_key_index), &row,
                      nullptr) == nullptr) {
        return 0;
    }
    return row;
}

KeyboardActionResult KeyboardController::ActivateFocusedKey(KeyboardState& state, bool long_press)
{
    KeyboardActionResult result = {};
    ClampSelection(state);

    const KeyboardKeySpec* key =
        KeyboardKeyAt(state.layout, static_cast<size_t>(state.selected_key_index));
    if (key == nullptr) {
        return result;
    }

    if (!state.row_entered) {
        // First press picks the highlighted row; the next press types a key in it.
        state.row_entered = true;
        result.state_changed = true;
        return result;
    }
    // Switching to a layout with different rows drops back to choosing a row, since the
    // entered row no longer means the same keys. Shift keeps the same rows, so it stays.
    const KeyboardLayoutKind layout_before = state.layout;
    result = ActivateKey(state, *key, long_press);
    const bool same_rows =
        (layout_before == KeyboardLayoutKind::kLettersLower ||
         layout_before == KeyboardLayoutKind::kLettersUpper) &&
        (state.layout == KeyboardLayoutKind::kLettersLower ||
         state.layout == KeyboardLayoutKind::kLettersUpper);
    if (state.layout != layout_before && !same_rows) {
        state.row_entered = false;
        result.state_changed = true;
    }
    return result;
}

KeyboardActionResult KeyboardController::ActivateKey(KeyboardState& state,
                                                     const KeyboardKeySpec& key_spec,
                                                     bool long_press)
{
    KeyboardActionResult result = {};
    const KeyboardKeySpec* key = &key_spec;

    switch (key->kind) {
        case KeyboardKeyKind::kCharacter:
            result.text_changed = InsertText(state.input, key->output);
            result.state_changed = result.text_changed;
            if (state.layout == KeyboardLayoutKind::kLettersUpper && !state.shift_locked) {
                state.layout = KeyboardLayoutKind::kLettersLower;
                ClampSelection(state);
                result.state_changed = true;
            }
            return result;
        case KeyboardKeyKind::kShift:
            if (long_press) {
                const bool changed =
                    !state.shift_locked || state.layout != KeyboardLayoutKind::kLettersUpper;
                state.shift_locked = true;
                state.layout = KeyboardLayoutKind::kLettersUpper;
                result.state_changed = changed;
                return result;
            }
            if (state.shift_locked) {
                state.shift_locked = false;
                state.layout = KeyboardLayoutKind::kLettersLower;
                result.state_changed = true;
                return result;
            }
            state.layout = state.layout == KeyboardLayoutKind::kLettersUpper
                               ? KeyboardLayoutKind::kLettersLower
                               : KeyboardLayoutKind::kLettersUpper;
            ClampSelection(state);
            result.state_changed = true;
            return result;
        case KeyboardKeyKind::kBackspace:
            result.text_changed = Backspace(state.input);
            result.state_changed = result.text_changed;
            return result;
        case KeyboardKeyKind::kSpace:
            result.text_changed = InsertText(state.input, ' ');
            result.state_changed = result.text_changed;
            return result;
        case KeyboardKeyKind::kEnter:
            result.intent = KeyboardIntent::kSubmit;
            return result;
        case KeyboardKeyKind::kMode123:
            state.shift_locked = false;
            state.layout = KeyboardLayoutKind::kSymbols;
            ClampSelection(state);
            result.state_changed = true;
            return result;
        case KeyboardKeyKind::kModeAbc:
            state.shift_locked = false;
            state.layout = KeyboardLayoutKind::kLettersLower;
            ClampSelection(state);
            result.state_changed = true;
            return result;
        case KeyboardKeyKind::kModeMore:
            state.shift_locked = false;
            state.layout = KeyboardLayoutKind::kSymbols2;
            ClampSelection(state);
            result.state_changed = true;
            return result;
        case KeyboardKeyKind::kDismiss:
            result.intent = KeyboardIntent::kDismiss;
            return result;
    }

    return result;
}

KeyboardActionResult KeyboardController::ActivateFocusedKeyDouble(KeyboardState& state)
{
    KeyboardActionResult result = {};
    ClampSelection(state);

    const KeyboardKeySpec* key =
        KeyboardKeyAt(state.layout, static_cast<size_t>(state.selected_key_index));
    if (key == nullptr) {
        return result;
    }

    if (key->kind == KeyboardKeyKind::kShift) {
        const bool changed =
            !state.shift_locked || state.layout != KeyboardLayoutKind::kLettersUpper;
        state.shift_locked = true;
        state.layout = KeyboardLayoutKind::kLettersUpper;
        ClampSelection(state);
        result.state_changed = changed;
        return result;
    }

    result.intent = KeyboardIntent::kDismiss;
    return result;
}

void KeyboardController::ClampSelection(KeyboardState& state)
{
    const int key_count = static_cast<int>(KeyboardKeyCount(state.layout));
    if (key_count <= 0) {
        state.selected_key_index = 0;
        return;
    }
    state.selected_key_index = WrapIndex(state.selected_key_index, key_count);
    NormalizeCursor(state.input);
}

}  // namespace epaper_ui
