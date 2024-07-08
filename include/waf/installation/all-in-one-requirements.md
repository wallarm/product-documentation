* Access to the account with the **Administrator** role in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/).
* Supported OS:

    * Debian 10, 11 and 12.x
    * Ubuntu LTS 18.04, 20.04, 22.04
    * CentOS 7, 8 Stream, 9 Stream
    * Alma/Rocky Linux 9
    * RHEL 8.x
    * Oracle Linux 8.x
    * Redox
    * SuSe Linux
    * Others (the list is constantly widening, contact [Wallarm support team](mailto:support@wallarm.com) to check if your OS is in the list)

* Access to `https://meganode.wallarm.com` to download all-in-one Wallarm installer. Ensure the access is not blocked by a firewall.
* Access to `https://us1.api.wallarm.com` for working with US Wallarm Cloud or to `https://api.wallarm.com` for working with EU Wallarm Cloud. If access can be configured only via the proxy server, then use the [instructions][configure-proxy-balancer-instr].
* Access to the IP addresses below for downloading updates to attack detection rules, as well as retrieving precise IPs for your [allowlisted, denylisted, or graylisted][ip-lists-docs] countries, regions, or data centers

    === "US Cloud"
        ```
        34.96.64.17
        34.110.183.149
        ```
    === "EU Cloud"
        ```
        34.160.38.183
        34.144.227.90
        ```
* Executing all commands as a superuser (e.g. `root`).