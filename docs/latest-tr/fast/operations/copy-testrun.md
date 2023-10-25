[doc-tr-information]:   internals.md
[doc-testrecord]:       internals.md#test-record
[doc-state-description]:  check-testrun-status.md

[doc-create-testrun]:       create-testrun.md

[img-similar-tr-item]:              ../../images/fast/operations/common/copy-testrun/create-similar-testrun-item.png
[img-similar-tr-sidebar]:           ../../images/fast/operations/common/copy-testrun/create-similar-testrun-sidebar.png

#   Bir Test Çalışmasının Kopyalanması

!!! info "Gerekli Veriler"
    Bir API çağrısıyla bir test çalışmasını kopyalamak için aşağıdaki veri parçaları gereklidir:
    
    * bir token
    * mevcut bir test kayıt kimliği

    Bir web arayüzü üzerinden bir test çalışmasını kopyalamak için bir Wallarm hesabı gerekir.

    Token ve test kayıtları hakkında ayrıntılı bilgiyi [burada][doc-tr-information] bulabilirsiniz.
    
    Bu belgede örnek olarak kullanılan değerler:

    * `token_Qwe12345` bir token olarak.
    * `rec_0001` bir test kaydı olarak.

Bir test çalışması kopyalandığında, mevcut bir [test kaydı][doc-testrecord] yeniden kullanılır.

Bu test çalışması oluşturma yöntemi, zaten kaydedilmiş temel istekleri kullanarak bir hedef uygulamayı test etmek gerektiğinde kullanılmalıdır.


##  Test Çalışmasının Kopyalanması Kuralları

Bir test çalışması kopyalanırken dikkate alınması gereken şeyler:
* Kopyalanan bir test çalışması tarafından kullanılacak herhangi bir test politikasını belirleyebilirsiniz. Bu politika, orijinal test çalışmasında kullanılan politikadan farklı olabilir.
* `failed`, `interrupted`, `passed`, `paused`, `running` durumundaki test çalışmalarını kopyalayabilirsiniz. Bu test çalışma durumlarının açıklamaları [burada][doc-state-description] verilmiştir.
* İçinde hiç temel talep olmayan boş bir test kaydını kullanarak bir test çalışması kopyalamak mümkün değildir.
* Bazı temel talepler bir test kaydına kaydediliyorsa, bu kayıt bir test çalışmasını kopyalamak için kullanılamaz. 

    Eğer bitmemiş bir test kaydına dayalı bir test çalışması kopyalamaya çalışırsanız, API sunucusundan `400` hata kodu (`Bad Request`) ve aşağıdakine benzer bir hata mesajı alırsınız:

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
    
    Kayıt süreci durdurulmadıkça web arayüzünden bir test çalışmasını kopyalamak mümkün değildir.

##  Bir API Üzerinden Test Çalışmasının Kopyalanması

Bir test çalışmasını kopyalamak ve çalıştırmak için `https://us1.api.wallarm.com/v1/test_run` URL'sine POST isteği gönderin:

--8<-- "../include-tr/fast/operations/api-copy-testrun.md"

API sunucusuna istek başarılı bir şekilde ulaşırsa, sunucunun yanıtıyla karşılaşacaksınız. Yanıt, yararlı bilgiler sağlar, bunlar arasında:

1.  `id`: bir test çalışmasının kopyasının kimliği (ör. `tr_1234`).
    
    Test çalışma durumunu kontrol etmek için `id` parametre değerine ihtiyacınız olacak.
    
2.  `state`: test çalışmasının durumu.
    
    Yeni kopyalanan bir test çalışması `running` durumundadır.
    
    `state` parametresinin tüm değerlerinin kapsamlı bir açıklamasını [burada][doc-state-description] bulabilirsiniz.

    
##  Web Arayüzü Üzerinden Test Çalışmasının Kopyalanması  

Wallarm portalının web arayüzü üzerinden bir test çalışmasını kopyalamak ve çalıştırmak için:
1.  Wallarm hesabınızla portalına giriş yapın, ardından “Test runs” sekmesine gidin.
2.  Kopyalamak istediğiniz test çalışmasını seçin, ardından test çalışmasının sağındaki eylem menüsünü açın.
3.  “Create similar testrun” menü girişini seçin. 

    ![“Create similar test run” menü girişi][img-similar-tr-item]

4.  Açılan kenar çubuğundaki aşağıda yer alacak olanları seçin:
    * test çalışmasının kopyasının adı
    * test çalışmasının kopyasıyla kullanılacak politika
    * test çalışmasının kopyasının çalışacağı düğüm
    
    ![“Test run” sidebar][img-similar-tr-sidebar]
    
    Gerekirse “Advanced settings” seçerek ek ayarlar yapabilirsiniz:
    
--8<-- "../include-tr/fast/test-run-adv-settings.md"
    
5.  “Use baselines from `<reuse edilecek test kaydının adı>`” seçeneğinin işaretli olduğundan emin olun.

    !!! info "Bir Test Kaydını Yeniden Kullanma"
        Bu seçenekte test çalışması adı değil, test kaydı adı göründüğüne dikkat edin.
        
        Bir test kayıt adı genellikle atlanır: örneğin, [bir test çalışması oluşturulurken][doc-create-testrun] `test_record_name` parametresi belirtilmemişse, test kaydının adı test çalışmasının adıyla aynıdır.
        
        Yukarıdaki şekilde, geçmişte bu test kaydını kullanan test çalışmanın adının test kaydının adına eşit olmadığı bir test kaydını belirten bir kopya diyalogu görülmektedir (DEMO TEST RUN test çalışması tarafından kullanılan MY TEST RECORD test kaydı). 

6.  “Create and run” düğmesine tıklayarak test çalışmasını çalıştırın.    