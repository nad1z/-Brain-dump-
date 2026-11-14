// Desktop preview: renders epaper_ui pages into the same 1-bit framebuffer the panel uses and
// writes them out as portrait PGM images. No device, no ESP-IDF -- epaper_ui is plain C++17.
// Build + run via tools/preview/render.sh.
#include <cstdint>
#include <cstdio>
#include <string>
#include <vector>

#include "epaper_ui/details_page.h"
#include "epaper_ui/status_bar.h"
#include "epaper_ui/time_page.h"

namespace {

constexpr int kRawWidth = 800;
constexpr int kRawHeight = 480;
constexpr int kPortraitWidth = 480;
constexpr int kPortraitHeight = 800;

std::vector<uint8_t> BlankFrame()
{
    return std::vector<uint8_t>(static_cast<size_t>(kRawWidth / 8) * kRawHeight, 0xFF);
}

// Same mapping as render_utils' DrawPortraitPixel: raw_x = y, raw_y = raw_height - 1 - x.
bool WritePortraitPgm(const std::vector<uint8_t>& frame, const std::string& path)
{
    std::FILE* file = std::fopen(path.c_str(), "wb");
    if (file == nullptr) {
        return false;
    }
    std::fprintf(file, "P5\n%d %d\n255\n", kPortraitWidth, kPortraitHeight);
    for (int y = 0; y < kPortraitHeight; ++y) {
        for (int x = 0; x < kPortraitWidth; ++x) {
            const int raw_x = y;
            const int raw_y = kRawHeight - 1 - x;
            const uint8_t byte = frame[static_cast<size_t>(raw_y) * (kRawWidth / 8) + raw_x / 8];
            const bool white = (byte & (0x80U >> (raw_x & 7))) != 0;
            std::fputc(white ? 0xF2 : 0x18, file);
        }
    }
    std::fclose(file);
    return true;
}

epaper_ui::StatusBarState StatusBar(const std::string& time_text)
{
    epaper_ui::StatusBarState state = {};
    state.wifi = epaper_ui::WifiStatus::kConnected;
    state.time_text = time_text;
    state.show_gemini_icon = true;
    return state;
}

void RenderTimePage(const std::string& out_dir, const std::string& name, const std::string& hour,
                    const std::string& meridiem_label, const std::string& status_time)
{
    epaper_ui::TimePageState state = {};
    state.navigation_focus_index = 3;
    state.timezone.label_text = "Timezone";
    state.timezone.placeholder_text = "Select timezone";
    state.timezone.value_text = "Asia/Jerusalem";
    state.hour.value_text = hour;
    state.hour.suffix_text = "HR";
    state.hour.max_length = 2;
    state.minute.value_text = "05";
    state.minute.suffix_text = "MIN";
    state.minute.max_length = 2;
    state.meridiem.label_text = meridiem_label;
    state.meridiem.selected = true;
    state.month.value_text = "11";
    state.month.max_length = 2;
    state.day.value_text = "14";
    state.day.max_length = 2;
    state.year.value_text = "2026";
    state.year.max_length = 4;
    state.save.label_text = "Sync & Save";
    state.back.label_text = "Back";

    std::vector<uint8_t> frame = BlankFrame();
    epaper_ui::DrawTimePage(frame.data(), kRawWidth, kRawHeight, kPortraitWidth, kPortraitHeight,
                            state, StatusBar(status_time), epaper_ui::GlobalFooterState{});
    const std::string path = out_dir + "/" + name + ".pgm";
    std::printf("%s %s\n", WritePortraitPgm(frame, path) ? "wrote" : "FAILED", path.c_str());
}

// A recording's Details page with a transcript: `transcript` is UTF-8, as stored on the SD card.
void RenderDetailsPage(const std::string& out_dir, const std::string& name,
                       const std::string& transcript)
{
    epaper_ui::DetailsPageState state = {};
    state.recording_header.time_text = "17:05";
    state.recording_header.minute_seconds_text = "42s";
    state.recording_header.tag_text = "Idea";
    state.scroll_container.content_text = transcript;
    state.edit_topics_button.label_text = "Edit topics";
    state.back_button.label_text = "Back";
    state.back_button.selected = true;

    std::vector<uint8_t> frame = BlankFrame();
    epaper_ui::DrawDetailsPage(frame.data(), kRawWidth, kRawHeight, kPortraitWidth,
                               kPortraitHeight, state, StatusBar("17:05"),
                               epaper_ui::GlobalFooterState{});
    const std::string path = out_dir + "/" + name + ".pgm";
    std::printf("%s %s\n", WritePortraitPgm(frame, path) ? "wrote" : "FAILED", path.c_str());
}

}  // namespace

int main(int argc, char** argv)
{
    const std::string out_dir = argc > 1 ? argv[1] : ".";
    RenderTimePage(out_dir, "time_page_12h", "05", "PM", "5:05 PM");
    RenderTimePage(out_dir, "time_page_24h", "17", "24H", "17:05");
    RenderDetailsPage(out_dir, "details_english",
                      "Idea for the brain dump device: sync reminders to the calendar, and keep "
                      "the radio off until there is something to send.");
    RenderDetailsPage(
        out_dir, "details_hebrew",
        "רעיון למכשיר: לסנכרן תזכורות ליומן של Google, ולהשאיר את ה-WiFi כבוי עד שיש מה "
        "לשלוח.\nלהתקשר לבנק מחר ב-09:30 (חשוב!) ולשלם 1,250 שקל.\nPlain English line in the "
        "middle.\nלקנות חלב, לחם וביצים.");
    return 0;
}
