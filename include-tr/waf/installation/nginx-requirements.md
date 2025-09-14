* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console'da **Administrator** veya **Deploy** rolüne sahip hesaba erişim
* SELinux'un devre dışı bırakılması veya [talimatlara][configure-selinux-instr] göre yapılandırılması
* Tüm komutların ayrıcalıklı kullanıcı olarak (örn. `root`) çalıştırılması
* İstek işleme ve postanalytics farklı sunucularda olacaksa: postanalytics'in ayrı bir sunucuya [talimatlara][install-postanalytics-instr] göre kurulmuş olması
* Paketleri indirmek için `https://repo.wallarm.com` erişimi. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com:444` veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com:444` erişimi. Erişim yalnızca proxy sunucusu üzerinden yapılandırılabiliyorsa [talimatları][configure-proxy-balancer-instr] kullanın
* **vim**, **nano** veya başka bir metin düzenleyici yüklü. Bu talimatta **vim** kullanılmaktadır