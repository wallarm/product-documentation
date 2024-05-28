* **Yönetici** rolüne ve Wallarm Konsolu'nda iki faktörlü kimlik doğrulaması devre dışı bırakılmış olan [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için hesaba erişim
* SELinux devre dışı bırakıldı veya [talimatlar][configure-selinux-instr] doğrultusunda yapılandırıldı
* NGINX sürümü 1.24.0

    !!! bilgi "Özel NGINX sürümleri"
        Farklı bir sürümünüz varsa, [Wallarm modülünün özel NGINX yapılarına nasıl bağlanacağına] dair talimatlara başvurun][nginx-custom]
* Tüm komutları süper kullanıcı olarak (örn. `root`) çalıştırma
* Talep işleme ve farklı sunucularda postanalitik için: postanalitiğin ayrı bir sunucuda [talimatlar][install-postanalytics-instr] doğrultusunda kurulmuş olması
* Paketleri indirmek için `https://repo.wallarm.com` adresine erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* ABD Wallarm Bulutu ile çalışmak için `https://us1.api.wallarm.com` veya AB Wallarm Bulutu ile çalışmak için `https://api.wallarm.com` adresine erişim. Erişim yalnızca proxy sunucusu üzerinden yapılandırılabilirse, o zaman [talimatları][configure-proxy-balancer-instr] kullanın
* Access to the IP addresses below for downloading updates to attack detection rules, as well as retrieving precise IPs for your allowlisted, denylisted, or graylisted countries, regions, or data centers

    === "US Cloud"
        ```
        34.96.64.17
        34.110.183.149
        ```
    === "EU Cloud"
        ```
        34.160.38.183
        34.144.227.90
        ```
* Başka bir metin düzenleyicisi **vim**, **nano**, veya başka bir tür kurulu. Talimatta **vim** kullanılır