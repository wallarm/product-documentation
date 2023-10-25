[doc-get-token]:                    prerequisites.md#anchor-token
[doc-get-testrun-id]:               node-deployment.md#obtaining-a-test-run

[doc-about-recording]:              ../operations/internals.md#test-run
[doc-stop-recording]:               ../operations/stop-recording.md#stopping-the-recording-process-via-api
[doc-waiting-for-tests]:            waiting-for-tests.md

[doc-integration-overview]:         integration-overview.md

#   Kayıt İşlemini Durdurma

!!! bilgi "Bölüm Önkoşulları"
    Bu bölümde açıklanan adımları takip etmek için ihtiyacınız olacak:
        
    * [Belirteç][doc-get-token]
    * Bir test çalıştırmasının [Tanımlayıcısı][doc-get-testrun-id]
    
    Aşağıdaki değerler bölüm boyunca örnek değerler olarak kullanılmıştır:

    * `token_Qwe12345` bir belirteç olarak
    * `tr_1234` bir test çalıştırmasının tanımlayıcısı olarak

Temel istek kayıt sürecini, [burada][doc-stop-recording] açıklanan adımları takip ederek API aracılığıyla durdurun.

Kayıt işlemi durdurulduktan sonra, hedef uygulamanın test süreci uzun sürebilir. FAST güvenlik testlerinin tamamlanıp tamamlanmadığını belirlemek için [bu belgedeki][doc-waiting-for-tests] bilgileri kullanın.

Gerekirse, [“CI/CD Flow with FAST”][doc-integration-overview] belgesine geri dönebilirsiniz.