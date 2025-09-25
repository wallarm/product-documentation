[wallarm-status-instr]:             ../../admin-en/configure-statistics-service.md
[memory-instr]:                     ../../admin-en/configuration-guides/allocate-memory-for-waf-node.md
[waf-directives-instr]:             ../../admin-en/configure-parameters-en.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:           ../../images/admin-guides/test-attacks-quickstart.png
[nginx-process-time-limit-docs]:    ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../../user-guides/ip-lists/overview.md
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[ip-lists-docs]:                     ../../user-guides/ip-lists/overview.md
[link-wallarm-health-check]:        ../../admin-en/uat-checklist-en.md
[link-cloud-connect-guide]:         ../../installation/inline/compute-instances/aws/aws-ami.md#4-connect-the-instance-to-the-wallarm-cloud

# EOL bulut düğüm imajını yükseltme

Bu talimatlar, AWS veya GCP üzerinde dağıtılmış olan ömür sonu (EOL) bulut düğüm imajının (sürüm 3.6 ve altı) 6.x’e yükseltilmesi adımlarını açıklar.

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

## Gereksinimler

--8<-- "../include/waf/installation/basic-reqs-for-upgrades.md"

## Adım 1: Filtreleme düğümü modüllerini yükselttiğinizi Wallarm teknik desteğine bildirin (yalnızca 2.18 veya altı düğüm yükseltiliyorsa)

Eğer 2.18 veya altı bir düğümü yükseltiyorsanız, lütfen filtreleme düğümü modüllerini en son sürüme yükselttiğinizi [Wallarm teknik desteğine](mailto:support@wallarm.com) bildirin ve Wallarm hesabınız için yeni IP listesi mantığının etkinleştirilmesini isteyin. Yeni IP listesi mantığı etkinleştirildiğinde, Wallarm Console’daki [**IP lists**](../../user-guides/ip-lists/overview.md) bölümünün ulaşılabilir olduğundan emin olun.

## Adım 2: Threat Replay Testing modülünü devre dışı bırakın (yalnızca 2.16 veya altı düğüm yükseltiliyorsa)

Eğer 2.16 veya altı Wallarm düğümünü yükseltiyorsanız, Wallarm Console → **Vulnerabilities** → **Configure** altında [Threat Replay Testing](../../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing) modülünü devre dışı bırakın.

Modülün çalışması yükseltme sürecinde [yanlış pozitiflere](../../about-wallarm/protecting-against-attacks.md#false-positives) neden olabilir. Modülü devre dışı bırakmak bu riski en aza indirir.

## Adım 3: API portunu güncelleyin

--8<-- "../include/waf/upgrade/api-port-443.md"

## Adım 4: Son dönemdeki mimari güncellemeleri gözden geçirin

En son güncelleme, özellikle düğümün varsayılan yapılandırma dosyalarını değiştiren kullanıcıları etkileyebilecek [mimari değişiklikler](what-is-new.md#optimized-cloud-images) getirdi. Yeni imajın doğru şekilde yapılandırılması ve kullanımı için lütfen bu değişiklikleri inceleyin.

## Adım 5: 6.x filtreleme düğümüyle yeni bir örnek başlatın

Önceki Wallarm düğüm sürümünün aşağıdaki yapılandırma dosyalarından istek işleme ve proxy ayarlarını 6.x filtreleme düğümünün dosyalarına kopyalayın:

1. Bulut platformu pazar yerinde Wallarm filtreleme düğümü imajını açın ve imajı başlatma adımına ilerleyin:
      * [Amazon Marketplace](https://aws.amazon.com/marketplace/pp/B073VRFXSD)
      * [GCP Marketplace](https://console.cloud.google.com/marketplace/details/wallarm-node-195710/wallarm-node)
2. Başlatma adımında aşağıdaki ayarları yapın:

      * İmaj sürümü olarak `6.x` seçin
      * AWS için, **Security Group Settings** alanında oluşturduğunuz güvenlik grubunu seçin
      * AWS için, **Key Pair Settings** alanında oluşturduğunuz anahtar çifti adını seçin
3. Örneğin başlatılmasını onaylayın.
4. GCP için, örneği şu [talimatlara](../../installation/cloud-platforms/gcp/machine-image.md#2-configure-the-filtering-node-instance) göre yapılandırın.

## Adım 6: Wallarm düğümü filtreleme modu ayarlarını en son sürümlerde yayınlanan değişikliklere uyarlayın (yalnızca 2.18 veya altı düğüm yükseltiliyorsa)

1. Aşağıda listelenen ayarların beklenen davranışının, [`off` ve `monitoring` filtreleme modlarının değişen mantığına](what-is-new.md#filtration-modes) karşılık geldiğinden emin olun:
      * [Yönerge `wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [Wallarm Console’da yapılandırılan genel filtreleme kuralı](../../admin-en/configure-wallarm-mode.md#general-filtration-mode)
      * [Wallarm Console’da yapılandırılan uç nokta hedefli filtreleme kuralları](../../admin-en/configure-wallarm-mode.md#conditioned-filtration-mode)
2. Beklenen davranış değişen filtreleme modu mantığına karşılık gelmiyorsa, lütfen [talimatları](../../admin-en/configure-wallarm-mode.md) kullanarak filtreleme modu ayarlarını yayınlanan değişikliklere göre uyarlayın.

## Adım 7: Filtreleme düğümünü Wallarm Cloud’a bağlayın

1. SSH ile filtreleme düğümü örneğine bağlanın. Örneklere bağlanmaya ilişkin daha ayrıntılı talimatlar bulut platformu dokümantasyonunda mevcuttur:
      * [AWS dokümantasyonu](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)
      * [GCP dokümantasyonu](https://cloud.google.com/compute/docs/instances/connecting-to-instance)
2. Yeni bir Wallarm düğümü oluşturun ve oluşturulan belirteci kullanarak onu bulut platformuna özel talimatlarda açıklandığı şekilde Wallarm Cloud’a bağlayın:
      * [AWS][link-cloud-connect-guide]
      * [GCP](../../installation/cloud-platforms/gcp/machine-image.md#5-connect-the-filtering-node-to-the-wallarm-cloud)

## Adım 8: Filtreleme düğümü ayarlarını önceki sürümden yeni sürüme kopyalayın

1. Önceki Wallarm düğüm sürümünün aşağıdaki yapılandırma dosyalarından istek işleme ve proxy ayarlarını 6.x filtreleme düğümünün dosyalarına kopyalayın:
      * `/etc/nginx/nginx.conf` ve diğer NGINX ayar dosyaları
      * Filtreleme düğümü izleme servisi ayarlarını içeren `/etc/nginx/conf.d/wallarm-status.conf`

        Kopyalanan dosya içeriğinin [önerilen güvenli yapılandırmaya](../../admin-en/configure-statistics-service.md#setup) karşılık geldiğinden emin olun.

      * Ortam değişkenlerini içeren `/etc/environment`
      * Son [mimari değişiklikleri](what-is-new.md#optimized-cloud-images) dikkate alarak `/etc/nginx/sites-available/default` gibi istek işleme ve proxy için diğer özel yapılandırma dosyaları
1. Yapılandırma dosyalarında açıkça belirtilmişlerse aşağıdaki NGINX yönergelerinin adını değiştirin:

    * `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
    * `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
    * `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
    * `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

    Sadece yönergelerin adlarını değiştirdik, mantıkları aynı kaldı. Eski adlara sahip yönergeler yakında kullanımdan kaldırılacağından, önceden yeniden adlandırmanız önerilir.
1. [Genişletilmiş günlük formatı](../../admin-en/configure-logging.md#filter-node-variables) yapılandırılmışsa, yapılandırmada `wallarm_request_time` değişkeninin açıkça belirtilip belirtilmediğini kontrol edin.

      Eğer öyleyse, adını `wallarm_request_cpu_time` olarak değiştirin.

      Sadece değişkenin adını değiştirdik, mantığı aynı kaldı. Eski ad geçici olarak desteklenmeye devam ediyor, ancak yine de değişkenin yeniden adlandırılması önerilir.
1. Eğer 2.18 veya altı düğüm yükseltiliyorsa, izin listesi ve engelleme listesi yapılandırmasını önceki Wallarm düğüm sürümünden 6.x’e [taşıyın](../migrate-ip-lists-to-node-3.md).
1. Eğer `&/usr/share/nginx/html/wallarm_blocked.html` sayfası engellenen isteklere döndürülüyorsa, yeni sürümünü [kopyalayın ve özelleştirin](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page).

      Yeni düğüm sürümünde, Wallarm örnek engelleme sayfası [değiştirildi](what-is-new.md#new-blocking-page). Sayfadaki logo ve destek e-postası artık varsayılan olarak boş.

NGINX yapılandırma dosyalarıyla çalışma hakkında ayrıntılı bilgi [resmi NGINX dokümantasyonunda](https://nginx.org/docs/beginners_guide.html) mevcuttur.

Filtreleme düğümü yönergelerinin listesi [burada](../../admin-en/configure-parameters-en.md) mevcuttur.

## Adım 8: `overlimit_res` saldırı tespit yapılandırmasını yönergelerden kurala taşıyın

--8<-- "../include/waf/upgrade/migrate-to-overlimit-rule-nginx.md"

## Adım 9: NGINX’i yeniden başlatın

Ayarları uygulamak için NGINX’i yeniden başlatın:

```bash
sudo systemctl restart nginx
```

## Adım 10: Wallarm düğümünün çalışmasını test edin

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## Adım 11: AWS veya GCP’de 6.x filtreleme düğümüne dayalı sanal makine imajı oluşturun

6.x filtreleme düğümüne dayalı sanal makine imajı oluşturmak için lütfen [AWS](../../admin-en/installation-guides/amazon-cloud/create-image.md) veya [GCP](../../admin-en/installation-guides/google-cloud/create-image.md) talimatlarını izleyin.

## Adım 12: Önceki Wallarm düğüm örneğini silin

Yeni filtreleme düğümü sürümü başarıyla yapılandırılıp test edildiyse, AWS veya GCP yönetim konsolunu kullanarak önceki filtreleme düğümü sürümüne sahip örneği ve sanal makine imajını kaldırın.

## Adım 13: Threat Replay Testing modülünü yeniden etkinleştirin (yalnızca 2.16 veya altı düğüm yükseltiliyorsa)

[Threat Replay Testing modülünün kurulumuna ilişkin öneriyi](../../vulnerability-detection/threat-replay-testing/setup.md) öğrenin ve gerekirse yeniden etkinleştirin.

Bir süre sonra modülün çalışmasının yanlış pozitiflere yol açmadığından emin olun. Yanlış pozitifler tespit ederseniz, lütfen [Wallarm teknik destek](mailto:support@wallarm.com) ile iletişime geçin.