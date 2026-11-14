// Row-first on-screen keyboard (components/epaper_ui/keyboard_controller): UP/DOWN pick a row,
// Select enters it, UP/DOWN move across its keys, Select types, Back leaves the row.
#include <string>

#include "check.h"
#include "epaper_ui/keyboard_controller.h"

namespace {

using epaper_ui::KeyboardController;
using epaper_ui::KeyboardLayoutKind;
using epaper_ui::KeyboardState;

KeyboardState FreshLetters()
{
    KeyboardState state = {};
    state.visible = true;
    state.layout = KeyboardLayoutKind::kLettersLower;
    state.input.max_length = 32;
    return state;
}

}  // namespace

TEST(keyboard_starts_choosing_rows)
{
    KeyboardState state = FreshLetters();
    CHECK(!state.row_entered);
    CHECK_EQ(KeyboardController::SelectedRow(state), 0);
    CHECK(KeyboardController::MoveFocus(state, 1));
    CHECK_EQ(KeyboardController::SelectedRow(state), 1);
    CHECK(KeyboardController::MoveFocus(state, -1));
    CHECK(KeyboardController::MoveFocus(state, -1));  // wraps to the bottom row
    CHECK_EQ(KeyboardController::SelectedRow(state), 3);
}

TEST(keyboard_first_select_enters_row_without_typing)
{
    KeyboardState state = FreshLetters();
    const epaper_ui::KeyboardActionResult result =
        KeyboardController::ActivateFocusedKey(state, false);
    CHECK(state.row_entered);
    CHECK(!result.text_changed);
    CHECK_EQ(state.input.value_text, std::string(""));
}

TEST(keyboard_types_m_in_six_presses)
{
    KeyboardState state = FreshLetters();
    KeyboardController::MoveFocus(state, 1);   // row a..l
    KeyboardController::MoveFocus(state, 1);   // row Shift z..m Bksp
    KeyboardController::ActivateFocusedKey(state, false);  // enter row, on Shift
    KeyboardController::MoveFocus(state, -1);  // wraps to Bksp
    KeyboardController::MoveFocus(state, -1);  // m
    KeyboardController::ActivateFocusedKey(state, false);
    CHECK_EQ(state.input.value_text, std::string("m"));
    CHECK(state.row_entered);  // stays in the row for the next letter
}

TEST(keyboard_moves_inside_entered_row_only)
{
    KeyboardState state = FreshLetters();
    KeyboardController::ActivateFocusedKey(state, false);  // enter q..p
    for (int i = 0; i < 12; ++i) {
        KeyboardController::MoveFocus(state, 1);
        CHECK_EQ(KeyboardController::SelectedRow(state), 0);
    }
    KeyboardController::ActivateFocusedKey(state, false);  // 12 steps on a 10-key row: 'e'
    CHECK_EQ(state.input.value_text, std::string("e"));
}

TEST(keyboard_back_leaves_row_then_reports_nothing_to_leave)
{
    KeyboardState state = FreshLetters();
    KeyboardController::ActivateFocusedKey(state, false);
    CHECK(KeyboardController::ExitRow(state));
    CHECK(!state.row_entered);
    CHECK(!KeyboardController::ExitRow(state));  // caller closes the keyboard instead
}

TEST(keyboard_layout_switch_returns_to_row_choice)
{
    KeyboardState state = FreshLetters();
    KeyboardController::MoveFocus(state, -1);              // bottom row: 123 Space Done
    KeyboardController::ActivateFocusedKey(state, false);  // enter it, on "123"
    KeyboardController::ActivateFocusedKey(state, false);  // switch to symbols
    CHECK(state.layout == KeyboardLayoutKind::kSymbols);
    CHECK(!state.row_entered);
}

TEST(keyboard_shift_keeps_the_row_entered)
{
    KeyboardState state = FreshLetters();
    KeyboardController::MoveFocus(state, 1);
    KeyboardController::MoveFocus(state, 1);
    KeyboardController::ActivateFocusedKey(state, false);  // enter, on Shift
    KeyboardController::ActivateFocusedKey(state, false);  // Shift
    CHECK(state.layout == KeyboardLayoutKind::kLettersUpper);
    CHECK(state.row_entered);
    KeyboardController::MoveFocus(state, 1);  // Z
    KeyboardController::ActivateFocusedKey(state, false);
    CHECK_EQ(state.input.value_text, std::string("Z"));
}
