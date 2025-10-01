[img-sample-job-ci-mode]:       ../../images/fast/poc/en/integration-overview/sample-job-ci-mode.png

[doc-recording-mode]:           ci-mode-recording.md#running-a-fast-node-in-recording-mode
[doc-testing-mode]:             ci-mode-testing.md#running-a-fast-node-in-testing-mode
[doc-proxy-configuration]:      proxy-configuration.md
[doc-fast-container-stopping]:  ci-mode-recording.md#stopping-and-removing-the-docker-container-with-the-fast-node-in-recording-mode
[doc-recording-variables]:      ci-mode-recording.md#environment-variables-in-recording-mode
[doc-integration-overview]:     integration-overview.md


#   FAST Node ile Entegrasyon: İlkeler ve Adımlar

CI modunda bir güvenlik testi yürütmek için, bir FAST node sırasıyla iki modda çalıştırılmalıdır:
1.  [Kayıt modu][doc-recording-mode]
2.  [Test modu][doc-testing-mode]

`CI_MODE` ortam değişkeni, bir FAST node'un çalışma modunu tanımlar. Bu değişken aşağıdaki değerleri alabilir:
* `recording`
* `testing`

Bu senaryoda, FAST node öncelikle bir test kaydı oluşturur ve ona temel istekleri yazar. Kayıt tamamlandığında, düğüm, güvenlik testini temel istekleri esas alarak yürütecek bir test çalışması oluşturur.  

Bu senaryo aşağıdaki resimde gösterilmektedir:

![CI Modunda FAST node içeren bir CI/CD işi örneği][img-sample-job-ci-mode]

İlgili iş akışı adımları:

1.  Hedef uygulamanın oluşturulması ve dağıtılması.   

2.  [FAST node'un kayıt modunda çalıştırılması][doc-recording-mode].

    Kayıt modunda FAST node aşağıdaki işlemleri gerçekleştirir:
    
    * Temel istekleri, isteklerin kaynağından hedef uygulamaya proxy'ler.
    * Bu temel istekleri, daha sonra bunlara dayalı güvenlik test seti oluşturmak için test kaydına kaydeder.
    
    !!! info "Test Çalışmaları Hakkında Not"
        Test çalışması, kayıt modunda oluşturulmaz.

3.  Bir test aracının hazırlanması ve ayarlanması:
    
    1.  Test aracının dağıtılması ve temel yapılandırmasının yapılması.
    
    2.  [FAST node'un bir proxy sunucusu olarak yapılandırılması][doc-proxy-configuration].
        
4.  Mevcut testlerin çalıştırılması.
    
    FAST node, hedef uygulamaya giden temel istekleri proxy'ler ve kaydeder.
    
5.  FAST node konteynerinin durdurulması ve kaldırılması.

    FAST node çalışma sırasında kritik hatalarla karşılaşmazsa, ya [`INACTIVITY_TIMEOUT`][doc-recording-variables] zamanlayıcısının süresi dolana kadar ya da CI/CD aracı konteyneri açıkça durdurana kadar çalışır.
    
    Mevcut testler tamamlandıktan sonra, FAST node'un [durdurulması gerekir][doc-fast-container-stopping]. Bu, temel isteklerin kaydedilmesi sürecini durduracaktır. Ardından node konteyneri kaldırılabilir.          

6.  [FAST node'un test modunda çalıştırılması][doc-testing-mode].

    Test modunda FAST node aşağıdaki işlemleri gerçekleştirir:
    
    * 4. adımda kaydedilen temel isteklere dayalı bir test çalışması oluşturur.
    * Bir güvenlik test seti oluşturup yürütmeye başlar.
    
7.  Test sonuçlarının alınması. FAST node konteynerinin durdurulması.    
    
    FAST node çalışma sırasında kritik hatalarla karşılaşmazsa, güvenlik testleri tamamlanana kadar çalışır. Düğüm otomatik olarak kapanır. Ardından node konteyneri kaldırılabilir.

##  Bir FAST Node Konteynerinin Yaşam Döngüsü (CI Modu ile Dağıtım)
   
Bu senaryo, FAST node içeren Docker konteynerinin önce kayıt modunda, ardından test modunda çalıştırıldığını varsayar. 
 
FAST node, herhangi bir modda çalışmasını tamamladıktan sonra node konteyneri kaldırılır. Başka bir deyişle, çalışma modu her değiştiğinde bir FAST node konteyneri yeniden oluşturulur.