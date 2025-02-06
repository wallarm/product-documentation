# Bulut düğümü imajının yükseltilmesi

Bu yönergeler, AWS veya GCP üzerinde dağıtılmış 4.x sürümündeki bulut düğümü imajını 5.0 sürümüne yükseltme adımlarını tanımlar.

Ömrünü tamamlamış düğümü (3.6 veya daha düşük) yükseltmek için lütfen [farklı yönergeleri](older-versions/cloud-image.md) kullanın.

## Gereksinimler

--8<-- "../include/waf/installation/basic-reqs-for-upgrades.md"

## Adım 1: Filtering node 5.0 ile yeni bir örnek başlatın

1. Bulut platformu pazarında Wallarm filtering node imajını açın ve imaj başlatma işlemine geçin:
      * [Amazon Marketplace](https://aws.amazon.com/marketplace/pp/B073VRFXSD)
      * [GCP Marketplace](https://console.cloud.google.com/marketplace/details/wallarm-node-195710/wallarm-node)
2. Başlatma adımında aşağıdaki ayarları yapın:

      * İmaj sürümünü `5.x.x` olarak seçin
      * AWS için, **Security Group Settings** alanında [oluşturulan security group](../installation/cloud-platforms/aws/ami.md#2-create-a-security-group)'u seçin
      * AWS için, **Key Pair Settings** alanında [oluşturulan key pair](../installation/cloud-platforms/aws/ami.md#1-create-a-pair-of-ssh-keys-in-aws)'in adını seçin
3. Örnek başlatmasını onaylayın.
4. GCP için, örneği aşağıdaki [yönergelere](../installation/cloud-platforms/gcp/machine-image.md#2-configure-the-filtering-node-instance) uygun şekilde yapılandırın.

## Adım 2: Filtering node'u Wallarm Cloud'a bağlayın

1. SSH üzerinden filtering node örneğine bağlanın. Örneklere nasıl bağlanılacağına ilişkin detaylı yönergeler bulut platformu dokümantasyonunda mevcuttur:
      * [AWS dokümantasyonu](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)
      * [GCP dokümantasyonu](https://cloud.google.com/compute/docs/instances/connecting-to-instance)
2. Yeni bir Wallarm node oluşturun ve bulut platformu yönergelerinde açıklandığı şekilde oluşturulan token aracılığıyla Wallarm Cloud'a bağlayın:
      * [AWS](../installation/cloud-platforms/aws/ami.md#6-connect-the-instance-to-the-wallarm-cloud)
      * [GCP](../installation/cloud-platforms/gcp/machine-image.md#5-connect-the-instance-to-the-wallarm-cloud)

## Adım 3: Filtering node ayarlarını eski sürümden yeni sürüme kopyalayın

Eski Wallarm node sürümündeki aşağıdaki yapılandırma dosyalarından filtering node 5.0 dosyalarına, istek işleme ve proxy ayarlarını kopyalayın:

* NGINX ayarlarının yer aldığı `/etc/nginx/nginx.conf` ve diğer dosyalar
* Filtering node izleme servisi ayarlarının yer aldığı `/etc/nginx/conf.d/wallarm-status.conf`
* Ortam değişkenlerinin yer aldığı `/etc/environment`
* İstek işleme ve proxy ayarları için diğer özel yapılandırma dosyaları

NGINX yapılandırma dosyalarıyla çalışmaya ilişkin detaylı bilgiler [resmi NGINX dokümantasyonunda](https://nginx.org/docs/beginners_guide.html) mevcuttur.

Filtering node yönergelerinin listesi [burada](../admin-en/configure-parameters-en.md) bulunmaktadır.

## Adım 4: NGINX'i yeniden başlatın

Ayarların uygulanması için NGINX'i yeniden başlatın:

```bash
sudo systemctl restart nginx
```

## Adım 5: Wallarm node çalışmasını test edin

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## Adım 6: AWS veya GCP'de filtering node 5.0 tabanlı sanal makine imajını oluşturun

Filtering node 5.0 tabanlı sanal makine imajını oluşturmak için lütfen [AWS](../admin-en/installation-guides/amazon-cloud/create-image.md) veya [GCP](../admin-en/installation-guides/google-cloud/create-image.md) yönergelerini takip edin.

## Adım 7: Eski Wallarm node örneğini silin

Yeni filtering node sürümü başarıyla yapılandırılıp test edildiyse, AWS veya GCP yönetim konsolunu kullanarak eski filtering node sürümüne sahip örnek ve sanal makine imajını kaldırın.