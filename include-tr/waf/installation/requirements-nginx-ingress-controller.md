* Kubernetes platformu 1.24-1.27 sürümleri
* [Helm](https://helm.sh/) paket yöneticisi
* Hizmetlerinizin [Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx) sürüm 1.9.5 ile uyumluluğu
* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console'da **Administrator** rolüne sahip hesaba erişim
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com` adresine veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com` adresine erişim
* Wallarm Helm chart'larını eklemek için `https://charts.wallarm.com` adresine erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* Docker Hub üzerindeki Wallarm depolarına (`https://hub.docker.com/r/wallarm`) erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* Saldırı tespit kuralları güncellemelerini indirmek ve [allowlisted, denylisted, or graylisted][ip-lists-docs] ülkeleriniz, bölgeleriniz veya veri merkezleriniz için kesin IP'leri almak amacıyla aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"