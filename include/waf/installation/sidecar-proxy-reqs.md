* Kubernetes platform version 1.19-1.29
* [Helm v3](https://helm.sh/) package manager
* An application deployed as a Pod in a Kubernetes cluster
* Access to `https://us1.api.wallarm.com` for working with US Wallarm Cloud or to `https://api.wallarm.com` for working with EU Wallarm Cloud
* Access to `https://charts.wallarm.com` to add the Wallarm Helm charts
* Access to the Wallarm repositories on Docker Hub `https://hub.docker.com/r/wallarm`
* Access to the [specified IP addresses on Google Cloud Storage](https://www.gstatic.com/ipranges/goog.json). This access is crucial for downloading updates to attack detection rules, and retrieving exact IPs of countries, regions, or data centers you have added to your [allowlist, denylist, or graylist][ip-lists-docs]
* Access to the account with the **Administrator** role in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or the [EU Cloud](https://my.wallarm.com/)
