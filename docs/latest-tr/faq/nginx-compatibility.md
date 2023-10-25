# Wallarm filtreleme düğümünün NGINX sürümleri ile uyumluluğu

Eğer ortamınızda kurulu olan NGINX sürümü, stable, Plus veya Debian/CentOS deposundan kurulan sürümle farklıysa, bu belgeden Wallarm nasıl kurulacağını öğrenin.

## Wallarm filtreleme düğümü NGINX mainline ile uyumlu mu?

Hayır, Wallarm filtreleme düğümü NGINX `mainline` ile uyumsuzdur. Wallarm düğümünü aşağıdaki yollarla kurabilirsiniz:

* Bu [talimatları](../installation/nginx/dynamic-module.md) takip ederek resmi açık kaynaklı NGINX `stable`'a bağlanın
* Bu [talimatları](../installation/nginx/dynamic-module-from-distr.md) izleyerek Debian/CentOS depolarından kurulan NGINX'e bağlanın
* Bu [talimatları](../installation/nginx-plus.md) takip ederek resmi ticari NGINX Plus'a bağlanın

## Wallarm filtreleme düğümü, özel olarak oluşturulan NGINX ile uyumlu mu?

Evet, Wallarm modülü, Wallarm paketlerini yeniden oluşturduktan sonra özel olarak inşa edilmiş NGINX'e bağlanabilir. Paketleri yeniden oluşturmak için lütfen [Wallarm teknik destek ekibi](mailto:support@wallarm.com) ile iletişime geçin ve aşağıdaki verileri gönderin:

* Linux kernel sürümü: `uname -a`
* Linux dağıtımı: `cat /etc/*release`
* NGINX sürümü:

    * [NGINX resmi inşa](https://nginx.org/en/linux_packages.html): `/usr/sbin/nginx -V`
    * NGINX özel inşa: `<nginx path>/nginx -V`

* Uyumluluk imzası:
  
    * [NGINX resmi inşa](https://nginx.org/en/linux_packages.html): `egrep -ao '.,.,.,[01]{33}' /usr/sbin/nginx`
    * NGINX özel inşa: `egrep -ao '.,.,.,[01]{33}' <nginx path>/nginx`

* NGINX worker süreçlerini çalıştıran kullanıcı (ve kullanıcının grubu): `grep -w 'user' <path-to-the-NGINX-configuration-files/nginx.conf>`