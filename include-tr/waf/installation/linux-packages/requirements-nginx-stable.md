* **Yönetici** rolüne sahip hesaba ve Wallarm Konsolu'nda iki faktörlü kimlik doğrulamanın devre dışı bırakıldığı [ABD Bulutu](https://us1.my.wallarm.com/) veya [AB Bulutu](https://my.wallarm.com/) erişim
* SELinux, [talimatlar][configure-selinux-instr] doğrultusunda devre dışı bırakıldı veya yapılandırıldı
* NGINX sürümü 1.24.0

    !!! bilgi "Özel NGINX sürümleri"
        Farklı bir sürümünüz varsa, [Wallarm modülünün özel NGINX derlemesine nasıl bağlanacağına] dair talimatlara başvurun [nginx-custom]
* Tüm komutları süper kullanıcı olarak (ör. `root`) çalıştırma
* Paketleri indirmek için `https://repo.wallarm.com` adresine erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* ABD Wallarm Bulutu ile çalışmak için `https://us1.api.wallarm.com` adresine veya AB Wallarm Bulutu ile çalışmak için `https://api.wallarm.com` adresine erişim. Erişim yalnızca vekil sunucu üzerinden yapılandırılabilirse, o zaman [talimatları][configure-proxy-balancer-instr] kullanın
* Google Cloud Storage'daki IP adreslerine [bağlantı](https://www.gstatic.com/ipranges/goog.json) üzerinden erişim. Bireysel IP adreslerinin yerine tüm ülkeleri, bölgeleri veya veri merkezlerini [izinli liste, reddetme listesi veya gri liste][ip-lists-docs]ye eklediğinizde, Wallarm düğümü, IP listelerindeki girişlerle ilgili kesin IP adreslerini Google Storage'da barındırılan toplanan veritabanından alır
* Yüklü metin düzenleyicisi **vim**, **nano** veya başka bir tür. Talimatlarda **vim** kullanılır