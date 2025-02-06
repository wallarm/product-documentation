[api-discovery-enable-link]:        ../api-discovery/setup.md#enable

# GraphQL API Koruması <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm, temel [WAAP](../about-wallarm/subscription-plans.md#waap-and-advanced-api-security) abonelik planı kapsamında olsa bile GraphQL [üzerinde](../user-guides/rules/request-processing.md#gql) düzenli saldırıları (SQLi, RCE, [vb.](../attacks-vulns-list.md)) tespit eder. Bununla birlikte, protokolün bazı özellikleri aşırı bilgi ifşası ve DoS ile ilişkili [GraphQL'e özgü](../attacks-vulns-list.md#graphql-attacks) saldırıların uygulanmasına olanak tanır. Bu belge, GraphQL istekleri için bir dizi sınır (GraphQL politikası) belirleyerek API'larınızı bu saldırılardan korumak için Wallarm'ın nasıl kullanılacağını anlatır.

Extended protection (gelişmiş koruma) niteliğinde olan GraphQL API Koruması, gelişmiş [API Security](../about-wallarm/subscription-plans.md#waap-and-advanced-api-security) abonelik planının bir parçasıdır. Plan satın alındığında, korumayı başlatmak için kuruluşunuzun GraphQL politikasını **Detect GraphQL attacks** [kuralında](../user-guides/rules/rules.md) (node 4.10.4 ve üzeri gerekir) ayarlayın.

## Supported GraphQL formats

GraphQL sorguları tipik olarak bir GraphQL sunucu uç noktasına HTTP POST istekleri olarak gönderilir. İstek, sunucuya gönderilen gövdenin medya tipini belirtmek için bir `CONTENT-TYPE` başlığı içerir. Wallarm, `CONTENT-TYPE` için:

* yaygın kullanılan seçenekler: `application/json` ve `application/graphql` 
* ayrıca ortaya çıkabilen seçenekler: `text/plain` ve `multipart/form-data`

GraphQL sorguları HTTP GET istekleri olarak da gönderilebilir. Bu durumda, sorgu URL'deki bir sorgu parametresi olarak dahil edilir. GET istekleri GraphQL sorguları için kullanılabilse de, özellikle daha karmaşık sorgular için POST isteklerine kıyasla daha az yaygındır. Bunun nedeni, GET isteklerinin genellikle idempotent operasyonlar (yani sonuçları farklılık göstermeden tekrarlanabilen işlemler) için kullanılması ve uzun sorgular için sorun yaratabilecek uzunluk kısıtlamalarına sahip olmalarıdır.

Wallarm, GraphQL istekleri için hem POST hem de GET HTTP metodlarını destekler.

## Kuralın Oluşturulması ve Uygulanması

GraphQL politikasını ayarlayıp uygulamak için:

--8<-- "../include/rule-creation-initial-step.md"
1. **Mitigation controls** → **GraphQL API protection** seçeneğini seçin.
1. **If request is** kısmında, kuralın uygulanacağı uç nokta URI'sini ve diğer koşulları [tanımlayın](../user-guides/rules/rules.md#rule-branches):

    * GraphQL uç noktanızın URI'si (rota içinde, genellikle `/graphql` içerir)
    * POST veya GET metodu - bkz. [Supported GraphQL formats](#supported-graphql-formats); kuralın hem POST hem de GET istekleri için aynı sınırlamaları uygulamasını istiyorsanız yöntem belirtilmemiş bırakılabilir
    * `CONTENT-TYPE` başlık değerini ayarlayın - bkz. [Supported GraphQL formats](#supported-graphql-formats)

        Not: Kuralın hangi koşul kombinasyonlarıyla uygulanacağını belirleyebilirsiniz, örneğin URI kullanılabilir ve diğer koşullar belirtilmeyebilir veya uç nokta belirtilmeden `CONTENT-TYPE` başlığı `application/graphql` olarak ayarlanabilir. Farklı koşullar içeren ve farklı sınırlar ve tepkiler belirleyen birkaç kural da oluşturabilirsiniz.

1. Trafik metriklerinize uygun olarak GraphQL istekleri için eşik değerleri belirleyin (boş bırakılırsa/seçilmezse bu kriter için herhangi bir sınırlama uygulanmaz):

    * **Maximum total query size in kilobytes** - tüm bir GraphQL sorgusunun boyutu için üst sınır belirler. Aşırı büyük sorgular göndererek sunucu kaynaklarını tüketmeye yönelik Denial of Service (DoS) saldırılarını önlemek için çok önemlidir.
    * **Maximum value size in kilobytes** - bir GraphQL sorgusu içindeki herhangi bir bireysel değerin (değişken veya sorgu parametresi fark etmez) maksimum boyutunu belirler. Bu sınır, değişkenler veya argümanlar için aşırı uzun string değerler göndererek sunucuyu yenmek isteyen saldırılara karşı yardımcı olur.
    * **Maximum query depth** - bir GraphQL sorgusu için izin verilen maksimum derinliği belirler. Sorgu derinliğinin sınırlandırılması, kötü niyetle hazırlanmış, çok katmanlı sorgulardan kaynaklanan performans sorunları veya kaynak tükenmesi yaşanmasını engeller.
    * **Maximum number of aliases** - tek bir GraphQL sorgusunda kullanılabilecek alias sayısını sınırlar. Alias sayısının sınırlandırılması, çok karmaşık sorgular oluşturmak amacıyla alias işlevselliğinden yararlanarak yapılan Resource Exhaustion ve DoS saldırılarını engeller.
    * **Maximum batched queries** - tek bir istek içerisinde gönderilebilecek toplu sorgu sayısını sınırlar. Bu parametre, saldırganların hız sınırlandırma gibi güvenlik önlemlerini aşmak için birden fazla işlemi tek bir istekte birleştirdiği toplu saldırıları önlemek için esastır.
    * **Block/register introspection queries** - etkinleştirildiğinde, sunucu GraphQL şemanızın yapısını açığa çıkarabilecek introspection isteklerini potansiyel saldırı olarak değerlendirecektir. Şemanın saldırganlara karşı korunması için introspection sorgularının devre dışı bırakılması veya izlenmesi kritik bir önlemdir.
    * **Block/register debug requests** - bu seçeneği etkinleştirirseniz, debug modu parametresi içeren istekler potansiyel saldırı olarak değerlendirilecektir. Bu ayar, üretimde debug modunun yanlışlıkla etkin bırakılması durumlarını tespit etmek ve saldırganların hassas bilgileri açığa çıkarabilecek aşırı hata raporlama mesajlarına erişmesini engellemek için faydalıdır.

    Varsayılan olarak, bir politika POST istekleri için maksimum sorgu boyutunu 100 KB, değer boyutunu 10 KB, sorgu derinliği ve toplu sorgu limitlerini 10, alias sayısını 5 olarak ayarlar; ayrıca introspection ve debug sorgularını reddeder (varsayılan değerleri kendi yaygın meşru GraphQL sorgu istatistiklerinize göre değiştirebilirsiniz):
        
    ![GraphQL thresholds](../images/user-guides/rules/graphql-rule.png)

<!-- temporary unavailable, bug: https://wallarm.atlassian.net/browse/PLUTO-6979?focusedCommentId=208654
## Reaction to policy violation

Politika ihlaline tepki, kuralın hedef aldığı uç noktalar için uygulanan [filtration mode](../admin-en/configure-wallarm-mode.md) ile tanımlanır.

Wallarm'ı bloklama modunda kullanıyor ve GraphQL kurallarını güvenle test etmek istiyorsanız, GraphQL yollarınız için **Set filtration mode** kuralını [özel olarak](../admin-en/configure-wallarm-mode.md#endpoint-targeted-filtration-rules-in-wallarm-console) oluşturarak `/graphql` yollarında monitoring mode'u etkinleştirebilirsiniz. Bu kuralın SQLi, XSS vb. tüm saldırılar için uygulanacağını unutmayın; bu yüzden uzun süre açık bırakılması önerilmez.

![GraphQL policy blocking action](../images/user-guides/rules/graphql-rule-2-action.png)

Unutmayın, [`wallarm_mode_allow_override` directive](../admin-en/configure-wallarm-mode.md#prioritization-of-methods) ile yol konfigürasyonunuz, Wallarm Console'da oluşturulan kuralları görmezden gelecek şekilde ayarlanmış olabilir. Böyle bir durumda, [bkz.](../admin-en/configure-wallarm-mode.md#configuration-methods) diğer yöntemleri keşfetmeli ve filtration mode'u değiştirmek için kullanmalısınız.-->

## GraphQL saldırılarını Keşfetme

Wallarm Console → **Attacks** bölümünde GraphQL politika ihlallerini (GraphQL saldırıları) inceleyebilirsiniz. GraphQL'e özgü [arama anahtarlarını](../user-guides/search-and-filters/use-search.md#graphql-tags) veya ilgili filtreleri kullanın:

![GraphQL attacks](../images/user-guides/rules/graphql-attacks.png)

<!--## Rule examples

### Setting policy for your GraphQL endpoints to block attacks

Let us say you want to set limits for the requests to your application GraphQL endpoints located under `example.com/graphql` to block all potential [GraphQL specific](../attacks-vulns-list.md#graphql-attacks) attacks to them. Filtration mode for `example.com` is `monitoring`.

To do so:

1. Set the **Detect GraphQL attacks** rule as displayed on the screenshot (note that these are the example values - for the real-life rules you should define your own values considering statistics of your common legitimate GraphQL queries):

    ![GraphQL Policy for your endpoints](../images/user-guides/rules/graphql-rule-1.png)

1. As filtration mode for `example.com` is `monitoring` and you want `block` for its GraphQL endpoints, configure the **Set filtration mode** rule as displayed on the screenshot:

    ![GraphQL policy blocking action](../images/user-guides/rules/graphql-rule-1-action.png)

### Altering policy for specific endpoints

Continuing the [previous](#setting-policy-for-your-graphql-endpoints-to-block-attacks) example, let us say you want to set stricter limits for `example.com/graphql/v2` child endpoint. As limits are stricter, before blocking anything, they should be tested in the `monitoring` mode.

To do so:

1. Set the **Detect GraphQL attacks** rule as displayed on the screenshot (note that these are the example values - for the real-life rules you should define your own values considering statistics of your common legitimate GraphQL queries):

    ![GraphQL stricter policy for child endpoint](/../images/user-guides/rules/graphql-rule-2.png)

1. As filtration mode for `example.com/graphql` is `block` and you want `monitoring` for `example.com/graphql/v2`, configure the **Set filtration mode** rule as displayed on the screenshot:

    ![GraphQL policy blocking action](../images/user-guides/rules/graphql-rule-2-action.png)
-->