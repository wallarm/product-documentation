[wallarm-status-instr]:             ../../admin-en/configure-statistics-service.md
[memory-instr]:                     ../../admin-en/configuration-guides/allocate-memory-for-waf-node.md
[waf-directives-instr]:             ../../admin-en/configure-parameters-en.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:           ../../images/admin-guides/test-attacks-quickstart.png
[nginx-process-time-limit-docs]:    ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../../user-guides/ip-lists/graylist.md
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md

# Hizmet Ömrünün Sonu Bulut Düğüm İmajını Yükseltme

Bu talimatlar, AWS veya GCP üzerinde yerleştirilmiş hizmet ömrünün sonu bulut düğüm imajını (3.6 sürümü ve altı) 4.8'e güncelleme adımlarını açıklamaktadır.

--8<-- "../include-tr/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

## Gereklilikler

--8<-- "../include-tr/waf/installation/basic-reqs-for-upgrades.md"

## Adım 1: Wallarm teknik desteğine filtreleme düğümü modüllerini güncellediğinizi bildirin (sadece 2.18 veya daha düşük düğümü güncellerken)

2.18 veya daha düşük bir düğümü güncelliyorsanız, lütfen [Wallarm teknik destek](mailto:support@wallarm.com) için son sürüme kadar filtreleme düğümü modüllerinizi güncellediğinizi ve Wallarm hesabınız için yeni IP listesi mantığını etkinleştirmenizi isteyin. Yeni IP listesi mantığı etkinleştirildiğinde, lütfen Wallarm konsolundaki [**IP listeleri**](../../user-guides/ip-lists/overview.md) bölümünün mevcut olduğundan emin olun.

## Adım 2: Aktif tehdit doğrulama modülünü devre dışı bırakın (sadece 2.16 veya daha düşük düğümü güncellerken)

Wallarm düğümünü 2.16 veya daha düşük bir sürümle güncelliyorsanız, lütfen Wallarm Konsolu → **Vulnerabilities** → **Configure** bölümündeki [Active threat verification](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) modülünü devre dışı bırakın.

Modülün işlemi, güncelleme süreci sırasında [false positives](../../about-wallarm/protecting-against-attacks.md#false-positives) oluşturabilir. Modülü devre dışı bırakmak bu riski en aza indirir.

## Adım 3: API portunu güncelleyin

--8<-- "../include-tr/waf/upgrade/api-port-443.md"

## Adım 4: Filtreleme düğümü 4.8 ile yeni bir örneği başlatın

1. Bulut platformu pazar yerinde Wallarm filtreleme düğümü imajını açın ve imajın başlatmasına geçin:
      * [Amazon Marketplace](https://aws.amazon.com/marketplace/pp/B073VRFXSD)
      * [GCP Marketplace](https://console.cloud.google.com/marketplace/details/wallarm-node-195710/wallarm-node)
2. Başlatma adımında, aşağıdaki ayarları belirleyin:

      * `4.8.x` imaj versiyonunu seçin
      * AWS için, [oluşturulan güvenlik grubunu](../../installation/cloud-platforms/aws/ami.md#2-create-a-security-group) **Security Group Settings** alanında seçin
      * AWS için, [oluşturulan anahtar çiftinin adını](../../installation/cloud-platforms/aws/ami.md#1-create-a-pair-of-ssh-keys) **Key Pair Settings** alanında seçin
3. Örneğin başlatılmasını onaylayın.
4. GCP için, [talimatlara](../../installation/cloud-platforms/gcp/machine-image.md#2-configure-the-filtering-node-instance) göre örneği yapılandırın.

## Adım 5: Wallarm düğümü filtrasyon modu ayarlarını en son sürümlerde yayınlanan değişikliklere göre ayarlayın (sadece 2.18 veya daha düşük düğümü güncellerken)

1. Aşağıda listelenen ayarların beklenen davranışının, [`off` ve `monitoring` filtrasyon modlarının değişen mantığına](what-is-new.md#filtration-modes) karşılık geldiğinden emin olun:
      * [Directive `wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [Wallarm Konsolu'nda yapılandırılan Genel filtrasyon kuralı](../../user-guides/settings/general.md)
      * [Wallarm Konsolu'nda yapılandırılan Düşük seviye filtrasyon kuralları](../../user-guides/rules/wallarm-mode-rule.md)
2. Beklenen davranış, değişen filtrasyon modu mantığına karşılık gelmiyorsa, lütfen filtrasyon modu ayarlarını yayınlanan değişikliklere göre ayarlayın. [instructions](../../admin-en/configure-wallarm-mode.md) kullanabilirsiniz.

## Adım 6: Filtreleme düğümünü Wallarm Cloud'a bağlayın

1. SSH üzerinden filtreleme düğümü örneğine bağlanın. Kullanıcıların örneklerle bağlantı kurma hakkında daha detaylı talimatlar bulut platformu belgelerinde mevcuttur:
      * [AWS belgeleri](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)
      * [GCP belgeleri](https://cloud.google.com/compute/docs/instances/connecting-to-instance)
2. Yeni bir Wallarm düğümü oluşturun ve bulut platformu için talimatlara göre üretilen anahtar kullanarak Wallarm Cloud'a bağlayın:
      * [AWS](../../installation/cloud-platforms/aws/ami.md#5-connect-the-filtering-node-to-the-wallarm-cloud)
      * [GCP](../../installation/cloud-platforms/gcp/machine-image.md#4-connect-the-filtering-node-to-the-wallarm-cloud)

## Adım 7: Filtreleme düğümü ayarlarını önceki sürümden yeni sürüme kopyalayın

1. İstekleri işleme ve proxy ayarların aşağıdaki yapılandırma dosyalarından filtreleme düğümü 4.8'in dosyalarına kopyalayın:
      * `/etc/nginx/nginx.conf` ve diğer NGINX ayarlarına sahip dosyalar
      * `/etc/nginx/conf.d/wallarm.conf` global filtreleme düğümü ayarları ile
      * `/etc/nginx/conf.d/wallarm-status.conf` filtreleme düğümü izleme hizmeti ayarları ile

        Kopyalanan dosya içeriklerinin [önerilen güvenli yapılandırmaya](../../admin-en/configure-statistics-service.md#configuring-the-statistics-service) uygun olduğundan emin olun.

      * `/etc/environment` çevre değişkenleri ile
      * `/etc/default/wallarm-tarantool` Tarantool ayarları ile
      * Diğer istekleri işleme ve proxy için özel ayarlarla ilgili dosyalar
1. Yapılandırma dosyalarında açıkça belirtildiyse aşağıdaki NGINX direktiflerini yeniden adlandırın:

    * `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
    * `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
    * `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
    * `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

    Sadece direktif adlarını değiştirdik, mantıkları aynı kalıyor. Yakında eski isimler ile direktifler kullanılmayacak hale gelecek, bu nedenle onları adlandırmanız önerilir.
1. [Genişletilmiş günlük formatı](../../admin-en/configure-logging.md#filter-node-variables) yapılandırılmışsa, lütfen `wallarm_request_time` değişkeninin açıkça yapılandırmada belirtildiğini kontrol edin.

      Eğer öyleyse, lütfen onu `wallarm_request_cpu_time` olarak yeniden adlandırın.

      Sadece değişken adını değiştirdik, mantığı aynı kaldı. Eski isim de geçici olarak desteklenmektedir, ancak değişkenin adını değiştirmeniz önerilir.
1. 2.18 veya daha düşük bir düğümü güncelliyorsanız, izin listesi ve red listesi yapılandırmalarını önceki Wallarm düğüm sürümünden 4.8'e [aktarın](../migrate-ip-lists-to-node-3.md).
1. Engellenen isteklere `&/usr/share/nginx/html/wallarm_blocked.html` sayfası iade ediliyorsa, [kopyalayın ve özelleştirin](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) yeni sürümünü.

      Yeni düğüm sürümünde, Wallarm örnek engelleme sayfası [değiştirildi](what-is-new.md#new-blocking-page). Sayfadaki logo ve destek e-postası artık varsayılan olarak boştur.

NGINX yapılandırma dosyalarıyla çalışma hakkında ayrıntılı bilgi [official NGINX documentation](https://nginx.org/docs/beginners_guide.html) adresinde bulunabilir.

Filtreleme düğümü direktiflerinin listesi [here](../../admin-en/configure-parameters-en.md) mevcuttur.

## Adım 8: `overlimit_res` saldırı tespit yapılandırmasını direktiflerden kurala aktarın

--8<-- "../include-tr/waf/upgrade/migrate-to-overlimit-rule-nginx.md"

## Adım 9: NGINX'i yeniden başlatın

Ayarları uygulamak için NGINX'i yeniden başlatın:

```bash
sudo systemctl restart nginx
```

## Adım 10: Wallarm düğümünün çalışmasını test edin

--8<-- "../include-tr/waf/installation/test-waf-operation-no-stats.md"

## Adım 11: Filtreleme düğümü 4.8'e dayalı AWS veya GCP'de sanal makine imajı oluşturun

Filtreleme düğümü 4.8'e dayalı sanal makine görüntüsü oluşturmak için, lütfen [AWS](../../admin-en/installation-guides/amazon-cloud/create-image.md) veya [GCP](../../admin-en/installation-guides/google-cloud/create-image.md) talimatlarına bakınız.

## Adım 12: Önceki Wallarm düğüm örneğini silin

Filtreleme düğümünün yeni sürümü başarıyla yapılandırıldıysa ve test edildiyse, AWS veya GCP yönetim konsolu kullanarak önceki sürüm filtreleme düğümüyle birlikte örneği ve sanal makine imajını kaldırın.

## Adım 13: Aktif tehdit doğrulama modülünü yeniden etkinleştirin (sadece 2.16 veya daha düşük düğümü güncellerken)

[Aktif tehdit doğrulama modülü kurulumu hakkında tavsiyeleri](../../vulnerability-detection/threat-replay-testing/setup.md) öğrenin ve gerekiyorsa yeniden etkinleştirin.

Bir süre sonra, modülün işlemi yanıltıcı pozitiflere neden olmadığından emin olun. Yanıltıcı pozitifler bulunursa, lütfen [Wallarm teknik destek](mailto:support@wallarm.com) ile iletişime geçin.