# Müşteri verileri için paylaşılan sorumluluk güvenlik modeli

Wallarm, paylaşılan sorumluluk güvenlik modeline dayanıyor. Bu modelde, tüm tarafların (Wallarm ve müşterileri) müşterilerin verilerinin, kişisel olarak tanımlanabilir bilgiler (PII) ve kart hamili verileri de dahil olmak üzere güvenliği konusunda farklı sorumluluk alanları vardır.

Wallarm, iki ana bileşenin farklı sorumluluk alanlarında bulunduğu karma bir çözümdür (kısmen yazılım ve kısmen SaaS):

* **Wallarm filtreleme düğümü** yazılımı, altyapınızda dağıtılır ve tarafınızdan yönetilir. Wallarm düğüm bileşeni, son kullanıcı isteklerini filtrelemek, güvenli istekleri uygulamanıza göndermek ve kötü amaçlı istekleri engellemekten sorumludur. Wallarm düğümü, trafiği geçirir ve bir isteğin kötü amaçlı olup olmadığına yerel olarak karar verir. Trafik, analiz için Wallarm Bulutuna AYNALANMAZ.
* **Wallarm Bulutu**, Wallarm tarafından yönetilen bir bulut bileşenidir, filtreleme düğümlerinden işlenmiş istekler ve tespit edilen saldırılar hakkında meta-bilgileri almak; ayrıca uygulama özel filtrasyon kuralları oluşturmak ve bu kuralları düğümlerin indirmesi için mevcut hale getirmekten sorumludur. Wallarm Konsolu ve genel API, güvenlik raporlarını ve bireysel olayları görmenizi sağlar; trafik filtreleme kurallarını yönetmek, Wallarm Konsolu kullanıcılarını, harici entegrasyonları vs.

![Sorumluluk planı](../images/shared-responsibility.png)

## Wallarm sorumlulukları

Wallarm şu konularda sorumludur:

* Wallarm bulut ortamlarının güvenlik ve kullanılabilirliği, Wallarm filtreleme düğüm kodunun güvenliği ve dahili Wallarm sistemleri.

    Bu, sunucu düzeyinde yamanın, Wallarm bulut hizmetini sağlamak için gerekli hizmetlerin işletilmesinin, güvenlik hızma karşı testin, güvenlik olay günlüğünün ve izleme, olay yönetimi, operasyonel izleme ve 24/7 destek dahil fakat bunlarla sınırlı değildir. Wallarm ayrıca, Wallarm bulut ortamlarının sunucu ve çevre duvarı yapılandırmalarını (güvenlik grupları) yönetmekten sorumludur.

* Wallarm filtreleme düğüm bileşenini periyodik olarak güncellemek. Bu güncellemelerin uygulanmasının müşterinin sorumluluğunda olduğunu lütfen unutmayın.

* İstendiğinde, en son Wallarm SOC 2 Tip II denetim raporunun bir kopyasını sağlamak.

## Müşteri sorumlulukları

Wallarm müşterileri aşağıdaki konulardan sorumludur:

* Genel IT sistemine erişim ve sistem kullanım uygunluğu hakkında sağlam ve tutarlı dahili kontrolleri, Wallarm ile ilişkili tüm dahili bileşenler dahil olmak üzere uygulamak.

* Wallarm’ın hizmetleriyle ilgili herhangi bir materyal işlev ya da faaliyetlere daha önce dahil olan çalışanın işine son verilmiş olan kullanıcı hesaplarının kaldırılmasına uygulamak.

* Güvenlik çevrelerinden çıkan ve saldırıyla tespit edilmiş kötü niyetli isteklerin raporlanması olarak Wallarm bulutuna gönderilmiş olabilecek herhangi hassas veri için uygun [veri maskeleri kuralları](../user-guides/rules/sensitive-data-rule.md) yapılandırmak.

* Wallarm’ın hizmetleriyle ilgili müşteri kuruluşlarına ait işlemlerin uygun şekilde yetkilendirildiğinden emin olmak ve işlemlerin güvenli, zamanında ve tam olduğundan emin olmak.

* Hizmetleri tarafından sağlanan işlemlere direk dahil olan çalışanlarda Wallarm'ın hizmetlerinin gerçekleştirilmesiyle ilgili olarak herhangi bir değişiklikten Wallarm'ı zamanında haberdar etmek. Bu personel, Wallarm tarafından sağlanan hizmetlerle direk ilgili olan mali, teknik veya yardımcı idari fonksiyonlarda yer alabilir.

* Wallarm tarafından zamanında çıkarılmış olan yeni yazılım güncellemeleri ile filtreleme düğümlerini güncellemek.

* Bir iş sürekliliği ve afet kurtarma planı (BCDRP) geliştirmek ve gerektiğinde uygulamak, bu plan Wallarm tarafından sağlanan hizmetlerin devamını sağlayacaktır.

## Hassas verilerin maskelenmesi

Herhangi bir üçüncü taraf hizmeti ile olduğu gibi, bir Wallarm müşterisinin hangi müşteri verilerinin Wallarm'a gönderildiğini anlaması ve hassas verilerin asla Wallarm Bulutuna ulaşmayacağından emin olması önemlidir. PCI DSS, GDPR ve diğer gerekliliklere sahip Wallarm müşterilerinin hassas verileri özel kurallar kullanarak maskelenmesi önerilir.

Filtreleme düğümlerinden Wallarm Bulutuna iletilen ve herhangi hassas ayrıntıları içerebilecek tek veri, tespit edilmiş kötü niyetli istekler hakkında bilgidir. Bir kötü niyetli isteğin herhangi bir hassas veri içermesi oldukça düşük bir ihtimaldir. Ancak, önerilen yaklaşım, `token`, `password`, `api_key`, `email`, `cc_number`, vb. gibi PII veya kredi kartı bilgileri içerebilecek HTTP istek alanlarını maskelemektir. Bu yaklaşımı kullanmak, belirtilen bilgi alanlarının asla güvenlik sınırlarınızı terk etmeyeceğini garanti edecektir.

Bir filtreleme düğümünden Wallarm Bulutuna saldırı bilgilerini gönderirken hangi alanların (istek URI'sinde, başlıklarda veya gövdede) atlanması gerektiğini belirlemek için **Hassas verileri maskelene** adında özel bir kural uygulayabilirsiniz. Verilerin maskelenmesi hakkında daha fazla bilgi için, lütfen [belgeye](../user-guides/rules/sensitive-data-rule.md) bakın veya [Wallarm destek ekibi](mailto:request@wallarm.com) ile iletişime geçin.