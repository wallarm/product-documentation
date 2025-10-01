[link-cloud-node-synchronization]: ../admin-en/configure-cloud-node-synchronization-en.md
[img-rules-create-backup]:      ../images/user-guides/rules/rules-create-backup.png

# Azaltma Kontrolleri <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Azaltma kontrolleri, Wallarm'ın [saldırı korumasını](protecting-against-attacks.md#tools-for-attack-detection) ek güvenlik önlemleriyle genişletir ve Wallarm davranışını ince ayar yapmanıza olanak tanır.

## Azaltma kontrolleriyle neler yapabilirsiniz

Azaltma kontrollerini kullanarak aşağıdakileri etkinleştirebilir ve yapılandırabilirsiniz:

* [Real-time blocking mode](../admin-en/configure-wallarm-mode.md#conditioned-filtration-mode)
* [GraphQL API protection](../api-protection/graphql-rule.md)
* [Enumeration attack protection](../api-protection/enumeration-attack-protection.md)
* [BOLA enumeration protection](../api-protection/enumeration-attack-protection.md)
* [Forced browsing protection](../api-protection/enumeration-attack-protection.md)
* [Brute force protection](../api-protection/enumeration-attack-protection.md)
* [DoS protection](../api-protection/dos-protection.md)
* [File upload restriction policy](../api-protection/file-upload-restriction.md)

## Azaltma kontrolü dalları
<a name="mitigation-control-branches"></a>

Azaltma kontrolleri, uç nokta URI'ları ve diğer koşullara göre otomatik olarak iç içe dallar halinde gruplanır. Bu, azaltma kontrolü etkilerinin aşağıya doğru devralındığı ağaç benzeri bir yapı oluşturur. İlkeler:

* Tüm dallar [tüm trafiğe](#scope) uygulanan azaltma kontrollerini devralır.
* Bir dalda, alt uç noktalar azaltma kontrolü etkilerini üstten devralır.
* Ayrık olan, devralınana göre önceliklidir.
* Doğrudan belirtilen, regex ile belirlenene göre önceliklidir.
* Büyük/küçük harfe duyarlı olan, duyarsız olana göre önceliklidir.

## Etkinleştirme

Azaltma kontrolleri için gereklidir:

* [Advanced API Security](../about-wallarm/subscription-plans.md#core-subscription-plans) abonelik planı
* (çoğu kontrol için) [NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) 6.0.1 veya [Native Node](../installation/nginx-native-node-internals.md#native-node) 0.14.1

Bunların hepsi varsa ve yine de Wallarm Console içinde **Security controls** → **Mitigation Controls** bölümünü görmüyorsanız, etkinleştirilmeleri için [Wallarm support team](https://support.wallarm.com/) ile iletişime geçin.

## Yapılandırma

Yapılandırmayı Wallarm Console içindeki **Security controls** → **Mitigation Controls** bölümünde gerçekleştirin. Ayrıca sistemin diğer yerlerinden, örneğin API Sessions içinden bazı azaltma kontrol ayarlarına erişebilirsiniz.

![UI'de Mitigation Controls sayfası](../images/user-guides/mitigation-controls/mc-main-page.png)

Yapılandırmadan önce, [dallar](#mitigation-control-branches) fikrine aşina olun ve halihazırda nelerin var olduğunu kontrol edin. 

Genel olarak, herhangi bir azaltma kontrolünün yapılandırılması aşağıdaki adımları içerir:

1. İsteğe bağlı olarak özel **Title** belirleyin.
1. Koşulları ayarlayın (hepsi karşılandığında → eylem).
1. Eylemi ayarlayın (Mitigation mode).

### Kapsam
<a name="scope"></a>

**Scope**, kontrolün hangi isteklere uygulanacağını (URI ve diğer parametrelere göre) tanımlar. Kurallardaki istek koşullarıyla aynı şekilde yapılandırılır. Ayrıntılar için [buraya](../user-guides/rules/rules.md#configuring) bakın.

**Scope** bölümünü boş bırakırsanız, azaltma kontrolü **tüm trafik** ve **tüm uygulamalar** için uygulanır; bu tür kontroller tüm [dallar](#mitigation-control-branches) tarafından devralınır.

### Gelişmiş koşullar

[Scope](#scope) dışında, azaltma kontrolü eyleme geçip geçmeyeceğini tanımlayan diğer koşulları da içerebilir, örneğin:

* [GraphQL API protection](../api-protection/graphql-rule.md) için bunlar politika pozisyonlarıdır - kontrol yalnızca bunlardan herhangi biri istek tarafından ihlal edilirse eyleme geçer.
* [Enumeration attack protection](../api-protection/enumeration-attack-protection.md) için bunlar isteklerin birden çok parametresidir - kontrol yalnızca belirtilen tüm parametre/değerler karşılanırsa eyleme geçer.

Bazı kontroller için, örneğin [Enumeration attack protection](../api-protection/enumeration-attack-protection.md) veya [DoS protection](../api-protection/dos-protection.md) gibi, **Scope filters** bölümünde, **API Sessions** içinde [önemli olarak tanımlanmış](../api-sessions/setup.md#session-context) olanların listesinden parametreleri hızlıca seçmek için **session context parameters** kullanabilirsiniz. Bu bölümde **Add custom** seçeneğini kullanarak, şu anda **API Sessions** içinde bulunmayan parametreleri filtre olarak ekleyin. Bunu yaparsanız, bu parametreler **API Sessions**'ın context parameters listesine de eklenir (gizli, yani bu parametreleri isteklerde bulunurlarsa oturum ayrıntılarında görürsünüz, ancak API Session [context parameter configuration](../api-sessions/setup.md#session-context) içinde görmezsiniz).

Gelişmiş koşulları belirtmek için [düzenli ifadeleri](#regular-expressions) kullanabilirsiniz.

### Azaltma modu
<a name="mitigation-mode"></a>

Tüm koşullar karşılandığında, azaltma kontrolü eylemini gerçekleştirir. Gerekli eylem **Mitigation mode** bölümünde seçilir:

| Mitigation mode | Açıklama |
| --- | --- |
| **Inherited** | Mod, [tüm trafik için **Real-time blocking mode**](../admin-en/configure-wallarm-mode.md#general-filtration-mode) ve Wallarm düğümünün [configuration](../admin-en/configure-wallarm-mode.md#setting-wallarm_mode-directive) ayarlarından devralınır. |
| **Monitoring** | Yalnızca tespit edilen saldırıları kaydeder; engelleme yapılmaz. Kaydedilen saldırılar **API Sessions** içinde ilgili [session details](../api-sessions/exploring.md#specific-activities-within-session) bölümünde görüntülenir. <br> Bazı kontroller için, bu modda ayrıca kaynak IP'yi [Graylist](../user-guides/ip-lists/overview.md)'e ekleme seçeneğini de belirleyebilirsiniz. |
| **Blocking** | Saldırıları kaydeder ve engeller. [Engelleme yöntemleri](../about-wallarm/protecting-against-attacks.md#attack-handling-process) kontrol tipine göre değişir: gerçek zamanlı engelleme, [IP tabanlı engelleme](../user-guides/ip-lists/overview.md) veya oturum tabanlı engelleme<sup>*</sup>. |
| **Excluding** | [Belirtilen kapsam](#mitigation-control-branches) için bu tür bir azaltma kontrolünü durdurur. Ayrıntılar için [Excluding mode vs. disabling](#excluding-mode-vs-disabling) bölümüne bakın. |
| **Safe blocking** | Saldırıları kaydeder ancak yalnızca kaynak IP [graylisted](../user-guides/ip-lists/overview.md) ise engeller. |

<small><sup>*</sup> Oturum tabanlı engelleme şu anda desteklenmemektedir.</small>

Mevcut modların listesi, belirli kontrole bağlı olarak değişebilir.

### Excluding modu ve devre dışı bırakma
<a name="excluding-mode-vs-disabling"></a>

Azaltma kontrolünü geçici olarak devre dışı bırakmak ve gerektiğinde yeniden etkinleştirmek için **On/Off** anahtarını kullanabilirsiniz. Devre dışı bırakılmış bir azaltma kontrolü ile **Excluding** azaltma modunda etkinleştirilmiş olan arasındaki farkı anlamak için aşağıdaki örneği dikkate alın:

* Kontrollerin [dallarda çalıştığını](#mitigation-control-branches) dikkate alın.
* Diyelim ki `example.com` için [DoS protection](../api-protection/dos-protection.md) kontrolünüz (dakikada 50 istek) ve bunun alt dalı olan `example.com/login` için aynı türden bir kontrolünüz (dakikada 10 istek) var. Bu, `example.com` altındaki tüm adresler için dakikada 50 istek kısıtlaması, `example.com/login` altındaki adreslerde ise daha sıkı olarak dakikada 10 istek kısıtlaması olacaktır.
* `example.com/login` için hız kötüye kullanım koruma kontrolünü **Off** konumuna alarak devre dışı bırakırsanız, bu kontrol hiçbir şey yapmayı bırakır (sanki silmişsiniz gibi) - tüm kapsam için kısıtlama üst kontrolden (dakikada 50 istek) belirlenecektir.
* `example.com/login` için hız kötüye kullanım koruma kontrolünü yeniden etkinleştirir ve azaltma modunu **Excluding** olarak ayarlarsanız, bu dal için hız kötüye kullanım korumasını durdurur - tüm `example.com` için kısıtlama dakikada 50 istek olur, ancak `example.com/login` için hız kötüye kullanım koruması türünde hiçbir kısıtlama olmaz.

### Düzenli ifadeler
<a name="regular-expressions"></a>

**Scope**, **Scope filters** ve diğerleri gibi farklı azaltma kontrol parametrelerini belirtmek için düzenli ifadeleri kullanabilirsiniz:

* **Scope** bölümü PIRE düzenli ifade kütüphanesini kullanır. Kullanım ayrıntıları için [buraya](../user-guides/rules/rules.md#condition-type-regex) bakın.
* Diğer bölümler [PCRE](https://www.pcre.org/) kullanır. Düzenli ifadeyi dahil etmek için aşağıdaki operatörleri kullanın:

    | Operatör | Açıklama |
    | --- | --- |
    | ~ (Aa)  | Büyük/küçük harfe duyarsız regexp ile bir şeyi bulun. |
    | !~ (Aa) | Büyük/küçük harfe duyarsız regexp ile bir şeyi hariç tutun. |
    | ~       | Büyük/küçük harfe duyarlı regexp ile bir şeyi bulun. |
    | !~      | Büyük/küçük harfe duyarlı regexp ile bir şeyi hariç tutun. |

## Varsayılan kontroller

Wallarm, etkinleştirildiğinde Wallarm platformunun tespit kabiliyetlerini önemli ölçüde artıran bir dizi **varsayılan azaltma kontrolü** sağlar. Bu kontroller, çeşitli yaygın saldırı kalıplarına karşı sağlam koruma sağlamak üzere önceden yapılandırılmıştır. Mevcut varsayılan azaltma kontrolleri şunları içerir:

* [GraphQL protection](../api-protection/graphql-rule.md)
* Kullanıcı kimlikleri, nesne kimlikleri ve dosya adları için [BOLA (Broken Object Level Authorization) enumeration protection](../api-protection/enumeration-attack-protection.md#bola)
* Parolalar, OTP'ler ve kimlik doğrulama kodları için [Brute force protection](../api-protection/enumeration-attack-protection.md#brute-force)
* [Forced browsing protection](../api-protection/enumeration-attack-protection.md#forced-browsing) (404 yoklama)
* Şunları içeren [Enumeration attack protection](../api-protection/enumeration-attack-protection.md#generic-enumeration):
    
    * Kullanıcı/e-posta enumeration
    * SSRF (Server-Side Request Forgery) enumeration
    * User-agent rotasyonu

Varsayılan setten gelen tüm kontroller `Default` etiketi taşır. Bu tür kontroller: 

* Yeni müşteriler için Wallarm tarafından otomatik olarak eklenir ve etkin (`On`), diğerleri için devre dışı (`Off`) olarak gelir.

    !!! info "Varsayılan kontrollerin bulunmaması"
        [Obligatory](#obligatory_default_controls) olanlar dışında herhangi bir varsayılan kontrol görmüyorsanız ve bunları keşfetmek ve denemek istiyorsanız, bunları almak için [Wallarm support team](https://support.wallarm.com/) ile iletişime geçin.

* Başlangıçta [tüm trafik](#scope) için uygulanır (değiştirilebilir).
* Başlangıçta `Monitoring` [mitigation mode](#mitigation-mode) kullanır (değiştirilebilir).
* Silinemez.
* Diğerleri gibi devre dışı bırakılabilir/yeniden etkinleştirilebilir ve düzenlenebilir. Düzenleme, herhangi bir varsayılan kontrolü uygulamanın özel ihtiyaçlarına, trafik kalıplarına veya iş bağlamına göre özelleştirmenize olanak tanır. Örneğin, varsayılan eşikleri ayarlayabilir veya **Scope filters** bölümü üzerinden belirli uç noktaları hariç tutabilirsiniz.
<!--* Can be **reset to its default configuration** at any time.-->

![Varsayılan azaltma kontrolleri](../images/user-guides/mitigation-controls/mc-defaults.png)

--8<-- "../include/mc-subject-to-change.md"

<a name="obligatory_default_controls"></a>**Zorunlu varsayılan kontroller**

* Tüm trafik için [Real-time blocking mode](../admin-en/configure-wallarm-mode.md#conditioned-filtration-mode) kontrolü
* [Overlimit res](../user-guides/rules/configure-overlimit-res-detection.md) <!--this is a general setting, not MC-->

## Kural seti yaşam döngüsü

Oluşturulan tüm azaltma kontrolleri ve [kurallar](../user-guides/rules/rules.md) özel bir kural seti oluşturur. Wallarm düğümü, gelen isteklerin analizinde özel kural setine dayanır.

Kurallardaki ve azaltma kontrollerindeki değişiklikler anında etkili olmaz. Değişiklikler, özel kural seti **oluşturulması** ve **filtreleme düğümüne yüklenmesi** tamamlandıktan sonra istek analiz sürecine uygulanır.

--8<-- "../include/custom-ruleset.md"