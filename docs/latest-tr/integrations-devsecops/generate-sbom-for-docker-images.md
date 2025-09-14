# Wallarm Docker İmajları için SBOM Oluşturma

Yazılım Malzeme Listesi (SBOM), bir uygulamadaki yazılım bileşenlerini ve bunların bağımlılıklarını; sürümler, lisanslar ve güvenlik açıkları dahil olmak üzere listeleyen bir envanterdir. Bu makale, Wallarm Docker imajları için SBOM oluşturma konusunda rehberlik eder.

Wallarm Docker imajları için SBOM’u, imajlarda kullanılan bağımlılıklarla ilişkili potansiyel güvenlik risklerini değerlendirmek ve azaltmak amacıyla elde etmeniz gerekebilir. SBOM, yazılım bileşenlerine şeffaflık sağlar ve uyumluluğu sağlamaya yardımcı olur.

## Wallarm Docker imajlarının listesi

Aşağıda [imzalı](verify-docker-image-signature.md) Wallarm Docker imajlarının listesi yer almaktadır. Bu imajların herhangi bir etiketinden SBOM üretebilirsiniz.

* [wallarm/node](https://hub.docker.com/r/wallarm/node) 4.8.0-1 ve üzeri: [NGINX tabanlı Docker imajı](../admin-en/installation-docker-en.md) tüm Wallarm modüllerini içerir ve Wallarm dağıtımı için bağımsız bir artefakt olarak hizmet eder
* [NGINX tabanlı Ingress Controller dağıtımı](../admin-en/installation-kubernetes-en.md) için Helm chart’ının kullandığı tüm Docker imajları:

    * [wallarm/ingress-controller](https://hub.docker.com/r/wallarm/ingress-controller)
    * [wallarm/node-helpers](https://hub.docker.com/r/wallarm/node-helpers)
* [Sidecar dağıtımı](../installation/kubernetes/sidecar-proxy/deployment.md) için Helm chart’ının kullandığı tüm Docker imajları:

    * [wallarm/sidecar](https://hub.docker.com/r/wallarm/sidecar)
    * [wallarm/sidecar-controller](https://hub.docker.com/r/wallarm/sidecar-controller)
    * [wallarm/node-helpers](https://hub.docker.com/r/wallarm/node-helpers)
* [wallarm/node-native-aio](https://hub.docker.com/r/wallarm/node-native-aio): Wallarm connectors için [self-hosted Native Node dağıtımına yönelik Docker imajı](../installation/native-node/docker-image.md)

## Gereksinimler

Wallarm Docker imajları için SBOM oluşturmak üzere [syft](https://github.com/anchore/syft) CLI aracını kullanmanız gerekir.

SBOM oluşturmaya başlamadan önce, yerel makinenize veya CI/CD boru hattınıza **syft**’i [kurduğunuzdan](https://github.com/anchore/syft#installation) emin olun.

## SBOM oluşturma işlemi

Bir Docker imajı için SBOM oluşturmak üzere, aşağıdaki komutu kullanın ve belirtilen imaj etiketini istediğiniz etiketle değiştirin:

```bash
syft wallarm/ingress-controller:4.6.2-1
```

Varsayılan olarak, **syft** SBOM’u metin biçiminde döndürür. Ayrıca CycloneDX, SPDX gibi diğer biçimlerde de üretebilir ve çıktıyı bir dosyaya kaydedebilirsiniz, örneğin:

```bash
syft wallarm/ingress-controller:4.6.2-1 --output spdx-json >> syft_json_sbom.spdx
syft wallarm/ingress-controller:4.6.2-1 --output cyclonedx-json >> cyclonedx_json_sbom.cyclonedx
```

SBOM’u oluşturduktan sonra, onu CI/CD boru hattınızda zafiyet taraması, lisans uyumluluğu kontrolleri, güvenlik denetimleri veya rapor oluşturma gibi çeşitli işlemler için kullanabilirsiniz.

Tüm bağımlılıkların gerçekten Wallarm’a ait olduğunu doğrulamak için, basitçe imajı bir bütün olarak [imajın imzasını kontrol edin](verify-docker-image-signature.md). İmajlarımızı dijital olarak imzalayarak, imzalı imajın gerçekten bize ait olduğunu garanti ederiz. Buna bağlı olarak, SBOM da Wallarm’a ait doğrulanmış imajla ilişkilendirileceğinden aynı güvence SBOM’a da genişler.