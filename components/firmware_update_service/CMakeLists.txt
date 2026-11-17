idf_component_register(
    SRCS "firmware_update_service.cpp" "cloud_update.cpp" "release_manifest.cpp"
    INCLUDE_DIRS "include"
    REQUIRES esp_http_server
    PRIV_REQUIRES app_update bootloader_support esp_app_format esp_http_client esp_https_ota
                  esp_timer json mbedtls task_config
)

target_compile_features(${COMPONENT_LIB} PUBLIC cxx_std_17)
