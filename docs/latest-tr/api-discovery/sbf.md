# Hassas İş Akışları <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Hassas iş akışı yeteneğiyle Wallarm'ın [API Discovery](overview.md) özelliği, kimlik doğrulama, hesap yönetimi, faturalama ve benzeri kritik yetenekler gibi belirli iş akışları ve işlevler için kritik olan uç noktaları otomatik olarak tanımlar. Bu makaleden hassas iş akışı işlevini nasıl kullanacağınızı öğrenin.

NGINX Node 5.2.11 veya Native Node 0.10.1 ya da üzeri gereklidir.

## Ele alınan sorunlar

Hassas iş akışlarının kötüye kullanımı, OWASP API Top 10 riskleri arasında altıncı sırada ([API6](https://owasp.org/API-Security/editions/2023/en/0xa6-unrestricted-access-to-sensitive-business-flows/)) yer alır. Bu hassas iş akışlarını korumak, iş sürekliliğini sağlar, hassas verilerin sızdırılmasını, itibar risklerini ve finansal zararları önler.

Hassas iş akışları yeteneğiyle Wallarm, işletme açısından kritik işlevlerin sağlık durumunu vurgular ve şunlara yardımcı olur:

* Hassas iş akışlarıyla ilişkili uç noktaları zafiyet veya ihlaller açısından düzenli olarak izlemek ve denetlemek.
* Geliştirme, bakım ve güvenlik çalışmalarında bunlara öncelik vermek.
* Daha güçlü güvenlik önlemleri uygulamak (örn. şifreleme, kimlik doğrulama, erişim kontrolleri ve hız sınırları).
* Denetim izlerini ve veri koruma önlemlerine ilişkin kanıtları kolayca üretmek.

## Otomatik etiketleme

Kolaylık olması için, API Discovery uç noktaları hassas iş akışlarına ait olup olmadıklarıyla otomatik olarak etiketler - yeni bir uç nokta keşfedildiğinde, bu uç noktanın bir veya daha fazla hassas iş akışına potansiyel olarak ait olup olmadığını kontrol eder:

--8<-- "../include/default-sbf.md"

Otomatik kontroller, uç nokta URL'sindeki anahtar kelimeler kullanılarak gerçekleştirilir. Örneğin, `payment`, `subscription` veya `purchase` gibi anahtar kelimeler, uç noktayı otomatik olarak **Billing** akışıyla ilişkilendirirken; `auth`, `token` veya `login` gibi anahtar kelimeler onu **Authentication** akışıyla ilişkilendirir. Eşleşme algılanırsa uç nokta otomatik olarak uygun akışa atanır.

Otomatik etiketleme, hassas iş akışlarının çoğunu keşfeder. Ancak, aşağıdaki bölümde açıklandığı gibi atanan iş akışlarının listesini manuel olarak da ayarlamak mümkündür.

## Uç noktaları manuel etiketleme

[otomatik etiketleme](#automatic-tagging) sonuçlarını ayarlamak için, uç noktanın ait olduğu hassas iş akışları listesini manuel olarak düzenleyebilirsiniz. Anahtar kelime listesine doğrudan girmeyen uç noktaları da manuel olarak etiketleyebilirsiniz.

Uç noktanın ait olduğu akışların listesini düzenlemek için Wallarm Console içinde API Discovery'ye gidin; ardından uç noktanız için, **Business flow & sensitive data** bölümünde listeden bir veya birkaç akış seçin.

![API Discovery - Hassas iş akışları](../images/about-wallarm-waf/api-discovery/api-discovery-sbf.png)

Aynısını uç nokta ayrıntılarında da yapabilirsiniz.

## Oturumlarda iş akışları

Wallarm'ın [API Sessions](../api-sessions/overview.md) özelliği, size kullanıcı aktivitelerinin tam dizisini sunmak ve böylece kötü niyetli aktörlerin mantığına daha fazla görünürlük sağlamak için kullanılır. Bir oturumun istekleri, API Discovery içinde bazı hassas iş akışları için önemli olarak etiketlenen uç noktaları etkiliyorsa, bu oturum da ilgili iş akışını etkiliyor olarak otomatik olarak [etiketlenir](../api-sessions/exploring.md#sensitive-business-flows).

Oturumlara hassas iş akışı etiketleri atandıktan sonra, onları belirli bir iş akışına göre filtrelemek mümkün hale gelir; bu da analiz edilmesi en önemli oturumları seçmeyi kolaylaştırır.

![!API Sessions - hassas iş akışları](../images/api-sessions/api-sessions-sbf-no-select.png)

## İş akışına göre filtreleme

Uç noktalara hassas iş akışı etiketleri atandıktan sonra, keşfedilen tüm uç noktaları belirli bir iş akışına göre filtrelemek (the **Business flow** filter) mümkün hale gelir; bu da en kritik iş yeteneklerini korumayı kolaylaştırır.

![API Discovery - Hassas iş akışlarına göre filtreleme](../images/about-wallarm-waf/api-discovery/api-discovery-sbf-filter.png)