* Access to the account with the **Administrator** role in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/).
* Supported OS:

    * Debian 10, 11, 12.x, 13.x
    * Ubuntu LTS 18.04, 20.04, 22.04, 24.04
    * Ubuntu non-LTS 24.10, 25.04, 25.10
    * CentOS 7, 8 Stream, 9 Stream, 10 Stream
    * Alma/Rocky Linux 9
    * AlmaLinux 10
    * Alpine Linux 3.14-3.22
    * RHEL 8.x
    * RHEL 9.x
    * RHEL 10.x
    * Oracle Linux 8.x
    * Oracle Linux 9.x
    * Oracle Linux 10.x
    * Redox
    * SuSe Linux
    * Others (the list is constantly widening, contact [Wallarm support team](mailto:support@wallarm.com) to check if your OS is in the list)

* Access to `https://meganode.wallarm.com` to download all-in-one Wallarm installer. Ensure the access is not blocked by a firewall.
* Access to `https://us1.api.wallarm.com` for working with US Wallarm Cloud or to `https://api.wallarm.com` for working with EU Wallarm Cloud. If access can be configured only via the proxy server, then use the [instructions][configure-proxy-balancer-instr].
* Access to the IP addresses and their corresponding hostnames (if any) listed below. This is needed for downloading updates to attack detection rules and [API specifications][api-spec-enforcement-docs], as well as retrieving precise IPs for your [allowlisted, denylisted, or graylisted][ip-lists-docs] countries, regions, or data centers

    --8<-- "../include/wallarm-cloud-ips.md"
* Executing all commands as a superuser (e.g. `root`).