# Özel NGINX Paketleri

[hepsi bir arada kurulum](../../installation/nginx/all-in-one.md) tarafından desteklenen sürümlerden farklı bir NGINX sürümü için, örneğin kararlı sürüm, mainline NGINX Plus veya dağıtım sürümü için Wallarm’a ihtiyacınız varsa, aşağıdaki talimatları izleyerek özel bir Wallarm derlemesi talep edebilirsiniz.

Wallarm modülü, Wallarm paketleri yeniden derlenerek, NGINX `mainline` dahil olmak üzere NGINX’in özel bir derlemesiyle entegre edilebilir. Paketleri yeniden derlemek için lütfen [Wallarm teknik destek](mailto:support@wallarm.com) ekibiyle iletişime geçin ve aşağıdaki bilgileri sağlayın:

* Linux çekirdek sürümü: `uname -a`
* Linux dağıtımı: `cat /etc/*release`
* NGINX sürümü:

    * [NGINX resmi derleme](https://nginx.org/en/linux_packages.html): `/usr/sbin/nginx -V`
    * NGINX özel derleme: `<path to nginx>/nginx -V`

* Uyumluluk imzası:
  
      * [NGINX resmi derleme](https://nginx.org/en/linux_packages.html): `egrep -ao '.,.,.,[01]{33}' /usr/sbin/nginx`
      * NGINX özel derleme: `egrep -ao '.,.,.,[01]{33}' <path to nginx>/nginx`

* NGINX worker süreçlerini çalıştıran kullanıcı (ve kullanıcının grubu): `grep -w 'user' <path-to-the-NGINX-configuration-files/nginx.conf>`