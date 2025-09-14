* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console’da **Administrator** veya **Deploy** rolüne sahip hesaba erişim
* SELinux’un devre dışı bırakılmış olması veya [talimatlar][configure-selinux-instr] doğrultusunda yapılandırılmış olması
* Tüm komutların süper kullanıcı olarak (örn. `root`) çalıştırılması
* İstek işleme ve postanalytics farklı sunucularda olacaksa: postanalytics’in ayrı bir sunucuya [talimatlar][install-postanalytics-instr] doğrultusunda kurulmuş olması
* Paketleri indirmek için `https://repo.wallarm.com` erişimi. Erişimin güvenlik duvarı tarafından engellenmediğinden emin olun
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com:444` veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com:444` erişimi. Erişim yalnızca proxy sunucusu üzerinden yapılandırılabiliyorsa [talimatları][configure-proxy-balancer-instr] kullanın
* Saldırı tespit kurallarına ilişkin güncellemeleri indirmek ve [allowlisted, denylisted, or graylisted][ip-lists-docs] ülkeleriniz, bölgeleriniz veya veri merkezleriniz için kesin IP adreslerini almak amacıyla aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"
* Yüklü bir metin düzenleyici (**vim**, **nano** veya başka biri). Bu talimatta **vim** kullanılmaktadır