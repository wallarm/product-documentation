[wallarm-status-instr]:             ../admin-en/configure-statistics-service.md
[memory-instr]:                     ../admin-en/configuration-guides/allocate-memory-for-waf-node.md
[waf-directives-instr]:             ../admin-en/configure-parameters-en.md
[ptrav-attack-docs]:                ../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../images/admin-guides/test-attacks-quickstart.png
[nginx-process-time-limit-docs]:    ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../user-guides/ip-lists/overview.md
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[ip-lists-docs]:                     ../user-guides/ip-lists/overview.md
[link-wallarm-health-check]:        ../admin-en/uat-checklist-en.md
[link-cloud-connect-guide]:         ../installation/inline/compute-instances/aws/aws-ami.md#4-connect-the-instance-to-the-wallarm-cloud


# Bulut düğümü imajını yükseltme

Bu talimatlar, AWS veya GCP üzerinde dağıtılmış bulut düğümü imajını en son 6.x sürümüne yükseltme adımlarını açıklar.

Ömrünü tamamlamış düğümü (3.6 veya daha düşük) yükseltmek için lütfen [farklı talimatları](older-versions/cloud-image.md) kullanın.

## Gereksinimler

--8<-- "../include/waf/installation/basic-reqs-for-upgrades.md"

## Adım 1: 6.x filtreleme düğümü ile yeni bir örnek başlatın

1. Bulut platformu pazarında Wallarm filtreleme düğümü imajını açın ve imaj başlatmaya devam edin:
      * [Amazon Marketplace](https://aws.amazon.com/marketplace/pp/B073VRFXSD)
      * [GCP Marketplace](https://console.cloud.google.com/marketplace/details/wallarm-node-195710/wallarm-node)
2. Başlatma adımında aşağıdaki ayarları yapın:

      * İmaj sürümü `6.x.x` seçin
      * AWS için, **Security Group Settings** alanında oluşturulan güvenlik grubunu seçin
      * AWS için, **Key Pair Settings** alanında oluşturulan anahtar çiftinin adını seçin
3. Örnek başlatmayı onaylayın.
4. GCP için, örneği şu [talimatları](../installation/cloud-platforms/gcp/machine-image.md#2-configure-the-filtering-node-instance) izleyerek yapılandırın.

## Adım 2: Filtreleme düğümünü Wallarm Cloud'a bağlayın

1. SSH üzerinden filtreleme düğümü örneğine bağlanın. Örnek(ler)e bağlanmaya ilişkin daha ayrıntılı talimatlar, bulut platformunun dokümantasyonunda mevcuttur:
      * [AWS dokümantasyonu](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)
      * [GCP dokümantasyonu](https://cloud.google.com/compute/docs/instances/connecting-to-instance)
2. Yeni bir Wallarm düğümü oluşturun ve bulut platformuna ilişkin talimatlarda açıklandığı şekilde oluşturulan belirteci kullanarak Wallarm Cloud'a bağlayın:
      * [AWS][link-cloud-connect-guide]
      * [GCP](../installation/cloud-platforms/gcp/machine-image.md#5-connect-the-filtering-node-to-the-wallarm-cloud)

## Adım 3: Filtreleme düğümü ayarlarını önceki sürümden yeni sürüme kopyalayın

Aşağıdaki önceki Wallarm düğümü sürümüne ait yapılandırma dosyalarından istek işleme ve proxy’leme ayarlarını filtreleme düğümü 6.x dosyalarına kopyalayın:

* `/etc/nginx/nginx.conf` ve diğer NGINX ayar dosyaları
* Filtreleme düğümü izleme servisi ayarlarını içeren `/etc/nginx/wallarm-status.conf` (veya `/etc/nginx/conf.d/wallarm-status.conf`)
* Ortam değişkenlerini içeren `/etc/environment`
* İstek işleme ve proxy’leme için diğer özel yapılandırma dosyaları, ör. `/etc/nginx/sites-available/default`

NGINX yapılandırma dosyalarıyla çalışma hakkında ayrıntılı bilgi [resmi NGINX dokümantasyonunda](https://nginx.org/docs/beginners_guide.html) mevcuttur.

Filtreleme düğümü yönergelerinin listesi [burada](../admin-en/configure-parameters-en.md) mevcuttur.

## Adım 4: NGINX’i yeniden başlatın

Ayarları uygulamak için NGINX’i yeniden başlatın:

```bash
sudo systemctl restart nginx
```

## Adım 5: Wallarm düğümünün çalışmasını test edin

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## Adım 6: AWS veya GCP’de filtreleme düğümü 6.x’e dayalı sanal makine imajı oluşturun

Filtreleme düğümü 6.x’e dayalı sanal makine imajı oluşturmak için lütfen [AWS](../admin-en/installation-guides/amazon-cloud/create-image.md) veya [GCP](../admin-en/installation-guides/google-cloud/create-image.md) talimatlarını izleyin.

## Adım 7: Önceki Wallarm düğümü örneğini silin

Yeni sürüm filtreleme düğümü başarıyla yapılandırılıp test edildiyse, AWS veya GCP yönetim konsolunu kullanarak önceki sürüme ait filtreleme düğümü örneğini ve sanal makine imajını kaldırın.