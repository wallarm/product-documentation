* Hesaba **Yönetici** rolü ve Wallarm Konsolu'nda iki faktörlü doğrulamanın devre dışı bırakıldığı erişim [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için
* SELinux devre dışı veya [talimatlara][configure-selinux-instr] göre yapılandırılmış
* Tüm komutların bir süper kullanıcı (ör. `root`) olarak yürütülmesi
* Paketleri indirmek için `https://repo.wallarm.com` adresine erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* US Wallarm Bulutu ile çalışırken `https://us1.api.wallarm.com` adresine veya EU Wallarm Bulutu ile çalışırken `https://api.wallarm.com` adresine erişim. Erişim yalnızca proxy sunucusu üzerinden yapılandırılabilirse, bu durumda [talimatları][configure-proxy-balancer-instr] kullanın
* Yüklü metin düzenleyicisi **vim**, **nano** veya başka bir şey. Bu makaledeki komutlarda **vim** kullanılır