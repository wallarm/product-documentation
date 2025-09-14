[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[blocking-page-instr]:              ../admin-en/configuration-guides/configure-block-page-and-code.md
[logging-instr]:                    ../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[allocating-memory-guide]:          ../admin-en/configuration-guides/allocate-resources-for-node.md
[ptrav-attack-docs]:                ../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../images/admin-guides/test-attacks-quickstart.png
[nginx-process-time-limit-docs]:    ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../user-guides/ip-lists/overview.md
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[ip-lists-docs]:                    ../user-guides/ip-lists/overview.md
[api-policy-enf-docs]:              ../api-specification-enforcement/overview.md
[link-wallarm-health-check]:        ../admin-en/uat-checklist-en.md

# Docker NGINX tabanlı imajı yükseltme

Bu talimatlar, çalışan Docker NGINX tabanlı imajı en son 6.x sürümüne yükseltme adımlarını açıklar.

!!! warning "Mevcut Wallarm düğümünün kimlik bilgilerini kullanma"
    Önceki sürümden kalma mevcut Wallarm düğümünü kullanmanızı önermiyoruz. Lütfen 6.x sürümünde yeni bir filtreleme düğümü oluşturmak ve bunu Docker konteyneri olarak dağıtmak için bu talimatları izleyin.

Kullanım ömrü sona ermiş düğümü (3.6 veya altı) yükseltmek için lütfen [farklı talimatları](older-versions/docker-container.md) kullanın.

## Gereksinimler

--8<-- "../include/waf/installation/requirements-docker-nginx-latest.md"

## Adım 1: Güncellenmiş filtreleme düğümü imajını indirin

``` bash
docker pull wallarm/node:6.5.1
```

## Adım 2: Çalışan konteyneri durdurun

```bash
docker stop <RUNNING_CONTAINER_NAME>
```

## Adım 3: Yeni imajı kullanarak konteyneri çalıştırın

1. 5.x veya daha eski bir sürümden yükseltiyorsanız, lütfen aşağıdaki önemli değişiklikleri dikkate alın:

    * Daha önce `TARANTOOL_MEMORY_GB` ortam değişkeni aracılığıyla postanalytics belleğini yapılandırdıysanız, bunu `SLAB_ALLOC_ARENA` olarak yeniden adlandırın.
    * Özel NGINX yapılandırma dosyaları bağlanmış şekilde Docker konteynerini çalıştırıyorsanız:

        * `/etc/nginx/nginx.conf` içindeki `include` yolları, Alpine Linux dizin kurallarıyla uyumlu olacak şekilde değişti:

            ```diff
            ...

            - include /etc/nginx/modules-enabled/*.conf;
            + include /etc/nginx/modules/*.conf;

            ...

            http {
            -     include /etc/nginx/sites-enabled/*;
            +     include /etc/nginx/http.d/*;
            }
            ```
        
        * `/etc/nginx/conf.d/wallarm-status.conf` içinde, `allow` yönergesinin (izin verilen IP adreslerini tanımlamak için kullanılır) varsayılan değeri değişti:

            ```diff
            ...

            - allow 127.0.0.8/8;
            + allow 127.0.0.0/8;

            ...
            ```
        
        * Sanal host yapılandırma dosyalarının bağlanacağı yol `/etc/nginx/sites-enabled/default` iken `/etc/nginx/http.d` olarak değişti.
1. Wallarm Console → **Settings** → **API Tokens** bölümüne gidin ve kullanım türü **Node deployment/Deployment** olan bir token oluşturun.
1. Oluşturulan token'ı kopyalayın.
1. Yeni imajı kullanarak konteyneri çalıştırın ve güncellenmiş yapılandırmayı uygulayın.
    
    Güncellenmiş imajla konteyneri çalıştırmanın iki seçeneği vardır:

    * [Ortam değişkenleriyle](../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables)
    * [Bağlanan yapılandırma dosyasında](../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file)

## Adım 4: Filtreleme düğümünün çalışmasını test edin

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## Adım 5: Önceki sürümün filtreleme düğümünü silin

Dağıtılan 6.x sürüm imajı düzgün çalışıyorsa, Wallarm Console → **Nodes** içinde önceki sürümün filtreleme düğümünü silebilirsiniz.