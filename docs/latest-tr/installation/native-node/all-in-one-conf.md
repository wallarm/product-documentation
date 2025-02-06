# All-in-One Yükleyici veya Docker İmajı ile Native Node Yapılandırma

Self-hosted [Wallarm Native Node](../nginx-native-node-internals.md#native-node) all-in-one yükleyicisi veya Docker imajı kullanılarak dağıtılırken, `.yaml` yapılandırma dosyasını oluşturursunuz. Bu dosyada, bu belgede açıklanan tüm parametreler için node yapılandırmasını belirtebilirsiniz.

Node çalışırken all-in-one yükleyici kullanılarak ayarları değiştirmek için:

1. `/opt/wallarm/etc/wallarm/go-node.yaml` dosyasını güncelleyin. İlk yapılandırma dosyası kurulum sırasında bu yola kopyalanır.
1. Değişikliklerin uygulanması için Wallarm servisini yeniden başlatın:

    ```
    sudo systemctl restart wallarm
    ```

Eğer node bir Docker imajı kullanılarak dağıtıldıysa, yapılandırma dosyasını ana makinede güncellemek ve güncellenmiş dosya ile Docker konteynerini yeniden başlatmak önerilir.

## mode (gereklidir)

Wallarm node'unun çalışma modu. Aşağıdakilerden biri olabilir:

* [MuleSoft](../connectors/mulesoft.md), [Cloudflare](../connectors/cloudflare.md), [Amazon CloudFront](../connectors/aws-lambda.md), [Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md), [Fastly](../connectors/fastly.md) konektörleri için `connector-server`.
* [TCP trafik aynalama analizi](../oob/tcp-traffic-mirror/deployment.md) için `tcp-capture`.

=== "connector-server"
    Eğer Wallarm konektörü için Native Node'u kurduysanız, temel yapılandırma aşağıdaki gibidir:

    ```yaml
    version: 2

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
    Eğer TCP trafik aynalama analizi için Native Node'u kurduysanız, temel yapılandırma aşağıdaki gibidir:

    ```yaml
    version: 3

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

    http_inspector:
      real_ip_header: "X-Real-IP"
    
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

## Konektör'e Özel Ayarlar

### connector.address (gereklidir)

Dinlenecek IP adresi ve portu iki nokta üst üste (`:`) ile ayırarak belirtir.

Portun `80`, `8080`, `9000` veya `3313` olmadığından emin olun; çünkü bunlar diğer Wallarm işlemleri tarafından kullanılmaktadır.

=== "IP address:Port"
    ```yaml
    version: 2

    connector:
      address: '192.158.1.38:5050'
    ```
=== "Specific port on all IPs"
    ```yaml
    version: 2

    connector:
      address: ':5050'
    ```

### connector.tls_cert (gereklidir)

Node'un çalıştığı alan için verilen TLS/SSL sertifikasının (genellikle bir `.crt` veya `.pem` dosyası) yolunu belirtir.

Güvenli iletişim sağlamak için, sertifika güvenilir bir Sertifika Yetkilisi (CA) tarafından sağlanmalıdır.

Eğer node bir Docker imajı kullanılarak dağıtıldıysa, SSL şifre çözümü yük dengeleyici seviyesinde gerçekleşeceği için bu parametre gerekli değildir.

### connector.tls_key (gereklidir)

TLS/SSL sertifikasıyla ilişkili özel anahtarın (genellikle bir `.key` dosyası) yolunu belirtir.

Eğer node bir Docker imajı kullanılarak dağıtıldıysa, SSL şifre çözümü yük dengeleyici seviyesinde gerçekleşeceği için bu parametre gerekli değildir.

### connector.blocking

Genellikle bu parametreyi değiştirmenize gerek yoktur. Kötü niyetli istekler için özel engelleme davranışı, [`wallarm_mode`](#route_configwallarm_mode) parametresi ile kontrol edilir.

Bu parametre, Native Node'un kötü niyetli, yasaklanmış IP'lerden veya diğer engelleme gerektiren koşullardan gelen gelen istekleri engelleme yeteneğini etkinleştirir.

Varsayılan: `true`.

### connector.allowed_networks

Bağlantıya izin verilen IP ağlarının listesidir.

Varsayılan: `0.0.0.0/0` (tüm IP ağlarına izin verilir).

### connector.allowed_hosts

İzin verilen ana bilgisayar isimlerinin listesidir.

Varsayılan: tüm ana bilgisayarlara izin verilir.

Bu parametre, joker karakter eşleştirmeyi destekler:

* `*` ayırıcı olmayan karakterlerden oluşan herhangi bir diziyi eşleştirir
* `?` ayırıcı olmayan tek bir karakteri eşleştirir
* `'[' [ '^' ] { character-range } ']'`

??? info "Joker karakter eşleştirme sözdizimi detayları"
    ```
    // The pattern syntax is:
    //
    //	pattern:
    //		{ term }
    //	term:
    //		'*'         matches any sequence of non-Separator characters
    //		'?'         matches any single non-Separator character
    //		'[' [ '^' ] { character-range } ']'
    //		            character class (must be non-empty)
    //		c           matches character c (c != '*', '?', '\\', '[')
    //		'\\' c      matches character c
    //
    //	character-range:
    //		c           matches character c (c != '\\', '-', ']')
    //		'\\' c      matches character c
    //		lo '-' hi   matches character c for lo <= c <= hi
    //
    // Match requires pattern to match all of name, not just a substring.
    ```

Örneğin:

```yaml
version: 2

connector:
  allowed_hosts:
    - w.com
    - "*.test.com"
```

### connector.mesh

Mesh özelliği, Wallarm node'larının çoklu node replikaları dağıtıldığında tutarlı trafik işleme sağlamak için `connector-server` modunda kullanılır. İstekleri ve karşılık gelen yanıtları, başlangıçta farklı replikalar tarafından ele alınmış olsa bile aynı node'a yönlendirir. Bu, otomatik ölçeklendirme veya ECS'de çoklu replikalar söz konusu olduğunda kritik öneme sahiptir.

!!! info "Kubernetes environments"
    Kubernetes'te, [Helm chart for native Wallarm node deployment](helm-chart.md) kullanın. Otomatik ölçeklendirme veya çoklu replikalar tespit edildiğinde mesh otomatik olarak yapılandırılır; ekstra ayarlamaya gerek yoktur.

ECS'de mesh'i yapılandırmak için:

1. Node'ların mesh içinde birbirlerini dinamik olarak bulup iletişim kurabilmesi için [AWS Cloud Map](https://docs.aws.amazon.com/cloud-map/latest/dg/what-is-cloud-map.html), [Google Cloud DNS](https://cloud.google.com/dns/) veya benzeri hizmetlerle servis keşfi kurun.

    Servis keşfi olmadan mesh düzgün çalışmayacaktır, çünkü node'lar birbirlerini bulamayacak ve trafik yönlendirme sorunları yaşanacaktır.
1. Aşağıda gösterildiği gibi yapılandırma dosyasına `connector.mesh` parametrelerini ekleyerek Wallarm node'unun mesh'i kullanacak şekilde yapılandırılmasını sağlayın:

```yaml
version: 2

connector:
  mesh:
    discovery: dns
    name: native-node-mesh-discovery
    port: 9093
```

#### discovery

Mesh'deki node'ların birbirlerini nasıl keşfedeceğini tanımlar. Şu anda sadece `dns` değeri kullanılabilir.

Node'lar, DNS kullanarak birbirlerini keşfeder. DNS kaydı, mesh'e katılan tüm node'ların IP adreslerine çözülmelidir.

#### name

Mesh'deki diğer node'ların IP adreslerini çözmek için kullanılan DNS alan adını belirtir. Bu genellikle, ECS servisindeki tüm node örneklerine çözünen bir değere ayarlanır.

#### port

Mesh içerisindeki node'lar arası iletişim için kullanılan dahili portu belirtir. Bu port dışa açılmaz ve ECS kümesindeki node'lar arası trafik için ayrılmıştır.

### connector.url_normalize

Route yapılandırmaları seçilmeden ve libproton ile veri analiz edilmeden önce URL normalizasyonunu etkinleştirir.

Varsayılan: `true`.

## TCP Ayna Özel Ayarları

### goreplay.filter

Trafiği yakalamak için kullanılacak ağ arayüzünü belirtir. Bir değer belirtilmezse, instance'daki tüm ağ arayüzlerinden trafiği yakalar.

Değer, iki nokta üst üste (`:`) ile ayrılmış ağ arayüzü ve port olmalıdır, örn.:

=== "Interface:Port"
    ```yaml
    version: 3

    goreplay:
      filter: 'eth0:80'
    ```

    Birden fazla arayüz ve port'tan trafiği yakalamak için `goreplay.filter` ile birlikte `goreplay.extra_args` kullanılabilir, örn.:

    ```yaml
    version: 3

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

    `filter`, GoReplay'e `-input-raw` argümanını iletir; `extra_args` ise ek `-input-raw` girdilerini belirtmenizi sağlar.
=== "All ports on interface"
    ```yaml
    version: 3

    goreplay:
      filter: 'eth0:'
    ```
=== "Specific port on all interfaces"
    ```yaml
    version: 3

    goreplay:
      filter: ':80'
    ```
=== "All interfaces and ports"
    ```yaml
    version: 3

    goreplay:
      filter: ':'
    ```

Ana makinedeki mevcut ağ arayüzlerini görmek için:

```
ip addr show
```

### goreplay.extra_args

GoReplay'e iletilecek [ek argümanları](https://github.com/buger/goreplay/blob/master/docs/Request-filtering.md) belirtmenizi sağlar.

* Genellikle, analiz gerektiren ayna trafiğin türlerini tanımlamak için kullanılır, örneğin VLAN, VXLAN. Örneğin:

    === "VLAN-wrapped mirrored traffic"
        ```yaml
        version: 3

        goreplay:
          extra_args:
            - -input-raw-vlan
            - -input-raw-vlan-vid
            # VLAN'ınızın VID'si, örn.:
            # - 42
        ```
    === "VXLAN-wrapped mirrored traffic (common in AWS)"
        ```yaml
        version: 3

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

    Eğer ayna trafik, VLAN veya VXLAN gibi ek protokollerle sarmalanmamışsa, `extra_args` yapılandırması atlanabilir. Sarmalanmamış trafik varsayılan olarak ayrıştırılır.
* Ek arayüz ve portları yakalamak için `filter` ile birlikte `extra_args` genişletilebilir:

    ```yaml
    version: 3

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

    `filter`, GoReplay'e `-input-raw` argümanını iletir; `extra_args` ise ek `-input-raw` girdilerini belirtmenizi sağlar.

### goreplay.path

GoReplay binari dosyasının yolunu belirtir. Genellikle bu parametre değiştirilmez.

Varsayılan: `/opt/wallarm/usr/bin/gor`.

### goreplay.parse_responses

Aynalanan yanıtların ayrıştırılıp ayrıştırılmayacağını kontrol eder. Bu, [güvenlik açığı tespiti](../../about-wallarm/detecting-vulnerabilities.md) ve [API discovery](../../api-discovery/overview.md) gibi Wallarm özelliklerinin yanıt verilerini kullanarak çalışmasını sağlar.

Varsayılan: `true`.

Ayrıca, yanıt aynalamasının hedef instance'daki Wallarm node'una iletildiğinden emin olun.

Node sürümü 0.10.1 ve öncesinde, bu parametre `middleware.parse_responses` olarak ayarlanır.

### goreplay.response_timeout

Bir yanıt için beklenen maksimum süreyi belirtir. Bu süre içerisinde yanıt alınamazsa, Wallarm işlemleri ilgili yanıtı beklemeyi bırakır.

Varsayılan: `5s`.

Node sürümü 0.10.1 ve öncesinde, bu parametre `middleware.response_timeout` olarak ayarlanır.

### goreplay.url_normalize

Route yapılandırmaları seçilmeden ve libproton ile veri analiz edilmeden önce URL normalizasyonunu etkinleştirir.

Varsayılan: `true`.

Node sürümü 0.10.1 ve öncesinde, bu parametre `middleware.url_normalize` olarak ayarlanır.

### http_inspector.real_ip_header

Varsayılan olarak, Wallarm kaynak IP adresini ağ paketlerinin IP başlıklarından okur. Ancak, proxy ve yük dengeleyiciler bu değeri kendi IP'lerine çevirebilir.

Gerçek istemci IP'sinin korunması için, bu aracılar genellikle bir HTTP başlığı (örn., `X-Real-IP`, `X-Forwarded-For`) ekler. `real_ip_header` parametresi, orijinal istemci IP'sini çıkarmak için hangi başlığın kullanılacağını belirtir.

## Temel Ayarlar

### route_config

Belirli rotalar için ayarların belirtildiği yapılandırma bölümüdür.

### route_config.wallarm_application

[Wallarm application ID](../../user-guides/settings/applications.md). Bu değer, belirli rotalar için geçersiz kılınabilir.

Varsayılan: `-1`.

### route_config.wallarm_mode

Genel trafik [filtreleme modu](../../admin-en/configure-wallarm-mode.md): `block`, `safe_blocking`, `monitoring` veya `off`. OOB modunda trafik engellemesi desteklenmez.

Mod, belirli rotalar için [geçersiz kılınabilir](#wallarm_mode).

Varsayılan: `monitoring`.

### route_config.routes

Belirli uç noktalar için Wallarm yapılandırmasını ayarlar. Wallarm modu ve application ID'lerini içerir. Örnek yapılandırma:

=== "connector-server"
    ```yaml
    version: 2

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
    version: 3

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

Rota ana bilgisayarını belirtir.

Bu parametre, [`connector.allowed_hosts`](#connectorallowed_hosts) ile benzer joker karakter eşleştirmeyi destekler.

Örneğin:

=== "connector-server"
    ```yaml
    version: 2

    route_config:
      wallarm_application: 10
      routes:
        - host: "*.host.com"
    ```
=== "tcp-capture"
    ```yaml
    version: 3

    route_config:
      wallarm_application: 10
      routes:
        - host: "*.host.com"
    ```

#### routes.route veya route

Belirli rotaları tanımlar. Rotalar, NGINX benzeri öneklerle yapılandırılabilir:

```yaml
- route: [ = | ~ | ~* | ^~ |   ]/location
        #  |   |   |    |    ^ prefix (regex'lerden daha düşük öncelikli)
        #  |   |   |    ^ prefix (regex'lerden daha yüksek öncelikli)
        #  |   |   ^ re case insensitive
        #  |   ^ re case sensitive
        #  ^ tam eşleşme
```

Örneğin, sadece tam eşleşen rota için:

```yaml
- route: =/api/login
```

Düzenli ifade ile rota eşleştirmek için:

```yaml
- route: ~/user/[0-9]+/login.*
```

#### wallarm_application

Belirli uç noktalar için [Wallarm application ID](../../user-guides/settings/applications.md)'yu ayarlar. `route_config.wallarm_application` değeri, belirli uç noktalar için geçersiz kılınır.

#### wallarm_mode

Ana bilgisayara özgü trafik [filtreleme modu](../../admin-en/configure-wallarm-mode.md): `block`, `safe_blocking`, `monitoring` veya `off`. OOB modunda trafik engellemesi desteklenmez.

Varsayılan: `monitoring`.

### log.pretty

Hata ve erişim günlüklerinin formatını kontrol eder. İnsan tarafından okunabilir günlükler için `true`, JSON günlükleri için `false` olarak ayarlayın.

Varsayılan: `true`.

### log.level

Günlük seviyesi; `debug`, `info`, `warn`, `error`, `fatal` olabilir.

Varsayılan: `info`.

### log.log_file

Hata günlüğü çıktısının hedefini belirtir. Seçenekler: `stdout`, `stderr` veya bir dosya yolu.

Varsayılan: `stderr`. Ancak, node `stderr` çıktısını `/opt/wallarm/var/log/wallarm/go-node.log` dosyasına yönlendirir.

### log.access_log.enabled

Erişim günlüklerinin toplanıp toplanmayacağını kontrol eder.

Varsayılan: `true`.

### log.access_log.verbose

Erişim günlüğü çıktısında her istek için ayrıntılı bilginin dahil edilip edilmeyeceğini kontrol eder.

Varsayılan: `true`.

### log.access_log.log_file

Erişim günlüğü çıktısının hedefini belirtir. Seçenekler: `stdout`, `stderr` veya bir dosya yolu.

Varsayılan: `stderr`. Belirtilmezse, [`log.log_file`](#loglog_file) ayarı kullanılır.

## Gelişmiş Ayarlar

=== "connector-server"
    ```yaml
    version: 2

    http_inspector:
      workers: auto
      libdetection_enabled: true
      api_firewall_enabled: true
      api_firewall_database: /opt/wallarm/var/lib/wallarm-api/2/wallarm_api.db
      wallarm_dir: /opt/wallarm/etc/wallarm
      shm_dir: /tmp
      wallarm_process_time_limit: 1s

    tarantool_exporter:
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

    health_check:
      enabled: true
      listen_address: :8080
    ```
=== "tcp-capture"
    ```yaml
    version: 3

    http_inspector:
      workers: auto
      libdetection_enabled: true
      api_firewall_enabled: true
      api_firewall_database: /opt/wallarm/var/lib/wallarm-api/2/wallarm_api.db
      wallarm_dir: /opt/wallarm/etc/wallarm
      shm_dir: /tmp
      wallarm_process_time_limit: 1s

    tarantool_exporter:
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

    health_check:
      enabled: true
      listen_address: :8080
    ```

### http_inspector.workers

Wallarm işçi (worker) sayısını belirtir.

Varsayılan: `auto` (yani işçi sayısı CPU çekirdek sayısına eşitlenir).

### http_inspector.libdetection_enabled

[libdetection](../../about-wallarm/protecting-against-attacks.md#libdetection-overview) kütüphanesi kullanılarak SQL Injection saldırılarının ek doğrulamasının yapılıp yapılmayacağını belirler.

Varsayılan: `true`.

### http_inspector.api_firewall_enabled

[API Specification Enforcement](../../api-specification-enforcement/overview.md) özelliğinin etkin olup olmadığını kontrol eder. Bu özelliğin etkinleştirilmesi, gerekli abonelik ve Wallarm Console üzerinden yapılan yapılandırmanın yerine geçmez.

Varsayılan: `true`.

### http_inspector.api_firewall_database

[API Specification Enforcement](../../api-specification-enforcement/overview.md) için yüklediğiniz API spesifikasyonlarını içeren veritabanının yolunu belirtir. Bu veritabanı, Wallarm Cloud ile senkronize olur.

Genellikle bu parametre değiştirilmez.

Varsayılan: `/opt/wallarm/var/lib/wallarm-api/2/wallarm_api.db`.

### http_inspector.wallarm_dir

Node yapılandırma dosyaları için dizin yolunu belirtir. Genellikle bu parametre değiştirilmez. Yardım gerekirse, [Wallarm support team](mailto:support@wallarm.com) ile iletişime geçin.

Varsayılan: `/opt/wallarm/etc/wallarm`.

### http_inspector.shm_dir

HTTP analizörü için paylaşılan dizini belirtir. Genellikle bu parametre değiştirilmez.

Varsayılan: `/tmp`.

### http_inspector.wallarm_process_time_limit

Wallarm Native Node tarafından tek bir HTTP isteğinin işlenmesi için maksimum süreyi belirler.

Süre aşıldığında, istek [`overlimit_res`](../../attacks-vulns-list.md#resource-overlimit) saldırısı olarak işaretlenir ve engellenir.

Bu limit, bu parametre ile veya [Wallarm Console](../../user-guides/rules/configure-overlimit-res-detection.md) üzerinden yapılandırılabilir. Wallarm Console ayarları yerel yapılandırmaları geçersiz kılar.

### tarantool_exporter.address

Wallarm'ın istek işleme sürecinde, istatistiksel analiz hizmeti olan postanalytics servisi için adresi belirler. Genellikle bu parametre değiştirilmez.

Varsayılan: `127.0.0.1:3313`.

### tarantool_exporter.enabled

Postanalytics servisi etkinleştirildi mi kontrol eder. Wallarm node, postanalytics servisi olmadan çalışmaz; bu parametre `true` olmalıdır.

Varsayılan: `true`.

### log.proton_log_mask

Dahili trafik günlüğü için kullanılan maskeyi belirtir. Genellikle bu parametre değiştirilmez.

Varsayılan: `info@*`.

### metrics.enabled

[Prometheus metrikleri](../../admin-en/configure-statistics-service.md#usage) etkinleştirildi mi kontrol eder. Bu parametre `true` olmalıdır; aksi halde Wallarm node düzgün çalışmaz.

Varsayılan: `true`.

### metrics.listen_address

Prometheus metriklerinin açılacağı adres ve portu belirtir. Bu metriklere ulaşmak için `/metrics` uç noktasını kullanın.

Varsayılan: `:9000` (tüm ağ arayüzlerinde, port 9000).

### metrics.legacy_status.enabled

[`/wallarm-status`](../../admin-en/configure-statistics-service.md#usage) metrik servisi etkinleştirilmiş mi kontrol eder. Bu parametre `true` olmalıdır; aksi halde Wallarm node düzgün çalışmaz.

Varsayılan: `true`.

### metrics.legacy_status.listen_address

JSON formatında `/wallarm-status` metriklerinin açılacağı adres ve portu belirtir. Bu metriklere `/wallarm-status` uç noktası üzerinden ulaşabilirsiniz.

Varsayılan: `127.0.0.1:10246`.

### health_check.enabled

Sağlık kontrol uç noktalarının etkinleştirilip etkinleştirilmediğini belirler.

Varsayılan: `true`.

### health_check.listen_address

`/live` ve `/ready` sağlık kontrol uç noktaları için adres ve portu belirtir.

Varsayılan: `:8080` (tüm ağ arayüzlerinde, port 8080).