* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console’da **Administrator** rolüyle, iki faktörlü doğrulamanın devre dışı bırakıldığı hesaba erişim
* SELinux’un devre dışı bırakılmış olması veya [talimatlara][configure-selinux-instr] göre yapılandırılmış olması
* NGINX sürümü 1.24.0

    !!! info "Custom NGINX versions"
        Farklı bir sürüm kullanıyorsanız, [Wallarm modülünün özel NGINX derlemesine nasıl bağlanılacağı][nginx-custom] talimatlarına bakın
* Tüm komutların süper kullanıcı (ör. `root`) olarak çalıştırılması
* Paketleri indirmek için `https://repo.wallarm.com` erişimi. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com` veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com` erişimi. Erişim sadece proxy sunucu üzerinden yapılandırılabiliyorsa, [talimatları][configure-proxy-balancer-instr] kullanın
* Saldırı tespit kurallarının güncellemelerini indirmek ve [izin verilen, reddedilen veya gri listeye alınan][ip-lists-docs] ülkeler, bölgeler veya veri merkezleri için doğru IP’leri almak üzere aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"
* Kurulmuş metin düzenleyici **vim**, **nano** veya başka bir düzenleyici. Talimatlarda **vim** kullanılmıştır