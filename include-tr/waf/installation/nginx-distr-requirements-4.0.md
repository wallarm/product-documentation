* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) 'da Wallarm Console'da iki faktörlü kimlik doğrulaması devre dışı bırakılmış **Yönetici** rolü ile hesaba erişim
* SELinux, [talimatlar][configure-selinux-instr] üzerinden devre dışı bırakıldı veya yapılandırıldı
* Tüm komutların süper kullanıcı olarak (örneğin `root`) çalıştırılması
* Talep işleme ve postanalitik işlemlerin farklı sunucularda yapılması durumu: postanalitik, [talimatlar][install-postanalytics-instr] doğrultusunda ayrı bir sunucuda kurulmuştur
* Paketleri indirmek için `https://repo.wallarm.com` 'a erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com` 'a veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com` 'a erişim. Eğer erişim sadece proxy sunucu üzerinden yapılandırılabilirse, o zaman [talimatları][configure-proxy-balancer-instr] kullanın
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
* **vim**, **nano** veya başka bir metin düzenleyicinin kurulu olması. Talimatlarda **vim** kullanılır
