* Access to the account with the **Administrator** role and two‑factor authentication disabled in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/)
* SELinux disabled or configured upon the [instructions][configure-selinux-instr]
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
* Access to `https://us1.api.wallarm.com` if working with US Wallarm Cloud or to `https://api.wallarm.com` if working with EU Wallarm Cloud. If access can be configured only via the proxy server, then use the [instructions][configure-proxy-balancer-instr]
* Installed text editor **vim**, **nano**, or any other. In the commands in this article, **vim** is used
