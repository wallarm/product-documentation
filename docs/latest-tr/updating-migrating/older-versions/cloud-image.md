```markdown
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

# EOL Bulut Düğüm Görüntüsünün Yükseltilmesi

Bu talimatlar, AWS veya GCP üzerinde dağıtılmış (sürüm 3.6 ve daha düşük) EOL bulut düğüm görüntüsünün 5.0'a kadar yükseltilmesi için gerekli adımları açıklamaktadır.

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

## Gereksinimler

--8<-- "../include/waf/installation/basic-reqs-for-upgrades.md"

## Adım 1: Filtreleme düğüm modüllerini yükselttiğinizi Wallarm technical support'a bildirin (sadece düğüm 2.18 veya daha düşük yükseltiliyorsa)

Eğer düğüm 2.18 veya daha düşük yükseltiliyorsa, [Wallarm technical support](mailto:support@wallarm.com) ile iletişime geçerek filtreleme düğüm modüllerini en son sürüme yükselttiğinizi bildirin ve Wallarm hesabınız için yeni IP listesi mantığının etkinleştirilmesini talep edin. Yeni IP listesi mantığı etkinleştirildiğinde, Wallarm Console’daki [**IP lists**](../../user-guides/ip-lists/overview.md) bölümünün kullanılabilir olduğundan emin olun.

## Adım 2: Threat Replay Testing modülünü devre dışı bırakın (sadece düğüm 2.16 veya daha düşük yükseltiliyorsa)

Eğer Wallarm düğümü 2.16 veya daha düşük yükseltiliyorsa, lütfen Wallarm Console → **Vulnerabilities** → **Configure** üzerinden [Threat Replay Testing](../../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing) modülünü devre dışı bırakın.

Modülün çalışması, yükseltme işlemi sırasında [yanlış pozitif sonuçlara](../../about-wallarm/protecting-against-attacks.md#false-positives) neden olabilir. Bu riski en aza indirmek için modülü devre dışı bırakın.

## Adım 3: API portunu güncelleyin

--8<-- "../include/waf/upgrade/api-port-443.md"

## Adım 4: Son mimari güncellemeleri gözden geçirin

Son güncelleme, özellikle düğümün varsayılan konfigürasyon dosyalarını değiştiren kullanıcılar üzerinde etkisi olabilecek [mimari değişiklikleri](what-is-new.md#optimized-cloud-images) getirmiştir. Yeni görüntünün doğru şekilde yapılandırılması ve kullanılması için bu değişikliklere aşina olun.

## Adım 5: Filtreleme düğümü 5.0 ile yeni bir örnek başlatın

Önceki Wallarm düğüm sürümüne ait aşağıdaki konfigürasyon dosyalarından isteklerin işlenmesi ve proxy işlemleri için ayarları, filtreleme düğümü 5.0 dosyalarına kopyalayın:

1. Bulut platformu marketplace'inde Wallarm filtreleme düğümü görüntüsünü açın ve görüntüyü başlatmaya devam edin:
      * [Amazon Marketplace](https://aws.amazon.com/marketplace/pp/B073VRFXSD)
      * [GCP Marketplace](https://console.cloud.google.com/marketplace/details/wallarm-node-195710/wallarm-node)
2. Başlatma adımında, aşağıdaki ayarları yapın:
      * Görüntü sürümünü `5.0.x` olarak seçin
      * AWS için, **Security Group Settings** alanında [oluşturulan security group'u](../../installation/cloud-platforms/aws/ami.md#2-create-a-security-group) seçin
      * AWS için, **Key Pair Settings** alanında [oluşturulan key pair'in adını](../../installation/cloud-platforms/aws/ami.md#1-create-a-pair-of-ssh-keys-in-aws) seçin
3. Örneğin başlatılmasını onaylayın.
4. GCP için, örneği bu [talimatları](../../installation/cloud-platforms/gcp/machine-image.md#2-configure-the-filtering-node-instance) izleyerek yapılandırın.

## Adım 6: En son sürümlerde yayınlanan değişikliklere uygun olarak Wallarm düğüm filtreleme modu ayarlarını düzenleyin (sadece düğüm 2.18 veya daha düşük yükseltiliyorsa)

1. Aşağıda listelenen ayarların beklenen davranışının, [değiştirilen `off` ve `monitoring` filtreleme modlarının mantığı ile](what-is-new.md#filtration-modes) uyumlu olduğundan emin olun:
      * [Directive `wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [General filtration rule configured in Wallarm Console](../../admin-en/configure-wallarm-mode.md#general-filtration-rule-in-wallarm-console)
      * [Endpoint-targeted filtration rules configured in Wallarm Console](../../admin-en/configure-wallarm-mode.md#endpoint-targeted-filtration-rules-in-wallarm-console)
2. Eğer beklenen davranış değişen filtreleme modu mantığına uymuyorsa, lütfen [talimatları](../../admin-en/configure-wallarm-mode.md) kullanarak filtreleme modu ayarlarını yayınlanan değişikliklere göre ayarlayın.

## Adım 7: Filtreleme düğümünü Wallarm Cloud'a bağlayın

1. SSH aracılığıyla filtreleme düğümü örneğine bağlanın. Örneklere bağlanma ile ilgili daha ayrıntılı talimatlar bulut platformu dokümantasyonunda mevcuttur:
      * [AWS documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)
      * [GCP documentation](https://cloud.google.com/compute/docs/instances/connecting-to-instance)
2. Yeni bir Wallarm düğümü oluşturun ve bulut platformu talimatlarında belirtildiği şekilde oluşturulan token'ı kullanarak Wallarm Cloud'a bağlayın:
      * [AWS](../../installation/cloud-platforms/aws/ami.md#6-connect-the-instance-to-the-wallarm-cloud)
      * [GCP](../../installation/cloud-platforms/gcp/machine-image.md#5-connect-the-instance-to-the-wallarm-cloud)

## Adım 8: Önceki sürümden filtreleme düğümü ayarlarını yeni sürüme kopyalayın

1. Önceki Wallarm düğüm sürümüne ait aşağıdaki konfigürasyon dosyalarından isteklerin işlenmesi ve proxy işlemleri için ayarları filtreleme düğümü 5.0 dosyalarına kopyalayın:
      * `/etc/nginx/nginx.conf` ve NGINX ayarlarına sahip diğer dosyalar
      * Filtreleme düğümü izleme servisi ayarlarını içeren `/etc/nginx/conf.d/wallarm-status.conf`

        Kopyalanan dosya içeriğinin, [önerilen güvenli konfigürasyon](../../admin-en/configure-statistics-service.md#setup) ile uyumlu olduğundan emin olun.

      * Ortam değişkenlerini içeren `/etc/environment`
      * Son [mimari değişiklikleri](what-is-new.md#optimized-cloud-images) dikkate alınarak, istek işleme ve proxy için diğer özel konfigürasyon dosyaları
1. Konfigürasyon dosyalarında açıkça belirtilmişse, aşağıdaki NGINX yönergelerinin adını değiştirin:
    * `wallarm_instance` → [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application)
    * `wallarm_local_trainingset_path` → [`wallarm_custom_ruleset_path`](../../admin-en/configure-parameters-en.md#wallarm_custom_ruleset_path)
    * `wallarm_global_trainingset_path` → [`wallarm_protondb_path`](../../admin-en/configure-parameters-en.md#wallarm_protondb_path)
    * `wallarm_ts_request_memory_limit` → [`wallarm_general_ruleset_memory_limit`](../../admin-en/configure-parameters-en.md#wallarm_general_ruleset_memory_limit)

    Sadece yönergelerin adlarını değiştirdik, mantıkları aynı kalmaktadır. Önceki adlarla belirtilen yönergeler yakında kullanım dışı kalacağından, bunları yeniden adlandırmanız önerilir.
1. Eğer [genişletilmiş logging formatı](../../admin-en/configure-logging.md#filter-node-variables) yapılandırıldıysa, lütfen `wallarm_request_time` değişkeninin konfigürasyonda açıkça belirtildiğini kontrol edin.

      Eğer öyleyse, adını `wallarm_request_cpu_time` olarak değiştirin.

      Sadece değişken adını değiştirdik, mantığı aynı kalmaktadır. Eski ad geçici olarak desteklenmekle birlikte, yine de değişkenin yeniden adlandırılması önerilir.
1. Eğer düğüm 2.18 veya daha düşük yükseltiliyorsa, önceki Wallarm düğüm sürümünden 5.0'a [allowlist ve denylist konfigürasyonunu taşıyın](../migrate-ip-lists-to-node-3.md).
1. Engellenen isteklere `&/usr/share/nginx/html/wallarm_blocked.html` sayfası döndürülüyorsa, yeni versiyonunu [kopyalayıp özelleştirin](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page).

      Yeni düğüm sürümünde, Wallarm örnek engelleme sayfası [değiştirilmiştir](what-is-new.md#new-blocking-page). Sayfadaki logo ve destek e-posta adresi artık varsayılan olarak boş bırakılmaktadır.

NGINX konfigürasyon dosyaları ile çalışma hakkında ayrıntılı bilgi [resmi NGINX dokümantasyonunda](https://nginx.org/docs/beginners_guide.html) mevcuttur.

Filtreleme düğüm yönergelerinin listesi [burada](../../admin-en/configure-parameters-en.md) mevcuttur.

## Adım 8: `overlimit_res` saldırı tespiti konfigürasyonunu yönergelerden kurala aktarın

--8<-- "../include/waf/upgrade/migrate-to-overlimit-rule-nginx.md"

## Adım 9: NGINX'i yeniden başlatın

Ayarları uygulamak için NGINX'i yeniden başlatın:

```bash
sudo systemctl restart nginx
```

## Adım 10: Wallarm düğüm çalışmasını test edin

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## Adım 11: AWS veya GCP'de filtreleme düğümü 5.0 tabanlı sanal makine görüntüsü oluşturun

Filtreleme düğümü 5.0 tabanlı sanal makine görüntüsünü oluşturmak için, lütfen [AWS](../../admin-en/installation-guides/amazon-cloud/create-image.md) veya [GCP](../../admin-en/installation-guides/google-cloud/create-image.md) talimatlarını izleyin.

## Adım 12: Önceki Wallarm düğüm örneğini silin

Filtreleme düğümünün yeni sürümü başarıyla yapılandırılıp test edildiyse, AWS veya GCP yönetim konsolu kullanarak önceki sürüme ait örnek ve sanal makine görüntüsünü kaldırın.

## Adım 13: Threat Replay Testing modülünü yeniden etkinleştirin (sadece düğüm 2.16 veya daha düşük yükseltiliyorsa)

Threat Replay Testing modül kurulumu hakkındaki [önerileri](../../vulnerability-detection/threat-replay-testing/setup.md) öğrenin ve gerekliyse modülü yeniden etkinleştirin.

Bir süre sonra, modülün çalışmasının yanlış pozitif sonuçlara yol açmadığından emin olun. Yanlış pozitifler tespit edilirse, lütfen [Wallarm technical support](mailto:support@wallarm.com) ile iletişime geçin.
```