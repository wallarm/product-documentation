# API Sessions Kurulumu <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

[API Sessions](overview.md), oturum tanımlaması için yerleşik kuralları içerir ve çalışmaya başlamak için sadece etkin Wallarm [node](../about-wallarm/overview.md#how-wallarm-works) gerektirir. Dilerseniz, bu makalede açıklandığı gibi ihtiyaçlarınıza göre API Sessions’u detaylandırabilirsiniz.

## Oturum Bağlamı

API Sessions’daki bağlam, oturumları mantıksal gruplara ayırmak ve oturum etkinliği hakkında daha derin bilgiler sağlamak için yanıt verilerine ek bilgiler ve meta veriler ekleyerek istek verilerini zenginleştiren bilgidir. Bağlam yapılandırması, her oturumla ilişkilendirilecek hangi yönlerin veya ek verilerin takip edileceğini belirtmenizi sağlar.

İstek ve yanıt parametrelerine ek ekleyerek, oturum bağlamını ayarlayın; oturumları hassas iş akışları ile ilişkilendirin ve kullanıcı ile kullanıcı rolü tanımlaması için kullanılabilecek parametreleri vurgulayın.

### Ek Parametreler

**API Sessions** içinde, varsayılan olarak oturum içerisindeki istek detayları şunları içerir:

* [Oturum gruplaması](#session-grouping) için çalışan, sizin veya yerleşik setteki parametre.
* Kötü niyetli istekler için - tam istek içeriği.

Oturum içeriğini; aktörün ne yaptığını ve yanıtın ne olduğunu anlamanız için gerekli olan her iki istek ve ilgili yanıtlar için ek (bağlam) [parametreleri](../user-guides/rules/request-processing.md) ekleyebilirsiniz. Bunu yapmak için, Wallarm Console → **API Sessions** → **Session context parameters** bölümüne bu parametreleri ekleyin. Eklendikten sonra, Wallarm bunları Wallarm Cloud’a aktarır ve oturum isteklerinizin detaylarında Wallarm Console’da [gösterir](#data-protection).

![!API Sessions - context parameters](../images/api-sessions/api-sessions-context-parameters.png)

<!--### Hassas İş Akışları

Oturumları hassas iş akışları ile ilişkilendirebilirsiniz. Bunu yapmak için, Wallarm Console → **API Sessions** → **Session context parameters** bölümüne girip kendi parametrenizi ekleyin ve bunun için **Context** seçeneğini işaretleyin.

![!API Sessions - sensitive business flows](../images/api-sessions/api-sessions-sbf-select.png)
-->

### Kullanıcılar ve Roller

Oturum kullanıcı adlandırması ve rol tanımlaması için kullanılması gereken oturum parametrelerini vurgulayabilirsiniz. Bunu yapmak için, Wallarm Console → **API Sessions** → **Session context parameters** bölümüne girip parametrenizi ekleyin ve **Type** kısmından `User` veya `Role` seçeneğini seçin.

![!API Sessions - user and user role setup](../images/api-sessions/api-sessions-user-role-select.png)

Kullanıcı ve onun rolü tanımlaması için kullanılacak parametreleri yapılandırdıktan sonra, bu parametreler oturumlar için doldurulmaya başlanır. Oturumları kullanıcılar ve rollerine göre filtreleyebilirsiniz.

![!API Sessions - user and user role display](../images/api-sessions/api-sessions-user-role-display.png)

## Oturum Gruplama

Wallarm, uygulama trafiğinizdeki istekleri, istek ve/veya yanıtların seçilen header/parametrelerinin **eşit değerlerine** dayanarak kullanıcı oturumlarına gruplar. Yapılandırmada, bu parametreler gruplama anahtarları olarak işaretlenmiştir. Gruplama anahtarlarının nasıl çalıştığını [örnekte](#grouping-keys-example) görebilirsiniz.

Varsayılan olarak, oturumlar bu parametrelerin **yerleşik seti** ile tanımlanır (Wallarm Console’da gösterilmez). Mantık, `PHPSESSID` veya `SESSION-ID` gibi en yaygın tanımlama parametrelerini denemek, çalışmazsa - `istek kaynak IP ve user-agent` kombinasyonuna (veya user-agent yoksa en azından IP’ye) dayalı oturum oluşturmaktır.

Uygulamalarınızın mantığına dayalı olarak kendi tanımlama parametrelerinizi ekleyebilirsiniz. Bunu yapmak için, Wallarm Console → **API Sessions** → **Session context parameters** bölümüne gidip istek veya yanıt parametrenizi ekleyin ve bunun için **Group sessions by this key** seçeneğini işaretleyin.

!!! info "API Abuse Prevention tarafından bot tespitine **etkisi**"
    Wallarm'ın API Abuse Prevention'ı, kötü niyetli bot tespiti için oturumları kullanır. Uygulamalarınızın mantığına dayalı olarak kendi oturum tanımlama parametrelerinizi eklemek, hem oturum tespitini hem de API Abuse Prevention’ın bot tespitini daha hassas hale getirir. Ayrıntılar için bakınız [details](overview.md#api-sessions-and-api-abuse-prevention).

![!API Sessions - Configuration](../images/api-sessions/api-sessions-settings.png)

Birden fazla gruplama anahtarı ekleyebilirsiniz; bunlar belirtilen sırayla denenir – bir sonraki, önceki çalışmazsa denenir. Sıralamayı değiştirmek için sürükleyin. Kendi anahtarlarınız yerleşik olanlardan her zaman önce denenir.

!!! info "Mask sensitive data kuralından **etkisi**"
    Bir parametrenin gruplama anahtarı olarak çalışabilmesi için, [Mask sensitive data](../user-guides/rules/sensitive-data-rule.md) kuralından etkilenmemesi gerekir.

<a name="grouping-keys-example"></a>**Gruplama anahtarlarının nasıl çalıştığına dair örnek**

Diyelim ki, `response_body →` `json_doc → hash → token` parametresinde belirli bir `<TOKEN>` döndüren bir login rotanız var. İleriki isteklere, bu `<TOKEN>`, `get → token` veya `post → json_doc → hash → token` şeklinde kulanılır.

Yanıt gövdesi, get ve post istekleri için gruplama anahtarları olarak kullanılacak 3 parametre yapılandırabilirsiniz. Bunlar aşağıdaki sırayla denenir (bir sonraki, önceki çalışmazsa denenir):

1. `response_body → json_doc → hash → token`
2. `get → token`
3. `post → json_doc → hash → token`
4. (yerleşik set, önceki hiçbirisi çalışmazsa kullanılacak)

![!API Sessions - example of grouping keys in work](../images/api-sessions/api-sessions-grouping-keys.png)

İstekler:

* curl `example.com -d '{in: 'bbb'}'` ile yanıt `'{token: aaa}'` → oturum "A" (**gruplama anahtarı #1 çalıştı**)
* curl `example.com -d '{in: 'ccc'}' '{token: 'aaa'}'` ile token içermeyen yanıt → oturum "A" (**gruplama anahtarı #3 çalıştı**)

Aynı parametre değeri `aaa`, bu istekleri tek bir oturum altında gruplar.

## Veri Koruması

API Sessions için, node'dan Cloud'a Wallarm, yalnızca sizin tarafından seçilen parametreleri aktarır. Bu parametreler hassas veri içeriyorsa, aktarım öncesinde mutlaka hash’leyin. Hashleme, gerçek değeri okunamaz hale getireceğinden, parametrenin varlığı ve belirli fakat bilinmeyen değerin analize sınırlı bilgi sunacağını unutmayın.

Hassas parametreleri hash’lemek için, Wallarm Console → **API Sessions** → **Session context parameters** bölümünde bunları ekledikten sonra, **Hashing (secret)** seçeneğini seçin.

Wallarm, seçilen parametreleri aktarmadan önce hash’ler.

## Analiz Edilen Trafik

API Sessions, Wallarm node’unun koruması etkin olan tüm trafiği analiz eder ve oturumlara düzenler. Seçili uygulamalara/hostlara analiz sınırlaması talebinde bulunmak için [Wallarm support team](mailto:support@wallarm.com) ile iletişime geçebilirsiniz.

## Saklama Süresi

**API Sessions** bölümü, son bir haftaya ait oturumları saklar ve gösterir. Daha eski oturumlar, optimal performans ve kaynak tüketimi sağlamak amacıyla silinir.