# Example of Envoy configuration for traffic mirroring

This article provides the example configuration required for Envoy to [mirror the traffic and route it to the Wallarm node](overview.md).

## Step 1: Configure Envoy to mirror the traffic

This example configures traffic mirroring with Envoy via the single `listener` listening to port 80 (without TLS) and having a single `filter`. Addresses of an original backend and additional backend receiving mirrored traffic are specified in the `clusters` block.

```yaml
static_resources:
  listeners:
  - address:
      socket_address:
        address: 0.0.0.0
        port_value: 80
    filter_chains:
    - filters:
        - name: envoy.filters.network.http_connection_manager
          typed_config:
            "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager
            stat_prefix: ingress_http
            codec_type: AUTO
            route_config:
              name: local_route
              virtual_hosts:
              - name: backend
                domains:
                - "*"
                routes:
                - match:
                    prefix: "/"
                  route:
                    cluster: httpbin     # <-- link to the original cluster
                    request_mirror_policies:
                    - cluster: wallarm   # <-- link to the cluster receiving mirrored requests
                      runtime_fraction:
                        default_value:
                          numerator: 100
            http_filters:
            - name: envoy.filters.http.router
              typed_config:
                "@type": type.googleapis.com/envoy.extensions.filters.http.router.v3.Router

  clusters:
  ### Definition of original cluster
  ###
  - name: httpbin
    type: STRICT_DNS
    lb_policy: ROUND_ROBIN
    load_assignment:
      cluster_name: httpbin
      endpoints:
      - lb_endpoints:
        - endpoint:
            address:
              ### Address of the original endpoint. Address is DNS name
              ### or IP address, port_value is TCP port number
              ###
              socket_address:
                address: httpbin # <-- definition of the original cluster
                port_value: 80

  ### Definition of the cluster receiving mirrored requests
  ###
  - name: wallarm
    type: STRICT_DNS
    lb_policy: ROUND_ROBIN
    load_assignment:
      cluster_name: wallarm
      endpoints:
      - lb_endpoints:
        - endpoint:
            address:
              ### Address of the original endpoint. Address is DNS name
              ### or IP address, port_value is TCP port number. Wallarm
              ### mirror schema can be deployed with any port but the
              ### default value is TCP/8445.
              ###
              socket_address:
                address: wallarm
                port_value: 8445
```

[Review the Envoy documentation](https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/route/v3/route_components.proto)

## Step 2: Configure Wallarm node to filter mirrored traffic

--8<-- "../include/wallarm-node-configuration-for-mirrored-traffic.md"
