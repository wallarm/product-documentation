# Yanıt başlıklarını ayarlama

**Sunucu yanıt başlıklarını değiştirme** kuralı, sunucu yanıt başlıklarını eklemeyi, silmeyi ve değerlerini değiştirmeyi sağlar.

Bu kural tipi genellikle uygulama güvenliğinin ek katmanını yapılandırmak için kullanılır, örneğin:

* Bir sayfa için istemcinin yüklemeye izin verdiği kaynakları kontrol eden yanıt başlığı [`Content-Security-Policy`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) eklemek için. Bu, [XSS](../../attacks-vulns-list.md#crosssite-scripting-xss) saldırılarına karşı korumaya yardımcı olur.

    Eğer sunucunuz varsayılan olarak bu başlığı döndürmüyor ise, bunu **Sunucu yanıt başlıklarını değiştirme** kuralını kullanarak eklemeniz önerilir. MDN Web Docs'ta, [olası başlık değerlerinin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy#directives) ve [başlık kullanım örneklerinin](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP#examples_common_use_cases) tanımlarını bulabilirsiniz.

    Benzer şekilde, bu kural yanıt başlıklarını eklemek için kullanılabilir [`X-XSS-Protection`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection), [`X-Frame-Options`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options), [`X-Content-Type-Options`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options).
* NGINX başlığı `Server` veya yüklenmiş modül sürümlerinin verilerini içeren herhangi bir başka başlığı değiştirmek için. Bu veriler, saldırganın yüklenmiş modül sürümlerinin zayıflıklarını keşfetmek ve sonuç olarak, keşfedilen zayıflıkları kullanmak için potansiyel olarak kullanılabilir.

    NGINX başlığı `Server` Wallarm node 2.16 ile başlayarak değiştirilebilir.

**Sunucu yanıt başlıklarını değiştirme** kuralı ayrıca iş ve teknik konularınıza yönelik herhangi bir durumu çözmek için de kullanılabilir.

## Kural oluşturma ve uygulama

--8<-- "../include-tr/waf/features/rules/rule-creation-options.md"

**Kurallar** bölümünde kuralı oluşturmak ve uygulamak için:

1. Wallarm Konsolu'nun **Kurallar** bölümünde **Sunucu yanıt başlıklarını değiştirme** kuralını oluşturun. Kural, aşağıdaki bileşenlerden oluşur:

      * **Koşul**[kuralın uygulanacağı](rules.md#branch-description) uç noktaları tanımlar.
      * Eklenmesi ya da değerinin değiştirilmesi gereken başlığın adı.
      * Belirtilen başlığın yeni değeri.

        Var olan bir yanıt başlığını silmek için, lütfen **Değiştir** sekmesinde bu başlığın değerini boş bırakın.

2. [Kuralın derlenmesinin tamamlanmasını](rules.md) bekleyin.

## Kural örneği

`https://example.com/*` 'nın tüm içeriğinin sadece site kökeninden gelmesine izin vermek için, **Sunucu yanıt başlıklarını değiştirme** kuralını kullanarak yanıt başlığı eklenebilir [`Content-Security-Policy: default-src 'self'`](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP#example_1) aşağıdaki gibi:

![ "Sunucu yanıt başlıklarını değiştirme" kuralının örneği](../../images/user-guides/rules/add-replace-response-header.png)