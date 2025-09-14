# All-in-One Yükleyici, Docker Image veya AWS AMI ile Native Node'u Yapılandırma

Self-hosted [Wallarm Native Node](../nginx-native-node-internals.md#native-node)'u all-in-one yükleyici, Docker image veya AWS AMI kullanarak dağıtırken, bir `.yaml` yapılandırma dosyası oluşturursunuz. Bu dosyada düğüm yapılandırmasını belirleyebilirsiniz; bunun için tüm parametreler bu belgede açıklanmıştır.

Düğüm all-in-one yükleyici veya AWS AMI ile çalışır durumdayken ayarları değiştirmek için:

1. `/opt/wallarm/etc/wallarm/go-node.yaml` dosyasını güncelleyin. İlk yapılandırma dosyası kurulum sırasında bu yola kopyalanır.
1. Değişiklikleri uygulamak için Wallarm servisiniz yeniden başlatın:

    ```
    sudo systemctl restart wallarm
    ```

Düğüm bir Docker image kullanılarak dağıtıldıysa, yapılandırma dosyasını ana makinede güncellemeniz ve güncellenmiş dosya ile Docker konteynerini yeniden başlatmanız önerilir.

## mode (gerekli)

Wallarm düğümünün çalışma modu. Şunlardan biri olabilir:

* `connector-server` MuleSoft [Mule](../connectors/mulesoft.md) veya [Flex](../connectors/mulesoft-flex.md) Gateway, [Akamai](../connectors/akamai-edgeworkers.md), [Cloudflare](../connectors/cloudflare.md), [Amazon CloudFront](../connectors/aws-lambda.md), [Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md), [Fastly](../connectors/fastly.md), [IBM DataPower](../connectors/ibm-api-connect.md) bağlayıcıları için.
* `tcp-capture` [TCP trafik yansıtma analizi](../oob/tcp-traffic-mirror/deployment.md) için.
* `envoy-external-filter` Istio tarafından yönetilen API'ler için [gRPC tabanlı harici işleme filtresi](../connectors/istio.md) için.

=== "connector-server"
    Wallarm bağlayıcısı için Native Node kurduysanız, temel yapılandırma şu şekildedir:

    ```yaml
    version: 4

    mode: connector-server

    connector:
      address: ":5050"
      tls_cert: path/to/tls-cert.crt
      tls_key: path/to/tls-key.key
      blocking: true
      allowed_networks:
        - 0.0.0.0/0
      allowed_hosts:
        - w.com
        - "*.test.com"
      mesh:
        discovery: dns
        name: native-node-mesh-discovery
        port: 9093
      url_normalize: true
      external_health_check:
        enabled: true
        endpoint: /wallarm-external-health
      # per_connection_limits:
        # max_requests: 300
        # max_received_bytes: 640_000
        # max_duration: 1m

    proxy_headers:
      # Kural 1: Kurum içi proxy'ler
      - trusted_networks:
          - 10.0.0.0/8
          - 192.168.0.0/16
        original_host:
          - X-Forwarded-Host
        real_ip:
          - X-Forwarded-For

      # Kural 2: Harici edge proxy'ler (örn. CDN, ters proxy)
      - trusted_networks:
          - 203.0.113.0/24
        original_host:
          - X-Real-Host
        real_ip:
          - X-Real-IP
    
    route_config:
      wallarm_application: 10
      wallarm_mode: monitoring
      routes:
        - route: /example/api/v1
          wallarm_mode: off
        - route: /example/extra_api
          wallarm_application: 2
        - route: /example/testing
          wallarm_mode: off

    log:
      pretty: true
      level: debug
      log_file: stderr
      access_log:
        enabled: true
        verbose: true
        log_file: stderr
    ```
=== "tcp-capture"
    Native Node'u TCP trafik yansıtma analizi için kurduysanız, temel yapılandırma şu şekildedir:

    ```yaml
    version: 4

    mode: tcp-capture

    goreplay:
      filter: <your network interface and port, e.g. 'lo:' or 'enp7s0:'>
      extra_args:
        - -input-raw-engine
        - vxlan
      path: /opt/wallarm/usr/bin/gor
      parse_responses: true
      response_timeout: 5s
      url_normalize: true

    proxy_headers:
      # Kural 1: Kurum içi proxy'ler
      - trusted_networks:
          - 10.0.0.0/8
          - 192.168.0.0/16
        original_host:
          - X-Forwarded-Host
        real_ip:
          - X-Forwarded-For

      # Kural 2: Harici edge proxy'ler (örn. CDN, ters proxy)
      - trusted_networks:
          - 203.0.113.0/24
        original_host:
          - X-Real-Host
        real_ip:
          - X-Real-IP
      
    route_config:
      wallarm_application: 10
      wallarm_mode: monitoring
      routes:
        - route: /example/api/v1
          wallarm_mode: off
        - route: /example/extra_api
          wallarm_application: 2
        - route: /example/testing
          wallarm_mode: off

    log:
      pretty: true
      level: debug
      log_file: stderr
      access_log:
        enabled: true
        verbose: true
        log_file: stderr
    ```
=== "envoy-external-filter"
    Native Node'u bir Envoy harici filtresi olarak kurduysanız, temel yapılandırma şu şekildedir:

    ```yaml
    version: 4

    mode: envoy-external-filter

    envoy_external_filter:
      address: ":5050"
      tls_cert: path/to/tls-cert.crt
      tls_key: path/to/tls-key.key

    proxy_headers:
      # Kural 1: Kurum içi proxy'ler
      - trusted_networks:
          - 10.0.0.0/8
          - 192.168.0.0/16
        original_host:
          - X-Forwarded-Host
        real_ip:
          - X-Forwarded-For

      # Kural 2: Harici edge proxy'ler (örn. CDN, ters proxy)
      - trusted_networks:
          - 203.0.113.0/24
        original_host:
          - X-Real-Host
        real_ip:
          - X-Real-IP

    route_config:
      wallarm_application: 10
      wallarm_mode: monitoring
      routes:
        - route: /example/api/v1
          wallarm_mode: off
        - route: /example/extra_api
          wallarm_application: 2
        - route: /example/testing
          wallarm_mode: off

    log:
      pretty: true
      level: debug
      log_file: stderr
      access_log:
        enabled: true
        verbose: true
        log_file: stderr
    ```

## Bağlayıcıya özgü ayarlar

### connector.address (gerekli)

Dinlenecek IP adresini ve iki nokta (`:`) ile ayrılmış portu belirtir.

Portun `80`, `8080`, `9000` veya `3313` olmamasını sağlayın; bunlar diğer Wallarm süreçleri tarafından kullanılır.

=== "IP adresi:Port"
    ```yaml
    version: 4

    connector:
      address: '192.158.1.38:5050'
    ```
=== "Tüm IP'lerde belirli port"
    ```yaml
    version: 4

    connector:
      address: ':5050'
    ```

### connector.tls_cert (gerekli)

Düğümün çalıştığı alan adı için verilmiş TLS/SSL sertifikasının (genellikle `.crt` veya `.pem` dosyası) yolu.

Güvenli iletişimi sağlamak için sertifika güvenilir bir Sertifika Yetkilisi (CA) tarafından verilmiş olmalıdır.

Düğüm bir Docker image ile dağıtılmışsa, trafik düğümün konteynerine ulaşmadan önce yük dengeleyici seviyesinde SSL şifre çözme yapılması gerektiğinden bu parametreye gerek yoktur.

### connector.tls_key (gerekli)

TLS/SSL sertifikasına karşılık gelen özel anahtarın (genellikle bir `.key` dosyası) yolu.

Düğüm bir Docker image ile dağıtılmışsa, trafik düğümün konteynerine ulaşmadan önce yük dengeleyici seviyesinde SSL şifre çözme yapılması gerektiğinden bu parametreye gerek yoktur.

### connector.blocking

Genellikle, bu parametreyi değiştirmenize gerek yoktur. Kötü amaçlı istekler için belirli engelleme davranışı, [`wallarm_mode`](#route_configwallarm_mode) parametresiyle kontrol edilir.

Bu parametre, Native Node'un gelen istekleri engelleme genel yeteneğini etkinleştirir; örneğin kötü amaçlı istekler, kara listeye alınmış IP'lerden gelenler veya engellemeyi gerektiren diğer koşullar.

Varsayılan: `true`.

### connector.allowed_networks

Bağlanmasına izin verilen IP ağlarının listesi.

Varsayılan: `0.0.0.0/0` (tüm IP ağlarına izin verilir).

### connector.allowed_hosts

İzin verilen ana bilgisayar adlarının listesi.

Varsayılan: tüm ana bilgisayar adlarına izin verilir.

Bu parametre joker eşleştirmeyi destekler:

* `*` herhangi bir ayırıcı olmayan karakter dizisini eşleştirir
* `?` herhangi bir ayırıcı olmayan tek karakteri eşleştirir
* `'[' [ '^' ] { character-range } ']'`

??? info "Joker eşleştirme sözdizimi ayrıntıları"
    ```
    // Desen sözdizimi:
    //
    //	pattern:
    //		{ term }
    //	term:
    //		'*'         herhangi bir ayırıcı olmayan karakter dizisini eşleştirir
    //		'?'         herhangi bir ayırıcı olmayan tek karakteri eşleştirir
    //		'[' [ '^' ] { character-range } ']'
    //		            karakter sınıfı (boş olmamalıdır)
    //		c           c karakterini eşleştirir (c != '*', '?', '\\', '[')
    //		'\\' c      c karakterini eşleştirir
    //
    //	character-range:
    //		c           c karakterini eşleştirir (c != '\\', '-', ']')
    //		'\\' c      c karakterini eşleştirir
    //		lo '-' hi   lo <= c <= hi için c karakterini eşleştirir
    //
    // Eşleşme, sadece bir alt dizeyle değil, adın tamamıyla eşleşmeyi gerektirir.
    ```

Örneğin:

```yaml
version: 4

connector:
  allowed_hosts:
    - w.com
    - "*.test.com"
```

### connector.mesh

`connector-server` modunda, birden çok düğüm kopyası dağıtıldığında Wallarm düğümleri arasında tutarlı trafik işleme sağlamak için mesh özelliği kullanılır. İstekleri ve bunlara karşılık gelen yanıtları, başlangıçta farklı kopyalar tarafından işlenmiş olsalar bile aynı düğüme yönlendirir. Bu, otomatik ölçeklendirme veya ECS'de birden fazla kopya gibi yatay ölçeklendirme durumlarında kritiktir.

!!! info "Kubernetes ortamları"
    Kubernetes'te [yerel Wallarm düğümü dağıtımı için Helm chart'ı](helm-chart.md) kullanın. Otomatik ölçeklendirme veya birden fazla kopya algılandığında mesh otomatik olarak yapılandırılır; ek kurulum gerekmez.

ECS'de mesh'i yapılandırmak için:

1. Düğümlerin mesh içinde birbirlerini dinamik olarak bulup iletişim kurmasını sağlamak için servis keşfini (örn. [AWS Cloud Map](https://docs.aws.amazon.com/cloud-map/latest/dg/what-is-cloud-map.html), [Google Cloud DNS](https://cloud.google.com/dns/) veya benzeri hizmetler) kurun.

    Servis keşfi olmadan mesh düzgün çalışmayacaktır; düğümler birbirlerini bulamayacak ve trafik yönlendirme sorunlarına yol açacaktır.
1. Aşağıda gösterildiği gibi yapılandırma dosyasında `connector.mesh` parametrelerini belirterek Wallarm düğümünü mesh kullanacak şekilde yapılandırın:

```yaml
version: 4

connector:
  mesh:
    discovery: dns
    name: native-node-mesh-discovery
    port: 9093
```

#### discovery

Düğümlerin mesh içinde birbirlerini nasıl keşfedeceğini tanımlar. Şu anda sadece `dns` değeri desteklenir.

Düğümler birbirlerini DNS kullanarak keşfeder. DNS kaydı, mesh'e katılan tüm düğümlerin IP adreslerine çözülmelidir.

#### name

Düğümlerin mesh içindeki diğer düğümlerin IP adreslerini çözmek için kullandığı DNS alan adı. Genellikle ECS servisindeki tüm düğüm örneklerine çözümlenecek bir değere ayarlanır.

#### port

Mesh içindeki düğümler arası iletişim için kullanılan dahili portu belirtir. Bu port dışa açık değildir ve ECS kümesi içindeki düğümden düğüme trafik için ayrılmıştır.

### connector.url_normalize

Rota yapılandırmalarını seçmeden önce ve libproton ile verileri analiz etmeden önce URL normalizasyonunu etkinleştirir.

Varsayılan: `true`.

### connector.external_health_check

Wallarm Node'un erişilebilirliğini doğrulamak için harici sistemlere olanak tanıyan ek bir harici sağlık denetimi uç noktasını yapılandırır.

Uç nokta, Node ile aynı porttan (`connector.address` parametresi) servis edilir ve Node çalışıyorsa HTTP 200 OK ile yanıt verir.

Desteklenen sürümler:

* Native Node 0.13.3 ve üzeri 0.13.x sürümleri
* Native Node 0.14.1 ve üzeri
* Henüz AWS AMI'de desteklenmiyor

```yaml
version: 4

connector:
  external_health_check:
    enabled: true
    endpoint: /wallarm-external-health
```

#### enabled

Harici sağlık denetimi uç noktasını açar veya kapatır. `true` ise, uç nokta belirtilen yolda, Node ile aynı porttan erişilebilir hale gelir.

Varsayılan: `false`.

#### endpoint

Harici sağlık denetimi uç noktasının erişilebilir olacağı URL yolunu tanımlar. `/` ile başlamalıdır.

### connector.per_connection_limits

`keep-alive` bağlantıları için sınırları tanımlar. Belirtilen sınırlardan herhangi biri aşıldığında, Node istemciye `Connection: Close` HTTP başlığını gönderir; bu, istemcinin mevcut TCP oturumunu kapatıp sonraki istekler için yeni bir oturum kurmasını sağlar.

Bu mekanizma, 4. katman yük dengelemede, müşterilerin ölçek artışından sonra tek bir Node örneğine bağlı kalmasını önlemeye yardımcı olur.

Varsayılan olarak sınır uygulanmaz; bu, çoğu kullanım senaryosu için önerilen yapılandırmadır.

Native Node 0.13.4 ve sonraki 0.13.x sürümlerinde ve 0.15.1 ve sonrasında desteklenir.

```yaml
version: 4

connector:
  per_connection_limits:
    max_requests: 300
    max_received_bytes: 640_000
    max_duration: 1m
```

#### max_requests

Tek bir bağlantının kapatılmadan önce işleyebileceği en fazla istek sayısı.

#### max_received_bytes

Bir bağlantı üzerinden alınabilecek en fazla bayt sayısı.

#### max_duration

Bir bağlantının azami ömrü (örn. 1 dakika için `1m`).

## TCP yansıtma (mirror) özel ayarları

### goreplay.filter

Trafiğin yakalanacağı ağ arayüzünü belirtir. Bir değer belirtilmezse, instance üzerindeki tüm ağ arayüzlerinden trafik yakalanır.

Değer, ağ arayüzü ve iki nokta (`:`) ile ayrılmış port olmalıdır, örn.:

=== "Arayüz:Port"
    ```yaml
    version: 4

    goreplay:
      filter: 'eth0:80'
    ```

    Birden fazla arayüz ve porttan trafik yakalamak için, `goreplay.filter` ile birlikte `goreplay.extra_args` kullanın, örn.:

    ```yaml
    version: 4

    goreplay:
      filter: 'eth0:80'
      extra_args:
        - "-input-raw"
        - "eth0:8080"
        - "-input-raw"
        - "eth0:8081"
        - "-input-raw"
        - "eth1:80"
    ```

    `filter`, GoReplay'i `-input-raw` argümanı ile ayarlar; `extra_args` ise ek `-input-raw` girdilerinin belirtilmesini sağlar.
=== "Arayüzdeki tüm portlar"
    ```yaml
    version: 4

    goreplay:
      filter: 'eth0:'
    ```
=== "Tüm arayüzlerde belirli port"
    ```yaml
    version: 4

    goreplay:
      filter: ':80'
    ```
=== "Tüm arayüzler ve portlar"
    ```yaml
    version: 4

    goreplay:
      filter: ':'
    ```

Ana makinede mevcut ağ arayüzlerini kontrol etmek için:

```
ip addr show
```

### goreplay.extra_args

GoReplay'e geçirilecek [ek argümanları](https://github.com/buger/goreplay/blob/master/docs/Request-filtering.md) belirtmenizi sağlar.

* Genellikle, analiz gerektiren yansıtılmış trafik türlerini (örneğin VLAN, VXLAN) tanımlamak için kullanırsınız. Örneğin:

    === "VLAN ile kapsüllenmiş yansıtılmış trafik"
        ```yaml
        version: 4

        goreplay:
          extra_args:
            - -input-raw-vlan
            - -input-raw-vlan-vid
            # VLAN'ınızın VID'i, örn.:
            # - 42
        ```
    === "VXLAN ile kapsüllenmiş yansıtılmış trafik (AWS'de yaygın)"
        ```yaml
        version: 4

        goreplay:
          extra_args:
            - -input-raw-engine
            - vxlan
            # Özel VXLAN UDP portu, örn.:
            # - -input-raw-vxlan-port 
            # - 4789
            # Belirli VNI (varsayılan olarak tüm VNI'ler yakalanır), örn.:
            # - -input-raw-vxlan-vni
            # - 1
        ```

    Yansıtılan trafik VLAN veya VXLAN gibi ek protokollerle kapsüllenmemişse, `extra_args` yapılandırmasını atlayabilirsiniz. Kapsüllenmemiş trafik varsayılan olarak ayrıştırılır.
* Ek arayüz ve portları yakalamak için `filter`'ı `extra_args` ile genişletebilirsiniz:

    ```yaml
    version: 4

    goreplay:
      filter: 'eth0:80'
      extra_args:
        - "-input-raw"
        - "eth0:8080"
        - "-input-raw"
        - "eth0:8081"
        - "-input-raw"
        - "eth1:80"
    ```

    `filter`, GoReplay'i `-input-raw` argümanı ile ayarlar; `extra_args` ise ek `-input-raw` girdilerinin belirtilmesini sağlar.

### goreplay.path

GoReplay ikili dosyasının yolu. Genellikle, bu parametreyi değiştirmenize gerek yoktur.

Varsayılan: `/opt/wallarm/usr/bin/gor`.

### goreplay.parse_responses

Yansıtılan yanıtlarda ayrıştırma yapılıp yapılmayacağını kontrol eder. Bu, [zafiyet tespiti](../../about-wallarm/detecting-vulnerabilities.md) ve [API keşfi](../../api-discovery/overview.md) gibi yanıt verisine dayanan Wallarm özelliklerini etkinleştirir.

Varsayılan olarak `true`.

Yanıt yansıtmanın Wallarm düğümünün bulunduğu hedef instance'a yapılandırıldığından emin olun.

Node sürümü 0.10.1 ve öncesinde, bu parametre `middleware.parse_responses` olarak ayarlanır.

### goreplay.response_timeout

Bir yanıt için beklenecek azami süreyi belirtir. Bu süre içinde bir yanıt alınmazsa, Wallarm süreçleri ilgili yanıtı beklemeyi durdurur.

Varsayılan: `5s`.

Node sürümü 0.10.1 ve öncesinde, bu parametre `middleware.response_timeout` olarak ayarlanır.

### goreplay.url_normalize

Rota yapılandırmalarını seçmeden önce ve libproton ile verileri analiz etmeden önce URL normalizasyonunu etkinleştirir.

Varsayılan: `true`.

Node sürümü 0.10.1 ve öncesinde, bu parametre `middleware.url_normalize` olarak ayarlanır.

## Envoy harici filtreye özgü ayarlar

### envoy_external_filter.address (gerekli)

Dinlenecek IP adresini ve iki nokta (`:`) ile ayrılmış portu belirtir.

Portun `80`, `8080`, `9000` veya `3313` olmamasını sağlayın; bunlar diğer Wallarm süreçleri tarafından kullanılır.

=== "IP adresi:Port"
    ```yaml
    version: 4

    envoy_external_filter:
      address: '192.158.1.38:5080'
    ```
=== "Tüm IP'lerde belirli port"
    ```yaml
    version: 4

    envoy_external_filter:
      address: ':5080'
    ```

### envoy_external_filter.tls_cert (gerekli)

Düğümün çalıştığı alan adı için verilmiş TLS/SSL sertifikasının (genellikle `.crt` veya `.pem` dosyası) yolu.

Güvenli iletişimi sağlamak için sertifika güvenilir bir Sertifika Yetkilisi (CA) tarafından verilmiş olmalıdır.

Düğüm bir Docker image ile dağıtılmışsa, trafik düğümün konteynerine ulaşmadan önce yük dengeleyici seviyesinde SSL şifre çözme yapılması gerektiğinden bu parametreye gerek yoktur.

### envoy_external_filter.tls_key (gerekli)

TLS/SSL sertifikasına karşılık gelen özel anahtarın (genellikle bir `.key` dosyası) yolu.

Düğüm bir Docker image ile dağıtılmışsa, trafik düğümün konteynerine ulaşmadan önce yük dengeleyici seviyesinde SSL şifre çözme yapılması gerektiğinden bu parametreye gerek yoktur.

## Temel ayarlar

### proxy_headers

Trafiğin proxy’ler veya yük dengeleyicilerden geçmesi durumunda, Native Node'un orijinal istemci IP'sini ve host bilgisini nasıl çıkaracağını yapılandırır.

* `trusted_networks`: güvenilir proxy IP aralıkları (CIDR'ler). `X-Forwarded-For` gibi başlıklara yalnızca istek bu ağlardan geliyorsa güvenilirlik atfedilir.

    Atlanırsa, tüm ağlar güvenilir kabul edilir (önerilmez).
* `original_host`: bir proxy tarafından değiştirilmişse, orijinal `Host` değerini almak için kullanılacak başlıklar.
* `real_ip`: gerçek istemci IP adresini çıkarmak için kullanılacak başlıklar.

Farklı proxy türleri veya güven seviyeleri için birden fazla kural tanımlayabilirsiniz.

!!! info "Kuralların değerlendirme sırası"    
    İstek başına yalnızca eşleşen ilk kural uygulanır.

Native Node 0.13.5 ve sonraki 0.13.x sürümlerinde ve 0.15.1 ve sonrasında desteklenir.

Örnek:

```yaml
version: 4

proxy_headers:

  # Kural 1: Kurum içi proxy'ler
  - trusted_networks:
      - 10.0.0.0/8
      - 192.168.0.0/16
    original_host:
      - X-Forwarded-Host
    real_ip:
      - X-Forwarded-For

  # Kural 2: Harici edge proxy'ler (örn. CDN, ters proxy)
  - trusted_networks:
      - 203.0.113.0/24
    original_host:
      - X-Real-Host
    real_ip:
      - X-Real-IP
```

[`tcp-capture`](../oob/tcp-traffic-mirror/deployment.md) modunda çalışan 0.14.1 ve önceki Node sürümleri için `http_inspector.real_ip_header` parametresini kullanın. Daha sonraki sürümlerde, `proxy_headers` bölümü bunun yerini alır.

### route_config

Belirli rotalar için ayarları belirteceğiniz yapılandırma bölümü.

### route_config.wallarm_application

[Wallarm uygulama kimliği](../../user-guides/settings/applications.md). Bu değer, belirli rotalar için geçersiz kılınabilir.

Varsayılan: `-1`.

### route_config.wallarm_mode

Genel trafik [filtreleme modu](../../admin-en/configure-wallarm-mode.md): `block`, `safe_blocking`, `monitoring` veya `off`. OOB modunda trafik engelleme desteklenmez.

Mod, [belirli rotalar için geçersiz kılınabilir](#wallarm_mode).

Varsayılan: `monitoring`.

### route_config.routes

Rota bazlı Wallarm yapılandırmasını ayarlar. Wallarm modu ve uygulama kimliklerini içerir. Örnek yapılandırma:

=== "connector-server"
    ```yaml
    version: 4

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
          wallarm_mode: off
    ```
=== "tcp-capture"
    ```yaml
    version: 4

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
          wallarm_mode: off
    ```

#### host

Rota host'unu belirtir.

Bu parametre, [`connector.allowed_hosts`](#connectorallowed_hosts) ile benzer joker eşleştirmeyi destekler.

Örneğin:

=== "connector-server"
    ```yaml
    version: 4

    route_config:
      wallarm_application: 10
      routes:
        - host: "*.host.com"
    ```
=== "tcp-capture"
    ```yaml
    version: 4

    route_config:
      wallarm_application: 10
      routes:
        - host: "*.host.com"
    ```

#### routes.route veya route

Belirli rotaları tanımlar. Rotalar NGINX benzeri öneklerle yapılandırılabilir:

```yaml
- route: [ = | ~ | ~* | ^~ |   ]/location
        #  |   |   |    |    ^ regex'lerden daha düşük öncelikli önek
        #  |   |   |    ^ regex'lerden daha yüksek öncelikli önek
        #  |   |   ^ re büyük/küçük harf duyarsız
        #  |   ^ re büyük/küçük harf duyarlı
        #  ^ tam eşleşme
```

Örneğin, yalnızca tam rotayı eşleştirmek için:

```yaml
- route: =/api/login
```

Düzenli ifadeyle rotaları eşleştirmek için:

```yaml
- route: ~/user/[0-9]+/login.*
```

#### wallarm_application

[Wallarm uygulama kimliğini](../../user-guides/settings/applications.md) ayarlar. Belirli uç noktalar için `route_config.wallarm_application` değerini geçersiz kılar.

#### wallarm_mode

Host'a özel trafik [filtreleme modu](../../admin-en/configure-wallarm-mode.md): `block`, `safe_blocking`, `monitoring` veya `off`. OOB modunda trafik engelleme desteklenmez.

Varsayılan: `monitoring`.

### log.pretty

Hata ve erişim günlükleri biçimini kontrol eder. İnsan tarafından okunabilir günlükler için `true`, JSON günlükler için `false` olarak ayarlayın.

Varsayılan: `true`.

### log.level

Günlük seviyesi: `debug`, `info`, `warn`, `error`, `fatal` olabilir.

Varsayılan: `info`.

### log.log_file

Hata günlüğü çıktısının hedefini belirtir. Seçenekler `stdout`, `stderr` veya bir günlük dosyasına giden bir yoldur.

Varsayılan: `stderr`. Ancak, düğüm `stderr` çıktısını `/opt/wallarm/var/log/wallarm/go-node.log` dosyasına yönlendirir.

### log.access_log.enabled

Erişim günlüklerinin toplanıp toplanmayacağını kontrol eder.

Varsayılan: `true`.

### log.access_log.verbose

Erişim günlüğü çıktısına her istek hakkında ayrıntılı bilgi eklenip eklenmeyeceğini kontrol eder.

Varsayılan: `true`.

### log.access_log.log_file

Erişim günlüğü çıktısının hedefini belirtir. Seçenekler `stdout`, `stderr` veya bir günlük dosyasına giden bir yoldur.

Varsayılan: `stderr`. Ancak, düğüm `stderr` çıktısını `/opt/wallarm/var/log/wallarm/go-node.log` dosyasına yönlendirir.

Ayarlanmazsa, [`log.log_file`](#loglog_file) ayarı kullanılır.

## Gelişmiş ayarlar

=== "connector-server"
    ```yaml
    version: 4

    input_filters:
      inspect:
      - path: "^/api/v[0-9]+/.*"
        headers:
          Authorization: "^Bearer .+"
      bypass:
      - path: ".*\\.(png|jpg|css|js|svg)$"
      - headers:
          accept: "text/html"
  
    http_inspector:
      workers: auto
      libdetection_enabled: true
      api_firewall_enabled: true
      api_firewall_database: /opt/wallarm/var/lib/wallarm-api/2/wallarm_api.db
      wallarm_dir: /opt/wallarm/etc/wallarm
      shm_dir: /tmp
      wallarm_process_time_limit: 1s

    postanalytics_exporter:
      address: 127.0.0.1:3313
      enabled: true

    log:
      proton_log_mask: info@*

    metrics:
      enabled: true
      listen_address: :9000
      legacy_status:
        enabled: true
        listen_address: 127.0.0.1:10246
      namespace: wallarm_gonode

    health_check:
      enabled: true
      listen_address: :8080
    
    drop_on_overload: true
    ```
=== "tcp-capture"
    ```yaml
    version: 4

    input_filters:
      inspect:
      - path: "^/api/v[0-9]+/.*"
        headers:
          Authorization: "^Bearer .+"
      bypass:
      - path: ".*\\.(png|jpg|css|js|svg)$"
      - headers:
          accept: "text/html"
    
    http_inspector:
      workers: auto
      libdetection_enabled: true
      api_firewall_enabled: true
      api_firewall_database: /opt/wallarm/var/lib/wallarm-api/2/wallarm_api.db
      wallarm_dir: /opt/wallarm/etc/wallarm
      shm_dir: /tmp
      wallarm_process_time_limit: 1s

    postanalytics_exporter:
      address: 127.0.0.1:3313
      enabled: true

    log:
      proton_log_mask: info@*

    metrics:
      enabled: true
      listen_address: :9000
      legacy_status:
        enabled: true
        listen_address: 127.0.0.1:10246
      namespace: wallarm_gonode

    health_check:
      enabled: true
      listen_address: :8080
    
    drop_on_overload: true
    ```

### input_filters

Gelen isteklerin Native Node tarafından **denetlenip** denetlenmeyeceğini veya **atlanacağını** tanımlar. Bu, statik içerikler veya sağlık denetimleri gibi alakasız trafiği yok sayarak CPU kullanımını azaltır.

Varsayılan olarak tüm istekler denetlenir.

!!! warning "Denetimden atlanan istekler analiz edilmez veya Wallarm Cloud'a gönderilmez"
    Sonuç olarak, atlanan istekler metriklerde, API Discovery'de, API oturumlarında, zafiyet tespitinde vb. görünmez. Wallarm özellikleri bunlara uygulanmaz.

**Uyumluluk**

* Native Node 0.13.7 ve üzeri 0.13.x sürümler
* Native Node 0.16.0 ve üzeri
* Henüz AWS AMI'de desteklenmiyor

**Filtreleme mantığı**

Filtreleme mantığı 2 listeye dayanır:

* `inspect`: burada en az bir filtreyle eşleşen istekler denetlenir.

    Atlanır veya boş bırakılırsa, `bypass` tarafından hariç tutulmadıkça tüm istekler denetlenir.
* `bypass`: burada herhangi bir filtreyle eşleşen istekler, `inspect` ile eşleşseler bile asla denetlenmez.

**Filtre biçimi**

Her filtre şu ögeleri içerebilen bir nesnedir:

* `path` veya `url`: istek yolunu eşleştirmek için regex (her ikisi de desteklenir ve eşdeğerdir).
* `headers`: başlık adlarını, değerlerini eşleştirmek için regex desenlerine eşleyen bir eşleme.

Tüm düzenli ifadeler [RE2 sözdizimini](https://github.com/google/re2/wiki/Syntax) takip etmelidir.

**Örnekler**

=== "Token'a göre izin ver, statik içeriği atla"
    Bu yapılandırma, yalnızca `Authorization` başlığında bir `Bearer` belirteci içeren sürümlü API uç noktalarına (örn. `/api/v1/...`) yapılan istekleri denetler.
    
    Görseller, betikler, stiller gibi statik dosyalara ve tarayıcı başlattığı HTML sayfa yüklemelerine yapılan istekler atlanır.

    ```yaml
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
=== "Etki alanına göre izin ver, sağlık denetimlerini atla"
    Bu yapılandırma yalnızca `Host: api.example.com` başlığına sahip istekleri denetler; diğer tüm istekleri atlar.
    
    `/healthz` uç noktasına yapılan istekler, denetlenecek host ile eşleşse bile her zaman atlanır.

    ```yaml
    input_filters:
      inspect:
      - headers:
        host: "^api\\.example\\.com$"
      bypass:
      - path: "^/healthz$"
    ```

### http_inspector.workers

Wallarm işçi (worker) sayısı.

Varsayılan: `auto`, yani işçi sayısı CPU çekirdek sayısına ayarlanır.

### http_inspector.libdetection_enabled

[libdetection](../../about-wallarm/protecting-against-attacks.md#basic-set-of-detectors) kütüphanesi kullanılarak SQL Injection saldırılarının ek olarak doğrulanıp doğrulanmayacağı.

Varsayılan: `true`.

### http_inspector.api_firewall_enabled

[API Specification Enforcement](../../api-specification-enforcement/overview.md)'ın etkin olup olmayacağını kontrol eder. Lütfen bu özelliğin etkinleştirilmesinin, Wallarm Console UI üzerinden gereken abonelik ve yapılandırmanın yerine geçmediğini unutmayın.

Varsayılan: `true`.

### http_inspector.api_firewall_database

[API Specification Enforcement](../../api-specification-enforcement/overview.md) için yüklediğiniz API spesifikasyonlarını içeren veritabanının yolunu belirtir. Bu veritabanı Wallarm Cloud ile senkronize edilir.

Genellikle, bu parametreyi değiştirmenize gerek yoktur.

Varsayılan: `/opt/wallarm/var/lib/wallarm-api/2/wallarm_api.db`.

### http_inspector.wallarm_dir

Düğüm yapılandırma dosyaları için dizin yolunu belirtir. Genellikle, bu parametreyi değiştirmenize gerek yoktur. Yardıma ihtiyaç duyarsanız, lütfen [Wallarm destek ekibi](mailto:support@wallarm.com) ile iletişime geçin.

Varsayılan: `/opt/wallarm/etc/wallarm`.

### http_inspector.shm_dir

HTTP analizörü için paylaşılan dizin. Genellikle, bu parametreyi değiştirmenize gerek yoktur.

Varsayılan: `/tmp`.

### http_inspector.wallarm_process_time_limit

Wallarm Native Node tarafından tek bir HTTP isteğinin işlenmesi için azami süreyi tanımlar.

Sınır aşıldığında, istek bir [`overlimit_res`](../../attacks-vulns-list.md#resource-overlimit) saldırısı olarak işaretlenir ve engellenir.

Sınırı bu parametreyle veya [Wallarm Console](../../user-guides/rules/configure-overlimit-res-detection.md) üzerinden yapılandırabilirsiniz; bu ayrıca bu tür isteklerin engellenip engellenmeyeceğini de kontrol eder. Wallarm Console ayarları yerel yapılandırmaları geçersiz kılar.

### postanalytics_exporter.address

Wallarm'ın istek işleme sürecindeki istatistiksel istek analizini gerçekleştiren postanalytics servisinin adresini ayarlar. Genellikle, bu parametreyi değiştirmenize gerek yoktur.

Varsayılan: `127.0.0.1:3313`.

Node sürümü 0.12.1 ve öncesinde, bu parametre `tarantool_exporter.address` olarak ayarlanır.

### postanalytics_exporter.enabled

Postanalytics servisinin etkin olup olmayacağını kontrol eder. Wallarm düğümü postanalytics servisi olmadan çalışmadığı için bu parametrenin `true` olarak ayarlanması gerekir.

Varsayılan: `true`.

Node sürümü 0.12.1 ve öncesinde, bu parametre `tarantool_exporter.enabled` olarak ayarlanır.

### log.proton_log_mask

Dahili trafik günlüğü maskesi. Genellikle, bu parametreyi değiştirmenize gerek yoktur.

Varsayılan: `info@*`.

### metrics.enabled

[Prometheus metriklerinin](../../admin-en/configure-statistics-service.md#usage) etkinleştirilip etkinleştirilmeyeceğini kontrol eder. Bu parametrenin `true` olarak ayarlanması gerekir; aksi halde Wallarm düğümü düzgün çalışmaz.

Varsayılan: `true`.

### metrics.listen_address

Prometheus metriklerinin sunulacağı adres ve portu ayarlar. Bu metriklere `/metrics` uç noktası üzerinden erişebilirsiniz.

Varsayılan: `:9000` (9000 portundaki tüm ağ arayüzleri).

### metrics.legacy_status.enabled

[`/wallarm-status`](../../admin-en/configure-statistics-service.md#usage) metrik servisinin etkinleştirilip etkinleştirilmeyeceğini kontrol eder. Bu parametrenin `true` olarak ayarlanması gerekir; aksi halde Wallarm düğümü düzgün çalışmaz.

Varsayılan: `true`.

### metrics.legacy_status.listen_address

JSON formatında `/wallarm-status` metriklerinin sunulacağı adres ve portu ayarlar. Bu metriklere `/wallarm-status` uç noktası üzerinden erişebilirsiniz.

Varsayılan: `127.0.0.1:10246`.

### metrics.namespace

Native Node'un çekirdek işleme servisi olan `go-node` tarafından sunulan Prometheus metrikleri için öneki tanımlar.

Varsayılan: `wallarm_gonode`.

`go-node` tarafından yayılan tüm metrikler bu öneki kullanır (örn. `wallarm_gonode_requests_total`). `wstore` ve `wcli` gibi düğümün diğer bileşenleri kendi sabit öneklerini kullanır.

Native Node 0.13.5 ve sonraki 0.13.x sürümlerinde ve 0.15.1 ve sonrasında desteklenir.

### health_check.enabled

Sağlık denetimi uç noktalarının etkinleştirilip etkinleştirilmeyeceğini kontrol eder.

Varsayılan: `true`.

### health_check.listen_address

`/live` ve `/ready` sağlık denetimi uç noktaları için adres ve portu ayarlar.

Varsayılan: `:8080` (8080 portundaki tüm ağ arayüzleri).

### drop_on_overload

Düğümün, işleme yükü kapasitesini aştığında gelen istekleri düşürüp düşürmeyeceğini kontrol eder.

**Uyumluluk**

* Native Node 0.16.1 ve üzeri
* Henüz AWS AMI'de desteklenmiyor
* [Envoy bağlayıcısı](../connectors/istio.md) için davranış `failure_mode_allow` ayarına bağlıdır

    `drop_on_overload` yapılandırması uygulanmaz.

Etkinleştirildiğinde (`true`), Node verileri gerçek zamanlı olarak işleyemezse fazla girdiyi düşürür ve `503 (Service Unavailable)` ile yanıt verir. Bu, Node'un işlenmemiş istekleri dahili kuyruklarda biriktirmesini önleyerek, aksi halde ciddi performans düşüşlerine veya bellek yetersizliği hatalarına yol açabilecek durumları engeller.

503 döndürmek, üst hizmetlerin, yük dengeleyicilerin veya istemcilerin aşırı yük koşullarını tespit etmesine ve gerekirse istekleri yeniden denemesine olanak tanır.

Engelleme [modunda](../../admin-en/configure-wallarm-mode.md), bu tür istekler engellenmez.

Varsayılan: `true`.