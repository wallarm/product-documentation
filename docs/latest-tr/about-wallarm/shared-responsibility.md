[link-deployment-se]:           ../installation/security-edge/overview.md
[link-deployment-hybrid]:       ../installation/supported-deployment-options.md
[link-deployment-on-prem]:      ../installation/on-premise/overview.md

# Müşteri Verileri için Paylaşılan Sorumluluk

Wallarm, paylaşılan sorumluluk güvenlik modeline dayanır. Bu modelde, tüm tarafların (Wallarm ve müşterileri) müşteri verilerinin güvenliği söz konusu olduğunda, kişisel olarak tanımlanabilir bilgiler (PII) ve kart sahibi verileri dahil olmak üzere farklı sorumluluk alanları vardır.

## Genel Bakış

Wallarm'ın iki ana bileşeni vardır: **Wallarm filtering node** ve **Wallarm Cloud**. Genel açıklamalarını [burada](../about-wallarm/overview.md#how-wallarm-works) görebilirsiniz. Bu bileşenler, Wallarm ile müşterinin sorumluluklarının farklı şekilde paylaşıldığı üç formdan biriyle dağıtılabilir:

--8<-- "../include/deployment-forms.md"

![Sorumluluklar şeması](../images/shared-responsibility-variants.png)

## Security Edge

Bu dağıtım biçiminde, hem Wallarm filtering node'lar hem de Wallarm Cloud bileşenleri Wallarm tarafından yönetilir; dolayısıyla sorumlulukların çoğu Wallarm tarafındadır.

**Wallarm'ın sorumlulukları**

* Wallarm bulut ortamlarının güvenliği ve erişilebilirliği, Wallarm filtering node kodunun güvenliği ve Wallarm'ın dahili sistemlerinin güvenliği.

    Buna şunlar dahildir ancak bunlarla sınırlı değildir: sunucu düzeyinde yamalama, Wallarm bulut hizmetini sunmak için gerekli hizmetlerin işletilmesi, zafiyet testleri, güvenlik olaylarının günlüklenmesi ve izlenmesi, olay yönetimi, operasyonel izleme ve 7/24 destek. Wallarm ayrıca Wallarm bulut ortamlarının sunucu ve çevre güvenlik duvarı yapılandırmalarını (güvenlik grupları) yönetmekten sorumludur.

* [Edge Inline Node](../installation/security-edge/inline/upgrade-and-management.md#upgrading-the-edge-inline) veya [Edge Connector Node](../installation/security-edge/se-connector.md#upgrading-the-edge-node) bileşenlerinin [periyodik olarak](../updating-migrating/versioning-policy.md) yükseltilmesi.
* Talep edilmesi halinde en son Wallarm SOC 2 Type II denetim raporunun bir kopyasının sağlanması.
* Wallarm tarafından sunulan hizmetlerin sürekliliğine yardımcı olacak bir iş sürekliliği ve felaket kurtarma planının (BCDRP) geliştirilmesi ve gerekli olduğunda uygulanması.

**Müşteri sorumlulukları**

* Wallarm'ın hizmetleriyle ilişkili herhangi bir esaslı fonksiyon veya faaliyette daha önce yer almış ve iş akdi sonlandırılmış kullanıcıların kullanıcı hesaplarının kaldırılmasını uygulamak.
* Wallarm tarafından gerçekleştirilen hizmetlerle doğrudan ilgili personeldeki değişiklikleri zamanında Wallarm’a bildirmek. Bu personel, Wallarm tarafından sağlanan hizmetlerle doğrudan ilişkili finansal, teknik veya yardımcı idari işlevlerde görev alabilir.

## Hibrit

Bu dağıtım biçiminde, Wallarm müşterileri Wallarm filtering node'ları dağıtır ve yönetir; Wallarm ise Wallarm Cloud bileşenini yönetir; dolayısıyla sorumluluklar eşit şekilde paylaşılır.

**Wallarm'ın sorumlulukları**

* Wallarm bulut ortamlarının güvenliği ve erişilebilirliği, Wallarm filtering node kodunun güvenliği ve Wallarm'ın dahili sistemlerinin güvenliği.
* Wallarm filtering node bileşeninin [periyodik olarak](../updating-migrating/versioning-policy.md) güncellenmesi. Bu güncellemelerin uygulanmasının müşterinin sorumluluğunda olduğunu lütfen unutmayın.
* Talep edilmesi halinde en son Wallarm SOC 2 Type II denetim raporunun bir kopyasının sağlanması.

**Müşteri sorumlulukları**

Wallarm müşterileri aşağıdaki hususlardan sorumludur:

* Wallarm ile ilişkili tüm dahili bileşenler (Wallarm filtering node ve Wallarm Cloud dahil) için genel BT sistemi erişimi ve sistem kullanımının uygunluğuna yönelik sağlam ve tutarlı iç kontrollerin uygulanması.

* Wallarm’ın hizmetleriyle ilişkili herhangi bir esaslı fonksiyon veya faaliyette daha önce yer almış ve iş akdi sonlandırılmış kullanıcıların kullanıcı hesaplarının kaldırılmasını uygulamak.

* Müşterinin güvenlik çevresini terk edebilecek ve tespit edilen kötü amaçlı isteklerin raporlanmasının bir parçası olarak Wallarm Cloud'a gönderilen hassas veriler için uygun [veri maskeleme kurallarını](../user-guides/rules/sensitive-data-rule.md) yapılandırmak.

* Wallarm’ın hizmetleriyle ilgili müşteri kuruluşlarına ait işlemlerin uygun şekilde yetkilendirildiğini ve işlemlerin güvenli, zamanında ve eksiksiz olduğunu sağlamak.

* Wallarm tarafından gerçekleştirilen hizmetlerle doğrudan ilgili personeldeki değişiklikleri zamanında Wallarm’a bildirmek. Bu personel, Wallarm tarafından sağlanan hizmetlerle doğrudan ilişkili finansal, teknik veya yardımcı idari işlevlerde görev alabilir.

* Wallarm tarafından yayımlanan yeni yazılım güncellemeleriyle filtering node'ları zamanında güncellemek.

* Wallarm tarafından sunulan hizmetlerin sürekliliğine yardımcı olacak bir iş sürekliliği ve felaket kurtarma planının (BCDRP) geliştirilmesi ve gerekli olduğunda uygulanması.

## On-Premise

Bu dağıtım biçiminde, hem Wallarm filtering node hem de Wallarm Cloud bileşenleri müşteri tarafından barındırılır ve yönetilir; dolayısıyla sorumlulukların (kontrol ile birlikte) çoğu müşteri tarafına aittir.

**Wallarm'ın sorumlulukları**

* Wallarm filtering node ve Cloud kodunun güvenliği.
* Wallarm filtering node ve Cloud bileşenlerinin periyodik olarak güncellenmesi. Bu güncellemelerin uygulanmasının müşterinin sorumluluğunda olduğunu lütfen unutmayın.

**Müşteri sorumlulukları**

* Wallarm filtering node'ların ve Cloud dağıtımı için kullanılan ortamların güvenliğini ve erişilebilirliğini sağlamak.
* Wallarm tarafından yayımlanan yeni yazılım güncellemeleriyle filtering node'ları ve Cloud'u zamanında güncellemek.
* Wallarm ile ilişkili tüm dahili bileşenler (Wallarm filtering node ve Wallarm Cloud dahil) için genel BT sistemi erişimi ve sistem kullanımının uygunluğuna yönelik sağlam ve tutarlı iç kontrollerin uygulanması.
* Wallarm’ın hizmetleriyle ilişkili herhangi bir esaslı fonksiyon veya faaliyette daha önce yer almış ve iş akdi sonlandırılmış kullanıcıların kullanıcı hesaplarının kaldırılmasını uygulamak.
* Wallarm’ın hizmetleriyle ilgili müşteri kuruluşlarına ait işlemlerin uygun şekilde yetkilendirildiğini ve işlemlerin güvenli, zamanında ve eksiksiz olduğunu sağlamak.
* Wallarm tarafından sunulan hizmetlerin sürekliliğine yardımcı olacak bir iş sürekliliği ve felaket kurtarma planının (BCDRP) geliştirilmesi ve gerekli olduğunda uygulanması.

## Wallarm Cloud'da Müşteri Verilerinin Depolanması

Wallarm'ın hibrit ve bulut dağıtımlarında, filtering node'lardan gönderilen tüm veriler, tamamen Wallarm tarafından yönetilen Wallarm Cloud'da depolanır:

* İstek ve saldırı verileri PostgreSQL veritabanında saklanır; ilişkili içerik Google Cloud Storage (S3 ile uyumlu) üzerinde kalıcı hale getirilir ve performans için Redis'te önbelleğe alınır. Google Cloud dışındaki üçüncü taraf hizmetler kullanılmaz.
* Tüm depolama, Wallarm’ın güvenli altyapısının bir parçası olarak Google Cloud Platform üzerinde barındırılır.
* GCP, GDPR ve diğer uluslararası veri koruma standartlarına uygundur; bu da veri güvenliği ve gizliliğini sağlar.
* Wallarm, verilerin tercih edilen yargı bölgeleri içinde kalmasını sağlamak için birden fazla [bölgede](overview.md#cloud) (ABD ve AB) dağıtımı destekler.