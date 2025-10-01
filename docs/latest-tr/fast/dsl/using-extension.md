[link-points]:                  points/intro.md
[link-stop-recording]:          ../qsg/test-run.md#2-execute-the-https-baseline-request-you-created-earlier 

[doc-mod-extension]:            extensions-examples/mod-extension.md
[doc-non-mod-extension]:        extensions-examples/non-mod-extension.md
[doc-testpolicy]:               logic.md

[img-test-policy-insertion-points]:      ../../images/fast/dsl/common/using-extensions/tp_insertion_points.png
[img-test-policy-attacks]:              ../../images/fast/dsl/common/using-extensions/tp_attacks_test.png
[img-test-run]:                 ../../images/fast/dsl/common/using-extensions/create_testrun.png
[img-testrun-details]:          ../../images/fast/dsl/common/using-extensions/testrun_details.png
[img-log]:                      ../../images/fast/dsl/common/using-extensions/log.png
[img-vulns]:                    ../../images/fast/dsl/common/using-extensions/vulnerabilities.png
[img-vuln-details-mod]:             ../../images/fast/dsl/common/using-extensions/vuln_details-mod.png

[anchor-connect-extension]:     #connecting-extensions

# FAST Eklentilerini Kullanma

<a name="connecting-extensions"></a>
## Eklentileri Bağlama

Oluşturulan eklentileri kullanmak için bunları FAST düğümüne bağlamanız gerekir.

Bunu aşağıdaki yollardan biriyle yapabilirsiniz:
* Eklentileri bir dizine yerleştirin ve bu dizini `docker run` komutunun `-v` seçeneğini kullanarak FAST düğümü Docker konteynerine bağlayın.
    
    ```
    sudo docker run --name <container name> --env-file=<file with environment variables> -v <directory with extensions>:/opt/custom_extensions -p <target port>:8080 wallarm/fast
    ```
    
    Örnek:
    
    Aşağıdaki komutu, FAST düğümünü şu argümanlarla Docker konteynerinde başlatmak için çalıştırın:

    1.  Konteynerin adı: `fast-node`.
    2.  Ortam değişkenleri dosyası: `/home/user/fast.cfg`.
    3.  FAST eklentileri dizin yolu: `/home/user/extensions`.
    4.  Konteynerin `8080` portunun yayınlandığı port: `9090`.

    ```
    sudo docker run --name fast-node --env-file=/home/user/fast.cfg -v /home/user/extensions:/opt/custom_extensions -p 9090:8080 wallarm/fast
    ```

* Eklentileri herkese açık bir Git deposuna yerleştirin ve FAST düğümü Docker konteynerinde ilgili depoya işaret eden ortam değişkenini tanımlayın.
    
    Bunu yapmak için şunları uygulayın:
    
    1.  Ortam değişkenlerini içeren dosyaya `GIT_EXTENSIONS` değişkenini ekleyin.

        Örnek:
        
        Eklentileriniz `https://github.com/wallarm/fast-detects` Git deposundaysa aşağıdaki ortam değişkenini tanımlayın:
        
        ```
        GIT_EXTENSIONS=https://github.com/wallarm/fast-detects
        ```  
    
    2.  FAST düğümü Docker konteynerini, ortam değişkenlerini içeren dosyayı kullanarak aşağıdaki gibi çalıştırın:
        
        ```
        sudo docker run --name <container name> --env-file=<file with environment variables> -p <target port>:8080 wallarm/fast
        ```
        
        Örnek:
        
        Aşağıdaki komutu, FAST düğümünü şu argümanlarla Docker konteynerinde başlatmak için çalıştırın:

        1.  Konteynerin adı: `fast-node`.
        2.  Ortam değişkenleri dosyası: `/home/user/fast.cfg`.
        3.  Konteynerin `8080` portunun yayınlandığı port: `9090`.
        
        ```
        sudo docker run --name fast-node --env-file=/home/user/fast.cfg -p 9090:8080 wallarm/fast
        ```

--8<-- "../include/fast/wallarm-api-host-note.md"

 FAST düğümü başarıyla başlatılırsa, Wallarm Cloud bağlantısının başarılı olduğunu ve yüklenen eklenti sayısını bildiren aşağıdaki çıktıyı konsola yazar:

--8<-- "../include/fast/console-include/dsl/fast-node-run-ok.md"

Düğüm başlatılırken bir hata oluşursa, hata bilgileri konsola yazılır. Eklenti sözdizimi hatasıyla ilgili mesaj aşağıdaki örnekte gösterilmiştir:

--8<-- "../include/fast/console-include/dsl/fast-node-run-fail.md"

!!! info "Eklentilerin konum gereksinimleri"
    İç içe dizinlerdeki eklentiler bağlanmaz (örneğin, eklenti `extensions/level-2/` dizinine yerleştirilmişse). Seçilen bağlantı yöntemine bağlı olarak, eklentiler ya FAST düğümü Docker konteynerine bağlanan dizinin köküne ya da Git deposunun köküne yerleştirilmelidir.

## Eklentilerin Çalışmasını Kontrol Etme

Daha önce oluşturulan [`mod-extension.yaml`][doc-mod-extension] ve [`non-mod-extension.yaml`][doc-non-mod-extension] eklentilerinin çalışmasını kontrol etmek için aşağıdaki adımları uygulayın:

1.  Eklentileri, [yukarıdaki adımları][anchor-connect-extension] izleyerek FAST düğümüne bağlayın.

2.  Test politikasını oluşturun. Bu, FAST düğümüne bağlı tüm FAST eklentileri tarafından kullanılacaktır. Test politikalarının nasıl çalıştığıyla ilgili ayrıntılı bilgi [burada][doc-testpolicy] yer almaktadır.

    Anımsatalım: Bağlı olan değiştirici eklenti, temel istekteki `POST_JSON_DOC_HASH_email_value` noktasını değiştirir ve değiştirici olmayan eklenti `URI` noktasıyla çalışmak için izin gerektirir.
    
    Bu nedenle, her iki eklentinin de tek bir test çalıştırması sırasında yürütülmesi için, bir test politikası şunlarla çalışmaya izin vermelidir:
    
    * POST parametreleri
    * URI parametresi
    
    ![Test policy wizard, “Insertion points” sekmesi][img-test-policy-insertion-points]
    
    Ayrıca, eklentiler uygulamanın bir SQLi saldırısına karşı savunmasız olup olmadığını kontrol eder; bu nedenle uygulamayı Wallarm FAST detects (ör. RCE) ile diğer zafiyetlere karşı da kontrol etmek uygun olabilir. Bu, SQLi zafiyetinin, yerleşik FAST detects yerine oluşturulan eklentilerle tespit edildiğini doğrulamanıza yardımcı olur. 
    
    ![Test policy wizard, “Attacks to test” sekmesi][img-test-policy-attacks]
    
    Ortaya çıkan test politikası aşağıdaki gibi olmalıdır:
    
    ```
    X-Wallarm-Test-Policy: type=rce; insertion=include:'POST_.*','URI';
    ```

3.  Oluşturulan test politikasına dayanarak FAST düğümünüz için bir test çalıştırması oluşturun.
    
    ![Test çalıştırması][img-test-run]

4.  FAST düğümü, konsola şu mesaja benzer bir bilgilendirme mesajı yazana kadar bekleyin: `Recording baselines for TestRun#`. Bu, FAST düğümünün temel istekleri kaydetmeye hazır olduğu anlamına gelir.<br>
--8<-- "../include/fast/console-include/dsl/fast-node-recording.md"

5.  Aşağıdaki örnekte gösterildiği gibi, FAST düğümü üzerinden OWASP Juice Shop oturum açma sayfasına rastgele parametrelerle bir POST isteği oluşturup gönderin:
    
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
    
    !!! info "Temel istek kayıt sürecini durdurma"
        Temel isteği gönderdikten sonra kayıt işlemini durdurmanız önerilir. Bu prosedür [burada][link-stop-recording] açıklanmaktadır.

6.  FAST düğümü konsol çıktısında şunları göreceksiniz:  

    * hedef uygulama yerleşik FAST detects kullanılarak test edilir,
    * temel istekteki POST parametreleri için değiştirici FAST eklentisi çalışır ve
    * temel istekteki URI parametresi için değiştirici olmayan FAST eklentisi çalışır.
    --8<-- "../include/fast/console-include/dsl/fast-node-working.md"

    Wallarm web arayüzünde test çalıştırması bilgilerini açıp “Details” bağlantısına tıklayarak istek işlemenin tam günlüğünü görebilirsiniz.
    
    ![Ayrıntılı test çalıştırması bilgileri][img-testrun-details]
    
    ![İstek işlemenin tam günlüğü][img-log]

7.  Ayrıca, tespit edilen sorun sayısını içeren bağlantıya tıklayarak (ör. “2 issues.”) tespit edilen zafiyetlerle ilgili bilgileri görebilirsiniz. “Vulnerabilities” sayfası açılacaktır.

    ![Wallarm web arayüzünde Vulnerabilities][img-vulns]
    
    “Risk,” “Type,” ve “Title” sütunları, FAST eklentilerinin yardımıyla tespit edilen zafiyetler için eklentilerin `meta-info` bölümünde belirtilen değerleri içerecektir.

8.  Bir zafiyete tıklayarak, açıklaması (eklenti dosyasının `meta-info` bölümünden) ve onu sömüren isteğe örnek de dâhil olmak üzere ayrıntılı bilgilerini görüntüleyebilirsiniz.

    Bir zafiyet hakkında bilgilere örnek (değiştirici eklenti ile tespit edildi):
    
    ![Zafiyetin ayrıntılı bilgisi][img-vuln-details-mod]