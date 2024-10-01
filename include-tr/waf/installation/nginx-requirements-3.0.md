* [ABD Bulutu](https://us1.my.wallarm.com/) veya [AVRUPA Bulutu](https://my.wallarm.com/) için Wallarm Konsolu'nda iki faktörlü kimlik doğrulama devre dışı bırakılmış **Yönetici** veya **Dağıtıcı** rolü ile hesaba erişim
* Özgür yazılım SELinux yüklemesi devre dışı bırakılmış veya [talimatlara][configure-selinux-instr] göre yapılandırılmış
* Tüm komutların bir süper kullanıcı (örn. `root`) tarafından yapılması
* İstek işleme ve postanalitiğin farklı sunucularda: [talimatlar][install-postanalytics-instr] doğrultusunda ayrı bir sunucuya postanalytics yüklemesi
* Paketleri indirmek için `https://repo.wallarm.com` adresine erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun.
* ABD Wallarm Bulutu ile çalışmak için `https://us1.api.wallarm.com:444` adresine veya Avrupa Wallarm Bulutu ile çalışmak için `https://api.wallarm.com:444` adresine erişim. Erişim yalnızca proxy sunucu üzerinden yapılandırılabilirse, [talimatları][configure-proxy-balancer-instr] kullanın.
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
* Kurulu metin düzenleyici **vim**, **nano** veya başka bir tür. Talimatta **vim** kullanılmaktadır.