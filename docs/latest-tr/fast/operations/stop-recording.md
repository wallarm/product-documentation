[img-stop-recording-item]:  ../../images/fast/operations/common/stop-recording/stop-recording-gui.png

[doc-about-tr-token]:       internals.md
[doc-testrun-copying-api]:  copy-testrun.md#copying-a-test-run-via-an-api
[doc-testrun-copying-gui]:  copy-testrun.md#copying-a-test-run-via-web-interface

[link-stop-explained]:      internals.md#test-run-execution-flow-baseline-requests-recording-takes-place


#   Kaydetme İşlemini Durdurmak

!!! info "Gerekli veriler"
    API aracılığıyla kaydetmeyi durdurmak için aşağıdaki veriler gereklidir:
    
    * bir token
    * bir test run tanımlayıcısı

    Web arayüzü üzerinden kaydetmeyi durdurmak için bir Wallarm hesabına sahip olmanız gerekir.
    
    Test run ve token hakkında detaylı bilgiyi [buradan][doc-about-tr-token] edinebilirsiniz.
    
    Bu belgede örnek değerler olarak aşağıdakiler kullanılmaktadır:
        
    * `token_Qwe12345` token olarak.
    * `tr_1234` test run tanımlayıcısı olarak.

Temel istek kaydının durdurulma gereksinimi [bu bağlantıda][link-stop-explained] açıklanmaktadır.

## API Aracılığıyla Kaydetme İşlemini Durdurmak

Kaydetme işlemini durdurmak için, `https://us1.api.wallarm.com/v1/test_run/test_run_id/action/stop` URL'sine bir POST isteği gönderin:

--8<-- "../include/fast/operations/api-stop-recording.md"

API sunucusuna yapılan istek başarılı olursa, sunucunun yanıtı görüntülenecektir. Yanıt, şunlar dahil olmak üzere yararlı bilgiler sağlar:
* kaydetme işleminin durumu ( `recording` parametresinin değeri ).
* ilgili test kaydının tanımlayıcısı ( `test_record_id` parametresi ).

Eğer parametrenin değeri `false` ise, durdurma işlemi başarılı olmuştur.

Durdurma işlemi başarılıysa, `test_record_id` tanımlayıcısına sahip test kaydını [test run kopyalamak][doc-testrun-copying-api] için kullanabilirsiniz.

## Web Arayüzü İle Kaydetme İşlemini Durdurmak

Web arayüzü üzerinden kaydetme işlemini durdurmak için aşağıdaki adımları izleyin:

1. Wallarm hesabınıza gidin > **Test runs**. AB (EU) bulutu için [bu bağlantıya](https://my.wallarm.com/testing/testruns) veya ABD (US) bulutu için [bu bağlantıya](https://us1.my.wallarm.com/testing/testruns) tıklayın.

2. Kaydı durdurmak istediğiniz test run'ı seçin ve aksiyon menüsünü açın.

3. **Stop recording** seçeneğini belirleyin.

    ![Web arayüzü ile kaydetmeyi durdurma][img-stop-recording-item]

**Baseline req.** sütununun solundaki REQ göstergesi, kaydetme durdurulduğunda kapatılacaktır.

Test kaydının tanımlayıcısı **Test record name/Test record ID** sütununda görüntülenir.

Gerekirse, web arayüzünü kullanarak bu test run'ı [kopyalayabilir][doc-testrun-copying-gui] ve yeni test, belirtilen test kaydını yeniden kullanır.