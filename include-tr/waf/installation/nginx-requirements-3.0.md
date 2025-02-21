* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console'da **Administrator** veya **Deploy** rolüyle ve iki faktörlü kimlik doğrulamasının devre dışı bırakılmış olması
* [instructions][configure-selinux-instr] talimatlarına göre SELinux'un devre dışı bırakılmış veya yapılandırılmış olması
* Tüm komutların süper kullanıcı (örn. `root`) olarak çalıştırılması
* Farklı sunucularda istek işleme ve postanalytics için: [instructions][install-postanalytics-instr] talimatlarına göre ayrı bir sunucuya postanalytics kurulmuş olması
* Paketleri indirmek için `https://repo.wallarm.com` adresine erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com:444` adresine veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com:444` adresine erişim. Erişim yalnızca proxy sunucusu üzerinden yapılandırılabiliyorsa, [instructions][configure-proxy-balancer-instr] talimatlarını kullanın
* Aşağıdaki IP adreslerine, saldırı tespit kuralları güncellemelerini indirmek ve [allowlisted, denylisted, or graylisted][ip-lists-docs] ülkeler, bölgeler veya veri merkezleri için doğru IP'leri almak amacıyla erişim

    --8<-- "../include/wallarm-cloud-ips.md"
* Yüklü metin düzenleyici **vim**, **nano** veya herhangi başka bir düzenleyici. Talimatlarda **vim** kullanılmıştır