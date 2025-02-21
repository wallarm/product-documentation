[api-discovery-enable-link]:        ../../api-discovery/setup.md#enable

# Sunucu Yanıt Başlıklarının Değiştirilmesi

**Change server response headers** [kuralı](../../user-guides/rules/rules.md), sunucu yanıt başlıklarının eklenmesine, silinmesine ve değerlerinin değiştirilmesine olanak tanır.

Bu kural türü, genellikle uygulama güvenliğinin ek katmanını yapılandırmak için kullanılır, örneğin:

* Belirli bir sayfa için istemcinin yükleyebileceği kaynakları kontrol eden ve bu kaynak yüklemesini sağlayan yanıt başlığı olarak [`Content-Security-Policy`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) eklemek. Bu, [XSS](../../attacks-vulns-list.md#crosssite-scripting-xss) saldırılarına karşı koruma sağlar.

    Eğer sunucunuz varsayılan olarak bu başlığı döndürmüyorsa, **Change server response headers** kuralını kullanarak eklemeniz önerilir. MDN Web Docs'ta, [muhtemel başlık değerlerinin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy#directives) açıklamalarını ve [başlık kullanım örneklerini](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP#examples_common_use_cases) bulabilirsiniz.

    Benzer şekilde, bu kural [`X-XSS-Protection`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection), [`X-Frame-Options`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options) ve [`X-Content-Type-Options`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options) yanıt başlıklarını eklemek için de kullanılabilir.
* NGINX `Server` başlığı ya da yüklü modül sürümlerine ait verileri içeren diğer başlıkları değiştirmek. Bu veriler, saldırganın yüklü modül sürümlerindeki güvenlik açıklarını tespit edip, bu açıkları kullanması için potansiyel bir kaynak oluşturabilir.

    NGINX `Server` başlığı, Wallarm node 2.16'dan itibaren değiştirilebilir hale gelmiştir.

**Change server response headers** kuralı, iş ve teknik sorunlarınızın herhangi birini çözmek için de kullanılabilir.

## Kuralın Oluşturulması ve Uygulanması

Kuralı oluşturmak ve uygulamak için:

--8<-- "../include/rule-creation-initial-step.md"
1. **If request is** bölümünde, kuralın uygulanacağı kapsamı [tanımlayın](rules.md#configuring).
1. **Then** bölümünde, **Change server response headers** seçeneğini seçin ve şunları ayarlayın:

    * Eklenmek istenen veya değeri değiştirilecek başlık adı.
    * Belirtilen başlık için yeni değer(ler).
    * Mevcut bir yanıt başlığını silmek için, **Replace** sekmesinde değeri boş bırakın.

1. [Kural derlemesinin tamamlanmasını](rules.md#ruleset-lifecycle) bekleyin.

## Örnek: Güvenlik Politikası Başlığının ve Değerinin Eklenmesi

`https://example.com/*` adresindeki içeriğin yalnızca sitenin kökeninden gelmesine izin vermek için, **Change server response headers** kuralını kullanarak [`Content-Security-Policy: default-src 'self'`](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP#example_1) yanıt başlığını aşağıdaki gibi ekleyebilirsiniz:

![Example of the rule "Change server response headers"](../../images/user-guides/rules/add-replace-response-header.png)