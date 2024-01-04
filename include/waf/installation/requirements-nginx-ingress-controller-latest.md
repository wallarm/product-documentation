* Kubernetes platform version 1.24-1.27
* [Helm](https://helm.sh/) package manager
* Compatibility of your services with the [Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx) version 1.9.5
* Access to the account with the **Administrator** role and two‑factor authentication disabled in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/)
* Access to `https://us1.api.wallarm.com` for working with US Wallarm Cloud or to `https://api.wallarm.com` for working with EU Wallarm Cloud
* Access to `https://charts.wallarm.com` to add the Wallarm Helm charts. Ensure the access is not blocked by a firewall
* Access to the Wallarm repositories on Docker Hub `https://hub.docker.com/r/wallarm`. Make sure the access is not blocked by a firewall
* Access to the IP addresses of Google Cloud Storage listed within the [link](https://www.gstatic.com/ipranges/goog.json). When you [allowlist, denylist, or graylist][ip-list-docs] entire countries, regions, or data centers instead of individual IP addresses, the Wallarm node retrieves precise IP addresses related to the entries in the IP lists from the aggregated database hosted on Google Storage
