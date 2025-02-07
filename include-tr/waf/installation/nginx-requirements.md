* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) Wallarm Console üzerinden **Administrator** veya **Deploy** rolü ile hesaba erişim sağlanmış olmalı ve iki faktörlü kimlik doğrulama devre dışı bırakılmış olmalıdır
* SELinux devre dışı bırakılmış veya [talimatlara][configure-selinux-instr] göre yapılandırılmış olmalıdır
* Tüm komutlar süper kullanıcı (örneğin `root`) olarak çalıştırılmalıdır
* İstek işleme ve postanalytics farklı sunucularda gerçekleştirilecekse: postanalytics, [talimatlara][install-postanalytics-instr] göre ayrı bir sunucuya kurulmuş olmalıdır
* Paketleri indirmek için `https://repo.wallarm.com` adresine erişim sağlanmalıdır. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olunmalıdır
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com:444` adresine veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com:444` adresine erişim sağlanmalıdır. Eğer erişim sadece proxy sunucu üzerinden yapılandırılabiliyorsa, [talimatlara][configure-proxy-balancer-instr] göre yapılandırınız
* Yüklü metin düzenleyici **vim**, **nano** veya benzeri bir program olmalıdır. Bu talimatlarda **vim** kullanılmaktadır