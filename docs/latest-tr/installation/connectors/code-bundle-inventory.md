# Bağlayıcı Kod Paketi Değişiklik Günlüğü

Bu doküman, Native Node (MuleSoft, Cloudflare vb.) ile çalışan bağlayıcı kod paketlerinin sürümlerini listeler.

## Sürüm biçimi

Bağlayıcı kod paketi sürümleri şu biçimi izler:

```bash
<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>
```

| Öğe | Açıklama |
| ------- | ----------- |
| `<MAJOR_VERSION>` | Önemli güncellemeler, yeni özellikler veya uyumsuz değişiklikler. Bir [Native Node güncellemesi](../../updating-migrating/native-node/node-artifact-versions.md) gerektirir. |
| `<MINOR_VERSION>` | Uyum bozucu değişiklik olmadan iyileştirmeler veya yeni özellikler. |
| `<PATCH_VERSION>` | Küçük hata düzeltmeleri veya iyileştirmeler. |

## MuleSoft Mule Gateway

[Nasıl yükseltilir](mulesoft.md#upgrading-the-policy)

Mevcut sürüm, indirilen Wallarm politikasının `pom.xml` dosyasında veya MuleSoft UI içindeki politika bilgilerinde bulunabilir.

| Politika sürümü      | [Native Node sürümü](../../updating-migrating/native-node/node-artifact-versions.md) |
| ------------------- | ------------------- |
| 2.x                 | 0.8.2 ve daha düşük |
| 3.0.x               | 0.8.3 ve daha yüksek |
| 3.2.x               | 0.10.1 ve daha yüksek |

### 3.2.0 (2025-01-31)

Native Node sürümünün 0.10.1 veya daha yüksek olmasını gerektirir.

* Kötü amaçlı olup engellenen isteklere verilen yanıt kodu artık MuleSoft Enterprise Edition deposundaki `http-transform` eklentisi kullanılarak 403 olarak ayarlanıyor

    Önceden, yanıtta isteğin engellendiğini belirten bir mesajla birlikte 200 durum kodu döndürülüyordu. Yeni bağlayıcı sürümünü kullanmak için standart `anypoint-exchange-v3` deposuna ek olarak [Maven `settings.xml`](../../installation/connectors/mulesoft.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange) içinde `mulesoft-releases-ee` deposuna kimlik doğrulaması artık gereklidir.
* Hata düzeltmesi: istek tanımlayıcılarının benzersizliğinin sağlanması
* Bellek kullanımı optimize edildi

### 3.0.1 (2024-11-20)

* `WALLARM NODE MAX RETRIES` ve `WALLARM NODE RETRY INTERVAL` parametreleri eklendi

    Bu parametreler, ağ kesintileri sırasında verileri Wallarm Node'lara gönderirken en fazla yeniden deneme sayısını ve denemeler arasındaki aralığı yapılandırmaya olanak tanır.

### 3.0.0 (2024-11-14)

Native Node sürümünün 0.8.3 veya daha yüksek olmasını gerektirir.

* `CLIENT HOST EXPRESSION` ve `CLIENT IP EXPRESSION` parametreleri eklendi

    Orijinal ana bilgisayarı ve uzak IP'yi çıkarmak için özel [DataWeave](https://docs.mulesoft.com/dataweave/latest/dw-functions) ifadeleri belirtmeye olanak tanırlar; bu da [MuleSoft'un IP Blocklist politikasına](https://docs.mulesoft.com/mule-gateway/policies-included-ip-blocklist) uyumludur.

### 2.0.3 (2024-11-13)

* Hata düzeltmeleri

### 2.0.2 (2024-11-06)

* Hata düzeltmeleri

### 2.0.1 (2024-10-10)

* İlk sürüm

## MuleSoft Flex Gateway

[Nasıl yükseltilir](mulesoft-flex.md#upgrading-the-policy)

Mevcut sürüm, indirilen Wallarm politikasının `Cargo.toml` → `[package]` → `version` parametresinde veya MuleSoft UI içindeki politika bilgilerinde bulunabilir.

| Politika sürümü      | [Native Node sürümü](../../updating-migrating/native-node/node-artifact-versions.md) |
| ------------------- | ------------------- |
| 1.x.x               | 0.16.0 ve daha yüksek |

### 1.1.0 (2025-08-19)

* Flex PDK 1.4.0 sürümüne yükseltildi
* Büyük yanıtlarda meydana gelen Gateway çökmesi düzeltildi

### 1.0.0 (2025-07-23)

* [İlk sürüm](mulesoft-flex.md)

## Akamai

[Nasıl yükseltilir](akamai-edgeworkers.md#upgrading-the-wallarm-edgeworkers)

Mevcut sürüm, indirilen kod paketinin `wallarm-main`/`wallarm-sp` → `bundle.json` → `edgeworker-version` bölümünde bulunabilir.

| Politika sürümü      | [Native Node sürümü](../../updating-migrating/native-node/node-artifact-versions.md) |
| ------------------- | ------------------- |
| 1.x                 | 0.16.3 ve daha yüksek |

### 1.0 (2025-08-18)

* [İlk sürüm](akamai-edgeworkers.md)

## CloudFront

[Nasıl yükseltilir](aws-lambda.md#upgrading-the-lambdaedge-functions)

### 1.0.0 (2024-10-10)

* İlk sürüm

## Cloudflare

[Nasıl yükseltilir](cloudflare.md#upgrading-the-cloudflare-worker)

### 1.0.1

* Kötü amaçlı istekler için özel engelleme sayfaları desteği; [parametreler](cloudflare.md#configuration-options) ile yapılandırılabilir:

    * `wallarm_block_page.custom_path`
    * `wallarm_block_page.html_page`
    * `wallarm_block_page.support_email`

### 1.0.0 (2024-10-10)

* İlk sürüm

## Kong API Gateway

[Nasıl yükseltilir](kong-api-gateway.md#upgrading-the-wallarm-lua-plugin)

### 1.0.0 (2024-09-13)

* İlk sürüm

<!-- ## Istio

[How to upgrade](istio.md#upgrading-the-wallarm-lua-plugin)

### 1.0.0 (2024-09-13)

* Initial release -->

## Broadcom Layer7 API Gateway

[Nasıl yükseltilir](layer7-api-gateway.md#upgrading-the-wallarm-policies)

### 1.0.0 (2024-11-07)

* İlk sürüm

## Fastly

[Nasıl yükseltilir](fastly.md#upgrading-the-wallarm-compute-service-on-fastly)

### 1.2.0 (2025-04-03)

* Alternatif yapılandırmaları kullanma yeteneği eklendi

    Wallarm için birden fazla Compute hizmeti çalıştırıyorsanız, farklı yapılandırmalara sahip [birden fazla config store](../../installation/connectors/fastly.md#4-create-the-wallarm-config-store) oluşturabilir ve her birini karşılık gelen hizmete bağlayabilirsiniz.

### 1.1.0 (2025-01-06)

* İsteğe bağlı `LOGGING_ENDPOINT` [parametresi](fastly.md#4-create-the-wallarm-config-store) aracılığıyla yapılandırılabilen [log akışı uç noktaları](https://www.fastly.com/documentation/guides/integrations/logging/) desteği eklendi

### 1.0.0 (2025-01-02)

* İlk sürüm

## IBM API Connect

[Nasıl yükseltilir](ibm-api-connect.md#upgrading-the-policies)

Mevcut sürüm, Wallarm politika dosyasındaki → `info.version` alanında bulunabilir. Her iki politika da aynı sürüm numarasını kullanır.

| Politika sürümü      | [Native Node sürümü](../../updating-migrating/native-node/node-artifact-versions.md) |
| ------------------- | ------------------- |
| 1.0.1               | 0.13.x serisinde 0.13.3 veya daha yeni ya da 0.14.1 veya daha yeni |

### 1.0.1 (2025-05-20)

* İlk sürüm