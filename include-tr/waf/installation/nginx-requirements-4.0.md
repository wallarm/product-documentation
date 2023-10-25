* **Yönetici** rolüne ve Wallarm Konsolu'nda iki faktörlü kimlik doğrulaması devre dışı bırakılmış olan [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için hesaba erişim
* SELinux devre dışı bırakıldı veya [talimatlar][configure-selinux-instr] doğrultusunda yapılandırıldı
* NGINX sürümü 1.24.0

    !!! bilgi "Özel NGINX sürümleri"
        Farklı bir sürümünüz varsa, [Wallarm modülünün özel NGINX yapılarına nasıl bağlanacağına] dair talimatlara başvurun][nginx-custom]
* Tüm komutları süper kullanıcı olarak (örn. `root`) çalıştırma
* Talep işleme ve farklı sunucularda postanalitik için: postanalitiğin ayrı bir sunucuda [talimatlar][install-postanalytics-instr] doğrultusunda kurulmuş olması
* Paketleri indirmek için `https://repo.wallarm.com` adresine erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* ABD Wallarm Bulutu ile çalışmak için `https://us1.api.wallarm.com` veya AB Wallarm Bulutu ile çalışmak için `https://api.wallarm.com` adresine erişim. Erişim yalnızca proxy sunucusu üzerinden yapılandırılabilirse, o zaman [talimatları][configure-proxy-balancer-instr] kullanın
* Google Cloud Storage'ın IP adreslerine [bağlantı](https://www.gstatic.com/ipranges/goog.json) içindeki erişim. [Allowlist, denylist veya graylist][ip-lists-docs] üzerindeki ülkeleri, bölgeleri veya veri merkezlerini bireysel IP adreslerinin yerine eklerseniz, Wallarm düğümü girişlerle ilgili kesin IP adreslerini Google Depolama'da barındırılan toplu veritabanından alır
* Başka bir metin düzenleyicisi **vim**, **nano**, veya başka bir tür kurulu. Talimatta **vim** kullanılır