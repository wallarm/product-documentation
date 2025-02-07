* Wallarm Console'da [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için iki faktörlü kimlik doğrulaması kapalı ve **Administrator** rolündeki hesaba erişim
* [Talimatlara][configure-selinux-instr] uygun olarak SELinux'un devre dışı bırakılmış veya yapılandırılmış olması
* NGINX Plus sürüm 29 veya 30 (R29 veya R30)

    !!! info "Custom NGINX Plus versions"
        Farklı bir sürüm kullanıyorsanız, [how to connect the Wallarm module to custom build of NGINX][nginx-custom] üzerindeki talimatlara bakın
* Tüm komutların süper kullanıcı (örn. `root`) olarak çalıştırılması
* Paketleri indirmek için `https://repo.wallarm.com` adresine erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com` adresine veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com` adresine erişim. Erişim yalnızca proxy sunucusu üzerinden yapılandırılabiliyorsa, [instructions][configure-proxy-balancer-instr] talimatlarını kullanın
* Saldırı tespit kurallarının güncellemelerini indirmek ve [allowlisted, denylisted, or graylisted][ip-lists-docs] ülkeler, bölgeler veya veri merkezleri için kesin IP'leri almak üzere aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"
* Yüklü metin düzenleyici **vim**, **nano** veya benzeri; talimatlarda **vim** kullanılmaktadır