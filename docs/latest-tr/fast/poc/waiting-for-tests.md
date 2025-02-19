[doc-get-token]:                    prerequisites.md#anchor-token
[doc-get-testrun-id]:               node-deployment.md#obtaining-a-test-run
[doc-get-testrun-status]:       ../operations/check-testrun-status.md

[doc-get-testrun-status]:   ../operations/check-testrun-status.md

[doc-integration-overview]:         integration-overview.md

# Testlerin Bitmesini Beklemek

!!! info "Bölüm Önkoşulları"
    Bu bölümde açıklanan adımları takip etmek için aşağıdakileri edinmeniz gerekir:
    
    * bir [token][doc-get-token].
    * bir test çalıştırma tanımlayıcısı [doc-get-testrun-id].
    
    Bölüm boyunca örnek değerler olarak aşağıdaki değerler kullanılmıştır:
        
    * `token_Qwe12345` bir token olarak.
    * `tr_1234` bir test çalıştırma tanımlayıcısı olarak.

Test isteklerinin oluşturulması ve yürütülmesi, ilk temel (baseline) isteğin kaydedilmesiyle başlayan işlemlerdir ve temel istek kaydedilmesi süreci durdurulduktan sonra önemli ölçüde zaman alabilir. Gerçekleşmekte olan işlemler hakkında bilgi edinmek için test çalıştırmasının durumunu periyodik olarak kontrol edebilirsiniz.

[API çağrısını][doc-get-testrun-status] gerçekleştirdikten sonra, test çalıştırmasının durumu hakkında bilgileri içeren bir API sunucusundan yanıt alacaksınız.

Uygulamadaki güvenlik açıklarının varlığı veya yokluğu, `state` ve `vulns` parametrelerinin değerlerine göre değerlendirilebilir.

??? info "Örnek"
    API çağrısını periyodik olarak yaparak test çalıştırmasının durumunu sorgulayan bir işlem, API sunucusunun yanıtında `state:passed` parametresi bulunursa çıkış kodu `0` ile, `state:failed` parametresi bulunursa çıkış kodu `1` ile sonlanabilir.

    CI/CD aracının, genel CI/CD işinin durumunu hesaplamak için çıkış kodu değerini kullanması mümkündür. 

    Eğer bir FAST node [CI mod](integration-overview-ci-mode.md) aracılığıyla dağıtıldıysa, FAST node'un çıkış kodu genel CI/CD işinin durumunu yorumlamak için yeterli olabilir. 

    FAST destekli CI/CD işinin CI/CD aracıyla nasıl etkileşim kurması gerektiğine dair daha karmaşık bir mantık oluşturmak mümkündür. Bunun için API sunucusunun yanıtında bulunan diğer veri parçalarını kullanabilirsiniz.

Gerekirse [“CI/CD Workflow with FAST”][doc-integration-overview] belgesine başvurabilirsiniz.