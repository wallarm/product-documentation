# NGINX Node Sürümleri ve Değişiklik Günlüğü

Bu belge, [NGINX Wallarm Node](../installation/nginx-native-node-internals.md#nginx-node) 6.x’in çeşitli biçimlerde mevcut [sürümlerini](versioning-policy.md) listeler; sürümleri takip etmenize ve yükseltmeleri planlamanıza yardımcı olur.

## Hepsi-bir-arada yükleyici

Sürüm 4.10’dan itibaren Wallarm node’larının kurulumu ve yükseltilmesi **yalnızca** [hepsi-bir-arada yükleyici](../installation/nginx/all-in-one.md) ile gerçekleştirilir. Tekil Linux paketleriyle manuel yükseltme artık desteklenmemektedir.

Hepsi-bir-arada yükleyici güncellemelerinin geçmişi, x86_64 ve ARM64 (beta) sürümleri için eşzamanlı olarak geçerlidir.

[DEB/RPM paketlerinden nasıl geçilir](nginx-modules.md)

[Önceki hepsi-bir-arada yükleyici sürümünden nasıl geçilir](all-in-one.md)

<!-- ### 6.5.0
new loggin variable wallarm_block_reason
new attack types in logging variables and search bars?
-->

### 6.5.1 (2025-09-09)

* [API Specification Enforcement](../api-specification-enforcement/overview.md) içinde içerik türü doğrulaması gevşetildi: resim MIME türlerine (`image/png`, `image/jpeg`, `image/gif`, `image/webp`, `image/avif`, `image/heic`, `image/heif`, `image/bmp`, `image/tiff`, `image/svg+xml`) sahip istekler artık reddedilmiyor
* Go sürümü 1.24’e yükseltildi
* Kısıtlama sona erdikten sonra normal duruma (`0`) dönmeyen `wallarm_wstore_throttle_mode` Prometheus metriğinin davranışı düzeltildi

### 6.4.1 (2025-08-07)

* API Specification Enforcement servis çalışması (yerleşik API Firewall servisine dayalı) için Prometheus metrik desteği eklendi:

    * `/opt/wallarm/env.list` içinde `APIFW_METRICS_ENABLED=true` ile etkinleştirin
    * Varsayılan uç nokta: `:9010/metrics`
    * Ana makine ve uç nokta adı `APIFW_METRICS_HOST` ve `APIFW_METRICS_ENDPOINT_NAME` değişkenleri ile yapılandırılabilir

### 6.4.0 (2025-07-31)

* Cloud’a stuffed credentials dışa aktarımı düzeltildi
* GraphQL ayrıştırıcı iyileştirildi
* Hata düzeltmeleri ve dahili iyileştirmeler

### 6.3.1 (2025-07-23)

* Bellek sızıntısı düzeltildi

### 6.3.0 (2025-07-08)

* [Dosya yükleme kısıtlama politikası](../api-protection/file-upload-restriction.md) desteği eklendi
* [API Abuse Prevention](../api-abuse-prevention/overview.md) tarafından [unrestricted resource consumption](../attacks-vulns-list.md#unrestricted-resource-consumption) hafifletme desteği eklendi
* Kurallarda, URI, ad alanı ve etiket adını birleştiren [**xml_tag**](../user-guides/rules/request-processing.md#xml) değerlerinde kullanılan ayraç `:` yerine `|` olarak değiştirildi
* Dahili iyileştirmeler
<!-- * [Node part only, no public announcement yet] Added support for SOAP-XML API Discovery
* [Node part only, no public announcement yet] Added support file upload restriction policy -->

### 6.2.1 (2025-06-23)

* Küçük dahili dosya yapısı değişikliği

### 6.2.0 (2025-06-20)

* gRPC trafiği için akış işleme optimize edildi
* gRPC ve WebSocket trafiğinde sırasıyla tek bir mesaj yükünün ve tüm akış gövdesinin azami boyutunu kontrol etmek için [`wallarm_max_request_stream_message_size`](../admin-en/configure-parameters-en.md#wallarm_max_request_stream_message_size) ve [`wallarm_max_request_stream_size`](../admin-en/configure-parameters-en.md#wallarm_max_request_stream_size) NGINX yönergeleri eklendi
* İşlenen gRPC/WebSocket akış ve mesaj sayısını raporlamak için [`/wallarm-status` servisi](../admin-en/configure-statistics-service.md) çıktısına `streams` ve `messages` parametreleri eklendi
* Node tarafından analiz edilen HTTP istek gövdesinin azami boyutunu kontrol etmek için [`wallarm_max_request_body_size`](../admin-en/configure-parameters-en.md#wallarm_max_request_body_size) NGINX yönergesi eklendi
* NGINX-Wallarm modülü ile postanalytics modülü ayrı kurulduğunda aralarında [SSL/TLS ve mTLS](../admin-en/installation-postanalytics-en.md#ssltls-and-mtls-between-the-nginx-wallarm-module-and-the-postanalytics-module) desteği eklendi
* wstore port bağlama düzeltildi: artık `0.0.0.0` yerine `127.0.0.1`’e bağlanıyor
* Küçük hata düzeltmeleri

### 6.1.0 (2025-05-09)

* [**enumeration**](../api-protection/enumeration-attack-protection.md) azaltma kontrolleri için destek eklendi
* [**DoS koruması**](../api-protection/dos-protection.md) azaltma kontrolü için destek eklendi
* Hata düzeltmesi: Allowlist’e alınmış kaynaklardan gelen saldırılar artık **Attacks** bölümünde gösterilmiyor
* Daha kolay tanımlama için wstore günlükleri artık `"component": "wstore"` içeriyor

### 6.0.3 (2025-05-07)

* Amazon Linux 2 desteği eklendi
* Özel NGINX ile kurulum sorunları düzeltildi

### 6.0.2 (2025-04-29)

* NGINX stable 1.28.0 desteği eklendi
* NGINX mainline 1.27.5 desteği eklendi

### 6.0.1 (2025-04-22)

* [CVE-2024-56406](https://nvd.nist.gov/vuln/detail/CVE-2024-56406), [CVE-2025-31115](https://nvd.nist.gov/vuln/detail/CVE-2025-31115) güvenlik açıkları düzeltildi

### 6.0.0 (2025-04-03)

* İlk 6.0 sürümü, [değişiklik günlüğüne bakın](what-is-new.md)

## Wallarm NGINX Ingress controller için Helm chart’ı

[Nasıl yükseltilir](ingress-controller.md)

### 6.5.1 (2025-09-09)

* API Specification Enforcement servis çalışması (yerleşik API Firewall servisine dayalı) için Prometheus metrik desteği eklendi

    Metrikler varsayılan olarak devre dışıdır ve yeni [`controller.wallarm.apiFirewall.metrics.*`](../admin-en/configure-kubernetes-en.md#controllerwallarmapifirewallmetrics) değerleri aracılığıyla etkinleştirilebilir.
* [API Specification Enforcement](../api-specification-enforcement/overview.md) içinde içerik türü doğrulaması gevşetildi: resim MIME türlerine (`image/png`, `image/jpeg`, `image/gif`, `image/webp`, `image/avif`, `image/heic`, `image/heif`, `image/bmp`, `image/tiff`, `image/svg+xml`) sahip istekler artık reddedilmiyor
* Go sürümü 1.24’e yükseltildi
* Kısıtlama sona erdikten sonra normal duruma (`0`) dönmeyen `wallarm_wstore_throttle_mode` Prometheus metriğinin davranışı düzeltildi
* Community Ingress NGINX Controller sürümü 1.11.8’e yükseltildi; upstream Helm chart sürümü 4.11.8 ve Alpine sürümü 3.22.0 ile hizalandı
* Upstream yükseltme sayesinde [CVE-2025-5399](https://nvd.nist.gov/vuln/detail/CVE-2025-5399) ve [CVE-2025-22872](https://nvd.nist.gov/vuln/detail/CVE-2025-22872) güvenlik açıkları giderildi

### 6.4.0 (2025-07-31)

* Cloud’a stuffed credentials dışa aktarımı düzeltildi
* GraphQL ayrıştırıcı iyileştirildi
* Hata düzeltmeleri ve dahili iyileştirmeler

### 6.3.1 (2025-07-23)

* Bellek sızıntısı düzeltildi

### 6.3.0 (2025-07-08)

* [Dosya yükleme kısıtlama politikası](../api-protection/file-upload-restriction.md) desteği eklendi
* [API Abuse Prevention](../api-abuse-prevention/overview.md) tarafından [unrestricted resource consumption](../attacks-vulns-list.md#unrestricted-resource-consumption) hafifletme desteği eklendi
* Tehlikeli `server-snippet` ve `configuration-snippet` annotasyonlarını engelleyen CEL kuralını açıp kapatmak için [`validation.forbidDangerousAnnotations`](../admin-en/configure-kubernetes-en.md#validationforbiddangerousannotations) chart değeri eklendi

    Varsayılan olarak `false` - tehlikeli annotasyonlar engellenmez.

    Node 6.2.0’daki davranış - değişmedi ( `validation.enableCel` `true` iken anotasyonlar varsayılan olarak engellenir).
* Gelen **wstore** bağlantıları için adres ve portu özelleştirmek üzere [`controller.wallarm.postanalytics.serviceAddress`](../admin-en/configure-kubernetes-en.md#controllerwallarmpostanalyticsserviceaddress) parametresi desteği eklendi
* Kurallarda, URI, ad alanı ve etiket adını birleştiren [**xml_tag**](../user-guides/rules/request-processing.md#xml) değerlerinde kullanılan ayraç `:` yerine `|` olarak değiştirildi
* Dahili iyileştirmeler

### 6.2.0 (2025-06-20)

* gRPC trafiği için akış işleme optimize edildi
* gRPC ve WebSocket trafiğinde sırasıyla tek bir mesaj yükünün ve tüm akış gövdesinin azami boyutunu kontrol etmek için [`wallarm_max_request_stream_message_size`](../admin-en/configure-parameters-en.md#wallarm_max_request_stream_message_size) ve [`wallarm_max_request_stream_size`](../admin-en/configure-parameters-en.md#wallarm_max_request_stream_size) NGINX yönergeleri eklendi
* İşlenen gRPC/WebSocket akış ve mesaj sayısını raporlamak için [`/wallarm-status` servisi](../admin-en/configure-statistics-service.md) çıktısına `streams` ve `messages` parametreleri eklendi
* Node tarafından analiz edilen HTTP istek gövdesinin azami boyutunu kontrol etmek için [`wallarm_max_request_body_size`](../admin-en/configure-parameters-en.md#wallarm_max_request_body_size) NGINX yönergesi eklendi
* Filtering Node ile postanalytics modülü arasında [SSL/TLS ve mTLS](../admin-en/configure-kubernetes-en.md#controllerwallarmpostanalyticstls) desteği eklendi
* `values.yaml` içindeki birleşik `controller.wallarm.wcli` bileşeni, kapsayıcılar üzerinde ayrıntılı kontrol sağlamak için 2 ayrı [yapılandırılabilir birime](../admin-en/configure-kubernetes-en.md) bölündü: `wcliController` ve `wcliPostanalytics`
* Küçük hata düzeltmeleri

### 6.1.0 (2025-05-09)

* Hata düzeltmesi: Allowlist’e alınmış kaynaklardan gelen saldırılar artık **Attacks** bölümünde gösterilmiyor
* Daha kolay tanımlama için wstore günlükleri artık `"component": "wstore"` içeriyor

### 6.0.2 (2025-04-25)

* Ingress kaynaklarının Validating Admission Policies üzerinden doğrulanmasını etkinleştirmek için [`validation.enableCel`](../admin-en/configure-kubernetes-en.md#validationenablecel) parametresi eklendi

### 6.0.1 (2025-04-22)

* [CVE-2025-22871](https://nvd.nist.gov/vuln/detail/CVE-2025-22871) güvenlik açığı düzeltildi

### 6.0.0 (2025-04-03)

* İlk 6.0 sürümü, [değişiklik günlüğüne bakın](what-is-new.md)

## Sidecar için Helm chart’ı

[Nasıl yükseltilir](sidecar-proxy.md)

### 6.5.1 (2025-09-09)

* API Specification Enforcement servis çalışması (yerleşik API Firewall servisine dayalı) için Prometheus metrik desteği eklendi

    Metrikler varsayılan olarak devre dışıdır ve yeni [`config.wallarm.apiFirewall.metrics.*`](../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md) değerleri aracılığıyla etkinleştirilebilir.
* [API Specification Enforcement](../api-specification-enforcement/overview.md) içinde içerik türü doğrulaması gevşetildi: resim MIME türlerine (`image/png`, `image/jpeg`, `image/gif`, `image/webp`, `image/avif`, `image/heic`, `image/heif`, `image/bmp`, `image/tiff`, `image/svg+xml`) sahip istekler artık reddedilmiyor
* Go sürümü 1.24’e yükseltildi
* Kısıtlama sona erdikten sonra normal duruma (`0`) dönmeyen `wallarm_wstore_throttle_mode` Prometheus metriğinin davranışı düzeltildi

### 6.4.0 (2025-07-31)

* Cloud’a stuffed credentials dışa aktarımı düzeltildi
* GraphQL ayrıştırıcı iyileştirildi
* Hata düzeltmeleri ve dahili iyileştirmeler

### 6.3.1 (2025-07-23)

* Bellek sızıntısı düzeltildi

### 6.3.0 (2025-07-08)

* [Dosya yükleme kısıtlama politikası](../api-protection/file-upload-restriction.md) desteği eklendi
* [API Abuse Prevention](../api-abuse-prevention/overview.md) tarafından [unrestricted resource consumption](../attacks-vulns-list.md#unrestricted-resource-consumption) hafifletme desteği eklendi
* Gelen **wstore** bağlantıları için adres ve portu özelleştirmek üzere [`postanalytics.wstore.config.serviceAddress`](../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md#postanalyticswstoreconfigserviceaddress) parametresi desteği eklendi
* Kurallarda, URI, ad alanı ve etiket adını birleştiren [**xml_tag**](../user-guides/rules/request-processing.md#xml) değerlerinde kullanılan ayraç `:` yerine `|` olarak değiştirildi
* Dahili iyileştirmeler

### 6.2.0 (2025-06-20)

* gRPC trafiği için akış işleme optimize edildi
* Filtering Node ile postanalytics modülü arasında [SSL/TLS ve mTLS](../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md#postanalyticswstoretls) desteği eklendi
* Alpine sürümü 3.22’ye yükseltildi
* NGINX 1.28.0 sürümüne yükseltildi
* Küçük hata düzeltmeleri

### 6.1.0 (2025-05-09)

* Hata düzeltmesi: Allowlist’e alınmış kaynaklardan gelen saldırılar artık **Attacks** bölümünde gösterilmiyor
* Daha kolay tanımlama için wstore günlükleri artık `"component": "wstore"` içeriyor

### 6.0.1 (2025-04-22)

* [CVE-2024-56406](https://nvd.nist.gov/vuln/detail/CVE-2024-56406), [CVE-2025-31115](https://nvd.nist.gov/vuln/detail/CVE-2025-31115) güvenlik açıkları düzeltildi

### 6.0.0 (2025-04-03)

* İlk 6.0 sürümü, [değişiklik günlüğüne bakın](what-is-new.md)

## NGINX tabanlı Docker imajı

[Nasıl yükseltilir](docker-container.md)

### 6.5.1 (2025-09-09)

* [API Specification Enforcement](../api-specification-enforcement/overview.md) içinde içerik türü doğrulaması gevşetildi: resim MIME türlerine (`image/png`, `image/jpeg`, `image/gif`, `image/webp`, `image/avif`, `image/heic`, `image/heif`, `image/bmp`, `image/tiff`, `image/svg+xml`) sahip istekler artık reddedilmiyor
* Go sürümü 1.24’e yükseltildi
* Kısıtlama sona erdikten sonra normal duruma (`0`) dönmeyen `wallarm_wstore_throttle_mode` Prometheus metriğinin davranışı düzeltildi

### 6.4.1 (2025-08-07)

* API Specification Enforcement servis çalışması (yerleşik API Firewall servisine dayalı) için Prometheus metrik desteği eklendi:

    * `APIFW_METRICS_ENABLED=true` ortam değişkeni ile etkinleştirin
    * Varsayılan uç nokta: `:9010/metrics`
    * Kapsayıcınızda metrikler portunu dışa açın (örn. varsayılan durum için `-p 9010:9010` kullanın)
    * Ana makine ve uç nokta adı `APIFW_METRICS_HOST` ve `APIFW_METRICS_ENDPOINT_NAME` değişkenleri ile yapılandırılabilir

### 6.4.0 (2025-07-31)

* Cloud’a stuffed credentials dışa aktarımı düzeltildi
* GraphQL ayrıştırıcı iyileştirildi
* Hata düzeltmeleri ve dahili iyileştirmeler

### 6.3.1 (2025-07-23)

* Bellek sızıntısı düzeltildi

### 6.3.0 (2025-07-08)

* [Dosya yükleme kısıtlama politikası](../api-protection/file-upload-restriction.md) desteği eklendi
* [API Abuse Prevention](../api-abuse-prevention/overview.md) tarafından [unrestricted resource consumption](../attacks-vulns-list.md#unrestricted-resource-consumption) hafifletme desteği eklendi
* Kurallarda, URI, ad alanı ve etiket adını birleştiren [**xml_tag**](../user-guides/rules/request-processing.md#xml) değerlerinde kullanılan ayraç `:` yerine `|` olarak değiştirildi
* Dahili iyileştirmeler

### 6.2.0 (2025-06-20)

* gRPC trafiği için akış işleme optimize edildi
* İşlenen gRPC/WebSocket akış ve mesaj sayısını raporlamak için [`/wallarm-status` servisi](../admin-en/configure-statistics-service.md) çıktısına `streams` ve `messages` parametreleri eklendi
* NGINX-Wallarm modülü ile postanalytics modülü ayrı kurulduğunda aralarında [SSL/TLS ve mTLS](../admin-en/installation-postanalytics-en.md#ssltls-and-mtls-between-the-nginx-wallarm-module-and-the-postanalytics-module) desteği eklendi
* wstore port bağlama düzeltildi: artık `0.0.0.0` yerine `127.0.0.1`’e bağlanıyor
* Alpine sürümü 3.22’ye yükseltildi
* NGINX 1.28.0 sürümüne yükseltildi
* Küçük hata düzeltmeleri

### 6.1.0 (2025-05-09)

* Hata düzeltmesi: Allowlist’e alınmış kaynaklardan gelen saldırılar artık **Attacks** bölümünde gösterilmiyor
* Daha kolay tanımlama için wstore günlükleri artık `"component": "wstore"` içeriyor

### 6.0.1 (2025-04-22)

* [CVE-2024-56406](https://nvd.nist.gov/vuln/detail/CVE-2024-56406), [CVE-2025-31115](https://nvd.nist.gov/vuln/detail/CVE-2025-31115) güvenlik açıkları düzeltildi

### 6.0.0 (2025-04-03)

* İlk 6.0 sürümü, [değişiklik günlüğüne bakın](what-is-new.md)

## Amazon Machine Image (AMI)

[Nasıl yükseltilir](cloud-image.md)

### 6.5.1 (2025-09-09)

* [API Specification Enforcement](../api-specification-enforcement/overview.md) içinde içerik türü doğrulaması gevşetildi: resim MIME türlerine (`image/png`, `image/jpeg`, `image/gif`, `image/webp`, `image/avif`, `image/heic`, `image/heif`, `image/bmp`, `image/tiff`, `image/svg+xml`) sahip istekler artık reddedilmiyor
* Go sürümü 1.24’e yükseltildi
* Kısıtlama sona erdikten sonra normal duruma (`0`) dönmeyen `wallarm_wstore_throttle_mode` Prometheus metriğinin davranışı düzeltildi 

### 6.4.0 (2025-07-31)

* Cloud’a stuffed credentials dışa aktarımı düzeltildi
* GraphQL ayrıştırıcı iyileştirildi
* Hata düzeltmeleri ve dahili iyileştirmeler

### 6.3.1 (2025-07-23)

* Bellek sızıntısı düzeltildi

### 6.3.0 (2025-07-08)

* [Dosya yükleme kısıtlama politikası](../api-protection/file-upload-restriction.md) desteği eklendi
* [API Abuse Prevention](../api-abuse-prevention/overview.md) tarafından [unrestricted resource consumption](../attacks-vulns-list.md#unrestricted-resource-consumption) hafifletme desteği eklendi
* Kurallarda, URI, ad alanı ve etiket adını birleştiren [**xml_tag**](../user-guides/rules/request-processing.md#xml) değerlerinde kullanılan ayraç `:` yerine `|` olarak değiştirildi
* Dahili iyileştirmeler

### 6.2.0 (2025-06-20)

* gRPC trafiği için akış işleme optimize edildi
* İşlenen gRPC/WebSocket akış ve mesaj sayısını raporlamak için [`/wallarm-status` servisi](../admin-en/configure-statistics-service.md) çıktısına `streams` ve `messages` parametreleri eklendi
* NGINX-Wallarm modülü ile postanalytics modülü ayrı kurulduğunda aralarında [SSL/TLS ve mTLS](../admin-en/installation-postanalytics-en.md#ssltls-and-mtls-between-the-nginx-wallarm-module-and-the-postanalytics-module) desteği eklendi
* wstore port bağlama düzeltildi: artık `0.0.0.0` yerine `127.0.0.1`’e bağlanıyor
* Küçük hata düzeltmeleri

### 6.1.0 (2025-05-09)

* Hata düzeltmesi: Allowlist’e alınmış kaynaklardan gelen saldırılar artık **Attacks** bölümünde gösterilmiyor
* Daha kolay tanımlama için wstore günlükleri artık `"component": "wstore"` içeriyor

### 6.0.1 (2025-04-22)

* [CVE-2024-56406](https://nvd.nist.gov/vuln/detail/CVE-2024-56406), [CVE-2025-31115](https://nvd.nist.gov/vuln/detail/CVE-2025-31115) güvenlik açıkları düzeltildi

### 6.0.0 (2025-04-03)

* İlk 6.0 sürümü, [değişiklik günlüğüne bakın](what-is-new.md)

## Google Cloud Platform İmajı

[Nasıl yükseltilir](cloud-image.md)

### wallarm-node-6-5-1-20250908-174655 (2025-09-09)

* [API Specification Enforcement](../api-specification-enforcement/overview.md) içinde içerik türü doğrulaması gevşetildi: resim MIME türlerine (`image/png`, `image/jpeg`, `image/gif`, `image/webp`, `image/avif`, `image/heic`, `image/heif`, `image/bmp`, `image/tiff`, `image/svg+xml`) sahip istekler artık reddedilmiyor
* Go sürümü 1.24’e yükseltildi
* Kısıtlama sona erdikten sonra normal duruma (`0`) dönmeyen `wallarm_wstore_throttle_mode` Prometheus metriğinin davranışı düzeltildi

### wallarm-node-6-4-0-20250730-083353 (2025-07-31)

* Cloud’a stuffed credentials dışa aktarımı düzeltildi
* GraphQL ayrıştırıcı iyileştirildi
* Hata düzeltmeleri ve dahili iyileştirmeler

### wallarm-node-6-3-1-20250721-082413 (2025-07-23)

* Bellek sızıntısı düzeltildi

### wallarm-node-6-3-0-20250708-175541 (2025-07-08)

* Kurallarda, URI, ad alanı ve etiket adını birleştiren [**xml_tag**](../user-guides/rules/request-processing.md#xml) değerlerinde kullanılan ayraç `:` yerine `|` olarak değiştirildi
* Dahili iyileştirmeler

### wallarm-node-6-2-0-20250618-150224 (2025-06-20)

* gRPC trafiği için akış işleme optimize edildi
* İşlenen gRPC/WebSocket akış ve mesaj sayısını raporlamak için [`/wallarm-status` servisi](../admin-en/configure-statistics-service.md) çıktısına `streams` ve `messages` parametreleri eklendi
* NGINX-Wallarm modülü ile postanalytics modülü ayrı kurulduğunda aralarında [SSL/TLS ve mTLS](../admin-en/installation-postanalytics-en.md#ssltls-and-mtls-between-the-nginx-wallarm-module-and-the-postanalytics-module) desteği eklendi
* wstore port bağlama düzeltildi: artık `127.0.0.1`’e bağlanıyor, `0.0.0.0` değil
* Küçük hata düzeltmeleri

### wallarm-node-6-1-0-20250508-144827 (2025-05-09)

* Hata düzeltmesi: Allowlist’e alınmış kaynaklardan gelen saldırılar artık **Attacks** bölümünde gösterilmiyor
* Daha kolay tanımlama için wstore günlükleri artık `"component": "wstore"` içeriyor

### wallarm-node-6-0-1-20250422-104749 (2025-04-22)

* [CVE-2024-56406](https://nvd.nist.gov/vuln/detail/CVE-2024-56406), [CVE-2025-31115](https://nvd.nist.gov/vuln/detail/CVE-2025-31115) güvenlik açıkları düzeltildi

### wallarm-node-6-0-0-20250403-102125 (2025-04-03)

* İlk 6.0 sürümü, [değişiklik günlüğüne bakın](what-is-new.md)