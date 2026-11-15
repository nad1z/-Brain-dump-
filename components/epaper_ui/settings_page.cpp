#include "epaper_ui/settings_page.h"

#include <algorithm>
#include <array>

#include "render_utils.h"

namespace epaper_ui {
namespace {

constexpr auto kTitleRole = design::TypographyRole::kHeadingH1;
constexpr int kSideInset = design::spacing::k16;
constexpr int kTopGap = design::spacing::k16;
constexpr int kTitleBottomGap = design::spacing::k24;
constexpr int kMenuManualGap = design::spacing::k24;

constexpr std::array<const char*, kSettingsMenuItemCount> kSettingsMenuLabels = {
    "Network", "Time", "Storage", "Todos", "Topics", "About",
};

int PageWidth(int portrait_width)
{
    return std::max(0, portrait_width - (2 * kSideInset));
}

MenuContainerState MenuState(const SettingsPageState& state)
{
    return {state.menu.selected_index, kSettingsMenuItemCount};
}

MenuContainerStyle MenuStyle(int width)
{
    MenuContainerStyle style = {};
    style.direction = MenuContainerDirection::kVertical;
    style.sizing = MenuContainerSizing::kFixedItemExtent;
    style.width = width;
    style.item_height = design::menu_item::kHeight;
    style.item_gap = 0;
    return style;
}

struct Layout {
    int menu_y = 0;
    UiRect silent_toggle = {};
    UiRect manual_button = {};
};

Layout BuildLayout(int portrait_width, int portrait_height, const SettingsPageState& state)
{
    (void)portrait_height;
    const int page_width = PageWidth(portrait_width);
    const int title_y = StatusBarHeight() + kTopGap;
    const int title_bottom = title_y + LineHeight(kTitleRole);

    Layout layout = {};
    layout.menu_y = title_bottom + kTitleBottomGap;

    const UiRect menu_bounds =
        MenuContainerBounds(kSideInset, layout.menu_y, MenuState(state), MenuStyle(page_width));

    ButtonStyle manual_style = {};
    manual_style.width = page_width;
    manual_style.center_label = true;
    MenuToggleStyle silent_style = {};
    silent_style.width = page_width;
    silent_style.bottom_border_thickness = 0;
    layout.silent_toggle = MenuToggleBounds(kSideInset, menu_bounds.bottom(), silent_style);
    layout.manual_button = ButtonBounds(kSideInset, layout.silent_toggle.bottom() + kMenuManualGap,
                                        state.manual_button, manual_style);
    return layout;
}

}  // namespace

const char* SettingsMenuItemLabel(int index)
{
    if (index < 0 || index >= kSettingsMenuItemCount) {
        return "";
    }
    return kSettingsMenuLabels[static_cast<size_t>(index)];
}

UiRect SettingsMenuItemBounds(int portrait_width,
                              int portrait_height,
                              const SettingsPageState& state,
                              int index)
{
    if (index < 0 || index >= kSettingsMenuItemCount) {
        return {};
    }
    const Layout layout = BuildLayout(portrait_width, portrait_height, state);
    return MenuContainerItemBounds(kSideInset, layout.menu_y, MenuState(state),
                                   MenuStyle(PageWidth(portrait_width)), index);
}

bool HitTestSettingsMenuItem(int portrait_width,
                             int portrait_height,
                             const SettingsPageState& state,
                             int x,
                             int y,
                             int* index)
{
    if (index != nullptr) {
        *index = -1;
    }
    for (int candidate = 0; candidate < kSettingsMenuItemCount; ++candidate) {
        const UiRect bounds =
            SettingsMenuItemBounds(portrait_width, portrait_height, state, candidate);
        if (!bounds.IsEmpty() && bounds.Contains(x, y)) {
            if (index != nullptr) {
                *index = candidate;
            }
            return true;
        }
    }
    return false;
}

UiRect SettingsSilentToggleBounds(int portrait_width,
                                  int portrait_height,
                                  const SettingsPageState& state)
{
    return BuildLayout(portrait_width, portrait_height, state).silent_toggle;
}

UiRect SettingsManualButtonBounds(int portrait_width,
                                  int portrait_height,
                                  const SettingsPageState& state)
{
    return BuildLayout(portrait_width, portrait_height, state).manual_button;
}

bool HitTestSettingsManualButton(int portrait_width,
                                 int portrait_height,
                                 const SettingsPageState& state,
                                 int x,
                                 int y)
{
    const UiRect bounds = SettingsManualButtonBounds(portrait_width, portrait_height, state);
    return !bounds.IsEmpty() && bounds.Contains(x, y);
}

void DrawSettingsPage(uint8_t* framebuffer,
                      int raw_width,
                      int raw_height,
                      int portrait_width,
                      int portrait_height,
                      const SettingsPageState& state,
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

    const int page_width = PageWidth(portrait_width);
    const Layout layout = BuildLayout(portrait_width, portrait_height, state);
    const int title_x = kSideInset;
    const int title_y = StatusBarHeight() + kTopGap;
    DrawTypographyText(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
                       title_x, title_y, state.title_text, kTitleRole, design::color::kBlack);

    for (int index = 0; index < kSettingsMenuItemCount; ++index) {
        const UiRect bounds = MenuContainerItemBounds(kSideInset, layout.menu_y, MenuState(state),
                                                       MenuStyle(page_width), index);
        MenuItemState item = {};
        item.label_text = SettingsMenuItemLabel(index);
        item.selected = index == state.menu.selected_index;

        MenuItemStyle item_style = {};
        item_style.width = bounds.width;
        item_style.height = bounds.height;
        DrawMenuItem(framebuffer, raw_width, raw_height, portrait_width, portrait_height, bounds.x,
                    bounds.y, item, item_style);
    }

    MenuToggleStyle silent_style = {};
    silent_style.width = layout.silent_toggle.width;
    silent_style.bottom_border_thickness = 0;
    // Same type and inset as the menu rows above, so the switch reads as part of the list.
    silent_style.role = design::TypographyRole::kLabelXL;
    silent_style.horizontal_padding = design::menu_item::kHorizontalPadding;
    DrawMenuToggle(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
                   layout.silent_toggle.x, layout.silent_toggle.y, state.silent_toggle,
                   silent_style);

    ButtonStyle manual_style = {};
    manual_style.width = layout.manual_button.width;
    manual_style.center_label = true;
    DrawButton(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
              layout.manual_button.x, layout.manual_button.y, state.manual_button, manual_style);

    DrawGlobalFooter(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
                     footer_state);
}

}  // namespace epaper_ui
