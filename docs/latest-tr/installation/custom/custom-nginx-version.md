# Özel NGINX Paketleri

[all-in-one installation](../../installation/nginx/all-in-one.md) tarafından desteklenen sürümlerden farklı, örneğin stabil sürüm, mainline NGINX Plus veya dağıtım sürümü gibi bir NGINX sürümü için Wallarm'a ihtiyacınız varsa, aşağıdaki talimatları izleyerek özel bir Wallarm derlemesi talep edebilirsiniz.

Wallarm modülü, NGINX `mainline` dahil olmak üzere, özel bir NGINX derlemesine Wallarm paketlerini yeniden derleyerek entegre edilebilir. Paketleri yeniden derlemek için, lütfen [Wallarm technical support](mailto:support@wallarm.com) ekibi ile iletişime geçin ve aşağıdaki bilgileri sağlayın:

* Linux çekirdek sürümü: `uname -a`
* Linux dağıtımı: `cat /etc/*release`
* NGINX sürümü:

    * [NGINX official build](https://nginx.org/en/linux_packages.html): `/usr/sbin/nginx -V`
    * NGINX custom build: `<path to nginx>/nginx -V`

* Uyumluluk imzası:
  
      * [NGINX official build](https://nginx.org/en/linux_packages.html): `egrep -ao '.,.,.,[01]{33}' /usr/sbin/nginx`
      * NGINX custom build: `egrep -ao '.,.,.,[01]{33}' <path to nginx>/nginx`

* NGINX worker süreçlerini çalıştıran kullanıcı (ve kullanıcının grubu): `grep -w 'user' <path-to-the-NGINX-configuration-files/nginx.conf>`