* Kubernetes platform sürüm 1.24-1.27
* [Helm](https://helm.sh/) paket yöneticisi
* Hizmetlerinizin [Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx) 1.9.5 sürümüyle uyumluluğu
* Wallarm Console'da iki faktörlü kimlik doğrulaması devre dışı bırakılmış **Administrator** rolüne sahip hesaba [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için erişim
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com` veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com` adresine erişim
* Wallarm Helm chart'larını eklemek için `https://charts.wallarm.com` adresine erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* Docker Hub üzerindeki Wallarm reposuna `https://hub.docker.com/r/wallarm` adresine erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* Aşağıdaki IP adreslerine; saldırı tespit kurallarının güncellemelerini indirmek ve ayrıca [izin verilen, engellenen veya gri listeye alınan][ip-lists-docs] ülkeler, bölgeler veya veri merkezleri için kesin IP'leri almak amacıyla erişim

    --8<-- "../include/wallarm-cloud-ips.md"