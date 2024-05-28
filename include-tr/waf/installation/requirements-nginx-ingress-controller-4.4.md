* Kubernetes platform sürüm 1.23-1.25
* [Helm](https://helm.sh/) paket yöneticisi
* Hizmetlerinizin [Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx) sürüm 1.6.4 veya düşük sürümleriyle uyumluluğu
* İki faktörlü kimlik doğrulamanın devre dışı bırakıldığı Wallarm Konsolu üzerinde **Yönetici** rolüne sahip hesaba [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için erişim
* ABD Wallarm Bulutu ile çalışmak için `https://us1.api.wallarm.com` ya da AB Wallarm Bulutu ile çalışmak için `https://api.wallarm.com` adreslerine erişim
* Wallarm Helm şemalarını eklemek için `https://charts.wallarm.com` adresine erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* Docker Hub üzerindeki Wallarm depolarına `https://hub.docker.com/r/wallarm` adresine erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* Access to the IP addresses below for downloading updates to attack detection rules, as well as retrieving precise IPs for your allowlisted, denylisted, or graylisted countries, regions, or data centers

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
