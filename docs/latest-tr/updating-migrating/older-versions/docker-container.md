[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[blocking-page-instr]:              ../../admin-en/configuration-guides/configure-block-page-and-code.md
[logging-instr]:                    ../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[allocating-memory-guide]:          ../../admin-en/configuration-guides/allocate-resources-for-node.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[nginx-process-time-limit-docs]:    ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:          ../../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                    ../../user-guides/ip-lists/graylist.md
[waf-mode-instr]:                      ../../admin-en/configure-wallarm-mode.md
[envoy-process-time-limit-docs]:    ../../admin-en/configuration-guides/envoy/fine-tuning.md#process_time_limit
[envoy-process-time-limit-block-docs]: ../../admin-en/configuration-guides/envoy/fine-tuning.md#process_time_limit_block
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md

# EOL Docker NGINX- veya Envoy-tabanlı görüntüyü yükseltme

Bu talimatlar, çalışan son ömrünü tamamlamış Docker NGINX- veya Envoy-tabanlı görüntünün (sürüm 3.6 ve altı) sürüm 4.8'e yükseltilmesi adımlarını açıklar.

--8<-- "../include-tr/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

## Gereklilikler

--8<-- "../include-tr/waf/installation/requirements-docker-nginx-4.0.md"

## Adım 1: Filtreleme düğümü modüllerini yükselttiğinizi Wallarm teknik destek ekibine bilgi verin (yalnızca 2.18 veya daha düşük düğüm yükseltiliyorsa)

2.18 veya daha düşük düğüm yükseltiliyorsa lütfen [Wallarm teknik destek ekibine](mailto:support@wallarm.com) filtreleme düğümü modüllerini 4.8'e kadar yükselttiğinizi ve Wallarm hesabınız için yeni IP listesi mantığını etkinleştirmelerini önerin. Yeni IP listesi mantığı etkinleştirildiğinde, lütfen Wallarm Konsolu → [**IP listeleri**](../../user-guides/ip-lists/overview.md) bölümünün görünür olduğunu kontrol edin.

## Adım 2: Etkin tehdit doğrulama modülünü devre dışı bırakın (yalnızca 2.16 veya daha düşük düğüm yükseltiliyorsa)

Wallarm düğümü 2.16 veya daha düşük sürümünü yükseltiyorsanız, lütfen Wallarm Console → **Vulnerabilities** → **Configure**. kısmında [Etkin tehdit doğrulama](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) modülünü devre dışı bırakınız.

Modülün çalışması yükseltme işlemi sırasında [yanlış pozitifler](../../about-wallarm/protecting-against-attacks.md#false-positives) oluşturabilir. Modülü devre dışı bırakma, bu riski en aza indirir.

## Adım 3: API portunu güncelleyin

--8<-- "../include-tr/waf/upgrade/api-port-443.md"

## Adım 4: Güncellenmiş filtreleme düğümü görüntüsünü indirin

=== "NGINX-tabanlı görüntü"
    ``` bash
    docker pull wallarm/node:4.8.1-1
    ```
=== "Envoy-tabanlı görüntü"
    ``` bash
    docker pull wallarm/envoy:4.8.0-1
    ```

## Adım 5: Token tabanlı bağlantıyla Wallarm Buluta geçin

Sürüm 4.x'in yayınlanmasıyla, konteynırın Wallarm Buluta bağlanması aşağıdaki gibi yükseltildi:

* ["Email ve parola" tabanlı yaklaşım eskidi](what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-tokens). Bu yaklaşımda, düğüm `DEPLOY_USER` ve `DEPLOY_PASSWORD` değişkenlerine doğru kimlik bilgileri aktarıldığında konteynır başladığında Wallarm Buluta otomatik olarak kayıtlı oluyordu.
* Token-tabanlı yaklaşım dahil oldu. Konteynırı Buluta bağlayabilmeniz için, `WALLARM_API_TOKEN` değişkeni Wallarm Konsol UI'dan kopyalanan Wallarm düğüm tokenini içeren şekilde konteynırı çalıştırın.

Resim 4.8'i çalıştırılırken, yeni yaklaşımın kullanılması önerilir. "Email ve parola" tabanlı yaklaşım gelecekteki yayınlarda silinecek, lütfen öncesinde geçiş yapın.

Yeni bir Wallarm düğümü oluşturup onun tokenini almak için:

1. [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) üzerinde Wallarm Console'i açın → **Nodes** açıp **Wallarm Düğümü** türünde bir düğüm oluşturun.

    ![Wallarm düğüm oluşturma](../../images/user-guides/nodes/create-cloud-node.png)
1. Oluşturulan tokeni kopyalayın.

## Adım 6: Izin listelerini ve engelleme listelerini önceki Wallarm düğüm sürümünden 4.8'e taşıyın (yalnızca 2.18 veya daha düşük düğüm yükseltiliyorsa)

2.18 veya daha düşük düğüm yükseltiliyorsa, izin listesi ve engelleme listesi yapılandırmalarını önceki Wallarm düğüm sürümünden [taşıyın](../migrate-ip-lists-to-node-3.md) 4.8'e.

## Adım 7: Deprecated yapılandırma seçeneklerinden geçin

Aşağıdaki deprecated yapılandırma seçenekleri bulunmaktadır:

* `WALLARM_ACL_ENABLE` çevre değişkeni deprecated olmuştur. Eğer IP listeleri yeni düğüm sürümüne [taşındıysa](../migrate-ip-lists-to-node-3.md), bu değişkeni `docker run` komutundan kaldırın.
* Aşağıdaki NGINX yönergeleri yeniden adlandırıldı:

    * `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
    * `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
    * `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
    * `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

    Sadece yönerge adlarını değiştirdik, mantıkları aynı kaldı. Eski isimlerdeki yönergeler yakında deprecated olacak, bu yüzden önceden yeniden adlandırmak önerilir.
    
    Lütfen monte edilen yapılandırma dosyalarında eski isimlerde yönergelerin açıkça belirtildiğini kontrol edin. Eğer varsa, yeniden adlandırın.
* `wallarm_request_time` [logging değişkeni](../../admin-en/configure-logging.md#filter-node-variables) `wallarm_request_cpu_time` olarak yeniden adlandırılmıştır.

    Sadece değişkenin adını değiştirdik, mantığı aynı. Eski isim geçici olarak da desteklenir ancak yine de değişkenin adını değiştirmeniz önerilir.
* Aşağıdaki Envoy parametreleri yeniden adlandırıldı:

    * `lom` → [`custom_ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)
    * `instance` → [`application`](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)
    * `tsets` bölümü → `rulesets`, ve buna karşılık gelen `tsN` girdileri bu bölümde → `rsN`
    * `ts` → [`ruleset`](../../admin-en/configuration-guides/envoy/fine-tuning.md#ruleset_param)
    * `ts_request_memory_limit` → [`general_ruleset_memory_limit`](../../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings)

    Sadece parametre adlarını değiştirdik, mantıkları aynı kaldı. Eski isimlerdeki parametreler çok yakında deprecated olacaktır, bu yüzden yeniden adlandırmalarını öneriyoruz.
    
    Lütfen montajlanmış yapılandırma dosyalarında eski isimlerle belirli parametrelerin açıkça belirtildiğini kontrol edin. Eğer varsa, onların adlarını değiştirin.

## Adım 8: Wallarm engelleme sayfasını güncelleyin (NGINX-tabanlı görüntüyü yükseltiyorsanız)

Yeni düğüm sürümünde, Wallarm örnek engelleme sayfası [değiştirildi](what-is-new.md#new-blocking-page). Sayfadaki logo ve destek e-postası artık varsayılan olarak boş.

Eğer Docker konteynırı engellenen isteklere `&/usr/share/nginx/html/wallarm_blocked.html` sayfasını döndürmek üzere yapılandırılmışsa, bu yapılandırmayı aşağıdaki gibi değiştirin:

1. [Yeni bir örnek sayfanın kopyasını alıp özelleştirin.](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)
1. [Özelleştirilmiş sayfayı ve NGINX yapılandırma dosyasını](../../admin-en/configuration-guides/configure-block-page-and-code.md#path-to-the-htm-or-html-file-with-the-blocking-page-and-error-code) bir sonraki adımda bir new Docker konteynıra monte edin.

## Adım 9: `overlimit_res` saldırı tespit yapılandırmasını yönergelere dayalı kurala aktarın

--8<-- "../include-tr/waf/upgrade/migrate-to-overlimit-rule-docker.md"

## Adım 10: Çalışan konteynırı durdurun

```bash
docker stop <RUNNING_CONTAINER_NAME>
```

## Adım 11: Güncellenmiş görüntüyü kullanarak konteynırı çalıştırın

Güncellenmiş görüntüyü kullanarak konteynırı çalıştırın. Bir önceki görüntü sürümünün çalıştırılmasında geçtiğiniz aynı yapılandırma parametrelerini geçirebilirsiniz, daha önceki adımlarda listelenenler haricinde.

Güncellenmiş görüntüyü kullanarak konteynırı çalıştırmanın iki seçeneği vardır:

* **Ortam değişkenleri ile** temel filtreleme düğümü yapılandırmasını belirtir
    * [NGINX-tabanlı Docker konteynır için talimatlar →](../../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables)
    * [Envoy-tabanlı Docker konteynır için talimatlar →](../../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-passing-the-environment-variables)
* **Monte edilen yapılandırma dosyasında** ileri düzey filtreleme düğümü yapılandırmasını belirtir
    * [NGINX-tabanlı Docker konteynır için talimatlar →](../../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file)
    * [Envoy-tabanlı Docker konteynır için talimatlar →](../../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-mounting-envoyyaml)

## Adım 12: Wallarm düğümü filtrasyon modu ayarlarını en son versiyonda yayınlanan değişikliklere uyarlayın (yalnızca 2.18 veya daha düşük düğüm yükseltiliyorsa)

1. Aşağıda listelenen ayarların beklenen davranışını, [`off` ve `monitoring` filtration modlarının değişen mantığına](what-is-new.md#filtration-modes) karşılık gelir şekilde kontrol edin:
      * Çevre değişkeni [`WALLARM_MODE`](../../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables) veya NGINX-tabanlı Docker konteynırının yönergesi [`wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * Çevre değişkeni [`WALLARM_MODE`](../../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-passing-the-environment-variables) veya Envoy-tabanlı Docker konteynırının yönergesi [`mode`](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings)
      * Wallarm Console'da yapılandırılan [Genel filtrasyon kuralı](../../user-guides/settings/general.md)
      * Wallarm Console'da yapılandırılan [Düşük seviye filtrasyon kuralları](../../user-guides/rules/wallarm-mode-rule.md)
2. Eğer beklenen davranış değiştirilen filtrasyon modu mantığıyla örtüşmüyorsa, lütfen filtrasyon modu ayarlarını yayımlanan değişikliklere uyarlayın [talimatlara](../../admin-en/configure-wallarm-mode.md) bakarak.

## Adım 13: Filtreleme düğümü işlemini test edin

--8<-- "../include-tr/waf/installation/test-after-node-type-upgrade.md"

## Adım 14: Önceki sürümün filtreleme düğümünü silin

Eğer 4.8 sürümünün dağıtım görüntüsü doğru şekilde çalışıyorsa, Wallarm Console → **Nodes** kısmında önceki sürümün filtreleme düğümünü silebilirsiniz.

## Adım 15: Etkin tehdit doğrulama modülünü yeniden etkinleştirin (yalnızca 2.16 veya daha düşük düğüm yükseltiliyorsa)

[Etkin tehdit doğrulama modülü kurulumuna dair önerileri](../../vulnerability-detection/threat-replay-testing/setup.md) öğrenin ve gerekiyorsa yeniden etkinleştirin.

Bir süre sonra, modül işlemi yanlış pozitifler oluşturmadığından emin olun. Eğer yanlış pozitifler keşfederseniz, [Wallarm teknik destek ekibine](mailto:support@wallarm.com) lütfen başvurun.