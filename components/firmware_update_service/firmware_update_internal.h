#ifndef FIRMWARE_UPDATE_SERVICE_INTERNAL_H_
#define FIRMWARE_UPDATE_SERVICE_INTERNAL_H_

#include <string>

#include "cJSON.h"
#include "esp_http_server.h"

// Shared between the upload path (firmware_update_service.cpp) and the cloud path
// (cloud_update.cpp). Not part of the component's public interface.
namespace firmware_update_service::internal {

// Claims the single update slot (upload or cloud install). False if another update owns it.
bool TryBeginUpdate();
// Releases it after a failed update. A successful one keeps it until the restart.
void EndFailedUpdate();
// Runs the product precondition (battery). True when the update may go ahead.
bool RunPrecondition(std::string* reason);
// Restarts the device shortly, so a pending HTTP reply or screen refresh can finish first.
void ScheduleRestart();

// Adds the "cloud" object to a GET /api/runtime/update reply.
void AppendCloudRuntime(cJSON* root);
void RegisterCloudRoutes(httpd_handle_t server);

}  // namespace firmware_update_service::internal

#endif  // FIRMWARE_UPDATE_SERVICE_INTERNAL_H_
