#include "epaper_ui/splash_screen.h"

#include <string_view>

#include "design_tokens.h"
#include "project_assets.h"
#include "render_utils.h"

namespace epaper_ui {
namespace {

constexpr int kLogoGap = design::spacing::k16;
constexpr int kAttributionGap = design::spacing::k8;
constexpr int kBottomMargin = design::spacing::k48;
constexpr std::string_view kAttributionLabel = "Based on";
constexpr auto kLabelRole = design::TypographyRole::kLabelSmall;

}  // namespace

void DrawSplashScreen(uint8_t* framebuffer,
                      int raw_width,
                      int raw_height,
                      int portrait_width,
                      int portrait_height)
{
    const EmbeddedImageAsset* hero_logo =
        project_assets::GetLogo(EmbeddedLogoId::kBrainDumpLogoStacked);
    const EmbeddedImageAsset* chroninkle_logo =
        project_assets::GetLogo(EmbeddedLogoId::kChroninkleLogo);
    const EmbeddedImageAsset* followup_logo = project_assets::GetLogo(EmbeddedLogoId::kFollowupLogo);
    const EmbeddedImageAsset* alxv_logo = project_assets::GetLogo(EmbeddedLogoId::kAlxvLabsLogo);
    if (framebuffer == nullptr || hero_logo == nullptr || chroninkle_logo == nullptr ||
        followup_logo == nullptr || alxv_logo == nullptr) {
        return;
    }

    const auto draw_centered = [&](const EmbeddedImageAsset* asset, int y) {
        DrawPortraitMonoAsset(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
                              (portrait_width - static_cast<int>(asset->width)) / 2, y, asset,
                              design::color::kBlack);
    };

    // Attribution block, bottom-up from the margin: ALXV Labs, Followup, Chroninkle, label.
    const int alxv_y = portrait_height - kBottomMargin - static_cast<int>(alxv_logo->height);
    const int followup_y = alxv_y - kLogoGap - static_cast<int>(followup_logo->height);
    const int chroninkle_y = followup_y - kLogoGap - static_cast<int>(chroninkle_logo->height);
    const int label_y = chroninkle_y - kAttributionGap - LineHeight(kLabelRole);
    const int label_x = (portrait_width - MeasureText(kLabelRole, kAttributionLabel)) / 2;

    // The Brain Dump mark gets the rest of the screen, centred above the attribution block.
    draw_centered(hero_logo, (label_y - static_cast<int>(hero_logo->height)) / 2);

    DrawTypographyText(framebuffer, raw_width, raw_height, portrait_width, portrait_height, label_x,
                       label_y, kAttributionLabel, kLabelRole, design::color::kBlack);
    draw_centered(chroninkle_logo, chroninkle_y);
    draw_centered(followup_logo, followup_y);
    draw_centered(alxv_logo, alxv_y);
}

}  // namespace epaper_ui
