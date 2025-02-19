* Kubernetes platform sürümü 1.24-1.27
* [Helm](https://helm.sh/) paket yöneticisi
* Hizmetlerinizin [Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx) sürüm 1.9.5 ile uyumluluğu
* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console'da **Administrator** rolüne sahip ve iki faktörlü doğrulaması devre dışı bırakılmış bir hesaba erişim
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com` erişimi veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com` erişimi
* Wallarm Helm charts'lerini eklemek için `https://charts.wallarm.com` erişimi. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* Docker Hub üzerindeki Wallarm depolarına `https://hub.docker.com/r/wallarm` erişimi. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* Saldırı tespit kurallarına yönelik güncellemeleri indirmenize ve [API specifications][api-spec-enforcement-docs] ile [allowlisted, denylisted, or graylisted][ip-lists-docs] ülkeler, bölgeler veya veri merkezleri için doğru IP'leri almanıza olanak tanıyacak şekilde, aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"