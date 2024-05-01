* Kubernetes platform version 1.24-1.27
* [Helm](https://helm.sh/) package manager
* Compatibility of your services with the [Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx) version 1.9.5
* Access to the account with the **Administrator** role and two‑factor authentication disabled in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/)
* Access to `https://us1.api.wallarm.com` for working with US Wallarm Cloud or to `https://api.wallarm.com` for working with EU Wallarm Cloud
* Access to `https://charts.wallarm.com` to add the Wallarm Helm charts. Ensure the access is not blocked by a firewall
* Access to the Wallarm repositories on Docker Hub `https://hub.docker.com/r/wallarm`. Make sure the access is not blocked by a firewall
* Access to the [specified IP addresses on Google Cloud Storage](https://www.gstatic.com/ipranges/goog.json). This access is crucial for downloading updates to attack detection rules, and retrieving exact IPs of countries, regions, or data centers you have added to your [allowlist, denylist, or graylist][ip-lists-docs]
