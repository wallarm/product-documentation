* Access to the account with the **Administrator** role in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/)
* SELinux disabled or configured upon the [instructions][configure-selinux-instr]
* NGINX Plus release 28 (R28)

    !!! info "Custom NGINX Plus versions"
        If you have a different version, refer to the instructions on [how to connect the Wallarm module to custom build of NGINX][nginx-custom]
* Executing all commands as a superuser (e.g. `root`)
* For the request processing and postanalytics on different servers: postanalytics installed on the separate server upon the [instructions][install-postanalytics-instr]
* Access to `https://repo.wallarm.com` to download packages. Ensure the access is not blocked by a firewall
* Access to `https://us1.api.wallarm.com` for working with US Wallarm Cloud or to `https://api.wallarm.com` for working with EU Wallarm Cloud. If access can be configured only via the proxy server, then use the [instructions][configure-proxy-balancer-instr]
* Access to the IP addresses of Google Cloud Storage listed within the [link](https://www.gstatic.com/ipranges/goog.json). When you [allowlist, denylist, or graylist][ip-lists-docs] entire countries, regions, or data centers instead of individual IP addresses, the Wallarm node retrieves precise IP addresses related to the entries in the IP lists from the aggregated database hosted on Google Storage
* Installed text editor **vim**, **nano**, or any other. In the instruction, **vim** is used
