* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console'da **Administrator** rolüne sahip bir hesaba erişim ve iki faktörlü kimlik doğrulamanın kapalı olması
* SELinux'un devre dışı bırakılmış olması veya [talimatlara][configure-selinux-instr] uygun olarak yapılandırılmış olması
* Tüm komutların süper kullanıcı (ör. `root`) olarak çalıştırılması
* Paketleri indirmek için `https://repo.wallarm.com` adresine erişim sağlanması. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* US Wallarm Cloud ile çalışılıyorsa `https://us1.api.wallarm.com` adresine veya EU Wallarm Cloud ile çalışılıyorsa `https://api.wallarm.com` adresine erişim sağlanması. Erişim yalnızca proxy sunucusu üzerinden yapılandırılabiliyorsa, [talimatları][configure-proxy-balancer-instr] kullanın
* Kurulu metin düzenleyici **vim**, **nano** veya başka bir düzenleyici. Bu makaledeki komutlarda **vim** kullanılmıştır