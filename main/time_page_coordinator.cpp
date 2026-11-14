#include "time_page_coordinator.h"

#include <array>
#include <cstdio>
#include <cstdlib>
#include <ctime>

namespace {

using page_navigation::NavigationItemRole;

// Splits "a<sep>b<sep>c" into up to 3 parts; missing parts are empty.
std::array<std::string, 3> Split3(const std::string& text, char sep)
{
    std::array<std::string, 3> parts = {};
    size_t start = 0;
    for (int i = 0; i < 3; ++i) {
        const size_t end = text.find(sep, start);
        parts[static_cast<size_t>(i)] =
            text.substr(start, end == std::string::npos ? std::string::npos : end - start);
        if (end == std::string::npos) {
            break;
        }
        start = end + 1;
    }
    return parts;
}

std::string Pad2(int value)
{
    char buffer[8] = {};
    std::snprintf(buffer, sizeof(buffer), "%02d", value);
    return std::string(buffer);
}

int To12Hour(int hour24)
{
    const int hour12 = hour24 % 12;
    return hour12 == 0 ? 12 : hour12;
}

constexpr int kMinYear = 2024;
constexpr int kMaxYear = 2099;
// Held-tilt auto-repeats before the step grows.
constexpr int kRepeatsBeforeFastStep = 4;

bool IsLeapYear(int year)
{
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}

int DaysInMonth(int year, int month)
{
    static constexpr int kDays[12] = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
    if (month < 1 || month > 12) {
        return 31;
    }
    if (month == 2 && IsLeapYear(year)) {
        return 29;
    }
    return kDays[month - 1];
}

// Wraps `value` into [min_value, max_value].
int WrapInRange(int value, int min_value, int max_value)
{
    const int span = max_value - min_value + 1;
    return ((((value - min_value) % span) + span) % span) + min_value;
}

}  // namespace

TimePageCoordinator::TimePageCoordinator() = default;

void TimePageCoordinator::LoadFromSnapshot(const timezone_service::Snapshot& snapshot)
{
    timezone_name_ = snapshot.settings.timezone_name;

    timezone_description_ = timezone_name_;
    for (const timezone_service::TimezoneInfo& info : timezones_) {
        if (info.name == timezone_name_) {
            timezone_description_ = info.description.empty() ? info.name : info.description;
            break;
        }
    }

    const std::array<std::string, 3> date = Split3(snapshot.runtime.current_date, '-');
    year_ = date[0];
    month_ = date[1];
    day_ = date[2];

    const std::array<std::string, 3> time = Split3(snapshot.runtime.current_time, ':');
    const int hour24 = std::atoi(time[0].c_str());
    minute_ = time[1].empty() ? std::string("00") : time[1];
    use_24_hour_ = snapshot.settings.use_24_hour;
    meridiem_pm_ = hour24 >= 12;
    hour_ = use_24_hour_ ? Pad2(hour24) : Pad2(To12Hour(hour24));
}

void TimePageCoordinator::RefreshFromService(
    const timezone_service::Snapshot& snapshot,
    const std::vector<timezone_service::TimezoneInfo>& timezones)
{
    timezones_ = timezones;
    runtime_ = snapshot.runtime;
    if (!user_edited_) {
        LoadFromSnapshot(snapshot);
    }
}

void TimePageCoordinator::PrepareForShow()
{
    user_edited_ = false;
    editing_field_ = NavigationItemRole::kUnknown;
    editing_original_value_.clear();
    focus_.Configure(navigation_model_.item_count,
                     navigation_model_.IndexOfRole(NavigationItemRole::kTimePageTimezone));
}

bool TimePageCoordinator::MoveFocus(int delta, bool repeat)
{
    if (delta == 0) {
        return false;
    }
    if (IsEditing()) {
        repeat_count_ = repeat ? repeat_count_ + 1 : 0;
        int step = 1;
        if (repeat_count_ >= kRepeatsBeforeFastStep) {
            if (editing_field_ == NavigationItemRole::kTimePageMinute) {
                step = 5;
            } else if (editing_field_ == NavigationItemRole::kTimePageYear) {
                step = 10;
            }
        }
        // UP arrives as delta -1 and raises the value.
        return StepEditingValue(delta < 0 ? step : -step);
    }
    return focus_.Move(delta);
}

std::string* TimePageCoordinator::FieldValue(NavigationItemRole field)
{
    switch (field) {
        case NavigationItemRole::kTimePageHour:
            return &hour_;
        case NavigationItemRole::kTimePageMinute:
            return &minute_;
        case NavigationItemRole::kTimePageMonth:
            return &month_;
        case NavigationItemRole::kTimePageDay:
            return &day_;
        case NavigationItemRole::kTimePageYear:
            return &year_;
        default:
            return nullptr;
    }
}

bool TimePageCoordinator::BeginEdit(NavigationItemRole field)
{
    std::string* value = FieldValue(field);
    if (value == nullptr) {
        return false;
    }
    editing_field_ = field;
    editing_original_value_ = *value;
    repeat_count_ = 0;
    return true;
}

bool TimePageCoordinator::CommitEdit()
{
    if (!IsEditing()) {
        return false;
    }
    const std::string* value = FieldValue(editing_field_);
    if (value != nullptr && *value != editing_original_value_) {
        user_edited_ = true;
    }
    editing_field_ = NavigationItemRole::kUnknown;
    editing_original_value_.clear();
    ClampDayToMonth();
    return true;
}

bool TimePageCoordinator::CancelEdit()
{
    if (!IsEditing()) {
        return false;
    }
    std::string* value = FieldValue(editing_field_);
    if (value != nullptr) {
        *value = editing_original_value_;
    }
    editing_field_ = NavigationItemRole::kUnknown;
    editing_original_value_.clear();
    return true;
}

void TimePageCoordinator::ClampDayToMonth()
{
    const int max_day = DaysInMonth(std::atoi(year_.c_str()), std::atoi(month_.c_str()));
    if (std::atoi(day_.c_str()) > max_day) {
        day_ = Pad2(max_day);
        user_edited_ = true;
    }
}

bool TimePageCoordinator::StepEditingValue(int amount)
{
    std::string* value = FieldValue(editing_field_);
    if (value == nullptr || amount == 0) {
        return false;
    }
    int min_value = 0;
    int max_value = 0;
    int current = std::atoi(value->c_str());
    switch (editing_field_) {
        case NavigationItemRole::kTimePageHour:
            min_value = use_24_hour_ ? 0 : 1;
            max_value = use_24_hour_ ? 23 : 12;
            break;
        case NavigationItemRole::kTimePageMinute:
            max_value = 59;
            break;
        case NavigationItemRole::kTimePageMonth:
            min_value = 1;
            max_value = 12;
            break;
        case NavigationItemRole::kTimePageDay:
            min_value = 1;
            max_value = DaysInMonth(std::atoi(year_.c_str()), std::atoi(month_.c_str()));
            break;
        case NavigationItemRole::kTimePageYear:
            min_value = kMinYear;
            max_value = kMaxYear;
            break;
        default:
            return false;
    }

    int next = 0;
    if (value->empty() || current < min_value || current > max_value) {
        // Empty or out-of-range (e.g. no clock yet): start from the bottom of the range.
        next = min_value;
    } else if (amount == 1 || amount == -1) {
        next = current + amount;
    } else {
        // Large steps snap to a multiple of the step, so minutes land on :05, :10 ...
        const int step = amount > 0 ? amount : -amount;
        if (amount > 0) {
            next = ((current / step) + 1) * step;
        } else {
            next = (current % step) != 0 ? current - (current % step) : current - step;
        }
    }
    next = WrapInRange(next, min_value, max_value);

    char buffer[8] = {};
    std::snprintf(buffer, sizeof(buffer),
                  editing_field_ == NavigationItemRole::kTimePageYear ? "%04d" : "%02d", next);
    if (*value == buffer) {
        return false;
    }
    *value = buffer;
    return true;
}

bool TimePageCoordinator::SetFocusIndex(int index)
{
    return focus_.SetIndex(index);
}

bool TimePageCoordinator::IsRoleFocused(NavigationItemRole role) const
{
    return navigation_model_.IsRoleSelected(focus_.index(), role);
}

NavigationItemRole TimePageCoordinator::FocusedRole() const
{
    const page_navigation::NavigationItemDescriptor* item =
        navigation_model_.ItemAt(focus_.index());
    return item != nullptr ? item->role : NavigationItemRole::kUnknown;
}

int TimePageCoordinator::SelectedTimezoneIndex() const
{
    for (size_t index = 0; index < timezones_.size(); ++index) {
        if (timezones_[index].name == timezone_name_) {
            return static_cast<int>(index);
        }
    }
    return -1;
}

void TimePageCoordinator::SetTimezoneByIndex(int index)
{
    if (index < 0 || index >= static_cast<int>(timezones_.size())) {
        return;
    }
    timezone_name_ = timezones_[static_cast<size_t>(index)].name;
    timezone_description_ = timezones_[static_cast<size_t>(index)].description.empty()
                                ? timezones_[static_cast<size_t>(index)].name
                                : timezones_[static_cast<size_t>(index)].description;
    user_edited_ = true;
}

void TimePageCoordinator::SetHour(const std::string& value)
{
    hour_ = value;
    user_edited_ = true;
}

void TimePageCoordinator::SetMinute(const std::string& value)
{
    minute_ = value;
    user_edited_ = true;
}

void TimePageCoordinator::SetMonth(const std::string& value)
{
    month_ = value;
    user_edited_ = true;
}

void TimePageCoordinator::SetDay(const std::string& value)
{
    day_ = value;
    user_edited_ = true;
}

void TimePageCoordinator::SetYear(const std::string& value)
{
    year_ = value;
    user_edited_ = true;
}

void TimePageCoordinator::ToggleMeridiem()
{
    // One button cycles AM -> PM -> 24H -> AM. Entering 24H keeps the same moment (the hour
    // digits are converted); leaving it lands on AM with the hour shown in 12-hour digits.
    if (use_24_hour_) {
        const int hour24 = ((std::atoi(hour_.c_str()) % 24) + 24) % 24;
        hour_ = Pad2(To12Hour(hour24));
        use_24_hour_ = false;
        meridiem_pm_ = false;
    } else if (!meridiem_pm_) {
        meridiem_pm_ = true;
    } else {
        const int hour24 = (std::atoi(hour_.c_str()) % 12) + 12;
        hour_ = Pad2(hour24);
        use_24_hour_ = true;
    }
    user_edited_ = true;
}

void TimePageCoordinator::MarkSaved()
{
    user_edited_ = false;
}

timezone_service::SettingsPatch TimePageCoordinator::BuildSettingsPatch() const
{
    timezone_service::SettingsPatch patch = {};
    patch.has_enabled = true;
    patch.enabled = true;
    patch.has_timezone_name = true;
    patch.timezone_name = timezone_name_;

    int hour24 = 0;
    if (use_24_hour_) {
        hour24 = ((std::atoi(hour_.c_str()) % 24) + 24) % 24;
    } else {
        hour24 = std::atoi(hour_.c_str()) % 12;
        if (meridiem_pm_) {
            hour24 += 12;
        }
    }
    patch.has_use_24_hour = true;
    patch.use_24_hour = use_24_hour_;
    patch.has_manual_datetime = true;
    patch.manual_date = year_ + "-" + month_ + "-" + day_;
    patch.manual_time = Pad2(hour24) + ":" + (minute_.empty() ? std::string("00") : minute_);
    return patch;
}

std::string TimePageCoordinator::ClockStatusText() const
{
    if (runtime_.sync_in_progress) {
        return "Getting the time over Wi-Fi...";
    }
    if (!runtime_.time_valid) {
        return "Clock not set. Pick your timezone and connect Wi-Fi, or set it below.";
    }
    if (runtime_.time_source == timezone_service::TimeSource::kNtp &&
        runtime_.last_network_sync_epoch != 0) {
        const std::time_t synced = static_cast<std::time_t>(runtime_.last_network_sync_epoch);
        std::tm local = {};
        localtime_r(&synced, &local);
        char when[16] = {};
        if (use_24_hour_) {
            std::strftime(when, sizeof(when), "%H:%M", &local);
        } else {
            const int hour12 = To12Hour(local.tm_hour);
            std::snprintf(when, sizeof(when), "%d:%02d %s", hour12, local.tm_min,
                          local.tm_hour >= 12 ? "PM" : "AM");
        }
        return std::string("Set over Wi-Fi at ") + when +
               ". It stays right on its own; a time typed below is replaced at the next sync.";
    }
    return "Set by hand. Connecting to Wi-Fi sets the exact time automatically.";
}

epaper_ui::TimePageState TimePageCoordinator::BuildState() const
{
    epaper_ui::TimePageState state = {};
    state.navigation_focus_index = focus_.index();

    state.timezone.label_text = "Timezone";
    state.timezone.placeholder_text = "Select timezone";
    state.timezone.value_text = timezone_description_;
    state.timezone.focused = IsRoleFocused(NavigationItemRole::kTimePageTimezone);
    state.clock_status_text = ClockStatusText();

    state.hour.value_text = hour_;
    state.hour.suffix_text = "HR";
    state.hour.max_length = 2;
    state.hour.focused = IsRoleFocused(NavigationItemRole::kTimePageHour);
    state.hour.active = editing_field_ == NavigationItemRole::kTimePageHour;
    state.hour.show_cursor = false;

    state.minute.value_text = minute_;
    state.minute.suffix_text = "MIN";
    state.minute.max_length = 2;
    state.minute.focused = IsRoleFocused(NavigationItemRole::kTimePageMinute);
    state.minute.active = editing_field_ == NavigationItemRole::kTimePageMinute;
    state.minute.show_cursor = false;

    state.meridiem.label_text = use_24_hour_ ? "24H" : (meridiem_pm_ ? "PM" : "AM");
    state.meridiem.selected = IsRoleFocused(NavigationItemRole::kTimePageMeridiem);

    state.month.value_text = month_;
    state.month.placeholder_text = "MM";
    state.month.max_length = 2;
    state.month.focused = IsRoleFocused(NavigationItemRole::kTimePageMonth);
    state.month.active = editing_field_ == NavigationItemRole::kTimePageMonth;
    state.month.show_cursor = false;

    state.day.value_text = day_;
    state.day.placeholder_text = "DD";
    state.day.max_length = 2;
    state.day.focused = IsRoleFocused(NavigationItemRole::kTimePageDay);
    state.day.active = editing_field_ == NavigationItemRole::kTimePageDay;
    state.day.show_cursor = false;

    state.year.value_text = year_;
    state.year.placeholder_text = "YYYY";
    state.year.max_length = 4;
    state.year.focused = IsRoleFocused(NavigationItemRole::kTimePageYear);
    state.year.active = editing_field_ == NavigationItemRole::kTimePageYear;
    state.year.show_cursor = false;

    state.save.label_text = "Sync & Save";
    state.save.selected = IsRoleFocused(NavigationItemRole::kTimePageSave);

    state.back.label_text = "Back";
    state.back.selected = IsRoleFocused(NavigationItemRole::kTimePageBackButton);
    return state;
}
