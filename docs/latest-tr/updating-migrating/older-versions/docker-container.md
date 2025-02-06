```markdown
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
[envoy-process-time-limit-docs]:    ../../admin-en/configuration-guides/envoy/fine-tuning.md#process_time_limit
[envoy-process-time-limit-block-docs]: ../../admin-en/configuration-guides/envoy/fine-tuning.md#process_time_limit_block
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md
[api-policy-enf-docs]:              ../../api-specification-enforcement/overview.md

# Ömrünü Tamamlamış (EOL) Docker NGINX Tabanlı Görüntünün Yükseltilmesi

Bu yönergeler, çalışan ömrünü tamamlamış Docker NGINX tabanlı görüntünün (sürüm 3.6 ve altı) 5.0 sürümüne yükseltilme adımlarını açıklamaktadır.

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

## Gereksinimler

--8<-- "../include/waf/installation/requirements-docker-nginx-latest.md"

## Adım 1: Filtreleme düğüm modüllerini yükselttiğinizi Wallarm technical support’a bildirin (sadece node 2.18 veya daha düşük yükseltme yapılıyorsa)

Eğer node 2.18 veya daha düşük bir sürüme yükseltiyorsanız, lütfen [Wallarm technical support](mailto:support@wallarm.com) ile iletişime geçerek filtreleme düğüm modüllerini 5.0'a yükselttiğinizi bildirin ve Wallarm hesabınız için yeni IP listesi mantığının etkinleştirilmesini isteyin. Yeni IP listesi mantığı etkinleştirildiğinde, Wallarm Console’daki [**IP lists**](../../user-guides/ip-lists/overview.md) bölümünün kullanılabilir olduğundan emin olun.

## Adım 2: Threat Replay Testing modülünü devre dışı bırakın (sadece node 2.16 veya daha düşük yükseltme yapılıyorsa)

Eğer Wallarm node 2.16 veya daha düşük bir sürüme yükseltiyorsanız, lütfen Wallarm Console’daki [Threat Replay Testing](../../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing) modülünü **Vulnerabilities** → **Configure** üzerinden devre dışı bırakın.

Modülün çalışması yükseltme işlemi sırasında [yanlış pozitiflere](../../about-wallarm/protecting-against-attacks.md#false-positives) yol açabilir. Modülü devre dışı bırakmak bu riski en aza indirir.

## Adım 3: API portunu güncelleyin

--8<-- "../include/waf/upgrade/api-port-443.md"

## Adım 4: Güncellenmiş filtreleme düğüm görüntüsünü indirin

``` bash
docker pull wallarm/node:5.3.0
```

## Adım 5: Wallarm Cloud’a Token Tabanlı Bağlantıya Geçiş

Konteyneri Wallarm Cloud’a bağlama yöntemi aşağıdaki şekilde güncellenmiştir:

* [“email and password” tabanlı yöntem kullanımdan kaldırılmıştır](what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-api-tokens). Bu yöntemde, konteyner doğru kimlik bilgileri `DEPLOY_USER` ve `DEPLOY_PASSWORD` değişkenlerine aktarılmış olması durumunda Wallarm Cloud’a otomatik olarak kaydedilirdi.
* Token tabanlı yöntem eklenmiştir. Konteyneri Cloud’a bağlamak için, Wallarm Console UI’den kopyalanmış Wallarm API tokenını içeren `WALLARM_API_TOKEN` değişkeniyle konteyneri çalıştırın.

5.0 görüntüsünü çalıştırmak için yeni yöntemi kullanmanız tavsiye edilir. “email and password” tabanlı yöntem gelecekteki sürümlerde kaldırılacaktır; lütfen geçiş yapınız.

Yeni bir Wallarm düğümü oluşturmak ve tokenınızı almak için:

1. Wallarm Console → **Settings** → **API Tokens** bölümünü açın ve **Deploy** rolü ile bir token oluşturun.
2. Oluşturulan tokenı kopyalayın.

## Adım 6: Önceki Wallarm düğüm sürümünden 5.0'a allowlist ve denylist yapılandırmasını geçirin (sadece node 2.18 veya daha düşük yükseltme yapılıyorsa)

Eğer node 2.18 veya daha düşük bir sürüme yükseltiyorsanız, önceki Wallarm düğüm sürümündeki allowlist ve denylist yapılandırmasını [geçirin](../migrate-ip-lists-to-node-3.md) 5.0'a.

## Adım 7: Kullanımdan Kaldırılmış Yapılandırma Seçeneklerinden Geçiş

Aşağıdaki kullanımdan kaldırılmış yapılandırma seçenekleri bulunmaktadır:

* `WALLARM_ACL_ENABLE` ortam değişkeni kullanımdan kaldırılmıştır. Eğer IP listeleri yeni düğüm sürümüne [geçirilmişse](../migrate-ip-lists-to-node-3.md), bu değişkeni `docker run` komutundan kaldırın.
* Aşağıdaki NGINX direktifleri yeniden adlandırılmıştır:
    * `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
    * `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
    * `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
    * `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

    Sadece direktiflerin isimleri değiştirilmiştir, mantıkları aynı kalmıştır. Önceki isimlere sahip direktifler yakında kullanımdan kaldırılacaktır; bu yüzden yeniden adlandırmanız önerilir.
    
    Lütfen taşınan yapılandırma dosyalarında eski isimli direktiflerin açıkça belirtilip belirtilmediğini kontrol edin. Eğer belirtiliyorsa, yeniden adlandırın.
* `wallarm_request_time` [loglama değişkeni](../../admin-en/configure-logging.md#filter-node-variables) `wallarm_request_cpu_time` olarak yeniden adlandırılmıştır.

    Sadece değişkenin ismi değiştirilmiştir, mantığı aynı kalmıştır. Eski isim geçici olarak desteklenmektedir, ancak yine de değişkenin yeniden adlandırılması tavsiye edilir.

<!-- * The following Envoy parameters have been renamed:

    * `lom` → [`custom_ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)
    * `instance` → [`application`](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)
    * `tsets` section → `rulesets`, and correspondingly the `tsN` entries in this section → `rsN`
    * `ts` → [`ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.md#ruleset_param)
    * `ts_request_memory_limit` → [`general_ruleset_memory_limit`](../../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)

    We only changed the names of the parameters, their logic remains the same. Parameters with former names will be deprecated soon, so you are recommended to rename them before.
    
    Please check if the parameters with former names are explicitly specified in the mounted configuration files. If so, rename them. -->

## Adım 8: Wallarm engelleme sayfasını güncelleyin (NGINX tabanlı görüntü yükseltiliyorsa)

Yeni düğüm sürümünde, Wallarm örnek engelleme sayfası [değiştirilmiştir](what-is-new.md#new-blocking-page). Sayfadaki logo ve destek e-postası varsayılan olarak boş bırakılmaktadır.

Eğer Docker konteyneri, engellenen taleplere `&/usr/share/nginx/html/wallarm_blocked.html` sayfasını dönecek şekilde yapılandırıldıysa, bu yapılandırmayı aşağıdaki gibi değiştirin:

1. Yeni örnek sayfanın versiyonunu [kopyalayın ve özelleştirin](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page).
2. Özelleştirilmiş sayfayı ve NGINX yapılandırma dosyasını, bir sonraki adımda yeni Docker konteynerine [bağlayın](../../admin-en/configuration-guides/configure-block-page-and-code.md#path-to-the-htm-or-html-file-with-the-blocking-page-and-error-code).

## Adım 9: Son mimari güncellemeleri gözden geçirin (NGINX tabanlı Docker görüntüsü için)

Son güncelleme, [mimari değişiklikler](what-is-new.md#optimized-and-more-secure-nginx-based-docker-image) getirmiştir. Bu değişiklikler, özellikle konteyner başlatılırken belirli dosyaların yollarında yapılan değişiklikler nedeniyle özel yapılandırma dosyalarını monte eden kullanıcıları etkileyebilir. Yeni görüntünün doğru yapılandırılması ve kullanımı için bu değişikliklere aşina olunuz.

## Adım 10: `overlimit_res` saldırı tespit yapılandırmasını direktiflerden kurala aktarın

--8<-- "../include/waf/upgrade/migrate-to-overlimit-rule-docker.md"

## Adım 11: Çalışan konteyneri durdurun

```bash
docker stop <RUNNING_CONTAINER_NAME>
```

## Adım 12: Güncellenmiş görüntüyü kullanarak konteyneri çalıştırın

Güncellenmiş görüntüyü kullanarak konteyneri çalıştırın ve [görüntüdeki son değişiklikler](what-is-new.md#optimized-and-more-secure-nginx-based-docker-image) gereği monte edilmiş dosyaların yollarında gerekli ayarlamaları yapın.

Güncellenmiş görüntüyü kullanarak konteyneri çalıştırmanın iki seçeneği bulunmaktadır:

* [Ortam değişkenleriyle](../../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables)
* [Monte edilmiş yapılandırma dosyasıyla](../../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file)

## Adım 13: Wallarm düğüm filtreleme modu ayarlarını, en son sürümlerde yayınlanan değişikliklere uyacak şekilde ayarlayın (sadece node 2.18 veya daha düşük yükseltme yapılıyorsa)

1. Aşağıda listelenen ayarların beklenen davranışının, [kapalı (off) ve izleme (monitoring) filtreleme modlarının değiştirilmiş mantığı](what-is-new.md#filtration-modes) ile uyumlu olduğunu doğrulayın:
      * [WALLARM_MODE](../../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables) ortam değişkeni ya da NGINX tabanlı Docker konteynerindeki [`wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode) direktifi
      <!-- * Environment variable [`WALLARM_MODE`](../../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-passing-the-environment-variables) or the directive [`mode`](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings) of the Envoy‑based Docker container -->
      * Wallarm Console’da yapılandırılmış [Genel filtreleme kuralı](../../admin-en/configure-wallarm-mode.md#general-filtration-rule-in-wallarm-console)
      * Wallarm Console’da yapılandırılmış [Uç noktaya yönelik filtreleme kuralları](../../admin-en/configure-wallarm-mode.md#endpoint-targeted-filtration-rules-in-wallarm-console)
2. Eğer beklenen davranış, değiştirilmiş filtreleme modu mantığı ile uyuşmuyorsa, lütfen filtreleme modu ayarlarını [yönergeler](../../admin-en/configure-wallarm-mode.md) kullanarak güncelleyin.

## Adım 14: Filtreleme düğümünün çalışmasını test edin

--8<-- "../include/waf/installation/test-after-node-type-upgrade.md"

## Adım 15: Önceki sürümlerin filtreleme düğümünü silin

Eğer 5.0 sürümüne ait dağıtılmış görüntü doğru çalışıyorsa, Wallarm Console → **Nodes** bölümünde önceki sürüme ait filtreleme düğümünü silebilirsiniz.

## Adım 16: Threat Replay Testing modülünü yeniden etkinleştirin (sadece node 2.16 veya daha düşük yükseltme yapılıyorsa)

Threat Replay Testing modülünün kurulumu ile ilgili [öneriyi](../../vulnerability-detection/threat-replay-testing/setup.md) inceleyin ve gerekiyorsa yeniden etkinleştirin.

Bir süre sonra, modülün çalışmasının yanlış pozitiflere yol açmadığından emin olun. Yanlış pozitifler tespit ederseniz, lütfen [Wallarm technical support](mailto:support@wallarm.com) ile iletişime geçin.
```