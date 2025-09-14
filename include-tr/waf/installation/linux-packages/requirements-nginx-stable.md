* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console'da **Administrator** rolüne sahip hesaba erişim
* SELinux'un devre dışı bırakılmış olması veya [talimatlara][configure-selinux-instr] göre yapılandırılmış olması
* NGINX sürümü 1.24.0

    !!! info "Özel NGINX sürümleri"
        Farklı bir sürüm kullanıyorsanız, NGINX'in özel derlemesine Wallarm modülünü nasıl bağlayacağınıza dair [talimatlara][nginx-custom] bakın
* Tüm komutların bir süper kullanıcı (örn. `root`) olarak yürütülmesi
* Paketleri indirmek için `https://repo.wallarm.com` adresine erişim. Erişimin güvenlik duvarı tarafından engellenmediğinden emin olun
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com` veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com` adresine erişim. Erişim yalnızca proxy sunucusu üzerinden yapılandırılabiliyorsa, [talimatları][configure-proxy-balancer-instr] kullanın
* Saldırı tespit kurallarının güncellemelerini indirmek ve ayrıca [allowlisted, denylisted veya graylisted][ip-lists-docs] ülkeleriniz, bölgeleriniz veya veri merkezleriniz için kesin IP'leri almak amacıyla aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"
* Kurulu metin düzenleyici **vim**, **nano** veya herhangi biri. Bu talimatta **vim** kullanılır