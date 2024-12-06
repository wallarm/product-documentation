* Access to the account with the **Administrator** role and two‑factor authentication disabled in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/)
* Properly configured SELinux (automatically done by all-in-one installer, see [details][configure-selinux-instr])
* NGINX version 1.24.0

    !!! info "Custom NGINX versions"
        If you have a different version, refer to the instructions on [how to connect the Wallarm module to custom build of NGINX][nginx-custom]
* Executing all commands as a superuser (e.g. `root`)
* Access to `https://repo.wallarm.com` to download packages. Ensure the access is not blocked by a firewall
* Access to `https://us1.api.wallarm.com` for working with US Wallarm Cloud or to `https://api.wallarm.com` for working with EU Wallarm Cloud. If access can be configured only via the proxy server, then use the [instructions][configure-proxy-balancer-instr]
* Access to the IP addresses below for downloading updates to attack detection rules, as well as retrieving precise IPs for your [allowlisted, denylisted, or graylisted][ip-lists-docs] countries, regions, or data centers

    --8<-- "../include/wallarm-cloud-ips.md"
* Installed text editor **vim**, **nano**, or any other. In the instruction, **vim** is used
