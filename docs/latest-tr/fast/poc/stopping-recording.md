[doc-get-token]:                    prerequisites.md#anchor-token
[doc-get-testrun-id]:               node-deployment.md#obtaining-a-test-run

[doc-about-recording]:              ../operations/internals.md#test-run
[doc-stop-recording]:               ../operations/stop-recording.md#stopping-the-recording-process-via-api
[doc-waiting-for-tests]:            waiting-for-tests.md

[doc-integration-overview]:         integration-overview.md

#   Kayıt İşlemini Durdurma

!!! info "Bölüm Önkoşulları"
    Bu bölümde açıklanan adımları izlemek için aşağıdakileri edinmeniz gerekir:
        
    * [Belirteç][doc-get-token]
    * Bir test çalıştırmasının [Tanımlayıcısı][doc-get-testrun-id]
    
    Aşağıdaki değerler bölüm genelinde örnek değerler olarak kullanılmıştır:

    * `token_Qwe12345` bir belirteç olarak
    * `tr_1234` bir test çalıştırmasının tanımlayıcısı olarak

Temel isteklerin kayıt sürecini API aracılığıyla [burada][doc-stop-recording] açıklanan adımları izleyerek durdurun.

Kayıt süreci durdurulduktan sonra hedef uygulamanın güvenlik açıklarına karşı test edilmesi uzun sürebilir. FAST güvenlik testlerinin tamamlanıp tamamlanmadığını belirlemek için [bu belgedeki][doc-waiting-for-tests] bilgileri kullanın.

Gerekirse [“FAST ile CI/CD İş Akışı”][doc-integration-overview] belgesine tekrar başvurabilirsiniz.