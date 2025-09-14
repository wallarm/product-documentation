[api-discovery-enable-link]:        ../api-discovery/setup.md#enable

# API Abuse Prevention İstisnaları <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Bu makale, meşru botları işaretleyerek ve belirli hedef URL’ler ve istek türleri için bot korumasını devre dışı bırakarak [API Abuse Prevention](../api-abuse-prevention/overview.md) özelliğini nasıl ince ayarlayacağınızı açıklar.

Bu özellikler, API Abuse Prevention’un [profiller aracılığıyla yapılandırmasının](setup.md#creating-profiles) temel işleyişini genişletir.

## Meşru otomasyon için istisnalar

Bazı IP’leri, API Abuse Prevention tarafından engellenmemeleri için meşru botlar veya tarayıcılarla ilişkili olarak işaretlemek amacıyla **Exception list** kullanın.

Exception list’e bir IP adresi veya aralığı ekleyip hedef uygulamayı belirtirsiniz: bu, bu adreslerden hedef uygulamaya gelecek herhangi bir isteğin bu adreslerin kötü amaçlı bot olarak işaretlenmesine yol açmamasını ve API Abuse Prevention tarafından [deny-](../user-guides/ip-lists/overview.md) veya [graylist](../user-guides/ip-lists/overview.md) listelerine eklenmemesini sağlar.

IP adreslerini exception list’e eklemenin iki yolu vardır:

* **API Abuse Prevention** bölümünden → **Exception list** sekmesinde **Add exception** üzerinden. Burada IP ve alt ağların yanı sıra, API Abuse Prevention tarafından yok sayılması gereken konumlar ve kaynak türlerini de ekleyebilirsiniz.

    ![API Abuse prevention - exception list içinden öğe ekleme](../images/about-wallarm-waf/abi-abuse-prevention/exception-list-add-from-inside.png)

* **Attacks** bölümünden: `api_abuse`, `account_takeover`, `scraping` ve `security_crawlers` arama anahtarlarını kullanın veya **Type** filtresinden uygun seçenekleri seçin, ardından gerekli olayı genişletip **Add to exception list**’e tıklayın.

    ![API Abuse prevention - olay içinden exception list’e ekleme](../images/about-wallarm-waf/abi-abuse-prevention/exception-list-add-from-event.png)

Bir IP adresi exception list’e eklendiğinde, adres otomatik olarak [deny-](../user-guides/ip-lists/overview.md) veya [graylist](../user-guides/ip-lists/overview.md) listesinden kaldırılır, ancak yalnızca API Abuse Prevention tarafından (nedeni `Bot` ise) eklenmişse.

!!! info "IP’den gelen diğer saldırı türlerinin engellenmesi"
    Exception list’te yer alan bir IP, kaba kuvvet veya girdi doğrulama saldırıları gibi diğer [saldırı türleri](../attacks-vulns-list.md) üretirse, Wallarm bu istekleri engeller.

Varsayılan olarak IP, exception list’e süresiz eklenir. Bunu değiştirip adresin exception list’ten ne zaman kaldırılacağını ayarlayabilirsiniz. Ayrıca adresi dilediğiniz an istisnalardan hemen kaldırabilirsiniz.

**Exception list** sekmesi geçmiş veriler sağlar - geçmişte seçilen zaman aralığında listede yer alan öğeleri görüntüleyebilirsiniz.

## Hedef URL’ler ve belirli istekler için istisnalar

[exception list](#exceptions-for-legitimate-automation) aracılığıyla iyi botların IP’lerini işaretlemeye ek olarak, taleplerin hedeflediği URL’ler ve belirli istek türleri için (örneğin belirli başlıkları içeren istekler) bot korumasını devre dışı bırakabilirsiniz.

Bunu yapmak için Wallarm, **Set API Abuse Prevention mode** kuralını sağlar (node sürümü 4.8 ve üzeri desteklidir).

**Kuralın oluşturulması ve uygulanması**

Belirli bir URL veya istek türü için bot korumasını devre dışı bırakmak için:

--8<-- "../include/rule-creation-initial-step.md"

1. **Fine-tuning attack detection** → **Override API abuse profiles** seçin. 
1. **If request is** içinde, kuralın uygulanacağı istekleri ve/veya URL’leri [tanımlayın](../user-guides/rules/rules.md#uri-constructor). Kuralı belirli bir branch, hit veya endpoint için başlattıysanız, kapsam bunlar tarafından tanımlanacaktır - gerekirse daha fazla koşul ekleyebilirsiniz.
1. İstenen modu seçin:

    * **Default** - tanımlanan kapsam (belirli URL veya istek) için botlara karşı koruma, genel API Abuse Prevention [profilleri](setup.md#creating-profiles) tarafından tanımlanan olağan şekilde çalışacaktır.
    * **Do not check for bot activity** - tanımlanan URL ve/veya istek türü için bot etkinliği kontrolü gerçekleştirilmeyecektir.

1. İsteğe bağlı olarak, comment içinde bu URL/istek türü için kural oluşturma nedenini belirtin.

Kuralı silmeden URL ve/veya istek türü için istisnayı geçici olarak devre dışı bırakabileceğinizi unutmayın: bunun için **Default** modunu seçin. Daha sonra dilediğiniz an **Do not check for bot activity** seçeneğine geri dönebilirsiniz.

**Kural örnekleri**

**İstek başlıklarına göre meşru botun işaretlenmesi**

Uygulamanızın, birden fazla IP’den istek gönderen Klaviyo pazarlama otomasyon aracıyla entegre olduğunu varsayalım. Bu nedenle, belirli URI’ler için `Klaviyo/1.0` user agent’ından gelen GET isteklerinde otomatik (bot) etkinlikleri kontrol etmemeyi ayarlıyoruz:

![Belirli başlıklara sahip istekler için bot etkinliğini kontrol etme](../images/user-guides/rules/api-abuse-url-request.png)

**Test endpoint’i için bot korumasının devre dışı bırakılması**

Diyelim ki uygulamanıza ait bir endpoint’iniz var. Uygulama bot etkinliklerinden korunmalı ancak test endpoint’i istisna olmalıdır. Ayrıca, API envanteriniz [**API Discovery**](../api-discovery/overview.md) modülü tarafından keşfedilmiştir. 

Bu durumda kuralı **API Discovery** endpoint listesinden oluşturmak daha kolaydır. Oraya gidin, endpoint’inizi bulun ve sayfasından kural oluşturmayı başlatın:

![API Discovery endpoint’i için Set API Abuse Prevention mode oluşturma](../images/user-guides/rules/api-abuse-url.png)

## Profil devre dışı bırakma ve silme

Devre dışı bırakılan profiller, **API Abuse Prevention** modülünün trafik analizi sırasında kullanmadığı ancak profil listesinde görüntülenen profillerdir. Devre dışı bırakılmış profilleri dilediğiniz an yeniden etkinleştirebilirsiniz. Etkin profil yoksa, modül kötü amaçlı botları engellemez.

Silinen profiller, geri yüklenemeyen ve **API Abuse Prevention** modülünün trafik analizi sırasında kullanmadığı profillerdir.

Profil menüsünde **Disable** ve **Delete** seçeneklerini bulabilirsiniz.