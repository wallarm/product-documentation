# Native Node Yapı Artifakt Sürümleri ve Değişiklik Günlüğü

Bu belge, çeşitli dağıtım biçimlerindeki [sürümleri](../versioning-policy.md) 0.14.x+ [Native Wallarm Node](../../installation/nginx-native-node-internals.md#native-node) için listeler; sürümleri takip etmenize ve yükseltme planlamanıza yardımcı olur.

## Hepsi-bir-arada yükleyici

Native Node için hepsi-bir-arada yükleyici, [TCP trafik aynası analizi](../../installation/oob/tcp-traffic-mirror/deployment.md) ve MuleSoft [Mule](../../installation/connectors/mulesoft.md) veya [Flex](../../installation/connectors/mulesoft-flex.md) Gateway, [Akamai](../../installation/connectors/akamai-edgeworkers.md), [CloudFront](../../installation/connectors/aws-lambda.md), [Cloudflare](../../installation/connectors/cloudflare.md), [Istio](../../installation/connectors/istio.md), [Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md), [Fastly](../../installation/connectors/fastly.md), [IBM DataPower](../../installation/connectors/ibm-api-connect.md) bağlayıcıları ile self-hosted node dağıtımı için kullanılır.

Hepsi-bir-arada yükleyici güncellemelerinin geçmişi, x86_64 ve ARM64 sürümlerine eşzamanlı olarak uygulanır.

[Nasıl yükseltilir](all-in-one.md)

### 0.17.1 (2025-08-15)

* Buluta kimlik bilgileri dışa aktarımı düzeltildi
* GraphQL ayrıştırıcı iyileştirildi
* Trafik kapasitesini artırmak için Node ile wstore arasındaki dahili kanal optimize edildi
    
    Bu, Node trafiği postanalytics’e aktarma hızından daha hızlı içeri alırken olası veri kaybını önler.
* Kaynak IP adresi olmayan serileştirilmiş isteklerin postanalytics’e aktarımının başarısız olmasına neden olan sorun giderildi
* Hata düzeltmeleri ve dahili iyileştirmeler

### 0.16.3 (2025-08-05)

* [Akamai bağlayıcısı](../../installation/connectors/akamai-edgeworkers.md) desteği eklendi
* `--preserve` bayrağı `true` olarak ayarlandığında yükseltme sırasında oluşan sessiz hata giderildi

### 0.16.1 (2025-08-01)

* Yüksek yük altında fazla girdilerin düşürülmesini kontrol etmek için [`drop_on_overload`](../../installation/native-node/all-in-one-conf.md#drop_on_overload) parametresi tanıtıldı

    Varsayılan olarak etkin (`true`).
* Yeni [Prometheus metrikleri](../../admin-en/native-node-metrics.md) eklendi:

    * Genel Native Node örneği bilgilerini içeren `wallarm_gonode_application_info`, örn.:
    
        ```bash
        wallarm_gonode_application_info{deployment_type="node-native-aio-installer",mode="connector-server",version="0.16.1"} 1
        ```
    
    * `wallarm_gonode_http_inspector_balancer_workers`
    * `wallarm_gonode_http_inspector_debug_container_len` artık `type="channel:in"` için `aggregate="sum"` içerir
    * `wallarm_gonode_http_inspector_errors_total` artık yeni bir `type="FlowTimeouts"` içerir
* Dahili `http_inspector` modülünde kararlılık iyileştirildi

### 0.16.0 (2025-07-23)

* [MuleSoft Flex Gateway bağlayıcısı](../../installation/connectors/mulesoft-flex.md) desteği eklendi
* Node’un hangi istekleri incelemesi veya atlaması gerektiğinin tanımlanmasına olanak tanıyan [`input_filters`](../../installation/native-node/all-in-one-conf.md#input_filters) yapılandırma bölümü tanıtıldı
* Bellek sızıntısı düzeltildi
* Kurallarda, URI, ad alanı ve etiket adını birleştiren [**xml_tag**](../../user-guides/rules/request-processing.md#xml) değerlerinde kullanılan ayırıcı `:` yerine `|` olarak değiştirildi
* Yasaklı kaynaklar ve Wallarm Console UI üzerinden yapılandırılan mod ile ilgili engelleme sorunu düzeltildi
* Dahili iyileştirmeler

### 0.15.1 (2025-07-08)

* Güvenilir ağları yapılandırmak ve gerçek istemci IP’si ile host başlıklarını çıkarmak için [`proxy_headers`](../../installation/native-node/all-in-one-conf.md#proxy_headers) yapılandırması tanıtıldı

    Bu, önceki sürümlerde `tcp-capture` modunda kullanılan `http_inspector.real_ip_header`’ın yerini alır.
* `go-node` ikili dosyası tarafından sunulan Prometheus metriklerinin önekini özelleştirmek için [`metrics.namespace`](../../installation/native-node/all-in-one-conf.md#metricsnamespace) yapılandırma seçeneği eklendi
* `keep-alive` bağlantı sınırlarını kontrol etmek için [`connector.per_connection_limits`](../../installation/native-node/all-in-one-conf.md#connectorper_connection_limits) eklendi
* Küçük dahili dosya yapısı değişikliği
* wstore port bağlama düzeltildi: artık `0.0.0.0` yerine `127.0.0.1`’e bağlanır
* [CVE-2025-22874](https://nvd.nist.gov/vuln/detail/CVE-2025-22874) güvenlik açığı giderildi
* [CVE-2025-47273](https://nvd.nist.gov/vuln/detail/CVE-2025-47273) güvenlik açığı giderildi

### 0.14.1 (2025-05-07)

* [**enumeration**](../../api-protection/enumeration-attack-protection.md) azaltma kontrolleri desteği eklendi
* [**DoS koruması**](../../api-protection/dos-protection.md) azaltma kontrolü desteği eklendi
* [IBM API Connect bağlayıcısı](../../installation/connectors/ibm-api-connect.md) desteği eklendi
* [CVE-2024-56406](https://nvd.nist.gov/vuln/detail/CVE-2024-56406), [CVE-2025-31115](https://nvd.nist.gov/vuln/detail/CVE-2025-31115) güvenlik açıkları giderildi
* `connector-server` modunda harici sağlık denetimi uç noktası desteği eklendi

    Bu, yeni [`connector.external_health_check`](../../installation/native-node/all-in-one-conf.md#connectorexternal_health_check) yapılandırma bölümüyle kontrol edilir.
* İstek ve yanıt gövdelerinin ara sıra bozulmasına neden olabilen tekrarlayan aralıklı bir hata düzeltildi
* `tcp-capture` modunda aşağıdaki düzeltmeler ve güncellemeler yapıldı:

    * GoReplay artık Go 1.24 ile derleniyor
    * Düzeltildi: `goreplay` işlemi çöktüğünde `go-node` işlemi artık askıda kalmıyor
    * GoReplay’de başlık ayrıştırma sırasında slice sınır aşımının neden olduğu bir çökme düzeltildi
* Wallarm Console → **Nodes** içinde Native Node sürümlerinin hatalı görüntülenmesi düzeltildi

### 0.14.0 (2025-04-16)

* Wallarm Node artık yerel postanalytics işleme için Tarantool yerine Wallarm tarafından geliştirilen bir servis olan **wstore**’u kullanıyor
* Daha önce tüm filtreleme nodelarında kurulan collectd servisi ve ilgili eklentileri kaldırıldı
    
    Metrikler artık Wallarm’ın yerleşik mekanizmalarıyla toplanıp gönderilmektedir; bu da harici araçlara bağımlılığı azaltır.

## Helm chart

Native Node için Helm chart, MuleSoft [Mule](../../installation/connectors/mulesoft.md) veya [Flex](../../installation/connectors/mulesoft-flex.md) Gateway, [Akamai](../../installation/connectors/akamai-edgeworkers.md), [CloudFront](../../installation/connectors/aws-lambda.md), [Cloudflare](../../installation/connectors/cloudflare.md), [Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md), [Fastly](../../installation/connectors/fastly.md), [IBM DataPower](../../installation/connectors/ibm-api-connect.md), [Kong API Gateway](../../installation/connectors/kong-api-gateway.md) ve [Istio](../../installation/connectors/istio.md) bağlayıcıları ile self-hosted node dağıtımları için kullanılır.

[Nasıl yükseltilir](helm-chart.md)

### 0.17.1 (2025-08-15)

* Güvenilir ağları yapılandırmak ve gerçek istemci IP’si ile host başlıklarını çıkarmak için [`proxy_headers`](../../installation/native-node/helm-chart-conf.md#configconnectorproxy_headers) yapılandırması tanıtıldı
* Buluta kimlik bilgileri dışa aktarımı düzeltildi
* GraphQL ayrıştırıcı iyileştirildi
* Trafik kapasitesini artırmak için Node ile wstore arasındaki dahili kanal optimize edildi
    
    Bu, Node trafiği postanalytics’e aktarma hızından daha hızlı içeri alırken olası veri kaybını önler.
* Kaynak IP adresi olmayan serileştirilmiş isteklerin postanalytics’e aktarımının başarısız olmasına neden olan sorun giderildi
* Hata düzeltmeleri ve dahili iyileştirmeler

### 0.16.3 (2025-08-05)

* [Akamai bağlayıcısı](../../installation/connectors/akamai-edgeworkers.md) desteği eklendi
* Hata düzeltmeleri

### 0.16.1 (2025-08-01)

* Node’un hangi istekleri incelemesi veya atlaması gerektiğinin tanımlanmasına olanak tanıyan [`input_filters`](../../installation/native-node/helm-chart-conf.md#configconnectorinput_filters) yapılandırma bölümü tanıtıldı
* Yüksek yük altında fazla girdilerin düşürülmesini kontrol etmek için [`drop_on_overload`](../../installation/native-node/helm-chart-conf.md#drop_on_overload) parametresi tanıtıldı

    Varsayılan olarak etkin (`true`).
* Yeni [Prometheus metrikleri](../../admin-en/native-node-metrics.md) eklendi:

    * Genel Native Node örneği bilgilerini içeren `wallarm_gonode_application_info`, örn.:
    
        ```bash
        wallarm_gonode_application_info{deployment_type="node-native-aio-installer",mode="connector-server",version="0.16.1"} 1
        ```
    
    * `wallarm_gonode_http_inspector_balancer_workers`
    * `wallarm_gonode_http_inspector_debug_container_len` artık `type="channel:in"` için `aggregate="sum"` içerir
    * `wallarm_gonode_http_inspector_errors_total` artık yeni bir `type="FlowTimeouts"` içerir
* [Lua eklentisine dayanan Istio için Wallarm Connector](/5.x/installation/connectors/istio/) kullanım dışı bırakıldı

    Bunun yerine [Istio için gRPC tabanlı harici işleme filtresi](../../installation/connectors/istio.md) kullanmanızı öneririz.
* Kullanım dışı bırakılan Istio bağlayıcısı için, mevcut dağıtımlarda uyumluluğu sağlamak amacıyla aşağıdaki iyileştirmeler yapıldı:

    * Mesajlar için mesh dengeleme mantığı düzeltildi
    * Tüm bağlayıcı trafiğini mesh dengeleme olmadan Node üzerinde işlemek için `disable_mesh` parametresi eklendi (varsayılan `false` - mesh dengeleme etkindir)
    * `drop_on_overload` parametresi desteği eklendi
* Dahili `http_inspector` modülünde kararlılık iyileştirildi

### 0.16.0 (2025-07-23)

* [MuleSoft Flex Gateway bağlayıcısı](../../installation/connectors/mulesoft-flex.md) desteği eklendi
* Bellek sızıntısı düzeltildi
* Kurallarda, URI, ad alanı ve etiket adını birleştiren [**xml_tag**](../../user-guides/rules/request-processing.md#xml) değerlerinde kullanılan ayırıcı `:` yerine `|` olarak değiştirildi
* Yasaklı kaynaklar ve Wallarm Console UI üzerinden yapılandırılan mod ile ilgili engelleme sorunu düzeltildi
* Dahili iyileştirmeler

### 0.15.1 (2025-07-08)

* Gelen **wstore** bağlantıları için adres ve portu özelleştirmek amacıyla [`config.aggregation.serviceAddress`](../../installation/native-node/helm-chart-conf.md#configaggregationserviceaddress) parametresi desteği eklendi
* Küçük dahili dosya yapısı değişikliği
* [CVE-2025-22874](https://nvd.nist.gov/vuln/detail/CVE-2025-22874) güvenlik açığı giderildi
* [CVE-2025-47273](https://nvd.nist.gov/vuln/detail/CVE-2025-47273) güvenlik açığı giderildi
<!-- * Added [`connector.per_connection_limits`](../../installation/native-node/all-in-one-conf.md#connectorper_connection_limits) to control `keep-alive` connection limits -->

### 0.14.1 (2025-05-07)

* [IBM API Connect bağlayıcısı](../../installation/connectors/ibm-api-connect.md) desteği eklendi
* [CVE-2025-22871](https://nvd.nist.gov/vuln/detail/CVE-2025-22871) güvenlik açığı giderildi
* Helm chart headless service içinde `clusterIP: None` işleme düzeltildi
* İstek ve yanıt gövdelerinin ara sıra bozulmasına neden olabilen tekrarlayan aralıklı bir hata düzeltildi
* Wallarm Console → **Nodes** içinde Native Node sürümlerinin hatalı görüntülenmesi düzeltildi

### 0.14.0 (2025-04-16)

* Wallarm Node artık yerel postanalytics işleme için Tarantool yerine Wallarm tarafından geliştirilen bir servis olan **wstore**’u kullanıyor
* `values.yaml` içindeki tüm `tarantool` referansları (container adları ve parametre anahtarları dahil) `wstore` olarak yeniden adlandırıldı

    Bu parametreleri yapılandırmanızda geçersiz kılıyorsanız, adlarını buna göre güncelleyin.
* Daha önce tüm filtreleme nodelarında kurulan collectd servisi ve ilgili eklentileri kaldırıldı
    
    Metrikler artık Wallarm’ın yerleşik mekanizmalarıyla toplanıp gönderilmektedir; bu da harici araçlara bağımlılığı azaltır.
* Kubernetes sistem etiketleriyle çakışmaları önlemek için `*_container_*` ile eşleşen tüm Prometheus metriklerinde `container` etiketi `type` olarak yeniden adlandırıldı

## Docker imajı

Native Node için Docker imajı, MuleSoft [Mule](../../installation/connectors/mulesoft.md) veya [Flex](../../installation/connectors/mulesoft-flex.md) Gateway, [Akamai](../../installation/connectors/akamai-edgeworkers.md), [CloudFront](../../installation/connectors/aws-lambda.md), [Cloudflare](../../installation/connectors/cloudflare.md), [Istio](../../installation/connectors/istio.md), [Broadcom Layer7 API Gateway](../../installation/connectors/layer7-api-gateway.md), [Fastly](../../installation/connectors/fastly.md), [IBM DataPower](../../installation/connectors/ibm-api-connect.md) bağlayıcıları ile self-hosted node dağıtımı için kullanılır.

[Nasıl yükseltilir](docker-image.md)

### 0.17.1 (2025-08-15)

* Buluta kimlik bilgileri dışa aktarımı düzeltildi
* GraphQL ayrıştırıcı iyileştirildi
* Trafik kapasitesini artırmak için Node ile wstore arasındaki dahili kanal optimize edildi
    
    Bu, Node trafiği postanalytics’e aktarma hızından daha hızlı içeri alırken olası veri kaybını önler.
* Kaynak IP adresi olmayan serileştirilmiş isteklerin postanalytics’e aktarımının başarısız olmasına neden olan sorun giderildi
* Hata düzeltmeleri ve dahili iyileştirmeler

### 0.16.3 (2025-08-05)

* [Akamai bağlayıcısı](../../installation/connectors/akamai-edgeworkers.md) desteği eklendi
* `--preserve` bayrağı `true` olarak ayarlandığında yükseltme sırasında oluşan sessiz hata giderildi

### 0.16.1 (2025-08-01)

* Yüksek yük altında fazla girdilerin düşürülmesini kontrol etmek için [`drop_on_overload`](../../installation/native-node/all-in-one-conf.md#drop_on_overload) parametresi tanıtıldı

    Varsayılan olarak etkin (`true`).
* Yeni [Prometheus metrikleri](../../admin-en/native-node-metrics.md) eklendi:

    * Genel Native Node örneği bilgilerini içeren `wallarm_gonode_application_info`, örn.:
    
        ```bash
        wallarm_gonode_application_info{deployment_type="node-native-aio-installer",mode="connector-server",version="0.16.1"} 1
        ```
    
    * `wallarm_gonode_http_inspector_balancer_workers`
    * `wallarm_gonode_http_inspector_debug_container_len` artık `type="channel:in"` için `aggregate="sum"` içerir
    * `wallarm_gonode_http_inspector_errors_total` artık yeni bir `type="FlowTimeouts"` içerir
* Dahili `http_inspector` modülünde kararlılık iyileştirildi

### 0.16.0 (2025-07-23)

* [MuleSoft Flex Gateway bağlayıcısı](../../installation/connectors/mulesoft-flex.md) desteği eklendi
* Node’un hangi istekleri incelemesi veya atlaması gerektiğinin tanımlanmasına olanak tanıyan [`input_filters`](../../installation/native-node/all-in-one-conf.md#input_filters) yapılandırma bölümü tanıtıldı
* Bellek sızıntısı düzeltildi
* Kurallarda, URI, ad alanı ve etiket adını birleştiren [**xml_tag**](../../user-guides/rules/request-processing.md#xml) değerlerinde kullanılan ayırıcı `:` yerine `|` olarak değiştirildi
* Yasaklı kaynaklar ve Wallarm Console UI üzerinden yapılandırılan mod ile ilgili engelleme sorunu düzeltildi
* Dahili iyileştirmeler

### 0.15.1 (2025-07-08)

* Güvenilir ağları yapılandırmak ve gerçek istemci IP’si ile host başlıklarını çıkarmak için [`proxy_headers`](../../installation/native-node/all-in-one-conf.md#proxy_headers) yapılandırması tanıtıldı

    Bu, önceki sürümlerde `tcp-capture` modunda kullanılan `http_inspector.real_ip_header`’ın yerini alır.
* `go-node` ikili dosyası tarafından sunulan Prometheus metriklerinin önekini özelleştirmek için [`metrics.namespace`](../../installation/native-node/all-in-one-conf.md#metricsnamespace) yapılandırma seçeneği eklendi
* `keep-alive` bağlantı sınırlarını kontrol etmek için [`connector.per_connection_limits`](../../installation/native-node/all-in-one-conf.md#connectorper_connection_limits) eklendi
* Küçük dahili dosya yapısı değişikliği
* wstore port bağlama düzeltildi: artık `0.0.0.0` yerine `127.0.0.1`’e bağlanır
* [CVE-2025-22874](https://nvd.nist.gov/vuln/detail/CVE-2025-22874) güvenlik açığı giderildi
* [CVE-2025-47273](https://nvd.nist.gov/vuln/detail/CVE-2025-47273) güvenlik açığı giderildi

### 0.14.1 (2025-05-07)

* [IBM API Connect bağlayıcısı](../../installation/connectors/ibm-api-connect.md) desteği eklendi
* [CVE-2025-22871](https://nvd.nist.gov/vuln/detail/CVE-2025-22871) güvenlik açığı giderildi
* Harici sağlık denetimi uç noktası desteği eklendi

    Bu, yeni [`connector.external_health_check`](../../installation/native-node/all-in-one-conf.md#connectorexternal_health_check) yapılandırma bölümüyle kontrol edilir.
* İstek ve yanıt gövdelerinin ara sıra bozulmasına neden olabilen tekrarlayan aralıklı bir hata düzeltildi
* Wallarm Console → **Nodes** içinde Native Node sürümlerinin hatalı görüntülenmesi düzeltildi

### 0.14.0 (2025-04-16)

* Wallarm Node artık yerel postanalytics işleme için Tarantool yerine Wallarm tarafından geliştirilen bir servis olan **wstore**’u kullanıyor
* Daha önce tüm filtreleme nodelarında kurulan collectd servisi ve ilgili eklentileri kaldırıldı
    
    Metrikler artık Wallarm’ın yerleşik mekanizmalarıyla toplanıp gönderilmektedir; bu da harici araçlara bağımlılığı azaltır.

## Amazon Machine Image (AMI)

<!-- How to upgrade -->

### 0.14.0 (2025-05-07)

* İlk sürüm