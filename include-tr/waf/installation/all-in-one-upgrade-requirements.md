* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console'da **Administrator** rolüne sahip hesaba erişim.
* Hepsi bir arada Wallarm yükleyicisini indirmek için `https://meganode.wallarm.com` adresine erişim. Erişimin bir güvenlik duvarı tarafından engellenmediğinden emin olun.
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com` adresine veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com` adresine erişim. Erişim yalnızca proxy sunucusu üzerinden yapılandırılabiliyorsa, [talimatları][configure-proxy-balancer-instr] kullanın.
* Tüm komutların bir süper kullanıcı olarak (örn. `root`) çalıştırılması.
* Saldırı tespit kuralları ve API spesifikasyonları güncellemelerini indirmek ve ayrıca izin verilen, engellenen veya gri listede olan ülkeleriniz, bölgeleriniz veya veri merkezleriniz için kesin IP'leri almak üzere aşağıdaki IP adreslerine erişim.

    --8<-- "../include/wallarm-cloud-ips.md"