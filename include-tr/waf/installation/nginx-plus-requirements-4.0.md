* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Konsolunda iki faktörlü doğrulamanın devre dışı bırakıldığı **Yönetici** rolüne sahip hesaba erişim
* SELinux devre dışı bırakıldı veya [talimatlara][configure-selinux-instr] göre yapılandırıldı
* NGINX Plus sürüm 28 (R28)

    !!! bilgi "Özel NGINX Plus sürümleri"
        Farklı bir sürümünüz varsa, [Wallarm modülünü özel NGINX yapılandırmasına nasıl bağlayacağınıza][nginx-custom] ilişkin talimatlara başvurun
* Tüm komutların bir süper kullanıcı (örneğin `root`) tarafından yürütülmesi
* İstek işleme ve postanalytics'in farklı sunucularda: postanalytic'in [talimatlara][install-postanalytics-instr] göre ayrı bir sunucuya kurulması
* Paketleri indirmek için `https://repo.wallarm.com` 'a erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* US Wallarm Bulutu ile çalışmak için `https://us1.api.wallarm.com` 'a veya EU Wallarm Bulutu ile çalışmak için `https://api.wallarm.com` 'a erişim. Erişim yalnızca proxy sunucu üzerinden yapılandırılabiliyorsa, o zaman [talimatları][configure-proxy-balancer-instr] kullanın
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
* Yüklü metin düzenleyici **vim**, **nano** veya başka herhangi biri. Talimatta **vim** kullanılır