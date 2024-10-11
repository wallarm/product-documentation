[link-wl-portal-us]:        https://us1.my.wallarm.com
[link-wl-portal-eu]:        https://my.wallarm.com    
[link-selenium]:            https://www.seleniumhq.org/

[doc-create-node]:          ../operations/create-node.md
[doc-about-token]:          ../operations/internals.md#token
[doc-integration-overview]: integration-overview.md


#   Entegrasyon Önkoşulları

FAST'ı bir CI/CD iş akışına entegre etmek için ihtiyacınız olanlar:

* Contact the [Wallarm Sales Team](mailto:sales@wallarm.com) to get access to the Wallarm account and FAST node management.
* FAST düğümünün Docker konteyneri, `us1.api.wallarm.com` Wallarm API sunucusuna HTTPS protokolü (`TCP/443`) üzerinden erişim sağlamalıdır
--8<-- "../include-tr/fast/cloud-note.md"

 * Docker konteynerlerini oluşturma ve CI/CD iş akışınız için çalıştırma yetkisi
    
* Zafiyetler için test edilecek bir web uygulaması veya API (bir *hedef uygulama*)
    
    Bu uygulamanın iletişim için HTTP veya HTTPS protokolünü kullanması zorunludur.
    
    Hedef uygulama, FAST güvenlik testi tamamlanana kadar erişilebilir olmalıdır.
    
* Hedef uygulamayı HTTP ve HTTPS istekleri kullanarak test edecek bir test aracı (bir *istek kaynağı*).
    
    Bir istek kaynağı, bir HTTP veya HTTPS vekil sunucusuyla çalışabilmelidir.
    
    [Selenium][link-selenium], belirtilen gereksinimleri karşılayan bir test aracına örnektir.
    
* Bir veya daha fazla [token][doc-about-token].
    <p id="anchor-token"></p>

    Wallarm bulutunda bir [FAST düğümü][doc-create-node] oluşturun ve CI/CD görevi gerçekleştirirken Docker konteynırında ilgili tokeni kullanın.  
    
    Token, CI/CD işi yürütülürken Docker konteyneri içindeki FAST düğümü tarafından kullanılacak.

    Eğer aynı anda çalışan birden çok CI/CD işiniz varsa, Wallarm bulutunda uygun sayıda FAST düğümü oluşturun.

    !!! info "Bir token örneği"
        Bu kılavuz boyunca bir token örneği olarak `token_Qwe12345` değeri kullanılmaktadır.