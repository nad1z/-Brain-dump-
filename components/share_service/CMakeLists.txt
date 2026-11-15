idf_component_register(
    SRCS "share_service.cpp" "share_names.cpp"
    INCLUDE_DIRS "include"
    REQUIRES esp_http_server
    PRIV_REQUIRES esp_hw_support esp_timer json recording_archive_service storage_service
                  text_reader_service wifi_service
)

target_compile_features(${COMPONENT_LIB} PUBLIC cxx_std_17)
