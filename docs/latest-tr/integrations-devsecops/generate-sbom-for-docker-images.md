# Wallarm Docker Images için SBOM Oluşturma

Yazılım Malzeme Listesi (SBOM), bir uygulamadaki yazılım bileşenlerini ve bunların sürümlerini, lisanslarını ve güvenlik açıklarını içeren bağımlılıkları listeleyen bir envanterdir. Bu makale, Wallarm Docker görüntüleri için SBOM oluşturma adımlarını anlatmaktadır.

Wallarm Docker Images ile kullanılan bağımlılıkların potansiyel güvenlik risklerini değerlendirmek ve azaltmak için SBOM elde etmeniz gerekebilir. SBOM, yazılım bileşenleri hakkında şeffaflık sağlar ve uyumluluğun garanti edilmesine yardımcı olur.

## Wallarm Docker Images Listesi

Aşağıda [imzalı](verify-docker-image-signature.md) Wallarm Docker görüntülerinin listesi bulunmaktadır. Bu görüntülerin herhangi bir etiketi için SBOM oluşturabilirsiniz.

* [wallarm/node](https://hub.docker.com/r/wallarm/node) 4.8.0-1 ve sonrası: tüm Wallarm modüllerini içeren, bağımsız bir Wallarm dağıtım artefaktı olarak işlev gören [NGINX tabanlı Docker görüntüsü](../admin-en/installation-docker-en.md)
* [NGINX tabanlı Ingress Controller dağıtımı](../admin-en/installation-kubernetes-en.md) için Helm chart tarafından kullanılan tüm Docker görüntüleri:

    * [wallarm/ingress-controller](https://hub.docker.com/r/wallarm/ingress-controller)
    * [wallarm/node-helpers](https://hub.docker.com/r/wallarm/node-helpers)
* [Sidecar dağıtımı](../installation/kubernetes/sidecar-proxy/deployment.md) için Helm chart tarafından kullanılan tüm Docker görüntüleri:

    * [wallarm/sidecar](https://hub.docker.com/r/wallarm/sidecar)
    * [wallarm/sidecar-controller](https://hub.docker.com/r/wallarm/sidecar-controller)
    * [wallarm/ingress-collectd](https://hub.docker.com/r/wallarm/ingress-collectd)
    * [wallarm/ingress-tarantool](https://hub.docker.com/r/wallarm/ingress-tarantool)
    * [wallarm/ingress-ruby](https://hub.docker.com/r/wallarm/ingress-ruby)
    * [wallarm/ingress-python](https://hub.docker.com/r/wallarm/ingress-python)
* [wallarm/node-native-aio](https://hub.docker.com/r/wallarm/node-native-aio): Wallarm konektörleri için [self-hosted Native Node dağıtımı](../installation/native-node/docker-image.md) için Docker görüntüsü

## Gereksinimler

Wallarm Docker görüntüleri için bir SBOM oluşturmak üzere, [syft](https://github.com/anchore/syft) CLI aracını kullanmanız gerekmektedir.

SBOM oluşturma işlemine başlamadan önce, yerel makinenizde veya CI/CD boru hattınız içerisinde **syft**'in [kurulumunu](https://github.com/anchore/syft#installation) gerçekleştirdiğinizden emin olun.

## SBOM Oluşturma Prosedürü

Bir Docker görüntüsü için SBOM oluşturmak amacıyla, belirtilen görüntü etiketini istediğiniz etiket ile değiştirerek aşağıdaki komutu kullanın:

```bash
syft wallarm/ingress-controller:4.6.2-1
```

Varsayılan olarak, **syft** SBOM'u metin formatında döndürür. Ayrıca, çıktıyı CycloneDX, SPDX gibi diğer formatlarda da oluşturabilir ve bir dosyaya kaydedebilirsiniz, örn.:

```bash
syft wallarm/ingress-controller:4.6.2-1 --output spdx-json >> syft_json_sbom.spdx
syft wallarm/ingress-controller:4.6.2-1 --output cyclonedx-json >> cyclonedx_json_sbom.cyclonedx
```

SBOM oluşturulduktan sonra, bunu CI/CD boru hattınız içerisinde güvenlik taramaları, lisans uyumluluğu kontrolleri, güvenlik denetimleri veya rapor oluşturma gibi çeşitli işlemlerde kullanabilirsiniz.

Tüm bağımlılıkların gerçekten Wallarm'a ait olduğunu doğrulamak için, görüntünün [imzasını kontrol edebilirsiniz](verify-docker-image-signature.md). Görüntülerimizi dijital olarak imzalayarak, imzalı görüntünün gerçekten bize ait olduğunu garanti altına alıyoruz. Bu güvence, SBOM ile de sağlanır; çünkü SBOM, Wallarm'ın doğrulanmış görüntüsü ile ilişkilendirilecektir.