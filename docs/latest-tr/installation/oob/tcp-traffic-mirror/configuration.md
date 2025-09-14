# TCP Traffic Mirror Analizinin Yapılandırılması

TCP Traffic Mirror analizi için Wallarm node’unu dağıtırken oluşturduğunuz yapılandırma dosyasında ([dağıtım talimatlarında](deployment.md) belirtildiği gibi `wallarm-node-conf.yaml`), dağıtılan çözümü ince ayarlarla yapılandırabilirsiniz.

## Temel ayarlar

```yaml
version: 4

mode: tcp-capture

goreplay:
  filter: <your network interface and port, e.g. 'lo:' or 'enp7s0:'>
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

### mode (zorunlu)

Wallarm node’unun çalışma modu. TCP Traffic Mirror analizi için `tcp-capture` olmalıdır.

### goreplay.filter

Trafiğin yakalanacağı ağ arayüzünü belirtir. Bir değer belirtilmezse, instance üzerindeki tüm ağ arayüzlerinden trafiği yakalar.

Değer, ağ arayüzü ve portun iki nokta (`:`) ile ayrılmış hali olmalıdır, örn.:

=== "Arayüz:Port"
    ```yaml
    version: 4

    goreplay:
      filter: 'eth0:80'
    ```

    Birden çok arayüz ve porttan trafik yakalamak için `goreplay.filter` ayarını `goreplay.extra_args` ile birlikte kullanın, örn.:

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

    `filter`, GoReplay’i `-input-raw` argümanı ile ayarlar; `extra_args` ise ek `-input-raw` girdileri belirtmenizi sağlar.
=== "Arayüz üzerindeki tüm portlar"
    ```yaml
    version: 4

    goreplay:
      filter: 'eth0:'
    ```
=== "Tüm arayüzlerde belirli bir port"
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

Ana makinede kullanılabilir ağ arayüzlerini kontrol etmek için:

```
ip addr show
```

### goreplay.extra_args

GoReplay’e iletilecek [ek argümanları](https://github.com/buger/goreplay/blob/master/docs/Request-filtering.md) belirtmenizi sağlar.

* Genellikle, VLAN, VXLAN gibi analiz edilmesi gereken yansıtılmış trafik türlerini tanımlamak için kullanırsınız. Örneğin:

    === "VLAN ile kapsüllenmiş yansıtılmış trafik"
        ```yaml
        version: 4

        goreplay:
          extra_args:
            - -input-raw-vlan
            - -input-raw-vlan-vid
            # VLAN’ınızın VID değeri, örn.:
            # - 42
        ```
    === "VXLAN ile kapsüllenmiş yansıtılmış trafik (AWS'de yaygın)"
        ```yaml
        version: 4

        goreplay:
          extra_args:
            - -input-raw-engine
            - vxlan
            # Özelleştirilmiş VXLAN UDP portu, örn.:
            # - -input-raw-vxlan-port 
            # - 4789
            # Belirli VNI (varsayılan olarak, tüm VNI’ler yakalanır), örn.:
            # - -input-raw-vxlan-vni
            # - 1
        ```

    Yansıtılan trafik VLAN veya VXLAN gibi ek protokollerle kapsüllenmemişse, `extra_args` yapılandırmasını atlayabilirsiniz. Kapsüllenmemiş trafik varsayılan olarak ayrıştırılır.
* Ek arayüzler ve portları yakalamak için `filter` ayarını `extra_args` ile genişletebilirsiniz:

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

    `filter`, GoReplay’i `-input-raw` argümanı ile ayarlar; `extra_args` ise ek `-input-raw` girdileri belirtmenizi sağlar.

### route_config

Belirli rotalar için ayarları belirttiğiniz yapılandırma bölümü.

### route_config.wallarm_application

[Wallarm uygulama ID’si](../../../user-guides/settings/applications.md). Bu değer, belirli rotalar için geçersiz kılınabilir.

### route_config.routes

Rota bazlı Wallarm yapılandırmasını ayarlar. Wallarm modu ve uygulama ID’lerini içerir. Örnek yapılandırma:

```yaml
version: 4

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

Rota host’unu belirtir.

Bu parametre joker karakter eşleştirmesini destekler:

* `*` herhangi bir ayırıcı olmayan karakter dizisini eşler
* `?` herhangi bir tek ayırıcı olmayan karakteri eşler
* `'[' [ '^' ] { character-range } ']'`

??? info "Joker karakter eşleştirme sözdizimi ayrıntıları"
    ```
    // Desen sözdizimi şöyledir:
    //
    //	pattern:
    //		{ term }
    //	term:
    //		'*'         herhangi bir non-Separator karakter dizisini eşler
    //		'?'         herhangi bir tek non-Separator karakteri eşler
    //		'[' [ '^' ] { character-range } ']'
    //		            karakter sınıfı (boş olmamalıdır)
    //		c           c karakterini eşler (c != '*', '?', '\\', '[')
    //		'\\' c      c karakterini eşler
    //
    //	character-range:
    //		c           c karakterini eşler (c != '\\', '-', ']')
    //		'\\' c      c karakterini eşler
    //		lo '-' hi   lo <= c <= hi için c karakterini eşler
    //
    // Eşleşme, kalıbın adın tamamını eşlemesini gerektirir, yalnızca bir alt dizeyi değil.
    ```

Örneğin:

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
        #  |   |   |    |    ^ önek (regex’lerden daha düşük öncelik)
        #  |   |   |    ^ önek (regex’lerden daha yüksek öncelik)
        #  |   |   ^re büyük/küçük harf duyarsız
        #  |   ^re büyük/küçük harf duyarlı
        #  ^tam eşleşme
```

Örneğin, yalnızca tam rotayı eşlemek için:

```yaml
- route: =/api/login
```

Düzenli ifadeyle rotaları eşlemek için:

```yaml
- route: ~/user/[0-9]+/login.*
```

#### wallarm_application

[Wallarm uygulama ID’sini](../../../user-guides/settings/applications.md) ayarlar. Belirli uç noktalar için `route_config.wallarm_application` değerini geçersiz kılar.

#### wallarm_mode

Trafik [filtrasyon modu](../../../admin-en/configure-wallarm-mode.md): `monitoring` veya `off`. OOB modunda, trafiğin engellenmesi desteklenmez.

Varsayılan: `monitoring`.

### http_inspector.real_ip_header

Varsayılan olarak, Wallarm kaynak IP adresini ağ paketinin IP başlıklarından okur. Ancak proxy’ler ve yük dengeleyiciler bunu kendi IP’leriyle değiştirebilir.

Gerçek istemci IP’sini korumak için bu aracı katmanlar genellikle bir HTTP başlığı (`X-Real-IP`, `X-Forwarded-For` gibi) ekler. `real_ip_header` parametresi, Wallarm’a orijinal istemci IP’sini çıkarmak için hangi başlığın kullanılacağını söyler.

### log.pretty

Hata ve erişim günlük biçimini kontrol eder. İnsan tarafından okunabilir günlükler için `true`, JSON günlükler için `false` olarak ayarlayın.

Varsayılan: `true`.

### log.level

Günlük seviyesi: `debug`, `info`, `warn`, `error`, `fatal` olabilir.

Varsayılan: `info`.

### log.log_file

Hata günlüğü çıktısının hedefini belirtir. Seçenekler `stdout`, `stderr` veya bir günlük dosyasına giden yoldur.

Varsayılan: `stderr`. Ancak, node `stderr` çıktısını `/opt/wallarm/var/log/wallarm/go-node.log` dosyasına yönlendirir.

### log.access_log (sürüm 0.5.1 ve üzeri)

#### enabled

Erişim günlüklerinin toplanıp toplanmayacağını kontrol eder.

Varsayılan: `true`.

#### verbose

Erişim günlüğü çıktısında her istek hakkında ayrıntılı bilgilerin yer alıp almayacağını kontrol eder.

Varsayılan: `true`.

#### log_file

Erişim günlüğü çıktısının hedefini belirtir. Seçenekler `stdout`, `stderr` veya bir günlük dosyasına giden yoldur.

Varsayılan: `stderr`. Ancak, node `stderr` çıktısını `/opt/wallarm/var/log/wallarm/go-node.log` dosyasına yönlendirir.

Ayarlanmazsa, [`log.log_file`](#loglog_file) ayarı kullanılır.

## Gelişmiş ayarlar

```yaml
version: 4

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

health_check:
  enabled: true
  listen_address: :8080
```

### goreplay.path

GoReplay ikili dosyasının yolu. Genellikle bu parametreyi değiştirmeniz gerekmez.

Varsayılan: `/opt/wallarm/usr/bin/gor`.

### middleware.parse_responses

Yansıtılan yanıtların ayrıştırılıp ayrıştırılmayacağını kontrol eder. Bu, [zafiyet tespiti](../../../about-wallarm/detecting-vulnerabilities.md) ve [API keşfi](../../../api-discovery/overview.md) gibi yanıt verilerine dayanan Wallarm özelliklerini etkinleştirir.

Varsayılan olarak, `true`.

Yanıt yansıtmasının, Wallarm node’unun bulunduğu hedef instance’a yapılacak şekilde ortamınızda yapılandırıldığından emin olun.

### middleware.response_timeout

Bir yanıt için beklenecek azami süreyi belirtir. Belirtilen süre içinde yanıt alınmazsa, Wallarm süreçleri ilgili yanıtı beklemeyi durdurur.

Varsayılan: `5s`.

### http_inspector.workers

Wallarm worker sayısı.

Varsayılan: `auto`, yani worker sayısı CPU çekirdeği sayısına ayarlanır.

### http_inspector.libdetection_enabled

[libdetection](../../../about-wallarm/protecting-against-attacks.md#basic-set-of-detectors) kütüphanesi kullanılarak SQL Injection saldırılarının ek olarak doğrulanıp doğrulanmayacağını belirtir.

Varsayılan: `true`.

### http_inspector.api_firewall_enabled

[API Spesifikasyon Zorlaması](../../../api-specification-enforcement/overview.md) özelliğinin etkin olup olmadığını kontrol eder. Lütfen bu özelliğin etkinleştirilmesinin, gerekli aboneliğin ve Wallarm Console UI üzerinden yapılan yapılandırmanın yerine geçmediğini unutmayın.

Varsayılan: `true`.

### http_inspector.api_firewall_database

[API Spesifikasyon Zorlaması](../../../api-specification-enforcement/overview.md) için yüklediğiniz API spesifikasyonlarını içeren veritabanının yolunu belirtir. Bu veritabanı Wallarm Cloud ile senkronize edilir.

Genellikle bu parametreyi değiştirmeniz gerekmez.

Varsayılan: `/opt/wallarm/var/lib/wallarm-api/2/wallarm_api.db`.

### http_inspector.wallarm_dir

Node yapılandırma dosyaları için dizin yolunu belirtir. Genellikle bu parametreyi değiştirmeniz gerekmez. Yardıma ihtiyacınız olursa lütfen [Wallarm destek ekibi](mailto:support@wallarm.com) ile iletişime geçin.

Varsayılan: `/opt/wallarm/etc/wallarm`.

### http_inspector.shm_dir

HTTP analizörü paylaşımlı dizini. Genellikle bu parametreyi değiştirmeniz gerekmez.

Varsayılan: `/tmp`.

### postanalytics_exporter.address

Wallarm’ın istek işleme akışında istatistiksel istek analizini gerçekleştiren postanalytics servisinin adresini ayarlar. Genellikle bu parametreyi değiştirmeniz gerekmez.

Varsayılan: `127.0.0.1:3313`.

Node 0.12.x ve öncesinde, bu parametre [`tarantool_exporter.address` olarak ayarlanmıştır](../../../updating-migrating/what-is-new.md#replacing-tarantool-with-wstore-for-postanalytics). Yükseltme sırasında yeniden adlandırma gereklidir.

### postanalytics_exporter.enabled

Postanalytics servisinin etkin olup olmadığını kontrol eder. Bu parametrenin `true` olarak ayarlanması gerekir; aksi halde Wallarm node’u çalışmaz.

Varsayılan: `true`.

Node 0.12.x ve öncesinde, bu parametre [`tarantool_exporter.enabled` olarak ayarlanmıştır](../../../updating-migrating/what-is-new.md#replacing-tarantool-with-wstore-for-postanalytics). Yükseltme sırasında yeniden adlandırma gereklidir.

### log.proton_log_mask

Dahili trafik günlüğe kaydı için maske. Genellikle bu parametreyi değiştirmeniz gerekmez.

Varsayılan: `info@*`.

### metrics.enabled

[Prometheus metriklerinin](../../../admin-en/configure-statistics-service.md#usage) etkin olup olmadığını kontrol eder. Bu parametrenin `true` olarak ayarlanması gerekir; aksi halde Wallarm node’u düzgün çalışmaz.

Varsayılan: `true`.

### metrics.listen_address

Prometheus metriklerinin yayımlanacağı adres ve portu ayarlar. Bu metriklere erişmek için `/metrics` uç noktasını kullanın.

Varsayılan: `:9000` (9000 numaralı port üzerindeki tüm ağ arayüzleri).

### metrics.legacy_status.enabled

[`/wallarm-status`](../../../admin-en/configure-statistics-service.md#usage) metrik servisinin etkin olup olmadığını kontrol eder. Bu parametrenin `true` olarak ayarlanması gerekir; aksi halde Wallarm node’u düzgün çalışmaz.

Varsayılan: `true`.

### metrics.legacy_status.listen_address

JSON formatında `/wallarm-status` metriklerinin yayımlanacağı adres ve portu ayarlar. Bu metriklere erişmek için `/wallarm-status` uç noktasını kullanın.

Varsayılan: `127.0.0.1:10246`.

### health_check.enabled

Sağlık denetimi uç noktalarının etkin olup olmadığını kontrol eder.

Varsayılan: `true`.

### health_check.listen_address

`/live` ve `/ready` sağlık denetimi uç noktaları için adres ve portu ayarlar.

Varsayılan: `:8080` (8080 numaralı port üzerindeki tüm ağ arayüzleri).