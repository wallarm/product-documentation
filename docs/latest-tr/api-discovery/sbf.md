# Hassas İş Akışları <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Hassas iş akışı özelliği sayesinde, Wallarm'ın [API Discovery](overview.md) aracı; kimlik doğrulama, hesap yönetimi, faturalandırma ve benzeri kritik yetenekler gibi belirli iş akışları ve fonksiyonlar için hayati önem taşıyan uç noktaları otomatik olarak tanımlayabilir. Bu makalede, hassas iş akışı işlevselliğinin nasıl kullanılacağını öğrenin.

NGINX Node 5.2.11 veya Native Node 0.10.1 veya daha üst bir sürüm gerekmektedir.

## Ele Alınan Sorunlar

Hassas iş akışlarının kötüye kullanılması, OWASP API Top 10 riskleri arasında altıncı sırada yer almaktadır ([API6](https://owasp.org/API-Security/editions/2023/en/0xa6-unrestricted-access-to-sensitive-business-flows/)). Bu hassas iş akışlarını korumak; iş sürekliliğini sağlar, hassas verilerin sızmasını, itibar kaybını ve finansal zararı önler.

Hassas iş akışları özelliği ile Wallarm, iş açısından kritik fonksiyonların sağlığını ortaya koyar ve şunlara yardımcı olur:

* Hassas iş akışı ile ilişkili uç noktaları düzenli olarak izlemek ve denetlemek.
* Geliştirme, bakım ve güvenlik çalışmaları için önceliklendirmek.
* Daha güçlü güvenlik önlemleri uygulamak (örneğin, şifreleme, kimlik doğrulama, erişim kontrolleri ve hız sınırlamaları).
* Denetim izlerini ve veri koruma önlemlerinin kanıtlarını kolaylıkla oluşturmak.

## Otomatik Etiketleme

Kolaylık olması açısından, API Discovery, uç noktaları otomatik olarak hassas iş akışlarına ait olarak etiketler - yeni bir uç nokta keşfedildiğinde, bu uç noktanın bir veya daha fazla hassas iş akışına ait olma potansiyelini kontrol eder:

--8<-- "../include/default-sbf.md"

Otomatik kontroller, uç nokta URL'sindeki anahtar kelimeler kullanılarak gerçekleştirilir. Örneğin; `payment`, `subscription` veya `purchase` gibi anahtar kelimeler, uç noktayı otomatik olarak **Faturalandırma** akışı ile ilişkilendirirken, `auth`, `token` veya `login` gibi anahtar kelimeler uç noktayı **Kimlik Doğrulama** akışıyla bağlar. Eşleşmeler tespit edildiğinde, uç nokta otomatik olarak uygun akışa atanır.

## Uç Noktaları Manuel Etiketleme

[Otomatik etiketleme](#automatic-tagging) sonuçlarını ayarlamak için, uç noktanın ait olduğu hassas iş akışları listesini manuel olarak düzenleyebilirsiniz. Ayrıca, anahtar kelime listesine doğrudan uymayan uç noktaları da manuel olarak etiketleyebilirsiniz.

Uç noktanın ait olduğu iş akışı listesini düzenlemek için, Wallarm Console'da API Discovery bölümüne gidin; ardından, uç noktanız için **Business flow & sensitive data** kısmında listeden bir veya daha fazla iş akışı seçin.

![API Discovery - Hassas İş Akışları](../images/about-wallarm-waf/api-discovery/api-discovery-sbf.png)

Aynısını uç nokta detaylarında da yapabilirsiniz.

## Oturumlardaki İş Akışları

Wallarm'ın [API Sessions](../api-sessions/overview.md) aracı, kullanıcı aktivitelerinin tam sırasını sunarak kötü niyetli aktörlerin mantığına daha fazla görünürlük kazandırır. Eğer bir oturumun istekleri, API Discovery'de hassas iş akışları için önemli olarak etiketlenen uç noktaları etkiliyorsa, bu oturum otomatik olarak [etiketlenir](../api-sessions/exploring.md#sensitive-business-flows) ve ilgili iş akışını etkilediği belirtilir.

Oturumlar hassas iş akışı etiketleri ile atandıktan sonra, belirli bir iş akışına göre filtreleme yapılabilir; bu durum, analiz edilmesi en önemli oturumların seçilmesini kolaylaştırır.

![!API Sessions - hassas iş akışları](../images/api-sessions/api-sessions-sbf-no-select.png)

## İş Akışına Göre Filtreleme

Uç noktalar hassas iş akışı etiketleri ile atandıktan sonra, tüm keşfedilen uç noktaları belirli bir iş akışına göre filtrelemek (**Business flow** filtresi) mümkün hale gelir; bu durum en kritik iş yeteneklerini korumayı kolaylaştırır.

![API Discovery - Hassas iş akışlarına göre filtreleme](../images/about-wallarm-waf/api-discovery/api-discovery-sbf-filter.png)