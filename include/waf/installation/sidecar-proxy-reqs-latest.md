* Kubernetes platform version 1.19-1.29
* [Helm v3](https://helm.sh/) package manager
* An application deployed as a Pod in a Kubernetes cluster
* Access to `https://us1.api.wallarm.com` for working with US Wallarm Cloud or to `https://api.wallarm.com` for working with EU Wallarm Cloud
* Access to `https://charts.wallarm.com` to add the Wallarm Helm charts
* Access to the Wallarm repositories on Docker Hub `https://hub.docker.com/r/wallarm`
* Access to the IP addresses below for downloading updates to attack detection rules and [API specifications][api-spec-enforcement-docs], as well as retrieving precise IPs for your [allowlisted, denylisted, or graylisted][ip-lists-docs] countries, regions, or data centers

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
* Access to the account with the **Administrator** role in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or the [EU Cloud](https://my.wallarm.com/)