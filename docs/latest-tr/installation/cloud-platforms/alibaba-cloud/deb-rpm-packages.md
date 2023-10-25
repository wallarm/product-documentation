# Alibaba Cloud'da DEB veya RPM paketlerinden filtreleme düğümünün kurulumu

Bu hızlı rehber, ayrı bir Alibaba Cloud örneğine kaynak paketlerden filtreleme düğümünü kurma adımlarını sağlar. Bu rehberi izleyerek, desteklenen işletim sistemi imajından bir örnek oluşturacak ve bu işletim sistemine Wallarm filtreleme düğümünü kuracaksınız.

!!! uyarı "Talimatların sınırlamaları"
    Bu talimatlar, yük dengelemesinin ve düğüm otomatik ölçeklendirmesinin konfigürasyonunu kapsamaz. Bu bileşenleri kendiniz ayarlıyorsanız, [Alibaba Cloud Elastic Compute Service (ECS) üzerindeki talimatlara](https://www.alibabacloud.com/product/ecs) göz atmanızı öneririz.

## Gereksinimler

* [Alibaba Cloud Konsolu](https://account.alibabacloud.com/login/login.htm)na erişim
* İki faktörlü kimlik doğrulamanın devre dışı bırakıldığı **Yönetici** rolüne ve [ABD Bulutu](https://us1.my.wallarm.com/) veya [AB Bulutu](https://my.wallarm.com/) için Wallarm Konsolundaki hesaba erişim

## Filtreleme düğümü kurulum seçenekleri

Filtreleme düğümü web sunucusu veya [API ağ geçidi](https://www.wallarm.com/what/the-concept-of-an-api-gateway) modülü olarak işletildiğinden, işletim sistemine filtreleme düğümü paketleriyle birlikte web sunucusu veya API ağ geçidi paketleri kurulmalıdır.

Aşağıdaki listeden uygulama mimariniz için en uygun olan web sunucusu veya API ağ geçidini seçebilirsiniz:

* [Filtreleme düğümünü NGINX Stable modülü olarak kurun](#installing-the-filtering-node-as-the-nginx-stable-module)
* [Filtreleme düğümünü NGINX Plus modülü olarak kurun](#installing-the-filtering-node-as-the-nginx-plus-module)

## Filtreleme düğümünü NGINX Stable modülü olarak kurma

Alibaba Cloud örneğinde filtreleme düğümünü NGINX Stable modülü olarak kurmak için:

1. Wallarm tarafından desteklenen işletim sistemi imajından bir Alibaba Cloud örneği oluşturun [Alibaba Cloud talimatlarına](https://www.alibabacloud.com/help/doc-detail/87190.htm) göre:

    * Debian 11.x Bullseye
    * Ubuntu 18.04 Bionic
    * Ubuntu 20.04 Focal
    * Ubuntu 22.04 Jammy
    * CentOS 7.x
    * AlmaLinux
    * Rocky Linux
    * Oracle Linux 8.x
2. Oluşturulan örneğe [Alibaba Cloud talimatlarına](https://www.alibabacloud.com/help/doc-detail/71529.htm) göre bağlanın.
3. Örnekte, NGINX Stable ve Wallarm filtreleme düğümü paketlerini [Wallarm talimatlarına](../../../installation/nginx/dynamic-module.md) göre yükleyin.

Ayrı bir örnekte postanalytics modülünü kurmak için, lütfen adımları 1-2'yi tekrarlayın ve postanalytics modülünü [Wallarm talimatlarına](../../../admin-en/installation-postanalytics-en.md) göre yükleyin.

## Filtreleme düğümünü NGINX Plus modülü olarak kurma

Alibaba Cloud örneğinde filtreleme düğümünü NGINX Plus modülü olarak kurmak için:

1. Wallarm tarafından desteklenen işletim sistemi imajından bir Alibaba Cloud örneği oluşturun [Alibaba Cloud talimatlarına](https://www.alibabacloud.com/help/doc-detail/87190.htm) göre:

    * Debian 11.x Bullseye
    * Ubuntu 18.04 Bionic
    * Ubuntu 20.04 Focal
    * Ubuntu 22.04 Jammy
    * CentOS 7.x
    * AlmaLinux
    * Rocky Linux
    * Oracle Linux 8.x
2. Oluşturulan örneğe [Alibaba Cloud talimatlarına](https://www.alibabacloud.com/help/doc-detail/71529.htm) göre bağlanın.
3. Örnekte, NGINX Plus ve Wallarm filtreleme düğümü paketlerini [Wallarm talimatlarına](../../../installation/nginx/dynamic-module.md) göre yükleyin.

Ayrı bir örnekte postanalytics modülünü kurmak için, lütfen adımları 1-2'yi tekrarlayın ve postanalytics modülünü [Wallarm talimatlarına](../../../admin-en/installation-postanalytics-en.md) göre yükleyin.
