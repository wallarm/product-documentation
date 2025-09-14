[doc-tr-information]:   internals.md
[doc-testrecord]:       internals.md#test-record
[doc-state-description]:  check-testrun-status.md

[doc-create-testrun]:       create-testrun.md

[img-similar-tr-item]:              ../../images/fast/operations/common/copy-testrun/create-similar-testrun-item.png
[img-similar-tr-sidebar]:           ../../images/fast/operations/common/copy-testrun/create-similar-testrun-sidebar.png

#   Bir Test Çalıştırmasının Kopyalanması

!!! info "Gerekli Veriler"
    Bir test çalıştırmasını bir API çağrısı ile kopyalamak için aşağıdaki veriler gereklidir:
    
    * bir token
    * mevcut bir test kaydı tanımlayıcısı

    Bir test çalıştırmasını web arayüzü üzerinden kopyalamak için bir Wallarm hesabı gereklidir.

    Token ve test kayıtları hakkında ayrıntılı bilgiyi [burada][doc-tr-information] bulabilirsiniz.
    
    Bu belgede örnek olarak aşağıdaki değerler kullanılmıştır:

    * `token_Qwe12345` bir token olarak.
    * `rec_0001` bir test kaydı olarak.

Bir test çalıştırması kopyalanırken, mevcut bir [test kaydı][doc-testrecord] yeniden kullanılır.

Hedef uygulamayı önceden kaydedilmiş temel istekleri kullanarak test etmek gerektiğinde bu test çalıştırması oluşturma yöntemi kullanılmalıdır.


##  Test Çalıştırmasını Kopyalama Kuralları

Bir test çalıştırmasını kopyalarken dikkate alınması gerekenler:
* Kopyalanan test çalıştırmasının kullanacağı herhangi bir test politikasını belirtebilirsiniz. Bu politika, orijinal test çalıştırmasında kullanılan politikadan farklı olabilir.
* Aşağıdaki durumlarda olan test çalıştırmalarını kopyalayabilirsiniz: `failed`, `interrupted`, `passed`, `paused`, `running`. Bu test çalıştırması durumlarının açıklamaları [burada][doc-state-description] verilmiştir. 
* İçinde hiçbir temel istek bulunmayan boş bir test kaydı kullanılarak bir test çalıştırması kopyalanamaz.
* Bir test kaydına bazı temel istekler kaydedilmekteyse, bu kayıt bir test çalıştırmasını kopyalamak için kullanılamaz.
 
    Tamamlanmamış bir test kaydına dayanarak bir test çalıştırmasını kopyalamaya çalışırsanız, API sunucusundan `400` hata kodu (`Bad Request`) ve aşağıdakine benzer bir hata mesajı alırsınız:

    ```
    {
        "status": 400,
        "body": {
            "test_record_id": {
            "error": "not_ready_for_cloning",
            "value": rec_0001
            }
        }
    }
    ```
    
    Kayıt işlemi durdurulmadıkça web arayüzünden bir test çalıştırması kopyalanamaz.

##  Bir Test Çalıştırmasını API ile Kopyalama

Bir test çalıştırmasını kopyalamak ve çalıştırmak için `https://us1.api.wallarm.com/v1/test_run` URL’sine POST isteği gönderin:

--8<-- "../include/fast/operations/api-copy-testrun.md"

API sunucusuna yapılan istek başarılı olursa, sunucunun yanıtı gösterilir. Yanıtta aşağıdakiler de dahil olmak üzere yararlı bilgiler bulunur:

1.  `id`: bir test çalıştırması kopyasının tanımlayıcısı (örn., `tr_1234`).
    
    Test çalıştırmasının yürütme durumunu kontrol etmek için `id` parametresinin değerine ihtiyaç duyarsınız.
    
2.  `state`: test çalıştırmasının durumu.
    
    Yeni kopyalanan test çalıştırması `running` durumundadır.
    
    `state` parametresinin tüm değerlerinin kapsamlı açıklaması [burada][doc-state-description] bulunabilir.

    
##  Bir Test Çalıştırmasını Web Arayüzü ile Kopyalama    

Wallarm portalının web arayüzü üzerinden bir test çalıştırmasını kopyalayıp çalıştırmak için:
1.  Wallarm hesabınızla portala giriş yapın, ardından “Test runs” sekmesine gidin.
2.  Kopyalanacak bir test çalıştırmasını seçin, ardından test çalıştırmasının sağındaki eylem menüsünü açın.
3.  “Create similar testrun” menü öğesini seçin. 

    ![“Create similar test run” menü öğesi][img-similar-tr-item]

4.  Açılan kenar çubuğunda aşağıdaki öğeleri seçin:
    * test çalıştırması kopyasının adı
    * test çalıştırması kopyasıyla kullanılacak politika
    * test çalıştırması kopyasının çalıştırılacağı düğüm
    
    ![“Test run” kenar çubuğu][img-similar-tr-sidebar]
    
    Gerekirse “Advanced settings” seçeneğini seçerek ek ayarları yapılandırabilirsiniz:
    
--8<-- "../include/fast/test-run-adv-settings.md"
    
5.  “Use baselines from `<the name of the test record to reuse>`” seçeneğinin işaretli olduğundan emin olun.

    !!! info "Test Kaydını Yeniden Kullanma"
        Seçenekte gösterilenin test çalıştırması adı değil, test kaydı adı olduğunu unutmayın.
        
        `test_record_name` parametresi belirtilmeden [bir test çalıştırması oluşturulursa][doc-create-testrun], test kaydının adı test çalıştırmasının adıyla aynı olur.
        
        Yukarıdaki görsel, adının geçmişte bu test kaydını kullanan test çalıştırmasının adıyla eşdeğer olmadığı bir test kaydından bahseden kopyalama diyalogunu göstermektedir (`MY TEST RECORD` test kaydı, `DEMO TEST RUN` test çalıştırması tarafından kullanılmıştır). 

6.  “Create and run” düğmesine tıklayarak test çalıştırmasını çalıştırın.