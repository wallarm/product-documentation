* **Yönetici** rolüne sahip hesaba erişim ve Wallarm Konsolu'nda iki faktörlü kimlik doğrulamanın devre dışı bırakılması [ABD Bulutu](https://us1.my.wallarm.com/) veya [AB Bulutu](https://my.wallarm.com/) için
* SELinux, [talimatlara][configure-selinux-instr] göre devre dışı bırakıldı veya yapılandırıldı 
* Tüm komutların bir süper kullanıcı (örneğin `root`) olarak yürütülmesi
* Paketleri indirmek için `https://repo.wallarm.com` adresine erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* ABD Wallarm Bulutu ile çalışmak için `https://us1.api.wallarm.com`'a veya AB Wallarm Bulutu ile çalışmak için `https://api.wallarm.com`'a erişim. Erişim yalnızca proxy sunucusu üzerinden yapılandırılabilirse, o zaman [talimatları][configure-proxy-balancer-instr] kullanın
* Access to the IP addresses below for downloading updates to attack detection rules, as well as retrieving precise IPs for your allowlisted, denylisted, or graylisted countries, regions, or data centers

    === "US Cloud"
        ```
        34.96.64.17
        34.110.183.149
        35.235.66.155
        ```
    === "EU Cloud"
        ```
        34.160.38.183
        34.144.227.90
        34.90.110.226
        ```
* Yüklü metin düzenleyici **vim**, **nano** veya başka bir şey. Talimatta, **vim** kullanılır
