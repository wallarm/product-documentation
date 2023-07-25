* Access to the account with the **Administrator** role in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/).
* Supported OS:

    * Debian 10, 11 and 12.x
    * Ubuntu LTS 18.04, 20.04, 22.04
    * CentOS 7, 8 Stream, 9 Stream
    * Alma/Rocky Linux 9
    * Oracle Linux 8.x
    * Redos
    * SuSe Linux
    * Others (the list is constantly widening, contact [Wallarm support team](mailto:support@wallarm.com) to check if your OS is in the list)

* Access to `https://meganode.wallarm.com` to download all-in-one Wallarm installer. Ensure the access is not blocked by a firewall.
* Access to `https://us1.api.wallarm.com` for working with US Wallarm Cloud or to `https://api.wallarm.com` for working with EU Wallarm Cloud. If access can be configured only via the proxy server, then use the [instructions][configure-proxy-balancer-instr].
* Access to the IP addresses of Google Cloud Storage listed within the [link](https://www.gstatic.com/ipranges/goog.json). When you [allowlist, denylist, or graylist][ip-lists-docs] entire countries, regions, or data centers instead of individual IP addresses, the Wallarm node retrieves precise IP addresses related to the entries in the IP lists from the aggregated database hosted on Google Storage.
* Executing all commands as a superuser (e.g. `root`).