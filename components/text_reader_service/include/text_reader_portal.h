#ifndef TEXT_READER_PORTAL_H_
#define TEXT_READER_PORTAL_H_

#include "esp_http_server.h"

namespace text_reader_service {

// Setup-page routes for the books folder:
//   GET  /api/books                 -> {success, folder, free_bytes, books: [{name, size}]}
//   POST /api/books/upload?name=X   body: UTF-8 plain text; saved as SanitizeBookFilename(X),
//                                   replacing a book of the same name (and its reading position)
//   POST /api/books/delete?name=X   X must be a name from the list
void RegisterPortalRoutes(httpd_handle_t server);

}  // namespace text_reader_service

#endif  // TEXT_READER_PORTAL_H_
