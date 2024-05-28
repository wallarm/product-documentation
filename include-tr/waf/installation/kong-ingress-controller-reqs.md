* Kubernetes platform sürümü 1.22-1.26
* Korunmasını istediğiniz mikro hizmetlere API çağrılarını yönlendirmek için Kong'u yapılandıran K8s Ingress kaynakları
* Kong 3.1.x ile K8s Ingress kaynaklarının uyumluluğu
* [Helm v3](https://helm.sh/) paket yöneticisi
* US Wallarm Bulutu ile çalışmak için `https://us1.api.wallarm.com` adresine veya EU Wallarm Bulutu ile çalışmak için `https://api.wallarm.com` adresine erişim
* Wallarm Helm grafiklerini eklemek için `https://charts.wallarm.com` adresine erişim
* Docker Hub'daki Wallarm depolarına `https://hub.docker.com/r/wallarm` adresinden erişim
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
* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Konsolunda **Yönetici** rolündeki hesaba erişim