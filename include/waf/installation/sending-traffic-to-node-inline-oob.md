Depending on the deployment approach being used, apply the following settings:

=== "In-line"
    Update targets of your load balancer to send traffic to the Wallarm instance. For details, please refer to the documentation on your load balancer.
=== "Out-of-Band"
    Configure your web or proxy server (e.g. NGINX, Envoy) to mirror incoming traffic to the Wallarm node. For configuration details, we recommend referring to your web or proxy server documentation.

    At the [link][web-server-mirroring-examples], you will find the example configuration for the most popular web and proxy servers (NGINX, Traefik, Envoy).
