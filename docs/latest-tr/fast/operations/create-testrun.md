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

# Test Çalıştırması Oluşturma

!!! info "Gerekli veriler"
    API yöntemleriyle bir test çalıştırması oluşturmak için bir token'a ihtiyacınız vardır.
    
    Web arayüzü üzerinden bir test çalıştırması oluşturmak için bir Wallarm hesabına sahip olmanız gerekmektedir.
    
    Token hakkında ayrıntılı bilgiyi [buradan][doc-token-information] edinebilirsiniz.
    
    Bu belgede örnek token değeri olarak `token_Qwe12345` kullanılmıştır.

Bir test çalıştırması oluşturulduğunda, yeni bir [test kaydı][doc-testrecord] da oluşturulur.

Temel isteklerin kaydının alınmasıyla birlikte hedef uygulamanın test edilmesi gerektiğinde, bu test çalıştırması oluşturma yöntemi kullanılmalıdır.

## API ile Test Çalıştırması Oluşturma

Bir test çalıştırması oluşturmak için, `https://us1.api.wallarm.com/v1/test_run` URL'sine POST isteği gönderin:

--8<-- "../include/fast/operations/api-create-testrun.md"

API sunucusuna yapılan istek başarılı olursa, sunucunun yanıtı görüntülenir. Yanıt, aşağıdakiler de dahil olmak üzere yararlı bilgiler sağlar:

1.  `id`: Yeni oluşturulan test çalıştırmasının tanımlayıcısı (örneğin, `tr_1234`).
    
    CI/CD'ye FAST entegrasyonu için aşağıdaki işlemleri gerçekleştirmek adına id parametresine ihtiyacınız olacaktır:
    
    1.  Kayıt işlemini başlatmak için FAST node'un varlığını kontrol etmek.  
    2.  Temel isteklerin kaydını durdurmak.
    3.  FAST güvenlik testlerinin tamamlanmasını beklemek.
    
2.  `state`: Test çalıştırmasının durumu.
    
    Yeni oluşturulan bir test çalıştırması `running` durumundadır.
    `state` parametresinin tüm değerlerine ilişkin kapsamlı açıklamayı [buradan][doc-state-description] bulabilirsiniz.
    
3.  `test_record_id`: Yeni oluşturulan test kaydının tanımlayıcısı (örneğin, `rec_0001`). Tüm temel istekler bu test kaydına yerleştirilecektir.    

## Web Arayüzü ile Test Çalıştırması Oluşturma
      
Wallarm hesabınız üzerinden bir test çalıştırması oluşturmak için aşağıdaki adımları izleyin:

1. Wallarm hesabınıza gidin > **Test runs**. AB bulutu için [bu bağlantıyı](https://my.wallarm.com/testing/testruns) veya ABD bulutu için [bu bağlantıyı](https://us1.my.wallarm.com/testing/testruns) kullanın.

2. **Create test run** butonuna tıklayın.

3. Test çalıştırmanızın adını girin.

4. **Test policy** açılır listesinden test politikasını seçin. Yeni bir test politikası oluşturmak için lütfen [bu talimatları][link-create-policy] izleyin. Ayrıca varsayılan politikayı da kullanabilirsiniz.

5. **Node** açılır listesinden FAST node'u seçin. FAST node oluşturmak için lütfen [bu talimatı][link-create-node] izleyin.

    ![Creating test run][img-test-run-creation]

6. Gerekirse **Advanced settings** ekleyin. Bu ayarlar bloğu aşağıdaki maddeleri içerir:

--8<-- "../include/fast/test-run-adv-settings.md"

    ![Test run advanced settings][img-testrun-adv-settings]

7. **Create and run** butonuna tıklayın.

## Test Kayıtlarının Yeniden Kullanılması

İstekler, bir istek kaynağından hedef uygulamaya gönderildiğinde ve [kayıt süreci durdurulduğunda][link-stopping-recording-chapter], test kaydını diğer test çalıştırmalarıyla [yeniden kullanmak][doc-copying-testrun] mümkün hale gelir.