#ifndef RECORDING_ARCHIVE_PORTAL_H_
#define RECORDING_ARCHIVE_PORTAL_H_

#include "esp_http_server.h"

namespace recording_archive_service {

// Setup-page routes for getting recordings off the device:
//   GET /api/recordings            -> {success, recordings: [{id, created, date, duration_ms,
//                                      tag, title, transcript, has_audio, completed, archived,
//                                      follow_up}]}, newest first, streamed entry by entry
//   GET /api/recordings/audio?id=X -> the recording's .wav as a download. X must be the id of a
//                                     listed recording; the path always comes from the archive.
// Transcripts are already in the list, so the page saves them without another request.
void RegisterPortalRoutes(httpd_handle_t server);

}  // namespace recording_archive_service

#endif  // RECORDING_ARCHIVE_PORTAL_H_
