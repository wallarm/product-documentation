#   What is new in WAF 2.16

[link-grpc-docs]:       https://grpc.io/
[link-http2-docs]:      https://developers.google.com/web/fundamentals/performance/http2
[link-protobuf-docs]:   https://developers.google.com/protocol-buffers/

* Displaying versions of installed WAF components, NGINX, Envoy (if any) in Wallarm Console
* New WAF node statistics parameters:
    * `db_apply_time`: Unix time of the last update of the proton.db file
    * `lom_apply_time`: Unix time of the last update of the [LOM](../glossary-en.md#lom) file
    * `ts_files`: object with information about the [LOM](../glossary-en.md#lom) file
    * `db_files`: object with information about the proton.db file
    * `overlimits_time`: the number of attacks with the type [Overlimiting of computational resources](../attacks-vulns-list.md#overlimiting-of-computational-resources) detected by the WAF node
