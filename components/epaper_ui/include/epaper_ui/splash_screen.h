#ifndef EPAPER_UI_SPLASH_SCREEN_H_
#define EPAPER_UI_SPLASH_SCREEN_H_

#include <cstdint>

namespace epaper_ui {

// Boot splash: the Brain Dump mark, then a "Based on" block crediting the projects this
// firmware is forked from -- Chroninkle, and Followup by ALXV Labs before it. Draws onto a
// framebuffer the caller has already cleared to white.
void DrawSplashScreen(uint8_t* framebuffer,
                      int raw_width,
                      int raw_height,
                      int portrait_width,
                      int portrait_height);

}  // namespace epaper_ui

#endif  // EPAPER_UI_SPLASH_SCREEN_H_
