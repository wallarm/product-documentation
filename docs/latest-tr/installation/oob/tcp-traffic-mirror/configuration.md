# TCP Trafik Aynalama Analizinin Yapılandırılması

Wallarm düğümünü TCP Trafik Aynalama analizi için dağıtırken oluşturduğunuz yapılandırma dosyasında (`wallarm-node-conf.yaml` [dağıtım talimatlarında](deployment.md) belirtildiği gibi), dağıtılan çözümü ince ayar yapabilirsiniz.

## Temel ayarlar

```yaml
version: 2

mode: tcp-capture

goreplay:
  filter: <ağ arabiriminiz ve portunuz, örn. 'lo:' veya 'enp7s0:'>
  extra_args:
    - -input-raw-engine
    - vxlan

route_config:
  wallarm_application: 10
  routes:
    - route: /example/api/v1
      wallarm_mode: off
    - route: /example/extra_api
      wallarm_application: 2
    - route: /example/testing
      wallarm_mode: off

http_inspector:
  real_ip_header: "X-Real-IP"

log:
  pretty: true
  level: debug
  log_file: stderr
  access_log:
    enabled: true
    verbose: true
    log_file: stderr
```

### mode (gerekli)

Wallarm düğümünün çalışma modu. TCP trafik aynalama analizi için `tcp-capture` olmalıdır.

### goreplay.filter

Trafiğin yakalanacağı ağ arabirimini belirtir. Bir değer belirtilmezse, örnekteki tüm ağ arabirimlerinden trafik yakalanır.

Değer, iki nokta işareti (`:`) ile ayrılmış ağ arabirimi ve port olmalıdır, örn.:

=== "Arabirim:Port"
    ```yaml
    version: 2

    goreplay:
      filter: 'eth0:80'
    ```

    Birden fazla arabirim ve porttan trafik yakalamak için, `goreplay.filter` ile birlikte `goreplay.extra_args` kullanın, örn.:

    ```yaml
    version: 2

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

    `filter`, GoReplay'i `-input-raw` argümanı ile ayarlar ve `extra_args`, ek `-input-raw` girdileri belirlemenize olanak tanır.
=== "Arabirimdeki Tüm Portlar"
    ```yaml
    version: 2

    goreplay:
      filter: 'eth0:'
    ```
=== "Tüm Arabirimlerde Belirli Port"
    ```yaml
    version: 2

    goreplay:
      filter: ':80'
    ```
=== "Tüm Arabirimler ve Portlar"
    ```yaml
    version: 2

    goreplay:
      filter: ':'
    ```

Host üzerindeki mevcut ağ arabirimlerini kontrol etmek için:

```
ip addr show
```

### goreplay.extra_args

Bu parametre, GoReplay'a iletilecek [ek argümanları](https://github.com/buger/goreplay/blob/master/docs/Request-filtering.md) belirtmenize olanak tanır.

* Genellikle, VLAN, VXLAN gibi analiz gerektiren aynalanan trafik türlerini tanımlamak için kullanılır. Örneğin:

    === "VLAN ile sarmalanmış aynalanan trafik"
        ```yaml
        version: 2

        goreplay:
          extra_args:
            - -input-raw-vlan
            - -input-raw-vlan-vid
            # VLAN'ınızın VID'si, örn.:
            # - 42
        ```
    === "VXLAN ile sarmalanmış aynalanan trafik (AWS'de yaygın)"
        ```yaml
        version: 2

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

    Eğer aynalanan trafik VLAN veya VXLAN gibi ek protokollerle sarmalanmamışsa, `extra_args` yapılandırmasını atlayabilirsiniz. Sarmalanmamış trafik varsayılan olarak çözümlenir.
* Ek ağ arabirimleri ve portları yakalamak için `filter`'ı `extra_args` ile genişletebilirsiniz:

    ```yaml
    version: 2

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

    `filter`, GoReplay'i `-input-raw` argümanı ile ayarlar ve `extra_args`, ek `-input-raw` girdileri belirlemenize olanak tanır.

### route_config

Belirli yollar için ayarları belirttiğiniz yapılandırma bölümü.

### route_config.wallarm_application

[Wallarm application ID](../../../user-guides/settings/applications.md). Bu değer, belirli yollar için geçersiz kılınabilir.

### route_config.routes

Yol bazında Wallarm yapılandırmasını ayarlar. Wallarm modu ve uygulama ID'lerini içerir. Örnek yapılandırma:

```yaml
version: 2

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

Yol ana bilgisayarını belirtir.

Bu parametre joker karakter eşleştirmeyi destekler:

* `*` ayırıcı olmayan karakterlerden oluşan herhangi bir diziyi eşleştirir
* `?` tek bir ayırıcı olmayan karakteri eşleştirir
* `'[' [ '^' ] { character-range } ']'`

??? info "Joker eşleştirme sözdizimi detayları"
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

route_config:
  wallarm_application: 10
  routes:
    - host: "*.host.com"
```

#### routes.route veya route

Belirli yolları tanımlar. Yollar, NGINX benzeri öneklerle yapılandırılabilir:

```yaml
- route: [ = | ~ | ~* | ^~ |   ]/location
        #  |   |   |    |    ^ prefix (regex'lerden daha düşük öncelik)
        #  |   |   |    ^ prefix (regex'lerden daha yüksek öncelik)
        #  |   |   ^re case insensitive
        #  |   ^re case sensitive
        #  ^exact match
```

Örneğin, yalnızca tam eşleşen yolu eşleştirmek için:

```yaml
- route: =/api/login
```

Normal ifadelerle yolları eşleştirmek için:

```yaml
- route: ~/user/[0-9]+/login.*
```

#### wallarm_application

Belirli uç noktalar için `route_config.wallarm_application` değerinin üzerine yazarak [Wallarm application ID](../../../user-guides/settings/applications.md) tanımlar.

#### wallarm_mode

Trafik [filtreleme modu](../../../admin-en/configure-wallarm-mode.md): `monitoring` veya `off`. OOB modunda trafik engelleme desteklenmez.

Varsayılan: `monitoring`.

### http_inspector.real_ip_header

Varsayılan olarak, Wallarm kaynak IP adresini ağ paketinin IP başlıklarından okur. Ancak, proxy ve yük dengeleyiciler bunu kendi IP'leriyle değiştirebilir.

Gerçek istemci IP'sini korumak için, bu ara sunucular genellikle bir HTTP başlığı ekler (örn. `X-Real-IP`, `X-Forwarded-For`). `real_ip_header` parametresi, Wallarm'in orijinal istemci IP'sini çıkarmak için hangi başlığı kullanacağını belirtir.

### log.pretty

Hata ve erişim günlüğü biçimini kontrol eder. İnsan tarafından okunabilen günlükler için `true`, JSON günlükleri için `false` olarak ayarlayın.

Varsayılan: `true`.

### log.level

Günlük seviyesi, `debug`, `info`, `warn`, `error`, `fatal` olabilir.

Varsayılan: `info`.

### log.log_file

Hata günlüğü çıktısının hedefini belirtir. Seçenekler `stdout`, `stderr` ya da bir günlük dosyası yoludur.

Varsayılan: `stderr`. Ancak, düğüm `stderr`'i `/opt/wallarm/var/log/wallarm/go-node.log` dosyasına yönlendirir.

### log.access_log (sürüm 0.5.1 ve üzeri)

#### enabled

Erişim günlüklerinin toplanıp toplanmayacağını kontrol eder.

Varsayılan: `true`.

#### verbose

Her isteğe dair ayrıntılı bilgilerin erişim günlüğü çıktısına dahil edilip edilmeyeceğini kontrol eder.

Varsayılan: `true`.

#### log_file

Erişim günlüğü çıktısının hedefini belirtir. Seçenekler `stdout`, `stderr` ya da bir günlük dosyası yoludur.

Varsayılan: `stderr`. Ancak, düğüm `stderr`'i `/opt/wallarm/var/log/wallarm/go-node.log` dosyasına yönlendirir.

Ayarlanmamışsa, [`log.log_file`](#loglog_file) ayarı kullanılır.

## Gelişmiş ayarlar

```yaml
version: 2

goreplay:
  path: /opt/wallarm/usr/bin/gor

middleware:
  parse_responses: true
  response_timeout: 5s

http_inspector:
  workers: auto
  libdetection_enabled: true
  api_firewall_enabled: true
  api_firewall_database: /opt/wallarm/var/lib/wallarm-api/2/wallarm_api.db
  wallarm_dir: /opt/wallarm/etc/wallarm
  shm_dir: /tmp

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

### goreplay.path

GoReplay çalıştırılabilir dosyasının yolu. Genellikle, bu parametreyi değiştirmenize gerek yoktur.

Varsayılan: `/opt/wallarm/usr/bin/gor`.

### middleware.parse_responses

Aynalanan yanıtların çözümlenip çözümlenmeyeceğini kontrol eder. Bu, [güvenlik açığı tespiti](../../../about-wallarm/detecting-vulnerabilities.md) ve [API keşfi](../../../api-discovery/overview.md) gibi yanıt verilerine dayalı Wallarm özelliklerini etkinleştirir.

Varsayılan: `true`.

Ortamınızda yanıt aynalamanın, Wallarm düğümünün hedef örneğine yapılandırıldığından emin olun.

### middleware.response_timeout

Yanıt için maksimum bekleme süresini belirtir. Bu süre içinde yanıt alınmazsa, Wallarm süreçleri ilgili yanıt için beklemeyi durdurur.

Varsayılan: `5s`.

### http_inspector.workers

Wallarm işçi sayısı.

Varsayılan: `auto`, yani işçi sayısı CPU çekirdek sayısına eşittir.

### http_inspector.libdetection_enabled

SQL Enjeksiyon saldırılarını [libdetection](../../../about-wallarm/protecting-against-attacks.md#libdetection-overview) kütüphanesini kullanarak ayrıca doğrulayıp doğrulamayacağını kontrol eder.

Varsayılan: `true`.

### http_inspector.api_firewall_enabled

[API Specification Enforcement](../../../api-specification-enforcement/overview.md) özelliğinin etkin olup olmadığını kontrol eder. Bu özelliği etkinleştirmenin, Wallarm Console UI üzerinden gerekli abonelik ve yapılandırmanın yerine geçmeyeceğini lütfen unutmayın.

Varsayılan: `true`.

### http_inspector.api_firewall_database

[API Specification Enforcement](../../../api-specification-enforcement/overview.md) için yüklediğiniz API spesifikasyonlarını içeren veritabanının yolunu belirtir. Bu veritabanı Wallarm Cloud ile senkronize edilir.

Genellikle, bu parametreyi değiştirmenize gerek yoktur.

Varsayılan: `/opt/wallarm/var/lib/wallarm-api/2/wallarm_api.db`.

### http_inspector.wallarm_dir

Düğüm yapılandırma dosyaları için dizin yolunu belirtir. Genellikle, bu parametreyi değiştirmenize gerek yoktur. Yardıma ihtiyaç duyarsanız, lütfen [Wallarm support team](mailto:support@wallarm.com) ile iletişime geçin.

Varsayılan: `/opt/wallarm/etc/wallarm`.

### http_inspector.shm_dir

HTTP analizörünün paylaşılan dizini. Genellikle, bu parametreyi değiştirmenize gerek yoktur.

Varsayılan: `/tmp`.

### tarantool_exporter.address

Wallarm'in istek işleme sürecinde istatistiksel istek analizini yürüten postanalytics servisi için adresi ayarlar. Genellikle, bu parametreyi değiştirmenize gerek yoktur.

Varsayılan: `127.0.0.1:3313`.

### tarantool_exporter.enabled

Postanalytics servisinin etkin olup olmadığını kontrol eder. Wallarm düğümü postanalytics servisi olmadan çalışmadığından, bu parametre `true` olmalıdır.

Varsayılan: `true`.

### log.proton_log_mask

Dahili trafik kaydı için maske ayarını yapar. Genellikle, bu parametreyi değiştirmenize gerek yoktur.

Varsayılan: `info@*`.

### metrics.enabled

[Prometheus metriklerinin](../../../admin-en/configure-statistics-service.md#usage) etkin olup olmadığını kontrol eder. Wallarm düğümü, bu parametre `true` olmadıkça düzgün çalışmaz.

Varsayılan: `true`.

### metrics.listen_address

Prometheus metriklerinin sunulacağı adres ve portu ayarlar. Bu metriklere erişmek için `/metrics` uç noktasını kullanın.

Varsayılan: `:9000` (port 9000 üzerindeki tüm ağ arabirimleri).

### metrics.legacy_status.enabled

[`/wallarm-status`](../../../admin-en/configure-statistics-service.md#usage) metrik servisi etkin olup olmadığını kontrol eder. Wallarm düğümü, bu parametre `true` olmadıkça düzgün çalışmaz.

Varsayılan: `true`.

### metrics.legacy_status.listen_address

JSON formatında `/wallarm-status` metriklerinin sunulacağı adres ve portu ayarlar. Bu metriklere erişmek için `/wallarm-status` uç noktasını kullanın.

Varsayılan: `127.0.0.1:10246`.

### health_check.enabled

Sağlık kontrolü uç noktalarının etkin olup olmadığını kontrol eder.

Varsayılan: `true`.

### health_check.listen_address

`/live` ve `/ready` sağlık kontrolü uç noktaları için adres ve portu ayarlar.

Varsayılan: `:8080` (port 8080 üzerindeki tüm ağ arabirimleri).