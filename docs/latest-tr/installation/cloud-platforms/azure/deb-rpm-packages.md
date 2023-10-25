# Azure üzerinde DEB veya RPM paketlerinden filtreleme düğümünün kurulumu

Bu hızlı kılavuz, filtreleme düğümünün kaynak paketlerinden bir ayrı Azure örneğine kurulum aşamalarını sağlar. Bu kılavuz uygulanarak, desteklenen işletim sistemi görüntüsünden bir örnek oluşturacak ve bu işletim sistemi üzerinde Wallarm filtreleme düğümünü kuracaksınız.

!!! warning "Talimatların sınırlamaları"
    Bu talimatlar yük dengelemesinin ve düğüm otomatik ölçeklemesinin yapılandırılmasını kapsamamaktadır. Bu bileşenleri kendiniz kuruyorsanız, [Azure talimatlarını](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/tutorial-load-balancer) gözden geçirmenizi öneririz.

## Gereksinimler

* Aktif Azure aboneliği
* **Yönetici** rolüne sahip hesaba ve Wallarm Konsolunda [US Bulut](https://us1.my.wallarm.com/) veya [EU Bulut](https://my.wallarm.com/) için iki faktörlü kimlik doğrulaması kapalı olan hesaba erişim 

## Filtreleme düğümü kurulum seçenekleri

Filtreleme düğümü web sunucusu veya [API ağ geçidi](https://www.wallarm.com/what/the-concept-of-an-api-gateway) modülü olarak çalıştığından, işletim sistemi üzerinde filtreleme düğümü paketleriyle birlikte web sunucusu veya API ağ geçidi paketlerinin kurulması gerekmektedir.

Aşağıdaki listeyi kullanarak uygulama mimariniz için en uygun web sunucusunu veya API ağ geçidini seçebilirsiniz:

* [Filtreleme düğümünün NGINX Sabit modülü olarak kurulumu](#installing-the-filtering-node-as-the-nginx-stable-module)
* [Filtreleme düğümünün NGINX Plus modülü olarak kurulumu](#installing-the-filtering-node-as-the-nginx-plus-module)

## Filtreleme düğümünün NGINX Sabit modülü olarak kurulumu

Azure örneğinde filtreleme düğümünün NGINX Sabit modülü olarak kurulum için:

1. Wallarm tarafından desteklenen işletim sistemi görüntüsünden bir Azure örneği oluşturun, [Azure talimatları](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/quick-create-portal) uygulanarak:

    * Debian 11.x Bullseye
    * Ubuntu 18.04 Bionic
    * Ubuntu 20.04 Focal
    * Ubuntu 22.04 Jammy
    * AlmaLinux
    * Rocky Linux
    * Oracle Linux 8.x
2. Oluşturulan örneğe [Azure talimatları](https://docs.microsoft.com/en-us/azure/bastion/bastion-connect-vm-ssh) uygulanarak bağlanın.
3. Örnekte, NGINX Sabit ve Wallarm filtreleme düğümünün paketlerini [Wallarm talimatları](../../../installation/nginx/dynamic-module.md) uygulanarak kurun.

Postanalytics modülünü ayrı bir örnekte yüklemek için, adımları 1-2'yi tekrarlayın ve postanalytics modülünü [Wallarm talimatları](../../../admin-en/installation-postanalytics-en.md) uygulanarak yükleyin.

## Filtreleme düğümünün NGINX Plus modülü olarak kurulumu

Azure örneğinde filtreleme düğümünün NGINX Plus modülü olarak kurulum için:

1. Wallarm tarafından desteklenen işletim sistemi görüntüsünden bir Azure örneği oluşturun, [Azure talimatları](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/quick-create-portal) uygulanarak:

    * Debian 11.x Bullseye
    * Ubuntu 18.04 Bionic
    * Ubuntu 20.04 Focal
    * Ubuntu 22.04 Jammy
    * CentOS 7.x
    * AlmaLinux
    * Rocky Linux
    * Oracle Linux 8.x
2. Oluşturulan örneğe [Azure talimatları](https://docs.microsoft.com/en-us/azure/bastion/bastion-connect-vm-ssh) uygulanarak bağlanın.
3. Örnekte, NGINX Plus ve Wallarm filtreleme düğümünün paketlerini [Wallarm talimatları](../../../installation/nginx/dynamic-module.md) uygulanarak kurun.

Postanalytics modülünü ayrı bir örnekte yüklemek için, adımları 1-2'yi tekrarlayın ve postanalytics modülünü [Wallarm talimatları](../../../admin-en/installation-postanalytics-en.md) uygulanarak yükleyin.
