* Wallarm Console'da [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için **Administrator** rolüyle hesap erişimi ve iki faktörlü kimlik doğrulamasının devre dışı bırakılmış olması
* SELinux'un devre dışı bırakılmış olması veya [instructions][configure-selinux-instr] talimatları doğrultusunda yapılandırılmış olması
* Tüm komutların bir süper kullanıcı (ör. `root`) olarak çalıştırılması
* Paketleri indirebilmek için `https://repo.wallarm.com` adresine erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com` veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com` adresine erişim. Eğer erişim yalnızca proxy sunucu üzerinden yapılandırılabiliyorsa, [instructions][configure-proxy-balancer-instr] talimatlarını kullanın
* Saldırı tespit kurallarına yönelik güncellemeleri indirebilmek ve [allowlisted, denylisted, or graylisted][ip-lists-docs] ülkeler, bölgeler veya veri merkezleri için kesin IP adreslerini alabilmek amacıyla aşağıdaki IP adreslerine erişim
  
    --8<-- "../include/wallarm-cloud-ips.md"
* Kurulu metin düzenleyici **vim**, **nano** veya başka bir düzenleyici. Talimatlarda **vim** kullanılmıştır