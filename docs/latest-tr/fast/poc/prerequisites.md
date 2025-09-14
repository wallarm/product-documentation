[link-wl-portal-us]:        https://us1.my.wallarm.com
[link-wl-portal-eu]:        https://my.wallarm.com    
[link-selenium]:            https://www.seleniumhq.org/

[doc-create-node]:          ../operations/create-node.md
[doc-about-token]:          ../operations/internals.md#token
[doc-integration-overview]: integration-overview.md


#   Entegrasyon Önkoşulları

FAST'i bir CI/CD iş akışına entegre etmeyi etkinleştirmek için şunlara ihtiyacınız olacak

* Wallarm hesabına ve FAST düğüm yönetimine erişim elde etmek için [Wallarm Satış Ekibi](mailto:sales@wallarm.com) ile iletişime geçin.
* FAST düğümünün Docker konteynerinin, HTTPS protokolü (`TCP/443`) üzerinden `us1.api.wallarm.com` Wallarm API sunucusuna erişimi olmalıdır
--8<-- "../include/fast/cloud-note.md"

 * CI/CD iş akışınız için Docker konteynerleri oluşturma ve çalıştırma izinleri
    
* Güvenlik açıklarını test etmek için bir web uygulaması veya API (bir *hedef uygulama*)
    
    Bu uygulamanın iletişim için HTTP veya HTTPS protokolünü kullanması zorunludur.
    
    FAST güvenlik testi tamamlanana kadar hedef uygulama erişilebilir durumda kalmalıdır.
    
* Hedef uygulamayı HTTP ve HTTPS istekleriyle test edecek bir test aracı (bir *istek kaynağı*).
    
    Bir istek kaynağı, bir HTTP veya HTTPS proxy sunucusuyla çalışabilmelidir.
    
    [Selenium][link-selenium], belirtilen gereksinimleri karşılayan bir test aracına örnektir.
    
* Bir veya daha fazla [belirteç][doc-about-token].
    <p id="anchor-token"></p>

    Wallarm cloud içinde bir FAST düğümü [oluşturun][doc-create-node] ve bir CI/CD görevi yürütürken Docker konteynerinde karşılık gelen belirteci kullanın.  
    
    Belirteç, CI/CD işi yürütülürken FAST düğümlü Docker konteyneri tarafından kullanılacaktır.

    Aynı anda çalışan birden fazla CI/CD işiniz varsa, Wallarm cloud içinde uygun sayıda FAST düğümü oluşturun.

    !!! info "Örnek belirteç"
        Bu kılavuz boyunca `token_Qwe12345` değeri bir belirteç örneği olarak kullanılmıştır.