[img-test-run-creation]:            ../../images/fast/operations/common/create-testrun/test-run-create.png
[img-testrun-adv-settings]:         ../../images/fast/operations/common/create-testrun/test-run-settings.png

[doc-token-information]:    internals.md#token
[doc-state-description]:    check-testrun-status.md
[doc-copying-testrun]:      copy-testrun.md
[doc-testrecord]:           internals.md#test-record

[link-stopping-recording-chapter]:  stop-recording.md
[link-create-policy]:               test-policy/general.md
[link-create-node]:                 create-node.md
[doc-inactivity-timeout]:           internals.md#test-run

#   Bir Test Çalıştırması Oluşturma

!!! info "Gerekli veriler"
    API yöntemleriyle bir test çalıştırması oluşturmak için bir token gerekir.
    
    Web arayüzüyle bir test çalıştırması oluşturmak için bir Wallarm hesabına ihtiyacınız vardır.
    
    Token hakkında ayrıntılı bilgiyi [buradan][doc-token-information] alabilirsiniz.
    
    Bu belgede örnek token olarak `token_Qwe12345` değeri kullanılmıştır.

Bir test çalıştırması oluşturulduğunda, yeni bir [test kaydı][doc-testrecord] da oluşturulur.

Bu test çalıştırması oluşturma yöntemi, hedef uygulamanın test edilmesiyle birlikte temel isteklerin kaydının yapılması gerektiğinde kullanılmalıdır.

## API ile Test Çalıştırması Oluşturma

Bir test çalıştırması oluşturmak için `https://us1.api.wallarm.com/v1/test_run` URL’sine POST isteği gönderin:

--8<-- "../include/fast/operations/api-create-testrun.md"

API sunucusuna yapılan istek başarılı olursa, sunucunun yanıtı döner. Bu yanıtta aşağıdakiler dahil yararlı bilgiler bulunur:

1.  `id`: yeni oluşturulan test çalıştırmasının tanımlayıcısı (ör. `tr_1234`).
    
    `id` parametresinin değerine, FAST’i CI/CD’ye entegre etmek için gerekli olan aşağıdaki işlemleri gerçekleştirmek üzere ihtiyaç duyacaksınız:
    
    1.  FAST node’un kayıt işlemini başlatmasını kontrol etmek.  
    2.  Temel isteklerin kaydını durdurmak.
    3.  FAST güvenlik testlerinin tamamlanmasını beklemek.
    
2.  `state`: test çalıştırmasının durumu.
    
    Yeni oluşturulan test çalıştırması `running` durumundadır.
    `state` parametresinin tüm değerlerinin kapsamlı açıklamasını [burada][doc-state-description] bulabilirsiniz.
    
3.  `test_record_id`: yeni oluşturulan test kaydının tanımlayıcısı (ör. `rec_0001`). Tüm temel istekler bu test kaydı içinde tutulacaktır.    

##  Web Arayüzü ile Test Çalıştırması Oluşturma
      
Wallarm hesabınızın arayüzü üzerinden bir test çalıştırması oluşturmak için aşağıdaki adımları izleyin:

1. Wallarm hesabınızda > **Test runs** bölümüne AB bulutu için [bu bağlantı](https://my.wallarm.com/testing/testruns) veya ABD bulutu için [bu bağlantı](https://us1.my.wallarm.com/testing/testruns) üzerinden gidin.

2. **Create test run** düğmesine tıklayın.

3. Test çalıştırmanızın adını girin.

4. **Test policy** açılır listesinden test politikasını seçin. Yeni bir test politikası oluşturmak için lütfen şu [talimatları][link-create-policy] izleyin. Ayrıca varsayılan politikayı da kullanabilirsiniz.

5. **Node** açılır listesinden FAST node seçin. FAST node oluşturmak için lütfen şu [talimatı][link-create-node] izleyin.

    ![Test çalıştırması oluşturma][img-test-run-creation]

6. Gerekirse **Advanced settings** ekleyin. Bu ayarlar bloğu aşağıdaki noktaları içerir:

--8<-- "../include/fast/test-run-adv-settings.md"

    ![Test çalıştırması gelişmiş ayarlar][img-testrun-adv-settings]

7.  **Create and run** düğmesine tıklayın.

## Test kaydını yeniden kullanma

İstekler bir istek kaynağından hedef uygulamaya gönderildiğinde ve [kayıt işlemi durdurulduğunda][link-stopping-recording-chapter], test kaydını diğer test çalıştırmalarıyla [yeniden kullanmak][doc-copying-testrun] mümkündür.