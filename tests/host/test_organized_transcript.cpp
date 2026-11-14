// Auto filing: parsing the model's combined "transcript + type + title + due" reply.
#include <string>

#include "check.h"
#include "organized_transcript.h"

using gemini_service::OrganizedTranscript;
using gemini_service::ParseOrganizedTranscript;

TEST(full_reply_is_split_into_fields)
{
    const OrganizedTranscript result = ParseOrganizedTranscript(
        R"({"transcript":"Remind me to call the bank tomorrow at nine.","type":"task",)"
        R"("title":"Call the bank","due":"2026-11-15T09:00"})");
    CHECK_EQ(result.transcript, std::string("Remind me to call the bank tomorrow at nine."));
    CHECK_EQ(result.suggested_tag, std::string("task"));
    CHECK_EQ(result.title, std::string("Call the bank"));
    CHECK_EQ(result.due_local, std::string("2026-11-15T09:00"));
}

TEST(hebrew_transcript_survives_json_parsing)
{
    const std::string hebrew = "\xD7\xA9\xD7\x9C\xD7\x95\xD7\x9D";
    const OrganizedTranscript result = ParseOrganizedTranscript(
        "{\"transcript\":\"" + hebrew + "\",\"type\":\"idea\",\"title\":\"Greeting\",\"due\":\"\"}");
    CHECK_EQ(result.transcript, hebrew);
    CHECK_EQ(result.suggested_tag, std::string("idea"));
    CHECK(result.due_local.empty());
}

TEST(plain_text_reply_is_kept_as_the_transcript)
{
    const OrganizedTranscript result = ParseOrganizedTranscript("Just a plain transcript.");
    CHECK_EQ(result.transcript, std::string("Just a plain transcript."));
    CHECK(result.suggested_tag.empty());
    CHECK(result.title.empty());
    CHECK(result.due_local.empty());
}

TEST(json_wrapped_in_a_code_fence_is_still_read)
{
    const OrganizedTranscript result = ParseOrganizedTranscript(
        "```json\n{\"transcript\":\"Buy milk\",\"type\":\"task\",\"title\":\"Buy milk\",\"due\":\"2026-11-15\"}\n```");
    CHECK_EQ(result.transcript, std::string("Buy milk"));
    CHECK_EQ(result.due_local, std::string("2026-11-15"));
}

TEST(unknown_type_and_bad_dates_are_ignored)
{
    const OrganizedTranscript result = ParseOrganizedTranscript(
        R"({"transcript":"x","type":"reminder","title":"t","due":"tomorrow morning"})");
    CHECK(result.suggested_tag.empty());
    CHECK(result.due_local.empty());
    CHECK(ParseOrganizedTranscript(R"({"transcript":"x","due":"2026-1x-15"})").due_local.empty());
    CHECK(ParseOrganizedTranscript(R"({"transcript":"x","due":"2026-11-15 09:00"})").due_local.empty());
}

TEST(overlong_title_is_dropped)
{
    const OrganizedTranscript result = ParseOrganizedTranscript(
        "{\"transcript\":\"x\",\"title\":\"" + std::string(200, 'a') + "\"}");
    CHECK(result.title.empty());
    CHECK_EQ(result.transcript, std::string("x"));
}

TEST(broken_json_falls_back_to_whole_reply)
{
    const std::string reply = R"({"transcript":"unterminated)";
    CHECK_EQ(ParseOrganizedTranscript(reply).transcript, reply);
    CHECK(ParseOrganizedTranscript("").transcript.empty());
}
