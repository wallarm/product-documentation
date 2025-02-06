[us-cloud-docs]:                      ../../about-wallarm/overview.md#cloud
[eu-cloud-docs]:                      ../../about-wallarm/overview.md#cloud

# Helm Çizelgesi ile Native Node Yapılandırılması

Özel olarak barındırılan [Wallarm Native Node](../nginx-native-node-internals.md#native-node) Helm Chart kullanılarak dağıtılırken, yapılandırma `values.yaml` dosyasında veya CLI aracılığıyla belirtilir. Bu belge, mevcut yapılandırma parametrelerini özetlemektedir.

Dağıtımdan sonra ayarları değiştirmek için, değiştirmek istediğiniz parametrelerle birlikte aşağıdaki komutu kullanın:

```
helm upgrade --set config.api.token=<VALUE> <WALLARM_RELEASE_NAME> wallarm/wallarm-node-native -n wallarm-node
```

## Temel Ayarlar

Varsayılan `values.yaml` dosyasının, temel olarak değiştirmeniz gerekebilecek Wallarm’a özgü kısmı aşağıdaki gibidir:

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
    mode: monitoring

    route_config: {}
      # wallarm_application: -1
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

    log:
      pretty: false
      level: info
      log_file: stdout
      access_log:
        enabled: true
        verbose: false

processing:
  service:
    type: LoadBalancer
    port: 5000
```

### config.api.token (gerekli)

[Wallarm Cloud] ile bağlantı kurmak için bir [API token](../../user-guides/settings/api-tokens.md) gereklidir.

Bir API token oluşturmak için:

1. Wallarm Console → **Settings** → **API tokens** bölümüne gidin; [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens)'dan birini seçin.
1. **Deploy** kaynak rolü ile bir API token oluşturun.

### config.api.host

Wallarm API uç noktası. Şunlar olabilir:

* [US Cloud][us-cloud-docs] için `us1.api.wallarm.com`
* [EU Cloud][eu-cloud-docs] için `api.wallarm.com` (varsayılan)

### config.api.nodeGroup

Yeni dağıtılan düğümlerin ekleneceği filtreleme düğümleri grubunun adını belirtir.

**Varsayılan değer**: `defaultNodeNextGroup`

### config.connector.certificate.enabled (gerekli)

Wallarm Load Balancer'ın güvenli iletişim için SSL/TLS sertifikası kullanıp kullanmayacağını kontrol eder.

Bunun **`true` olarak ayarlanması** ve iletişim için **güvenilir bir sertifika** verilmiş olması gerekmektedir.

SSL/TLS iletişimini yönetmek için `certManager`, `existingSecret` veya `customSecret` yöntemlerinden birini kullanabilirsiniz.

#### certManager

Kümenizde [`cert-manager`](https://cert-manager.io/) kullanıyor ve SSL/TLS sertifikasını oluşturmak için onu tercih ediyorsanız, bu bölümde ilgili yapılandırmayı belirtin.

Örnek yapılandırma:

```yaml
config:
  connector:
    certificate:
      enabled: true
      certManager:
        enabled: true
        issuerRef:
          # cert-manager Issuer veya ClusterIssuer'ın adı
          name: letsencrypt-prod
          # Issuer (namespace çapında) veya ClusterIssuer (küme çapında) olup olmadığı
          kind: ClusterIssuer
```

#### existingSecret

Aynı namespace içindeki mevcut Kubernetes gizli anahtarından SSL/TLS sertifikasını çekmek için bu yapılandırma bloğunu kullanabilirsiniz.

Örnek yapılandırma:

```yaml
config:
  connector:
    certificate:
      enabled: true
      existingSecret:
        enabled: true
        # Sertifika ve özel anahtarı içeren Kubernetes gizli anahtarının adı
        name: my-secret-name
```

#### customSecret

`customSecret` yapılandırması, Kubernetes gizli anahtarlarına veya cert-manager'a bağlı kalmadan, sertifikayı doğrudan yapılandırma dosyası içinde tanımlamanıza olanak tanır.

Sertifika, özel anahtar ve isteğe bağlı olarak bir CA, base64 kodlanmış değerler olarak belirtilmelidir.

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

İzin verilen ana bilgisayar adlarının listesi.

**Varsayılan değer**: Tüm ana bilgisayar adlarına izin verilir.

Bu parametre joker karakter eşleştirmeyi destekler:

* `*` ayırıcı olmayan karakterlerden oluşan herhangi bir diziyi eşleştirir
* `?` ayırıcı olmayan herhangi tek karakteri eşleştirir
* `'[' [ '^' ] { character-range } ']'`

??? info "Joker karakter eşleştirme sözdizimi detayları"
    ```
    // Desen sözdizimi şöyledir:
    //
    //	pattern:
    //		{ term }
    //	term:
    //		'*'         ayırıcı olmayan karakterlerden oluşan herhangi diziyi eşleştirir
    //		'?'         ayırıcı olmayan herhangi tek karakteri eşleştirir
    //		'[' [ '^' ] { character-range } ']'
    //		            karakter sınıfı (boş olmamalıdır)
    //		c           karakter c ile eşleşir (c != '*', '?', '\\', '[')
    //		'\\' c      karakter c ile eşleşir
    //
    //	character-range:
    //		c           karakter c ile eşleşir (c != '\\', '-', ']')
    //		'\\' c      karakter c ile eşleşir
    //		lo '-' hi   lo <= c <= hi için karakter c ile eşleşir
    //
    // Eşleşme, deseni yalnızca bir alt dize değil, adın tamamına eşleşecek şekilde gerektirir.
    ```

Örneğin:

```yaml
config:
  connector:
    allowed_hosts:
      - w.com
      - "*.test.com"
```

### config.connector.mode

Genel trafik [filtreleme modu](../../admin-en/configure-wallarm-mode.md): `block`, `safe_blocking`, `monitoring` veya `off`. OOB modunda trafik engelleme desteklenmez.

Varsayılan: `monitoring`.

Bu mod, belirli yollar için [üstüne yazılabilir](#wallarm_mode).

### config.connector.route_config

Belirli yollar için ayarların belirtildiği yapılandırma bölümüdür.

### config.connector.route_config.wallarm_application

[Wallarm uygulama kimliği](../../user-guides/settings/applications.md). Bu değer, belirli yollar için geçersiz kılınabilir.

Varsayılan: `-1`.

### config.connector.route_config.routes

Belirli uç noktalar için Wallarm yapılandırmasını ayarlar. Wallarm modu ve uygulama kimlikleri içerir. Örnek yapılandırma:

```yaml
config:
  connector:
    route_config:
      wallarm_application: 10
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
          wallarm_mode: off
```

#### host

Yolun ana bilgisayarını belirtir. Bu parametre, [`config.connector.allowed_hosts`](#configconnectorallowed_hosts) parametresi ile aynı joker eşleştirmeyi destekler.

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

Belirli yolları tanımlar. Yollar NGINX benzeri öneklerle yapılandırılabilir:

```yaml
- route: [ = | ~ | ~* | ^~ |   ]/location
        #  |   |   |    |    ^ önek (regex'lerden daha düşük öncelikli)
        #  |   |   |    ^ önek (regex'lerden daha yüksek öncelikli)
        #  |   |   ^regex, büyük/küçük harf duyarsız
        #  |   ^regex, büyük/küçük harf duyarlı
        #  ^tam eşleşme
```

Örneğin, yalnızca tam eşleşme için:

```yaml
- route: =/api/login
```

Düzenli ifadelerle yolları eşleştirmek için:

```yaml
- route: ~/user/[0-9]+/login.*
```

#### wallarm_application

Belirli uç noktalar için `route_config.wallarm_application` değerinin üzerine yazan [Wallarm uygulama kimliğini](../../user-guides/settings/applications.md) ayarlar.

#### wallarm_mode

Ana bilgisayara özgü trafik [filtreleme modu](../../admin-en/configure-wallarm-mode.md): `block`, `safe_blocking`, `monitoring` veya `off`. OOB modunda trafik engelleme desteklenmez.

Varsayılan: `monitoring`.

### config.connector.log

`config.connector.log.*` yapılandırma bölümü, Native Node Helm Chart sürüm 0.10.0'dan itibaren kullanılabilir. Önceki sürümlerde loglama yalnızca `config.connector.log_level` parametresiyle yönetiliyordu.

#### pretty

Hata ve erişim loglarının formatını kontrol eder. İnsan tarafından okunabilir loglar için `true`, JSON loglar için `false` olarak ayarlayın.

Varsayılan: `false`.

#### level

Log seviyesi; `debug`, `info`, `warn`, `error`, `fatal` seçeneklerinden biri olabilir.

Varsayılan: `info`.

#### log_file

Hata ve erişim loglarının çıktısının yönlendirileceği hedefi belirtir. Seçenekler `stdout`, `stderr` veya bir log dosyası yoludur.

Varsayılan: `stdout`.

#### access_log.enabled

Erişim loglarının toplanıp toplanmayacağını kontrol eder.

Varsayılan: `true`.

#### access_log.verbose

Erişim log çıktısında her istek hakkında ayrıntılı bilgilerin yer alıp almayacağını kontrol eder.

Varsayılan: `false`.

### processing.service.type

Wallarm hizmet türü. Şunlar olabilir:

* Hizmeti genel IP ile bir yük dengeleyici olarak çalıştırmak için `LoadBalancer`.

    Bu seçenek, [MuleSoft](../connectors/mulesoft.md), [Cloudflare](../connectors/cloudflare.md), [Amazon CloudFront](../connectors/aws-lambda.md), [Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md) ve [Fastly](../connectors/fastly.md) konektörleri için uygundur.
* Genel IP açığa çıkarmaksızın, dahili trafik için `ClusterIP`.

    Bu seçenek, [Kong API Gateway](../connectors/kong-api-gateway.md) veya [Istio](../connectors/istio.md) konektörleri için uygundur.

Varsayılan: `ClusterIP`.

### processing.service.port

Wallarm hizmet portu.

Varsayılan: `5000`.

## Gelişmiş Ayarlar

Ek olarak değiştirmeniz gerekebilecek, varsayılan `values.yaml` dosyasının Wallarm’a özgü kısmı aşağıdaki gibidir:

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
```

### config.connector.http_inspector.workers

Wallarm işçi sayısını belirtir.

Varsayılan: `auto`, yani işçi sayısı CPU çekirdek sayısına göre ayarlanır.

### config.connector.http_inspector.api_firewall_enabled

[API Specification Enforcement](../../api-specification-enforcement/overview.md) etkinleştirilip etkinleştirilmeyeceğini kontrol eder. Bu özelliğin etkinleştirilmesi, Wallarm Console UI üzerinden gerekli abonelik ve yapılandırmanın yerine geçmez.

Varsayılan: `true`.

### config.connector.http_inspector.wallarm_dir

Düğüm yapılandırma dosyalarının bulunacağı dizin yolunu belirtir. Genellikle bu parametreyi değiştirmeniz gerekmez. Yardıma ihtiyaç duyarsanız, lütfen [Wallarm destek ekibi](mailto:support@wallarm.com) ile iletişime geçin.

Varsayılan: `/opt/wallarm/etc/wallarm`.

### processing.metrics.enabled

[Prometheus metriklerinin](../../admin-en/configure-statistics-service.md#usage) etkin olup olmadığını kontrol eder. Wallarm düğümünün düzgün çalışması için bu parametre `true` olarak ayarlanmalıdır.

Varsayılan: `true`.

### processing.metrics.port

Prometheus metriklerinin hangi adres ve port üzerinden sunulacağını ayarlar. Bu metriklere erişmek için `/metrics` uç noktasını kullanın.

Varsayılan: `:9000` (9000 portunda tüm ağ arayüzleri).
