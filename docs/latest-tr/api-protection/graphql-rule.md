[api-discovery-enable-link]:        ../api-discovery/setup.md#enable

# GraphQL API Koruması <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm, temel [WAAP](../about-wallarm/subscription-plans.md#core-subscription-plans) abonelik planında bile GraphQL içindeki düzenli saldırıları (SQLi, RCE, [vb.](../attacks-vulns-list.md)) [varsayılan olarak](../user-guides/rules/request-processing.md#gql) tespit eder. Ancak, protokolün bazı yönleri, aşırı bilgi ifşası ve DoS ile ilgili [GraphQL’e özgü](../attacks-vulns-list.md#graphql-attacks) saldırıların uygulanmasına izin verir. Bu belge, **GraphQL policy** (GraphQL istekleri için bir dizi limit) belirleyerek API’lerinizi bu saldırılardan korumak için Wallarm’ın nasıl kullanılacağını açıklar.

Genişletilmiş koruma kapsamında, GraphQL API Koruması gelişmiş [API Security](../about-wallarm/subscription-plans.md#core-subscription-plans) abonelik planının bir parçasıdır. Plan satın alındığında, korumayı **GraphQL API protection** [mitigation control](../about-wallarm/mitigation-controls-overview.md) içinde kuruluşunuzun GraphQL policy’sini belirleyerek başlatın.

## Desteklenen GraphQL biçimleri

GraphQL sorguları tipik olarak bir GraphQL sunucu uç noktasına HTTP POST istekleri olarak gönderilir. İstek, gövdenin sunucuya hangi medya türünde gönderildiğini belirtmek için bir `CONTENT-TYPE` başlığı içerir. `CONTENT-TYPE` için Wallarm şunları destekler:

* yaygın seçenekler: `application/json` ve `application/graphql`
* ayrıca karşılaşılabilecek seçenekler: `text/plain` ve `multipart/form-data`

GraphQL sorguları HTTP GET istekleri olarak da gönderilebilir. Bu durumda sorgu, URL’de bir sorgu parametresi olarak eklenir. GET istekleri GraphQL sorguları için kullanılabilse de özellikle daha karmaşık sorgular için POST isteklerinden daha az yaygındır. Bunun nedeni, GET isteklerinin tipik olarak idempotent (yani tekrarlansa da farklı sonuçlar üretmeyen) işlemler için kullanılması ve daha uzun sorgular için sorun yaratabilecek uzunluk sınırlamalarına sahip olmasıdır.

Wallarm, GraphQL istekleri için hem POST hem de GET HTTP yöntemlerini destekler.

## Yapılandırma yöntemi

Abonelik planınıza bağlı olarak, GraphQL API koruması için aşağıdaki yapılandırma yöntemlerinden biri kullanılabilir:

* Mitigation controls ([Advanced API Security](../about-wallarm/subscription-plans.md#core-subscription-plans) aboneliği)
* Rules ([Cloud Native WAAP](../about-wallarm/subscription-plans.md#core-subscription-plans) aboneliği)

## Mitigation control tabanlı koruma <a href="../../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

!!! tip ""
    [NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) 6.2.0 veya üstünü gerektirir ve şu anda [Native Node](../installation/nginx-native-node-internals.md#native-node) tarafından desteklenmemektedir.
    
### Varsayılan koruma

Wallarm, [varsayılan](../about-wallarm/mitigation-controls-overview.md#default-controls) **GraphQL API protection** mitigation controls sağlar. Bunlar, GraphQL API anormalliklerini tespit etmek için genel bir yapılandırma içerir ve tüm trafik için `Monitoring` [mode](../about-wallarm/mitigation-controls-overview.md#mitigation-mode) içinde etkinleştirilmiştir.

Varsayılan GraphQL kontrolünü incelemek için Wallarm Console → **Security Controls** → **Mitigation Controls** bölümünde, **GraphQL API protection** kısmındaki `Default` etiketli kontrolleri kontrol edin.

Varsayılan kontrolleri çoğaltabilir, düzenleyebilir veya devre dışı bırakabilirsiniz. Düzenleme, uygulamanın özel ihtiyaçlarına, trafik kalıplarına veya iş bağlamına göre varsayılan bir kontrolü özelleştirmenize olanak tanır. Örneğin, **Scope** alanını daraltarak kontrolü GraphQL’e özgü uç noktalara sınırlayabilir veya eşik değerlerini ayarlayabilirsiniz.

<!--You can **reset default control to its default configuration** at any time.-->

--8<-- "../include/mc-subject-to-change.md"

### Mitigation control oluşturma ve uygulama

GraphQL mitigation control’ün GraphQL’e özgü uç noktalar için oluşturulması önerilir. Tüm sistem için **all traffic** mitigation control olarak oluşturulması önerilmez.

!!! info "Mitigation controls hakkında genel bilgiler"
    Devam etmeden önce: herhangi bir mitigation control için **Scope** ve **Mitigation mode** ayarlarının nasıl yapıldığını öğrenmek için [Mitigation Controls](../about-wallarm/mitigation-controls-overview.md#configuration) makalesini kullanın.

GraphQL policy’yi ayarlamak ve uygulamak için:

1. Wallarm Console → **Mitigation Controls** bölümüne gidin.
1. **Add control** → **GraphQL API protection** öğesini kullanın.
1. Mitigation control’ün uygulanacağı **Scope** alanını tanımlayın.
1. Trafik metriklerinize uygun olarak GraphQL istekleri için eşik değerlerini belirleyin (boş/belirsiz bırakılırsa, bu kritere göre herhangi bir sınırlama uygulanmaz):

    * **Maximum total query size in kilobytes** - tüm bir GraphQL sorgusunun boyutu için üst sınırı belirler. Bu, aşırı büyük sorgular göndererek sunucu kaynaklarını sömüren Hizmet Reddi (DoS) saldırılarını önlemek için kritik öneme sahiptir.
    * **Maximum value size in kilobytes** - bir GraphQL sorgusu içindeki herhangi bir tekil değerin (değişken veya sorgu parametresi) maksimum boyutunu belirler. Bu limit, saldırganların değişkenler veya argümanlar için aşırı uzun string değerleri gönderdiği Excessive Value Length türü saldırılarla sunucuyu bunaltma girişimlerini azaltmaya yardımcı olur.
    * **Maximum query depth** - bir GraphQL sorgusu için izin verilen maksimum derinliği belirler. Sorgu derinliğini sınırlayarak, kötü amaçlı hazırlanmış, derin iç içe sorgulardan kaynaklanan performans sorunları veya kaynak tükenmesi önlenebilir.
    * **Maximum number of aliases** - tek bir GraphQL sorgusunda kullanılabilecek alias sayısına sınır koyar. Alias sayısını kısıtlamak, alias işlevselliğini kötüye kullanarak aşırı karmaşık sorgular oluşturan Kaynak Tüketimi ve DoS saldırılarını engeller.
    * **Maximum batched queries** - tek bir istekte gönderilebilecek toplu sorguların sayısına üst sınır koyar. Bu parametre, birden fazla işlemi tek bir istekte birleştirerek hız sınırlama gibi güvenlik önlemlerini atlatmayı amaçlayan toplu sorgu (batching) saldırılarını engellemek için gereklidir.
    * **Block/register introspection queries** - etkinleştirildiğinde, GraphQL şemanızın yapısını ortaya çıkarabilecek introspection istekleri potansiyel saldırılar olarak değerlendirilecektir. Introspection sorgularını devre dışı bırakmak veya izlemek, şemanın saldırganlara ifşa olmasını önlemek için kritik bir önlemdir.
    * **Block/register debug requests** - bu seçenek etkinleştirildiğinde, debug modu parametresi içeren istekler potansiyel saldırılar olarak kabul edilir. Bu ayar, üretimde yanlışlıkla açık bırakılan debug modunu yakalamak ve arka uç hakkında hassas bilgileri ortaya çıkarabilecek aşırı hata mesajlarına saldırganların erişmesini engellemek için yararlıdır.

    Varsayılan olarak, bir policy maksimum POST istek sorgu boyutunu 100 KB, değer boyutunu 10 KB, sorgu derinliği ve toplu sorgu limitlerini 10, alias sayısını 5 olarak belirler; ayrıca introspection ve debug sorgularını reddeder. Ekran görüntüsünde gösterildiği gibi (not: yaygın meşru GraphQL sorgularınızın istatistiklerini dikkate alarak varsayılan değerleri kendi değerlerinizle değiştirebilirsiniz):
        
    ![GraphQL eşik değerleri](../images/api-protection/mitigation-controls-graphql.png)

1. **Mitigation mode** bölümünde yapılacak işlemi ayarlayın.
1. **Add**’e tıklayın.

<!--## Exploring GraphQL attacks

You can explore GraphQL policy violations (GraphQL attacks) in Wallarm Console → **Attacks** section. Use the GraphQL specific [search keys](../user-guides/search-and-filters/use-search.md#graphql-tags) or corresponding filters:

![GraphQL attacks](../images/user-guides/rules/graphql-attacks.png)-->

### Mitigation control örnekleri

<a name="setting-policy-for-your-graphql-endpoints-to-block-attacks"></a>
#### GraphQL uç noktalarınız için saldırıları engelleyecek policy ayarlanması

Diyelim ki `example.com/graphql` altında bulunan uygulama GraphQL uç noktalarına gelen istekler için limitler belirleyerek onlara yönelik tüm potansiyel [GraphQL’e özgü](../attacks-vulns-list.md#graphql-attacks) saldırıları engellemek istiyorsunuz. `example.com` için filtration mode `monitoring`.

Bunu yapmak için:

1. **GraphQL API protection** mitigation control’ü ekran görüntüsünde gösterildiği gibi ayarlayın (not: bunlar örnek değerlerdir - gerçek hayattaki kurallar için yaygın meşru GraphQL sorgularınızın istatistiklerini dikkate alarak kendi değerlerinizi tanımlamalısınız):

    ![Uç noktalarınız için GraphQL Policy](../images/api-protection/mitigation-controls-graphql-1.png)

1. `example.com` için filtration mode `monitoring` durumunda ve GraphQL uç noktaları için `block` istiyorsanız, **Override filtration mode** rule’ünü ekran görüntüsünde gösterildiği gibi yapılandırın:

    ![GraphQL policy engelleme işlemi](../images/user-guides/rules/graphql-rule-1-action.png)

#### Belirli uç noktalar için policy'nin değiştirilmesi

[Önceki](#setting-policy-for-your-graphql-endpoints-to-block-attacks) örneğe devam ederek, `example.com/graphql/v2` alt uç noktası için daha sıkı limitler belirlemek istediğinizi varsayalım. Limitler daha sıkı olduğundan, herhangi bir şeyi engellemeden önce `monitoring` modunda test edilmelidir.

Bunu yapmak için:

1. **GraphQL API protection** mitigation control’ü ekran görüntüsünde gösterildiği gibi ayarlayın (not: bunlar örnek değerlerdir - gerçek hayattaki kurallar için yaygın meşru GraphQL sorgularınızın istatistiklerini dikkate alarak kendi değerlerinizi tanımlamalısınız):

    ![Alt uç nokta için daha sıkı GraphQL policy](../images/api-protection/mitigation-controls-graphql-2.png)

1. `example.com/graphql` için filtration mode `block` ve `example.com/graphql/v2` için `monitoring` istiyorsanız, **Override filtration mode** rule’ünü ekran görüntüsünde gösterildiği gibi yapılandırın:

    ![GraphQL policy engelleme işlemi](../images/user-guides/rules/graphql-rule-2-action.png)

## Rule tabanlı koruma

Wallarm Console → **Security Controls** → **Rules** içinde işlem yaptığınız dışında, **GraphQL API protection** mitigation control için açıklanan ayarların aynısını kullanın.