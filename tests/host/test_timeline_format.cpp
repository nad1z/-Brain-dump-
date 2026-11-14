// 24-hour clock and reminder due labels (main/timeline_format).
#include <cstdio>
#include <ctime>
#include <string>

#include "check.h"
#include "fakes.h"
#include "timeline_format.h"

namespace {

// "YYYY-MM-DD" for today + day_offset, in the test timezone (UTC, set in main.cpp).
std::string DateWithOffset(int day_offset)
{
    const std::time_t stamp = std::time(nullptr) + static_cast<std::time_t>(day_offset) * 86400;
    std::tm local = {};
    localtime_r(&stamp, &local);
    char buffer[16] = {};
    std::strftime(buffer, sizeof(buffer), "%Y-%m-%d", &local);
    return buffer;
}

constexpr int64_t kNov14At1705Utc = 1794675900;  // 2026-11-14 17:05:00 UTC

}  // namespace

TEST(recording_time_follows_the_12_or_24_hour_setting)
{
    host_test::SetUse24HourClock(false);
    CHECK_EQ(timeline_format::FormatTimeLabel(true, kNov14At1705Utc), std::string("5:05 PM"));
    host_test::SetUse24HourClock(true);
    CHECK_EQ(timeline_format::FormatTimeLabel(true, kNov14At1705Utc), std::string("17:05"));
    CHECK_EQ(timeline_format::FormatTimeLabel(false, kNov14At1705Utc), std::string("--:--"));
    host_test::SetUse24HourClock(false);
}

TEST(due_label_names_today_and_tomorrow)
{
    host_test::SetUse24HourClock(true);
    CHECK_EQ(timeline_format::FormatDueLabel(DateWithOffset(0)), std::string("Today"));
    CHECK_EQ(timeline_format::FormatDueLabel(DateWithOffset(1)), std::string("Tomorrow"));
    CHECK_EQ(timeline_format::FormatDueLabel(DateWithOffset(1) + "T09:30"),
             std::string("Tomorrow 09:30"));
    host_test::SetUse24HourClock(false);
    CHECK_EQ(timeline_format::FormatDueLabel(DateWithOffset(1) + "T09:30"),
             std::string("Tomorrow 9:30 AM"));
    CHECK_EQ(timeline_format::FormatDueLabel(DateWithOffset(1) + "T00:05"),
             std::string("Tomorrow 12:05 AM"));
    CHECK_EQ(timeline_format::FormatDueLabel(DateWithOffset(1) + "T15:00"),
             std::string("Tomorrow 3:00 PM"));
}

TEST(due_label_marks_past_dates_overdue)
{
    CHECK_EQ(timeline_format::FormatDueLabel(DateWithOffset(-1)), std::string("Overdue"));
    CHECK_EQ(timeline_format::FormatDueLabel("2020-01-01T10:00"), std::string("Overdue"));
}

TEST(due_label_shows_the_date_for_later_days)
{
    host_test::SetUse24HourClock(true);
    const std::string label = timeline_format::FormatDueLabel(DateWithOffset(5) + "T14:00");
    CHECK(label.size() > 6);
    CHECK(label.find("14:00") != std::string::npos);
    CHECK(label.find("Today") == std::string::npos && label.find("Tomorrow") == std::string::npos);
    host_test::SetUse24HourClock(false);
}

TEST(due_label_rejects_malformed_values)
{
    CHECK(timeline_format::FormatDueLabel("").empty());
    CHECK(timeline_format::FormatDueLabel("soon").empty());
    CHECK(timeline_format::FormatDueLabel("2026-13-40").empty());
    CHECK(timeline_format::FormatDueLabel("2026-11-15T25:00").empty());
}

TEST(due_badge_is_short_for_the_tag_pill)
{
    CHECK_EQ(timeline_format::FormatDueBadge(DateWithOffset(0) + "T23:59"), std::string("Today"));
    CHECK_EQ(timeline_format::FormatDueBadge(DateWithOffset(1) + "T09:30"), std::string("Tomorrow"));
    CHECK_EQ(timeline_format::FormatDueBadge(DateWithOffset(-2)), std::string("Overdue"));
    const std::string later = timeline_format::FormatDueBadge(DateWithOffset(5) + "T14:00");
    CHECK(later.size() >= 5 && later.size() <= 6);  // "Nov 19" / "Dec 3"
    CHECK(later.find(':') == std::string::npos);
    CHECK(timeline_format::FormatDueBadge("").empty());
}

TEST(tag_pill_shows_due_only_for_pending_tasks)
{
    using recording_archive_service::RecordingTag;
    const std::string tomorrow = DateWithOffset(1);
    CHECK_EQ(timeline_format::TagOrDueText(RecordingTag::kTask, false, tomorrow), std::string("Tomorrow"));
    CHECK_EQ(timeline_format::TagOrDueText(RecordingTag::kTask, true, tomorrow), std::string("Task"));
    CHECK_EQ(timeline_format::TagOrDueText(RecordingTag::kTask, false, ""), std::string("Task"));
    CHECK_EQ(timeline_format::TagOrDueText(RecordingTag::kNote, false, tomorrow), std::string("Note"));
}

TEST(row_text_prefers_the_title)
{
    CHECK_EQ(timeline_format::RowText("Call the bank", "remind me to call the bank", "Audio only."),
             std::string("Call the bank"));
    CHECK_EQ(timeline_format::RowText("  ", " remind me ", "Audio only."), std::string("remind me"));
    CHECK_EQ(timeline_format::RowText("", "", "Audio only."), std::string("Audio only."));
}

TEST(details_preamble_lists_title_and_due)
{
    host_test::SetUse24HourClock(true);
    CHECK_EQ(timeline_format::DetailsPreamble("Call the bank", DateWithOffset(1) + "T09:30"),
             std::string("Call the bank\nDue: Tomorrow 09:30\n\n"));
    CHECK_EQ(timeline_format::DetailsPreamble("", DateWithOffset(-1)), std::string("Overdue\n\n"));
    CHECK_EQ(timeline_format::DetailsPreamble("Idea", ""), std::string("Idea\n\n"));
    CHECK(timeline_format::DetailsPreamble("", "").empty());
    host_test::SetUse24HourClock(false);
}
