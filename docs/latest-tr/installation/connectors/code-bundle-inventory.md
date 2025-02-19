# Connector Code Bundle Changelog

Bu belge, Native Node (MuleSoft, Cloudflare, vb.) ile çalışan bağlayıcı kod paketi sürümlerini listeler.

## Sürüm Formatı

Bağlayıcı kod paketi sürümleri şu formatı izler:

```bash
<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>
```

| Element           | Açıklama |
| ----------------- | -------- |
| `<MAJOR_VERSION>` | Önemli güncellemeler, yeni özellikler veya uyumsuzluk yaratan değişiklikler. [Native Node güncellemesi](../../updating-migrating/native-node/node-artifact-versions.md) gerektirir. |
| `<MINOR_VERSION>` | Uyumsuzluk yaratan değişiklikler olmadan geliştirmeler veya yeni özellikler. |
| `<PATCH_VERSION>` | Küçük hata düzeltmeleri veya iyileştirmeler. |

## MuleSoft

[How to upgrade](mulesoft.md#upgrading-the-policy)

İndirilen Wallarm policy'nin `pom.xml` dosyasında veya Mulesoft UI'deki policy bilgileri arasında geçerli sürüm bulunabilir.

| Politika sürümü | [Native Node version](../../updating-migrating/native-node/node-artifact-versions.md) |
| --------------- | ------------------- |
| 2.x             | 0.8.2 and lower     |
| 3.x             | 0.8.3 and higher    |

### 3.0.1 (2024-11-20)

* `WALLARM NODE MAX RETRIES` ve `WALLARM NODE RETRY INTERVAL` parametreleri eklendi

    Bu parametreler, ağ hataları sırasında Wallarm Nodes'a veri gönderilirken, yeniden deneme girişimlerinin maksimum sayısını ve denemeler arasındaki aralığı yapılandırmaya olanak tanır.

### 3.0.0 (2024-11-14)

[Native Node](../../updating-migrating/native-node/node-artifact-versions.md) sürüm 0.8.3 veya daha üstünü gerektirir.

* `CLIENT HOST EXPRESSION` ve `CLIENT IP EXPRESSION` parametreleri eklendi

    Bu parametreler, özgün host ve uzak IP'yi çıkarmak için özel [DataWeave](https://docs.mulesoft.com/dataweave/latest/dw-functions) ifadeleri tanımlamaya olanak tanır ve [Mulesoft's IP Blocklist policy](https://docs.mulesoft.com/mule-gateway/policies-included-ip-blocklist) ile uyumlu çalışır.

### 2.0.3 (2024-11-13)

* Hata düzeltmeleri

### 2.0.2 (2024-11-06)

* Hata düzeltmeleri

### 2.0.1 (2024-10-10)

* İlk sürüm

## CloudFront

[How to upgrade](aws-lambda.md#upgrading-the-lambdaedge-functions)

### 1.0.0 (2024-10-10)

* İlk sürüm

## Cloudflare

[How to upgrade](cloudflare.md#upgrading-the-cloudflare-worker)

### 1.0.1

* Kötü amaçlı istekler için özel engelleme sayfaları desteği, [parametreler](cloudflare.md#configuration-options) aracılığıyla yapılandırılabilir:
    * `wallarm_block_page.custom_path`
    * `wallarm_block_page.html_page`
    * `wallarm_block_page.support_email`

### 1.0.0 (2024-10-10)

* İlk sürüm

## Kong API Gateway

[How to upgrade](kong-api-gateway.md#upgrading-the-wallarm-lua-plugin)

### 1.0.0 (2024-09-13)

* İlk sürüm

## Istio

[How to upgrade](istio.md#upgrading-the-wallarm-lua-plugin)

### 1.0.0 (2024-09-13)

* İlk sürüm

## Broadcom Layer7 API Gateway

[How to upgrade](layer7-api-gateway.md#upgrading-the-wallarm-policies)

### 1.0.0 (2024-11-07)

* İlk sürüm

## Fastly

[How to upgrade](fastly.md#upgrading-the-wallarm-compute-service-on-fastly)

### 1.1.0 (2025-01-06)

* Opsiyonel `LOGGING_ENDPOINT` [parametresi](fastly.md#4-create-the-wallarm-config-store) ile yapılandırma sayesinde [log streaming endpoints](https://www.fastly.com/documentation/guides/integrations/logging/) desteği eklendi

### 1.0.0 (2025-01-02)

* İlk sürüm