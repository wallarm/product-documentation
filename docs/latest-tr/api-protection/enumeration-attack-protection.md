# Numaralandırma Saldırısı Koruması <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm, kötü niyetli aktörler için yüksek değere sahip bilgilerin ifşasını önleyerek API’lerinizi [numaralandırma saldırılarına](../attacks-vulns-list.md#enumeration-attacks) karşı korumanızı sağlar. Geçerli kullanıcı adlarını, e‑posta adreslerini veya sistem kaynaklarını tespit ederek saldırganlar, sonraki saldırılar için odaklarını önemli ölçüde daraltabilir. Bu keşif aşaması, saldırganların hedef sistemi daha iyi anlamasına, potansiyel olarak güvenlik açıklarını ortaya çıkarmasına ve daha sofistike ve hedefli saldırıların planlanmasına olanak tanır; nihayetinde başarılı bir ihlal olasılığını artırır.

[NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) 6.0.1 veya [Native Node](../installation/nginx-native-node-internals.md#native-node) 0.14.1 ya da üzeri gerektirir.

## Azaltma kontrolleri

Wallarm, numaralandırmaya karşı korumayı yapılandırmanız için birkaç [azaltma kontrolü](../about-wallarm/mitigation-controls-overview.md) sunar. Hangi kontrolün kullanılacağını seçerken aşağıdakileri göz önünde bulundurun:

<table>
  <tr>
    <th>Kontrol</th>
    <th>Özellikler</th>
    <th>Numaralandırır</th>
    <th>Saldırı</th>
  </tr>
  <tr>
    <td><b>Brute force protection</b></td>
    <td rowspan="3">Belirtilen zaman aralığında her parametre için görülen benzersiz değerlerin sayısını sayar.</td>
    <td><code>password</code></td>
    <td><code>Brute force</code></td>
  </tr>
  <tr>
    <td><b>BOLA protection</b></td>
    <td><code>object ID</code>, <code>user ID</code></td>
    <td><code>BOLA</code></td>
  </tr>
  <tr>
    <td><b>Enumeration attack protection</b></td>
    <td>Herhangi bir parametre</td>
    <td><code>Enum</code></td>
  </tr>
  <tr>
    <td><b>Forced browsing protection</b></td>
    <td>Yapılandırılan zaman aralığında erişilen benzersiz uç noktaların sayısını sayar.</td>
    <td><code>URL</code>'ler</td>
    <td><code>Forced browsing</code></td>
  </tr>
</table>

Buna göre:

* Gizli (genel olmayan) URL’lerinizin numaralandırılmasını engellemek istiyorsanız, **Forced browsing protection** kontrolünü kullanın.
* Herhangi parametrenin numaralandırılmasını engellemek için **Enumeration attack protection** kontrolünü kullanabilirsiniz (hepsi bir arada çözüm).
* Varyasyonları deneyerek geçerli parolaları elde etme girişimlerini özellikle vurgulamak istiyorsanız, **Brute force protection** kontrolünü kullanın.
* Geçerli kullanıcı veya nesne ID’sinin numaralandırılması girişimlerini özellikle vurgulamak istiyorsanız - **BOLA protection** kontrolü.

!!! info "Öncüller"
    Azaltma kontrolleri, [Advanced API Security](../about-wallarm/subscription-plans.md#core-subscription-plans) aboneliğinde sunulan gelişmiş araçlardır. [Cloud Native WAAP](../about-wallarm/subscription-plans.md#core-subscription-plans) aboneliğinde, [brute force protection](../admin-en/configuration-guides/protecting-against-bruteforce.md), [forced browsing protection](../admin-en/configuration-guides/protecting-against-forcedbrowsing.md) ve [BOLA protection](../admin-en/configuration-guides/protecting-against-bola-trigger.md) tetikleyicilerle yapılandırılır.

## Varsayılan koruma

Wallarm, numaralandırma koruması için [varsayılan](../about-wallarm/mitigation-controls-overview.md#default-controls) azaltma kontrolleri sağlar. Varsayılan kontrolleri çoğaltabilir, düzenleyebilir veya devre dışı bırakabilirsiniz.

<!--You can **reset default control to its default configuration** at any time.-->

--8<-- "../include/mc-subject-to-change.md"

### Brute force

**Brute force protection** [varsayılan](#default-protection) azaltma kontrolleri; parolaların, OTP’lerin ve kimlik doğrulama kodlarının numaralandırılması girişimlerini tespit etmek için genel bir yapılandırma sunar ve tüm trafik için `Monitoring` [modunda](../about-wallarm/mitigation-controls-overview.md#mitigation-mode) etkindir.

Brute force varsayılan kontrollerini incelemek için Wallarm Console → **Security Controls** → **Mitigation Controls**, **Brute force protection** bölümünde `Default` etiketli kontrolleri kontrol edin.

Düzenleme, uygulamanın, trafik kalıplarının veya iş bağlamının özel ihtiyaçlarına göre varsayılan bir kontrolü özelleştirmenize olanak tanır. Örneğin, eşikleri ayarlayabilirsiniz.

### BOLA

**BOLA protection** [varsayılan](#default-protection) azaltma kontrolleri; kullanıcı ID’lerinin, nesne ID’lerinin ve dosya adlarının numaralandırılması girişimlerini tespit etmek için genel bir yapılandırma sunar ve tüm trafik için `Monitoring` [modunda](../about-wallarm/mitigation-controls-overview.md#mitigation-mode) etkindir.

BOLA varsayılan kontrollerini incelemek için Wallarm Console → **Security Controls** → **Mitigation Controls**, **BOLA protection** bölümünde `Default` etiketli kontrolleri kontrol edin.

Düzenleme, uygulamanın, trafik kalıplarının veya iş bağlamının özel ihtiyaçlarına göre varsayılan bir kontrolü özelleştirmenize olanak tanır. Örneğin, eşikleri veya numaralandırma için izlenen parametreleri ayarlayabilirsiniz.

### Genel numaralandırma

**Enumeration attack protection** [varsayılan](#default-protection) azaltma kontrolleri aşağıdaki numaralandırma girişimlerini tespit etmek için genel bir yapılandırma sağlar:

* Kullanıcı/e‑posta numaralandırma
* SSRF (Server‑Side Request Forgery) numaralandırma
* User‑Agent rotasyonu

Tüm trafik için `Monitoring` [modunda](../about-wallarm/mitigation-controls-overview.md#mitigation-mode) etkindir.

Genel numaralandırma varsayılan kontrollerini incelemek için Wallarm Console → **Security Controls** → **Mitigation Controls**, **Enumeration attack protection** bölümünde `Default` etiketli kontrolleri kontrol edin.

Düzenleme, uygulamanın, trafik kalıplarının veya iş bağlamının özel ihtiyaçlarına göre varsayılan bir kontrolü özelleştirmenize olanak tanır. Örneğin, eşikleri veya numaralandırma için izlenen parametreleri ayarlayabilirsiniz.

### Forced browsing

**Forced browsing protection** [varsayılan](#default-protection) azaltma kontrolleri; gizli (genel olmayan) URL’lerinizin numaralandırılması girişimlerini tespit etmek için genel bir yapılandırma sunar ve tüm trafik için `Monitoring` [modunda](../about-wallarm/mitigation-controls-overview.md#mitigation-mode) etkindir.

Forced browsing varsayılan kontrollerini incelemek için Wallarm Console → **Security Controls** → **Mitigation Controls**, **Forced browsing protection** bölümünde `Default` etiketli kontrolleri kontrol edin.

Düzenleme, uygulamanın, trafik kalıplarının veya iş bağlamının özel ihtiyaçlarına göre varsayılan bir kontrolü özelleştirmenize olanak tanır. Örneğin, eşikleri veya **Scope**’u ayarlayabilirsiniz.

## Yapılandırma

Numaralandırma korumasını aşağıdaki adımları yerine getirerek yapılandırın:

* Kontrolün uygulanacağı **Scope**’u tanımlayın (uç noktalar, yalnızca belirli istekler).
* **Enumerated parameters** seçin – numaralandırma girişimleri için izlenecek olanlar.
* **Enumeration threshold** belirleyin – eşik aşıldığında kontrol harekete geçer.
* Scope tüm ihtiyaçlarınızı karşılamıyorsa **Scope filters** ayarlayın.
* **Mitigation mode** içinde eylemi belirleyin.

Scope’u ve gelişmiş koşulları ayarlamak ve numaralandırma için izlenecek parametreleri seçmek için [düzenli ifadeleri](#regular-expressions) kullanabileceğinizi unutmayın.

### Scope

**Scope**, kontrolün hangi isteklere uygulanacağını tanımlar (URI ve diğer parametrelere göre). Kurallar içindeki istek koşullarıyla aynı şekilde yapılandırılır. Ayrıntılar için [buraya](../user-guides/rules/rules.md#configuring) bakın.

**Scope** bölümünü boş bırakırsanız, azaltma kontrolü **tüm trafiğe** ve **tüm uygulamalara** uygulanır; bu tür kontroller tüm [dallar](../about-wallarm/mitigation-controls-overview.md#mitigation-control-branches) tarafından devralınır.

### Scope filters 

[Scope](#scope) tüm ihtiyaçlarınızı karşılamıyorsa, koruma mekanizması kapsamına girmek için isteklerin karşılaması gereken diğer koşulları tanımlayabilirsiniz.

Koşullar olarak şunların değerlerini veya değer kalıplarını kullanabilirsiniz:

* İsteklerin yerleşik parametreleri – Wallarm filtreleme düğümü tarafından işlenen her istekte bulunan meta bilgi öğeleri.
* **Session context parameters** – **API Sessions** içinde [önemli olarak tanımlanmış](../api-sessions/setup.md#session-context) olanların listesinden parametreleri hızlıca seçin. Bu bölümdeki **Add custom** seçeneğini kullanarak, şu anda **API Sessions**’da bulunmayan parametreleri filtre olarak ekleyin. Bunu yaparsanız, bu parametreler **API Sessions**'ın context parameters listesine de eklenir (gizli, yani bu parametreler isteklerde mevcutsa onları session details içinde görürsünüz, ancak **API Session** [context parameter configuration](../api-sessions/setup.md#session-context) içinde görmezsiniz).

!!! info "Performans notu"
    **Scope** ayarları performans açısından daha az talepkâr olduğundan, hedefleriniz için yeterli olduğunda bunları kullanmanız ve yalnızca karmaşık koşullandırma için **Scope filters** kullanmanız her zaman önerilir.

### Enumerated parameters

**Enumerated parameters** bölümünde, numaralandırma için izlenecek parametreleri seçmeniz gerekir. İzlenecek parametreler kümesini tam eşleşmeyle veya [regex](#regular-expressions) ile seçin (tek bir azaltma kontrolü içinde yalnızca bir yaklaşım kullanılabilir).

Tam eşleşme için, şu anda **API Sessions**’da [sunulmayan](../api-sessions/setup.md#session-context) parametreleri numaralandırma için izlenenler olarak eklemek üzere **Add custom** seçeneğini kullanabilirsiniz. Bunu yaparsanız, bu parametreler **API Sessions**'ın context parameters listesine de eklenir (gizli, yani bu parametreler isteklerde mevcutsa onları session details içinde görürsünüz, ancak **API Session** [context parameter configuration](../api-sessions/setup.md#session-context) içinde görmezsiniz).

Regex için hem **Filter by parameter name** hem de **Filter by parameter value** belirtirseniz, bunlar birlikte çalışır (`AND` operatörü). Örneğin ad için `(?i)id` ve değer için `\d*` belirtmek `userId` parametresini yakalar ancak yalnızca parametre değeri olarak rakam kombinasyonu olan istekleri sayar.

Bir istek [scope](#scope) ve [gelişmiş filtreleri](#scope-filters) karşılayıp numaralandırma için izlenen parametre için benzersiz bir değer **içerdiğinde**, bu parametrenin sayacı `+1` alır.

### Enumeration threshold

**Brute force, BOLA ve genel numaralandırma koruması**

Bu tür korumalar, belirtilen zaman diliminde (saniye cinsinden) her bir [numaralandırılan parametre](#enumerated-parameters) için görülen benzersiz değerlerin sayısını sayar. **Enumerated parameters** bölümünde listelenen her parametre bağımsız olarak izlenir.

Herhangi bir parametre eşik değerine ulaştığında, Wallarm [Mitigation mode](#mitigation-mode) doğrultusunda işlem gerçekleştirir.

**Forced browsing protection**

Bu koruma, yapılandırılmış zaman dilimi (saniye cinsinden) içinde erişilen benzersiz uç noktaların sayısını sayar. Eşik aşıldığında, Wallarm [Mitigation mode](#mitigation-mode) doğrultusunda işlem gerçekleştirir.

### Mitigation mode

Sayaçlardan herhangi biri eşiği aştığında, seçilen eylem gerçekleştirilir:

* **Monitoring** - saldırı kaydedilir, bu saldırının parçası olan istekler [API Sessions](../api-sessions/overview.md) içinde `Brute force`, `Forced browsing`, `BOLA` veya genel `Enum` saldırısına ait olarak işaretlenir ancak istekler engellenmez.
* **Blocking** → **Block IP address** - saldırı kaydedilir, bu saldırının parçası olan istekler API Sessions içinde bu saldırıya ait olarak işaretlenir, bu isteklerin tüm kaynak IP’leri seçilen süre boyunca [denylist](../user-guides/ip-lists/overview.md) içine alınır.

### Düzenli ifadeler

**Scope** bölümü [PIRE](../user-guides/rules/rules.md#condition-type-regex) düzenli ifade kütüphanesini, gelişmiş koşullar ise [PCRE](https://www.pcre.org/) kullanır. Düzenli ifade kullanmak için aşağıdaki operatörleri kullanın:

| Operatör | Açıklama |
| --- | --- |
| ~ (Aa)  | Büyük/küçük harfe duyarsız regexp ile bir şeyi bulun. |
| !~ (Aa) | Büyük/küçük harfe duyarsız regexp ile bir şeyi hariç tutun. |
| ~       | Büyük/küçük harfe duyarlı regexp ile bir şeyi bulun. |
| !~      | Büyük/küçük harfe duyarlı regexp ile bir şeyi hariç tutun. |

## Örnek

Diyelim ki e‑ticaret uygulamanız `E-APPC`, her kullanıcının siparişleriyle ilgili bilgileri `/users/*/orders` altında saklıyor. Kötü niyetli kişilerin bu siparişlere ait ID’lerin listesini elde etmesini engellemek istiyorsunuz. Bu liste, farklı rakam kombinasyonlarını deneyen bir komut dosyasıyla elde edilebilir. Bunu önlemek için, her kullanıcı hesabı altında siparişleri depolayan rotalar için `in minute` içinde `more than 2 unique values` sayacını ayarlayabilirsiniz - bu aşıldığında, etkinlik nesne (kullanıcı sipariş) ID’lerini numaralandırma (BOLA saldırısı) girişimi olarak işaretlenmeli ve kaynak IP 1 saatliğine engellenmelidir.

Bunu başarmak için, **BOLA protection** azaltma kontrolünü ekrandaki ekran görüntüsünde gösterildiği gibi yapılandırın:

![BOLA protection azaltma kontrolü - örnek](../images/user-guides/mitigation-controls/mc-bola-example-01.png)

Bu örnekte, parametre değerlerindeki `\d*` regex’i `sıfır veya daha fazla rakam` anlamına gelir - rakamlardan oluşan bir nesne ID’sini numaralandırma girişimi.

<!-- ## Testing

To test the mitigation control described in the [Example](#example) section, TBD. -->

## Tespit edilen saldırıların görüntülenmesi

Numaralandırma saldırıları [mitigation mode](#mitigation-mode) uyarınca tespit edildiğinde veya engellendiğinde, [API Sessions](../api-sessions/exploring.md) bölümünde gösterilir:

![API Sessions içinde numaralandırma saldırısı (brute force)](../images/user-guides/mitigation-controls/mc-found-attack-in-api-sessions.png)

İlgili saldırı türlerine sahip oturumları **Attack** filtresini kullanarak bulabilirsiniz; ayrıca gerekirse, yalnızca numaralandırma saldırısıyla ilgili istekleri görmek için session details içinde filtreleyin.