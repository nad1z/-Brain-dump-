#include "epaper_ui/time_input.h"

#include "render_utils.h"

namespace epaper_ui {
namespace {

TextInputState ToTextInput(const TimeInputState& state)
{
    TextInputState text = {};
    text.placeholder_text = state.placeholder_text;
    text.value_text = state.value_text;
    text.suffix_text = state.suffix_text;
    text.focused = state.focused;
    text.active = state.active;
    text.show_cursor = state.show_cursor;
    text.cursor_index = state.cursor_index;
    text.max_length = state.max_length;
    text.mask = false;
    text.has_trailing_icon = false;
    return text;
}

}  // namespace

UiRect TimeInputBounds(int origin_x,
                       int origin_y,
                       const TimeInputState& state,
                       const TextInputStyle& style)
{
    return TextInputBounds(origin_x, origin_y, ToTextInput(state), style);
}

UiRect TimeInputVisualBounds(int origin_x,
                             int origin_y,
                             const TimeInputState& state,
                             const TextInputStyle& style)
{
    return TextInputVisualBounds(origin_x, origin_y, ToTextInput(state), style);
}

KeyboardInputState TimeInputToKeyboardInput(const TimeInputState& state)
{
    return TextInputToKeyboardInput(ToTextInput(state));
}

void ApplyKeyboardInputToTimeInput(TimeInputState* state, const KeyboardInputState& input_state)
{
    if (state == nullptr) {
        return;
    }
    state->value_text = input_state.value_text;
    state->placeholder_text = input_state.placeholder_text;
    state->focused = input_state.focused;
    state->active = input_state.active;
    state->show_cursor = input_state.show_cursor;
    state->cursor_index = input_state.cursor_index;
    state->max_length = input_state.max_length;
}

void DrawTimeInput(uint8_t* framebuffer,
                   int raw_width,
                   int raw_height,
                   int portrait_width,
                   int portrait_height,
                   int origin_x,
                   int origin_y,
                   const TimeInputState& state,
                   const TextInputStyle& style)
{
    // While the field is being changed with the rocker (state.active), draw it inverted -- white
    // digits on black -- with small up/down markers, so it reads as "tilt to change" rather than
    // as a text field waiting for a keyboard.
    TextInputStyle draw_style = style;
    if (state.active) {
        draw_style.background_color = design::color::kBlack;
        draw_style.text_color = design::color::kWhite;
        draw_style.placeholder_color = design::color::kWhite;
    }
    DrawTextInput(framebuffer,
                  raw_width,
                  raw_height,
                  portrait_width,
                  portrait_height,
                  origin_x,
                  origin_y,
                  ToTextInput(state),
                  draw_style);
    if (!state.active) {
        return;
    }

    const UiRect field = TextInputFieldBounds(origin_x, origin_y, ToTextInput(state), style);
    constexpr int kMarkerHalfWidth = 5;
    constexpr int kMarkerHeight = 5;
    constexpr int kMarkerInset = 4;
    const int center_x = field.x + (field.width / 2);
    // Up marker along the top edge, down marker along the bottom edge, each a small triangle
    // drawn one row at a time.
    for (int row = 0; row < kMarkerHeight; ++row) {
        const int half = (row * kMarkerHalfWidth) / (kMarkerHeight - 1);
        const UiRect up_row = {center_x - half, field.y + kMarkerInset + row, (2 * half) + 1, 1};
        const UiRect down_row = {center_x - half, field.bottom() - kMarkerInset - row - 1,
                                 (2 * half) + 1, 1};
        FillPortraitRect(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
                         up_row, design::color::kWhite);
        FillPortraitRect(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
                         down_row, design::color::kWhite);
    }
}

}  // namespace epaper_ui
