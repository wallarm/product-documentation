# Özel NGINX Paketleri

Stabil versiyondan farklı bir NGINX versiyonu için Wallarm DEB/RPM paketlerine ihtiyacınız varsa, NGINX Plus veya dağıtım versiyonu, bu talimatları izleyerek özel bir Wallarm derlemesi talep edebilirsiniz.

Varsayılan olarak, Wallarm DEB/RPM paketleri aşağıdaki NGINX versiyonları için kullanılabilir:

* Resmi açık kaynaklı NGINX `stabil` - [kurulum talimatlarına](../nginx/dynamic-module.md) bakın
* Dağıtım sağlanan NGINX - [kurulum talimatlarına](../nginx/dynamic-module-from-distr.md) bakın
* Resmi ticari NGINX Plus - [kurulum talimatlarına](../nginx-plus.md) bakın

Wallarm modülü, NGINX `mainline` dahil olmak üzere özel bir NGINX derlemesiyle entegre edilebilir. Wallarm paketlerini yeniden derlemek için lütfen [Wallarm teknik destek](mailto:support@wallarm.com) ekibi ile iletişime geçin ve aşağıdaki bilgileri sağlayın:

* Linux çekirdek versiyonu: `uname -a`
* Linux dağıtımı: `cat /etc/*release`
* NGINX versiyonu:

    * [NGINX resmi derlemesi](https://nginx.org/en/linux_packages.html): `/usr/sbin/nginx -V`
    * NGINX özel derleme: `<nginx'in_yolu>/nginx -V`

* Uyumluluk imzası:
  
      * [NGINX resmi derlemesi](https://nginx.org/en/linux_packages.html): `egrep -ao '.,.,.,[01]{33}' /usr/sbin/nginx`
      * NGINX özel derlemesi: `egrep -ao '.,.,.,[01]{33}' <nginx'in_yolu>/nginx`

* NGINX işçi süreçlerini çalıştıran kullanıcı (ve kullanıcının grubu): `grep -w 'user' <NGINX-konfigürasyon-dosyalarının-yolu/nginx.conf>`