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

using gemini_service::BuildTranscriptPrompt;
using gemini_service::IsKnownTranscriptionLanguage;

TEST(language_settings_are_validated)
{
    CHECK(IsKnownTranscriptionLanguage("auto"));
    CHECK(IsKnownTranscriptionLanguage("he"));
    CHECK(IsKnownTranscriptionLanguage("en"));
    CHECK(IsKnownTranscriptionLanguage("he+en"));
    CHECK(!IsKnownTranscriptionLanguage(""));
    CHECK(!IsKnownTranscriptionLanguage("fr"));
}

TEST(hebrew_prompt_asks_for_hebrew_letters_and_no_translation)
{
    const std::string prompt = BuildTranscriptPrompt("he", "2026-11-15 10:00, Sunday");
    CHECK(prompt.find("speaking Hebrew") != std::string::npos);
    CHECK(prompt.find("Hebrew letters") != std::string::npos);
    CHECK(prompt.find("Do not translate") != std::string::npos);
    CHECK(prompt.find("2026-11-15 10:00, Sunday") != std::string::npos);
}

TEST(auto_prompt_forbids_translating_to_english)
{
    const std::string prompt = BuildTranscriptPrompt("auto", "now");
    CHECK(prompt.find("Never translate it into English") != std::string::npos);
    // Unknown values fall back to the same automatic rule.
    CHECK_EQ(BuildTranscriptPrompt("xx", "now"), prompt);
}

TEST(titles_follow_the_transcript_language)
{
    const std::string prompt = BuildTranscriptPrompt("he", "now");
    CHECK(prompt.find("in the same language as the transcript") != std::string::npos);
    CHECK(prompt.find("in English even when") == std::string::npos);
}

TEST(prompt_still_asks_for_the_json_fields)
{
    const std::string prompt = BuildTranscriptPrompt("he+en", "now");
    for (const char* field : {"\"transcript\"", "\"type\"", "\"title\"", "\"due\""}) {
        CHECK(prompt.find(field) != std::string::npos);
    }
}
