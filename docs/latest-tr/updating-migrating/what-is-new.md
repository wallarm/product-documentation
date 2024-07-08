# Wallarm node 4.8'de Neler Yeni

Yeni Wallarm node sürümü yayınlandı! Bu sürüm, **Olaylar** bölümünde engellenmiş kaynaklardan gelen engellenen isteklerin günlüğünü tutma özelliği sunar. Bu belgeden yayınlanan tüm değişiklikleri öğrenin.

## Engellenmiş kaynaklardan engellenen istatistiklerin toplanması

4.8 sürümünden itibaren, Wallarm NGINX tabanlı filtreleme düğümleri artık engelleme listesinde bulunduklarında engellenen istekler hakkında istatistikler topluyor ve saldırı gücünü değerlendirme yeteneğinizi artırıyor. Bu, engellenen istek istatistiklerine ve örneklerine erişimi içerir, fark edilmemiş aktiviteyi en aza indirmenize yardımcı olur. Bu verileri Wallarm Konsol UI'sının **Olaylar** bölümünde bulabilirsiniz.

Otomatik IP engellemeyi (ör. brute force tetikleyicisi yapılandırılmışsa) kullanırken, artık hem başlangıç tetikleme isteklerini hem de sonraki engellenen isteklerin örneklerini analiz edebilirsiniz. Kaynakları manuel olarak engelleme listesine eklediği için engellenen istekler için, yeni işlevsellik engellenen kaynak eylemlerine olan görünürlüğü artırır.

**Olaylar** bölümünde yeni [ara etiketler ve filtreler](../user-guides/search-and-filters/use-search.md#search-by-attack-type) tanıttık, yeni tanıttığımız verilere sorunsuzca erişebilmeniz için:

* `blocked_source` aramasını kullanarak, IP adreslerinin, alt ağların, ülkelerin, VPN'lerin ve daha fazlasının manuel engelleme listesine alınması nedeniyle engellenen istekleri tanımlayın.
* `multiple_payloads` aramasını kullanarak, **Sayısız kötü niyetli yük** tetikleyicisi tarafından engellenen istekleri belirleyin. Bu tetikleyici, birden çok yükleme içeren kötü niyetli istekleri kaynağından engelleme listesine eklemek üzere tasarlanmıştır, bu da çok saldırılı suçluların yaygın bir özelliğidir.
* Ayrıca, `api_abuse`, `brute`, `dirbust` ve `bola` arama etiketleri şimdi, kaynakları ilgili Wallarm tetikleyicileri tarafından otomatik olarak engelleme listesine eklenen istekleri kapsar.

Bu değişiklik, işlevi etkinleştirmek için varsayılan olarak `on` olarak ayarlanan ancak devre dışı bırakmak için `off` olarak değiştirilebilen yeni yapılandırma parametrelerini tanıtır:

* [`wallarm_acl_export_enable`](../admin-en/configure-parameters-en.md#wallarm_acl_export_enable) NGINX direktifi.
* NGINX Ingress denetleyicisi tablosu için [`controller.config.wallarm-acl-export-enable`](../admin-en/configure-kubernetes-en.md#global-controller-settings) değeri.
* Sidecar Controller çözümü için [`config.wallarm.aclExportEnable`](../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md#configwallarmaclexportenable) tablo değeri ve [`sidecar.wallarm.io/wallarm-acl-export-enable`](../installation/kubernetes/sidecar-proxy/pod-annotations.md) pod's annotation.

## Wallarm NGINX Ingress Controller için ARM64

Artık Wallarm NGINX Ingress Controller ile ARM64 işlemcileri destekliyoruz. ARM64, sunucu çözümlerine ivme kazandıkça, müşterilerimizin ihtiyaçlarını karşılamak için güncel kalıyoruz. Bu, hem x86 hem de ARM64 mimarilerini kapsayan API ortamları için geliştirilmiş güvenlik sağlar, esneklik ve koruma sağlar.

## Belirli URL'leri ve bot kontrolünden istekleri dışlamak

API Abuse Prevention modülü artık daha esnek. [**Set API Abuse Prevention mode** rule](../api-abuse-prevention/exceptions.md) kullanarak kötü niyetli bot eylemlerinin kontrol edilmemesi gereken belirli URL'leri ve istekleri seçebilirsiniz. Yanlış pozitifleri önlemek ve uygulamalarınızı test ederken bazı parçaların bot kontrolünü kapatmanız gereken zamanlar için yararlıdır. Örneğin, pazarlama için Klaviyo kullanıyorsanız, `Klaviyo/1.0` GET isteklerini kontrol etmemesi için kuralı ayarlayabilirsiniz, böylece gereksiz engellemeler olmaksızın sorunsuz çalışır.

## Resmi imza ile NGINX tabanlı Docker imaj doğrulaması

4.8 sürümünden itibaren, Wallarm artık [resmi NGINX tabanlı Docker imajını](https://hub.docker.com/r/wallarm/node) resmi genel anahtarıyla imzalıyor.

Bu, imajın doğruluğunu kolayca [doğrulayabileceğiniz](../integrations-devsecops/verify-docker-image-signature.md) anlamına gelir, bu da bozulmuş görüntülere ve tedarik zinciri saldırılarına karşı koruma sağlayarak güvenliği artırır.

## `wallarm_custom_ruleset_id` Prometheus ölçütü için güncellenmiş yapı

Prometheus ölçütü `wallarm_custom_ruleset_id`, yeni bir `format` özniteliği eklenerek geliştirildi. Bu yeni özellik, özel kural seti formatını temsil eder. Öte yandan, asıl değer hala özel kural seti oluşturma sürümü olmaya devam eder. İşte güncellenen `wallarm_custom_ruleset_id` değerinin bir örneği:

```
wallarm_custom_ruleset_id{format="51"} 386
```

[Wallarm düğüm ölçütlerini yapılandırma hakkında daha fazla bilgi](../admin-en/configure-statistics-service.md)

## Sidecar Controller tarafından API belirteçleri desteği

Artık, [Sidecar denetleyici dağıtımı](../installation/kubernetes/sidecar-proxy/deployment.md) sırasında, filtreleme düğümlerini oluşturmak ve çözüm dağıtımı sırasında bunları Buluta bağlamak için [API belirteçlerini](../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation) kullanabilirsiniz. API belirteçleriyle, belirteç yaşam sürenizi kontrol edebilir ve bir düğüm grup adı ayarlayarak UI'da düğüm organizasyonunu geliştirebilirsiniz.

Düğüm grup adları, **values.yaml**'da `config.wallarm.api.nodeGroup` parametresi kullanılarak ayarlanır, `defaultSidecarGroup` varsayılan ad olarak kullanılır. İsteğe bağlı olarak, uygulamaların podlarına dayalı düğüm grup adlarını `sidecar.wallarm.io/wallarm-node-group` notu kullanarak kontrol edebilirsiniz.

## 3.6 ve altı düğümü yükseltirken

3.6 sürümünden veya daha düşük bir sürümden yükseltme yaparken, tüm değişiklikleri [ayrı listeden](older-versions/what-is-new.md) öğrenin.

## Hangi Wallarm düğümleri yükseltilmesi önerilir?

* Wallarm sürümleriyle güncel kalmak ve [kurulu modül eskimesini](versioning-policy.md#version-support) önlemek için 4.4 ve 4.6 sürümündeki client ve çok kiracılı Wallarm düğümleri.
* [Desteklenmeyen](versioning-policy.md#version-list) sürümler (4.2 ve altı) olan client ve çok kiracılı Wallarm düğümleri. Wallarm düğümü 4.8'deki değişiklikler, düğüm yapılandırmasını basitleştirir ve trafik filtrasyonunu iyileştirir. Lütfen bazı 4.8 düğüm ayarlarının, eski sürümlerin düğümleriyle **uyumsuz** olduğunu unutmayın.

## Yükseltme süreci

1. [Modül yükseltme için tavsiyeleri](general-recommendations.md) gözden geçirin.
2. Wallarm düğüm dağıtım seçeneğinize göre yüklü modülleri yükseltme talimatlarını takip edin:

      * [Her şey dahil yükleyici](all-in-one.md)
      * [NGINX, NGINX Plus, NGINX Distributive için bireysel paketler](nginx-modules.md)
      * [NGINX veya Envoy modülleri için Docker konteyner](docker-container.md)
      * [Entegre Wallarm modülleri ile NGINX Ingress denetleyicisi](ingress-controller.md)
      * [Entegre Wallarm modülleri ile Kong Ingress denetleyicisi](kong-ingress-controller.md)
      * [Sidecar](sidecar-proxy.md)
      * [Bulut düğüm resmi](cloud-image.md)
      * [CDN düğüm](cdn-node.md)
      * [Çok kiracılı düğüm](multi-tenant.md)

----------

[Wallarm ürünlerinde ve bileşenlerinde diğer güncellemeler →](https://changelog.wallarm.com/)
