# GCP Üzerinde DEB veya RPM Paketlerinden Filtreleme Noktası Kurulumu

Bu hızlı rehber, ayrı bir Google Engine örneğinde kaynak paketlerinden filtreleme düğümünü kurmanın adımlarını sağlar. Bu rehberi takip ederek, desteklenen işletim sistemi görüntüsünden bir örnek oluşturacak ve bu işletim sistemi üzerinde Wallarm filtreleme düğümünü kuracaksınız.

!!! Uyarı "Talimatların sınırlamaları"
    Bu talimatlar, yük dengelemeyi ve düğüm ölçeklendirmeyi kapsamaz. Bu bileşenleri sizin belirlediğiniz takdirde, [GCP talimatlarına](https://cloud.google.com/compute/docs/load-balancing-and-autoscaling) göz atmanızı öneririz.

## Gereklilikler

* Aktif GCP hesabı
* [GCP projesi oluşturuldu](https://cloud.google.com/resource-manager/docs/creating-managing-projects)
* Wallarm Konsolu'ndaki **Yönetici** rolüyle hesaba erişim ve [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için iki faktörlü kimlik doğrulama devre dışı bırakıldı

## Filtreleme düğümü kurulum seçenekleri

Filtreleme düğümü, web sunucusu veya [API geçidi](https://www.wallarm.com/what/the-concept-of-an-api-gateway) modülü olarak çalıştığından, web sunucusu veya API geçidi paketleri, filtreleme düğümü paketleri ile birlikte işletim sistemine kurulmalıdır.

Aşağıdaki listeden uygulama mimariniz için en uygun web sunucusunu veya API geçidini seçebilirsiniz:

* [Filtreleme düğümünü NGINX Stable modülü olarak yükleyin](#installing-the-filtering-node-as-the-nginx-stable-module)
* [Filtreleme düğümünü NGINX Plus modülü olarak yükleyin](#installing-the-filtering-node-as-the-nginx-plus-module)

## Filtreleme düğümünü NGINX Stable modülü olarak yüklemenin yolu

Google Engine örneğinde filtreleme düğümünü NGINX Stable modülü olarak yüklemek için:

1. Wallarm'ın desteklediği işletim sistemi görüntüsünden bir Google Engine örneği oluşturun, [GCP talimatlarına](https://cloud.google.com/compute/docs/instances/create-start-instance#publicimage) göre:

    * Debian 11.x Bullseye
    * Ubuntu 18.04 Bionic
    * Ubuntu 20.04 Focal
    * Ubuntu 22.04 Jammy
    * CentOS 7.x
    * AlmaLinux
    * Rocky Linux
    * Oracle Linux 8.x
2. Oluşturulan örneğe [GCP talimatlarına](https://cloud.google.com/compute/docs/instances/connecting-to-instance) göre bağlanın.
3. Örnekte, NGINX Stable ve Wallarm filtreleme düğümü paketlerini [Wallarm talimatlarına](../../../installation/nginx/dynamic-module.md) göre yükleyin.

Postanalytics modülünü ayrı bir örnekte yüklemek için, lütfen adımları 1-2'yi tekrarlayın ve postanalytics modülünü [Wallarm talimatlarına](../../../admin-en/installation-postanalytics-en.md) göre yükleyin.

## Filtreleme düğümünü NGINX Plus modülü olarak yüklemenin yolu

Google Engine örneğinde filtreleme düğümünü NGINX Plus modülü olarak yüklemek için:

1. Wallarm'ın desteklediği işletim sistemi görüntüsünden bir Google Engine örneği oluşturun, [GCP talimatlarına](https://cloud.google.com/compute/docs/instances/create-start-instance#publicimage) göre:

    * Debian 11.x Bullseye
    * Ubuntu 18.04 Bionic
    * Ubuntu 20.04 Focal
    * Ubuntu 22.04 Jammy
    * CentOS 7.x
    * AlmaLinux
    * Rocky Linux
    * Oracle Linux 8.x
2. Oluşturulan örneğe [GCP talimatlarına](https://cloud.google.com/compute/docs/instances/connecting-to-instance) göre bağlanın.
3. Örnekte, NGINX Plus ve Wallarm filtreleme düğümü paketlerini [Wallarm talimatlarına](../../../installation/nginx/dynamic-module.md) göre yükleyin.

Postanalytics modülünü ayrı bir örnekte yüklemek için, lütfen adımları 1-2'yi tekrarlayın ve postanalytics modülünü [Wallarm talimatlarına](../../../admin-en/installation-postanalytics-en.md) göre yükleyin.