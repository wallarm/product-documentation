* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) 'da Wallarm Console'da iki faktörlü kimlik doğrulaması devre dışı bırakılmış **Yönetici** rolü ile hesaba erişim
* SELinux, [talimatlar][configure-selinux-instr] üzerinden devre dışı bırakıldı veya yapılandırıldı
* Tüm komutların süper kullanıcı olarak (örneğin `root`) çalıştırılması
* Talep işleme ve postanalitik işlemlerin farklı sunucularda yapılması durumu: postanalitik, [talimatlar][install-postanalytics-instr] doğrultusunda ayrı bir sunucuda kurulmuştur
* Paketleri indirmek için `https://repo.wallarm.com` 'a erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com` 'a veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com` 'a erişim. Eğer erişim sadece proxy sunucu üzerinden yapılandırılabilirse, o zaman [talimatları][configure-proxy-balancer-instr] kullanın
* Google Cloud Storage'ın IP adreslerine [bağlantı](https://www.gstatic.com/ipranges/goog.json) içerisinde listelenmiş şekilde erişim. Bireysel IP adresleri yerine tüm ülkeleri, bölgeleri veya veri merkezlerini [izin listesi, yasak listesi veya gri liste][ip-lists-docs] olarak belirlediğinizde, Wallarm düğümü, IP listelerine giren girdilerle ilgili kesin IP adreslerini Google Depolama'da barındırılan birleştirilmiş veritabanından alır
* **vim**, **nano** veya başka bir metin düzenleyicinin kurulu olması. Talimatlarda **vim** kullanılır
