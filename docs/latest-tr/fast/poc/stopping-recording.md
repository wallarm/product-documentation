[doc-get-token]: prerequisites.md#anchor-token
[doc-get-testrun-id]: node-deployment.md#obtaining-a-test-run

[doc-about-recording]: ../operations/internals.md#test-run
[doc-stop-recording]: ../operations/stop-recording.md#stopping-the-recording-process-via-api
[doc-waiting-for-tests]: waiting-for-tests.md

[doc-integration-overview]: integration-overview.md

# Kaydı Durdurma Süreci

!!! info "Bölüm Önkoşulları"
    Bu bölümde anlatılan adımları takip edebilmek için aşağıdakileri edinmeniz gerekir:
        
    * [Token][doc-get-token]
    * [Identifier][doc-get-testrun-id] (bir test çalıştırmasının kimliği)
    
    Bölüm boyunca örnek değer olarak aşağıdaki değerler kullanılmaktadır:

    * `token_Qwe12345` token olarak
    * `tr_1234` bir test çalıştırmasının kimliği olarak

API üzerinden temel istek kaydı sürecini, [bu dokümanda][doc-stop-recording] tarif edilen adımları izleyerek durdurun.

Kayıt işlemi durdurulduktan sonra, hedef uygulamanın güvenlik açıklarına karşı test süreci uzun sürebilir. FAST güvenlik testlerinin tamamlanıp tamamlanmadığını belirlemek için [bu dokümandaki][doc-waiting-for-tests] bilgileri kullanın.

Gerekirse, [“CI/CD Workflow with FAST”][doc-integration-overview] dokümanına başvurabilirsiniz.