# Wallarm Docker İmajının Alibaba Cloud’a Dağıtımı

Bu hızlı kılavuz, [NGINX tabanlı Wallarm düğümünün Docker imajını](https://hub.docker.com/r/wallarm/node) [Alibaba Cloud Elastic Compute Service (ECS)](https://www.alibabacloud.com/product/ecs) platformuna dağıtma adımlarını sağlar.

!!! warning "Talimatların sınırlamaları"
    Bu talimatlar, yük dengeleme ve düğüm otomatik ölçeklendirme yapılandırmasını kapsamaz. Bu bileşenleri kendiniz kuracaksanız, ilgili [Alibaba Cloud dokümantasyonunu](https://www.alibabacloud.com/help/product/27537.htm?spm=a2c63.m28257.a1.82.dfbf5922VNtjka) okumanızı öneririz.

## Kullanım senaryoları

--8<-- "../include/waf/installation/cloud-platforms/alibaba-ecs-use-cases.md"

## Gereksinimler

* [Alibaba Cloud Console](https://account.alibabacloud.com/login/login.htm) erişimi
* Wallarm Console’da [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için **Administrator** rolüne sahip hesaba erişim
* Saldırı tespit kuralları ve [API spesifikasyonları][api-policy-enf-docs] güncellemelerini indirmek, ayrıca [allowlist’e, denylist’e veya graylist’e alınmış][graylist-docs] ülkeleriniz, bölgeleriniz veya veri merkezleriniz için kesin IP’leri almak amacıyla aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"

## Wallarm düğümü Docker konteyneri yapılandırma seçenekleri

--8<-- "../include/waf/installation/docker-running-options.md"

## Ortam değişkenleri ile yapılandırılmış Wallarm düğümü Docker konteynerini dağıtma

Yalnızca ortam değişkenleri ile yapılandırılmış konteynerleştirilmiş Wallarm filtreleme düğümünü dağıtmak için Alibaba Cloud örneğini oluşturmanız ve bu örnekte Docker konteynerini çalıştırmanız gerekir. Bu adımları Alibaba Cloud Console veya [Alibaba Cloud CLI](https://www.alibabacloud.com/help/doc-detail/25499.htm) üzerinden gerçekleştirebilirsiniz. Bu talimatta Alibaba Cloud Console kullanılmıştır.

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. Alibaba Cloud Console’u açın → servis listesi → **Elastic Compute Service** → **Instances**.
1. Örneği [Alibaba Cloud talimatlarını](https://www.alibabacloud.com/help/doc-detail/87190.htm?spm=a2c63.p38356.b99.137.77df24df7fJ2XX) ve aşağıdaki yönergeleri izleyerek oluşturun:

    * Örnek, herhangi bir işletim sistemi imajına dayanabilir.
    * Örnek harici kaynaklar tarafından erişilebilir olacağından, örnek ayarlarında public IP address veya alan adı yapılandırılmalıdır.
    * Örnek ayarları, [örneğe bağlanmak için kullanılan yöntemi](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l) yansıtmalıdır.
1. [Alibaba Cloud dokümantasyonunda](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l) açıklanan yöntemlerden biriyle örneğe bağlanın.
1. Örnek üzerinde uygun işletim sistemi için [talimatları](https://docs.docker.com/engine/install/#server) izleyerek Docker paketlerini kurun.
1. Örneği Wallarm Cloud’a bağlamak için kullanılacak kopyalanmış Wallarm jetonuyla örnek ortam değişkenini ayarlayın:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. Geçilen ortam değişkenleri ve bağlanmış yapılandırma dosyası ile `docker run` komutunu kullanarak Wallarm düğümü Docker konteynerini çalıştırın:

    === "Wallarm US Cloud için komut"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -e NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/node:6.5.1
        ```
    === "Wallarm EU Cloud için komut"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -e NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> -p 80:80 wallarm/node:6.5.1
        ```
        
    * `-p`: filtreleme düğümünün dinlediği bağlantı noktası. Değer, örneğin bağlantı noktasıyla aynı olmalıdır.
    * `-e`: filtreleme düğümü yapılandırmasına ait ortam değişkenleri (kullanılabilir değişkenler aşağıdaki tabloda listelenmiştir). Lütfen `WALLARM_API_TOKEN` değerinin açıkça iletilmesi önerilmez.

        --8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"
1. [Filtreleme düğümünün çalışmasını test edin](#testing-the-filtering-node-operation).

## Bağlanmış dosya ile yapılandırılmış Wallarm düğümü Docker konteynerini dağıtma

Ortam değişkenleri ve bağlanmış dosya ile yapılandırılmış konteynerleştirilmiş Wallarm filtreleme düğümünü dağıtmak için Alibaba Cloud örneğini oluşturmanız, filtreleme düğümü yapılandırma dosyasını bu örneğin dosya sistemine yerleştirmeniz ve Docker konteynerini bu örnek üzerinde çalıştırmanız gerekir. Bu adımları Alibaba Cloud Console veya [Alibaba Cloud CLI](https://www.alibabacloud.com/help/doc-detail/25499.htm) üzerinden gerçekleştirebilirsiniz. Bu talimatta Alibaba Cloud Console kullanılmıştır.

--8<-- "../include/waf/installation/get-api-or-node-token.md"
            
1. Alibaba Cloud Console’u açın → servis listesi → **Elastic Compute Service** → **Instances**.
1. Örneği [Alibaba Cloud talimatlarını](https://www.alibabacloud.com/help/doc-detail/87190.htm?spm=a2c63.p38356.b99.137.77df24df7fJ2XX) ve aşağıdaki yönergeleri izleyerek oluşturun:

    * Örnek, herhangi bir işletim sistemi imajına dayanabilir.
    * Örnek harici kaynaklar tarafından erişilebilir olacağından, örnek ayarlarında public IP address veya alan adı yapılandırılmalıdır.
    * Örnek ayarları, [örneğe bağlanmak için kullanılan yöntemi](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l) yansıtmalıdır.
1. [Alibaba Cloud dokümantasyonunda](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l) açıklanan yöntemlerden biriyle örneğe bağlanın.
1. Örnek üzerinde uygun işletim sistemi için [talimatları](https://docs.docker.com/engine/install/#server) izleyerek Docker paketlerini kurun.
1. Örneği Wallarm Cloud’a bağlamak için kullanılacak kopyalanmış Wallarm jetonuyla örnek ortam değişkenini ayarlayın:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. Örnek içinde, filtreleme düğümü yapılandırmasını içeren `default` dosyasına sahip bir dizin oluşturun (örneğin dizin adı `configs` olabilir). Asgari ayarlara sahip dosya örneği:

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

    [Yapılandırma dosyasında belirtilebilecek filtreleme düğümü direktifleri seti →][nginx-waf-directives]
1. Geçilen ortam değişkenleri ve bağlanmış yapılandırma dosyası ile `docker run` komutunu kullanarak Wallarm düğümü Docker konteynerini çalıştırın:

    === "Wallarm US Cloud için komut"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v <INSTANCE_PATH_TO_CONFIG>:<DIRECTORY_FOR_MOUNTING> -p 80:80 wallarm/node:6.5.1
        ```
    === "Wallarm EU Cloud için komut"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_LABELS='group=<GROUP>' -v <INSTANCE_PATH_TO_CONFIG>:<CONTAINER_PATH_FOR_MOUNTING> -p 80:80 wallarm/node:6.5.1
        ```

    * `<INSTANCE_PATH_TO_CONFIG>`: önceki adımda oluşturulan yapılandırma dosyasının yolu. Örneğin, `configs`.
    * `<DIRECTORY_FOR_MOUNTING>`: yapılandırma dosyasının bağlanacağı konteyner dizini. Yapılandırma dosyaları NGINX tarafından kullanılan aşağıdaki konteyner dizinlerine bağlanabilir:

        * `/etc/nginx/conf.d` — genel ayarlar
        * `/etc/nginx/http.d` — sanal host ayarları
        * `/var/www/html` — statik dosyalar

        Filtreleme düğümü direktifleri `/etc/nginx/http.d/default.conf` dosyasında tanımlanmalıdır.
    
    * `-p`: filtreleme düğümünün dinlediği bağlantı noktası. Değer, örneğin bağlantı noktasıyla aynı olmalıdır.
    * `-e`: filtreleme düğümü yapılandırmasına ait ortam değişkenleri (kullanılabilir değişkenler aşağıdaki tabloda listelenmiştir). Lütfen `WALLARM_API_TOKEN` değerinin açıkça iletilmesi önerilmez.

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
1. [Filtreleme düğümünün çalışmasını test edin](#testing-the-filtering-node-operation).

## Filtreleme düğümünün çalışmasını test etme

1. Alibaba Cloud Console’u açın → servis listesi → **Elastic Compute Service** → **Instances** ve **IP address** sütunundan örneğin public IP address değerini kopyalayın.

    ![Kapsayıcı örneğini ayarlama][copy-container-ip-alibaba-img]

    IP address boş ise, lütfen örneğin **Running** durumda olduğundan emin olun.

2. Kopyalanan adrese test [Path Traversal][ptrav-attack-docs] saldırısı isteğini gönderin:

    ```
    curl http://<COPIED_IP>/etc/passwd
    ```
3. Wallarm Console’u açın → **Attacks** bölümüne gidin; [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) içinde saldırının listede göründüğünden emin olun.
    ![UI'de Attacks][attacks-in-ui-image]
1. İsteğe bağlı olarak, düğümün çalışmasının diğer yönlerini [test edin][link-docs-check-operation].

Konteyner dağıtımı sırasında oluşan hatalara ilişkin ayrıntıları görüntülemek için lütfen [yöntemlerden biriyle örneğe bağlanın](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l) ve [konteyner günlüklerini][logging-docs] inceleyin. Örnek erişilemiyorsa, gerekli filtreleme düğümü parametrelerinin doğru değerlerle konteynere iletildiğinden emin olun.