# Alibaba Cloud'a Wallarm Docker Görüntüsünün Dağıtımı

Bu hızlı rehber, [NGINX tabanlı Wallarm düğümünün Docker görüntüsünü](https://hub.docker.com/r/wallarm/node) [Alibaba Cloud Elastic Compute Service (ECS)](https://www.alibabacloud.com/product/ecs) kullanarak Alibaba Cloud platformuna dağıtma adımlarını sağlar.

!!! warning "Talimatların sınırlamaları"
    Bu talimatlar, yük dengelemeyi ve düğümün otomatik ölçeklendirilmesini kapsamaz. Bu bileşenleri kendiniz kurarken, uygun [Alibaba Cloud belgesini](https://www.alibabacloud.com/help/product/27537.htm?spm=a2c63.m28257.a1.82.dfbf5922VNtjka) okumanızı öneririz.

## Kullanım durumları

--8<-- "../include/waf/installation/cloud-platforms/alibaba-ecs-use-cases.md"

## Gereksinimler

* [Alibaba Cloud Console](https://account.alibabacloud.com/login/login.htm) erişimi
* İki faktörlü kimlik doğrulaması devre dışı bırakılan **Yönetici** rolüne ve [ABD Bulutu](https://us1.my.wallarm.com/) veya [AB Bulutu](https://my.wallarm.com/) için Wallarm Console'da hesaba erişim.

## Wallarm düğüm Docker konteynır yapılandırması seçenekleri

--8<-- "../include/waf/installation/docker-running-options.md"

## Çevre değişkenleri üzerinden yapılandırılan Wallarm düğüm Docker konteynırının dağıtılması

Alibaba Cloud örneğini oluşturmalı ve bu örnekte Docker konteynırını çalıştırmalısınız. Bu adımları Alibaba Cloud Console veya [Alibaba Cloud CLI](https://www.alibabacloud.com/help/doc-detail/25499.htm) üzerinden gerçekleştirebilirsiniz. Bu talimatlarda, Alibaba Cloud Console kullanılıyor.

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. Alibaba Cloud Console'u açın → hizmetlerin listesi → **Elastic Compute Service** → **Instances**.
1. [Alibaba Cloud talimatlarını](https://www.alibabacloud.com/help/doc-detail/87190.htm?spm=a2c63.p38356.b99.137.77df24df7fJ2XX) ve aşağıdaki yönergeleri izleyerek örneği oluşturun:

    * Örnek, herhangi bir işletim sistemi görüntüsüne dayanabilir.
    * Örneğin dış kaynaklar için kullanılabilir olması gerektiğinden, kamu IP adresi veya alan adı örnek ayarlarında yapılandırılmalıdır.
    * Örnek ayarları, [örneğe bağlantı kurmak için kullanılan yöntemi](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l) yansıtmalıdır.
1. [Alibaba Cloud belgelerinde](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l) açıklanan yöntemlerden biriyle örneğe bağlanın.
1. Docker paketlerini, [uygun işletim sistemi için talimatlara](https://docs.docker.com/engine/install/#server) göre, örnekte yükleyin.
1. Kopyalanan Wallarm belirteci ile örneğin çevre değişkenini ayarlayın, bu belirteç örneğin Wallarm Cloud'a bağlanmak için kullanılacaktır:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. `docker run` komutunu kullanarak, geçirilen çevre değişkenleri ve bağlanmış yapılandırma dosyası ile Wallarm düğüm Docker konteynırını çalıştırın:

    === "Wallarm ABD Bulutu için Komut"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e NGINX_BACKEND=<WALLARM_ILE_KORUNACAK_HOST> -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/node:4.8.0-1
        ```
    === "Wallarm AB Bulutu için Komut"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e NGINX_BACKEND=<WALLARM_ILE_KORUNACAK_HOST> -p 80:80 wallarm/node:4.8.0-1
        ```
        
    * `-p`: filtreleme düğümünün dinlediği port. Değer, örneğin portu ile aynı olmalıdır.
    * `-e`: filtreleme düğümü yapılandırması ile çevre değişkenleri (kullanılabilir değişkenler aşağıdaki tabloda sıralanmıştır). Lütfen `WALLARM_API_TOKEN` değerinin açıkça iletilememesi gerektiğini unutmayın.

        --8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"
1. Filtreleme düğüm işlemi(https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l) ve [Kanteynır"],
