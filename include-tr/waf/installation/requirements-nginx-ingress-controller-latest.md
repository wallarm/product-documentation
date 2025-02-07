* Kubernetes platform sürümü 1.24-1.30
* [Helm](https://helm.sh/) paket yöneticisi
* Hizmetlerinizin [Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx) sürümü 1.11.3 ile uyumluluğu
* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console'da **Administrator** rolüne sahip ve iki faktörlü doğrulaması devre dışı bırakılmış hesaba erişim
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com` erişimi veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com` erişimi
* Wallarm Helm grafiklerini eklemek için `https://charts.wallarm.com` erişimi. Erişimin firewall tarafından engellenmediğinden emin olun
* Docker Hub `https://hub.docker.com/r/wallarm` üzerindeki Wallarm depolarına erişim. Erişimin firewall tarafından engellenmediğinden emin olun
* Saldırı tespit kurallarına yönelik güncellemeleri indirmek ve [API specifications][api-spec-enforcement-docs] ile [allowlisted, denylisted, or graylisted][ip-lists-docs] ülkeler, bölgeler veya veri merkezleri için kesin IP'leri almak amacıyla aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"