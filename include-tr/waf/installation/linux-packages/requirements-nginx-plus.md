* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console'da **Administrator** rolüne sahip hesaba erişim
* SELinux'un devre dışı bırakılmış olması veya [talimatlar][configure-selinux-instr] doğrultusunda yapılandırılmış olması
* NGINX Plus sürüm 29 veya 30 (R29 veya R30)

    !!! info "Özel NGINX Plus sürümleri"
        Farklı bir sürümünüz varsa, [NGINX'in özel derlemesine Wallarm modülünü nasıl bağlayacağınız][nginx-custom] ile ilgili talimatlara bakın
* Tüm komutların süper kullanıcı olarak çalıştırılması (ör. `root`)
* Paketleri indirmek için `https://repo.wallarm.com` erişimi. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com` veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com` erişimi. Erişim yalnızca proxy sunucusu üzerinden yapılandırılabiliyorsa [talimatları][configure-proxy-balancer-instr] kullanın
* Saldırı tespit kurallarına yönelik güncellemeleri indirmek ve ayrıca [allowlisted, denylisted, veya graylisted][ip-lists-docs] ülkeleriniz, bölgeleriniz veya veri merkezleriniz için kesin IP'leri almak amacıyla aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"
* Kurulu bir metin düzenleyici olan **vim**, **nano** veya başka herhangi biri. Bu talimatta **vim** kullanılmaktadır