* Kubernetes platform sürümü 1.24-1.27
* [Helm](https://helm.sh/) paket yöneticisi
* Hizmetlerinizin [Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx) sürümü 1.9.5 ile uyumluluğu
* İki faktörlü kimlik doğrulamanın devre dışı bırakıldığı Wallarm Konsolu'nda **Yönetici** rolü ile hesaba erişim [ABD Bulutu](https://us1.my.wallarm.com/) veya [AB Bulutu](https://my.wallarm.com/) için
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com` adresine erişim veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com` adresine erişim
* Wallarm Helm şemalarını eklemek için `https://charts.wallarm.com` adresine erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* Docker Hub'deki Wallarm depolarına `https://hub.docker.com/r/wallarm` adresinden erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* Google Cloud Storage'ın IP adreslerine [bağlantıda](https://www.gstatic.com/ipranges/goog.json) listelenenlerden erişim. [Beyaz listeye al, karaliste, veya grid listeye][ip-list-docs] bütün ülkeleri, bölgeleri veya veri merkezlerini tekil IP adreslerinin yerine, Wallarm düğümü IP listelerindeki girdilerle ilgili kesin IP adreslerini Google Storage'ta barındırılan toplu veritabanından alır