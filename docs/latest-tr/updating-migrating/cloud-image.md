[wallarm-status-instr]:             ../admin-en/configure-statistics-service.md
[memory-instr]:                     ../admin-en/configuration-guides/allocate-memory-for-waf-node.md
[waf-directives-instr]:             ../admin-en/configure-parameters-en.md
[ptrav-attack-docs]:                ../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../images/admin-guides/test-attacks-quickstart.png
[nginx-process-time-limit-docs]:    ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../user-guides/ip-lists/graylist.md
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md

# Bulut düğüm görüntüsünü yükseltme

Bu talimatlar, AWS veya GCP üzerinde dağıtılan 4.x bulut düğüm görüntüsünün 4.8'e kadar yükseltilme adımlarını anlatır.

Yaşam sonu düğümünü (3.6 veya altı) yükseltmek için lütfen [farklı talimatları](older-versions/cloud-image.md) kullanın.

## Gereksinimler

--8<-- "../include/waf/installation/basic-reqs-for-upgrades.md"

## Adım 1: Filtreleme düğümü 4.8 ile yeni bir örnek başlatın

1. Bulut platformu pazaryerinde Wallarm filtreleme düğümü görüntüsünü açın ve görüntü başlatmaya devam edin:
      * [Amazon Marketplace](https://aws.amazon.com/marketplace/pp/B073VRFXSD)
      * [GCP Marketplace](https://console.cloud.google.com/marketplace/details/wallarm-node-195710/wallarm-node)
2. Başlatma adımında aşağıdaki ayarları belirleyin:

      * Görüntü sürümü `4.8.x` seçin
      * AWS için, **Güvenlik Grup Ayarları** alanında [oluşturulan güvenlik grubunu](../installation/cloud-platforms/aws/ami.md#2-create-a-security-group) seçin
      * AWS için, **Anahtar Çifti Ayarları** alanında [oluşturulan anahtar çiftinin adını](../installation/cloud-platforms/aws/ami.md#1-create-a-pair-of-ssh-keys) seçin
3. Örneğin başlatılmasını onaylayın.
4. GCP için, bu [talimatlara](../installation/cloud-platforms/gcp/machine-image.md#2-configure-the-filtering-node-instance) göre örneği yapılandırın.

## Adım 2: Filtreleme düğümünü Wallarm Bulutuna bağlayın

1. SSH üzerinden filtreleme düğümü örneğine bağlanın. Örneklerle bağlantı kurma hakkında daha ayrıntılı talimatlar, bulut platformu belgelerinde mevcuttur:
      * [AWS belgeleri](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)
      * [GCP belgeleri](https://cloud.google.com/compute/docs/instances/connecting-to-instance)
2. Yeni bir Wallarm düğümü oluşturun ve oluşturulan belirteci kullanarak bulut platformunun talimatlarına göre Wallarm Bulutu'na bağlayın:
      * [AWS](../installation/cloud-platforms/aws/ami.md#5-connect-the-filtering-node-to-the-wallarm-cloud)
      * [GCP](../installation/cloud-platforms/gcp/machine-image.md#4-connect-the-filtering-node-to-the-wallarm-cloud)


## Adım 3: Filtreleme düğümü ayarlarını önceki sürümden yeni sürüme kopyalayın

1. Önceki Wallarm düğüm sürümünün aşağıdaki yapılandırma dosyalarındaki işleme ve proxy talepleri için ayarları, filtreleme düğümü 4.8'in dosyalarına kopyalayın:
      
      * `/etc/nginx/nginx.conf` ve diğer NGINX ayar dosyaları
      * `/etc/nginx/conf.d/wallarm.conf` ile genel filtreleme düğüm ayarları
      * `/etc/nginx/conf.d/wallarm-status.conf` ile filtreleme düğüm izleme servisi ayarları
      * `/etc/environment` ile çevre değişkenleri
      * `/etc/default/wallarm-tarantool` ile Tarantool ayarları
      * Diğer isteklerin işlenmesi ve proxy ile ilgili özel ayarlar için diğer dosyalar
1. Engellenen taleplere `&/usr/share/nginx/html/wallarm_blocked.html` sayfası dönüyorsa, [yeni sürümünü kopyalayın ve özelleştirin](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page).

      Yeni düğüm sürümünde, Wallarm örnek engelleme sayfası [değiştirildi](what-is-new.md#new-blocking-page). Sayfada logo ve destek e-postası şimdi varsayılan olarak boştur.

NGINX yapılandırma dosyalarıyla çalışma hakkında ayrıntılı bilgi, [resmi NGINX dokümantasyonunda](https://nginx.org/docs/beginners_guide.html) mevcuttur.

Filtreleme düğüm yönergelerinin listesi, [burada](../admin-en/configure-parameters-en.md) mevcuttur.

## Adım 4: NGINX'i yeniden başlatın

Ayarları uygulamak için NGINX'i yeniden başlatın:

``` bash
sudo systemctl restart nginx
```

## Adım 5: Wallarm düğüm işlemini test edin

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## Adım 6: AWS veya GCP'de filtreleme düğümü 4.8'e dayalı sanal makine görüntüsü oluşturun

Filtreleme düğümü 4.8'e dayalı sanal makine görüntüsü oluşturmak için, lütfen [AWS](../admin-en/installation-guides/amazon-cloud/create-image.md) veya [GCP](../admin-en/installation-guides/google-cloud/create-image.md) için talimatları izleyin.

## Adım 7: Önceki Wallarm düğüm örneğini silin

Eğer yeni sürüm filtreleme düğümü başarıyla yapılandırıldı ve test edildi ise, AWS veya GCP yönetim konsolu kullanılarak önceki sürüm filtreleme düğümü ile ilgili örneği ve sanal makine görüntüsünü kaldırın.