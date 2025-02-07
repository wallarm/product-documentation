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
[envoy-process-time-limit-docs]:    ../admin-en/configuration-guides/envoy/fine-tuning.md#process_time_limit
[envoy-process-time-limit-block-docs]: ../admin-en/configuration-guides/envoy/fine-tuning.md#process_time_limit_block
[ip-lists-docs]:                    ../user-guides/ip-lists/overview.md
[api-policy-enf-docs]:              ../api-specification-enforcement/overview.md

# Docker NGINX Tabanlı İmajı Yükseltme

Bu talimatlar, çalışan Docker NGINX tabanlı imajı 4.x sürümünden 5.0 sürümüne yükseltmek için yapılması gereken adımları açıklamaktadır.

!!! warning "Önceden Mevcut Wallarm Düğümü Kimlik Bilgilerini Kullanma"
    Önceki sürüme ait mevcut Wallarm düğümünü kullanmanızı önermeyiz. Lütfen, 5.0 sürümüne ait yeni bir filtreleme düğümü oluşturmak ve bunu Docker konteyneri olarak dağıtmak için bu talimatları izleyin.

Ömrünü tamamlamış düğümü (3.6 veya daha düşük) yükseltmek için lütfen [farklı talimatları](older-versions/docker-container.md) kullanın.

## Requirements

--8<-- "../include/waf/installation/requirements-docker-nginx-latest.md"

## Adım 1: Güncellenmiş Filtreleme Düğümü İmajını İndirin

``` bash
docker pull wallarm/node:5.3.0
```

## Adım 2: Çalışan Konteyneri Durdurun

```bash
docker stop <RUNNING_CONTAINER_NAME>
```

## Adım 3: Yeni İmajı Kullanarak Konteyneri Çalıştırın

1. Wallarm Console → **Settings** → **API Tokens** bölümüne gidin ve **Deploy** rolüne sahip bir token oluşturun.
1. Oluşturulan tokenı kopyalayın.
1. Kopyalanan tokenı kullanarak güncellenmiş imajı çalıştırın.
    
    Güncellenmiş imajı kullanarak konteyneri çalıştırmanın iki seçeneği vardır:
    
    * [Ortam değişkenleri ile](../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables)
    * [Mount edilmiş yapılandırma dosyası ile](../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file)

## Adım 4: Filtreleme Düğümü İşlemini Test Edin

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## Adım 5: Önceki Sürüm Filtreleme Düğümünü Silin

Eğer 5.0 sürümündeki dağıtılmış imaj doğru çalışıyorsa, Wallarm Console → **Nodes** bölümünden önceki sürüm filtreleme düğümünü silebilirsiniz.