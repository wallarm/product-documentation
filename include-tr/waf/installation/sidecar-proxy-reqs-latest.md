* Kubernetes platform sürüm 1.19-1.29
* [Helm v3](https://helm.sh/) paket yöneticisi
* Kubernetes kümesinde bir Pod olarak dağıtılan uygulama
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com` erişimi veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com` erişimi
* Wallarm Helm chart'larını eklemek için `https://charts.wallarm.com` erişimi
* Docker Hub'daki Wallarm depolarına `https://hub.docker.com/r/wallarm` erişimi
* Aşağıdaki IP adreslerine, saldırı tespit kurallarının güncellemelerini indirmek, [API specifications][api-spec-enforcement-docs] almak ve [allowlisted, denylisted, or graylisted][ip-lists-docs] ülkeler, bölgeler veya veri merkezleri için doğru IP'leri temin etmek üzere erişim

    --8<-- "../include/wallarm-cloud-ips.md"
* Wallarm Console'da **Administrator** rolüne sahip hesaba [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) üzerinden erişim