# Wallarm'ın Hizmet Düzeyi Sözleşmesi (SLA)

Bu makale, Wallarm'ın hizmet düzeyinin hizmet kullanılabilirlik süresi yüzdesi, olası problem sınıflandırması ve bunlara ilişkin yanıt ve çözüm süreleri gibi yönlerini açıklar. Müşteri bağlamına olan [güçlü bağımlılık](#normal-functioning-characteristics) nedeniyle, normal işleyiş özellikleri bu SLA'da açıklanmamıştır.

## Genel beyan

Wallarm, her takvim ayında Hizmetleri en az %99,95 oranında kullanılabilir kılmak için ticari olarak makul çabayı gösterir.

## Problem sınıflandırması

Aşağıdakiler, Wallarm hizmetlerinde meydana gelebilecek sorunları sınıflandırır ve önceliklendirir:

| Öncelik düzeyi | Problem sınıflandırması | Açıklama |
| ------- | ------- | ------- |
| 1 | Acil | Hizmetler tamamen kullanılamaz durumda ya da performans Hizmetleri kullanılamaz kılacak kadar düşüktür. |
| 2 | Yüksek | Hizmetlerin temel bir işlevi kullanılamaz; bu durum sınırlı işlevselliğe yol açar veya çok sayıda Yetkili Kullanıcıyı etkiler. |
| 3 | Orta | Hizmetlerin işlevselliğini ciddi şekilde etkilemeyen bir işlev veya kaynağın kaybı vardır. |
| 4 | Düşük | Diğer tüm hizmet talepleri; genel kullanım soruları veya iyileştirme talepleri gibi. |

Wallarm Destek ekibiyle herhangi bir iletişim kanalı üzerinden iletişime geçerken talebinizin önceliğini belirleyebilirsiniz; örneğin, [Customer Portal](https://wallarm.atlassian.net/servicedesk/customer/portal/5) üzerinden yeni bir hizmet talebi oluştururken **Priority** alanını ayarlayarak. Belirlenen öncelik, [Wallarm Destek Eskalasyon ve Olay Süreci](https://wallarm.atlassian.net/servicedesk/customer/portal/5/article/4319051777) kapsamında Destek Ekibi tarafından veya sizin tarafınızdan değiştirilebilir.

## Yanıt ve çözüm süresi

Aşağıdakiler, sorunlar meydana geldiğinde Wallarm'ın hizmet düzeylerini açıklar:

| Problem sınıflandırması | İlk yanıt‍ (yoğun olmayan saatler) | Çözüm/‍hafifletme | Durum güncellemeleri |
| ------- | ------- | ------- | ------- |
| Acil | 2 saat | 4 saat | Her 30 dakikada bir |
| Yüksek | 3 saat | 24 saat | Her 4 saatte bir |
| Orta | 12 saat | [Bir sonraki planlı sürüm](updating-migrating/versioning-policy.md) | Haftalık |
| Düşük | 36 saat | Üç ayda bir | Ayda iki kez |

Durum güncellemeleri, [Customer Portal](https://wallarm.atlassian.net/servicedesk/customer/portal/5) üzerinden açılan hizmet talebine yapılan yorumlar şeklinde iletilir ve her yeni yorum veya değişiklik için e-posta/Slack bildirimiyle birlikte gelir. Tüm hizmet talepleriniz, Customer Portal profilinizde listelenir.

## Normal işleyiş özellikleri {#normal-functioning-characteristics}

Wallarm hizmetlerinin kullanılabilirliği ve hızı ile [sorumlulukların paylaşımı](about-wallarm/shared-responsibility.md), belirli müşteri bağlamıyla ilgili birçok faktöre güçlü biçimde bağlıdır ve müşteriden müşteriye değişir. Bu faktörler şunlarla sınırlı olmamak üzere şunları içerir:

* Müşterinin ağ altyapısı, konfigürasyonu ve bağlantısı
* Seçilen Wallarm [dağıtım biçimi](about-wallarm/overview.md#where-wallarm-works)
* Seçilen Wallarm dağıtım seçeneği: [Security Edge](installation/security-edge/overview.md), [self-hosted](installation/supported-deployment-options.md) veya [Connector](installation/connectors/overview.md)
* Etkin Wallarm [bileşenleri ve işlevleri](about-wallarm/overview.md)
* Trafik hacmi, özellikleri ve yoğunluğu

Yukarıda belirtilen nedenlerle, normal işleyiş özellikleri bu SLA'da belirli sayısal değerlerle açıklanmamıştır.

## Daha fazla ayrıntı

Wallarm'ın resmi sitesindeki [Hizmet Düzeyi Sözleşmesi](https://www.wallarm.com/service-level-agreement) sayfasında daha fazla ayrıntı ve ilgili bilgileri bulabilirsiniz.