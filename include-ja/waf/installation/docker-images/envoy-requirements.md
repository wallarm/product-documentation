* [Docker](https://docs.docker.com/engine/install/) installed on your host system
* Access to `https://hub.docker.com/r/wallarm/envoy` to download the Docker image. Please ensure the access is not blocked by a firewall
* Access to the account with the **Administrator** role in Wallarm Console in the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/) 
* Access to `https://us1.api.wallarm.com` if working with US Wallarm Cloud or to `https://api.wallarm.com` if working with EU Wallarm Cloud. Please ensure the access is not blocked by a firewall
* Access to the IP addresses of Google Cloud Storage listed within the [link](https://www.gstatic.com/ipranges/goog.json). When you [allowlist, denylist, or graylist][ip-lists-docs] entire countries, regions, or data centers instead of individual IP addresses, the Wallarm node retrieves precise IP addresses related to the entries in the IP lists from the aggregated database hosted on Google Storage.
