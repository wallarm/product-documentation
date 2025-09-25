* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console'da **Administrator** rolüne sahip hesaba erişim
* SELinux'un devre dışı bırakılmış olması ya da [talimatlara][configure-selinux-instr] göre yapılandırılmış olması
* Tüm komutların süper kullanıcı olarak (örn. `root`) çalıştırılması
* Paketleri indirmek için `https://repo.wallarm.com` adresine erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com` veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com` adresine erişim. Erişim yalnızca vekil sunucu (proxy) üzerinden yapılandırılabiliyorsa, [talimatları][configure-proxy-balancer-instr] kullanın
* Saldırı tespit kurallarının güncellemelerini indirmek ve [allowlisted, denylisted, or graylisted][ip-lists-docs] ülkeleriniz, bölgeleriniz veya veri merkezleriniz için kesin IP’leri almak amacıyla aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"
* **vim**, **nano** veya başka herhangi bir metin düzenleyicisinin kurulu olması. Bu talimatta **vim** kullanılmaktadır