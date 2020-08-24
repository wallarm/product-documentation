* Access to the account with the **Administrator** role and two‑factor authentication disabled in Wallarm Console for the [EU Cloud](https://my.wallarm.com/) or [US Cloud](https://us1.my.wallarm.com/)
* SELinux disabled or configured upon the [instruction][configure-selinux-instr]
* Executing all commands as a superuser (e.g. `root`)
* For the request processing and postanalytics on different servers: postanalytics installed on the separate server upon the [instruction][install-postanalytics-instr]
* Access to `https://repo.wallarm.com` to download packages. Ensure the access is not blocked by a firewall
* Access to `https://api.wallarm.com:444` for working with EU Wallarm Cloud or to `https://us1.api.wallarm.com:444` for working with US Wallarm Cloud. If access can be configured only via the proxy server, use the [instruction][configure-proxy-balancer-instr]
* Installed text editor **vim**, **nano** or any other. In the instruction, **vim** is used
