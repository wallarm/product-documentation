# Sidecar Helm Chart'ın Wallarm'a Özgü Değerleri

Bu belge, [Wallarm Sidecar deployment](deployment.md) veya [upgrade][sidecar-upgrade-docs] sırasında değiştirebileceğiniz Wallarm'a özgü Helm chart değerlerini açıklamaktadır. Wallarm'a özgü ve diğer chart değerleri, Sidecar Helm chart'ın global yapılandırması içindir.

!!! info "Küresel ve pod bazlı ayarların öncelikleri"
    Pod bazlı anotasyonlar, Helm chart değerleri üzerinde [öncelik taşır](customization.md#configuration-area).

Değiştirmeniz gerekebilecek Wallarm'a özgü [varsayılan `values.yaml`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml) kısmı aşağıdaki gibidir:

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
  ...
# Optional part for custom admission webhook certificate provisioning
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

Bir filtreleme düğümü token değeridir. Wallarm API'ye erişim sağlamak için gereklidir.

Token, şu [türlerden](node-token-types) biri olabilir:

* **API token (recommended)** - UI organizasyonu için düğüm gruplarını dinamik olarak ekleyip/çıkarmanız ya da ek güvenlik için token yaşam döngüsünü kontrol etmeniz gerektiğinde idealdir. API token oluşturmak için:

    1. Wallarm Console → **Settings** → **API tokens** bölümüne gidin; [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens) üzerinden.
    1. **Deploy** source rolü ile bir API token oluşturun.
    1. Düğüm dağıtımı sırasında, oluşturulan token'ı kullanın ve `config.wallarm.api.nodeGroup` parametresi ile grup adını belirtin. Farklı API token'lar kullanarak birden fazla düğümü aynı gruba ekleyebilirsiniz.
* **Node token** - Kullanılacak düğüm gruplarını önceden biliyorsanız uygundur.

    Node token oluşturmak için:
    
    1. Wallarm Console → **Nodes** bölümüne gidin; [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) üzerinden.
    1. Bir düğüm oluşturun ve düğüm grubuna isim verin.
    1. Düğüm dağıtımı sırasında, o gruptaki her düğüm için grubun token'ını kullanın.

Parametre, [`config.wallarm.api.existingSecret.enabled: true`](#configwallarmapiexistingsecret) olarak ayarlanmışsa göz ardı edilir.

## config.wallarm.api.host

Wallarm API uç noktası. Aşağıdakilerden biri olabilir:

* [US Cloud][us-cloud-docs] için `us1.api.wallarm.com`
* [EU Cloud][eu-cloud-docs] için `api.wallarm.com` (varsayılan)

## config.wallarm.api.nodeGroup

Bu, yeni dağıtılan düğümleri eklemek istediğiniz filtreleme düğümleri grubunun adını belirtir. Bu şekilde düğüm gruplama, yalnızca **Deploy** rolüne sahip bir API token kullanarak Cloud'a düğüm oluşturup bağladığınızda kullanılabilir (değeri `config.wallarm.api.token` parametresine aktarılır).

**Varsayılan değer**: `defaultSidecarGroup`

[**Pod's annotation**](pod-annotations.md): `sidecar.wallarm.io/wallarm-node-group`.

## config.wallarm.api.existingSecret

Helm chart sürüm 4.4.4'ten itibaren, Kubernetes secret'larındaki bir Wallarm düğüm token değerini çekmek için bu yapılandırma bloğunu kullanabilirsiniz. Ayrı bir gizli yönetim sistemi olan ortamlarda (örneğin, bir external secrets operatörü kullanıyorsanız) faydalıdır.

Düğüm token'ını K8s secret içine kaydedip Helm chart'a çekmek için:

1. Wallarm düğüm token'ı içeren bir Kubernetes secret'ı oluşturun:

    ```bash
    kubectl -n wallarm-sidecar create secret generic wallarm-api-token --from-literal=token=<WALLARM_NODE_TOKEN>
    ```

    * Varsayılan dağıtım talimatlarını değiştirmeden izlediyseniz, `wallarm-sidecar` Helm release'i için oluşturulan Kubernetes ad alanıdır. Farklı bir ad alanı kullanıyorsanız adı değiştirin.
    * `wallarm-api-token` Kubernetes secret adıdır.
    * `<WALLARM_NODE_TOKEN>`, Wallarm Console UI'dan kopyalanan düğüm token değeridir.

    External secret operatörü kullanıyorsanız, secret oluşturmak için [uygun belgelere](https://external-secrets.io) bakın.
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

**Varsayılan değer**: `existingSecret.enabled: false` — bu, Helm chart'ın Wallarm düğüm token'ını `config.wallarm.api.token` üzerinden alacağını gösterir.

## config.wallarm.apiFirewall

[API Specification Enforcement][api-spec-enforcement-docs] yapılandırmasını kontrol eder; sürüm 4.10'dan itibaren kullanılabilir. Varsayılan olarak etkinleştirilmiştir ve aşağıdaki gibi yapılandırılmıştır. Bu özelliği kullanıyorsanız, bu değerleri değiştirmemeniz önerilir.

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

[sidecar-5.3.0-changelog] itibaren, aşağıdakiler sunulmaktadır (örnekteki varsayılan değerlere bakınız):

| Ayar                        | Açıklama |
| --------------------------- | ----------- |
| `readBufferSize` | İstek okuma için bağlantı başına tampon boyutu. Bu aynı zamanda maksimum header boyutunu sınırlar. İstemcileriniz multi-KB RequestURI ve/veya multi-KB header (örneğin, büyük çerezler) gönderiyorsa bu tamponu artırın. |
| `writeBufferSize` | Yanıt yazma için bağlantı başına tampon boyutu. |
| `maxRequestBodySize` | Maksimum istek gövde boyutu. Sunucu, bu limiti aşan gövdeli istekleri reddeder. |
| `disableKeepalive` | Keep-alive bağlantılarını devre dışı bırakır. Bu seçenek `true` olarak ayarlanırsa, sunucu istemciye ilk yanıtı gönderdikten sonra gelen tüm bağlantıları kapatır. |
| `maxConnectionsPerIp` | IP başına izin verilen eş zamanlı maksimum istemci bağlantısı sayısı. `0` = `sınırsız`. |
| `maxRequestsPerConnection` | Bağlantı başına sunulan maksimum istek sayısı. Son isteğin ardından sunucu bağlantıyı kapatır. Son yanıta `Connection: close` header'ı eklenir. `0` = `sınırsız`. |

## config.wallarm.fallback

Varsayılan olarak `on` değerine ayarlandığında, NGINX servislerinin acil durum moduna geçebilme yeteneği bulunur. Proton.db veya özel kural seti, Wallarm Cloud'dan indirilemediğinde, bu ayar Wallarm modülünü devre dışı bırakır ve NGINX'in çalışmaya devam etmesini sağlar.

[**Pod's annotation**](pod-annotations.md): `sidecar.wallarm.io/wallarm-fallback`.

## config.wallarm.mode

Küresel [trafik filtreleme modu][configure-wallarm-mode-docs]. Olası değerler:

* `monitoring` (varsayılan)
* `safe_blocking`
* `block`
* `off`

[**Pod's annotation**](pod-annotations.md): `sidecar.wallarm.io/wallarm-mode`.

## config.wallarm.modeAllowOverride

Cloud'daki ayarlar aracılığıyla `wallarm_mode` değerlerinin değiştirilmesine izin verilip verilmediğini yönetir [filtration-mode-priorities-docs]. Olası değerler:

* `on` (varsayılan)
* `off`
* `strict`

[**Pod's annotation**](pod-annotations.md): `sidecar.wallarm.io/wallarm-mode-allow-override`.

## config.wallarm.enableLibDetection

SQL enjeksiyon saldırılarını [libdetection][libdetection-docs] kütüphanesi ile ek olarak doğrulayıp doğrulamayacağını belirler. Olası değerler:

* `on` (varsayılan)
* `off`

[**Pod's annotation**](pod-annotations.md): `sidecar.wallarm.io/wallarm-enable-libdetection`.

## config.wallarm.parseResponse

Uygulama yanıtlarını saldırılar açısından analiz edip etmeyeceğini belirler. Olası değerler:

* `on` (varsayılan)
* `off`

Yanıt analizi, [passive detection][passive-detection-docs] ve [active threat verification][active-threat-verification-docs] sırasında zafiyet tespiti için gereklidir.

[**Pod's annotation**](pod-annotations.md): `sidecar.wallarm.io/wallarm-parse-response`.

## config.wallarm.aclExportEnable

Node'dan Cloud'a, [denylisted][denylist-docs] IP'lerden gelen isteklerle ilgili istatistiklerin gönderilmesini `on` ile etkin, `off` ile devre dışı bırakır.

* `config.wallarm.aclExportEnable: "on"` (varsayılan) ile denylisted IP'lerden gelen isteklerin istatistikleri, **Attacks** bölümünde [görüntülenecektir][denylist-view-events-docs].
* `config.wallarm.aclExportEnable: "off"` ile denylisted IP'lerden gelen isteklerin istatistikleri görüntülenmeyecektir.

[**Pod's annotation**](pod-annotations.md): `sidecar.wallarm.io/wallarm-acl-export-enable`.

## config.wallarm.parseWebsocket

Wallarm tam WebSocket desteğine sahiptir. Varsayılan olarak, WebSocket mesajları saldırılar için analiz edilmez. Özelliği zorunlu kılmak için, API Security [subscription plan][subscriptions-docs]'ını etkinleştirin ve bu ayarı kullanın.

Olası değerler:

* `on`
* `off` (varsayılan)

[**Pod's annotation**](pod-annotations.md): `sidecar.wallarm.io/wallarm-parse-websocket`.

## config.wallarm.unpackResponse

Uygulama yanıtında dönen sıkıştırılmış verilerin dekomprese edilip edilmeyeceğini belirler:

* `on` (varsayılan)
* `off`

[**Pod's annotation**](pod-annotations.md): `sidecar.wallarm.io/wallarm-unpack-response`.

## config.nginx.workerConnections

Bir NGINX worker süreci tarafından açılabilecek eş zamanlı [bağlantı sayısı](http://nginx.org/en/docs/ngx_core_module.html#worker_connections)'nın maksimum değeri.

**Varsayılan değer**: `4096`.

[**Pod's annotation**](pod-annotations.md): `sidecar.wallarm.io/nginx-worker-connections`.

## config.nginx.workerProcesses

[NGINX worker süreç sayısı](http://nginx.org/en/docs/ngx_core_module.html#worker_processes).

**Varsayılan değer**: `auto`, yani worker sayısı CPU çekirdek sayısına göre ayarlanır.

[**Pod's annotation**](pod-annotations.md): `sidecar.wallarm.io/nginx-worker-processes`.

## config.nginx.logs.extended

NGINX'de genişletilmiş loglamayı etkinleştirir. Genişletilmiş loglar; istek süresi, upstream yanıt süresi, istek boyutu, bağlantı detayları vb. bilgileri içerir.

5.3.0 sürümünden itibaren desteklenmektedir.

**Varsayılan değer**: `false`.

## config.nginx.logs.format

`config.nginx.logs.extended` `true` olarak ayarlandığında genişletilmiş logların formatını belirtir. `text` ve `json` formatlarını destekler.

5.3.0 sürümünden itibaren desteklenmektedir.

**Varsayılan değer**: `text`.

## postanalytics.external.enabled

Wallarm postanalytics (Tarantool) modülünün, Sidecar çözümü dağıtılırken kurulan yerine, ayrı bir host üzerine kurulup kurulmayacağını belirler.

Bu özellik, Helm sürüm 4.6.4'ten itibaren desteklenmektedir.

Olası değerler:

* `false` (varsayılan): Sidecar çözümü tarafından dağıtılan postanalytics modülü kullanılır.
* `true`: Etkinleştirilirse, lütfen `postanalytics.external.host` ve `postanalytics.external.port` değerlerinde postanalytics modülünün harici adresini sağlayın.

`true` olarak ayarlandığında, Sidecar çözümü postanalytics modülünü çalıştırmaz, ancak belirtilen `postanalytics.external.host` ve `postanalytics.external.port` üzerinden erişim bekler.

## postanalytics.external.host

Ayrı olarak kurulan postanalytics modülünün alan adı veya IP adresi. `postanalytics.external.enabled` değeri `true` olarak ayarlanırsa bu alan gereklidir.

Bu özellik, Helm sürüm 4.6.4'ten itibaren desteklenmektedir.

Örnek değerler: `tarantool.domain.external` veya `10.10.0.100`.

Belirtilen host, Sidecar Helm chart'ının dağıtıldığı Kubernetes kümesinden erişilebilir olmalıdır.

## postanalytics.external.port

Wallarm postanalytics modülünün çalıştığı TCP portudur. Varsayılan olarak, Sidecar çözümü modülü bu port üzerinden dağıttığından port 3313 kullanılır.

Eğer `postanalytics.external.enabled` değeri `true` olarak ayarlanırsa, modülün çalıştığı portu belirtin.

## controller.admissionWebhook.certManager.enabled

Admission webhook sertifikasını varsayılan [`certgen`](https://github.com/kubernetes/ingress-nginx/tree/main/images/kube-webhook-certgen) yerine oluşturmak için [`cert-manager`](https://cert-manager.io/) kullanılacağını belirler. Sürüm 4.10.7'den itibaren desteklenir.

**Varsayılan değer**: `false`.

## controller.admissionWebhook.secret.enabled

Admission webhook için sertifikaların manuel olarak yüklenip yüklenmeyeceğini, varsayılan [`certgen`](https://github.com/kubernetes/ingress-nginx/tree/main/images/kube-webhook-certgen) yerine belirler. Sürüm 4.10.7'den itibaren desteklenir.

**Varsayılan değer**: `false`.

`true` olarak ayarlanırsa, base64 ile kodlanmış CA sertifikası, sunucu sertifikası ve özel anahtar belirtilmelidir, örneğin:

```yaml
controller:
  admissionWebhook:
    secret:
      enabled: true
      ca: <base64-encoded-CA-certificate>
      crt: <base64-encoded-certificate>
      key: <base64-encoded-private-key>
```