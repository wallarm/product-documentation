# Wallarm filtreleme düğümünün NGINX sürümleriyle uyumluluğu

Ortamınıza kurulu NGINX sürümü stable, Plus veya Debian/CentOS deposundan kurulan sürümden farklıysa, Wallarm’ı nasıl kuracağınızı bu belgeden öğrenin.

## Wallarm filtreleme düğümü NGINX mainline ile uyumlu mu?

Hayır, Wallarm filtreleme düğümü NGINX `mainline` ile uyumsuzdur. Wallarm düğümünü şu şekillerde kurabilirsiniz:

* resmi açık kaynak NGINX `stable` ile bağlayın, bu [talimatları](../installation/nginx/dynamic-module.md) izleyin
* Debian/CentOS depolarından kurulan NGINX ile bağlayın, bu [talimatları](../installation/nginx/dynamic-module-from-distr.md) izleyin
* resmi ticari NGINX Plus ile bağlayın, bu [talimatları](../installation/nginx-plus.md) izleyin

## Wallarm filtreleme düğümü NGINX’in özel derlemesiyle uyumlu mu?

Evet, Wallarm modülü, Wallarm paketleri yeniden derlendikten sonra NGINX’in özel derlemesine bağlanabilir. Paketleri yeniden derlemek için lütfen [Wallarm teknik destek ekibi](mailto:support@wallarm.com) ile iletişime geçin ve aşağıdaki verileri gönderin:

* Linux çekirdek sürümü: `uname -a`
* Linux dağıtımı: `cat /etc/*release`
* NGINX sürümü:

    * [NGINX resmi derlemesi](https://nginx.org/en/linux_packages.html): `/usr/sbin/nginx -V`
    * NGINX özel derlemesi: `<path to nginx>/nginx -V`

* Uyumluluk imzası:
  
      * [NGINX resmi derlemesi](https://nginx.org/en/linux_packages.html): `egrep -ao '.,.,.,[01]{33}' /usr/sbin/nginx`
      * NGINX özel derlemesi: `egrep -ao '.,.,.,[01]{33}' <path to nginx>/nginx`

* NGINX worker süreçlerini çalıştıran kullanıcı (ve kullanıcının grubu): `grep -w 'user' <path-to-the-NGINX-configuration-files/nginx.conf>`