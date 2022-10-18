# Example of Traefik configuration for traffic mirroring

This article provides the example configuration required for Traefik to [mirror the traffic and route it to the Wallarm node](overview.md).

## Step 1: Configure Traefik to mirror the traffic

The following configuration example is based on the [`dynamic configuration file`](https://doc.traefik.io/traefik/reference/dynamic-configuration/file/) approach. The Traefik web server also supports other configuration modes, and you can easily adjust the provided one to any of them as they have a similar structure.

```yaml
### Dynamic configuration file
### Note: entrypoints are described in static configuration file
http:
  services:
    ### This is how to map original and wallarm `services`.
    ### In further `routers` configuration (see below), please 
    ### use the name of this service (`with_mirroring`).
    ###
    with_mirroring:
      mirroring:
        service: "httpbin"
        mirrors:
          - name: "wallarm"
            percent: 100

    ### The `service` to mirror traffic to - the endpoint
    ### that should receive the requests mirrored (copied)
    ### from the original `service`.
    ###
    wallarm:
      loadBalancer:
        servers:
          - url: "http://wallarm:8445"

    ### Original `service`. This service should receive the
    ### original traffic.
    ###
    httpbin:
      loadBalancer:
        servers:
          - url: "http://httpbin:80/"

  routers:
    ### The router name must be the same as the `service` name
    ### for the traffic mirroring to work (with_mirroring).
    ###
    with_mirroring:
      entryPoints:
        - "web"
      rule: "Host(`mirrored.example.com`)"
      service: "with_mirroring"

    ### The router for the original traffic.
    ###
    just_to_original:
      entryPoints:
        - "web"
      rule: "Host(`original.example.local`)"
      service: "httpbin"
```

[Review the Traefik documentation](https://doc.traefik.io/traefik/routing/services/#mirroring-service)

## Step 2: Configure Wallarm node to filter mirrored traffic

--8<-- "../include/wallarm-node-configuration-for-mirrored-traffic.md"
