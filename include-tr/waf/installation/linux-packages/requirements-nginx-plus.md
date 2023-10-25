* [US Bulutu](https://us1.my.wallarm.com/) veya [AB Bulutu](https://my.wallarm.com/) için Wallarm Konsolunda iki faktörlü kimlik doğrulamanın devre dışı bırakıldığı **Yönetici** rolüne sahip hesaba erişim
* SELinux devre dışı bırakıldı veya [talimatlara][configure-selinux-instr] göre yapılandırıldı
* NGINX Plus sürüm 28 (R28)

    !!! bilgi "Özel NGINX Plus versiyonları"
        Farklı bir versiyonunuz varsa, [Wallarm modülünün özel NGINX yapısına nasıl bağlanacağına][nginx-custom] ilişkin talimatlara başvurun.
* Tüm komutların bir süper kullanıcı olarak (ör. `root`) çalıştırılması
* Paketleri indirmek için `https://repo.wallarm.com` adresine erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* US Wallarm Bulutu ile çalışmak için `https://us1.api.wallarm.com` adresine veya AB Wallarm Bulutu ile çalışmak için `https://api.wallarm.com` adresine erişim. Erişim yalnızca proxy sunucu üzerinden yapılandırılabilirse, o zaman [talimatları][configure-proxy-balancer-instr] kullanın
* Google Cloud Storage'ın IP adreslerine [bağlantı](https://www.gstatic.com/ipranges/goog.json) dahilinde erişim. Bireysel IP adresleri yerine tüm ülkeleri, bölgeleri veya veri merkezlerini [izin verilen, reddedilen veya gri listeye alınan][ip-lists-docs] olarak yapılandırırsanız, Wallarm düğümü, IP listelerindeki girişlerle ilgili kesin IP adreslerini Google Storage'da barındırılan toplanan veritabanından alır
* Yüklü metin düzenleyici **vim**, **nano** veya başka bir tür. Talimatta **vim** kullanılır