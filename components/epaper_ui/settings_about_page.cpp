#include "epaper_ui/settings_about_page.h"

#include <algorithm>
#include <string>
#include <vector>

#include "render_utils.h"

namespace epaper_ui {
namespace {

constexpr auto kTitleRole = design::TypographyRole::kHeadingH1;
constexpr auto kVersionRole = design::TypographyRole::kLabelLarge;
constexpr auto kBodyRole = design::TypographyRole::kBody;
constexpr int kSideInset = design::spacing::k16;
constexpr int kTopGap = design::spacing::k24;
constexpr int kHeadingBottomPadding = design::spacing::k24;
constexpr int kVersionBodyGap = design::spacing::k24;
constexpr int kBodyLineGap = design::spacing::k4;
constexpr int kBackButtonGap = design::spacing::k24;
constexpr int kVersionStatusGap = design::spacing::k8;
constexpr int kStatusButtonGap = design::spacing::k12;

struct Layout {
    int page_width = 0;
    int version_y = 0;
    int status_y = 0;
    int body_y = 0;
    UiRect update = {};
    UiRect back = {};
};

ButtonState UpdateButtonState(const SettingsAboutPageState& state)
{
    return {
        .label_text = state.update_button_label,
        .selected = state.update_button_selected,
    };
}

std::vector<std::string> StatusLines(const SettingsAboutPageState& state, int page_width)
{
    if (state.update_status_text.empty()) {
        return {};
    }
    return WrapTextToWidth(kBodyRole, state.update_status_text, page_width);
}

Layout BuildLayout(int portrait_width, int portrait_height, const SettingsAboutPageState& state)
{
    (void)portrait_height;
    const int page_x = kSideInset;
    const int page_width = std::max(0, portrait_width - (2 * kSideInset));
    const int title_y = StatusBarHeight() + kTopGap;
    const int title_bottom = title_y + LineHeight(kTitleRole);

    Layout layout = {};
    layout.page_width = page_width;
    layout.version_y = title_bottom + kHeadingBottomPadding;
    const int version_bottom = layout.version_y + LineHeight(kVersionRole);

    layout.status_y = version_bottom + kVersionStatusGap;
    const std::vector<std::string> status_lines = StatusLines(state, page_width);
    const int status_height =
        static_cast<int>(status_lines.size()) * (LineHeight(kBodyRole) + kBodyLineGap);
    const int update_y = layout.status_y + status_height +
                         (status_lines.empty() ? kVersionBodyGap - kVersionStatusGap
                                               : kStatusButtonGap);
    ButtonStyle update_style = {};
    update_style.width = page_width;
    update_style.center_label = true;
    layout.update = ButtonBounds(page_x, update_y, UpdateButtonState(state), update_style);
    layout.body_y = layout.update.y + layout.update.height + kVersionBodyGap;

    const std::vector<std::string> body_lines =
        WrapTextToWidth(kBodyRole, std::string(state.acknowledgment_text), page_width);
    const int body_height =
        static_cast<int>(body_lines.size()) * (LineHeight(kBodyRole) + kBodyLineGap);
    const int body_bottom = layout.body_y + body_height;

    ButtonStyle back_style = {};
    back_style.width = page_width;
    back_style.center_label = true;
    layout.back = ButtonBounds(page_x, body_bottom + kBackButtonGap, state.back, back_style);

    return layout;
}

}  // namespace

UiRect SettingsAboutPageItemBounds(int portrait_width,
                                   int portrait_height,
                                   const SettingsAboutPageState& state,
                                   SettingsAboutPageItemId item)
{
    const Layout layout = BuildLayout(portrait_width, portrait_height, state);
    switch (item) {
        case SettingsAboutPageItemId::kUpdate:
            return layout.update;
        case SettingsAboutPageItemId::kBack:
            return layout.back;
        case SettingsAboutPageItemId::kNone:
        default:
            return {};
    }
}

bool HitTestSettingsAboutPageItem(int portrait_width,
                                  int portrait_height,
                                  const SettingsAboutPageState& state,
                                  int x,
                                  int y,
                                  SettingsAboutPageItemId* item)
{
    if (item != nullptr) {
        *item = SettingsAboutPageItemId::kNone;
    }

    for (const SettingsAboutPageItemId candidate :
         {SettingsAboutPageItemId::kUpdate, SettingsAboutPageItemId::kBack}) {
        const UiRect bounds =
            SettingsAboutPageItemBounds(portrait_width, portrait_height, state, candidate);
        if (!bounds.IsEmpty() && bounds.Contains(x, y)) {
            if (item != nullptr) {
                *item = candidate;
            }
            return true;
        }
    }
    return false;
}

void DrawSettingsAboutPage(uint8_t* framebuffer,
                           int raw_width,
                           int raw_height,
                           int portrait_width,
                           int portrait_height,
                           const SettingsAboutPageState& state,
                           const StatusBarState& status_bar_state,
                           const GlobalFooterState& footer_state)
{
    if (framebuffer == nullptr) {
        return;
    }

    FillPortraitRect(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
                     {0, 0, portrait_width, portrait_height}, design::color::kWhite);
    DrawStatusBar(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
                  status_bar_state);

    const Layout layout = BuildLayout(portrait_width, portrait_height, state);
    const int title_x = kSideInset;
    const int title_y = StatusBarHeight() + kTopGap;
    DrawTypographyText(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
                       title_x, title_y, state.title_text, kTitleRole, design::color::kBlack);

    DrawTypographyText(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
                       kSideInset, layout.version_y, state.version_text, kVersionRole,
                       design::color::kTextPrimary);

    const int body_line_height = LineHeight(kBodyRole);
    int cursor_y = layout.status_y;
    for (const std::string& line : StatusLines(state, layout.page_width)) {
        DrawTypographyText(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
                           kSideInset, cursor_y, line, kBodyRole, design::color::kTextPrimary);
        cursor_y += body_line_height + kBodyLineGap;
    }

    DrawButton(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
               layout.update.x, layout.update.y, UpdateButtonState(state),
               {.width = layout.update.width, .center_label = true});

    const std::vector<std::string> body_lines =
        WrapTextToWidth(kBodyRole, std::string(state.acknowledgment_text), layout.page_width);
    cursor_y = layout.body_y;
    for (const std::string& line : body_lines) {
        DrawTypographyText(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
                           kSideInset, cursor_y, line, kBodyRole, design::color::kTextPrimary);
        cursor_y += body_line_height + kBodyLineGap;
    }

    DrawButton(framebuffer, raw_width, raw_height, portrait_width, portrait_height, layout.back.x,
              layout.back.y, state.back, {.width = layout.back.width, .center_label = true});

    DrawGlobalFooter(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
                     footer_state);
}

}  // namespace epaper_ui
