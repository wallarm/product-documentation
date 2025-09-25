# Sidecar Helm Chart’ının Wallarm’a Özgü Değerleri

Bu belge, [Wallarm Sidecar dağıtımı](deployment.md) veya [yükseltme][sidecar-upgrade-docs] sırasında değiştirebileceğiniz Wallarm’a özgü Helm chart değerlerini açıklar. Wallarm’a özgü ve diğer chart değerleri, Sidecar Helm chart’ının küresel yapılandırması içindir.

!!! info "Küresel ve pod bazlı ayarların öncelikleri"
    Pod bazlı annotation’lar [Helm chart değerlerine göre önceliklidir](customization.md#configuration-area).

Değiştirmeniz gerekebilecek [varsayılan `values.yaml`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml) dosyasının Wallarm’a özgü kısmı aşağıdaki gibidir:

```yaml
config:
  wallarm:
    api:
      token: ""
      host: api.wallarm.com
      port: 443
      useSSL: true
      caVerify: true
      nodeGroup: "defaultSidecarGroup"
      existingSecret:
        enabled: false
        secretKey: token
        secretName: wallarm-api-token
    apiFirewall:
      mode: "on"
      readBufferSize: 8192
      writeBufferSize: 8192
      maxRequestBodySize: 4194304
      disableKeepalive: false
      maxConnectionsPerIp: 0
      maxRequestsPerConnection: 0
      metrics:
        enabled: false
        endpointName: "metrics"
        host: ":9010"
    fallback: "on"
    mode: monitoring
    modeAllowOverride: "on"
    enableLibDetection: "on"
    parseResponse: "on"
    aclExportEnable: "on"
    parseWebsocket: "off"
    unpackResponse: "on"
    ...
  nginx:
    workerProcesses: auto
    workerConnections: 4096
    logs:
      extended: false
      format: text

postanalytics:
  external:
    enabled: false
    host: ""
    port: 3313
  wstore:
    config:
      arena: "2.0"
      serviceAddress: "[::]:3313"
    ### TLS yapılandırma ayarları (isteğe bağlı)
    tls:
      enabled: false
    #  certFile: "/root/test-tls-certs/server.crt"
    #  keyFile: "/root/test-tls-certs/server.key"
    #  caCertFile: "/root/test-tls-certs/ca.crt"
    #  mutualTLS:
    #    enabled: false
    #    clientCACertFile: "/root/test-tls-certs/ca.crt"
  ...
# Özel admission webhook sertifika sağlama için isteğe bağlı bölüm
# controller:
#  admissionWebhook:
#    certManager:
#      enabled: false
#    secret:
#      enabled: false
#      ca: <base64-encoded-CA-certificate>
#      crt: <base64-encoded-certificate>
#      key: <base64-encoded-private-key>
```

## config.wallarm.api.token

Bir filtreleme düğümü belirteci değeri. Wallarm API’sine erişim için gereklidir.

Belirteç aşağıdaki [türlerden][node-token-types] biri olabilir:

* **API token (önerilir)** - UI organizasyonu için düğüm gruplarını dinamik olarak ekleyip/çıkarmanız gerektiğinde veya ek güvenlik için belirteç yaşam döngüsünü kontrol etmek istediğinizde idealdir. API belirteci oluşturmak için:

    API belirteci oluşturmak için:
    
    1. Wallarm Console → **Settings** → **API tokens** bölümüne [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens) üzerinde gidin.
    1. **Node deployment/Deployment** kullanım türüyle bir API belirteci oluşturun.
    1. Düğüm dağıtımı sırasında oluşturulan belirteci kullanın ve `config.wallarm.api.nodeGroup` parametresi ile grup adını belirtin. Farklı API belirteçleri kullanarak bir gruba birden fazla düğüm ekleyebilirsiniz.
* **Düğüm belirteci** - Hangi düğüm gruplarının kullanılacağını zaten biliyorsanız uygundur.

    Düğüm belirteci oluşturmak için:
    
    1. Wallarm Console → **Nodes** bölümüne [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) üzerinde gidin.
    1. Bir düğüm oluşturun ve düğüm grubuna bir ad verin.
    1. Düğüm dağıtımı sırasında, bu gruba dahil etmek istediğiniz her düğüm için grubun belirtecini kullanın.

[`config.wallarm.api.existingSecret.enabled: true`](#configwallarmapiexistingsecret) ise bu parametre yok sayılır.

## config.wallarm.api.host

Wallarm API uç noktası. Şunlardan biri olabilir:

* [US cloud][us-cloud-docs] için `us1.api.wallarm.com`
* [EU cloud][eu-cloud-docs] için `api.wallarm.com` (varsayılan)

## config.wallarm.api.nodeGroup

Yeni dağıtılan düğümleri eklemek istediğiniz filtreleme düğümleri grubunun adını belirtir. Bu şekilde düğüm gruplama yalnızca, **Node deployment/Deployment** kullanım türüne sahip bir API belirteci kullanarak düğümleri oluşturup Cloud’a bağladığınızda kullanılabilir (değeri `config.wallarm.api.token` parametresinde iletilir).

**Varsayılan değer**: `defaultSidecarGroup`

[**Pod anotasyonu**](pod-annotations.md): `sidecar.wallarm.io/wallarm-node-group`.

## config.wallarm.api.existingSecret

Helm chart sürümü 4.4.4’ten itibaren, Wallarm düğüm belirteci değerini Kubernetes secret’larından çekmek için bu yapılandırma bloğunu kullanabilirsiniz. Ayrı bir secret yönetiminin olduğu ortamlar için faydalıdır (ör. harici bir secrets operator kullanıyorsanız).

Düğüm belirtecini K8s secret’larında saklamak ve Helm chart’a çekmek için:

1. Wallarm düğüm belirteci ile bir Kubernetes secret oluşturun:

    ```bash
    kubectl -n wallarm-sidecar create secret generic wallarm-api-token --from-literal=token=<WALLARM_NODE_TOKEN>
    ```

    * Dağıtım talimatlarını değişiklik yapmadan takip ettiyseniz, `wallarm-sidecar`, Wallarm Sidecar controller’ı ile Helm sürümü için oluşturulan Kubernetes namespace’idir. Farklı bir namespace kullanıyorsanız adı değiştirin.
    * `wallarm-api-token` Kubernetes secret adıdır.
    * `<WALLARM_NODE_TOKEN>`, Wallarm Console UI’dan kopyalanan Wallarm düğüm belirteci değeridir.

    Harici bir secrets operator kullanıyorsanız, bir secret oluşturmak için [uygun dokümantasyonu izleyin](https://external-secrets.io).
1. `values.yaml` içinde aşağıdaki yapılandırmayı ayarlayın:

    ```yaml
    config:
      wallarm:
        api:
          token: ""
          existingSecret:
            enabled: true
            secretKey: token
            secretName: wallarm-api-token
    ```

**Varsayılan değer**: Helm chart’ın Wallarm düğüm belirtecini `config.wallarm.api.token` üzerinden almasını sağlayan `existingSecret.enabled: false`.

## config.wallarm.apiFirewall

Sürüm 4.10’dan itibaren kullanılabilen [API Specification Enforcement][api-spec-enforcement-docs] yapılandırmasını kontrol eder. Varsayılan olarak etkindir ve aşağıda gösterildiği gibi yapılandırılmıştır. Bu özelliği kullanıyorsanız, bu değerleri değiştirmemeniz önerilir.

```yaml
config:
  wallarm:
    apiFirewall:
      mode: "on"
      readBufferSize: 8192
      writeBufferSize: 8192
      maxRequestBodySize: 4194304
      disableKeepalive: false
      maxConnectionsPerIp: 0
      maxRequestsPerConnection: 0
```

Düğüm 5.3.0’dan beri, aşağıdakiler sunulmaktadır (varsayılan değerler yukarıdaki örnekte gösterilmiştir):

| Ayar | Açıklama |
| ------- | ----------- |
| `readBufferSize` | İstek okumak için bağlantı başına tampon boyutu. Bu aynı zamanda maksimum header boyutunu sınırlar. İstemcileriniz çok KB’lık RequestURI ve/veya çok KB’lık header’lar (örneğin BÜYÜK çerezler) gönderiyorsa bu tamponu artırın. |
| `writeBufferSize` | Yanıt yazmak için bağlantı başına tampon boyutu. |
| `maxRequestBodySize` | Maksimum istek gövdesi boyutu. Bu sınırı aşan gövdeye sahip istekler sunucu tarafından reddedilir. |
| `disableKeepalive` | Keep-alive bağlantılarını devre dışı bırakır. Bu seçenek `true` ise sunucu, müşteriye ilk yanıtı gönderdikten sonra gelen tüm bağlantıları kapatır. |
| `maxConnectionsPerIp` | IP başına izin verilen eşzamanlı istemci bağlantılarının maksimum sayısı. `0` = `sınırsız`. |
| `maxRequestsPerConnection` | Bağlantı başına hizmet verilecek maksimum istek sayısı. Sunucu son istekten sonra bağlantıyı kapatır. Son yanıta `Connection: close` header’ı eklenir. `0` = `sınırsız`. |

## config.wallarm.apiFirewall.metrics

Sürüm 6.5.1’den itibaren, [API Specification Enforcement][api-spec-enforcement-docs] modülü Prometheus uyumlu metrikleri sunabilir.

Etkinleştirildiğinde, metrikler varsayılan olarak `http://<host>:9010/metrics` adresinde mevcuttur.

| Ayar | Açıklama |
| ------- | ----------- |
| `enabled` | API Specification Enforcement modülü için Prometheus metriklerini etkinleştirir.<br>Varsayılan: `false` (devre dışı). |
| `endpointName` | API Specification Enforcement metrik uç noktasının HTTP yolunu tanımlar.<br>Varsayılan: `metrics`. |
| `host` | API Specification Enforcement’ın metrikleri sunduğu host ve port’u tanımlar.<br>Varsayılan: `:9010` (tüm arayüzler, 9010 portu). |

```yaml
config:
  wallarm:
    apiFirewall:
      metrics:
        enabled: false
        endpointName: "metrics"
        host: ":9010"
```

## config.wallarm.fallback

Değeri `on` (varsayılan) olduğunda, NGINX servisleri acil durum moduna geçme kabiliyetine sahiptir. Wallarm Cloud kullanılamadığı için proton.db veya özel kural seti indirilemiyorsa, bu ayar Wallarm modülünü devre dışı bırakır ve NGINX’in çalışmaya devam etmesini sağlar.

[**Pod anotasyonu**](pod-annotations.md): `sidecar.wallarm.io/wallarm-fallback`.

## config.wallarm.mode

Küresel [trafik filtrleme modu][configure-wallarm-mode-docs]. Olası değerler:

* `monitoring` (varsayılan)
* `safe_blocking`
* `block`
* `off`

[**Pod anotasyonu**](pod-annotations.md): `sidecar.wallarm.io/wallarm-mode`.

## config.wallarm.modeAllowOverride

[`wallarm_mode` değerlerini Cloud’daki ayarlar üzerinden geçersiz kılma yeteneğini][filtration-mode-priorities-docs] yönetir. Olası değerler:

* `on` (varsayılan)
* `off`
* `strict`

[**Pod anotasyonu**](pod-annotations.md): `sidecar.wallarm.io/wallarm-mode-allow-override`.

## config.wallarm.enableLibDetection

[libdetection][libdetection-docs] kütüphanesini kullanarak SQL Injection saldırılarını ayrıca doğrulayıp doğrulamayacağını belirler. Olası değerler:

* `on` (varsayılan)
* `off`

[**Pod anotasyonu**](pod-annotations.md): `sidecar.wallarm.io/wallarm-enable-libdetection`.

## config.wallarm.parseResponse

Uygulama yanıtlarının saldırılar için analiz edilip edilmeyeceğini belirler. Olası değerler:

* `on` (varsayılan)
* `off`

Yanıt analizi, [pasif tespit][passive-detection-docs] ve [tehdit yeniden yürütme testleri][active-threat-verification-docs] sırasında güvenlik açığı tespiti için gereklidir.

[**Pod anotasyonu**](pod-annotations.md): `sidecar.wallarm.io/wallarm-parse-response`.

## config.wallarm.aclExportEnable

Düğümden Cloud’a [denylist’teki][denylist-docs] IP’lerden gelen isteklerle ilgili istatistiklerin gönderilmesini `on` etkinleştirir / `off` devre dışı bırakır.

* `config.wallarm.aclExportEnable: "on"` (varsayılan) ile denylist’teki IP’lerden gelen isteklerle ilgili istatistikler **Attacks** bölümünde [görüntülenecektir][denylist-view-events-docs].
* `config.wallarm.aclExportEnable: "off"` ile denylist’teki IP’lerden gelen isteklerle ilgili istatistikler görüntülenmeyecektir.

[**Pod anotasyonu**](pod-annotations.md): `sidecar.wallarm.io/wallarm-acl-export-enable`.

## config.wallarm.parseWebsocket

Wallarm, WebSocket’leri tam olarak destekler. Varsayılan olarak, WebSocket mesajları saldırılar için analiz edilmez. Özelliği zorlamak için, API Security [subscription plan]’ını[subscriptions-docs] etkinleştirin ve bu ayarı kullanın.

Olası değerler:

* `on`
* `off` (varsayılan)

[**Pod anotasyonu**](pod-annotations.md): `sidecar.wallarm.io/wallarm-parse-websocket`.

## config.wallarm.unpackResponse

Uygulama yanıtında döndürülen sıkıştırılmış verilerin açılıp açılmayacağı:

* `on` (varsayılan)
* `off`

[**Pod anotasyonu**](pod-annotations.md): `sidecar.wallarm.io/wallarm-unpack-response`.

## config.nginx.workerConnections

Bir NGINX worker süreci tarafından açılabilecek [eşzamanlı bağlantıların maksimum sayısı](http://nginx.org/en/docs/ngx_core_module.html#worker_connections).

**Varsayılan değer**: `4096`.

[**Pod anotasyonu**](pod-annotations.md): `sidecar.wallarm.io/nginx-worker-connections`.

## config.nginx.workerProcesses

[NGINX worker süreç sayısı](http://nginx.org/en/docs/ngx_core_module.html#worker_processes).

**Varsayılan değer**: `auto`, yani worker sayısı CPU çekirdek sayısına eşittir.

[**Pod anotasyonu**](pod-annotations.md): `sidecar.wallarm.io/nginx-worker-processes`.

## config.nginx.logs.extended

NGINX’te genişletilmiş loglamayı etkinleştirir. Genişletilmiş loglar istek süresi, upstream yanıt süresi, istek uzunluğu, bağlantı detayları vb. içerir.

5.3.0 sürümünden itibaren desteklenir.

**Varsayılan değer**: `false`.

## config.nginx.logs.format

`config.nginx.logs.extended` `true` olduğunda genişletilmiş logların formatını belirtir. `text` ve `json` formatlarını destekler.

5.3.0 sürümünden itibaren desteklenir.

**Varsayılan değer**: `text`.

## postanalytics.external.enabled

Harici bir host üzerine kurulu Wallarm postanalytics (wstore) modülünü mü yoksa Sidecar çözümü dağıtımı sırasında kurulanı mı kullanacağınızı belirler.

Bu özellik Helm sürümü 4.6.4’ten itibaren desteklenir.

Olası değerler:

* `false` (varsayılan): Sidecar çözümü tarafından dağıtılan postanalytics modülünü kullan.
* `true`: Etkinleştirilirse, lütfen `postanalytics.external.host` ve `postanalytics.external.port` değerlerinde postanalytics modülünün harici adresini belirtin.

  `true` olarak ayarlanırsa, Sidecar çözümü postanalytics modülünü çalıştırmaz, ancak ona belirtilen `postanalytics.external.host` ve `postanalytics.external.port` üzerinden ulaşılmasını bekler.

## postanalytics.external.host

Ayrı olarak kurulu postanalytics modülünün alan adı veya IP adresi. `postanalytics.external.enabled` `true` ise bu alan gereklidir.

Bu özellik Helm sürümü 4.6.4’ten itibaren desteklenir.

Örnek değerler: `wstore.domain.external` veya `10.10.0.100`.

Belirtilen host, Sidecar Helm chart’ının dağıtıldığı Kubernetes kümesinden erişilebilir olmalıdır.

## postanalytics.external.port

Wallarm postanalytics modülünün çalıştığı TCP portu. Varsayılan olarak 3313 portunu kullanır, çünkü Sidecar çözümü modülü bu portta dağıtır.

`postanalytics.external.enabled` `true` ise, modülün belirtilen harici host üzerinde çalıştığı portu belirtin.

## postanalytics.wstore.config.serviceAddress

**wstore**’un gelen bağlantıları kabul ettiği adres ve portu belirtir.

Sürüm 6.3.0’dan itibaren desteklenir.

**Varsayılan değer**: `[::]:3313` - tüm IPv4 ve IPv6 arayüzlerinde 3313 portunu dinler. Bu, 6.3.0 öncesi sürümlerdeki varsayılan davranışla da aynıdır.

## postanalytics.wstore.tls

Postanalytics modülüne güvenli bağlantı sağlamak için TLS ve karşılıklı TLS (mTLS) ayarlarını yapılandırır (isteğe bağlı):

```yaml
config:
  wstore:
    tls:
      enabled: false
    #   certFile: "/root/test-tls-certs/server.crt"
    #   keyFile: "/root/test-tls-certs/server.key"
    #   caCertFile: "/root/test-tls-certs/ca.crt"
    #   mutualTLS:
    #     enabled: false
    #     clientCACertFile: "/root/test-tls-certs/ca.crt"

```

Sürüm 6.2.0’dan itibaren desteklenir.

| Parametre | Açıklama | Gerekli mi? |
| --------- | ----------- | --------- |
| `enabled` | Postanalytics modülüne bağlantı için SSL/TLS’i etkinleştirir veya devre dışı bırakır. Varsayılan olarak `false` (devre dışı). | Evet |
| `certFile` | Filtreleme Düğümü’nün postanalytics modülüne SSL/TLS bağlantısı kurarken kendini doğrulamak için kullandığı istemci sertifikasının yolunu belirtir. | `mutualTLS.enabled` `true` ise Evet |
| `keyFile` | `certFile` ile sağlanan istemci sertifikasına karşılık gelen özel anahtarın yolunu belirtir. | `mutualTLS.enabled` `true` ise Evet |
| `caCertFile` | Postanalytics modülü tarafından sunulan TLS sertifikasını doğrulamak için kullanılan güvenilir Sertifika Yetkilisi (CA) sertifikasının yolunu belirtir. | Özel bir CA kullanılıyorsa Evet |
| `mutualTLS.enabled` | Hem Filtreleme Düğümü’nün hem de postanalytics modülünün birbirlerinin kimliğini sertifikalarla doğruladığı karşılıklı TLS’i (mTLS) etkinleştirir. Varsayılan olarak `false` (devre dışı). | Hayır |
| `mutualTLS.clientCACertFile` | Filtreleme Düğümü tarafından sunulan TLS sertifikasını doğrulamak için kullanılan güvenilir CA sertifikasının yolunu belirtir. | Özel bir CA kullanılıyorsa Evet |

## controller.admissionWebhook.certManager.enabled

Varsayılan [`certgen`](https://github.com/kubernetes/ingress-nginx/tree/main/images/kube-webhook-certgen) yerine admission webhook sertifikasını üretmek için [`cert-manager`](https://cert-manager.io/) kullanılıp kullanılmayacağını belirler. Sürüm 4.10.7’den itibaren desteklenir.

**Varsayılan değer**: `false`.

## controller.admissionWebhook.secret.enabled

Varsayılan [`certgen`](https://github.com/kubernetes/ingress-nginx/tree/main/images/kube-webhook-certgen) yerine admission webhook için sertifikaların manuel olarak yüklenip yüklenmeyeceğini belirler. Sürüm 4.10.7’den itibaren desteklenir.

**Varsayılan değer**: `false`.

`true` olarak ayarlanırsa, base64 ile kodlanmış CA sertifikasını, sunucu sertifikasını ve özel anahtarı belirtin, örneğin:

```yaml
controller:
  admissionWebhook:
    secret:
      enabled: true
      ca: <base64-encoded-CA-certificate>
      crt: <base64-encoded-certificate>
      key: <base64-encoded-private-key>
```