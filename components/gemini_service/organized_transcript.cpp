#include "organized_transcript.h"

#include <cctype>

#include "cJSON.h"

namespace gemini_service {
namespace {

bool AllDigits(const std::string& text, size_t start, size_t count)
{
    for (size_t index = start; index < start + count; ++index) {
        if (std::isdigit(static_cast<unsigned char>(text[index])) == 0) {
            return false;
        }
    }
    return true;
}

// Accept only the two documented shapes so nothing free-form reaches the metadata file.
bool IsDueFormat(const std::string& due)
{
    const bool date_only = due.size() == 10;
    const bool date_time = due.size() == 16;
    if (!date_only && !date_time) {
        return false;
    }
    if (due[4] != '-' || due[7] != '-' || !AllDigits(due, 0, 4) || !AllDigits(due, 5, 2) ||
        !AllDigits(due, 8, 2)) {
        return false;
    }
    if (date_time &&
        (due[10] != 'T' || due[13] != ':' || !AllDigits(due, 11, 2) || !AllDigits(due, 14, 2))) {
        return false;
    }
    return true;
}

}  // namespace

bool IsKnownTranscriptionLanguage(const std::string& language)
{
    return language == "auto" || language == "he" || language == "en" || language == "he+en";
}

std::string BuildTranscriptPrompt(const std::string& language, const std::string& now_text)
{
    std::string language_rule;
    if (language == "he") {
        language_rule =
            "The speaker is speaking Hebrew. Write the transcript in Hebrew, in Hebrew letters. "
            "Keep any English words exactly as spoken, in English letters. Do not translate.";
    } else if (language == "en") {
        language_rule = "The speaker is speaking English. Write the transcript in English.";
    } else if (language == "he+en") {
        language_rule =
            "The speaker mixes Hebrew and English. Write every Hebrew word in Hebrew letters and "
            "every English word in English letters, exactly as spoken. Do not translate either "
            "language into the other.";
    } else {
        language_rule =
            "Write the transcript in the language that is spoken, in that language's own script "
            "(for example Hebrew in Hebrew letters). Never translate it into English or any other "
            "language; keep mixed-language speech as spoken.";
    }

    std::string prompt =
        "Transcribe the speech in this audio and organise it. Reply with one JSON object and "
        "nothing else, with these string fields:\n"
        "\"transcript\": the verbatim transcript. ";
    prompt += language_rule;
    prompt +=
        "\n"
        "\"type\": \"task\" if the speaker is telling themselves to do something or to be "
        "reminded of something, \"idea\" for an idea, plan or thing to explore, otherwise "
        "\"note\".\n"
        "\"title\": a title of at most six words, in the same language as the transcript.\n"
        "\"due\": if the speaker gives a day or time for a task, that moment in local time as "
        "YYYY-MM-DD or YYYY-MM-DDTHH:MM (24-hour); otherwise an empty string. Resolve relative "
        "expressions such as \"tomorrow\" against the current local date and time, which is: ";
    prompt += now_text;
    return prompt;
}

OrganizedTranscript ParseOrganizedTranscript(const std::string& reply)
{
    OrganizedTranscript result = {};

    const size_t open = reply.find('{');
    const size_t close = reply.rfind('}');
    cJSON* root = nullptr;
    if (open != std::string::npos && close != std::string::npos && close > open) {
        root = cJSON_ParseWithLength(reply.c_str() + open, close - open + 1);
    }
    cJSON* transcript =
        root != nullptr ? cJSON_GetObjectItemCaseSensitive(root, "transcript") : nullptr;
    if (!cJSON_IsString(transcript) || transcript->valuestring == nullptr) {
        result.transcript = reply;
        cJSON_Delete(root);
        return result;
    }
    result.transcript = transcript->valuestring;

    const auto read = [root](const char* key) -> std::string {
        cJSON* item = cJSON_GetObjectItemCaseSensitive(root, key);
        return (cJSON_IsString(item) && item->valuestring != nullptr) ? item->valuestring : "";
    };
    const std::string type = read("type");
    if (type == "task" || type == "idea" || type == "note") {
        result.suggested_tag = type;
    }
    result.title = read("title");
    if (result.title.size() > 80) {
        result.title.clear();  // not a title; do not store a paragraph
    }
    const std::string due = read("due");
    if (IsDueFormat(due)) {
        result.due_local = due;
    }
    cJSON_Delete(root);
    return result;
}

}  // namespace gemini_service
