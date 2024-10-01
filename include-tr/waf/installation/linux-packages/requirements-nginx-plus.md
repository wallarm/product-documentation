* [US Bulutu](https://us1.my.wallarm.com/) veya [AB Bulutu](https://my.wallarm.com/) için Wallarm Konsolunda iki faktörlü kimlik doğrulamanın devre dışı bırakıldığı **Yönetici** rolüne sahip hesaba erişim
* SELinux devre dışı bırakıldı veya [talimatlara][configure-selinux-instr] göre yapılandırıldı
* NGINX Plus sürüm 28 (R28)

    !!! bilgi "Özel NGINX Plus versiyonları"
        Farklı bir versiyonunuz varsa, [Wallarm modülünün özel NGINX yapısına nasıl bağlanacağına][nginx-custom] ilişkin talimatlara başvurun.
* Tüm komutların bir süper kullanıcı olarak (ör. `root`) çalıştırılması
* Paketleri indirmek için `https://repo.wallarm.com` adresine erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* US Wallarm Bulutu ile çalışmak için `https://us1.api.wallarm.com` adresine veya AB Wallarm Bulutu ile çalışmak için `https://api.wallarm.com` adresine erişim. Erişim yalnızca proxy sunucu üzerinden yapılandırılabilirse, o zaman [talimatları][configure-proxy-balancer-instr] kullanın
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
* Yüklü metin düzenleyici **vim**, **nano** veya başka bir tür. Talimatta **vim** kullanılır