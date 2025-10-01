# Wallarm Node Sürümleme Politikası

Bu doküman, self-hosted [NGINX tabanlı ve Native Nodes](../installation/nginx-native-node-internals.md) ile self-hosted Native Nodes ile sürüm numaralarını paylaşan [Edge Nodes](../installation/security-edge/overview.md) için Wallarm’ın sürümleme politikasını detaylandırır. Düğüm güncellemelerini yönetmek için sürümleme standartları, yayın takvimleri ve uyumluluk yönergelerini kapsar.

Her düğüm sürümü, farklı platformlara dağıtım için paketlenmiş Docker imajları, Helm chart’ları veya hepsi bir arada yükleyiciler gibi artifaktlar seti olarak yayınlanır.

## Sürüm listesi

| NGINX Node sürümü | Native ve Edge Node sürümü | Yayın tarihi   | Destek bitişi |
|--------------------|---------------------|----------------|---------------|
| 2.18 ve daha düşük 2.x | -                   |                | Kasım 2021 |
| 3.6 ve daha düşük 3.x  | -                   | Ekim 2021      | Kasım 2022 |
| 4.6 ve daha düşük 4.x  | -                   | Haziran 2022   | Nisan 2024 |
| 4.8                | -                   | Ekim 2023      | Kasım 2024 |
| 4.10               | -                   | Ocak 2024      | Temmuz 2025 |
| 5.x                | 0.13.x-             | Temmuz 2024    |               |
| 6.x                | 0.14.x+             | Mart 2025      |               |

## Sürüm yapısı

Node sürümleri şu formatı izler:

```bash
<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>[-<BUILD_NUMBER>]
```

| Öğe | Açıklama | Yayın sıklığı |
| ------- | ----------- | ----------------- |
| `<MAJOR_VERSION>` | Ana sürüm değişiklikleri önemli güncellemeleri, büyük yeni özellikleri veya kırıcı değişiklikleri ifade eder. +1 artar, örn. `4.x` ve `5.x`. | Her 6 ayda bir veya büyük değişiklikler gerektiğinde |
| `<MINOR_VERSION>` | Minör sürüm değişiklikleri mevcut işlevler içinde iyileştirmeler ve yeni kabiliyetleri içerir; yeni büyük kullanım senaryoları getirmez. +1 artar, örn. `5.0` ve `5.1`. | Aylık |
| `<PATCH_VERSION>` | Küçük hata düzeltmeleri veya belirli iyileştirmeler için yamalar. Yalnızca en son minör sürüme uygulanır. Numara, yayın dalındaki commit sayısına bağlı olarak sıralı artar (+1, +2, vb.). Örneğin, `5.1.0` ve `5.1.1`. | Gerektiğinde |
| `<BUILD_NUMBER>` (opsiyonel) | Wallarm Node’un kendisiyle ilgili olmayan değişiklikleri belirtir (örn., Helm chart’taki bağımlılık güncellemeleri). Bu numara yalnızca yama sürümleri arasında artifakta değişiklik yapıldıysa artar (örn., `5.1.0-1`, `5.1.0-2`). | Gerektiğinde |

Bu sürümleme yaklaşımı tüm Node türleri için eşit şekilde geçerlidir. Ancak, bağımsız olarak yayınlanırlar.

## Sürüm destek politikası

Wallarm, en son iki ana sürümü, bunların en son minör sürümleriyle sınırlı olmak üzere, hata düzeltmeleri, özellik güncellemeleri ve güvenlik yamalarıyla destekler. Örneğin, 6.x yayınlandıktan sonra yalnızca 5.x’in en son minör sürümü (örn., 5.12) desteklenecektir.

Yeni bir ana sürüm yayınlandığında, karşılık gelen sürümden iki önceki sürümün (örn., 6.x → 4.x) desteği 3 ay sonra sona erer.

Kullanımdan kaldırılan sürümler indirilebilir durumda kalır ancak artık güncellenmez.

## NGINX uyumluluğu

Çoğu NGINX Node artifaktı, upstream NGINX kaynaklarındaki kararlı sürümle hizalanır.

Örneğin, Wallarm Ingress Controller, [Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx) üzerine kuruludur. Bir upstream sürüm kullanımdan kaldırma için işaretlendiğinde, Wallarm 30 gün içinde yeni kararlı sürüme günceller ve bunu bir minör sürüm olarak yayınlar. Uyumluluğu sağlamak için güncellemeler daha erken yapılabilir ancak kullanımdan kaldırma işaretinden daha geçe kalınmaz.

## Yeni sürüm bildirimi

Wallarm, majör ve minör güncellemeler için sürüm notlarını şu kanallarda yayımlar:

* Kamuya açık dokümantasyon - bkz. [NGINX Node artifakt envanteri](node-artifact-versions.md) ve [Native Node artifakt envanteri](native-node/node-artifact-versions.md)
* [Ürün Değişiklik Günlüğü](https://changelog.wallarm.com/)
* Wallarm Console içindeki güncellemeler bölümü

    ![Wallarm Console’da yeni sürüm bildirimi](../images/updating-migrating/wallarm-console-new-version-notification.png)
* Wallarm Console içindeki her düğüm, **Up to date** durumunu gösterir veya her bileşen için mevcut güncellemeleri listeler.

    ![Düğüm kartı](../images/user-guides/nodes/view-regular-node-comp-vers.png)

## Yükseltme prosedürü

Majör ve minör güncellemeler için kurulum talimatları, yeni sürümlerle birlikte yayımlanır. Belirli artifaktların güncellenmesine ilişkin ayrıntılı adımlar için dokümantasyonda **Operations → Node Upgrade** bölümüne bakın.