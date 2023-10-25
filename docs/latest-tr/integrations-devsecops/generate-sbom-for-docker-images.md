# Wallarm Docker İmajları için SBOM Oluşturma

Yazılım Bill of Materials (SBOM), bir uygulamanın yazılım bileşenlerini ve bağımlılıklarını, sürümleri, lisansları ve zafiyetleri listeler. Bu makale, Wallarm Docker imajları için SBOM oluşturma konusunda size rehberlik edecektir.

Wallarm Docker İmajları için SBOM'ı, imajlarda kullanılan bağımlılıklarla ilgili potansiyel güvenlik risklerini değerlendirmek ve hafifletmek için ihtiyaç duyabilirsiniz. SBOM, yazılım bileşenlerine şeffaflık sağlar ve uyumluluğu garanti altına alır.

## Wallarm Docker İmajlarının Listesi

Aşağıda, [imzalı](verify-docker-image-signature.md) Wallarm Docker imajlarının listesi bulunmaktadır. Bu imajların herhangi bir etiketi için SBOM oluşturabilirsiniz.

<!-- * [wallarm/node](https://hub.docker.com/r/wallarm/node): Tüm Wallarm modüllerini içeren [NGINX tabanlı Docker imajı](../admin-en/installation-docker-en.md), Wallarm kurulumu için bağımsız bir ürün olarak hizmet verir
* [wallarm/envoy](https://hub.docker.com/r/wallarm/envoy): Tüm Wallarm modüllerini içeren [Envoy tabanlı Docker imajı](../admin-en/installation-guides/envoy/envoy-docker.md), Wallarm kurulumu için bağımsız bir ürün olarak hizmet verir -->
* [NGINX tabanlı Ingress Controller dağıtımı](../admin-en/installation-kubernetes-en.md) için Helm chart tarafından kullanılan Docker imajları:

    * [wallarm/ingress-nginx](https://hub.docker.com/r/wallarm/ingress-nginx)
    * [wallarm/ingress-controller](https://hub.docker.com/r/wallarm/ingress-controller)
    * [wallarm/ingress-controller-chroot](https://hub.docker.com/r/wallarm/ingress-controller-chroot)
    * [wallarm/ingress-collectd](https://hub.docker.com/r/wallarm/ingress-collectd)
    * [wallarm/ingress-tarantool](https://hub.docker.com/r/wallarm/ingress-tarantool)
    * [wallarm/ingress-ruby](https://hub.docker.com/r/wallarm/ingress-ruby)
    * [wallarm/ingress-python](https://hub.docker.com/r/wallarm/ingress-python)
* [Sidecar dağıtımı](../installation/kubernetes/sidecar-proxy/deployment.md) için Helm chart tarafından kullanılan Docker imajları:

    * [wallarm/sidecar](https://hub.docker.com/r/wallarm/sidecar)
    * [wallarm/sidecar-controller](https://hub.docker.com/r/wallarm/sidecar-controller)
    * [wallarm/ingress-collectd](https://hub.docker.com/r/wallarm/ingress-collectd)
    * [wallarm/ingress-tarantool](https://hub.docker.com/r/wallarm/ingress-tarantool)
    * [wallarm/ingress-ruby](https://hub.docker.com/r/wallarm/ingress-ruby)
    * [wallarm/ingress-python](https://hub.docker.com/r/wallarm/ingress-python)

## Gereksinimler

Wallarm Docker imajları için SBOM oluşturmak için, [syft](https://github.com/anchore/syft) CLI yardımcı programını kullanmanız gerekecektir.

SBOM oluşturma işlemine geçmeden önce, **syft**'ı yerel makinenizde veya CI / CD boru hattınızda [kurduğunuzdan](https://github.com/anchore/syft#installation) emin olun.

## SBOM Oluşturma Prosedürü

Docker imajı için bir SBOM oluşturmak için, aşağıdaki komutu kullanın ve belirtilen imaj etiketini istediğiniz bir etiketle değiştirin:

```bash
syft wallarm/ingress-controller:4.6.2-1
```

Varsayılan olarak, **syft** SBOM'u metin formatında döndürür. CycloneDX, SPDX gibi başka formatlarda da oluşturabilir ve çıktıyı bir dosyaya kaydedebilirsiniz, örneğin:

```bash
syft wallarm/ingress-controller:4.6.2-1 --output spdx-json >> syft_json_sbom.spdx
syft wallarm/ingress-controller:4.6.2-1 --output cyclonedx-json >> cyclonedx_json_sbom.cyclonedx
```

SBOM'u oluşturduktan sonra, zafiyet taraması, lisans uyumluluk kontrolleri, güvenlik denetimleri veya rapor oluşturma gibi çeşitli eylemler için CI / CD boru hattınızda kullanabilirsiniz.

Tüm bağımlılıkların gerçekten Wallarm'a ait olduğunu doğrulamak için, tüm imajın [imzasını kontrol](verify-docker-image-signature.md) edebilirsiniz. İmajlarımızı dijital olarak imzalayarak, imzalı imajın gerçekten bizim olduğunu garanti ederiz. Sonuç olarak, bu güvence, Wallarm'ın doğrulanmış imajı ile ilişkilendirilecek olan SBOM'a da genişler.