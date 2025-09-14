* Wallarm Console'da [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için **Administrator** rolüne sahip hesaba erişim
* SELinux'un devre dışı bırakılması veya [talimatlara][configure-selinux-instr] göre yapılandırılması
* Tüm komutların süper kullanıcı (ör. `root`) olarak çalıştırılması
* Paketleri indirmek için `https://repo.wallarm.com` adresine erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* US Wallarm Cloud ile çalışıyorsanız `https://us1.api.wallarm.com` adresine, EU Wallarm Cloud ile çalışıyorsanız `https://api.wallarm.com` adresine erişim. Erişim yalnızca proxy sunucusu üzerinden yapılandırılabiliyorsa [talimatları][configure-proxy-balancer-instr] kullanın
* Kurulu bir metin düzenleyici **vim**, **nano** veya başka herhangi bir düzenleyici. Bu makaledeki komutlarda **vim** kullanılır