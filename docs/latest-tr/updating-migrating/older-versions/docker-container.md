[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[blocking-page-instr]:              ../../admin-en/configuration-guides/configure-block-page-and-code.md
[logging-instr]:                    ../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[allocating-memory-guide]:          ../../admin-en/configuration-guides/allocate-resources-for-node.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:           ../../images/admin-guides/test-attacks-quickstart.png
[nginx-process-time-limit-docs]:    ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../../user-guides/ip-lists/overview.md
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md
[api-policy-enf-docs]:              ../../api-specification-enforcement/overview.md

# Ömrü Dolmuş (EOL) Docker NGINX tabanlı bir imajı yükseltme

Bu talimatlar, çalışan ömrü dolmuş Docker NGINX tabanlı imajın (sürüm 3.6 ve altı) 6.x sürümüne nasıl yükseltileceğini açıklar.

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

## Gereksinimler

--8<-- "../include/waf/installation/requirements-docker-nginx-latest.md"

## Adım 1: Filtreleme düğümü modüllerini yükselttiğinizi Wallarm teknik desteğine bildirin (yalnızca 2.18 veya daha eski düğüm yükseltiliyorsa)

Eğer 2.18 veya daha eski bir düğümü yükseltiyorsanız, lütfen [Wallarm teknik desteğine](mailto:support@wallarm.com) filtreleme düğümü modüllerini 6.x sürümüne yükselttiğinizi bildirip Wallarm hesabınız için yeni IP list mantığının etkinleştirilmesini isteyin. Yeni IP list mantığı etkinleştirildiğinde, Wallarm Console içindeki [**IP lists**](../../user-guides/ip-lists/overview.md) bölümünün erişilebilir olduğundan emin olun.

## Adım 2: Threat Replay Testing modülünü devre dışı bırakın (yalnızca 2.16 veya daha eski düğüm yükseltiliyorsa)

Eğer Wallarm düğümü 2.16 veya daha eski bir sürüme yükseltiliyorsa, Wallarm Console → **Vulnerabilities** → **Configure** içinde [Threat Replay Testing](../../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing) modülünü devre dışı bırakın.

Modülün çalışması, yükseltme süreci sırasında [yanlış pozitiflere](../../about-wallarm/protecting-against-attacks.md#false-positives) neden olabilir. Modülü devre dışı bırakmak bu riski en aza indirir.

## Adım 3: API portunu güncelleyin

--8<-- "../include/waf/upgrade/api-port-443.md"

## Adım 4: Güncellenmiş filtreleme düğümü imajını indirin

``` bash
docker pull wallarm/node:6.5.1
```

## Adım 5: Wallarm Cloud’a belirteç (token) tabanlı bağlantıya geçin

Konteyneri Wallarm Cloud’a bağlama yaklaşımı aşağıdaki şekilde güncellendi:

* ["E‑posta ve parola" tabanlı yaklaşım kullanımdan kaldırıldı](what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-api-tokens). Bu yaklaşımda, `DEPLOY_USER` ve `DEPLOY_PASSWORD` değişkenlerinde doğru kimlik bilgileri ile konteyner başlatıldığında düğüm Wallarm Cloud’da otomatik olarak kaydediliyordu.
* Belirteç tabanlı yaklaşım eklendi. Konteyneri Cloud’a bağlamak için, `WALLARM_API_TOKEN` değişkeni Wallarm Console UI’dan kopyalanan Wallarm API belirtecini içerecek şekilde konteyneri çalıştırın.

6.x imajını çalıştırmak için yeni yaklaşımın kullanılması önerilir. "E‑posta ve parola" tabanlı yaklaşım gelecekteki sürümlerde kaldırılacaktır; lütfen öncesinde geçiş yapın.

Yeni bir Wallarm düğümü oluşturup belirtecini almak için:

1. Wallarm Console → **Settings** → **API Tokens** açın ve kullanım türü **Node deployment/Deployment** olan bir belirteç oluşturun.
1. Oluşturulan belirteci kopyalayın.

## Adım 6: Allowlist ve denylist’leri önceki Wallarm düğümü sürümünden 6.x’e taşıyın (yalnızca 2.18 veya daha eski düğüm yükseltiliyorsa)

Eğer 2.18 veya daha eski bir düğümü yükseltiyorsanız, allowlist ve denylist yapılandırmasını önceki Wallarm düğümü sürümünden 6.x’e [taşıyın](../migrate-ip-lists-to-node-3.md).

## Adım 7: Kullanımdan kaldırılan yapılandırma seçeneklerinden geçiş yapın

Aşağıdaki yapılandırma seçenekleri kullanımdan kaldırılmıştır:

* `WALLARM_ACL_ENABLE` ortam değişkeni kullanımdan kaldırıldı.

    IP lists’ler yeni düğüm sürümüne [taşındıysa](../migrate-ip-lists-to-node-3.md), bu değişkeni `docker run` komutundan kaldırın.
* Postanalytics bellek miktarını `TARANTOOL_MEMORY_GB` ortam değişkeni ile ayarlıyorsanız, değişken adını `SLAB_ALLOC_ARENA` olarak değiştirin.
* Aşağıdaki NGINX yönergelerinin adları değiştirildi:

    * `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
    * `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
    * `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
    * `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

    Yalnızca yönergelerin adlarını değiştirdik, mantıkları aynı kaldı. Eski adlara sahip yönergeler yakında kullanımdan kaldırılacağından, bunları önceden yeniden adlandırmanız önerilir.
    
    Eski adlara sahip yönergelerin bağlanmış yapılandırma dosyalarında açıkça belirtilip belirtilmediğini kontrol edin. Eğer öyleyse, yeniden adlandırın.
* `wallarm_request_time` [loglama değişkeninin](../../admin-en/configure-logging.md#filter-node-variables) adı `wallarm_request_cpu_time` olarak değiştirildi.

    Yalnızca değişken adı değişti, mantığı aynı kaldı. Eski ad geçici olarak desteklenmeye de devam ediyor, ancak yine de değişkeni yeniden adlandırmanız önerilir.

## Adım 8: Wallarm engelleme sayfasını güncelleyin (NGINX tabanlı imaj yükseltiliyorsa)

Yeni düğüm sürümünde Wallarm örnek engelleme sayfası [değiştirildi](what-is-new.md#new-blocking-page). Sayfadaki logo ve destek e-postası artık varsayılan olarak boştur.

Docker konteyneri engellenen isteklere `&/usr/share/nginx/html/wallarm_blocked.html` sayfasını döndürecek şekilde yapılandırılmışsa, bu yapılandırmayı aşağıdaki gibi değiştirin:

1. Yeni sürüm örnek sayfayı [kopyalayın ve özelleştirin](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page).
1. Özelleştirilmiş sayfayı ve NGINX yapılandırma dosyasını bir sonraki adımda yeni Docker konteynerine [bağlayın (mount)](../../admin-en/configuration-guides/configure-block-page-and-code.md#path-to-the-htm-or-html-file-with-the-blocking-page-and-error-code).

## Adım 9: Son mimari güncellemeleri gözden geçirin (NGINX tabanlı Docker imajı için)

En son güncelleme, [imaj optimizasyonu](what-is-new.md#optimized-and-more-secure-nginx-based-docker-image) ve [Tarantool’un değişimi](what-is-new.md#replacing-tarantool-with-wstore-for-postanalytics) nedeniyle, özellikle konteyner başlatımı sırasında özel yapılandırma dosyalarını bağlayan kullanıcıları etkileyebilecek, belirli dosyaların yollarındaki değişikliklerden kaynaklanan mimari değişiklikler getirdi. Lütfen bu değişiklikleri gözden geçirerek yeni imajın doğru şekilde yapılandırıldığından ve kullanıldığından emin olun.

## Adım 10: `overlimit_res` saldırı tespiti yapılandırmasını yönergelerden kurala taşıyın

--8<-- "../include/waf/upgrade/migrate-to-overlimit-rule-docker.md"

## Adım 11: Çalışan konteyneri durdurun

```bash
docker stop <RUNNING_CONTAINER_NAME>
```

## Adım 12: Güncellenmiş imajı kullanarak konteyneri çalıştırın

Güncellenmiş imajı kullanarak konteyneri çalıştırın ve gerekirse [imaj optimizasyonu](what-is-new.md#optimized-and-more-secure-nginx-based-docker-image) ve [Tarantool’un değişimi](what-is-new.md#replacing-tarantool-with-wstore-for-postanalytics) nedeniyle imajda yapılan son değişikliklerin gerektirdiği şekilde bağlanan dosyaların yollarında gerekli düzenlemeleri yapın.

Güncellenmiş imajla konteyneri çalıştırmanın iki seçeneği vardır:

* [Ortam değişkenleri ile](../../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables)
* [Bağlanan yapılandırma dosyasında](../../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file)

## Adım 13: Wallarm düğümü filtreleme modu ayarlarını en son sürümlerde yayınlanan değişikliklere uyarlayın (yalnızca 2.18 veya daha eski düğüm yükseltiliyorsa)

1. Aşağıda listelenen ayarların beklenen davranışının, [`off` ve `monitoring` filtreleme modlarının değişen mantığına](what-is-new.md#filtration-modes) karşılık geldiğinden emin olun:
      * NGINX tabanlı Docker konteynerinin [`WALLARM_MODE`](../../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables) ortam değişkeni veya [`wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode) yönergesi
      * [Wallarm Console’da yapılandırılan General filtration rule](../../admin-en/configure-wallarm-mode.md#general-filtration-mode)
      * [Wallarm Console’da yapılandırılan Endpoint-targeted filtration rules](../../admin-en/configure-wallarm-mode.md#conditioned-filtration-mode)
2. Beklenen davranış değişen filtreleme modu mantığıyla uyuşmuyorsa, [talimatları](../../admin-en/configure-wallarm-mode.md) kullanarak filtreleme modu ayarlarını yayınlanan değişikliklere göre uyarlayın.

## Adım 14: Filtreleme düğümünün çalışmasını test edin

--8<-- "../include/waf/installation/test-after-node-type-upgrade.md"

## Adım 15: Önceki sürümün filtreleme düğümünü silin

6.x sürümündeki dağıtılmış imaj düzgün çalışıyorsa, Wallarm Console → **Nodes** bölümünden önceki sürümün filtreleme düğümünü silebilirsiniz.

## Adım 16: Threat Replay Testing modülünü yeniden etkinleştirin (yalnızca 2.16 veya daha eski düğüm yükseltiliyorsa)

[Threat Replay Testing modülünün kurulumuna ilişkin öneriyi](../../vulnerability-detection/threat-replay-testing/setup.md) gözden geçirin ve gerekirse yeniden etkinleştirin.

Bir süre sonra, modülün çalışmasının yanlış pozitiflere yol açmadığından emin olun. Yanlış pozitiflerle karşılaşırsanız lütfen [Wallarm teknik desteği](mailto:support@wallarm.com) ile iletişime geçin.