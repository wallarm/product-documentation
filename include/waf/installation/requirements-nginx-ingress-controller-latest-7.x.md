* Kubernetes platform version 1.27-1.35
* [Helm](https://helm.sh/) version 3.10+
* Compatibility of your services with the Wallarm Ingress Controller based on the [F5 NGINX Ingress Controller](https://github.com/nginx/kubernetes-ingress) [version 5.3.3](https://docs.nginx.com/nginx-ingress-controller/technical-specifications/)
* Access to the account with the **Administrator** role in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/)
* Access to `https://us1.api.wallarm.com` for working with US Wallarm Cloud or to `https://api.wallarm.com` for working with EU Wallarm Cloud
* Access to `https://charts.wallarm.com` to add the Wallarm Helm charts. Ensure the access is not blocked by a firewall
* Access to the Wallarm repositories on Docker Hub `https://hub.docker.com/r/wallarm`. Make sure the access is not blocked by a firewall
* Access to the IP addresses and their corresponding hostnames (if any) listed below. This is needed for downloading updates to attack detection rules and [API specifications][api-spec-enforcement-docs], as well as retrieving precise IPs for your [allowlisted, denylisted, or graylisted][ip-lists-docs] countries, regions, or data centers

    --8<-- "../include/wallarm-cloud-ips.md"
