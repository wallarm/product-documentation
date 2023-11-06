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
[graylist-docs]:                     ../user-guides/ip-lists/graylist.md
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[envoy-process-time-limit-docs]:    ../admin-en/configuration-guides/envoy/fine-tuning.md#process_time_limit
[envoy-process-time-limit-block-docs]: ../admin-en/configuration-guides/envoy/fine-tuning.md#process_time_limit_block
[ip-lists-docs]:                    ../user-guides/ip-lists/overview.md

# Docker NGINX- veya Envoy-tabanlı görüntüyü yükseltme

Bu talimatlar, çalışan Docker NGINX- veya Envoy-tabanlı 4.x görüntüsünün 4.8 sürümüne yükseltme adımlarını açıklar.

!!! warning "Zaten var olan Wallarm düğümünün kimlik bilgilerini kullanma"
    Önceki sürümün zaten var olan Wallarm düğümünü kullanmanızı önermiyoruz. Lütfen 4.8 sürümündeki yeni bir filtreleme düğümü oluşturmak ve Docker konteynırı olarak dağıtmak için bu talimatları izleyin.

Son kullanma tarihli düğümü (3.6 veya daha düşük) yükseltmek için lütfen [farklı talimatları](older-versions/docker-container.md) kullanın.

## Gereksinimler

--8<-- "../include-tr/waf/installation/requirements-docker-nginx-4.0.md"

## Adım 1: Güncellenmiş filtreleme düğümü görüntüsünü indirin

=== "NGINX-tabanlı görüntü"
    ``` bash
    docker pull wallarm/node:4.8.1-1
    ```
=== "Envoy-tabanlı görüntü"
    ``` bash
    docker pull wallarm/envoy:4.8.0-1
    ```

## Adım 2: Wallarm engelleme sayfasını güncelleyin (NGINX-tabanlı görüntüyü yükseltiyorsanız)

Yeni düğüm sürümünde, Wallarm örnek engelleme sayfası [değiştirildi](what-is-new.md#new-blocking-page). Sayfadaki logo ve destek e-postası artık varsayılan olarak boştur.

Docker konteynırı, engellenen isteklere `&/usr/share/nginx/html/wallarm_blocked.html` sayfasını döndürmek üzere yapılandırıldıysa, bu yapılandırmayı şu şekilde değiştirin:

1. Yeni sürümde bir örnek sayfayı [kopyalayın ve özelleştirin](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page).
1. Özelleştirilmiş sayfayı ve NGINX konfigürasyon dosyasını bir sonraki adımdaki yeni Docker konteynırına [monte edin](../admin-en/configuration-guides/configure-block-page-and-code.md#path-to-the-htm-or-html-file-with-the-blocking-page-and-error-code).

## Adım 3: Çalışan konteynırı durdurun

```bash
docker stop <ÇALIŞAN_KONTEYNER_ADı>
```

## Adım 4: Yeni görüntüyü kullanarak konteynırı çalıştırın

1. Wallarm Console → **Düğümler**'e gidin ve **Wallarm düğümü** oluşturun.

    ![Bir Wallarm düğümü oluşturma](../images/user-guides/nodes/create-wallarm-node-name-specified.png)
1. Üretilen belirteci kopyalayın.
1. Kopyalanan belirteci kullanarak güncellenmiş görüntüyü çalıştırın. Önceki görüntü sürümünü çalıştırırken geçirilen aynı yapılandırma parametrelerini geçirebilirsiniz (düğüm belirteci dışında).
    
    Güncellenmiş görüntüyü kullanarak konteynırı çalıştırmanın iki seçeneği bulunmaktadır:

    * **Ortam değişkenleri ile** temel filtreleme düğümü yapılandırmasını belirtir
        * [NGINX-tabanlı Docker konteynırı için talimatlar →](../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables)
        * [Envoy-tabanlı Docker konteynırı için talimatlar →](../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-passing-the-environment-variables)
    * **Monte edilen yapılandırma dosyasında** gelişmiş filtreleme düğümü yapılandırmasını belirtir
        * [NGINX-tabanlı Docker konteynırı için talimatlar →](../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file)
        * [Envoy-tabanlı Docker konteynırı için talimatlar →](../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-mounting-envoyyaml)

## Adım 5: Filtreleme düğümü işlemini test edin

--8<-- "../include-tr/waf/installation/test-waf-operation-no-stats.md"

## Adım 6: Önceki sürümün filtreleme düğümünü silin

4.8 sürümü görüntü doğru bir şekilde çalışıyorsa, Wallarm Console → **Düğümler**'deki önceki sürümün filtreleme düğümünü silebilirsiniz.
