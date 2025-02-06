```markdown
# FAST Eklentilerini Kullanma

## Eklentileri Bağlama

Oluşturulan eklentileri kullanmak için, bunların FAST node'una bağlanması gerekmektedir.

Bunu aşağıdaki yöntemlerden herhangi biriyle yapabilirsiniz:
* Eklentileri bir dizine yerleştirin ve bu dizini, `docker run` komutunun `-v` seçeneğini kullanarak FAST node Docker kapsayıcısına monte edin.
    
    ```
    sudo docker run --name <container name> --env-file=<file with environment variables> -v <directory with extensions>:/opt/custom_extensions -p <target port>:8080 wallarm/fast
    ```
    
    **Örnek:**
    
    Aşağıdaki komutu çalıştırarak FAST node'u, aşağıdaki argümanlarla Docker kapsayıcısında başlatın:

    1.  Kapsayıcı adı: `fast-node`.
    2.  Ortam değişkenleri dosyası: `/home/user/fast.cfg`.
    3.  FAST eklentileri dizin yolu: `/home/user/extensions`.
    4.  Kapsayıcının `8080` portunun yayınlanacağı port: `9090`.

    ```
    sudo docker run --name fast-node --env-file=/home/user/fast.cfg -v /home/user/extensions:/opt/custom_extensions -p 9090:8080 wallarm/fast
    ```

* Eklentileri kamuya açık bir Git deposuna yerleştirin ve gerekli depoya işaret eden ortam değişkenini FAST node Docker kapsayıcısında tanımlayın.
    
    Bunu yapmak için aşağıdakileri uygulayın:
    
    1.  Ortam değişkenlerini içeren dosyaya `GIT_EXTENSIONS` değişkenini ekleyin.

        **Örnek:**
        
        Eklentileriniz `https://github.com/wallarm/fast-detects` Git deposunda yer alıyorsa, aşağıdaki ortam değişkenini tanımlayın:
        
        ```
        GIT_EXTENSIONS=https://github.com/wallarm/fast-detects
        ```  
    
    2.  Ortam değişkenlerini içeren dosyayı kullanarak FAST node Docker kapsayıcısını aşağıdaki gibi çalıştırın:
        
        ```
        sudo docker run --name <container name> --env-file=<file with environment variables> -p <target port>:8080 wallarm/fast
        ```
        
        **Örnek:**
        
        Aşağıdaki komutu çalıştırarak FAST node'u, aşağıdaki argümanlarla Docker kapsayıcısında başlatın:

        1.  Kapsayıcı adı: `fast-node`.
        2.  Ortam değişkenleri dosyası: `/home/user/fast.cfg`.
        3.  Kapsayıcının `8080` portunun yayınlanacağı port: `9090`.
        
        ```
        sudo docker run --name fast-node --env-file=/home/user/fast.cfg -p 9090:8080 wallarm/fast
        ```

--8<-- "../include/fast/wallarm-api-host-note.md"

 FAST node başarıyla başlatılırsa, Wallarm Cloud ile başarılı bağlantıyı ve yüklenen eklenti sayısını bildiren aşağıdaki çıktı konsola yazılır:

--8<-- "../include/fast/console-include/dsl/fast-node-run-ok.md"

Node başlatılırken bir hata oluşursa, hata bilgisi konsola yazılır. Aşağıdaki örnekte gösterildiği gibi, eklenti sözdizimi hatası mesajı görüntülenir:

--8<-- "../include/fast/console-include/dsl/fast-node-run-fail.md"

!!! info "Eklenti konum gereksinimleri"
    İç içe dizinlerden gelen eklentiler bağlanmayacaktır (örneğin, eklenti `extensions/level-2/` dizinine yerleştirilmişse). Bağlantı yöntemine bağlı olarak, eklentiler FAST node Docker kapsayıcısına monte edilen dizinin kök dizinine veya Git deposunun kök dizinine yerleştirilmelidir.

## Eklentilerin Çalışmasını Kontrol Etme

Önceden oluşturulmuş olan [`mod-extension.yaml`][doc-mod-extension] ve [`non-mod-extension.yaml`][doc-non-mod-extension] eklentilerinin çalışmasını kontrol etmek için aşağıdaki adımları uygulayın:

1.  [Yukarıda bahsedilen adımları][anchor-connect-extension] izleyerek eklentileri FAST node'a bağlayın.

2.  Test politikasını oluşturun. Bu, FAST node'a bağlanan tüm FAST eklentileri tarafından kullanılacaktır. Test politikalarının nasıl çalıştığına dair detaylı bilgi [burada][doc-testpolicy] yer almaktadır.

    Unutmayın, bağlı değişikliği yapan eklenti baseline istekteki `POST_JSON_DOC_HASH_email_value` noktasını değiştirirken, değişiklik yapmayan eklenti `URI` noktasıyla çalışabilmek için izin gerektirir.
    
    Bu nedenle, her iki eklentinin de tek bir test çalışması sırasında yürütülebilmesi için, test politikasının aşağıdakilerle çalışmaya izin vermesi gerekir:
    
    * POST parametreleri
    * URI parametresi
    
    ![Test policy wizard, the “Insertion points” tab][img-test-policy-insertion-points]
    
    Ayrıca, eklentiler uygulamanın SQLi saldırısına karşı savunmasız olup olmadığını kontrol eder; bu nedenle Wallarm FAST detects (örneğin, RCE) ile uygulamayı diğer açıklıklara karşı kontrol etmek uygun olabilir. Bu, oluşturulan eklentiler yerine yerleşik FAST detects ile SQLi açığının tespit edildiğini doğrulamanıza yardımcı olacaktır. 
    
    ![Test policy wizard, the “Attacks to test” tab][img-test-policy-attacks]
    
    Oluşan test politikası şu şekilde görünmelidir:
    
    ```
    X-Wallarm-Test-Policy: type=rce; insertion=include:'POST_.*','URI';
    ```

3.  Oluşturulan test politikasına dayanarak FAST node için bir test çalışması oluşturun.
    
    ![Test run][img-test-run]

4.  FAST node'un konsola benzer bilgi mesajı yazana kadar bekleyin: `Recording baselines for TestRun#`. Bu, FAST node'un baseline isteklerini kaydetmeye hazır olduğunu gösterir.<br>
--8<-- "../include/fast/console-include/dsl/fast-node-recording.md"

5.  Aşağıdaki örnekte gösterildiği gibi, FAST node üzerinden OWASP Juice Shop giriş sayfasına rastgele parametrelerle bir POST isteği oluşturup gönderin:
    
    ```
    curl --proxy http://<FAST node IP address> \
        --request POST \
        --url http://ojs.example.local/rest/user/login \
        --header 'accept-language: en-US,en;q=0.9' \
        --header 'content-type: application/json' \
        --header 'host: ojs.example.local' \
        --data '{"email":"test@example.com", "password":"12345"}'
    ```
    
    İsteği göndermek için `curl` veya diğer araçları kullanabilirsiniz.
    
    !!! info "Baseline istek kaydetme işlemini durdurma"
        Baseline isteği gönderdikten sonra, kaydetme işlemini durdurmanız önerilir. Bu prosedür [burada][link-stop-recording] açıklanmaktadır.

6.  FAST node konsol çıktısında aşağıdakileri göreceksiniz:  

    * Hedef uygulamanın yerleşik FAST detects kullanılarak test edildiği,
    * POST parametrelerinde değişikliği yapan FAST eklentisinin çalıştığı, ve
    * URI parametresinde değişiklik yapmayan FAST eklentisinin çalıştığı.
    --8<-- "../include/fast/console-include/dsl/fast-node-working.md"

    Test çalışması bilgilerini Wallarm web arayüzünde açıp “Details” bağlantısına tıklayarak isteğin işlenme günlüğünü de görebilirsiniz.
    
    ![Test run bilgileri detaylı][img-testrun-details]
    
    ![İstek işleme günlüğü][img-log]

7.  Ayrıca, tespit edilen açıklıklar hakkında, örneğin “2 issues” şeklinde gösterilen tespit edilen olay sayısını içeren bağlantıya tıklayarak bilgi alabilirsiniz. “Vulnerabilities” sayfası açılacaktır.

    ![Wallarm web arayüzünde açıklıklar][img-vulns]
    
    “Risk”, “Type” ve “Title” sütunları, FAST eklentileri yardımıyla tespit edilen açıklıklar için eklentilerin `meta-info` bölümünde belirtilen değerleri içerecektir.

8.  Bir açıklığa tıklayarak, açıklığın açıklamasını (eklenti dosyasının `meta-info` bölümünden) ve açıklığı tetikleyen isteğe ait örneği içeren detaylı bilgileri görüntüleyebilirsiniz.

    Değişiklik yapabilen eklenti ile tespit edilmiş bir açıklığa ait bilgi örneği:
    
    ![Açıklık detaylı bilgi][img-vuln-details-mod]
```