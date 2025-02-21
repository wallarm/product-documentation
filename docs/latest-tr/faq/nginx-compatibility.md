# Wallarm filtreleme nodunun NGINX sürümleriyle uyumluluğu

Ortamınızda kurulu olan NGINX sürümü stable, Plus veya Debian/CentOS deposundan yüklenen sürüm dışında ise, Wallarm kurulumu için bu belgede anlatılan adımları izleyin.

## Wallarm filtreleme nodu, NGINX mainline ile uyumlu mu?

Hayır, Wallarm filtreleme nodu NGINX `mainline` ile uyumlu değildir. Wallarm nodunu aşağıdaki yöntemlerle kurabilirsiniz:

* Aşağıdaki [talimatları](../installation/nginx/dynamic-module.md) izleyerek resmi açık kaynak NGINX `stable` versiyonuna bağlanın
* Debian/CentOS depolarından kurulu NGINX'e [bu talimatları](../installation/nginx/dynamic-module-from-distr.md) izleyerek bağlanın
* Aşağıdaki [talimatları](../installation/nginx-plus.md) izleyerek resmi ticari NGINX Plus'a bağlanın

## Wallarm filtreleme nodu, NGINX'in özel derlemesiyle uyumlu mu?

Evet, Wallarm modülü, Wallarm paketleri yeniden derlendikten sonra NGINX'in özel derlemesine entegre edilebilir. Paketlerin yeniden derlenmesi için lütfen [Wallarm technical support team](mailto:support@wallarm.com) ile iletişime geçin ve aşağıdaki verileri gönderin:

* Linux çekirdek sürümü: `uname -a`
* Linux dağıtımı: `cat /etc/*release`
* NGINX sürümü:

    * [NGINX official build](https://nginx.org/en/linux_packages.html): `/usr/sbin/nginx -V`
    * NGINX custom build: `<path to nginx>/nginx -V`

* Uyumluluk imzası:
  
      * [NGINX official build](https://nginx.org/en/linux_packages.html): `egrep -ao '.,.,.,[01]{33}' /usr/sbin/nginx`
      * NGINX custom build: `egrep -ao '.,.,.,[01]{33}' <path to nginx>/nginx`

* NGINX worker süreçlerini çalıştıran kullanıcı (ve kullanıcının grubu): `grep -w 'user' <path-to-the-NGINX-configuration-files/nginx.conf>`