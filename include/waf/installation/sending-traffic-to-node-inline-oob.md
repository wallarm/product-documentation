Depending on the deployment approach being used, perform the following settings:

=== "In-line"
    Update targets of your load balancer to send traffic to the Wallarm instance. For details, please refer to the documentation on your load balancer.
=== "Out-of-Band"
    Configure your web server to mirror incoming traffic to the Wallarm node. For configuration details, we recommend to refer to your web server documentation.

    Inside the [link][web-server-mirroring-examples], you will find the example configuration for the most popular of web servers (NGINX, Traefik, Envoy).
