[link-wl-portal-us]:        https://us1.my.wallarm.com
[link-wl-portal-eu]:        https://my.wallarm.com    
[link-selenium]:            https://www.seleniumhq.org/

[doc-create-node]:          ../operations/create-node.md
[doc-about-token]:          ../operations/internals.md#token
[doc-integration-overview]: integration-overview.md


# Entegrasyon Gereksinimleri

FAST'ı bir CI/CD iş akışına entegre edebilmek için şunlara ihtiyacınız olacak:

* Wallarm hesabına ve FAST node yönetimine erişim sağlamak için [Wallarm Sales Team](mailto:sales@wallarm.com) ile iletişime geçin.
* FAST node'un Docker konteynerinin, HTTPS protokolü (`TCP/443`) üzerinden `us1.api.wallarm.com` Wallarm API sunucusuna erişimi olmalıdır.
--8<-- "../include/fast/cloud-note.md"

 * CI/CD iş akışınız için Docker konteynerleri oluşturma ve çalıştırma izinlerine sahip olun.
    
* Güvenlik açıklarını test etmek için kullanılacak bir web uygulaması veya API (bir *hedef uygulama*)
    
    Bu uygulamanın iletişim için HTTP veya HTTPS protokolünü kullanması zorunludur.
    
    Hedef uygulama, FAST güvenlik testi tamamlanana kadar erişilebilir durumda kalmalıdır.
    
* Hedef uygulamayı HTTP ve HTTPS istekleri kullanarak test edecek bir test aracı (bir *istek kaynağı*).
    
    Bir istek kaynağının, HTTP veya HTTPS proxy sunucusu ile çalışabiliyor olması gerekmektedir.
    
    [Selenium][link-selenium], belirtilen gereksinimleri karşılayan bir test aracı örneğidir.
    
* Bir veya daha fazla [token][doc-about-token].
    <p id="anchor-token"></p>

    Wallarm Cloud'da [bir FAST node oluşturun][doc-create-node] ve CI/CD görevi sırasında Docker konteynerinde ilgili tokeni kullanın.  
    
    Token, CI/CD iş yürütmesi sırasında Docker konteyneri tarafından FAST node ile birlikte kullanılacaktır.

    Aynı anda birden fazla CI/CD işi çalışıyorsa, Wallarm Cloud'da yeterli sayıda FAST node oluşturun.

    !!! info "Bir örnek token"
        Bu kılavuzda, token örneği olarak `token_Qwe12345` değeri kullanılmıştır.