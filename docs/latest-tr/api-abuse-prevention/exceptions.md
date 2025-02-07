[api-discovery-enable-link]:        ../api-discovery/setup.md#enable

# API Abuse Prevention Exceptions <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Bu makale, geçerli botları işaretleyerek ve belirli hedef URL'ler ile istek türleri için bot korumasını devre dışı bırakarak [API Abuse Prevention](../api-abuse-prevention/overview.md)'ı nasıl ince ayar yapabileceğinizi anlatmaktadır.

Bu özellikler, temel API Abuse Prevention [profiller aracılığıyla yapılandırmayı](setup.md#creating-profiles) genişletir.

## Geçerli Otomasyon için İstisnalar

API Abuse Prevention'ın bazı IP'leri engellemesini önlemek için, bu IP'leri geçerli botlar veya tarayıcılar ile ilişkilendirmek üzere **Exception list**'i kullanın.

İstisna listesine IP adresi veya aralığı ekleyip hedef uygulamayı belirttiğinizde; bu adreslerden hedef uygulamaya yapılan herhangi bir istek kötü amaçlı bot olarak işaretlenmeyecek ve API Abuse Prevention tarafından [deny-](../user-guides/ip-lists/overview.md) veya [graylist](../user-guides/ip-lists/overview.md)'e eklenmeyecektir.

IP adreslerini istisna listesine eklemenin iki yolu vardır:

* **API Abuse Prevention** bölümünden → **Exception list** sekmesi aracılığıyla **Add exception** seçeneğini kullanarak. Burada IP’lerin ve alt ağların yanı sıra, API Abuse Prevention tarafından göz ardı edilmesi gereken konumları ve kaynak türlerini ekleyebilirsiniz.

    ![API Abuse prevention - adding items from inside exception list](../images/about-wallarm-waf/abi-abuse-prevention/exception-list-add-from-inside.png)

* **Attacks** bölümünden: `api_abuse`, `account_takeover`, `scraping` ve `security_crawlers` arama anahtarlarını kullanın veya **Type** filtresinden uygun seçenekleri seçin, ardından ilgili olayı genişleterek **Add to exception list** seçeneğine tıklayın.

    ![API Abuse prevention - adding items from inside exception list](../images/about-wallarm-waf/abi-abuse-prevention/exception-list-add-from-event.png)

IP adresi istisna listesine eklendiğinde, bu adres API Abuse Prevention tarafından (Bot sebebiyle) eklenmişse otomatik olarak [deny-](../user-guides/ip-lists/overview.md) veya [graylist](../user-guides/ip-lists/overview.md)'den kaldırılır.

!!! info "Diğer Saldırı Türlerini IP'den Engelleme"
    İstisna listesindeki bir IP, brute force ya da input validation saldırıları gibi diğer [saldırı türlerini](../attacks-vulns-list.md) üretirse, Wallarm bu tür istekleri engeller.

Varsayılan olarak, IP adresi sonsuza kadar istisna listesine eklenir. Bunu değiştirebilir ve adresin istisna listesinden ne zaman kaldırılacağını ayarlayabilirsiniz. Ayrıca, adresi her an istisnadan kaldırabilirsiniz.

**Exception list** sekmesi geçmiş verileri sunar - geçmişte belirli bir zaman aralığında listede yer alan öğeleri görüntüleyebilirsiniz.

## Hedef URL'ler ve Belirli İstekler için İstisnalar

Geçerli botların IP'lerini [exception list](#exceptions-for-legitimate-automation) ile işaretlemenin yanı sıra, isteklerin hedeflediği URL'ler ve belirli istek türleri için bot korumasını devre dışı bırakabilirsiniz; örneğin, belirli başlıkları içeren istekler için.

Bunu gerçekleştirmek için, Wallarm **Set API Abuse Prevention mode** kuralını sağlar (düğümler için 4.8 ve üzeri sürümler desteklenir).

**Kuralın Oluşturulması ve Uygulanması**

Belirli bir URL veya istek türü için bot korumasını devre dışı bırakmak amacıyla:

--8<-- "../include/rule-creation-initial-step.md"

1. **Fine-tuning attack detection** → **Override API abuse profiles** seçeneğini belirleyin. 
1. **If request is** bölümünde, kuralın uygulanacağı istekleri ve/veya URL'leri [describe](../user-guides/rules/rules.md#uri-constructor) edin. Kuralı belirli bir dal, hit veya uç nokta için başlattıysanız, bunlar kapsamı oluşturur – gerekirse, ek koşullar ekleyebilirsiniz.
1. İstenilen modu seçin:

    * **Default** - tanımlanan kapsam (belirli URL veya istek) için, botlardan gelen koruma, API Abuse Prevention'ın genel [profilleri](setup.md#creating-profiles) tarafından tanımlandığı biçimde çalışacaktır.
    * **Do not check for bot activity** - tanımlanan URL ve/veya istek türü için, bot aktivitesi kontrolü yapılmayacaktır.

1. İsteğe bağlı olarak, yorum kısmına bu URL/istek türü için kural oluşturma nedeninizi ekleyebilirsiniz.

Belirli URL ve/veya istek türü için kuralı silmeden, geçici olarak istisnayı devre dışı bırakabileceğinizi unutmayın: bunun için **Default** modunu seçin. Daha sonra istediğiniz anda tekrar **Do not check for bot activity** moduna dönebilirsiniz.

**Kural Örnekleri**

**İstek Başlıklarıyla Geçerli Botu İşaretleme**

Uygulamanızın, istek gönderen çoklu IP'lere sahip Klaviyo marketing automation aracı ile entegre olduğunu varsayalım. Böylece, belirli URI'ler için `Klaviyo/1.0` user agent'ından gelen GET isteklerinde otomatik (bot) aktivitelerin kontrol edilmemesi gerektiğini ayarlıyoruz:

![Do not check for bot activity for requests with specific headers](../images/user-guides/rules/api-abuse-url-request.png)

**Test Uç Noktası için Botlardan Korumayı Devre Dışı Bırakma**

Uygulamanıza ait bir uç noktanız olduğunu varsayalım. Uygulama bot aktivitelerinden korunmalıdır ancak test uç noktası istisna olmalıdır. Ayrıca, API envanteriniz [**API Discovery**](../api-discovery/overview.md) modülünce keşfedilmiştir. 

Bu durumda, **API Discovery** uç noktaları listesinden kural oluşturmak daha kolaydır. Oraya gidin, uç noktanızı bulun ve sayfasından kural oluşturmayı başlatın:

![Creating Set API Abuse Prevention mode for API Discovery endpoint](../images/user-guides/rules/api-abuse-url.png)

## Profillerin Devre Dışı Bırakılması ve Silinmesi

Devre dışı bırakılan profiller, **API Abuse Prevention** modülünün trafik analizi sırasında kullanmadığı ancak profil listesinin görüntülenmesinde yer alan profillerdir. Devre dışı bırakılan profilleri istediğiniz anda yeniden etkinleştirebilirsiniz. Etkin profil olmadığında, modül kötü amaçlı botları engellemez.

Silinen profiller, geri getirilemeyen ve **API Abuse Prevention** modülünün trafik analizi sırasında kullanılmayan profillerdir.

Profil menüsünde **Disable** ve **Delete** seçeneklerini bulabilirsiniz.