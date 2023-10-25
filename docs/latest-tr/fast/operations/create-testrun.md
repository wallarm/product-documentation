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

#   Bir Test Çalışması Oluşturma

!!! bilgi "Gerekli veriler"
    Bir test çalışması oluşturmak için API yöntemlerini kullandığınızı varsayarsanız, bir belirtece ihtiyacınız olacak.
    
    Bir test çalışması oluşturmak için web arayüzünü kullandığınızı varsayarsanız, bir Wallarm hesabına ihtiyacınız olacak.
    
    Token hakkında detaylı bilgiye [buradan][doc-token-information] ulaşabilirsiniz.
    
    Bu belgedeki örnek token değeri `token_Qwe12345` kullanılıyor.

Bir test çalışması oluşturulduğunda, yeni bir [test kaydı][doc-testrecord] oluşturulur.

Bu test çalışması oluşturma yöntemi, bir hedef uygulamanın taban çizgi isteklerinin kaydıyla birlikte test edilmesi gerektiğinde kullanılır.

## API üzerinden Bir Test Çalışması Oluşturma

Bir test çalışması oluşturmak için, POST isteğini `https://us1.api.wallarm.com/v1/test_run` URL'sine gönderin:

--8<-- "../include-tr/fast/operations/api-create-testrun.md"

API sunucusuna isteğiniz başarılı bir şekilde ulaşırsa, sunucunun yanıtına sunulursunuz. Yanıt, yararlı bilgiler sağlar, aralarında:

1.  `id`: yaratılmış yeni test çalışmasının kimliği (örneğin, `tr_1234`).
    
    Bu kimlik parametresi değerine ihtiyacınız olacak FAST'ı CI/CD'ye dahil etmek için gereken ilerleyen aksiyonlarda:
    
    1.  Kayıt sürecini başlatmak için FAST düğümünün hazır olmasını kontrol etme.  
    2.  Taban çizgi isteklerinin kayıt sürecini durdurma.
    3.  FAST güvenlik testlerinin bitmesini beklemek.
    
2.  `state`: test çalışmasının durumu.
    
    Yeni oluşturulmuş bir test çalışması `running` durumundadır.
    `state` parametresinin tüm değerleri hakkında kapsamlı bir açıklama [burada][doc-state-description] bulunabilir.
    
3.  `test_record_id`: Yeni oluşturulmuş test kaydının kimliği (örneğin, `rec_0001`). Tüm taban çizgi istekler bu test kaydına yerleştirilecek.    

##  Web Arayüzü üzerinden Bir Test Çalışması Oluşturma
      
Wallarm hesap arayüzünüzden bir test çalışması oluşturmak için aşağıdaki adımları izleyin:

1. Wallarm hesabınıza gidin > **Test çalışmaları** [bu linkten](https://my.wallarm.com/testing/testruns) AB bulutta veya [bu linkten](https://us1.my.wallarm.com/testing/testruns) ABD bulutta.

2. **Test çalışması oluştur** düğmesine tıklayın.

3. Test çalışmanızın adını girin.

4. **Test politikası** açılır menüsünden test politikanızı seçin. Yeni bir test politikası oluşturmak için, lütfen [bu talimatları][link-create-policy] izleyin. Ayrıca, varsayılan politikayı da kullanabilirsiniz.

5. **Düğüm** açılır menüsünden FAST düğümünü seçin. FAST düğümü oluşturmak için, lütfen [bu talimatları][link-create-node] izleyin.

    ![Test çalışması oluşturma][img-test-run-creation]

6. Eğer gerekliyse, **Gelişmiş ayarları** ekleyin. Bu ayarlar bloğu aşağıdaki noktaları içerir:

--8<-- "../include-tr/fast/test-run-adv-settings.md"

    ![Gelişmiş test çalışması ayarları][img-testrun-adv-settings]

7. **Oluştur ve çalıştır** düğmesine tıklayın.

## Test kaydını yeniden kullanma

İsteklerin bir istek kaynağından hedefe gönderildiği ve [kayıt sürecinin durdurulduğu][link-stopping-recording-chapter] zaman, test kaydının diğer test çalısmalarıyla [yeniden kullanılması mümkündür][doc-copying-testrun].