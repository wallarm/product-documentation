[doc-wallarm-mode]:           ../../../admin-en/configure-parameters-en.md#wallarm_mode
[doc-config-params]:          ../../../admin-en/configure-parameters-en.md
[doc-monitoring]:             ../../../admin-en/monitoring/intro.md
[waf-mode-instr]:                   ../../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[allocating-memory-guide]:          ../../../admin-en/configuration-guides/allocate-resources-for-node.md
[nginx-waf-directives]:             ../../../admin-en/configure-parameters-en.md
[graylist-docs]:                    ../../../user-guides/ip-lists/graylist.md
[filtration-modes-docs]:            ../../../admin-en/configure-wallarm-mode.md
[application-configuration]:        ../../../user-guides/settings/applications.md
[ptrav-attack-docs]:                ../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../../images/admin-guides/test-attacks-quickstart.png
[versioning-policy]:                ../../../updating-migrating/versioning-policy.md#version-list
[node-status-docs]:                 ../../../admin-en/configure-statistics-service.md
[node-token]:                       ../../../quickstart/getting-started.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../supported-deployment-options.md
[oob-advantages-limitations]:       ../overview.md#advantages-and-limitations
[web-server-mirroring-examples]:    overview.md#examples-of-web-server-configuration-for-traffic-mirroring
[memory-instr]:                     ../../../admin-en/configuration-guides/allocate-resources-for-node.md
[aws-ecs-docs]:                     ../../cloud-platforms/aws/docker-container.md
[gcp-gce-docs]:                     ../../cloud-platforms/gcp/docker-container.md
[azure-container-docs]:             ../../cloud-platforms/azure/docker-container.md
[alibaba-ecs-docs]:                 ../../cloud-platforms/alibaba-cloud/docker-container.md

# Docker Image'den Wallarm OOB'un Yayınlanması

Bu makale, [NGINX tabanlı Docker görüntüsünü](https://hub.docker.com/r/wallarm/node) kullanarak [Wallarm OOB](overview.md)'nun yayınlanması için talimatları sunar. Burada açıklanan çözüm, bir web veya proxy sunucusu tarafından aynalanan trafiği analiz etmek için tasarlanmıştır.

--8<-- "../include-tr/waf/installation/info-about-nginx-version-in-docker-container.md"

## Kullanım Durumları

--8<-- "../include-tr/waf/installation/docker-images/nginx-based-use-cases.md"

## Gereksinimler

--8<-- "../include-tr/waf/installation/requirements-docker-nginx-4.0.md"

## 1. Trafik Aynalığını Yapılandırma

--8<-- "../include-tr/waf/installation/sending-traffic-to-node-oob.md"

## 2. Aynalanan Trafik Analizi ve Daha Fazlası İçin Bir Yapılandırma Dosyası Hazırlayın

Aynalanan trafiği analiz etmek için Wallarm düğümlerini etkinleştirmeniz, ayrı bir dosyada ek ayarları yapılandırmanız ve Docker konteynırına monte etmeniz gerekir. Modifikasyon yapılacak varsayılan yapılandırma dosyası, Docker imajı içinde `/etc/nginx/sites-enabled/default` konumundadır.

Bu dosyada, aynalanan trafiği işlemek için Wallarm düğüm yapılandırmasını ve diğer gerekli tüm ayarları belirtmeniz gerekir. Bunu yapmak için aşağıdaki talimatları izleyin:

1. Aşağıdaki içeriklere sahip `default` adlı yerel NGINX yapılandırma dosyasını oluşturun:

    ```
    server {
            listen 80 default_server;
            listen [::]:80 default_server ipv6only=on;
            #listen 443 ssl;

            server_name localhost;

            #ssl_certificate cert.pem;
            #ssl_certificate_key cert.key;

            root /usr/share/nginx/html;

            index index.html index.htm;

            wallarm_force server_addr $http_x_server_addr;
            wallarm_force server_port $http_x_server_port;
            # Change 222.222.222.22 to the address of the mirroring server
            set_real_ip_from  222.222.222.22;
            real_ip_header    X-Forwarded-For;
            real_ip_recursive on;
            wallarm_force response_status 0;
            wallarm_force response_time 0;
            wallarm_force response_size 0;

            wallarm_mode monitoring;
            # wallarm_application 1;

            location / {
                    proxy_pass http://127.0.0.1:8080;
                    include proxy_params;
            }
    }
    ```

    * `set_real_ip_from` ve `real_ip_header` yönergeleri, Wallarm Console'un saldırganların IP adreslerini [göstermesi için][proxy-balancer-instr] gerekli.
    * `wallarm_force_response_*` yönergeleri, aynalanan trafikten alınan kopyalar dışındaki tüm isteklerin analizini devre dışı bırakmak için gereklidir.
    * `wallarm_mode` yönergesi, trafiği analiz [modudur][waf-mode-instr]. Zararlı istekler [engellenemediği][oob-advantages-limitations] için, tek kabul edilen mod izlemedir. Satırlı dağıtım için güvenli engelleme ve engelleme modları da mevcuttur, ancak `wallarm_mode` yönergesini izlemeden farklı bir değere ayarlarsanız, düğüm trafiği izlemeye devam eder ve sadece zararlı trafiği kaydeder (modun devre dışı bırakılması dışında).
1. Diğer gerekli Wallarm yönergelerini belirtin. Hangi ayarların sizin için yararlı olacağını anlamak için [Wallarm yapılandırma parametreleri](../../../admin-en/configure-parameters-en.md) belgelerine ve [yapılandırma kullanım durumlarına](#configuring-the-use-cases) başvurabilirsiniz.
1. Gerekirse, davranışını özelleştirmek için diğer NGINX ayarlarını değiştirin. Yardım almak için [NGINX belgelerine](https://nginx.org/en/docs/beginners_guide.html) başvurun.

Gerekirse, aşağıdaki konteynır dizinlerine diğer dosyaları monte edebilirsiniz:

* `/etc/nginx/conf.d` — genel ayarlar
* `/etc/nginx/sites-enabled` — sanal ana bilgisayar ayarları
* `/var/www/html` — statik dosyalar

## 3. Düğümü Buluta Bağlamak için Bir Belirteç Alın

[Uygun türde][wallarm-token-types] bir Wallarm belirteci alın:

=== "API Belirteci"

    1. Wallarm Konsolunu açın → **Ayarlar** → **API belirteçleri** [ABD Bulutu](https://us1.my.wallarm.com/settings/api-tokens) veya [AB Bulutu](https://my.wallarm.com/settings/api-tokens).
    1. `Dağıtım` kaynak rolüne sahip API belirtecini bulun veya oluşturun.
    1. Bu belirteci kopyalayın.

=== "Düğüm Belirteci"

    1. Wallarm Konsolunu açın → **Düğümler** [ABD Bulutu](https://us1.my.wallarm.com/nodes) veya [AB Bulutu](https://my.wallarm.com/nodes).
    1. Aşağıdakilerden birini yapın:
        * **Wallarm düğümü** türünde bir düğüm oluşturun ve oluşturulan belirteci kopyalayın.
        * Mevcut düğüm grubunu kullanın - düğümün menüsü → **Belirteci Kopyala** aracılığıyla belirteci kopyalayın.

## 4. Düğümlü Docker Konteynırını Çalıştırın

Az önce oluşturduğunuz yapılandırma dosyasını [bağlar](https://docs.docker.com/storage/volumes/) şekilde düğümlü Docker konteynırını çalıştırın.

=== "ABD Bulutu"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:4.8.1-1
    ```
=== "AB Bulutu"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:4.8.1-1
    ```

Aşağıdaki ortam değişkenleri konteynıra geçirilmelidir:

--8<-- "../include-tr/waf/installation/nginx-docker-env-vars-to-mount-latest.md"

## 5. Wallarm Düğüm İşlemlerini Test Etme

--8<-- "../include-tr/waf/installation/test-waf-operation-no-stats.md"

## Günlük Yapılandırması

Günlük kaydı varsayılan olarak etkindir. Günlük dizinleri:

* `/var/log/nginx` — NGINX günlükleri
* `/var/log/wallarm` — Wallarm düğüm günlükleri

Filtering node değişkenlerinin genişletilmiş günlüğünü yapılandırmak için lütfen bu [talimatları](../../../admin-en/configure-logging.md) kullanın.

Varsayılan olarak, günlükler her 24 saatte bir döner. Günlük dönüşümünü ayarlamak için, `/etc/logrotate.d/`'deki yapılandırma dosyalarını değiştirin. Çevre değişkenleri aracılığıyla dönüşüm parametrelerini değiştirmek mümkün değildir. 

## İzleme Yapılandırması

Filtering node'u izlemek için, konteyner içinde Nagios uyumlu script'ler bulunmaktadır. [Filtering node'un izlenmesi][doc-monitoring] hakkında detayları görün.

Script'leri çalıştırmanın bir örneği:

``` bash
docker exec -it <WALLARM_NODE_CONTAINER_ID> /usr/lib/nagios/plugins/check_wallarm_tarantool_timeframe -w 1800 -c 900
```

``` bash
docker exec -it <WALLARM_NODE_CONTAINER_ID> /usr/lib/nagios/plugins/check_wallarm_export_delay -w 120 -c 300
```

* `<WALLARM_NODE_CONTAINER_ID>` çalışan Wallarm Docker konteynırının kimliğidir. Kimliği almak için `docker ps` komutunu çalıştırın ve uygun kimliği kopyalayın.

## Kullanım Durumlarının Yapılandırılması

Docker konteynırına monte edilen yapılandırma dosyası, filtering node yapılandırmasını [mümkün olan yönergelerle](../../../admin-en/configure-parameters-en.md) açıklamalıdır. Aşağıda, sık kullanılan filtering node yapılandırma seçenekleri bulunmaktadır:

--8<-- "../include-tr/waf/installation/linux-packages/common-customization-options.md"