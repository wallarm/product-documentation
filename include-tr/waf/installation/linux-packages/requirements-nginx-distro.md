* **Yönetici** rolüne sahip hesaba erişim ve Wallarm Konsolu'nda iki faktörlü kimlik doğrulamanın devre dışı bırakılması [ABD Bulutu](https://us1.my.wallarm.com/) veya [AB Bulutu](https://my.wallarm.com/) için
* SELinux, [talimatlara][configure-selinux-instr] göre devre dışı bırakıldı veya yapılandırıldı 
* Tüm komutların bir süper kullanıcı (örneğin `root`) olarak yürütülmesi
* Paketleri indirmek için `https://repo.wallarm.com` adresine erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* ABD Wallarm Bulutu ile çalışmak için `https://us1.api.wallarm.com`'a veya AB Wallarm Bulutu ile çalışmak için `https://api.wallarm.com`'a erişim. Erişim yalnızca proxy sunucusu üzerinden yapılandırılabilirse, o zaman [talimatları][configure-proxy-balancer-instr] kullanın
* Google Cloud Storage'ın IP adreslerine [link](https://www.gstatic.com/ipranges/goog.json) içerisinde listelenenlere erişim. Tam ülkeleri, bölgeleri veya veri merkezlerini, tekil IP adreslerinin yerine [izin verme, reddetme veya gri liste][ip-lists-docs] yaptığınızda, Wallarm düğümü, IP listelerindeki girişlerle ilgili kesin IP adreslerini Google Depolama'da barındırılan toplu veritabanından alır
* Yüklü metin düzenleyici **vim**, **nano** veya başka bir şey. Talimatta, **vim** kullanılır
