#   Wallarm Node — Version 2.14

[link-grpc-docs]:       https://grpc.io/
[link-http2-docs]:      https://developers.google.com/web/fundamentals/performance/http2
[link-protobuf-docs]:   https://developers.google.com/protocol-buffers/

##  Highlights of Changes

*   Support for gRPC was added: now Wallarm can protect API and web applications that operates via the gRPC protocol.

    
    !!! info "About the gRPC Protocol"
        gRPC is a modern open-source high-performance Remote Procedure Call (RPC) [framework][link-grpc-docs] from Google.
        
        Its high performance is achieved through the use of [HTTP/2][link-http2-docs] for transport and [protobuf][link-protobuf-docs] for data type descriptions.
        
        The gRPC protocol can be used as an alternative to the REST when building APIs and services. 
    

*   Support for the customizable block pages and server response codes was added for the events of blocking by IP address.

*   A few improvements were made to the monitoring and other system components.

*   Support for the following operating systems was added:
    *   Debian 10,
    *   Amazon Linux 2.