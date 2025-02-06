# Wallarm Docker Image'ın Alibaba Cloud'a Dağıtımı

Bu hızlı kılavuz, [NGINX tabanlı Wallarm node'unun Docker görüntüsünü](https://hub.docker.com/r/wallarm/node) [Alibaba Cloud Elastic Compute Service (ECS)](https://www.alibabacloud.com/product/ecs) kullanarak Alibaba Cloud platformuna dağıtım adımlarını sağlar.

!!! warning "Talimatların Sınırlamaları"
    Bu talimatlar, yük dengeleme ve node otomatik ölçeklendirmesinin yapılandırılmasını kapsamamaktadır. Bu bileşenleri kendiniz kuruyorsanız, ilgili [Alibaba Cloud dokümantasyonunu](https://www.alibabacloud.com/help/product/27537.htm?spm=a2c63.m28257.a1.82.dfbf5922VNtjka) okumanızı tavsiye ederiz.

## Kullanım Durumları

--8<-- "../include/waf/installation/cloud-platforms/alibaba-ecs-use-cases.md"

## Gereksinimler

* [Alibaba Cloud Console]'ya erişim (https://account.alibabacloud.com/login/login.htm)
* Wallarm Console için **Administrator** rolüne sahip ve iki faktörlü kimlik doğrulaması devre dışı bırakılmış hesaba erişim ([US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/))
* Saldırı tespit kuralları güncellemelerini indirmek, [API specifications][api-policy-enf-docs] almak ve [allowlisted, denylisted, or graylisted][graylist-docs] ülkeler, bölgeler veya veri merkezleri için doğru IP'leri elde etmek amacıyla aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"

## Wallarm node Docker konteyner yapılandırması için Seçenekler

--8<-- "../include/waf/installation/docker-running-options.md"

## Sadece ortam değişkenleri ile yapılandırılmış Wallarm node Docker konteynerinin Dağıtımı

Sadece ortam değişkenleriyle yapılandırılmış konteynerize Wallarm filtreleme node'unu dağıtmak için, bir Alibaba Cloud örneği oluşturmalı ve bu örnek üzerinde Docker konteynerini çalıştırmalısınız. Bu adımları Alibaba Cloud Console veya [Alibaba Cloud CLI](https://www.alibabacloud.com/help/doc-detail/25499.htm) aracılığıyla gerçekleştirebilirsiniz. Bu talimatlarda Alibaba Cloud Console kullanılmaktadır.

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. Alibaba Cloud Console'u açın → hizmetler listesi → **Elastic Compute Service** → **Instances**.
2. Aşağıdaki yönergeler ve [Alibaba Cloud talimatlarına](https://www.alibabacloud.com/help/doc-detail/87190.htm?spm=a2c63.p38356.b99.137.77df24df7fJ2XX) uygun olarak örneği oluşturun:
    * Örneğin herhangi bir işletim sistemi görüntüsü temel alınarak oluşturulabilir.
    * Örneğin dış kaynaklara erişilebilir olmalıdır; bu nedenle örnek ayarlarında genel IP adresi veya alan adı yapılandırılmalıdır.
    * Örnek ayarları, [örneğe bağlanmak için kullanılan yöntemi](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l) yansıtmalıdır.
3. Aşağıda belirtilen [Alibaba Cloud dokümantasyonunda](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l) açıklanan yöntemlerden biriyle örneğe bağlanın.
4. Örnekte [uygun işletim sistemi için talimatları](https://docs.docker.com/engine/install/#server) izleyerek Docker paketlerini kurun.
5. Örneği Wallarm Cloud'a bağlamak için kullanılacak kopyalanmış Wallarm token'ı ile ortam değişkenini ayarlayın:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
6. Ortam değişkenleri ve monte edilmiş yapılandırma dosyası kullanılarak `docker run` komutu ile Wallarm node Docker konteynerini çalıştırın:

    === "Wallarm US Cloud için Komut"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -e NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/node:5.3.0
        ```
    === "Wallarm EU Cloud için Komut"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -e NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> -p 80:80 wallarm/node:5.3.0
        ```
        
    * `-p`: Filtreleme node'unun dinlediği port. Değer, örnek portuyla aynı olmalıdır.
    * `-e`: Filtreleme node yapılandırmasını içeren ortam değişkenleri (kullanılabilir değişkenler aşağıdaki tabloda listelenmiştir). Lütfen `WALLARM_API_TOKEN` değerinin açıkça iletilmemesinin tavsiye edildiğini unutmayın.

        --8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"
7. [Filtreleme node'unun çalışmasını test edin](#testing-the-filtering-node-operation).

## Monte Edilmiş Dosya ile Yapılandırılmış Wallarm node Docker Konteynerinin Dağıtımı

Ortam değişkenleri ve monte edilmiş dosya ile yapılandırılmış konteynerize Wallarm filtreleme node'unu dağıtmak için, bir Alibaba Cloud örneği oluşturmalı, bu örnek dosya sisteminde filtreleme node yapılandırma dosyasını bulmalı ve Docker konteynerini bu örnekte çalıştırmalısınız. Bu adımları Alibaba Cloud Console veya [Alibaba Cloud CLI](https://www.alibabacloud.com/help/doc-detail/25499.htm) aracılığıyla gerçekleştirebilirsiniz. Bu talimatlarda Alibaba Cloud Console kullanılmaktadır.

--8<-- "../include/waf/installation/get-api-or-node-token.md"
            
1. Alibaba Cloud Console'u açın → hizmetler listesi → **Elastic Compute Service** → **Instances**.
2. Aşağıdaki yönergeler ve [Alibaba Cloud talimatlarına](https://www.alibabacloud.com/help/doc-detail/87190.htm?spm=a2c63.p38356.b99.137.77df24df7fJ2XX) uygun olarak örneği oluşturun:
    * Örneğin herhangi bir işletim sistemi görüntüsü temel alınarak oluşturulabilir.
    * Örneğin dış kaynaklara erişilebilir olmalıdır; bu nedenle örnek ayarlarında genel IP adresi veya alan adı yapılandırılmalıdır.
    * Örnek ayarları, [örneğe bağlanmak için kullanılan yöntemi](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l) yansıtmalıdır.
3. Aşağıda belirtilen [Alibaba Cloud dokümantasyonunda](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l) açıklanan yöntemlerden biriyle örneğe bağlanın.
4. Örnekte [uygun işletim sistemi için talimatları](https://docs.docker.com/engine/install/#server) izleyerek Docker paketlerini kurun.
5. Örneği Wallarm Cloud'a bağlamak için kullanılacak kopyalanmış Wallarm token'ı ile ortam değişkenini ayarlayın:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
6. Örnekte, filtreleme node yapılandırmasını içeren `default` dosyasını barındıran bir dizin oluşturun (örneğin, dizin adı `configs` olabilir). Minimal ayarları içeren dosya örneği:

    ```bash
    server {
        listen 80 default_server;
        listen [::]:80 default_server ipv6only=on;
        #listen 443 ssl;

        server_name localhost;

        #ssl_certificate cert.pem;
        #ssl_certificate_key cert.key;

        root /usr/share/nginx/html;

        index index.html index.htm;

        wallarm_mode monitoring;
        # wallarm_application 1;

        location / {
                proxy_pass http://example.com;
                include proxy_params;
        }
    }
    ```

    [Filtreleme node yönergelerinin yapılandırma dosyasında belirtilebilecek seti →][nginx-waf-directives]
7. Ortam değişkenleri ve monte edilmiş yapılandırma dosyası kullanılarak `docker run` komutu ile Wallarm node Docker konteynerini çalıştırın:

    === "Wallarm US Cloud için Komut"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v <INSTANCE_PATH_TO_CONFIG>:<DIRECTORY_FOR_MOUNTING> -p 80:80 wallarm/node:5.3.0
        ```
    === "Wallarm EU Cloud için Komut"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -v <INSTANCE_PATH_TO_CONFIG>:<CONTAINER_PATH_FOR_MOUNTING> -p 80:80 wallarm/node:5.3.0
        ```

    * `<INSTANCE_PATH_TO_CONFIG>`: Önceki adımda oluşturulan yapılandırma dosyasının yolu. Örneğin, `configs`.
    * `<DIRECTORY_FOR_MOUNTING>`: Yapılandırma dosyasının monte edileceği konteyner dizini. Yapılandırma dosyaları, NGINX tarafından kullanılan aşağıdaki konteyner dizinlerine monte edilebilir:

        * `/etc/nginx/conf.d` — ortak ayarlar
        * `/etc/nginx/sites-enabled` — sanal ana bilgisayar ayarları
        * `/var/www/html` — statik dosyalar

        Filtreleme node yönergeleri, `/etc/nginx/sites-enabled/default` dosyasında belirtilmelidir.
    
    * `-p`: Filtreleme node'unun dinlediği port. Değer, örnek portuyla aynı olmalıdır.
    * `-e`: Filtreleme node yapılandırmasını içeren ortam değişkenleri (kullanılabilir değişkenler aşağıdaki tabloda listelenmiştir). Lütfen `WALLARM_API_TOKEN` değerinin açıkça iletilmemesinin tavsiye edildiğini unutmayın.

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
8. [Filtreleme node'unun çalışmasını test edin](#testing-the-filtering-node-operation).

## Filtreleme Node Çalışmasını Test Etme

1. Alibaba Cloud Console'u açın → hizmetler listesi → **Elastic Compute Service** → **Instances** ve örneğin **IP address** sütunundan genel IP adresini kopyalayın.

    ![Konteyner örneğinin kurulumu][copy-container-ip-alibaba-img]

    Eğer IP adresi boş ise, örneğin **Running** durumda olduğundan emin olun.
2. Kopyaladığınız adrese test [Path Traversal][ptrav-attack-docs] saldırısı içeren isteği gönderin:

    ```
    curl http://<COPIED_IP>/etc/passwd
    ```
3. Wallarm Console'u açın → [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) içindeki **Attacks** bölümüne gidin ve saldırının listede görüntülendiğinden emin olun.
    ![UI'daki Saldırılar][attacks-in-ui-image]

Konteyner dağıtımı sırasında meydana gelen hataların ayrıntılarını görmek için, lütfen [aşağıdaki yöntemlerden biriyle örneğe bağlanın](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l) ve [konteyner günlüklerini][logging-docs] kontrol edin. Eğer örnek kullanılamıyorsa, gerekli filtreleme node parametrelerinin doğru değerlerle konteynere iletildiğinden emin olun.