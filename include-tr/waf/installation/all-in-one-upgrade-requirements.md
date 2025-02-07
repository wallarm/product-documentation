* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console'da **Administrator** rolüyle hesaba erişim.
* Tüm bileşenleri içeren Wallarm installer'ı indirmek için `https://meganode.wallarm.com` adresine erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun.
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com` ya da EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com` adresine erişim. Erişim yalnızca proxy sunucusu üzerinden yapılandırılabiliyorsa, [instructions][configure-proxy-balancer-instr] bağlantısını kullanın.
* Tüm komutları süper kullanıcı (örn. `root`) olarak çalıştırma.
* Saldırı tespit kuralları ve API spesifikasyonlarının güncellemelerini indirmek, ayrıca beyaz listede, kara listede veya gri listede yer alan ülkeler, bölgeler ya da veri merkezleri için doğru IP adreslerini almak amacıyla aşağıdaki IP adreslerine erişim.

    --8<-- "../include/wallarm-cloud-ips.md"