* Kubernetes platformu sürümü 1.19-1.29
* [Helm v3](https://helm.sh/) paket yöneticisi
* Bir Kubernetes kümesinde Pod olarak dağıtılmış bir uygulama
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com` adresine veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com` adresine erişim
* Wallarm Helm chart'larını eklemek için `https://charts.wallarm.com` adresine erişim
* Docker Hub üzerindeki Wallarm depolarına `https://hub.docker.com/r/wallarm` erişim
* Saldırı tespiti kuralları ve [API spesifikasyonları][api-spec-enforcement-docs] güncellemelerini indirmek ve ayrıca [allowlisted, denylisted, or graylisted][ip-lists-docs] ülkeleriniz, bölgeleriniz veya veri merkezleriniz için kesin IP'leri almak amacıyla aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"
* Wallarm Console'da [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için **Administrator** rolüne sahip hesaba erişim