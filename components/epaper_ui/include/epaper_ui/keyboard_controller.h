#ifndef EPAPER_UI_KEYBOARD_CONTROLLER_H_
#define EPAPER_UI_KEYBOARD_CONTROLLER_H_

#include "epaper_ui/keyboard.h"
#include "epaper_ui/keyboard_layout.h"

namespace epaper_ui {

enum class KeyboardIntent : uint8_t {
    kNone = 0,
    kSubmit,
    kDismiss,
};

struct KeyboardActionResult {
    bool text_changed = false;
    bool state_changed = false;
    KeyboardIntent intent = KeyboardIntent::kNone;
};

class KeyboardController {
public:
    static bool MoveFocus(KeyboardState& state, int delta);
    static KeyboardActionResult ActivateFocusedKey(KeyboardState& state, bool long_press);
    static KeyboardActionResult ActivateFocusedKeyDouble(KeyboardState& state);
    static void ClampSelection(KeyboardState& state);

private:
    // Types/acts on `key` (the old single-step ActivateFocusedKey body).
    static KeyboardActionResult ActivateKey(KeyboardState& state,
                                            const KeyboardKeySpec& key,
                                            bool long_press);

public:
    // Back from an entered row to row selection. Returns false when no row was entered, so the
    // caller can treat Back as "close the keyboard".
    static bool ExitRow(KeyboardState& state);
    // Row of the selected key (also the highlighted row while choosing rows).
    static int SelectedRow(const KeyboardState& state);
};

}  // namespace epaper_ui

#endif  // EPAPER_UI_KEYBOARD_CONTROLLER_H_
