* Kubernetes platform sürümü 1.22-1.26
* Korunmasını istediğiniz mikro hizmetlere API çağrılarını yönlendirmek için Kong'u yapılandıran K8s Ingress kaynakları
* Kong 3.1.x ile K8s Ingress kaynaklarının uyumluluğu
* [Helm v3](https://helm.sh/) paket yöneticisi
* US Wallarm Bulutu ile çalışmak için `https://us1.api.wallarm.com` adresine veya EU Wallarm Bulutu ile çalışmak için `https://api.wallarm.com` adresine erişim
* Wallarm Helm grafiklerini eklemek için `https://charts.wallarm.com` adresine erişim
* Docker Hub'daki Wallarm depolarına `https://hub.docker.com/r/wallarm` adresinden erişim
* [Link](https://www.gstatic.com/ipranges/goog.json) içerisinde belirtilen Google Cloud Storage'un IP adreslerine erişim. Bireysel IP adreslerinin yerine tüm ülkeleri, bölgeleri veya veri merkezlerini [izin listesi, red listesi veya gri liste][ip-lists-docs] olarak belirlediğinizde, Wallarm düğümü IP listelerindeki girişlerle ilgili kesin IP adreslerini Google Storage'de barındırılan agregat veritabanından alır
* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Konsolunda **Yönetici** rolündeki hesaba erişim