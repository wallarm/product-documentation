[doc-get-token]:                    prerequisites.md#anchor-token
[doc-get-testrun-id]:               node-deployment.md#obtaining-a-test-run
[doc-get-testrun-status]:       ../operations/check-testrun-status.md

[doc-get-testrun-status]:   ../operations/check-testrun-status.md

[doc-integration-overview]:         integration-overview.md

#   Testin Tamamlanmasını Bekleme

!!! info "Bölüm Önkoşulları"
    Bu bölümde açıklanan adımları izlemek için şunları temin etmeniz gerekir:
    
    * bir [token][doc-get-token].
    * bir test çalıştırmasının [tanımlayıcısı][doc-get-testrun-id].
    
    Bölüm boyunca örnek olarak aşağıdaki değerler kullanılır:
        
    * `token_Qwe12345` bir token olarak.
    * `tr_1234` bir test çalıştırmasının tanımlayıcısı olarak.

Test isteklerini oluşturma ve yürütme süreçleri, ilk temel (baseline) istek kaydedildiğinde başlar ve temel isteklerin kaydı durdurulduktan sonra da hatırı sayılır bir süre alabilir. Devam eden süreçlerle ilgili fikir edinmek için test çalıştırmasının durumunu periyodik olarak kontrol edebilirsiniz.

[API çağrısını][doc-get-testrun-status] gerçekleştirdikten sonra, test çalıştırmasının durumuna ilişkin bilgiler içeren API sunucusundan bir yanıt alacaksınız.

Uygulamada güvenlik açıklarının bulunup bulunmadığına, `state` ve `vulns` parametrelerinin değerlerine dayanarak karar verilebilir.

??? info "Örnek"
    API çağrısını periyodik olarak yaparak test çalıştırmasının durumunu sorgulayan bir süreç, API sunucusunun yanıtında `state:passed` parametresi bulunursa çıkış kodu `0` ile ve `state:failed` parametresi bulunursa çıkış kodu `1` ile sonlanabilir.

    Çıkış kodu değeri, genel CI/CD işinin durumunu hesaplamak için CI/CD aracı tarafından kullanılabilir. 

    Bir FAST düğümü [CI modu](integration-overview-ci-mode.md) üzerinden dağıtıldıysa, FAST düğümünün çıkış kodu genel CI/CD işinin durumunu yorumlamak için yeterli olabilir. 

    FAST etkinleştirilmiş CI/CD işinin CI/CD aracıyla nasıl etkileşime girmesi gerektiğine dair daha karmaşık bir mantık da kurulabilir. Bunu yapmak için, API sunucusunun yanıtında bulunabilecek diğer veri parçalarını kullanın.

 Gerekirse [“FAST ile CI/CD İş Akışı”][doc-integration-overview] belgesine tekrar başvurabilirsiniz.