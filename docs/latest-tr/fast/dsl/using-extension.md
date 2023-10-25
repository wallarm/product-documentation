[link-points]:                  points/intro.md
[link-stop-recording]:          ../qsg/test-run.md#2-execute-the-https-baseline-request-you-created-earlier 

[doc-mod-extension]:            extensions-examples/mod-extension.md
[doc-non-mod-extension]:        extensions-examples/non-mod-extension.md
[doc-testpolicy]:               logic.md#how-test-policy-influences-the-request-processing

[img-test-policy-insertion-points]:      ../../images/fast/dsl/common/using-extensions/tp_insertion_points.png
[img-test-policy-attacks]:              ../../images/fast/dsl/common/using-extensions/tp_attacks_test.png
[img-test-run]:                 ../../images/fast/dsl/common/using-extensions/create_testrun.png
[img-testrun-details]:          ../../images/fast/dsl/common/using-extensions/testrun_details.png
[img-log]:                      ../../images/fast/dsl/common/using-extensions/log.png
[img-vulns]:                    ../../images/fast/dsl/common/using-extensions/vulnerabilities.png
[img-vuln-details-mod]:             ../../images/fast/dsl/common/using-extensions/vuln_details-mod.png

[anchor-connect-extension]:     #connecting-extensions

# FAST Uzantılarını Kullanma

## Uzantıları Bağlama

Oluşturulan uzantıları kullanmak için, onları FAST düğümüne bağlamanız gerekmektedir.

Bunu aşağıdaki yollardan herhangi birisiyle yapabilirsiniz:
* Uzantıları bir dizine koyun ve bu dizini `docker run` komutunun `-v` seçeneğini kullanarak FAST düğümü Docker konteynerine bağlayın.
    
    ```
    sudo docker run --name <konteyner adı> --env-file=<environment değişkenleri dosyası> -v <uzantılarla ilgili dizin>:/opt/custom_extensions -p <hedef port>:8080 wallarm/fast
    ```
    
    **Örnek:**
    
    Aşağıdaki argümanlarla Docker konteynerinde FAST düğümünü başlatmak için aşağıdaki komutu çalıştırın:

    1.  Konteynerin adı: `fast-node`.
    2.  Çevre değişkenleri dosyası: `/home/user/fast.cfg`.
    3.  FAST uzantıları dizini yolu: `/home/user/extensions`.
    4.  Konteynerin `8080` portuna yayınlanan port: `9090`.

    ```
    sudo docker run --name fast-node --env-file=/home/user/fast.cfg -v /home/user/extensions:/opt/custom_extensions -p 9090:8080 wallarm/fast
    ```

* Uzantıları bir genel Git deposuna yerleştirin ve gerekli depoya atıfta bulunan çevre değişkenini FAST düğümü Docker konteynerinde tanımlayın.
    
    Bunu yapmak için aşağıdakileri gerçekleştirin:
    
    1.  Çevre değişkenlerini içeren dosyaya `GIT_EXTENSIONS` değişkenini ekleyin.

        **Örnek:**
        
        Uzantılarınız `https://github.com/wallarm/fast-detects` Git deposunda ise, aşağıdaki çevre değişkenini tanımlayın:
        
        ```
        GIT_EXTENSIONS=https://github.com/wallarm/fast-detects
        ```  
    
    2.  Çevre değişkenlerini içeren dosyayı kullanarak FAST düğümü Docker konteynerini çalıştırın:
        
        ```
        sudo docker run --name <konteyner adı> --env-file=<environment değişkenleri dosyası> -p <hedef port>:8080 wallarm/fast
        ```
        
        **Örnek:**
        
        Aşağıdaki argümanlarla Docker konteynerinde FAST düğümünü başlatmak için aşağıdaki komutu çalıştırın:

        1.  Konteynerin adı: `fast-node`.
        2.  Çevre değişkenleri dosyası: `/home/user/fast.cfg`.
        3.  Konteynerin `8080` portuna yayınlanan port: `9090`.
        
        ```
        sudo docker run --name fast-node --env-file=/home/user/fast.cfg -p 9090:8080 wallarm/fast
        ```

--8<-- "../include-tr/fast/wallarm-api-host-note.md"

 FAST düğümü başarılı bir şekilde başlatılırsa, başarılı bir şekilde Wallarm Cloud'a bağlandığını ve yüklenen uzantıların sayısını belirten aşağıdaki çıktıyı konsola yazar:

--8<-- "../include-tr/fast/console-include/dsl/fast-node-run-ok.md"

Düğümün başlatılması sırasında bir hata oluşursa, hata bilgisi konsola yazılır. Uzantı sözdizimi hatası hakkındaki mesaj aşağıdaki örnekte gösterilmiştir:

--8<-- "../include-tr/fast/console-include/dsl/fast-node-run-fail.md"

!!! info "Uzantıların konum gereksinimleri"
    İç içe olan dizinlerden uzantılar bağlanmayacaktır (örneğin, `extensions/level-2/` dizinine yerleştirilmiş bir uzantı). Bağlantı için seçilen yönteme bağlı olarak, uzantılar ya FAST düğümü Docker'in içine yerleştirilen dizinin köküne ya da Git deposunun köküne yerleştirilmelidir.

## Uzantıların Çalışmasını Kontrol Etme

Daha önce oluşturulan [`mod-extension.yaml`][doc-mod-extension] ve [`non-mod-extension.yaml`][doc-non-mod-extension] uzantılarının çalışmasını kontrol etmek için, aşağıdaki adımları gerçekleştirin:

1.  Uzantıları, [yukarıda belirtilen adımları][anchor-connect-extension] takip ederek FAST düğümüne bağlayın.

2.  Test politikasını oluşturun. Bu, FAST düğümüne bağlı olan tüm FAST uzantıları tarafından kullanılacaktır. Test politikalarının nasıl çalıştığı hakkında detaylı bilgi [burada][doc-testpolicy] bulunmaktadır.

    Size hatırlatalım ki, bağlı olan değiştirme uzantısı bir temel talepte `POST_JSON_DOC_HASH_email_value` noktasını değiştirir ve değiştirme olmayan uzantı `URI` noktasıyla çalışmak için izin gerektirir.
    
    Bu yüzden, tek bir test çalıştırmasında her iki uzantının da çalışmasını sağlamak için, bir test politikası aşağıdakilerle çalışmayı sağlamalıdır:
    
    * POST parametreleri
    * URI parametresi
    
    ![Test politikası sihirbazı, “Ekleme noktaları” sekmesi][img-test-policy-insertion-points]
    
    Ayrıca, uzantılar uygulamanın bir SQLi saldırısına karşı savunmasız olup olmadığını kontrol eder; bu yüzden Wallarm FAST algılamalarıyla (ör. RCE) uygulamanın diğer savunmasızlıkları için kontrol etmek uygun olabilir. Bu, SQLi savunmasızlığının yaratılan uzantılar yerine yerleşik FAST algılamalarıyla algılanmadığı durumu onaylamanıza yardımcı olacaktır. 
    
    ![Test politikası sihirbazı, “Test edilecek saldırılar” sekmesi][img-test-policy-attacks]
    
    Sonuçlanan test politikası aşağıdaki gibi görünmelidir:
    
    ```
    X-Wallarm-Test-Policy: type=rce; insertion=include:'POST_.*','URI';
    ```

3.  Oluşturulan test politikasına dayalı FAST düğümünüz için bir test çalıştırması oluşturun.
    
    ![Test run][img-test-run]

4.  FAST düğümünün konsola `TestRun# için temel çizgiler kaydediliyor` gibi bir bilgi mesajı yazdığını görene kadar bekleyin. Bu, FAST düğümünün temel talepleri kaydetmeye hazır olduğu anlamına gelir.<br>
--8<-- "../include-tr/fast/console-include/dsl/fast-node-recording.md"

5.  Aşağıdaki örnekte gösterildiği gibi, FAST düğümü üzerinden OWASP Juice Shop giriş sayfasına rastgele parametrelerle bir POST talebi oluşturun ve gönderin:
    
    ```
    curl --proxy http://<FAST Node IP adresi> \
        --request POST \
        --url http://ojs.example.local/rest/user/login \
        --header 'accept-language: tr-TR,tr;q=0.9' \
        --header 'content-type: application/json' \
        --header 'host: ojs.example.local' \
        --data '{"email":"test@example.com", "password":"12345"}'
    ```
    
    İsteği göndermek için `curl` veya diğer araçları kullanabilirsiniz.
    
    !!! info "Temel talep kayıt işleminin durdurulması"
        Temel isteği gönderdikten sonra, kayıt işlemini durdurmanız önerilir. Bu prosedür [burada][link-stop-recording] açıklanmıştır.

6.  FAST düğümü konsol çıktısında, hedef uygulamanın yerleşik FAST algılamaları kullanılarak nasıl test edildiğini, temel talepteki POST parametreleri için değiştirme FAST uzantısının ve temel talepteki URI parametresi için değiştirme olmayan FAST uzantısının nasıl çalıştığını göreceksiniz.
    --8<-- "../include-tr/fast/console-include/dsl/fast-node-working.md"

    Talep işleme tam logunu, Wallarm web arayüzündeki test çalıştırması bilgilerini açıp “Detaylar” linkine tıklayarak görebilirsiniz.
    
    ![Detaylı test çalıştırma bilgisi][img-testrun-details]
    
    ![Talep işleme tam logu][img-log]

7.  Algılanan savunmasızlıklar hakkındaki bilgileri görmek için, örneğin “2 issues” içeren bağlantıya tıkladığınızda görebilirsiniz. “Savunmasızlıklar” sayfası açılır.

    ![Wallarm web arayüzündeki Savunmasızlıklar][img-vulns]
    
    “Risk”, “Tip” ve “Başlık” sütunları, FAST uzantılarının yardımıyla algılanan savunmasızlıklar için uzantıların `meta-info` bölümünde belirtilen değerleri içerecektir.

8.  Hakkında detaylı bilgi almak için bir savunmasızlığın üzerine tıklayabilirsiniz, bunun içinde (uzantı dosyasının `meta-info` bölümünden) açıklaması ve sömürülmesine örnek olan bir talep bulunur.

    Bir savunmasızlık hakkında bilgi örneği (değiştirici uzantıyla algılanmış):
    
    ![Savunmasızlığın detaylı bilgisi][img-vuln-details-mod]
