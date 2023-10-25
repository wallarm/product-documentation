* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Konsolunda iki faktörlü doğrulamanın devre dışı bırakıldığı **Yönetici** rolüne sahip hesaba erişim
* SELinux devre dışı bırakıldı veya [talimatlara][configure-selinux-instr] göre yapılandırıldı
* NGINX Plus sürüm 28 (R28)

    !!! bilgi "Özel NGINX Plus sürümleri"
        Farklı bir sürümünüz varsa, [Wallarm modülünü özel NGINX yapılandırmasına nasıl bağlayacağınıza][nginx-custom] ilişkin talimatlara başvurun
* Tüm komutların bir süper kullanıcı (örneğin `root`) tarafından yürütülmesi
* İstek işleme ve postanalytics'in farklı sunucularda: postanalytic'in [talimatlara][install-postanalytics-instr] göre ayrı bir sunucuya kurulması
* Paketleri indirmek için `https://repo.wallarm.com` 'a erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* US Wallarm Bulutu ile çalışmak için `https://us1.api.wallarm.com` 'a veya EU Wallarm Bulutu ile çalışmak için `https://api.wallarm.com` 'a erişim. Erişim yalnızca proxy sunucu üzerinden yapılandırılabiliyorsa, o zaman [talimatları][configure-proxy-balancer-instr] kullanın
* Google Cloud Storage'ın IP adreslerine [bağlantıda](https://www.gstatic.com/ipranges/goog.json) listelenen erişim. Bireysel IP adreslerinin yerine tüm ülkeleri, bölgeleri veya veri merkezlerini [izin verilen liste, reddedilen liste veya gri liste][ip-lists-docs] yaparken, Wallarm düğümü, IP listelerindeki girişlerle ilgili kesin IP adreslerini Google Storage'da barındırılan toplanan veritabanından alır
* Yüklü metin düzenleyici **vim**, **nano** veya başka herhangi biri. Talimatta **vim** kullanılır