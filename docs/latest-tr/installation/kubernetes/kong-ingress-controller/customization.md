# Wallarm Hizmetleri ile Entegre Kong Ingress Controller'ın Özelleştirilmesi

Bu makale, [Kong Ingress Controller ile birlikte entegre Wallarm hizmetlerini][kong-ing-controller-customization-docs] güvenli ve etkili bir şekilde nasıl özelleştireceğinizi anlatır.

## Yapılandırma alanı

Entegre Wallarm hizmetlerine sahip Kong Ingress Controller, standart Kubernetes bileşenlerine dayanmaktadır, bu nedenle çözümün yapılandırması büyük ölçüde Kubernetes yığını yapılandırmasıyla benzerdir.

Çözümü aşağıdaki gibi yapılandırabilirsiniz:

* `values.yaml` aracılığıyla global olarak - genel hizmete alma yapılandırmasını, Kong API Gateway'ini ve bazı temel Wallarm ayarlarını belirlemenizi sağlar. Bu ayarlar, çözümün trafiği proxy olarak ilettiği tüm Ingress kaynaklarına uygulanır.
* Ingress annotations aracılığıyla - Wallarm ayarlarının her Ingress için ayrı ayrı ince ayarlanmasını sağlar.

    !!! uyarı "Annotation desteği"
        Ingress annotation yalnızca Açık Kaynaklı Kong Ingress controller'a dayalı çözüm tarafından desteklenir. [Desteklenen annotations listesi sınırlıdır](#fine-tuning-of-traffic-analysis-via-ingress-annotations-only-for-the-open-source-edition).
* Wallarm Console UI aracılığıyla - Wallarm ayarlarının ince ayarlanmasını sağlar.

## Kong API Gateway Yapılandırması

Kong Ingress Controller için Kong API Gateway yapılandırması, [varsayılan Helm chart değerleri](https://github.com/wallarm/kong-charts/blob/main/charts/kong/values.yaml) ile belirlenir. Bu yapılandırma, kullanıcının `helm install` veya `helm upgrade` sırasında sağladığı `values.yaml` dosyası ile değiştirilebilir.

Varsayılan Helm chart değerlerini özelleştirmek için, [Kong ve Ingress Controller yapılandırması hakkında resmi talimatları](https://github.com/Kong/charts/tree/main/charts/kong#configuration) öğrenin.

## Wallarm Katmanının Yapılandırması

Çözümün Wallarm katmanını aşağıdaki gibi yapılandırabilirsiniz:

* `values.yaml` üzerinden temel yapılandırmayı ayarlayın: Wallarm Cloud'a bağlantı, kaynak tahsisi, fallbacks.
* Açık Kaynaklı sürüm için Ingress bazında annotations aracılığıyla trafik analizini ince ayarlayın: trafik filtrasyon modu, uygulama yönetimi, çok kiracılı yapılandırma, vb.
* Wallarm Console UI aracılığıyla trafik analizini ince ayarlayın: trafik filtrasyon modu, güvenlik olayları hakkında bildirimler, talep kaynağı yönetimi, hassas verileri maskeleyin, belirli saldırı türlerine izin verin, vb.

### `values.yaml` ile Temel Yapılandırma

Varsayılan `values.yaml` dosyası aşağıdaki Wallarm yapılandırmasını sağlar:

```yaml
wallarm:
  image:
    tag: "<WALLARM_NODE_IMAGE_TAG>"
  enabled: true
  apiHost: api.wallarm.com
  apiPort: 443
  apiSSL: true
  token: ""
  fallback: "on"
  tarantool:
    kind: Deployment
    service:
      annotations: {}
    replicaCount: 1
    arena: "0.2"
    livenessProbe:
      failureThreshold: 3
      initialDelaySeconds: 10
      periodSeconds: 10
      successThreshold: 1
      timeoutSeconds: 1
    resources: {}
    podAnnotations:
      sidecar.istio.io/inject: false
  heartbeat:
    resources: {}
  wallarm-appstructure:
    resources: {}
  wallarm-antibot:
    resources: {}
  metrics:
    port: 18080
    enabled: false

    service:
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/path: /wallarm-metrics
        prometheus.io/port: "18080"

      # clusterIP: ""

      ## -- İstatistik dışa aktarıcı hizmetinin kullanılabilir olduğu IP adresleri listesi
      ## Ref: https://kubernetes.io/docs/user-guide/services/#external-ips
      ##
      externalIPs: []

      # loadBalancerIP: ""
      loadBalancerSourceRanges: []
      servicePort: 18080
      type: ClusterIP
      # externalTrafficPolicy: ""
      # nodePort: ""
  addnode:
    resources: {}
  cron:
    jobs:
      exportEnvironment:
        schedule: "0 */1 * * *"
        timeout: 10m
      exportAttacks:
        schedule: "* * * * *"
        timeout: 3h
      exportCounters:
        schedule: "* * * * *"
        timeout: 11m
      bruteDetect:
        schedule: "* * * * *"
        timeout: 6m
      syncIpLists:
        schedule: "* * * * *"
        timeout: 3h
      exportMetrics:
        schedule: "* * * * *"
        timeout: 3h
      syncIpListsSource:
        schedule: "*/5 * * * *"
        timeout: 3h
      syncMarkers:
        schedule: "* * * * *"
        timeout: 1h
    resources: {}
  exportenv:
    resources: {}
  synccloud:
    wallarm_syncnode_interval_sec: 120
    resources: {}
  collectd:
    resources: {}
```

Değiştirmeniz gerekebilecek ana parametreler şunlardır:

| Parametre | Açıklama | Varsayılan değer |
| --- | --- | --- |
| `wallarm.enabled` | Wallarm katmanını etkinleştirmenizi veya devre dışı bırakmanızı sağlar. | `true` |
| `wallarm.apiHost` | Wallarm API sunucusu:<ul><li>`us1.api.wallarm.com` US Cloud için</li><li>`api.wallarm.com` EU Cloud için</li></ul> | `api.wallarm.com` |
| `wallarm.token` | Wallarm düğüm tokeni. **Gerekli**. | Boş |
| `wallarm.fallback` | Wallarm hizmet başarısız olursa Kong API Gateway hizmetlerinin çalıştırılıp çalıştırılmayacağı. | `açık`
| `wallarm.tarantool.replicaCount` | Çözümün yerel veri analizi backend'i olan Wallarm postanalytics modülü için çalışan podların sayısı. | `1`
| `wallarm.tarantool.arena` | Wallarm postanalytics modülü için ayrılan bellek miktarını belirtir. Son 5-15 dakikalık talep verilerini saklamak için yeterli değeri ayarlamanız önerilir. | `0.2`
| `wallarm.metrics.enabled` | Bu düğme, bilgi ve metrik toplamayı etkinleştirir veya devre dışı bırakır. Eğer [Prometheus](https://github.com/helm/charts/tree/master/stable/prometheus) Kubernetes kümesine kurulmuşsa, ek bir yapılandırma gerekmez. | `false`

Diğer parametreler varsayılan değerlerle gelir ve nadiren değiştirilmesi gerekir.

### Ingress Annotations (Yalnızca Açık Kaynak Sürümü için) aracılığıyla traffic analysis incelikli ayarları

Aşağıda, entegre Wallarm hizmetleri ile Açık Kaynaklı Kong Ingress controller'ında desteklenen annotations listesi bulunmaktadır.

!!! bilgi "Global ve her Ingress'nin ayarlarına öncelikler"
    Her Ingress'nin annotations, Helm chart değerlerine öncelik verir.

| Annotation | Açıklama | 
|----------- |------------ |
| `wallarm.com/wallarm-mode` | [Trafik filtrasyon modu][wallarm-mode-docs]: `kapalı` (varsayılan), `izleme`, `güvenli_engelleme`, veya `block`. |
| `wallarm.com/wallarm-application` | [Wallarm uygulama ID][applications-docs]. Değer, `0` haricinde pozitif bir tamsayı olabilir. |
| `wallarm.com/wallarm-parse-response` | Uygulama yanıtlarının saldırılar için analiz edilip edilmeyeceği: `true` (varsayılan) veya `false`. Yanıt analizi, [pasif tespit][passive-vuln-detection-docs] ve [aktif tehdit doğrulama][active-threat-ver-docs] sırasında güvenlik açığı tespiti için gereklidir. |
| `wallarm.com/wallarm-parse-websocket` | Wallarm, tam WebSocket desteğine sahiptir. Varsayılan olarak, WebSocket'ların mesajları saldırılar için analiz edilmez. Özelliği zorlamak için, API Güvenliği [abonelik planını](subscription-doc) aktive edin ve bu annotation'ı kullanın: `true` veya `false` (varsayılan). |
| `wallarm.com/wallarm-unpack-response` | Uygulama yanıtında döndürülen sıkıştırılmış verilerin açılıp açılmayacağı: `true` (varsayılan) veya `false`. |
| `wallarm.com/wallarm-partner-client-uuid` | [Çok kiracılı][multitenancy-overview] Wallarm düğümü için kiracının benzersiz tanımlayıcısı. Değer, UUID formatında bir string olmalıdır, örneğin `123e4567-e89b-12d3-a456-426614174000`.<br><br>Şunları nasıl yapacağınızı öğrenin:<ul><li>[Kiracı oluşturma sırasında kiracının UUID'sini alın][get-tenant-via-api-docs]</li><li>[Mevcut kiracıların UUID'lerinin listesini alın][get-tenant-uuids-docs]</li></ul> |

### Wallarm Console UI aracılığıyla Trafik Analizinin İnce Ayarlanması

Wallarm Console UI, Wallarm katmanı tarafından gerçekleştirilen trafik analizinin ince ayarını yapmanızı sağlar:

* Trafik filtrasyon modunu yapılandırın
    
    [Çözüm dağıtıldıktan](deployment.md) sonra, tüm gelen istekleri **izleme** [modunda][available-filtration-modes] filtrelemeye başlar.

    Wallarm Console UI, modu değiştirmenizi sağlar:

    * [Tüm gelen istekler için genel olarak][general-settings-ui-docs]
    * Her Ingress için [kural](wallarm-mode-rule-docs) kullanarak

    !!! bilgi "Bir Ingress'nin ayarlarının önceliği ve Wallarm Console UI'da belirtilenlerin önceliği"
        Mod, Kong Açık Kaynak tabanlı çözüm için `wallarm-mode` annotation ve Wallarm Console UI aracılığıyla belirtilmişse, sonuncusu annotation üzerine öncelik kazanır.
* [Güvenlik olaylarına ilişkin bildirimler ayarlayın][integrations-docs]
* [İstek kaynaklarına göre API'lere erişimi yönetin][ip-lists-docs]
* [Trafik filtrasyon kurallarını özelleştirin][rules-docs]