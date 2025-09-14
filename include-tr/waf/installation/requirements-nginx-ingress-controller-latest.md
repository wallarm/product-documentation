* Kubernetes platformu sürüm 1.26-1.30
* [Helm](https://helm.sh/) paket yöneticisi
* Hizmetlerinizin [Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx) sürüm 1.11.8 ile uyumluluğu
* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console içinde **Administrator** rolüne sahip hesaba erişim
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com` adresine veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com` adresine erişim
* Wallarm Helm chart'larını eklemek için `https://charts.wallarm.com` adresine erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* Docker Hub üzerindeki Wallarm depolarına `https://hub.docker.com/r/wallarm` adresine erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* Saldırı tespit kuralları ve [API özellikleri][api-spec-enforcement-docs] güncellemelerini indirmek ve ayrıca [allowlisted, denylisted, or graylisted][ip-lists-docs] ülkeleriniz, bölgeleriniz veya veri merkezleriniz için doğru IP adreslerini almak amacıyla aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"