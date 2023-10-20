* Access to the account with the **Administrator** role and two‑factor authentication disabled in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/)
* SELinux disabled or configured upon the [instructions][configure-selinux-instr]
* NGINX version 1.24.0

    !!! info "Custom NGINX versions"
        If you have a different version, refer to the instructions on [how to connect the Wallarm module to custom build of NGINX][nginx-custom]
* Executing all commands as a superuser (e.g. `root`). As many OSs do not provide `sudo` by default, install that by:

    === "Debian, Ubuntu, and their derivatives"
        ```bash
        apt update && apt install sudo -y
        ```
    === "Red Hat-based distributions (CentOS and RHEL)"
        ```bash
        yum install sudo -y
        ```

* Access to `https://repo.wallarm.com` to download packages. Ensure the access is not blocked by a firewall
* Access to `https://us1.api.wallarm.com` for working with US Wallarm Cloud or to `https://api.wallarm.com` for working with EU Wallarm Cloud. If access can be configured only via the proxy server, then use the [instructions][configure-proxy-balancer-instr]
* Access to the IP addresses of Google Cloud Storage listed within the [link](https://www.gstatic.com/ipranges/goog.json). When you [allowlist, denylist, or graylist][ip-lists-docs] entire countries, regions, or data centers instead of individual IP addresses, the Wallarm node retrieves precise IP addresses related to the entries in the IP lists from the aggregated database hosted on Google Storage
* Installed text editor **vim**, **nano**, or any other. In the instruction, **vim** is used
