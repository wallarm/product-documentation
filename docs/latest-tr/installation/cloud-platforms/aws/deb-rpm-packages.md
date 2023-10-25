# AWS üzerinde DEB veya RPM paketlerinden filtreleme düğümünün kurulumu

Bu hızlı kılavuz, filtreleme düğümünü ayrı bir Amazon EC2 örneğine kaynak paketlerinden kurma adımlarını sağlar. Bu kılavuzu takip ederek, desteklenen işletim sistemi görüntüsünden bir örnek oluşturacak ve bu işletim sistemine Wallarm filtreleme düğümünü kuracaksınız.

!!! uyarı "Talimatların sınırlamaları"
    Bu talimatlar, yük dengelemesi ve düğüm otomatik ölçeklendirmesinin yapılandırılmasını kapsamaz. Bu bileşenleri kendiniz kuruyorsanız, [AWS'nin Elastic Load Balancing hizmeti üzerine talimatların](https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html) gözden geçirmenizi öneririz.

## Gereklilikler

* **admin** izinlerine sahip AWS hesabı ve kullanıcı
* **Yönetici** rolüne ve Wallarm Konsolunda [ABD Bulutu](https://us1.my.wallarm.com/) veya [AB Bulutu](https://my.wallarm.com/) için iki faktörlü kimlik doğrulamanın devre dışı bırakıldığı hesaba erişim

## Filtreleme düğümü kurulum seçenekleri

Filtreleme düğümü, web sunucusu veya [API ağ geçidi](https://www.wallarm.com/what/the-concept-of-an-api-gateway) modülü olarak çalıştığından, filtreleme düğümü paketleriyle birlikte işletim sistemine web sunucusu veya API ağ geçidi paketleri kurulmalıdır.

Uygulama mimariniz için en uygun olan web sunucusu veya API ağ geçidini aşağıdaki listeden seçebilirsiniz:

* [Filtreleme düğümünü NGINX Stable modülü olarak kurun](#installing-the-filtering-node-as-the-nginx-stable-module)
* [Filtreleme düğümünü NGINX Plus modülü olarak kurun](#installing-the-filtering-node-as-the-nginx-plus-module)

## Filtreleme düğümünü NGINX Stable modülü olarak kurma

Amazon EC2 örneğinde filtreleme düğümünü NGINX Stable modülü olarak kurmak için:

1. Wallarm tarafından desteklenen işletim sistemi imajından bir Amazon EC2 örneği oluşturun, [AWS talimatlarına](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-launch-instance) uygun olarak:

    * Debian 11.x Bullseye
    * Ubuntu 18.04 Bionic
    * Ubuntu 20.04 Focal
    * Ubuntu 22.04 Jammy
    * CentOS 7.x
    * AlmaLinux
    * Rocky Linux
    * Oracle Linux 8.x
    * Amazon Linux 2.0.2021x ve altı
2. [AWS talimatlarına](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html) uygun olarak oluşturulan örneğe bağlanın.
3. Örnekte, [Wallarm talimatlarına](../../../installation/nginx/dynamic-module.md) uygun olarak, NGINX Stable ve Wallarm filtreleme düğümünün paketlerini yükleyin.

Postanalytics modülünü ayrı bir örnekte kurmak için, lütfen adımları 1-2'yi tekrarlayın ve postanalytics modülünü [Wallarm talimatlarına](../../../admin-en/installation-postanalytics-en.md) uygun olarak yükleyin.

## Filtreleme düğümünü NGINX Plus modülü olarak kurma

Amazon EC2 örneğinde filtreleme düğümünü NGINX Plus modülü olarak kurmak için:

1. Wallarm tarafından desteklenen işletim sistemi imajından bir Amazon EC2 örneği oluşturun, [AWS talimatlarına](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-launch-instance) uygun olarak:

    * Debian 11.x Bullseye
    * Ubuntu 18.04 Bionic
    * Ubuntu 20.04 Focal
    * Ubuntu 22.04 Jammy
    * CentOS 7.x
    * AlmaLinux
    * Rocky Linux
    * Oracle Linux 8.x
    * Amazon Linux 2.0.2021x ve altı
2. [AWS talimatlarına](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html) uygun olarak oluşturulan örneğe bağlanın.
3. Örnekte, [Wallarm talimatlarına](../../../installation/nginx/dynamic-module.md) uygun olarak, NGINX Plus ve Wallarm filtreleme düğümünün paketlerini yükleyin.

Postanalytics modülünü ayrı bir örnekte kurmak için, lütfen adımları 1-2'yi tekrarlayın ve postanalytics modülünü [Wallarm talimatlarına](../../../admin-en/installation-postanalytics-en.md) uygun olarak yükleyin.