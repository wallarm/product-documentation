* Kubernetes platformu sürüm 1.24-1.27
* [Helm](https://helm.sh/) paket yöneticisi
* Hizmetlerinizin [Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx) 1.9.5 sürümüyle uyumluluğu
* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console'da **Administrator** rolüne sahip hesaba erişim
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com` adresine veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com` adresine erişim
* Wallarm Helm chart'larını eklemek için `https://charts.wallarm.com` adresine erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* Docker Hub'daki Wallarm depolarına `https://hub.docker.com/r/wallarm` erişimi. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* Saldırı tespit kurallarına ve [API spesifikasyonlarına][api-spec-enforcement-docs] yönelik güncellemeleri indirmek ve [allowlisted, denylisted veya graylisted][ip-lists-docs] ülkeleriniz, bölgeleriniz veya veri merkezleriniz için kesin IP'leri almak üzere aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"