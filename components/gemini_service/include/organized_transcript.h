#ifndef ORGANIZED_TRANSCRIPT_H_
#define ORGANIZED_TRANSCRIPT_H_

#include <string>

// Pure parsing of the model's "transcribe and organise" reply. No network, no ESP-IDF APIs
// beyond cJSON, so it is also compiled and exercised by the host tests (tests/host).
namespace gemini_service {

struct OrganizedTranscript {
    std::string transcript = {};
    // "note" | "task" | "idea", or empty when the model gave none / something else.
    std::string suggested_tag = {};
    // Short title; empty when missing or implausibly long.
    std::string title = {};
    // "YYYY-MM-DD" or "YYYY-MM-DDTHH:MM" (local time); empty when missing or malformed.
    std::string due_local = {};
};

// Spoken-language settings for transcription ("auto", "he", "en", "he+en"). Anything else is
// treated as "auto".
bool IsKnownTranscriptionLanguage(const std::string& language);

// The instructions sent with the audio. `language` is one of the settings above; `now_text` is
// the device's local date and time (or a note that it is unknown), used to resolve "tomorrow".
// Gemini's generateContent API has no language parameter for audio, so the language is stated
// here, together with an explicit "never translate".
std::string BuildTranscriptPrompt(const std::string& language, const std::string& now_text);

// Splits the reply into transcript + organisation fields. A reply that is not the requested
// JSON object (older model, safety rewrite, plain text) is kept whole as the transcript.
OrganizedTranscript ParseOrganizedTranscript(const std::string& reply);

}  // namespace gemini_service

#endif  // ORGANIZED_TRANSCRIPT_H_
