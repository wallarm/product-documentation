# Native Node Artifact Versions and Changelog

Bu belge, çeşitli form faktörlerinde mevcut olan [versions](../versioning-policy.md) listesini sunar [Native Wallarm Node](../../installation/nginx-native-node-internals.md#native-node) 0.x için, sürümleri takip etmenize ve yükseltmeleri planlamanıza yardımcı olur.

## All-in-one installer

Native Node için all-in-one installer, [TCP traffic mirror analysis](../../installation/oob/tcp-traffic-mirror/deployment.md) ve yerel barındırılan node dağıtımı için kullanılır; [MuleSoft](../../installation/connectors/mulesoft.md), [CloudFront](../../installation/connectors/aws-lambda.md), [Cloudflare](../../installation/connectors/cloudflare.md), [Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md) ve [Fastly](../../installation/connectors/fastly.md) connector'ları ile birlikte.

All-in-one installer güncellemelerinin geçmişi, x86_64 ve ARM64 (beta) sürümleri için aynı şekilde uygulanır.

[How to upgrade](all-in-one.md)

### 0.11.0 (2025-01-31)

* Sadece [API Discovery](../../api-discovery/overview.md) modunu etkinleştiren [`WALLARM_APID_ONLY` environment variable](../../installation/native-node/all-in-one.md#installer-launch-options) desteği eklendi

    Bu modda, saldırılar yerel olarak engellenir (eğer [etkinleştirilmişse](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)) fakat Wallarm Cloud'a aktarılmaz, [API Discovery](../../api-discovery/overview.md) ise tam işlevselliğini korur. Bu mod çoğu ortamda nadiren gereklidir, genellikle bu modu kullanmaya gerek yoktur.
* GoReplay ile Native Node'un etkileşimi iyileştirildi, bu da aşağıdaki yapılandırma değişikliklerine yol açtı:

    ``` diff
    -version: 2
    +version: 3

    -middleware:
    +goreplay:
      parse_responses: true
      response_timeout: 5s
      url_normalize: true
    ```

    Yükseltme sırasında, `version` değerini güncelleyin ve başlangıç yapılandırma dosyasında açıkça belirtilmişse `middleware` bölümünü `goreplay` ile değiştirin.
* `tcp-capture` modundaki küçük bir HTTP ayrıştırma hatası düzeltildi

### 0.10.1 (2025-01-02)

* [API Discovery](../../api-discovery/sbf.md) ve [API Sessions](../../api-sessions/exploring.md#sensitive-business-flows) için hassas iş akışları desteği eklendi
* [Fastly](../../installation/connectors/fastly.md) connector desteği eklendi
* Mesh başlangıcında olası istek kaybı düzeltildi
* [CVE-2024-45337](https://scout.docker.com/vulnerabilities/id/CVE-2024-45337) ve [CVE-2024-45338](https://scout.docker.com/vulnerabilities/id/CVE-2024-45338) güvenlik açıkları giderildi
* Bazı isteklerin başarısız işlendiği, API Sessions, Credential Stuffing ve API Abuse Prevention'ı potansiyel olarak etkileyen bir sorun düzeltildi

### 0.10.0 (2024-12-19)

* `tcp-capture` modunda rota yapılandırmalarının seçilmesinden ve libproton ile verilerin analizinden önce URL normalleştirme eklendi

    Bu, [`middleware.url_normalize`](../../installation/native-node/all-in-one-conf.md#goreplayurl_normalize) parametresi ile kontrol edilir (varsayılan olarak `true`).
* İstek işleme süresini yerel olarak kontrol etmek için [`http_inspector.wallarm_process_time_limit`](../../installation/native-node/all-in-one-conf.md#http_inspectorwallarm_process_time_limit) parametresi tanıtıldı

    Varsayılan, Wallarm Console ayarları tarafından ezilmediği sürece `1s`'dir.
* Prometheus metrik güncellemeleri (port :9000'da mevcut):

    * Statik sıfır değerlerine sahip gereksiz metrikler kaldırıldı.
    * `http_inspector_requests_processed` ve `http_inspector_threats_found` metrikleri, `source` etiket değerlerinde `anything` belirtilmesine olanak tanıyacak şekilde geliştirildi.
    * İstek ve saldırı sayımlarını izlemek için `http_inspector_adjusted_counters` metrik eklendi.

### 0.9.1 (2024-12-10)

* Küçük hata düzeltmeleri

### 0.9.0 (2024-12-04)

* JSON formatındaki `/wallarm-status` metrikleri için varsayılan uç nokta, `127.0.0.1:10246` olarak değiştirildi (bu, `metrics.legacy_status.listen_address` parametresi değeridir). Bu eski hizmet, Node işlevselliği için kritik olup doğrudan etkileşim gerektirmez.

### 0.8.3 (2024-11-14)

* Mulesoft connector 3.0.x desteği eklendi

### 0.8.2 (2024-11-11)

* `wallarm-status` hizmeti işlemlerinde bazı hatalar düzeltildi

### 0.8.1 (2024-11-06)

* 0.8.0'da tanıtılan `request_id` formatındaki gerileme düzeltildi

### 0.8.0 (2024-11-06)

* [Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md) connector desteği eklendi
* [API Sessions](../../api-sessions/overview.md) desteği eklendi
* İstek işleme süresini sınırlamada [iyileştirme](../what-is-new.md#new-in-limiting-request-processing-time) yapıldı
* Aşağıdaki parametreler için varsayılan değerler değiştirildi:

    * Artık [`connector.blocking`](../../installation/native-node/all-in-one-conf.md#connectorblocking) parametresinin varsayılan değeri `true` olup, dağıtım sırasında Native Node'un manuel yapılandırmaya gerek kalmadan gelen istekleri engelleme yeteneği etkinleştirilmiştir.
    * Trafik filtrasyon modunu belirleyen [`route_config.wallarm_mode`](../../installation/native-node/all-in-one-conf.md#route_configwallarm_mode) parametresinin varsayılan değeri `monitoring` olarak ayarlanmış, böylece ilk dağıtımlar için optimal bir yapılandırma sağlanmıştır.
* Rota yapılandırmalarının seçilmesinden ve libproton ile verilerin analizi öncesinde URL normalleştirme eklendi (varsayılan olarak `true` olan [`controller.url_normalize`](../../installation/native-node/all-in-one-conf.md#connectorurl_normalize) parametresi ile kontrol edilir)
* Node kaydı sırasında bellek kullanımı azaltıldı
* Bazı hata düzeltmeleri yapıldı

### 0.7.0 (2024-10-16)

* İşlem öncesinde bazı dahili servis connector başlıklarının kaldırılmadığına dair sorun düzeltildi
* `connector-server` modunda mesh özelliği için destek eklendi, bu da birden fazla node kopyası arasında tutarlı istek/yanıt yönlendirmesini etkinleştirir

    Bu, mesh işlevselliğini yapılandırmak için [`connector.mesh`](../../installation/native-node/all-in-one-conf.md#connectormesh) altındaki yeni yapılandırma parametrelerini tanıtır.

### 0.6.0 (2024-10-10)

* [API Discovery](../../api-discovery/setup.md#customizing-sensitive-data-detection) kapsamında hassas veri algılamayı kişiselleştirme desteği eklendi
* [libproton](../../about-wallarm/protecting-against-attacks.md#library-libproton) içindeki yinelenen yanıt başlıklarındaki bellek sızıntısı düzeltildi
* [IP lists](../../user-guides/ip-lists/overview.md) içerisinde yer almayan, ancak [bilinen kaynak](../../user-guides/ip-lists/overview.md#select-object) ile ilişkili IP adreslerine ilişkin bellek sızıntısı giderildi
* Artefakt isimlendirmesi "next" den "native"e güncellendi
    
    `https://meganode.wallarm.com/next/aionext-<VERSION>.<ARCH>.sh` → `https://meganode.wallarm.com/native/aio-native-<VERSION>.<ARCH>.sh`

### 0.5.2 (2024-09-17)

* WAAP + API Security aboneliği etkinleştirilmediğinde oluşan kurulum hatası düzeltildi
* Saldırı aktarımındaki gecikmeler giderildi
* C bellek ayırıcı ile ilgili performans yavaşlamasına yol açan sorun giderildi

### 0.5.1 (2024-09-16)

* [`log.access_log` parametreleri](../../installation/native-node/all-in-one-conf.md#logaccess_logenabled) aracılığıyla yapılandırılabilir erişim günlük çıktısı eklendi

### 0.5.0 (2024-09-11)

* Küçük teknik iyileştirmeler ve optimizasyonlar yapıldı

### 0.4.3 (2024-09-05)

* Yazım hatası nedeniyle veri kaynağı mesajlarının yaklaşık %0.1'inin sessizce kaybolmasına neden olan sorun düzeltildi

### 0.4.1 (2024-08-27)

* [`route_config.routes.host`](../../installation/native-node/all-in-one-conf.md#host) yapılandırma parametresinde joker eşleştirme desteği eklendi

### 0.4.0 (2024-08-22)

* [İlk sürüm](../../installation/oob/tcp-traffic-mirror/deployment.md)

## Helm chart

Native Node için Helm chart, yerel barındırılan node dağıtımları için [MuleSoft](../../installation/connectors/mulesoft.md), [CloudFront](../../installation/connectors/aws-lambda.md), [Cloudflare](../../installation/connectors/cloudflare.md), [Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md), [Fastly](../../installation/connectors/fastly.md), [Kong API Gateway](../../installation/connectors/kong-api-gateway.md) ve [Istio](../../installation/connectors/istio.md) connector'ları ile birlikte kullanılır.

[How to upgrade](helm-chart.md)

### 0.11.0 (2025-01-31)

* Bazı hatalar düzeltildi

### 0.10.1 (2025-01-02)

* [API Discovery](../../api-discovery/sbf.md) ve [API Sessions](../../api-sessions/exploring.md#sensitive-business-flows) için hassas iş akışları desteği eklendi
* [Fastly](../../installation/connectors/fastly.md) connector desteği eklendi
* Mesh başlangıcında olası istek kaybı düzeltildi
* [CVE-2024-45337](https://scout.docker.com/vulnerabilities/id/CVE-2024-45337) ve [CVE-2024-45338](https://scout.docker.com/vulnerabilities/id/CVE-2024-45338) güvenlik açıkları giderildi
* Bazı isteklerin başarısız işlendiği, API Sessions, Credential Stuffing ve API Abuse Prevention'ı potansiyel olarak etkileyen sorun giderildi

### 0.10.0 (2024-12-19)

* Artık daha ayrıntılı günlük yapılandırma seçenekleri [`config.connector.log`](../../installation/native-node/helm-chart-conf.md#configconnectorlog) bölümünde tanıtıldı, tek `config.connector.log_level` parametresi yerine
* Varsayılan günlük seviyesi artık `info` (önceden `debug` idi)

### 0.9.1 (2024-12-10)

* Küçük hata düzeltmeleri

### 0.9.0 (2024-12-04)

* Tüm toplama kopyaları arasında tutarlı trafik dağılımı için bazı düzeltmeler yapıldı.
* JSON formatındaki `/wallarm-status` metrikleri için varsayılan uç nokta `127.0.0.1:10246` olarak değiştirildi (bu, `metrics.legacy_status.listen_address` parametresinin değeridir). Bu eski hizmet, Node işlevselliği için kritik olup doğrudan etkileşim gerektirmez.
* Çeşitli dağıtım koşulları altında güvenilirliği artırmak için küçük düzeltmeler yapıldı.

### 0.8.3 (2024-11-14)

* Mulesoft connector v3.0.x desteği eklendi

### 0.8.2 (2024-11-11)

* `wallarm-status` hizmeti işlemlerinde bazı hatalar düzeltildi

### 0.8.1 (2024-11-07)

* [Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md) connector desteği eklendi
* [API Sessions](../../api-sessions/overview.md) desteği eklendi
* İstek işleme süresini sınırlamada [iyileştirme](../what-is-new.md#new-in-limiting-request-processing-time) yapıldı
* Aşağıdaki parametrelerin varsayılan değerleri değiştirildi:

    * Artık [`connector.blocking`](../../installation/native-node/all-in-one-conf.md#connectorblocking) parametresinin varsayılan değeri `true` olup, dağıtım sırasında Native Node'un manuel yapılandırmaya gerek kalmadan gelen istekleri engelleme yeteneği etkinleştirilmiştir.
    * Trafik filtrasyon modunu belirleyen [`route_config.wallarm_mode`](../../installation/native-node/all-in-one-conf.md#route_configwallarm_mode) parametresinin varsayılan değeri `monitoring` olarak ayarlanmış, böylece ilk dağıtımlar için optimal bir yapılandırma sağlanmıştır.
* Rota yapılandırmalarının seçilmesinden ve libproton ile verilerin analizi öncesinde URL normalleştirme eklendi (varsayılan olarak `true` olan [`controller.url_normalize`](../../installation/native-node/all-in-one-conf.md#connectorurl_normalize) parametresi ile kontrol edilir)
* Node kaydı sırasında bellek kullanımı azaltıldı
* Bazı hata düzeltmeleri yapıldı

### 0.7.0 (2024-10-17)

* İşlem öncesinde bazı dahili servis connector başlıklarının kaldırılmadığına dair sorun düzeltildi
* [API Discovery](../../api-discovery/setup.md#customizing-sensitive-data-detection) kapsamında hassas veri algılamayı kişiselleştirme desteği eklendi
* [libproton](../../about-wallarm/protecting-against-attacks.md#library-libproton) içindeki yinelenen yanıt başlıklarında bellek sızıntısı düzeltildi
* [IP lists](../../user-guides/ip-lists/overview.md) içerisinde yer almayan, ancak [bilinen kaynak](../../user-guides/ip-lists/overview.md#select-object) ile ilişkili IP adreslerine ilişkin bellek sızıntısı giderildi
* Artefakt isimlendirmesi "next"ten "native"e güncellendi
    
    `wallarm/wallarm-node-next` → `wallarm/wallarm-node-native`
* Wallarm Lua eklentisini aktive etmek için kullanılan `KongClusterPlugin` Kubernetes kaynağındaki `config.wallarm_node_address` parametresi değeri güncellendi:

    `http://next-processing.wallarm-node.svc.cluster.local:5000` → `http://native-processing.wallarm-node.svc.cluster.local:5000`

### 0.5.3 (2024-10-01)

* İlk sürüm

## Docker image

Native Node için Docker image, yerel barındırılan node dağıtımı için [MuleSoft](../../installation/connectors/mulesoft.md), [CloudFront](../../installation/connectors/aws-lambda.md), [Cloudflare](../../installation/connectors/cloudflare.md), [Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md) ve [Fastly](../../installation/connectors/fastly.md) connector'ları ile birlikte kullanılır.

[How to upgrade](docker-image.md)

### 0.11.0 (2025-01-31)

* Sadece [API Discovery](../../api-discovery/overview.md) modunu etkinleştiren [`WALLARM_APID_ONLY` environment variable](../../installation/native-node/docker-image.md#4-run-the-docker-container) desteği eklendi

    Bu modda, saldırılar yerel olarak engellenir (eğer [etkinleştirilmişse](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)) fakat Wallarm Cloud'a aktarılmaz, [API Discovery](../../api-discovery/overview.md) ise tam işlevselliğini korur. Bu mod çoğu ortamda nadiren gereklidir, genellikle bu modu kullanmaya gerek yoktur.

### 0.10.1 (2025-01-02)

* [API Discovery](../../api-discovery/sbf.md) ve [API Sessions](../../api-sessions/exploring.md#sensitive-business-flows) için hassas iş akışları desteği eklendi
* [Fastly](../../installation/connectors/fastly.md) connector desteği eklendi
* Mesh başlangıcında olası istek kaybı düzeltildi
* [CVE-2024-45337](https://scout.docker.com/vulnerabilities/id/CVE-2024-45337) ve [CVE-2024-45338](https://scout.docker.com/vulnerabilities/id/CVE-2024-45338) güvenlik açıkları giderildi
* Bazı isteklerin başarısız işlendiği, API Sessions, Credential Stuffing ve API Abuse Prevention'ı potansiyel olarak etkileyen sorun giderildi

### 0.10.0 (2024-12-19)

* Kritik [CVE-2024-45337](https://scout.docker.com/vulnerabilities/id/CVE-2024-45337) güvenlik açığı giderildi ve birkaç küçük güvenlik açığı düzeltildi
* `tcp-capture` modunda rota yapılandırmalarının seçilmesinden ve libproton ile verilerin analizinden önce URL normalleştirme eklendi

    Bu, [`middleware.url_normalize`](../../installation/native-node/all-in-one-conf.md#goreplayurl_normalize) parametresi ile kontrol edilir (varsayılan olarak `true`).
* İstek işleme süresini yerel olarak kontrol etmek için [`http_inspector.wallarm_process_time_limit`](../../installation/native-node/all-in-one-conf.md#http_inspectorwallarm_process_time_limit) parametresi tanıtıldı

    Varsayılan, Wallarm Console ayarları tarafından ezilmediği sürece `1s`'dir.
* Prometheus metrik güncellemeleri (port :9000'da mevcut):

    * Statik sıfır değerlerine sahip gereksiz metrikler kaldırıldı.
    * `http_inspector_requests_processed` ve `http_inspector_threats_found` metrikleri, `source` etiket değerlerinde `anything` belirtilmesine olanak tanıyacak şekilde geliştirildi.
    * İstek ve saldırı sayımlarını izlemek için `http_inspector_adjusted_counters` metrik eklendi.

### 0.9.1 (2024-12-10)

* Küçük hata düzeltmeleri

### 0.9.0 (2024-12-04)

* Tüm toplama kopyaları arasında tutarlı trafik dağılımı için bazı düzeltmeler yapıldı.
* JSON formatındaki `/wallarm-status` metrikleri için varsayılan uç nokta `127.0.0.1:10246` olarak değiştirildi (bu, `metrics.legacy_status.listen_address` parametresinin değeridir). Bu eski hizmet, Node işlevselliği için kritik olup doğrudan etkileşim gerektirmez.
* Çeşitli dağıtım koşulları altında güvenilirliği artırmak için küçük düzeltmeler yapıldı.

### 0.8.3 (2024-11-14)

* Mulesoft connector v3.0.x desteği eklendi

### 0.8.2 (2024-11-11)

* `wallarm-status` hizmeti işlemlerinde bazı hatalar düzeltildi

### 0.8.1 (2024-11-06)

* [Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md) connector desteği eklendi
* [API Sessions](../../api-sessions/overview.md) desteği eklendi
* İstek işleme süresini sınırlamada [iyileştirme](../what-is-new.md#new-in-limiting-request-processing-time) yapıldı
* Aşağıdaki parametrelerin varsayılan değerleri değiştirildi:

    * Artık [`connector.blocking`](../../installation/native-node/all-in-one-conf.md#connectorblocking) parametresinin varsayılan değeri `true` olup, dağıtım sırasında Native Node'un manuel yapılandırmaya gerek kalmadan gelen istekleri engelleme yeteneği etkinleştirilmiştir.
    * Trafik filtrasyon modunu belirleyen [`route_config.wallarm_mode`](../../installation/native-node/all-in-one-conf.md#route_configwallarm_mode) parametresinin varsayılan değeri `monitoring` olarak ayarlanmış, böylece ilk dağıtımlar için optimal bir yapılandırma sağlanmıştır.
* Rota yapılandırmalarının seçilmesinden ve libproton ile verilerin analizi öncesinde URL normalleştirme eklendi (varsayılan olarak `true` olan [`controller.url_normalize`](../../installation/native-node/all-in-one-conf.md#connectorurl_normalize) parametresi ile kontrol edilir)
* Node kaydı sırasında bellek kullanımı azaltıldı
* Bazı hata düzeltmeleri yapıldı

### 0.7.0 (2024-10-16)

* İşlem öncesinde bazı dahili servis connector başlıklarının kaldırılmadığına dair sorun düzeltildi
* [API Discovery](../../api-discovery/setup.md#customizing-sensitive-data-detection) kapsamında hassas veri algılamayı kişiselleştirme desteği eklendi
* [libproton](../../about-wallarm/protecting-against-attacks.md#library-libproton) içindeki yinelenen yanıt başlıklarında bellek sızıntısı düzeltildi
* [IP lists](../../user-guides/ip-lists/overview.md) içerisinde yer almayan, ancak [bilinen kaynak](../../user-guides/ip-lists/overview.md#select-object) ile ilişkili IP adreslerine ilişkin bellek sızıntısı giderildi
* Artefakt isimlendirmesi "next"ten "native"e güncellendi
    
    `wallarm/wallarm-node-next` → `wallarm/wallarm-node-native`
* Wallarm Lua eklentisini aktive etmek için kullanılan `KongClusterPlugin` Kubernetes kaynağındaki `config.wallarm_node_address` parametresi değeri güncellendi:

    `http://next-processing.wallarm-node.svc.cluster.local:5000` → `http://native-processing.wallarm-node.svc.cluster.local:5000`

### 0.5.3 (2024-10-01)

* İlk sürüm

