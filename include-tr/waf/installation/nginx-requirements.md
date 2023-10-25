* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Konsolunda iki faktörlü kimlik doğrulamanın devre dışı bırakıldığı **Yönetici** veya **Dağıtım** rolüyle hesaba erişim
* [Talimatlara][configure-selinux-instr] göre yapılandırılmış veya devre dışı bırakılmış SELinux
* Tüm komutların bir süperkullanıcı (ör. `root`) tarafından çalıştırılması
* Talep işleme ve farklı sunucularda postanalytics için: postanalytic'in [talimatlara][install-postanalytics-instr] göre ayrı bir sunucuda yüklenmesi
* Paketleri indirmek için `https://repo.wallarm.com` adresine erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com:444` veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com:444` adresine erişim. Erişim yalnızca proxy sunucusu üzerinden yapılandırılabilirse, o zaman [talimatları][configure-proxy-balancer-instr] kullanın
* Yüklü metin düzenleyicisi **vim**, **nano** veya başka bir türlü. Talimatlarda **vim** kullanılır