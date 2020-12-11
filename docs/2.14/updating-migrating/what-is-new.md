#   What is new in WAF node 2.14

[link-grpc-docs]:       https://grpc.io/
[link-http2-docs]:      https://developers.google.com/web/fundamentals/performance/http2
[link-protobuf-docs]:   https://developers.google.com/protocol-buffers/

*   Support for gRPC was added: now Wallarm can protect API and web applications that operate via the gRPC protocol.

    
    !!! info "About the gRPC Protocol"
        gRPC is a modern open‑source high-performance Remote Procedure Call (RPC) [framework][link-grpc-docs] from Google.
        
        Its high performance is achieved through the use of [HTTP/2][link-http2-docs] for transport and [protobuf][link-protobuf-docs] for data type descriptions.
        
        The gRPC protocol can be used as an alternative to the REST when building APIs and services. 
    

*   Support for the customizable block pages and server response codes was added for the events of blocking by IP address. Setup is performed via the [`wallarm_acl_block_page`](../admin-en/configure-parameters-en.md#wallarm_acl_block_page) directive.

*   Support for the customizable response codes was added for the events of blocking malicious requests. Setup is performed via the [`wallarm_block_page`](../admin-en/configure-parameters-en.md#wallarm_block_page) directive.

*   A few improvements were made to the monitoring and other system components.

*   Support for the following operating systems were added:
    *   Debian 10,
    *   Amazon Linux 2.
* Dropped support of operating systems Debian 8.x (jessie) and Ubuntu 14.04 LTS (trusty). Support of Debian 8.x (jessie-backports) is still available.
*   Support of [blocking requests by IP addresses](../admin-en/configure-ip-blocking-en.md) for Wallarm Ingress controller and WAF node deployed in a Docker container

----------

[Other updates in Wallarm products and components →](https://changelog.wallarm.com/)
