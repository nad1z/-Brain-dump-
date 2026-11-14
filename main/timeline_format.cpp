#include "timeline_format.h"

#include <cstdio>
#include <ctime>

#include "timezone_service.h"

namespace timeline_format {

using recording_archive_service::RecordingTag;

std::string DateKey(const std::string& created_local_date)
{
    const auto space = created_local_date.find(' ');
    return space == std::string::npos ? created_local_date : created_local_date.substr(0, space);
}

std::string FormatDateLabel(const std::string& created_local_date)
{
    const std::string day_key = DateKey(created_local_date);

    // "Today" only while the recording's day equals the current local date. GetSnapshot().current_date
    // is the live "YYYY-MM-DD", so this stops reading "Today" as soon as the date rolls over.
    if (!day_key.empty() &&
        day_key == timezone_service::GetSnapshot().runtime.current_date) {
        return "Today";
    }

    int year = 0;
    int month = 0;
    int day = 0;
    if (std::sscanf(day_key.c_str(), "%d-%d-%d", &year, &month, &day) == 3) {
        std::tm tm = {};
        tm.tm_year = year - 1900;
        tm.tm_mon = month - 1;
        tm.tm_mday = day;
        std::time_t stamp = std::mktime(&tm);
        if (stamp != static_cast<std::time_t>(-1)) {
            std::tm local = {};
            localtime_r(&stamp, &local);
            char buffer[24] = {};
            if (std::strftime(buffer, sizeof(buffer), "%a %b %d", &local) > 0) {
                return buffer;
            }
        }
    }
    return created_local_date.empty() ? "Today" : created_local_date;
}

std::string FormatTimeLabel(bool time_valid, int64_t created_unix_seconds)
{
    if (time_valid && created_unix_seconds > 0) {
        std::time_t stamp = static_cast<std::time_t>(created_unix_seconds);
        std::tm local = {};
        localtime_r(&stamp, &local);
        char buffer[16] = {};
        if (timezone_service::Use24HourClock()) {
            if (std::strftime(buffer, sizeof(buffer), "%H:%M", &local) > 0) {
                return buffer;
            }
            return "--:--";
        }
        if (std::strftime(buffer, sizeof(buffer), "%I:%M %p", &local) > 0) {
            std::string text = buffer;
            if (text.size() > 1 && text.front() == '0') {
                text.erase(0, 1);
            }
            return text;
        }
    }
    return "--:--";
}

std::string FormatDueLabel(const std::string& due_local)
{
    int year = 0;
    int month = 0;
    int day = 0;
    int hour = -1;
    int minute = 0;
    const int fields =
        std::sscanf(due_local.c_str(), "%4d-%2d-%2dT%2d:%2d", &year, &month, &day, &hour, &minute);
    if (fields != 3 && fields != 5) {
        return {};
    }
    if (month < 1 || month > 12 || day < 1 || day > 31 || (fields == 5 && (hour > 23 || minute > 59))) {
        return {};
    }

    const std::time_t now = std::time(nullptr);
    std::tm today = {};
    localtime_r(&now, &today);

    std::tm due = {};
    due.tm_year = year - 1900;
    due.tm_mon = month - 1;
    due.tm_mday = day;
    due.tm_hour = 12;  // midday: day arithmetic below is immune to daylight-saving shifts
    due.tm_isdst = -1;
    std::tm today_noon = today;
    today_noon.tm_hour = 12;
    today_noon.tm_min = 0;
    today_noon.tm_sec = 0;
    const std::time_t due_stamp = std::mktime(&due);
    const std::time_t today_stamp = std::mktime(&today_noon);
    if (due_stamp == static_cast<std::time_t>(-1) || today_stamp == static_cast<std::time_t>(-1)) {
        return {};
    }
    const long day_delta =
        static_cast<long>((static_cast<long long>(due_stamp) - static_cast<long long>(today_stamp)) /
                          86400LL);

    std::string label;
    const bool time_passed =
        fields == 5 && day_delta == 0 &&
        (hour < today.tm_hour || (hour == today.tm_hour && minute < today.tm_min));
    if (day_delta < 0 || time_passed) {
        return "Overdue";
    }
    if (day_delta == 0) {
        label = "Today";
    } else if (day_delta == 1) {
        label = "Tomorrow";
    } else {
        char buffer[24] = {};
        if (std::strftime(buffer, sizeof(buffer), "%a %b %d", &due) == 0) {
            return {};
        }
        label = buffer;
    }
    if (fields == 5) {
        char buffer[16] = {};
        if (timezone_service::Use24HourClock()) {
            std::snprintf(buffer, sizeof(buffer), " %02d:%02d", hour, minute);
        } else {
            const int hour12 = (hour % 12) == 0 ? 12 : hour % 12;
            std::snprintf(buffer, sizeof(buffer), " %d:%02d %s", hour12, minute,
                          hour >= 12 ? "PM" : "AM");
        }
        label += buffer;
    }
    return label;
}

std::string FormatDueBadge(const std::string& due_local)
{
    const std::string label = FormatDueLabel(due_local);
    if (label.empty() || label == "Overdue") {
        return label;
    }
    if (label.rfind("Today", 0) == 0) {
        return "Today";
    }
    if (label.rfind("Tomorrow", 0) == 0) {
        return "Tomorrow";
    }
    // "Mon Nov 16 14:00" -> "Nov 16": drop the weekday and any time.
    const size_t month_start = label.find(' ');
    if (month_start == std::string::npos) {
        return label;
    }
    const size_t day_end = label.find(' ', label.find(' ', month_start + 1) + 1);
    return label.substr(month_start + 1, day_end == std::string::npos
                                             ? std::string::npos
                                             : day_end - month_start - 1);
}

std::string RowText(const std::string& title, const std::string& transcript, const std::string& fallback)
{
    const std::string trimmed_title = TrimTranscript(title);
    if (!trimmed_title.empty()) {
        return trimmed_title;
    }
    const std::string trimmed = TrimTranscript(transcript);
    return trimmed.empty() ? fallback : trimmed;
}

std::string DetailsPreamble(const std::string& title, const std::string& due_local)
{
    std::string preamble;
    const std::string trimmed_title = TrimTranscript(title);
    if (!trimmed_title.empty()) {
        preamble += trimmed_title + "\n";
    }
    const std::string due = FormatDueLabel(due_local);
    if (!due.empty()) {
        preamble += (due == "Overdue" ? std::string("Overdue") : "Due: " + due) + "\n";
    }
    if (!preamble.empty()) {
        preamble += "\n";
    }
    return preamble;
}

std::string TagOrDueText(RecordingTag tag, bool completed, const std::string& due_local)
{
    if (tag == RecordingTag::kTask && !completed) {
        const std::string badge = FormatDueBadge(due_local);
        if (!badge.empty()) {
            return badge;
        }
    }
    return TagText(tag);
}

std::string FormatDurationLabel(uint32_t duration_ms)
{
    const uint32_t seconds = duration_ms / 1000U;
    if (seconds < 60U) {
        return std::to_string(seconds) + "s";
    }
    return std::to_string(seconds / 60U) + "m";
}

std::string TrimTranscript(const std::string& text)
{
    const auto begin = text.find_first_not_of(" \t\r\n");
    if (begin == std::string::npos) {
        return {};
    }
    const auto end = text.find_last_not_of(" \t\r\n");
    return text.substr(begin, end - begin + 1);
}

std::string TagText(RecordingTag tag)
{
    switch (tag) {
        case RecordingTag::kTask:
            return "Task";
        case RecordingTag::kIdea:
            return "Idea";
        case RecordingTag::kNote:
        default:
            return "Note";
    }
}

}  // namespace timeline_format
