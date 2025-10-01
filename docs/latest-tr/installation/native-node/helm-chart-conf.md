[us-cloud-docs]:                      ../../about-wallarm/overview.md#cloud
[eu-cloud-docs]:                      ../../about-wallarm/overview.md#cloud

# Helm Chart ile Native Node'u Yapılandırma

Helm chart kullanarak self-hosted [Wallarm Native Node](../nginx-native-node-internals.md#native-node) dağıtırken, yapılandırma `values.yaml` dosyasında veya CLI üzerinden belirtilir. Bu belge, kullanılabilir yapılandırma parametrelerini açıklar.

Dağıtımdan sonra ayarları değiştirmek için, değiştirmek istediğiniz parametrelerle aşağıdaki komutu kullanın:

```
helm upgrade --set config.api.token=<VALUE> <WALLARM_RELEASE_NAME> wallarm/wallarm-node-native -n wallarm-node
```

## Temel ayarlar

Varsayılan `values.yaml` dosyasının, temelde değiştirmeniz gerekebilecek Wallarm'a özgü bölümü aşağıdaki gibidir:

```yaml
config:
  api:
    token: ""
    host: api.wallarm.com
    nodeGroup: "defaultNodeNextGroup"

  connector:
    certificate:
      enabled: true
      certManager:
        enabled: false
        # issuerRef:
        #   name: letsencrypt-prod
        #   kind: ClusterIssuer
      existingSecret:
        enabled: false
        # name: my-secret-name
      customSecret:
        enabled: false
        # ca: LS0...
        # crt: LS0...
        # key: LS0...
    
    allowed_hosts: []

    route_config: {}
      # wallarm_application: -1
      # wallarm_mode: monitoring
      # routes:
        # - route: "/api/v1"
        #   wallarm_application: 1
        # - route: "/extra_api"
        #   wallarm_application: 2
        # - route: "/testing"
        #   wallarm_mode: monitoring
        # - host: "example.com"
        #   route: /api
        #   wallarm_application: 3

    proxy_headers:
      # Kural 1: Şirket içi proxy'ler
      - trusted_networks:
          - 10.0.0.0/8
          - 192.168.0.0/16
        original_host:
          - X-Forwarded-Host
        real_ip:
          - X-Forwarded-For

      # Kural 2: Harici uç proxy'ler (örn., CDN, ters proxy)
      - trusted_networks:
          - 203.0.113.0/24
        original_host:
          - X-Real-Host
        real_ip:
          - X-Real-IP

    log:
      pretty: false
      level: info
      log_file: stdout
      access_log:
        enabled: true
        verbose: false

  aggregation:
    serviceAddress: "[::]:3313"

processing:
  service:
    type: LoadBalancer
    port: 5000
```

### config.api.token (gerekli)

Node'u Wallarm Cloud'a bağlamak için [API token](../../user-guides/settings/api-tokens.md).

API token oluşturmak için:

1. Wallarm Console → Settings → API tokens bölümüne [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens) üzerinde gidin.
1. Kullanım türü olarak Node deployment/Deployment olan bir API token oluşturun.

### config.api.host

Wallarm API uç noktası. Şunlardan biri olabilir:

* [US cloud][us-cloud-docs] için `us1.api.wallarm.com`
* [EU cloud][eu-cloud-docs] için `api.wallarm.com` (varsayılan)

### config.api.nodeGroup

Yeni dağıtılan node'ları eklemek istediğiniz filtreleme node'ları grubunun adını belirtir.

Varsayılan değer: `defaultNodeNextGroup`

### config.connector.mode

Wallarm node çalışma modu. Şunlar olabilir:

* MuleSoft [Mule](../connectors/mulesoft.md) veya [Flex](../connectors/mulesoft-flex.md) Gateway, [Akamai](../connectors/akamai-edgeworkers.md), [Cloudflare](../connectors/cloudflare.md), [Amazon CloudFront](../connectors/aws-lambda.md), [Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md), [Fastly](../connectors/fastly.md), [Kong API Gateway](../connectors/kong-api-gateway.md), [IBM DataPower](../connectors/ibm-api-connect.md) konektörleri için `connector-server` (varsayılan)
* Istio tarafından yönetilen API'ler için [gRPC tabanlı harici işleme filtresi](../connectors/istio.md) için `envoy-external-filter`

### config.connector.certificate.enabled (gerekli)

Güvenli iletişim için Wallarm Load Balancer'ın SSL/TLS sertifikası kullanıp kullanmayacağını kontrol eder.

İletişim için bu değer `true` olmalı ve güvenilen sertifika sağlanmış olmalıdır.

SSL/TLS iletişimini yönetmek için `certManager`, `existingSecret` veya `customSecret` yaklaşımlarından birini kullanabilirsiniz.

#### certManager

Kümenizde [`cert-manager`](https://cert-manager.io/) kullanıyorsanız ve SSL/TLS sertifikasını bununla üretmeyi tercih ediyorsanız, ilgili yapılandırmayı bu bölümde belirtin.

Örnek yapılandırma:

```yaml
config:
  connector:
    certificate:
      enabled: true
      certManager:
        enabled: true
        issuerRef:
          # cert-manager Issuer veya ClusterIssuer ad
          name: letsencrypt-prod
          # Issuer (namespace kapsamlı) mı yoksa ClusterIssuer (küme genelinde) mı
          kind: ClusterIssuer
```

#### existingSecret

Aynı namespace içindeki mevcut bir Kubernetes secret'ından SSL/TLS sertifikası çekmek için bu yapılandırma bloğunu kullanabilirsiniz.

Örnek yapılandırma:

```yaml
config:
  connector:
    certificate:
      enabled: true
      existingSecret:
        enabled: true
        # Sertifika ve özel anahtarı içeren Kubernetes secret'ın adı
        name: my-secret-name
```

#### customSecret

`customSecret` yapılandırması, Kubernetes secret'ları veya cert-manager gibi harici kaynaklara bağlı kalmadan sertifikayı doğrudan yapılandırma dosyasında tanımlamanıza olanak tanır.

Sertifika, özel anahtar ve isteğe bağlı olarak bir CA, base64 kodlu değerler olarak belirtilmelidir.

Örnek yapılandırma:

```yaml
config:
  connector:
    certificate:
      enabled: true
      customSecret:
        enabled: true
        ca: LS0...
        crt: LS0...
        key: LS0...
```

### config.connector.allowed_hosts

İzin verilen ana makine adlarının listesi.

Varsayılan değer: tüm host'lara izin verilir.

Bu parametre joker karakter eşlemesini destekler:

* `*` ayırıcı olmayan karakterlerin herhangi bir dizisini eşleştirir
* `?` tek bir ayırıcı olmayan karakteri eşleştirir
* `'[' [ '^' ] { character-range } ']'`

??? info "Joker eşleme sözdizimi ayrıntıları"
    ```
    // Desen sözdizimi:
    //
    //	pattern:
    //		{ term }
    //	term:
    //		'*'         ayırıcı olmayan karakterlerin herhangi bir dizisini eşleştirir
    //		'?'         tek bir ayırıcı olmayan karakteri eşleştirir
    //		'[' [ '^' ] { character-range } ']'
    //		            karakter sınıfı (boş olamaz)
    //		c           c karakterini eşleştirir (c != '*', '?', '\\', '[')
    //		'\\' c      c karakterini eşleştirir
    //
    //	character-range:
    //		c           c karakterini eşleştirir (c != '\\', '-', ']')
    //		'\\' c      c karakterini eşleştirir
    //		lo '-' hi   lo <= c <= hi için c karakterini eşleştirir
    //
    // Eşleşme, desenin adın tamamıyla eşleşmesini gerektirir, yalnızca bir alt diziyle değil.
    ```

Örneğin:

```yaml
config:
  connector:
    allowed_hosts:
      - w.com
      - "*.test.com"
```

### config.connector.route_config

Belirli rotalar için ayarları belirttiğiniz yapılandırma bölümü.

### config.connector.route_config.wallarm_application

[Wallarm uygulama ID'si](../../user-guides/settings/applications.md). Bu değer, belirli rotalar için geçersiz kılınabilir.

Varsayılan: `-1`.

### config.connector.route_config.wallarm_mode

Trafik [filtrasyon modu](../../admin-en/configure-wallarm-mode.md): `block`, `safe_blocking`, `monitoring` veya `off`. OOB modunda, trafik engelleme desteklenmez.

Bu değer, belirli rotalar için geçersiz kılınabilir.

!!! info "`off` değeri için sözdizimi"
    `off` değeri `"off"` olarak tırnak içine alınmalıdır.

Varsayılan: `monitoring`.

### config.connector.route_config.routes

Rota özel Wallarm yapılandırmasını ayarlar. Wallarm modu ve uygulama ID'lerini içerir. Örnek yapılandırma:

```yaml
config:
  connector:
    route_config:
      wallarm_application: 10
      wallarm_mode: monitoring
      routes:
        - host: example.com
          wallarm_application: 1
          routes:
            - route: /app2
              wallarm_application: 2
        - host: api.example.com
          route: /api
          wallarm_application: 100
        - route: /testing
          wallarm_mode: block
```

#### host

Rota host'unu belirtir. Bu parametre, [`config.connector.allowed_hosts`](#configconnectorallowed_hosts) parametresi ile aynı şekilde joker eşlemeyi destekler.

Örneğin:

```yaml
config:
  connector:
    route_config:
      wallarm_application: 10
      routes:
        - host: "*.host.com"
```

#### routes.route veya route

Belirli rotaları tanımlar. Rotalar, NGINX benzeri öneklerle yapılandırılabilir:

```yaml
- route: [ = | ~ | ~* | ^~ |   ]/location
        #  |   |   |    |    ^ ön ek (regex'lerden daha düşük öncelik)
        #  |   |   |    ^ ön ek (regex'lerden daha yüksek öncelik)
        #  |   |   ^re büyük/küçük harf duyarsız
        #  |   ^re büyük/küçük harf duyarlı
        #  ^tam eşleşme
```

Örneğin, yalnızca tam rotayı eşleştirmek için:

```yaml
- route: =/api/login
```

Rotaları düzenli ifadeyle eşleştirmek için:

```yaml
- route: ~/user/[0-9]+/login.*
```

#### wallarm_application

[Wallarm uygulama ID'sini](../../user-guides/settings/applications.md) ayarlar. Belirli uç noktalar için `route_config.wallarm_application` değerini geçersiz kılar.

#### wallarm_mode

Host'a özel trafik [filtrasyon modu](../../admin-en/configure-wallarm-mode.md): `block`, `safe_blocking`, `monitoring` veya `off`. OOB modunda, trafik engelleme desteklenmez.

!!! info "`off` değeri için sözdizimi"
    `off` değeri `"off"` olarak tırnak içine alınmalıdır.

Varsayılan: `monitoring`.

### config.connector.proxy_headers

Trafik proxy'ler veya yük dengeleyiciler üzerinden geçtiğinde Native Node'un orijinal istemci IP'sini ve host'unu nasıl çıkaracağını yapılandırır.

* `trusted_networks`: güvenilen proxy IP aralıkları (CIDR'ler). `X-Forwarded-For` gibi başlıklar yalnızca istek bu ağlardan geliyorsa güvenilir kabul edilir.

    Atlanırsa, tüm ağlar güvenilir kabul edilir (önerilmez).
* `original_host`: bir proxy tarafından değiştirilmişse orijinal `Host` değerini almak için kullanılacak başlıklar.
* `real_ip`: gerçek istemci IP adresini çıkarmak için kullanılacak başlıklar.

Farklı proxy türleri veya güven seviyeleri için birden fazla kural tanımlayabilirsiniz.

!!! info "Kural değerlendirme sırası"    
    İstek başına yalnızca ilk eşleşen kural uygulanır.

Native Node 0.17.1 ve sonrasında desteklenir.

Örnek:

```yaml
config:
  connector:
    proxy_headers:
      # Kural 1: Şirket içi proxy'ler
      - trusted_networks:
          - 10.0.0.0/8
          - 192.168.0.0/16
        original_host:
          - X-Forwarded-Host
        real_ip:
          - X-Forwarded-For

      # Kural 2: Harici uç proxy'ler (örn., CDN, ters proxy)
      - trusted_networks:
          - 203.0.113.0/24
        original_host:
          - X-Real-Host
        real_ip:
          - X-Real-IP
```

### config.connector.log

`config.connector.log.*` yapılandırma bölümü, Native Node Helm chart sürümü 0.10.0 ile kullanılabilir hale gelmiştir. Önceden, kayıtlar yalnızca `config.connector.log_level` parametresi ile yönetilirdi.

#### pretty

Hata ve erişim log formatını kontrol eder. İnsan tarafından okunabilir loglar için `true`, JSON loglar için `false` ayarlayın.

Varsayılan: `false`.

#### level

Log seviyesi, `debug`, `info`, `warn`, `error`, `fatal` olabilir.

Varsayılan: `info`.

#### log_file

Hata ve erişim log çıktısının hedefini belirtir. Seçenekler `stdout`, `stderr` veya bir log dosyasına giden yol.

Varsayılan: `stdout`.

#### access_log.enabled

Erişim loglarının toplanıp toplanmayacağını kontrol eder.

Varsayılan: `true`.

#### access_log.verbose

Erişim log çıktısında her istek hakkında ayrıntılı bilginin dahil edilip edilmeyeceğini kontrol eder.

Varsayılan: `false`.

### config.aggregation.serviceAddress

**wstore**'un gelen bağlantıları kabul ettiği adresi ve portu belirtir.

Sürüm 0.15.1'den itibaren desteklenir.

Varsayılan değer: `[::]:3313` - tüm IPv4 ve IPv6 arayüzlerinde 3313 portunu dinler. Bu, 0.15.1'den önceki sürümlerde de varsayılan davranıştı.

### processing.service.type

Wallarm servis türü. Şunlar olabilir:

* Trafiği yönlendirmeyi kolaylaştırmak için genel IP'ye sahip bir yük dengeleyici olarak servisi çalıştırmak üzere `LoadBalancer`.

    Bu, MuleSoft [Mule](../connectors/mulesoft.md) veya [Flex](../connectors/mulesoft-flex.md) Gateway, [Akamai](../connectors/akamai-edgeworkers.md), [Cloudflare](../connectors/cloudflare.md), [Amazon CloudFront](../connectors/aws-lambda.md), [Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md), [Fastly](../connectors/fastly.md), [IBM DataPower](../connectors/ibm-api-connect.md), [Istio](../connectors/istio.md) konektörleri için uygundur.
* Genel bir IP açığa çıkarmadan dahili trafik için `ClusterIP`.

    Bu, [Kong API Gateway](../connectors/kong-api-gateway.md) konektörleri için uygundur.

Varsayılan: `ClusterIP`.

### processing.service.port

Wallarm servis portu.

Varsayılan: `5000`.

## Gelişmiş ayarlar

Varsayılan `values.yaml` dosyasının, ek olarak değiştirmeniz gerekebilecek Wallarm'a özgü bölümü aşağıdaki gibidir:

```yaml
config:
  connector:
    http_inspector:
      workers: auto
      api_firewall_enabled: true
      wallarm_dir: /opt/wallarm/etc/wallarm

processing:
  metrics:
    enabled: true
    port: 9090

drop_on_overload: true
```

### config.connector.input_filters

Hangi gelen isteklerin Native Node tarafından **inceleneceğini** veya **atlanacağını** tanımlar. Bu, statik varlıklar veya sağlık kontrolleri gibi alakasız trafiği yok sayarak CPU kullanımını azaltır.

Varsayılan olarak, tüm istekler incelenir.

!!! warning "İnceleme dışı bırakılan istekler analiz edilmez veya Wallarm Cloud'a gönderilmez"
    Sonuç olarak, atlanan istekler metriklerde, API Discovery, API sessions, zafiyet tespiti vb. yer almaz. Wallarm özellikleri bunlara uygulanmaz.

Uyumluluk

* Native Node 0.16.1 ve üzeri

Filtreleme mantığı

Filtreleme mantığı 2 listeye dayanır:

* `inspect`: burada en az bir filtreyle eşleşen istekler incelenir.

    Atlanır veya boş bırakılırsa, `bypass` tarafından hariç tutulmadıkça tüm istekler incelenir.
* `bypass`: burada herhangi bir filtreyle eşleşen istekler, `inspect` ile eşleşseler bile asla incelenmez.

Filtre biçimi

Her filtre şu öğeleri içerebilen bir nesnedir:

* `path` veya `url`: istek yolunu eşleştirmek için regex (her ikisi de desteklenir ve eşdeğerdir).
* `headers`: başlık adlarını değerlerini eşleştirmek için regex kalıplarına eşleyen bir harita.

Tüm düzenli ifadeler [RE2 sözdizimini](https://github.com/google/re2/wiki/Syntax) izlemelidir.

Örnekler

=== "Token ile istekleri izinli kıl, statik içeriği atla"
    Bu yapılandırma yalnızca `Authorization` başlığında bir `Bearer` token içeren, sürümlenmiş API uç noktalarına (örn. `/api/v1/...`) yapılan istekleri inceler.
    
    Görüntüler, betikler, stiller gibi statik dosyalar ve tarayıcı tarafından başlatılan HTML sayfa yüklemeleri atlanır.

    ```yaml
    config:
      connector:
        input_filters:
          inspect:
          - path: "^/api/v[0-9]+/.*"
            headers:
              Authorization: "^Bearer .+"
          bypass:
          - path: ".*\\.(png|jpg|css|js|svg)$"
          - headers:
              accept: "text/html"
    ```
=== "Alan adına göre istekleri izinli kıl, sağlık kontrollerini atla"
    Bu yapılandırma yalnızca `Host: api.example.com` olan istekleri inceler, diğerlerinin tamamını atlar.
    
    `/healthz` uç noktasına yapılan istekler, incelenen host ile eşleşseler bile her zaman atlanır.

    ```yaml
    config:
      connector:
        input_filters:
          inspect:
          - headers:
              host: "^api\\.example\\.com$"
          bypass:
          - path: "^/healthz$"
    ```

### config.connector.http_inspector.workers

Wallarm worker sayısı.

Varsayılan: `auto`, yani worker sayısı CPU çekirdeği sayısıdır.

### config.connector.http_inspector.api_firewall_enabled

[API Specification Enforcement](../../api-specification-enforcement/overview.md)'ın etkin olup olmadığını kontrol eder. Lütfen bu özelliği etkinleştirmenin, Wallarm Console UI üzerinden gerekli abonelik ve yapılandırmanın yerine geçmediğini unutmayın.

Varsayılan: `true`.

### config.connector.http_inspector.wallarm_dir

Node yapılandırma dosyaları için dizin yolunu belirtir. Genellikle, bu parametreyi değiştirmeniz gerekmez. Yardıma ihtiyacınız olursa lütfen [Wallarm destek ekibi](mailto:support@wallarm.com) ile iletişime geçin.

Varsayılan: `/opt/wallarm/etc/wallarm`.

### processing.metrics.enabled

[Prometheus metriklerinin](../../admin-en/configure-statistics-service.md#usage) etkin olup olmadığını kontrol eder. Wallarm node bu olmadan düzgün çalışmadığından bu parametre `true` olarak ayarlanmalıdır.

Varsayılan: `true`.

### processing.metrics.port

Prometheus metriklerinin sunulacağı adresi ve portu ayarlar. Bu metriklere erişmek için `/metrics` uç noktasını kullanın.

Varsayılan: `:9000` (9000 portunda tüm ağ arayüzleri).

### drop_on_overload

İşleme yükü kapasiteyi aştığında Node'un gelen istekleri düşürüp düşürmeyeceğini kontrol eder.

Uyumluluk

* Native Node 0.16.1 ve üzeri
* [Envoy konektörü](../connectors/istio.md) için, davranış `failure_mode_allow` ayarına bağlıdır

    `drop_on_overload` yapılandırması uygulanmaz.

Etkinleştirildiğinde (`true`), Node verileri gerçek zamanlı işleyemezse, fazla girdiyi düşürür ve `503 (Service Unavailable)` ile yanıt verir. Bu, Node'un işlenmemiş istekleri dahili kuyruklarda biriktirmesini engeller; aksi takdirde ciddi performans düşüşlerine veya bellek yetersizliği hatalarına yol açabilir.

503 döndürmek, yukarı akış servislerinin, yük dengeleyicilerin veya istemcilerin aşırı yük koşullarını algılamasını ve gerekirse istekleri yeniden denemesini sağlar.

Engelleme [modunda](../../admin-en/configure-wallarm-mode.md), bu tür istekler engellenmez.

Varsayılan: `true`.