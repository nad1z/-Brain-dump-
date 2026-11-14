#ifndef TIME_PAGE_COORDINATOR_H_
#define TIME_PAGE_COORDINATOR_H_

#include <string>
#include <vector>

#include "epaper_ui/time_page.h"
#include "page_navigation/navigation_model.h"
#include "page_navigation/roving_focus.h"
#include "timezone_service.h"

class TimePageCoordinator {
public:
    TimePageCoordinator();

    // Reloads the editable fields from the service snapshot unless the user has edited
    // them since the page was last shown. The timezone list is always refreshed.
    void RefreshFromService(const timezone_service::Snapshot& snapshot,
                            const std::vector<timezone_service::TimezoneInfo>& timezones);
    // Called when the page is (re)entered: clears edit state and focuses the first field.
    void PrepareForShow();

    // While a numeric field is being edited (see BeginEdit), UP/DOWN change its value instead of
    // moving focus: tilt up raises it, tilt down lowers it, wrapping at the field's range.
    // `repeat` is true for auto-repeat events from a held tilt; after a few repeats each step
    // grows (5 for minutes, 10 for years) so long runs are quick.
    bool MoveFocus(int delta, bool repeat = false);
    bool SetFocusIndex(int index);
    bool IsRoleFocused(page_navigation::NavigationItemRole role) const;
    page_navigation::NavigationItemRole FocusedRole() const;

    epaper_ui::TimePageState BuildState() const;

    // Field accessors used to seed overlays and build the save patch.
    const std::vector<timezone_service::TimezoneInfo>& timezones() const { return timezones_; }
    int SelectedTimezoneIndex() const;
    const std::string& hour() const { return hour_; }
    const std::string& minute() const { return minute_; }
    const std::string& month() const { return month_; }
    const std::string& day() const { return day_; }
    const std::string& year() const { return year_; }

    // Commit setters (invoked when an overlay returns a value).
    void SetTimezoneByIndex(int index);
    void SetHour(const std::string& value);
    void SetMinute(const std::string& value);
    void SetMonth(const std::string& value);
    void SetDay(const std::string& value);
    void SetYear(const std::string& value);
    void ToggleMeridiem();

    // Spinner editing for the hour/minute/month/day/year fields. BeginEdit remembers the value
    // so CancelEdit (the Back gesture) can restore it; CommitEdit (Select) keeps the new value
    // and clamps the day to the chosen month.
    bool BeginEdit(page_navigation::NavigationItemRole field);
    bool IsEditing() const
    {
        return editing_field_ != page_navigation::NavigationItemRole::kUnknown;
    }
    page_navigation::NavigationItemRole editing_field() const { return editing_field_; }
    bool CommitEdit();
    bool CancelEdit();
    // Clears the "user edited" guard after a save so later service syncs (e.g. an async NTP
    // result) reload the page instead of preserving the now-committed edits.
    void MarkSaved();

    timezone_service::SettingsPatch BuildSettingsPatch() const;

    const page_navigation::NavigationModel& navigation_model() const { return navigation_model_; }
    const page_navigation::RovingFocus& focus() const { return focus_; }

private:
    void LoadFromSnapshot(const timezone_service::Snapshot& snapshot);
    std::string* FieldValue(page_navigation::NavigationItemRole field);
    bool StepEditingValue(int amount);
    void ClampDayToMonth();

    page_navigation::NavigationModel navigation_model_ =
        page_navigation::BuildTimePageNavigationModel();
    page_navigation::RovingFocus focus_{navigation_model_.item_count, 0};

    std::vector<timezone_service::TimezoneInfo> timezones_ = {};
    std::string timezone_name_ = {};
    std::string timezone_description_ = {};
    std::string hour_ = {};    // "01".."12", or "00".."23" while use_24_hour_
    std::string minute_ = {};  // "00".."59"
    bool meridiem_pm_ = false;
    bool use_24_hour_ = false;
    std::string month_ = {};   // "01".."12"
    std::string day_ = {};     // "01".."31"
    std::string year_ = {};    // "YYYY"
    bool user_edited_ = false;
    page_navigation::NavigationItemRole editing_field_ =
        page_navigation::NavigationItemRole::kUnknown;
    std::string editing_original_value_ = {};
    int repeat_count_ = 0;
};

#endif  // TIME_PAGE_COORDINATOR_H_
