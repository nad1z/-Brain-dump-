idf_component_register(
    SRCS "text_reader_service.cpp" "text_reader_book_filename.cpp" "text_reader_portal.cpp"
    INCLUDE_DIRS "include"
    REQUIRES storage_service esp_http_server json
)

target_compile_features(${COMPONENT_LIB} PUBLIC cxx_std_17)
