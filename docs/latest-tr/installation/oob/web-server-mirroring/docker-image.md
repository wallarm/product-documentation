```markdown
[doc-wallarm-mode]:           ../../../admin-en/configure-parameters-en.md#wallarm_mode
[doc-config-params]:          ../../../admin-en/configure-parameters-en.md
[doc-monitoring]:             ../../../admin-en/monitoring/intro.md
[waf-mode-instr]:                   ../../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[allocating-memory-guide]:          ../../../admin-en/configuration-guides/allocate-resources-for-node.md
[nginx-waf-directives]:             ../../../admin-en/configure-parameters-en.md
[graylist-docs]:                    ../../../user-guides/ip-lists/overview.md
[filtration-modes-docs]:            ../../../admin-en/configure-wallarm-mode.md
[application-configuration]:        ../../../user-guides/settings/applications.md
[ptrav-attack-docs]:                ../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../../images/admin-guides/test-attacks-quickstart.png
[versioning-policy]:                ../../../updating-migrating/versioning-policy.md#version-list
[node-status-docs]:                 ../../../admin-en/configure-statistics-service.md
[node-token]:                       ../../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../supported-deployment-options.md
[oob-advantages-limitations]:       ../overview.md#limitations
[web-server-mirroring-examples]:    overview.md#configuration-examples-for-traffic-mirroring
[memory-instr]:                     ../../../admin-en/configuration-guides/allocate-resources-for-node.md
[ip-lists-docs]:                    ../../../user-guides/ip-lists/overview.md
[aws-ecs-docs]:                     ../../cloud-platforms/aws/docker-container.md
[gcp-gce-docs]:                     ../../cloud-platforms/gcp/docker-container.md
[azure-container-docs]:             ../../cloud-platforms/azure/docker-container.md
[alibaba-ecs-docs]:                 ../../cloud-platforms/alibaba-cloud/docker-container.md
[api-policy-enf-docs]:              ../../../api-specification-enforcement/overview.md

# Docker Görüntüsünden Wallarm OOB Dağıtımı

Bu makale, [NGINX tabanlı Docker image](https://hub.docker.com/r/wallarm/node) kullanılarak [Wallarm OOB](overview.md) dağıtımı için talimatlar sağlar. Burada tanımlanan çözüm, bir web veya proxy sunucu tarafından aynalanan trafiği analiz etmek üzere tasarlanmıştır.

## Kullanım Senaryoları

--8<-- "../include/waf/installation/docker-images/nginx-based-use-cases.md"

## Gereksinimler

--8<-- "../include/waf/installation/requirements-docker-nginx-latest.md"

## 1. Trafik Aynalamasını Yapılandırın

--8<-- "../include/waf/installation/sending-traffic-to-node-oob.md"

## 2. Aynalanan Trafik Analizi ve Diğer İşlemler için Bir Yapılandırma Dosyası Hazırlayın

Wallarm düğümlerinin aynalanan trafiği analiz etmesi için, ayrı bir dosyada ek ayarlar yapılandırmanız ve bunu Docker konteynerine monte etmeniz gerekmektedir. Değiştirilmesi gereken varsayılan yapılandırma dosyası, Docker image içinde `/etc/nginx/sites-enabled/default` konumunda bulunmaktadır.

Bu dosyada, aynalanan trafiği işlemek için Wallarm düğüm yapılandırmasını ve diğer gerekli ayarları belirtmeniz gerekmektedir. Bunu yapmak için şu talimatları izleyin:

1. Aşağıdaki içerikle `default` adında yerel bir NGINX yapılandırma dosyası oluşturun:

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

            location / {
                    
                    proxy_pass http://example.com;
                    include proxy_params;
            }
    }
    ```

    * `set_real_ip_from` ve `real_ip_header` yönergeleri, Wallarm Console'un [saldırganların IP adreslerini görüntülemesi][proxy-balancer-instr] için gereklidir.
    * `wallarm_force response_status`, `wallarm_force response_time` ve `wallarm_force response_size` yönergeleri, aynalanan trafikten alınan kopyalar hariç tüm isteklerin analizini devre dışı bırakmak için gereklidir.
    * `wallarm_mode` yönergesi, trafik analiz [modu][waf-mode-instr]'dur. Kötü niyetli istekler [engellenemez][oob-advantages-limitations] olduğundan, Wallarm'ın kabul ettiği tek mod monitoring’dir. In-line dağıtımda, ayrıca safe blocking ve blocking modları da mevcuttur; ancak `wallarm_mode` yönergesini monitoring dışında bir değere ayarlasanız bile, düğüm yalnızca trafiği izlemeye ve kötü niyetli trafiği kaydetmeye devam eder (kapalı moda ayarlanmış olan durum dışında).
1. Diğer gerekli Wallarm yönergelerini belirtin. Sizin için hangi ayarların faydalı olacağını anlamak üzere [Wallarm configuration parameters](../../../admin-en/configure-parameters-en.md) dokümantasyonuna ve [configuration use cases](#configuring-the-use-cases) bölümüne bakabilirsiniz.
1. Gerekirse, NGINX'in davranışını özelleştirmek için diğer NGINX ayarlarını değiştirin. Yardım için [NGINX documentation](https://nginx.org/en/docs/beginners_guide.html)'a bakın.

Ayrıca, gerekirse aşağıdaki konteyner dizinlerine diğer dosyaları monte edebilirsiniz:

* `/etc/nginx/conf.d` — ortak ayarlar
* `/etc/nginx/sites-enabled` — sanal ana bilgisayar ayarları
* `/opt/wallarm/usr/share/nginx/html` — statik dosyalar

## 3. Düğümü Cloud'a Bağlamak için Bir Token Edinin

İlgili türde bir Wallarm token'ı edinin [wallarm-token-types]:

=== "API token"

    1. Wallarm Console'a gidin → **Settings** → **API tokens** [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens) üzerinden.
    1. `Deploy` kaynak rolüne sahip bir API token'ı bulun veya oluşturun.
    1. Bu token'ı kopyalayın.

=== "Node token"

    1. Wallarm Console'a gidin → **Nodes** [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) üzerinden.
    1. Aşağıdakilerden birini yapın: 
        * **Wallarm node** türünde bir düğüm oluşturun ve oluşturulan token'ı kopyalayın.
        * Mevcut düğüm grubunu kullanın - düğüm menüsünden → **Copy token** seçeneğiyle token'ı kopyalayın.

## 4. Düğüm ile Docker Konteynerini Çalıştırın

Az önce oluşturduğunuz yapılandırma dosyasını [mounting](https://docs.docker.com/storage/volumes/) ederek düğüm ile Docker konteynerini çalıştırın.

=== "US Cloud"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:5.3.0
    ```
=== "EU Cloud"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:5.3.0
    ```

Konteynere aşağıdaki ortam değişkenleri geçirilmelidir:

--8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"

## 5. Wallarm Düğüm Çalışmasını Test Etme

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## Günlük Kaydı Yapılandırması

Günlük kaydı varsayılan olarak etkinleştirilmiştir. Günlük dizinleri şunlardır:

* `/var/log/nginx` — NGINX günlükleri
* `/opt/wallarm/var/log/wallarm` — [Wallarm node logs][logging-instr]

## İzleme Yapılandırması

Filtreleme düğümünü izlemek için, konteyner içinde Nagios uyumlu betikler bulunmaktadır. Ayrıntılar için [Monitoring the filtering node][doc-monitoring]'ye bakın.

Betiklerin çalıştırılmasına ilişkin örnek:

``` bash
docker exec -it <WALLARM_NODE_CONTAINER_ID> /usr/lib/nagios/plugins/check_wallarm_tarantool_timeframe -w 1800 -c 900
```

``` bash
docker exec -it <WALLARM_NODE_CONTAINER_ID> /usr/lib/nagios/plugins/check_wallarm_export_delay -w 120 -c 300
```

* `<WALLARM_NODE_CONTAINER_ID>`, çalışan Wallarm Docker konteynerinin ID'sidir. ID'yi almak için `docker ps` komutunu çalıştırın ve uygun ID'yi kopyalayın.

## Kullanım Senaryolarının Yapılandırılması

Docker konteynerine monte edilen yapılandırma dosyası, [kullanılabilir yönergeler](../../../admin-en/configure-parameters-en.md) arasında filtreleme düğümü yapılandırmasını tanımlamalıdır. Aşağıda, yaygın olarak kullanılan bazı filtreleme düğümü yapılandırma seçenekleri verilmiştir:

--8<-- "../include/waf/installation/linux-packages/common-customization-options.md"
```