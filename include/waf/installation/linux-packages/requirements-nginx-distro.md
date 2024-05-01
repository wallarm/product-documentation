* Access to the account with the **Administrator** role and two‑factor authentication disabled in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/)
* SELinux disabled or configured upon the [instructions][configure-selinux-instr]
* Executing all commands as a superuser (e.g. `root`)
* Access to `https://repo.wallarm.com` to download packages. Ensure the access is not blocked by a firewall
* Access to `https://us1.api.wallarm.com` for working with US Wallarm Cloud or to `https://api.wallarm.com` for working with EU Wallarm Cloud. If access can be configured only via the proxy server, then use the [instructions][configure-proxy-balancer-instr]
* Access to the [specified IP addresses on Google Cloud Storage](https://www.gstatic.com/ipranges/goog.json). This access is crucial for downloading updates to attack detection rules, and retrieving exact IPs of countries, regions, or data centers you have added to your [allowlist, denylist, or graylist][ip-lists-docs]
* Installed text editor **vim**, **nano**, or any other. In the instruction, **vim** is used