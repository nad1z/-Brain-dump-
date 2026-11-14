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

// Splits the reply into transcript + organisation fields. A reply that is not the requested
// JSON object (older model, safety rewrite, plain text) is kept whole as the transcript.
OrganizedTranscript ParseOrganizedTranscript(const std::string& reply);

}  // namespace gemini_service

#endif  // ORGANIZED_TRANSCRIPT_H_
