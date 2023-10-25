[img-stop-recording-item]:  ../../images/fast/operations/common/stop-recording/stop-recording-gui.png

[doc-about-tr-token]:       internals.md
[doc-testrun-copying-api]:  copy-testrun.md#copying-a-test-run-via-an-api
[doc-testrun-copying-gui]:  copy-testrun.md#copying-a-test-run-via-web-interface

[link-stop-explained]:      internals.md#test-run-execution-flow-baseline-requests-recording-takes-place


#   Kayıt Sürecini Durdurma

!!! bilgi "Gerekli veriler"
    API üzerinden kayıt durdurulurken aşağıdaki verilere ihtiyaç duyulmaktadır:

    * bir token
    * bir test çalışması tanımlayıcısı

    Web arayüzü üzerinden kayıtı durdurmak için bir Wallarrm hesabınıza ihtiyacınız vardır.

    Test çalışması ve token hakkında ayrıntılı bilgiyi [burada][doc-about-tr-token] alabilirsiniz.
    
    Bu belgede örnek olarak kullanılan değerler:
        
    * `token_Qwe12345` bir token olarak.
    * `tr_1234` bir test çalışmasının tanımlayıcısı olarak.

Temel isteklerin kaydını durdurma ihtiyacı [link][link-stop-explained] tarafından açıklanmıştır. 

## API Üzerinden Kayıt Sürecini Durdurma

Kayıt sürecini durdurmak için, `https://us1.api.wallarm.com/v1/test_run/test_run_id/action/stop` URL'sine POST isteği gönderin:

--8<-- "../include/fast/operations/api-stop-recording.md"

API sunucusuna istek başarılı olduğunda, size sunucunun yanıtı sunulur. Yanıt, yararlı bilgiler sağlar, dahil:
* kayıt sürecinin durumu (`recording` parametresinin değeri).
* ilgili test kaydının tanımlayıcısı (`test_record_id` parametresi).

Parametrenin değeri `false` ise, durdurma başarılıdır.

Durdurma başarılı olursa, `test_record_id` tanımlayıcısına sahip test kaydını [test çalışmalarını kopyalamak][doc-testrun-copying-api] için kullanabilirsiniz.

## Web Arayüzü Üzerinden Kayıt Sürecini Durdurma

Web arayüzü üzerinden kayıt sürecini durdurmak için aşağıdaki adımları takip edin:

1. [Bu link](https://my.wallarm.com/testing/testruns) üzerinden EU bulutu için veya [bu link](https://us1.my.wallarm.com/testing/testruns) üzerinden US bulutu için Wallarm hesabınıza gidin > **Test çalışmaları**.

2. Kayıtını durdurmak istediğiniz test çalışmasını seçin ve aksiyon menüsünü açın.

3. **Kaydı durdur** seçeneğini seçin.

    ![Web arayüzü üzerinden kaydı durdurma][img-stop-recording-item]

Kayıt durdurulduğunda, **Temel isteklerin req.** sütununun solundaki REQ göstergesi kapalı olacaktır.

Test kaydının ID'si **Test kayıt adı/Test kayıt ID** sütununda görüntülenir.

Gerektiğinde, web arayüzünü kullanarak [bu test çalışmasını kopyalayabilir][doc-testrun-copying-gui] ve yeni test, belirtilen test kaydını tekrar kullanabilir.