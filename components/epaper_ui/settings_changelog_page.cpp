#include "epaper_ui/settings_changelog_page.h"

#include <algorithm>

#include "render_utils.h"

namespace epaper_ui {
namespace {

constexpr int kMargin = design::spacing::k16;
constexpr int kContentTopGap = design::spacing::k16;
constexpr int kTitleVersionGap = design::spacing::k8;
constexpr int kVersionScrollGap = design::spacing::k16;
constexpr int kScrollButtonGap = design::spacing::k16;
constexpr int kButtonFooterGap = design::spacing::k16;
constexpr auto kTitleRole = design::TypographyRole::kHeadingH1;
constexpr auto kVersionRole = design::TypographyRole::kLabelSmall;

struct Layout {
    int title_y = 0;
    int version_y = 0;
    UiRect scroll = {};
    UiRect back = {};
};

int PageWidth(int portrait_width)
{
    return std::max(0, portrait_width - (2 * kMargin));
}

int FooterTop(int portrait_height)
{
    return portrait_height - design::global_footer::kBottomPadding -
           design::global_footer::kButtonSize;
}

Layout BuildLayout(int portrait_width, int portrait_height)
{
    const int page_width = PageWidth(portrait_width);
    Layout layout = {};
    layout.title_y = StatusBarHeight() + kContentTopGap;
    layout.version_y = layout.title_y + LineHeight(kTitleRole) + kTitleVersionGap;
    const int scroll_top = layout.version_y + LineHeight(kVersionRole) + kVersionScrollGap;
    const int button_height = design::button::kHeight;
    const int back_top =
        std::max(scroll_top, FooterTop(portrait_height) - kButtonFooterGap - button_height);
    layout.scroll = {kMargin, scroll_top, page_width,
                     std::max(0, back_top - kScrollButtonGap - scroll_top)};
    layout.back = {kMargin, back_top, page_width, button_height};
    return layout;
}

ScrollContainerStyle ScrollStyle(const UiRect& scroll)
{
    ScrollContainerStyle style = {};
    style.width = scroll.width;
    style.panel_height = scroll.height;
    // Release notes are dense; the smaller body face fits more per screen.
    style.text_role = design::TypographyRole::kLabelSmall;
    return style;
}

}  // namespace

int SettingsChangelogScrollPageStepPercent(int portrait_width,
                                           int portrait_height,
                                           const SettingsChangelogPageState& state)
{
    const Layout layout = BuildLayout(portrait_width, portrait_height);
    return ScrollContainerPageStepPercent(layout.scroll.x, layout.scroll.y, state.scroll_container,
                                          ScrollStyle(layout.scroll));
}

void DrawSettingsChangelogPage(uint8_t* framebuffer,
                               int raw_width,
                               int raw_height,
                               int portrait_width,
                               int portrait_height,
                               const SettingsChangelogPageState& state,
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

    const Layout layout = BuildLayout(portrait_width, portrait_height);
    DrawTypographyText(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
                       kMargin, layout.title_y, state.title_text, kTitleRole,
                       design::color::kBlack);
    DrawTypographyText(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
                       kMargin, layout.version_y, state.version_text, kVersionRole,
                       design::color::kTextPrimary);

    DrawScrollContainer(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
                        layout.scroll.x, layout.scroll.y, state.scroll_container,
                        ScrollStyle(layout.scroll));

    ButtonStyle back_style = {};
    back_style.width = layout.back.width;
    back_style.center_label = true;
    DrawButton(framebuffer, raw_width, raw_height, portrait_width, portrait_height, layout.back.x,
               layout.back.y, state.back, back_style);

    DrawGlobalFooter(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
                     footer_state);
}

}  // namespace epaper_ui
