* Kubernetes platform sürüm 1.23-1.25
* [Helm](https://helm.sh/) paket yöneticisi
* Hizmetlerinizin [Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx) sürüm 1.6.4 veya düşük sürümleriyle uyumluluğu
* İki faktörlü kimlik doğrulamanın devre dışı bırakıldığı Wallarm Konsolu üzerinde **Yönetici** rolüne sahip hesaba [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için erişim
* ABD Wallarm Bulutu ile çalışmak için `https://us1.api.wallarm.com` ya da AB Wallarm Bulutu ile çalışmak için `https://api.wallarm.com` adreslerine erişim
* Wallarm Helm şemalarını eklemek için `https://charts.wallarm.com` adresine erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* Docker Hub üzerindeki Wallarm depolarına `https://hub.docker.com/r/wallarm` adresine erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* Google Cloud Storage'ın IP adreslerine [link](https://www.gstatic.com/ipranges/goog.json) üzerinden erişim. Bireysel IP adreslerinin yerine tüm ülkeleri, bölgeleri veya veri merkezlerini [izin verilen listeye ekler, yasaklı listeye alır veya gri liste oluşturursanız][ip-list-docs], Wallarm düğümü, IP listelerindeki girişlerle ilgili kesin IP adreslerini Google Storage üzerinde barındırılan toplu veritabanından alır.