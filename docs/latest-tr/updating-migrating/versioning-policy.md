# Wallarm Node Sürüm Politikası

Bu belge, [NGINX-based and Native Nodes](../installation/nginx-native-node-internals.md) olarak sunulan kendi kendine barındırılan filtreleme nodları için Wallarm'ın sürüm politikasını detaylandırmaktadır. Sürüm standartlarını, yayın takvimlerini ve uyumluluk yönergelerini kapsar; böylece node sürümlerini etkili bir şekilde seçebilir, güncelleyebilir ve yönetebilirsiniz.

Her node sürümü, Docker imajları, Helm charts veya all-in-one kurulum paketleri gibi bir dizi artifact olarak, farklı platformlarda dağıtım için paketlenmiş şekilde yayınlanır.

Bu belge, Edge node sürümlendirmesini kapsamaz çünkü bu, Wallarm tarafından otomatik olarak en son stabil sürüme yükseltilen yönetilen bir çözümdür.

## Sürüm Listesi

| NGINX Node version       | Native Node version | Release date   | Support until   |
|--------------------------|---------------------|----------------|-----------------|
|2.18 and lower 2.x        | -                   |                | November 2021   |
| 3.6 and lower 3.x        | -                   | October 2021   | November 2022   |
| 4.6 and lower 4.x        | -                   | June 2022      | April 2024      |
| 4.8                     | -                   | October 2023   | November 2024   |
| 4.10                    | -                   | January 2024   |                 |
| 5.x                     | 0.x                 | July 2024      |                 |

## Sürüm Yapısı

Node sürümleri şu formatı izler:

```bash
<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>[-<BUILD_NUMBER>]
```

| Element           | Açıklama | Yayın sıklığı |
|-------------------|----------|---------------|
| `<MAJOR_VERSION>` | Ana sürüm değişiklikleri, önemli güncellemeleri, büyük yeni özellikleri veya uyumsuz değişiklikleri gösterir. +1 artışla yükselir, örneğin `4.x` ve `5.x`. | Her 6 ayda bir veya büyük değişiklikler gerektiğinde |
| `<MINOR_VERSION>` | Minör sürüm değişiklikleri, mevcut fonksiyonellik içerisindeki iyileştirmeleri ve yeni yetenekleri içerir, büyük yeni kullanım durumları eklemez. +1 artışla yükselir, örneğin `5.0` ve `5.1`. | Aylık |
| `<PATCH_VERSION>` | Minör hata düzeltmeleri veya belirli iyileştirmeler için yamalar. Sadece en son minör sürüme uygulanır. Sayı, yayın dalındaki commit sayısına bağlı olarak sıralı şekilde artar (+1, +2, vb.). Örneğin, `5.1.0` ve `5.1.1`. | Gerektiğinde |
| `<BUILD_NUMBER>` (opsiyonel) | Wallarm Node ile doğrudan ilişkilendirilmeyen değişiklikleri belirtir (örneğin, Helm chart'taki bağımlılık güncellemeleri). Bu sayı, yama sürümleri arasında artifact'a değişiklik yapıldığında artış gösterir (örneğin, `5.1.0-1`, `5.1.0-2`). | Gerektiğinde |

Bu sürümlendirme yaklaşımı hem NGINX hem de Native Node'lar için eşit şekilde uygulanır. Bir node türündeki ana sürümler, diğerinde de yansıtılır.

## Sürüm Destek Politikası

Wallarm, hata düzeltmeleri, özellik güncellemeleri ve güvenlik yamaları ile sadece en son iki ana sürümü, bunların en yeni minör sürümleriyle sınırlı olarak destekler. Örneğin, 6.x sürümü yayınlandığında, 5.x'in yalnızca en son minör sürümü (örneğin, 5.12) desteklenecektir.

Yeni bir ana sürüm yayınlandığında, ilgili sürümden iki gerideki sürümün (örneğin, 6.x → 4.x) desteği 3 ay sonra sona erer.

Kullanım dışı bırakılan sürümler indirilebilir durumda kalır, ancak artık güncellenmez.

## NGINX Uyumluluğu

Çoğu NGINX Node artifact'ı, yukarı akıştaki NGINX kaynaklarından alınan stabil sürüm ile uyumlu hale getirilmiştir.

Örneğin, Wallarm Ingress Controller, [Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx)'a dayanmaktadır. Bir yukarı akış sürümü kullanım dışı bırakılmak üzere işaretlendiğinde, Wallarm 30 gün içinde yeni stabil sürüme günceller ve bunu minör bir sürüm olarak yayınlar. Uyumluluğu sağlamak adına güncellemeler daha erken gerçekleşebilir, ancak deprecation bildiriminin ötesine geçmez.

## Yeni Sürüm Bildirimi

Wallarm, ana ve minör güncellemeler için sürüm notlarını aşağıdakilerde yayınlar:

* Kamu Dokümantasyonu - [NGINX Node artifact inventory](node-artifact-versions.md) ve [Native Node artifact inventory](native-node/node-artifact-versions.md)'e bakın
* [Product Changelog](https://changelog.wallarm.com/)
* Wallarm Console'daki güncellemeler bölümü

    ![Wallarm Console'da yeni bir sürüm bildirimi](../images/updating-migrating/wallarm-console-new-version-notification.png)
* Wallarm Console'daki her node, **Güncel** durumunu gösterir veya her bileşen için mevcut güncellemeleri listeler.

    ![Node kartı](../images/user-guides/nodes/view-regular-node-comp-vers.png)

## Yükseltme Prosedürü

Ana ve minör güncellemeler için kurulum talimatları, yeni sürümlerle birlikte yayınlanır. Belirli artifact'ların güncellenmesi için ayrıntılı adımlar hakkında bilgi almak için dokümantasyonda **Operations → Node Upgrade** bölümüne bakın.