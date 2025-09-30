* Kubernetes platform version 1.22-1.26
* K8s Ingress resources that configure Kong to route API calls to the microservices you want to protect
* Compatibility of K8s Ingress resources with Kong 3.1.x 
* [Helm v3](https://helm.sh/) package manager
* Access to `https://us1.api.wallarm.com` for working with US Wallarm Cloud or to `https://api.wallarm.com` for working with EU Wallarm Cloud
* Access to `https://charts.wallarm.com` to add the Wallarm Helm charts
* Access to the Wallarm repositories on Docker Hub `https://hub.docker.com/r/wallarm`
* Access to the IP addresses and their corresponding hostnames (if any) listed below. This is needed for downloading updates to attack detection rules, as well as retrieving precise IPs for your [allowlisted, denylisted, or graylisted][ip-lists-docs] countries, regions, or data centers

    --8<-- "../include/wallarm-cloud-ips.md"
* Access to the account with the **Administrator** role in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or the [EU Cloud](https://my.wallarm.com/)
