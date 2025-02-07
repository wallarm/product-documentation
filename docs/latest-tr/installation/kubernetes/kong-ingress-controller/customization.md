# Entegre Wallarm Servisleri ile Kong Ingress Controller Özelleştirme

Bu makale, [Kong Ingress Controller’ın entegre Wallarm servisleri ile][kong-ing-controller-customization-docs] güvenli ve etkili bir şekilde özelleştirilmesi konusunda sizi bilgilendirir.

## Yapılandırma Alanı

Entegre Wallarm servislerine sahip Kong Ingress Controller, standart Kubernetes bileşenlerine dayanmaktadır, bu nedenle çözüm yapılandırması büyük ölçüde Kubernetes yığını yapılandırmasına benzemektedir.

Çözümü aşağıdaki şekilde yapılandırabilirsiniz:

* Genel olarak `values.yaml` aracılığıyla – bu, genel dağıtım yapılandırmasını, Kong API Gateway’i ve bazı temel Wallarm ayarlarını yapmanızı sağlar. Bu ayarlar, çözümün trafiği proxylediği tüm Ingress kaynaklarına uygulanır.
* Ingress anotation’ları aracılığıyla – bu, Wallarm ayarlarını her Ingress için detaylı olarak ayarlamanıza olanak tanır.

    !!! warning "Anotasyon desteği"
        Ingress anotasyonu, yalnızca Open-Source Kong Ingress controller tabanlı çözüm tarafından desteklenir. [Desteklenen anotasyonların listesi sınırlıdır](#fine-tuning-of-traffic-analysis-via-ingress-annotations-only-for-the-open-source-edition).
* Wallarm Console UI aracılığıyla – bu, Wallarm ayarlarını ince ayarla yapılandırmanıza olanak tanır.

## Kong API Gateway Yapılandırması

Kong API Gateway için Kong Ingress Controller yapılandırması, [varsayılan Helm chart değerleri](https://github.com/wallarm/kong-charts/blob/main/charts/kong/values.yaml) ile belirlenir. Bu yapılandırma, kullanıcı tarafından `helm install` veya `helm upgrade` sırasında sağlanan `values.yaml` dosyası ile değiştirilebilir.

Varsayılan Helm chart değerlerini özelleştirmek için, [Kong ve Ingress Controller yapılandırmasıyla ilgili resmi talimatları](https://github.com/Kong/charts/tree/main/charts/kong#configuration) öğrenin.

## Wallarm Katmanı Yapılandırması

Çözümün Wallarm katmanını aşağıdaki şekilde yapılandırabilirsiniz:

* Temel yapılandırmayı `values.yaml` üzerinden gerçekleştirin: Wallarm Cloud bağlantısı, kaynak tahsisi, geri dönüşler.
* Open-Source sürüm için yalnızca Ingress anotasyonlarını kullanarak Ingress bazında trafik analizini detaylandırın: trafik filtreleme modu, uygulama yönetimi, çoklu kiracılık yapılandırması vb.
* Wallarm Console UI aracılığıyla trafik analizini detaylandırın: trafik filtreleme modu, güvenlik olaylarıyla ilgili bildirimler, istek kaynak yönetimi, hassas verilerin maskeleme, belirli saldırı türlerine izin verme vb.

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

      ## -- İstatistik ihracatçısı servisine erişilebilen IP adreslerinin listesi
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

| Parametre | Açıklama | Varsayılan Değer |
| --- | --- | --- |
| `wallarm.enabled` | Wallarm katmanını etkinleştirmenize veya devre dışı bırakmanıza izin verir. | `true` |
| `wallarm.apiHost` | Wallarm API sunucusu:<ul><li>ABD Cloud için `us1.api.wallarm.com`</li><li>EU Cloud için `api.wallarm.com`</li></ul> | `api.wallarm.com` |
| `wallarm.token` | Wallarm node token'ı. **Gerekli**. | Boş |
| `wallarm.fallback` | Wallarm servisi başlatılamazsa Kong API Gateway servislerinin çalışıp çalışmayacağını belirler. | `on` |
| `wallarm.tarantool.replicaCount` | Çözüm için yerel veri analiz arka ucu olan Wallarm postanalytics modülü için çalışan pod sayısı. | `1` |
| `wallarm.tarantool.arena` | Wallarm postanalytics modülü için tahsis edilen bellek miktarını belirtir. Son 5-15 dakikalık istek verilerini depolamak için yeterli bir değer belirlemeniz önerilir. | `0.2` |
| `wallarm.metrics.enabled` | Bu anahtar, bilgi ve metrik toplama işlemlerini açıp kapatır. Kubernetes kümesinde [Prometheus](https://github.com/helm/charts/tree/master/stable/prometheus) yüklüyse, ek yapılandırmaya gerek yoktur. | `false` |

Diğer parametreler varsayılan değerlerle gelir ve nadiren değiştirilmesi gerekir.

### Ingress Anotasyonları ile Trafik Analizinin Detaylandırılması (sadece Open-Source sürümü için)

Aşağıda, entegre Wallarm servisleriyle birlikte gelen Open-Source Kong Ingress controller tarafından desteklenen anotasyonların listesi verilmiştir.

!!! info "Genel ve Ingress bazlı ayarların öncelikleri"
    Ingress'e özgü anotasyonlar, Helm chart değerleri üzerinde önceliklidir.

| Anotasyon | Açıklama | 
|----------- |------------ |
| `wallarm.com/wallarm-mode` | [Trafik filtreleme modu][wallarm-mode-docs]: `off` (varsayılan), `monitoring`, `safe_blocking` veya `block`. |
| `wallarm.com/wallarm-application` | [Wallarm uygulama ID’si][applications-docs]. Değer, `0` dışındaki pozitif bir tamsayı olabilir. |
| `wallarm.com/wallarm-parse-response` | Uygulama yanıtlarını saldırılar için analiz edip etmeyeceğini belirtir: `true` (varsayılan) veya `false`. Yanıt analizi, [pasif tespit][passive-vuln-detection-docs] ve [aktif tehdit testi][active-threat-ver-docs] sırasında zafiyet tespiti için gereklidir. |
| `wallarm.com/wallarm-parse-websocket` | Wallarm tam WebSockets desteğine sahiptir. Varsayılan olarak, WebSocket mesajları saldırılar için analiz edilmez. Özelliği zorlamak için, API Security [abonelik planını][subscription-docs] etkinleştirin ve bu anotasyonu kullanın: `true` veya `false` (varsayılan). |
| `wallarm.com/wallarm-unpack-response` | Uygulama yanıtında dönen sıkıştırılmış verilerin dekompres edilip edilmeyeceğini belirtir: `true` (varsayılan) veya `false`. |
| `wallarm.com/wallarm-partner-client-uuid` | [Çoklu kiracılık][multitenancy-overview] Wallarm node için kiracının benzersiz tanımlayıcısıdır. Değer, UUID formatında bir dize olmalıdır, örneğin `123e4567-e89b-12d3-a456-426614174000`.<br><br>Nasıl yapıldığını öğrenin:<ul><li>[Kiracı oluşturma sırasında UUID’yi alın][get-tenant-via-api-docs]</li><li>[Mevcut kiracıların UUID listesini alın][get-tenant-uuids-docs]</li></ul> |

### Wallarm Console UI ile Trafik Analizinin Detaylandırılması

Wallarm Console UI, Wallarm katmanı tarafından gerçekleştirilen trafik analizini aşağıdaki şekilde detaylandırmanıza olanak tanır:

* Trafik filtreleme modunu yapılandırın
    
    [Çözüm dağıtıldığında](deployment.md), gelen tüm istekler **monitoring** [modunda][available-filtration-modes] filtrelenmeye başlanır.

    Wallarm Console UI, modu değiştirme imkanı sunar:

    * [Tüm gelen istekler için genel olarak][general-settings-ui-docs]
    * [Ingress başına, kural kullanılarak][wallarm-mode-rule-docs]

    !!! info "Ingress bazlı ayarların ve Wallarm Console UI'de belirtilen ayarların öncelikleri"
        Kong Open-Source tabanlı çözüm için mod, hem `wallarm-mode` anotasyonu hem de Wallarm Console UI üzerinden belirtildiyse, sonuncusu anotasyonun önüne geçer.
* [Güvenlik olaylarıyla ilgili bildirimleri][integrations-docs] yapılandırın
* [İstek kaynaklarına göre API erişimini yönetin][ip-lists-docs]
* [Trafik filtreleme kurallarını özelleştirin][rules-docs]