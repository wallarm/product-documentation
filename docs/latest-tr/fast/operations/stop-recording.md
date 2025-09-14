[img-stop-recording-item]:  ../../images/fast/operations/common/stop-recording/stop-recording-gui.png

[doc-about-tr-token]:       internals.md
[doc-testrun-copying-api]:  copy-testrun.md#copying-a-test-run-via-an-api
[doc-testrun-copying-gui]:  copy-testrun.md#copying-a-test-run-via-web-interface

[link-stop-explained]:      internals.md#test-run-execution-flow-baseline-requests-recording-takes-place


#   Kayıt İşlemini Durdurma

!!! info "Gerekli veriler"
    API üzerinden kaydı durdurmak için aşağıdaki veriler gereklidir:
    
    * bir token
    * bir test çalıştırması tanımlayıcısı

    Web arayüzü üzerinden kaydı durdurmak için bir Wallarm hesabına ihtiyacınız vardır.
    
    Test çalıştırması ve token hakkında ayrıntılı bilgiyi [buradan][doc-about-tr-token] edinebilirsiniz.
    
    Bu belgede aşağıdaki değerler örnek olarak kullanılmıştır:
        
    * token olarak `token_Qwe12345`.
    * bir test çalıştırmasının tanımlayıcısı olarak `tr_1234`.

Temel isteklerin kaydını durdurma gereksinimi [bağlantıda][link-stop-explained] açıklanmıştır. 

## API ile Kayıt İşlemini Durdurma

Kayıt işlemini durdurmak için `https://us1.api.wallarm.com/v1/test_run/test_run_id/action/stop` URL'sine POST isteği gönderin:

--8<-- "../include/fast/operations/api-stop-recording.md"

API sunucusuna yapılan istek başarılı olursa, sunucu bir yanıt döndürür. Yanıt aşağıdakiler de dahil olmak üzere faydalı bilgiler sağlar:
* kayıt işleminin durumu (`recording` parametresinin değeri).
* ilgili test kaydının tanımlayıcısı (`test_record_id` parametresi).

Parametrenin değeri `false` ise durdurma başarılıdır.

Durdurma başarılıysa, `test_record_id` tanımlayıcısına sahip test kaydını kullanarak [test çalıştırmalarını kopyalamak][doc-testrun-copying-api] mümkündür.

## Web Arayüzü ile Kayıt İşlemini Durdurma

Kayıt işlemini web arayüzü üzerinden durdurmak için lütfen aşağıdaki adımları izleyin:

1. AB bulutu için [bu bağlantı](https://my.wallarm.com/testing/testruns) ya da ABD bulutu için [bu bağlantı](https://us1.my.wallarm.com/testing/testruns) üzerinden Wallarm hesabınız > **Test runs** bölümüne gidin.

2. Kaydını durdurmak istediğiniz test çalıştırmasını seçin ve eylem menüsünü açın.

3. **Stop recording** seçeneğini seçin.

    ![Web arayüzü üzerinden kaydı durdurma][img-stop-recording-item]

Kayıt durdurulduğunda, **Baseline req.** sütununun solundaki REQ göstergesi kapanacaktır.

Test kaydının kimliği **Test record name/Test record ID** sütununda görüntülenir.

Gerekirse, web arayüzünü kullanarak [bu test çalıştırmasını kopyalayabilir][doc-testrun-copying-gui] ve yeni test belirtilen test kaydını yeniden kullanacaktır.