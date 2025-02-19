[doc-tr-information]:   internals.md
[doc-testrecord]:       internals.md#test-record
[doc-state-description]:  check-testrun-status.md

[doc-create-testrun]:       create-testrun.md

[img-similar-tr-item]:              ../../images/fast/operations/common/copy-testrun/create-similar-testrun-item.png
[img-similar-tr-sidebar]:           ../../images/fast/operations/common/copy-testrun/create-similar-testrun-sidebar.png

# Test Çalıştırmasının Kopyalanması

!!! info "Gerekli Veriler"
    Bir API çağrısı yoluyla bir test çalıştırmasını kopyalamak için aşağıdaki veriler gereklidir:
    
    * bir token
    * mevcut bir test kayıt tanımlayıcısı

    Web arayüzü üzerinden bir test çalıştırmasını kopyalamak için bir Wallarm hesabı gereklidir.

    Token ve test kayıtları hakkında detaylı bilgiyi [buradan][doc-tr-information] edinebilirsiniz.
    
    Bu belgede örnek olarak kullanılan değerler:
    
    * Token olarak `token_Qwe12345`
    * Test kayıtı olarak `rec_0001`

Bir test çalıştırması kopyalanırken mevcut bir [test kaydı][doc-testrecord] yeniden kullanılır.

Kayıt edilmiş temel istekler kullanılarak hedef uygulamanın test edilmesi gerektiğinde bu test çalıştırması oluşturma yöntemi kullanılmalıdır.

## Test Çalıştırması Kopyalama Kuralları

Bir test çalıştırması kopyalanırken göz önünde bulundurulması gerekenler:
* Kopyalanan test çalıştırmasında kullanılacak herhangi bir test politikasını belirtebilirsiniz. Bu politika, orijinal test çalıştırmasında kullanılan politikadan farklı olabilir.
* Test çalıştırmaları `failed`, `interrupted`, `passed`, `paused`, `running` durumlarında kopyalanabilir. Bu test çalıştırması durumlarının açıklamalarını [burada][doc-state-description] bulabilirsiniz.
* Üzerinde temel istek bulunmayan boş bir test kaydı kullanılarak test çalıştırması kopyalanamaz.
* Eğer bir test kaydında bazı temel istekler kaydediliyorsa, bu kayıt kullanılarak test çalıştırması kopyalanamaz.
 
    Bitmemiş bir test kaydına dayalı olarak test çalıştırması kopyalamaya çalışırsanız, API sunucusundan `400` hata kodu (`Bad Request`) alırsınız ve hata mesajı aşağıdakine benzer olacaktır:

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
    
    Kayıt işlemi durdurulmadıkça web arayüzünden test çalıştırması kopyalamak mümkün değildir.

## API Üzerinden Test Çalıştırmasının Kopyalanması

Test çalıştırmasını kopyalayıp çalıştırmak için, POST isteğini şu URL'ye gönderin: `https://us1.api.wallarm.com/v1/test_run`:

--8<-- "../include/fast/operations/api-copy-testrun.md"

API sunucusuna yapılan istek başarılı olursa, sunucudan gelen yanıt size gösterilecektir. Bu yanıt, aşağıdakiler de dahil olmak üzere faydalı bilgiler sağlar:

1.  `id`: Test çalıştırması kopyasının tanımlayıcısı (örneğin, `tr_1234`).
    
    Test çalıştırması yürütme durumunu kontrol etmek için `id` parametresine ihtiyaç duyacaksınız.
    
2.  `state`: Test çalıştırmasının durumu.
    
    Yeni kopyalanmış test çalıştırması `running` durumundadır.
    
    `state` parametresinin tüm değerlerinin kapsamlı açıklamasını [burada][doc-state-description] bulabilirsiniz.

## Web Arayüzü Üzerinden Test Çalıştırmasının Kopyalanması    

Wallarm portalının web arayüzü üzerinden bir test çalıştırmasını kopyalayıp çalıştırmak için:
1.  Wallarm hesabınızla portala giriş yapın, ardından “Test runs” sekmesine gidin.
2.  Kopyalamak istediğiniz test çalıştırmasını seçin, ardından test çalıştırmasının sağındaki işlem menüsünü açın.
3.  “Create similar testrun” menü seçeneğini seçin. 

    ![The “Create similar test run” menu entry][img-similar-tr-item]

4.  Açılan yan menüde aşağıdaki öğeleri seçin:
    * Test çalıştırması kopyasının adı
    * Test çalıştırması kopyasıyla kullanılacak politika
    * Test çalıştırması kopyasının çalıştırılacağı node
    
    ![The “Test run” sidebar][img-similar-tr-sidebar]
    
    Gerekirse “Advanced settings” seçeneğini seçerek ek ayarları yapılandırabilirsiniz:
    
--8<-- "../include/fast/test-run-adv-settings.md"
    
5.  “Use baselines from `<the name of the test record to reuse>`” seçeneğinin işaretli olduğundan emin olun.

    !!! info "Test Kaydının Yeniden Kullanılması"
        Seçenekte belirtilen adın test çalıştırması adı değil, test kaydı adı olduğunu unutmayın.
        
        Test kaydı adı genellikle atlanır: örneğin, [bir test çalıştırması oluşturulursa][doc-create-testrun] `test_record_name` parametresi belirtilmeden, test kaydı adı test çalıştırması ile aynı olur.
        
        Yukarıdaki görsel, geçmişte `DEMO TEST RUN` test çalıştırması tarafından kullanılan `MY TEST RECORD` test kaydını belirten kopyalama iletişim kutusunu göstermektedir.

6.  “Create and run” butonuna tıklayarak test çalıştırmasını başlatın.