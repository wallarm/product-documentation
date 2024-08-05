# Configuring a Failover Method

Deploying a filter node as a [reverse proxy](../glossary-en.md#reverse-proxy) requires that the filter node is highly available. The filter node failure, for example due to power outage, limits the web application's operation. To ensure the high availability of Wallarm, you are recommended to use one of the failover methods described in this section.

A failover method introduces additional nodes to which the traffic is automatically forwarded if the main filter node fails.

## Data Center Failover

If the web application and filter nodes are in a data center, use the data center's "Failover IP" service

## VRRP or CARP 

On each filter node, start a `keepalived` or `ucarp` daemon that monitors the availability of the nodes and starts forwarding traffic if the nodes go down. This is a standard high availability method that can also be used for traffic load balancing by starting a failover‑IP on each node and distributing the traffic with DNS balancing.

!!! info "Working with NGINX Plus"
    Wallarm can be set up to work on [NGINX Plus](https://www.nginx.com/products/nginx/) with a custom VRRP wrapper.

    Most of the Linux distributions, including CentOS and Debian, have custom packages that can install this build.
    
    Installation of Wallarm with NGINX Plus is performed using the all-in-one installer, see detailed instructions [here](../installation/nginx/all-in-one.md).

## Hardware L3 or L4 Load Balancer

A layer 3 or layer 4 load balancer is a good high availability solution.

## DNS Load Balancing

Specify several IP addresses in the DNS settings. While this method targets load balancing, you may also find it useful as high availability method.
