# Terraform Module for Web Server Traffic Mirroring

This example demonstrates how to deploy Wallarm to AWS as an Out-of-Band solution using the [Wallarm Terraform module](https://registry.terraform.io/modules/wallarm/wallarm/aws/). It is expected that the NGINX, Envoy, Istio and/or Traefik web server provides traffic mirroring.

## Key characteristics

* Wallarm processes traffic in the asynchronous mode (`preset=mirror`) without affecting the current traffic flow which makes the approach the safest one.
* Wallarm solution is deployed as a separate network layer that enables you to control it independently from other layers and place the layer in almost any network structure position. The recommended position is in the private network.

## Solution architecture

![Wallarm for mirrored traffic](../../../images/waf-installation/oob/terraform-module-for-traffic-mirrored-by-server.png)

This example Wallarm solution has the following components:

* Internet-facing load balancer routing traffic to the Wallarm node instances. It is expected that a load balancer has been already deployed, the `wallarm` module will not create this resource.
* Any web server serving traffic from a load balancer and mirroring HTTP requests to an internal ALB endpoint and backend services. It is expected that a web server has been already deployed, the `wallarm` module will not create this resource.
* An internal ALB accepting mirrored HTTPS requests from a web server and forwarding them to the Wallarm node instances.
* Wallarm node analyzing requests from an internal ALB and proxying any requests further.

    The example runs the Wallarm nodes in the monitoring mode that drives the described behavior. Wallarm nodes can also operate in other modes including those aimed at blocking malicious requests and forwarding only legitimate ones further. To learn more about Wallarm node modes, use [our documentation](https://docs.wallarm.com/admin-en/configure-wallarm-mode/).

The last two components will be deployed by the provided `wallarm` example module.

## Code components

This example has the following code components:

* `main.tf`: the main configuration of the `wallarm` module to be deployed as a mirror solution. The configuration produces an internal AWS ALB and Wallarm instances.

## Configuring HTTP request mirroring

Traffic mirroring is a feature provided by many web servers. Below is the documentation on how to configure traffic mirroring with some of them.

### NGINX

You can stream mirrored requests from NGINX with the following snippet that [should be added](http://nginx.org/en/docs/http/ngx_http_mirror_module.html) to the `server {}` context. You can use this snippet with NGINX web server, NGINX Ingress Controllers (community, plus, and proprietar versions), and Wallarm Ingress Controller. See the snippet example:

```conf
# ${TARGET} must be replaced with Internal ALB DNS name

mirror /mirror;
mirror_request_body on;
location /mirror {
  internal;
  proxy_pass ${TARGET}$request_uri;
  proxy_set_header X-Server-Addr $server_addr;
  proxy_set_header X-Server-Port $server_port;
  proxy_set_header Host $http_host;
  proxy_set_header X-Forwarded-For $realip_remote_addr;
  proxy_set_header X-Forwarded-Port $realip_remote_port;
  proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;
  proxy_set_header X-Scheme $scheme;
  proxy_set_header X-Request-ID $request_id;
}
```

The detailed guideline can be found in [the official documentation](https://docs.wallarm.com/admin-en/configuration-guides/traffic-mirroring/nginx-example/#nginx-configuration-to-mirror-the-traffic).

### Traefik

For Traefik web server follow [the guildeline](https://docs.wallarm.com/admin-en/configuration-guides/traffic-mirroring/traefik-example/), or use [the official Traefik documentation](https://doc.traefik.io/traefik/routing/services/#mirroring-service).

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

### Envoy

For Envoy web server it is recommended to follow [the guildeline](https://docs.wallarm.com/admin-en/configuration-guides/traffic-mirroring/envoy-example/), or use [the official Envoy documentation](https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/route/v3/route_components.proto).

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

### Istio

For Istio it is recommended to follow [the guildeline](https://docs.wallarm.com/admin-en/configuration-guides/traffic-mirroring/istio-example/), or use [the official Istio documentation](https://istio.io/latest/docs/tasks/traffic-management/mirroring/).

```yaml
---
### Configuration of destination for mirrored traffic
###
apiVersion: networking.istio.io/v1beta1
kind: ServiceEntry
metadata:
  name: wallarm-external-svc
spec:
  hosts:
    - some.external.service.tld # mirroring destination address
  location: MESH_EXTERNAL
  ports:
    - number: 8445 # mirroring destination port
      name: http
      protocol: HTTP
  resolution: DNS
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: httpbin
spec:
  hosts:
    - ...
  gateways:
    ### Name of istio `Gateway` component. Required for handling traffic from
    ### external sources
    ###
    - httpbin-gateway
    ### Special label, enables this virtual service routes to work with requests
    ### from Kubernetes pods (in-cluster communication not via gateways)
    ###
    - mesh
  http:
    - route:
        - destination:
            host: httpbin
            port:
              number: 80
          weight: 100
      mirror:
        host: some.external.service.tld # mirroring destination address
        port:
          number: 8445 # mirroring destination port
---
### For handling external requests
###
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: httpbin-gateway
spec:
  selector:
    istio: ingress
    app: istio-ingress
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - "httpbin.local"
```

## Limitations

Despite the fact that the described example solution is the most functional Out-of-Band Wallarm solution, it has some limitations inherent in the asynchronous approach:

* Wallarm node does not instantly block malicious requests since traffic analysis proceeds irrespective of actual traffic flow.
* The solution requires an additional component - the web server providing traffic mirroring or a similar tool (e.g. NGINX, Envoy, Istio, Traefik, custom Kong module, etc).

## Running the example Wallarm AWS mirror solution

1. Sign up for Wallarm Console in the [EU Cloud](https://my.wallarm.com/nodes) or [US Cloud](https://us1.my.wallarm.com/nodes).
1. Open Wallarm Console → **Nodes** and create the node of the **Wallarm node** type.
1. Copy the generated node token.
1. Clone the repository containing the example code to your machine:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. Set variable values in the `default` options in the `examples/mirror/variables.tf` file of the cloned repository and save changes.
1. Deploy the stack by executing the following commands from the `examples/mirror` directory:

    ```
    terraform init
    terraform apply
    ```

To remove the deployed environment, use the following command:

```
terraform destroy
```

## References

* [AWS VPC with public and private subnets (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)
* [Wallarm documentation](https://docs.wallarm.com)
