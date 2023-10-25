# API Güvenlik Duvarı Değişiklik Kaydı

Bu sayfa, Wallarm API Güvenlik Duvarı'nın yeni sürümlerini açıklar.

## v0.6.13 (2023-09-08)

* [GraphQL API isteklerinin doğrulanması için destek](installation-guides/graphql/docker-container.md)

## v0.6.12 (2023-08-04)

* Genel API Güvenlik Duvarı modunu `APIFW_MODE` çevre değişkenini kullanarak ayarlama yeteneği. Varsayılan değer `PROXY`'dir. API olarak ayarlandığında, [belirtilen bir OpenAPI spesifikasyonuna dayalı olarak bireysel API isteklerini daha fazla proxy olmadan doğrulayabilirsiniz](installation-guides/api-mode.md).
* `OPTIONS` isteklerine, `OPTIONS` yöntemi açıkça tanımlanmış olmasa bile, OpenAPI'da belirtilen uç noktalar için izin verme yeteneği tanıtıldı. Bu, `APIFW_PASS_OPTIONS` değişkeni kullanılarak başarılabilir. Varsayılan değer `false`'dur.
* Parametrelerin, OpenAPI spesifikasyonunda ana hatları çizilenlere uymayan isteklerin bir spesifikasyonla eşleşmeyen olarak tanımlanıp tanımlanmayacağı üzerinde kontrol sağlayan bir özellik tanıtıldı. Varsayılan olarak `true` olarak ayarlanmıştır.

    Bu, `APIFW_SHADOW_API_UNKNOWN_PARAMETERS_DETECTION` değişkeni karu `PROXY` modunda ve `APIFW_API_MODE_UNKNOWN_PARAMETERS_DETECTION` değişkeni aracılığıyla `API` modunda kontrol edilebilir.
* Gelen istekleri ve API Güvenlik Duvarı yanıtlarını, içerikleri dahil olmak üzere, günlüğe kaydetmek için yeni `TRACE` günlükleme seviyesi modu. Bu seviye `APIFW_LOG_LEVEL` çevre değişkeni kullanılarak ayarlanabilir.
* Bağımlılıkların güncellenmesi
* Hata düzeltmeleri

## v0.6.11 (2023-02-10)

* `APIFW_SERVER_DELETE_ACCEPT_ENCODING` çevre değişkenini ekleyin. `true` olarak ayarlanırsa, `Accept-Encoding` başlığı proxy edilen isteklerden silinir. Varsayılan değer `false`'dur.
* https://github.com/wallarm/api-firewall/issues/56
* https://github.com/wallarm/api-firewall/issues/57
* İstek gövdesi ve yanıt gövdesi için açma işlemi ekleyin

## v0.6.10 (2022-12-15)

* https://github.com/wallarm/api-firewall/issues/54
* Bağımlılıkları güncelle

## v0.6.9 (2022-09-12)

* Go'yu 1.19'a yükseltin
* Diğer bağımlılıkları yükseltin
* Shadow API algılama ve denylist işleme hatalarını düzeltin
* Yanıtları API Güvenlik Duvarı tarafından döndürülen `Apifw-Request-Id` başlığını silin
* Ingress nesnesinin Kubernetes 1.22 ile uyumluluğunu ekleyin
* INFO günlükleme seviyesinde API spesifikasyonuna uyan gelen isteklerin günlükleme işlemini sonlandırın

## v0.6.8 (2022-04-11)

### Yeni özellikler

* OpenAPI 3.0 spesifikasyonunun URL adresini belirtme yeteneği Docker konteynırına spesifikasyon dosyasını mount etmek yerine ([`APIFW_API_SPECS`](installation-guides/docker-container.md#apifw-api-specs) çevre değişkeni üzerinden).
* Token kontrol hizmetine istekler gönderirken özel `Content-Type` başlığını kullanma yeteneği ([`APIFW_SERVER_OAUTH_INTROSPECTION_CONTENT_TYPE`](configuration-guides/validate-tokens.md) çevre değişkeni üzerinden).
* [Kimlik doğrulama token'lerinin denylist'leri](configuration-guides/denylist-leaked-tokens.md) için destek.

## v0.6.7 (2022-01-25)

Wallarm API Güvenlik Duvarı şimdi açık kaynak kodludur. [Bu sürümde](https://github.com/wallarm/api-firewall/releases/tag/v0.6.7) ilgili değişiklikler şunlardır:

* API Güvenlik Duvarı kaynak kodu ve ilgili açık kaynak lisansı yayınlandı
* İkili dosya, Helm grafiği ve Docker görüntüsünü oluşturma için GitHub iş akışı uygulandı

## v0.6.6 (2021-12-09)

### Yeni özellikler

* [OAuth 2.0 token doğrulama](configuration-guides/validate-tokens.md) desteği.
* Özel CA sertifikalarıyla imzalanan sunuculara [bağlantı](configuration-guides/ssl-tls.md) ve güvensiz bağlantı bayrağı desteği.

### Hata düzeltmeleri

* https://github.com/wallarm/api-firewall/issues/27

## v0.6.5 (2021-10-12)

### Yeni özellikler

* Fasthttp istemcilerinin maksimum sayısının konfigürasyonu (`APIFW_SERVER_CLIENT_POOL_CAPACITY` çevre değişkeni üzerinden).
* API Güvenlik Duvarı konteynırının 9667 portunda sağlık kontrolleri (port, `APIFW_HEALTH_HOST` çevre değişkeni üzerinden değiştirilebilir).

[Yeni çevre değişkenleriyle API Duvanığı'nı çalıştırma talimatları](installation-guides/docker-container.md)

### Hata düzeltmeleri

* https://github.com/wallarm/api-firewall/issues/15
* Diğer birtakım hatalar

## v0.6.4 (2021-08-18)

### Yeni özellikler

* Shadow API uç noktaları için izleme eklendi. API Güvenlik Duvarı, hem istekler hem de yanıtlar için `LOG_ONLY` modunda çalışırken, spesifikasyona dahil edilmeyen ve `404`'ten farklı bir kod döndüren tüm uç noktaları, shadow uç noktaları olarak işaretler. Shadow uç noktalarını belirten yanıt kodlarını `APIFW_SHADOW_API_EXCLUDE_LIST` çevre değişkenini kullanarak hariç tutabilirsiniz.
* API Güvenlik Duvarı tarafından bloklu isteklere döndürülen HTTP yanıt durum kodunu ayarlama (`APIFW_CUSTOM_BLOCK_STATUS_CODE` çevre değişkeni üzerinden).
* İsteğin bloke nedenini içeren başlığı döndürme yeteneği (`APIFW_ADD_VALIDATION_STATUS_HEADER` çevre değişkeni üzerinden). Bu özellik **deneyseldir**.
* API Güvenlik Duvarı günlük biçiminin konfigürasyonu (`APIFW_LOG_FORMAT` çevre değişkeni üzerinden).

[Yeni çevre değişkenleriyle API Duvanığı'nı çalıştırma talimatları](installation-guides/docker-container.md)

### Optimizasyonlar

* Eklenen `fastjson` ayrıştırıcısıyla birlikte OpenAPI 3.0 spesifikasyonunun doğrulaması optimize edilmiştir.
* Fasthttp desteği eklendi.

## v0.6.2 (2021-06-22)

* İlk sürüm!