[img-sample-job-ci-mode]:       ../../images/fast/poc/en/integration-overview/sample-job-ci-mode.png

[doc-recording-mode]:           ci-mode-recording.md#running-a-fast-node-in-recording-mode
[doc-testing-mode]:             ci-mode-testing.md#running-a-fast-node-in-testing-mode
[doc-proxy-configuration]:      proxy-configuration.md
[doc-fast-container-stopping]:  ci-mode-recording.md#stopping-and-removing-the-docker-container-with-the-fast-node-in-recording-mode
[doc-recording-variables]:      ci-mode-recording.md#environment-variables-in-recording-mode
[doc-integration-overview]:     integration-overview.md


#   FAST Node ile Entegrasyon: İlkeler ve Adımlar

CI modunda güvenlik testi yürütmek için, bir FAST node iki modda sırasıyla çalıştırılmalıdır:
1.  [Recording mode][doc-recording-mode]
2.  [Testing mode][doc-testing-mode]

`CI_MODE` ortam değişkeni, FAST node'un çalışma modunu tanımlar. Bu değişken aşağıdaki değerleri alabilir:
* `recording`
* `testing`

Bu senaryoda, FAST node önce bir test kaydı oluşturur ve temel istekleri buna yazar. Kayıt tamamlandıktan sonra, node, kaydedilen temel isteklere dayalı olarak güvenlik testleri için bir test çalışması oluşturur.

Aşağıdaki resimde bu senaryo gösterilmiştir:

![An example of a CI/CD job with FAST node in the CI Mode][img-sample-job-ci-mode]

İlgili iş akışı adımları şu şekildedir:

1.  Hedef uygulamanın oluşturulması ve dağıtılması.   

2.  [FAST node'u recording modunda çalıştırma][doc-recording-mode].

    Recording modunda FAST node aşağıdaki işlemleri gerçekleştirir:
    
    * Temel istekleri, istek kaynağından hedef uygulamaya proxy'ler.
    * Bu temel istekleri, daha sonra bunlara dayalı olarak güvenlik testi seti oluşturmak üzere test kaydına yazar.
    
    !!! info "Test Çalışmaları Hakkında Not"
        Recording modunda test çalışması oluşturulmaz.

3.  Bir test aracının hazırlanması ve kurulması:
    
    1.  Test aracının dağıtılması ve temel yapılandırmasının gerçekleştirilmesi.
    
    2.  [FAST node'u bir proxy sunucusu olarak yapılandırma][doc-proxy-configuration].
        
4.  Mevcut testlerin çalıştırılması.
    
    FAST node, hedef uygulamaya temel istekleri proxy'ler ve kaydeder.
    
5.  FAST node konteynerinin durdurulması ve kaldırılması.

    FAST node, çalışması sırasında kritik bir hatayla karşılaşmazsa, [`INACTIVITY_TIMEOUT`][doc-recording-variables] zamanlayıcısı dolana kadar veya CI/CD aracı konteyneri açıkça durdurana kadar çalışır.
    
    Mevcut testler tamamlandıktan sonra, FAST node [durdurulmalıdır][doc-fast-container-stopping]. Bu, temel isteklerin kaydedilme sürecini sonlandırır. Ardından node konteyneri kaldırılabilir.

6.  [FAST node'u testing modunda çalıştırma][doc-testing-mode].

    Testing modunda FAST node aşağıdaki işlemleri gerçekleştirir:
    
    * Adım 4'te kaydedilen temel isteklere dayanarak bir test çalışması oluşturur.
    * Bir güvenlik testi seti oluşturup yürütmeye başlar.
    
7.  Test sonuçlarının alınması ve FAST node konteynerinin durdurulması.    
    
    FAST node, çalışması sırasında kritik bir hatayla karşılaşmazsa, güvenlik testleri tamamlanana kadar çalışır. Node otomatik olarak kapanır. Ardından node konteyneri kaldırılabilir.

##  FAST Node Konteynerinin Yaşam Döngüsü (CI Modu ile Dağıtım)
   
Bu senaryo, FAST node içeren Docker konteynerinin önce recording modunda, sonra testing modunda çalıştırılacağını varsayar.
 
FAST node herhangi bir modda çalışmasını tamamladıktan sonra, node konteyneri kaldırılır. Başka bir deyişle, işletim modu değiştiğinde FAST node konteyneri her seferinde yeniden oluşturulur.