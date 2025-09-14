[api-discovery-enable-link]:        ../../api-discovery/setup.md#enable

# Sunucu Yanıt Üstbilgilerini Değiştirme

**Change server response headers** [kuralı](../../user-guides/rules/rules.md), sunucu yanıt üstbilgilerini eklemenize, silmenize ve değerlerini değiştirmenize olanak tanır.

Bu kural türü, en sık olarak uygulama güvenliğinin ek bir katmanını yapılandırmak için kullanılır, örneğin:

* İstemcinin belirli bir sayfa için hangi kaynakları yükleyebileceğini kontrol eden [`Content-Security-Policy`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) yanıt üstbilgisini eklemek. Bu, [XSS](../../attacks-vulns-list.md#crosssite-scripting-xss) saldırılarına karşı korunmaya yardımcı olur.

    Sunucunuz bu üstbilgiyi varsayılan olarak döndürmüyorsa, **Change server response headers** kuralını kullanarak eklemeniz önerilir. MDN Web Docs içinde [olası üstbilgi değerlerinin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy#directives) açıklamalarını ve [üstbilgi kullanım örneklerini](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP#examples_common_use_cases) bulabilirsiniz.

    Benzer şekilde, bu kural [`X-XSS-Protection`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection), [`X-Frame-Options`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options), [`X-Content-Type-Options`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options) yanıt üstbilgilerini eklemek için de kullanılabilir.
* NGINX `Server` üstbilgisini veya yüklü modül sürümlerine ilişkin verileri içeren herhangi bir üstbilgiyi değiştirmek. Bu veriler, saldırgan tarafından yüklü modül sürümlerindeki zafiyetleri keşfetmek ve sonuç olarak keşfedilen zafiyetleri istismar etmek için potansiyel olarak kullanılabilir.

    NGINX `Server` üstbilgisi, Wallarm node 2.16 ile birlikte değiştirilebilir.

**Change server response headers** kuralı ayrıca iş ve teknik konularınızı ele almak için de kullanılabilir.

## Kuralı oluşturma ve uygulama

Kuralı oluşturmak ve uygulamak için:


--8<-- "../include/rule-creation-initial-step.md"
1. **If request is** bölümünde, kuralın uygulanacağı kapsamı [açıklayın](rules.md#configuring).
1. **Then** bölümünde, **Change server response headers** seçeneğini seçin ve aşağıdakileri ayarlayın:

    * Eklenecek ya da değeri değiştirilecek üstbilginin adı.
    * Belirtilen üstbilginin yeni değeri/değerleri.
    * Mevcut bir yanıt üstbilgisini silmek için değerini **Replace** sekmesinde boş bırakın.

1. [Kural derlemesinin tamamlanmasını](rules.md#ruleset-lifecycle) bekleyin.

## Örnek: güvenlik politikası üstbilgisini ve değerini ekleme

`https://example.com/*` kapsamındaki tüm içeriğin yalnızca sitenin orijininden gelmesine izin vermek için, **Change server response headers** kuralını kullanarak [`Content-Security-Policy: default-src 'self'`](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP#example_1) yanıt üstbilgisini aşağıdaki şekilde ekleyebilirsiniz:

![“Change server response headers” kuralı örneği](../../images/user-guides/rules/add-replace-response-header.png)