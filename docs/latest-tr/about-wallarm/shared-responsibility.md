# Müşterilerin Verileri için Paylaşılan Sorumluluk Güvenlik Modeli

Wallarm, paylaşılan sorumluluk güvenlik modeline dayanmaktadır. Bu modelde, müşterilerin verilerinin güvenliği (kişisel olarak tanımlanabilir bilgiler (PII) ve Kart Sahibi Verileri dahil) söz konusu olduğunda, tüm tarafların (Wallarm ve müşterileri) farklı sorumluluk alanları bulunmaktadır.

Wallarm, farklı sorumluluk alanlarında iki ana bileşene sahip hibrit bir çözümdür (parça yazılım, parça SaaS):

* **Wallarm filtering node** yazılımı, altyapınıza kurulmuş olup sizin tarafınızdan yönetilir. Wallarm node bileşeni, son kullanıcı isteklerini filtrelemek, uygulamanıza güvenli istekler göndermek ve kötü amaçlı istekleri engellemekten sorumludur. Wallarm node, trafiği iletir ve bir isteğin kötü amaçlı olup olmadığına yerel olarak karar verir. Trafik analiz için Wallarm Cloud'a yansıtılmaz.
* **Wallarm Cloud**, Wallarm tarafından yönetilen bir bulut bileşenidir ve filtreleme nodelarından işlenen isteklerle ilgili meta bilgileri ve tespit edilen saldırıları almak; ayrıca uygulamaya özel filtreleme kuralları oluşturup bunların nodeların indirmesi için kullanılabilir hale getirilmesinden sorumludur. Wallarm Console ve genel API, güvenlik raporlarını ve bireysel olayları görme; trafik filtreleme kuralları, Wallarm Console kullanıcıları, dış entegrasyonlar vb. yönetimine olanak tanır.

![Sorumluluklar Şeması](../images/shared-responsibility.png)

## Wallarm Sorumlulukları

Wallarm aşağıdaki noktalardan sorumludur:

* Wallarm bulut ortamlarının güvenliği ve erişilebilirliği, Wallarm filtering node kodunun güvenliği ve iç Wallarm sistemlerinin güvenliği.

    Buna, ancak bunlarla sınırlı olmamak üzere: sunucu düzeyi yamaları, Wallarm bulut hizmetini sunmak için gerekli servislerin işletilmesi, güvenlik açıkları testi, güvenlik olay kaydı ve izleme, olay yönetimi, operasyonel izleme ve 7/24 destek dahildir. Wallarm ayrıca Wallarm bulut ortamlarının sunucu ve çevresel güvenlik duvarı yapılandırmalarını (güvenlik grupları) yönetmekle de sorumludur.

* Wallarm filtering node bileşeninin periyodik olarak güncellenmesi. Bu güncellemelerin uygulanmasının müşterinin sorumluluğunda olduğunu unutmayın.

* İstenildiği takdirde, size en güncel Wallarm SOC 2 Type II denetim raporunun bir kopyasını sağlamaktır.

## Müşteri Sorumlulukları

Wallarm müşterileri aşağıdaki noktalardan sorumludur:

* Wallarm ile ilişkili tüm dahili bileşenler için genel BT sistem erişimi ve sistem kullanım uygunluğu konusunda sağlam ve tutarlı dahili kontrollerin uygulanması, buna Wallarm filtering node ve Wallarm Cloud da dahildir.

* Wallarm hizmetleriyle ilişkili önemli fonksiyonlar veya faaliyetlerde daha önce yer alan ve artık görevde olmayan kullanıcı hesaplarının kaldırılmasını uygulamak.

* Müşteri güvenlik alanını terk edebilecek ve tespit edilen kötü amaçlı isteklerin raporlanması kapsamında Wallarm Cloud'a gönderilen herhangi bir hassas veri için uygun [veri maskeleme kuralları](../user-guides/rules/sensitive-data-rule.md) yapılandırmak.

* Wallarm hizmetleriyle ilişkili müşteri organizasyonları için işlemlerin uygun şekilde yetkilendirildiğinden, işlemlerin güvenli, zamanında ve eksiksiz olduğundan emin olmak.

* Wallarm tarafından gerçekleştirilen hizmetlerle doğrudan ilgilenen personeldeki herhangi bir değişikliği Wallarm'a zamanında bildirmek. Bu personel, Wallarm tarafından sağlanan hizmetlerle doğrudan ilişkili finansal, teknik veya ek idari işlevlerde yer alabilir.

* Wallarm tarafından yayınlanan yeni yazılım güncellemeleriyle filtering nodeların zamanında güncellenmesi.

* Wallarm tarafından sağlanan hizmetlerin devamını destekleyecek bir iş sürekliliği ve felaket kurtarma planı (BCDRP) geliştirmek ve gerekirse uygulamaya koymak.

## Hassas Verilerin Maskelemesi

Herhangi bir üçüncü taraf hizmette olduğu gibi, bir Wallarm müşterisinin hangi müşteri verilerinin Wallarm'a gönderildiğini anlaması ve hassas verilerin hiçbir zaman Wallarm Cloud'a ulaşmayacağından emin olması önemlidir. PCI DSS, GDPR ve diğer gereksinimlere sahip Wallarm müşterilerinin özel kurallar kullanarak hassas verileri maskelemeleri önerilir.

Filtreleme nodelardan Wallarm Cloud'a gönderilen ve hassas detaylar içerebilecek tek veri, tespit edilen kötü amaçlı isteklerle ilgili bilgilerdir. Kötü amaçlı bir isteğin herhangi bir hassas veri içermesi oldukça düşük bir ihtimaldir. Ancak, önerilen yaklaşım, `token`, `password`, `api_key`, `email`, `cc_number` vb. gibi PII veya kredi kartı detayları içerebilecek HTTP istek alanlarını maskelemektir. Bu yaklaşım, belirtilen bilgi alanlarının güvenlik çevrenizden asla çıkmayacağının garantisini verecektir.

Filtreleme nodedan Wallarm Cloud'a saldırı bilgilerini gönderirken hangi alanların (istek URI'si, başlıkları veya gövdesi içerisinde) hariç tutulması gerektiğini belirtmek için **Mask sensitive data** adlı özel bir kural uygulayabilirsiniz. Verilerin maskelemesi hakkında ek bilgi için lütfen [belgeye](../user-guides/rules/sensitive-data-rule.md) bakın veya [Wallarm destek ekibi](mailto:request@wallarm.com) ile iletişime geçin.