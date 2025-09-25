# API Sessions Kurulumu <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

[API Sessions](overview.md), oturum tanımlaması için yerleşik kuralları içerir ve çalışmaya başlaması için yalnızca etkinleştirilmiş Wallarm [node](../about-wallarm/overview.md#how-wallarm-works)'a ihtiyaç duyar. İsteğe bağlı olarak, bu makalede açıklandığı gibi API Sessions'ı ihtiyaçlarınıza göre ince ayar yapabilirsiniz.

## Oturum bağlamı

API sessions içindeki bağlam, istek verilerini mantıksal oturumlara gruplandırarak ve yanıt verileri ile meta verileri ekleyerek oturum etkinliğine daha derin bir içgörü sağlayan bilgilerdir. Bağlam yapılandırması, hangi yönlerin veya ek verilerin izlenip her bir oturumla ilişkilendirileceğini belirtmenize olanak tanır.

Ek istek ve yanıt parametreleri ekleyerek, oturumları hassas iş akışlarıyla ilişkilendirerek ve kullanıcı ile kullanıcı rolü tanımlaması için kullanılabilecek parametreleri vurgulayarak oturum bağlamını ayarlayın.

!!! info "İzin verilen oturum bağlamı parametre sayısı"
    Oturum bağlamı ve [gruplama](#session-grouping) için kullanmak üzere en fazla 20 oturum bağlamı parametresi ekleyebilirsiniz.

### Ek parametreler

**API Sessions** içinde, bir oturum kapsamında, istek ayrıntıları varsayılan olarak şunları içerir: 

* [Oturum gruplama](#session-grouping) için işe yarayan istek veya yanıt parametresi - sizin belirlediğiniz ya da yerleşik kümeden biri (**API session ID parameters** grubunda vurgulanır).
* Azaltma kontrolleri tarafından (varsa) [eklenen](#mitigation-controls) parametreler.
* Kötücül istekler için - tam istek içeriği.

Oturum içeriğini anlamak için ihtiyaç duyduğunuz, hem istekler hem de bunlara bağlı yanıtlar için herhangi bir ek (bağlam) [parametreyi](../user-guides/rules/request-processing.md) ekleyebilirsiniz: aktörün ne yaptığı, hangi sırayla yaptığı ve yanıtın ne olduğu. Bunu yapmak için, Wallarm Console → **API Sessions** → **Session context parameters** içinde bu parametreleri ekleyin. Eklendikten sonra, Wallarm bunları Wallarm Cloud'a aktarır ve Wallarm Console'da, oturum isteklerinizin ayrıntılarında (**API session parameters** grubunda) [görüntüler](#data-protection).

![!API Sessions - bağlam parametreleri](../images/api-sessions/api-sessions-context-parameters.png)

Bazı örnekler:

İstenin `jwt_payload` alanından kullanıcı adının alınması:

```
{
  "token_type": "access",
  "exp": 1741774186,
  "iat": 1741773706,
  "jti": "jti_value",
  "user_id": 932,
  "details": {
    "username": "john-doe@company-001.com",
    "rnd": "some_data",
    "contact": {
      "contactId": 438,
      "contactUUID": "contact_UUID_value",
      "firstName": "John",
      "lastName": "Doe",
      "portalSecurityLevel": 3,
      "companyId": 255,
      "companyName": "Company 001",
      "companyUUID": "company_UUID_value"
    }
  }
}
```

... şu şekilde görünür:

![!API Sessions - bağlam parametreleri - örnek - JWT](../images/api-sessions/api-sessions-context-parameters-example-jwt.png)

İstek gövdesinden `email` parametresinin alınması:

![!API Sessions - bağlam parametreleri - örnek - istek](../images/api-sessions/api-sessions-context-parameters-example-request.png)

Yanıt gövdesinden `product_id` parametresinin alınması:

![!API Sessions - bağlam parametreleri - örnek - yanıt](../images/api-sessions/api-sessions-context-parameters-example-response.png)

İstek başlığından JWT belirtecinin alınması:

![!API Sessions - bağlam parametreleri - örnek - başlık](../images/api-sessions/api-sessions-context-parameters-example-header.png)

<!--### Sensitive business flows

You can associate sessions with sensitive business flows. To do so, in Wallarm Console → **API Sessions** → **Session context parameters**, add your parameter and select **Context** for it.

![!API Sessions - sensitive business flows](../images/api-sessions/api-sessions-sbf-select.png)
-->

### Kullanıcılar ve roller

Oturum kullanıcısını ve rolünü adlandırmak için kullanılacak oturum parametrelerini vurgulayabilirsiniz. Bunu yapmak için, Wallarm Console → **API Sessions** → **Session context parameters** içinde parametrenizi ekleyin, ardından **Type** alanından `User` veya `Role` seçin.

![!API Sessions - kullanıcı ve kullanıcı rolü kurulumu](../images/api-sessions/api-sessions-user-role-select.png)

Kullanıcı ve rolünün belirlenmesi için kullanılacak parametreleri yapılandırdıktan sonra, bu parametreler oturumlar için doldurulmaya başlanır. Oturumları kullanıcılara ve rollere göre filtreleyebilirsiniz.

![!API Sessions - kullanıcı ve kullanıcı rolü gösterimi](../images/api-sessions/api-sessions-user-role-display.png)

### Azaltma kontrolleri

[Mitigation controls](../about-wallarm/mitigation-controls-overview.md), oturum bağlamına daha fazla parametre ekleyebilir; örneğin, **BOLA protection** azaltma kontrolü `object_id` parametresini [numaralandırma için izlenen](../api-protection/enumeration-attack-protection.md#enumerated-parameters) veya [kapsam için filtre](../api-protection/enumeration-attack-protection.md#scope-filters) olarak kullanmak isteyebilir; böyle bir parametre **API Sessions** → **Session context parameters** içinde ekli değilse, doğrudan azaltma kontrolü yapılandırmasında eklenebilir: API Session içinde, gizli olarak eklenecektir; bu, bu parametreler isteklerde bulunuyorsa oturum ayrıntılarında onları göreceğiniz ancak **Session context parameters** yapılandırmasında görmeyeceğiniz anlamına gelir.

Gizli eklenen parametreler, 20 parametre kotasından herhangi bir şey tüketmez. Parametreler, azaltma kontrolünün sağladığı korumanın durmasına yol açabilecek silme işlemlerini önlemek için gizlenir.

## Oturumların gruplandırılması

Wallarm, uygulamalarınızın trafiğindeki istekleri, isteklerin ve/veya yanıtların seçili başlık/parametrelerinin **eşit değerlerine** göre kullanıcı oturumlarına gruplandırır. Yapılandırmada, bunlar gruplama anahtarı olarak işaretlenmiş parametrelerdir. Gruplama anahtarlarının nasıl çalıştığını [örnekte](#grouping-keys-example) görün.

Varsayılan olarak, oturumlar bu tür parametrelerin **yerleşik kümesi** ile tanımlanır (Wallarm Console'da görüntülenmez). Mantığı, `PHPSESSID` veya `SESSION-ID` başlıkları gibi en yaygın tanımlama parametrelerini denemek ve bunlar işe yaramazsa - oturumu `istek kaynak IP'si ve user-agent` birleşimine göre (veya user-agent yoksa en azından IP'ye göre) oluşturmaktır.

Uygulamalarınızın mantığına dayalı kendi tanımlama parametrelerinizi ekleyebilirsiniz. Bunu yapmak için, Wallarm Console → **API Sessions** → **Session context parameters** bölümüne gidin, istek veya yanıt parametrenizi ekleyin ve bunun için **Group sessions by this key** seçeneğini işaretleyin.

!!! info "API Abuse prevention ile bot tespiti **üzerindeki** etki"
    Wallarm'ın API Abuse Prevention özelliği, kötü amaçlı bot tespiti için oturumları kullanır. Uygulamalarınızın mantığına dayalı kendi oturum tanımlama parametrelerinizi eklemek, hem oturum tespitini hem de API Abuse Prevention'ın bot tespitini daha hassas hale getirir. [Ayrıntılara bakın](overview.md#api-sessions-and-api-abuse-prevention).

![!API Sessions - Yapılandırma](../images/api-sessions/api-sessions-settings.png)

Birden fazla gruplama anahtarı ekleyebilirsiniz; bunlar belirtilen sırayla denenir - biri işe yaramazsa ancak bir sonraki denenir. Sırayı değiştirmek için sürükleyin. Kendi anahtarlarınız her zaman yerleşik olanlardan önce denenir.

!!! info "`Mask sensitive data` kuralından **kaynaklanan** etki"
    Bir parametrenin gruplama anahtarı olarak çalışabilmesi için, [Mask sensitive data](../user-guides/rules/sensitive-data-rule.md) kuralından etkilenmemesi gerekir.

<a name="grouping-keys-example"></a>**Gruplama anahtarlarının nasıl çalıştığına dair örnek**

Diyelim ki `response_body →` `json_doc → hash → token` yanıt parametresinde belirli bir `<TOKEN>` döndüren bir login rotanız var. Daha sonraki isteklerde bu `<TOKEN>`, `get → token` veya `post → json_doc → hash → token` içinde bir yerde kullanılıyor.

Gruplama anahtarları olarak kullanılmak üzere 3 parametreyi yapılandırabilirsiniz (yanıt gövdesi, get ve post istekleri için). Bunlar aşağıdaki sırayla denenir (biri işe yaramazsa ancak bir sonraki denenir):

1. `response_body → json_doc → hash → token`
2. `get → token`
3. `post → json_doc → hash → token`
4. (yerleşik küme, önceki hiçbirinin işe yaramaması durumunda kullanılacaktır)

![!API Sessions - işleyen gruplama anahtarlarına örnek](../images/api-sessions/api-sessions-grouping-keys.png)

İstekler:

* curl `example.com -d '{in: 'bbb'}'` yanıtı `'{token: aaa}'` → oturum "A" (**gruplama anahtarı #1 çalıştı**)
* curl `example.com -d '{in: 'ccc'}' '{token: 'aaa'}'` belirteç içermeyen yanıt → oturum "A" (**gruplama anahtarı #3 çalıştı**)

Aynı `aaa` parametre değeri bu istekleri tek bir oturumda gruplandırır.

## Veri koruması

API Sessions için, node'dan Cloud'a, Wallarm yalnızca sizin seçtiğiniz parametreleri dışa aktarır. Bunlar hassas veriler içeriyorsa, dışa aktarmadan önce mutlaka hash'leyin. Hash'lemenin gerçek değeri okunamaz hale getireceğini unutmayın - parametrenin varlığı ve belirli ancak bilinmeyen bir değer, analiz için sınırlı bilgi sağlayacaktır.

Hassas parametreleri hash'lemek için, bunlar Wallarm Console → **API Sessions** → **Session context parameters** içinde eklendikten sonra, onlar için **Hashing (secret)** seçeneğini belirleyin.

Wallarm, seçilen parametreleri dışa aktarmadan önce hash'ler.

## Analiz edilen trafik

API Sessions, Wallarm node'unun korumak üzere etkinleştirildiği tüm trafiği analiz ederek oturumlara organize eder. Analizi seçili uygulamalar/ana bilgisayarlarla sınırlamayı talep etmek için [Wallarm destek ekibi](mailto:support@wallarm.com) ile iletişime geçebilirsiniz.

## Saklama süresi

**API Sessions** bölümü, son bir haftalık oturumları saklar ve görüntüler. Daha eski oturumlar, optimum performans ve kaynak tüketimi sağlamak için silinir.