[img-sample-job-recording]:     ../../images/fast/poc/en/integration-overview/sample-job.png
[img-sample-job-no-recording]:  ../../images/fast/poc/en/integration-overview/sample-job-no-recording.png

[doc-testrun]:                  ../operations/internals.md#test-run
[doc-container-deployment]:     node-deployment.md#deployment-of-the-docker-container-with-the-fast-node
[doc-testrun-creation]:         node-deployment.md#creating-a-test-run 
[doc-testrun-copying]:          node-deployment.md#copying-a-test-run     
[doc-proxy-configuration]:      proxy-configuration.md
[doc-stopping-recording]:       stopping-recording.md
[doc-testrecord]:               ../operations/internals.md#test-record
[doc-waiting-for-tests]:        waiting-for-tests.md

[anchor-recording]:             #deployment-via-the-api-when-baseline-requests-recording-takes-place 
[anchor-no-recording]:          #deployment-via-the-api-when-prerecorded-baseline-requests-are-used

[doc-integration-overview]:     integration-overview.md

#   Wallarm API Üzerinden Entegrasyon

Dağıtımın birkaç yöntemi vardır:
1.  [Temel isteklerin kaydı alınırken API üzerinden dağıtım.][anchor-recording]
2.  [Önceden kaydedilmiş temel istekler kullanılırken API üzerinden dağıtım.][anchor-no-recording]


##  Temel İsteklerin Kaydı Alınırken API Üzerinden Dağıtım

Bu senaryoda bir [test çalışması][doc-testrun] oluşturulur. Temel istekler, test çalışmasına karşılık gelen bir test kaydına kaydedilecektir.

İlgili iş akışı adımları:

1.  Hedef uygulamanın derlenmesi ve dağıtılması.

2.  FAST node'unun dağıtılması ve kurulması:
    
    1.  [FAST node ile Docker konteynerinin dağıtılması][doc-container-deployment].
    
    2.  [Bir test çalışması oluşturulması][doc-testrun-creation].
    
        Bu işlemleri gerçekleştirdikten sonra, FAST node'unun temel isteklerin kayda alınması sürecine başlamak için hazır olduğundan emin olun.
    
3.  Bir test aracının hazırlanması ve kurulması:
    
    1.  Test aracının dağıtılması ve temel yapılandırmasının yapılması.
    
    2.  [FAST node'unun proxy sunucu olarak yapılandırılması][doc-proxy-configuration].
    
4.  Mevcut testlerin çalıştırılması.
    
    FAST node, ilk temel isteği aldığında güvenlik test setini oluşturup çalıştırmaya başlayacaktır.
    
5.  Temel isteklerin kaydının alınması sürecinin durdurulması.
    
    Kaydetme işlemi, tüm mevcut testler çalıştırıldıktan sonra [durdurulmalıdır][doc-stopping-recording].
    
    Artık, kaydedilen temel istekleri içeren [test kaydı][doc-testrecord], önceden kaydedilmiş temel isteklerle çalışan CI/CD iş akışında yeniden kullanılmaya hazırdır.  
    
6.  FAST güvenlik testlerinin bitmesini beklemek.
    
    Test çalışmasının durumunu periyodik olarak bir API isteği yaparak kontrol edin. Bu, [güvenlik testlerinin tamamlanıp tamamlanmadığını belirlemeye][doc-waiting-for-tests] yardımcı olur.
    
7.  Test sonuçlarının alınması.

Aşağıdaki resimde bu senaryo gösterilmiştir:

![Temel isteklerin kaydının alındığı CI/CD işine bir örnek][img-sample-job-recording]


##  Önceden Kaydedilmiş Temel İstekler Kullanılırken API Üzerinden Dağıtım

Bu senaryoda bir test çalışması kopyalanır. Kopyalama sırasında mevcut bir test kaydı tanımlayıcısı test çalışmasına aktarılır. Test kaydı, temel isteklerin kaydının alındığı CI/CD iş akışında edinilir.

İlgili iş akışı adımları:

1.  Hedef uygulamanın derlenmesi ve dağıtılması.

2.  FAST node'unun dağıtılması ve kurulması:
    
    1.  [FAST node içeren Docker konteynerinin dağıtılması][doc-container-deployment].
    
    2.  [Bir test çalışmasının kopyalanması][doc-testrun-copying].    

3.  FAST node kullanılarak verilen test kaydından temel isteklerin çıkarılması. 

4.  FAST node ile hedef uygulamanın güvenlik testlerinin yapılması.

5.  FAST güvenlik testlerinin bitmesini beklemek.
    
    Test çalışmasının durumunu periyodik olarak bir API isteği yaparak kontrol edin. Bu, [güvenlik testlerinin tamamlanıp tamamlanmadığını belirlemeye][doc-waiting-for-tests] yardımcı olur.
    
6.  Test sonuçlarının alınması.

![Önceden kaydedilmiş isteklerin kullanıldığı CI/CD işine bir örnek][img-sample-job-no-recording]   


##  Bir FAST Node Konteynerinin Yaşam Döngüsü (API Üzerinden Dağıtım)

Bu senaryo, FAST node içeren Docker konteynerinin belirli bir CI/CD işi için yalnızca bir kez çalıştığını ve iş sona erdiğinde kaldırıldığını varsayar.
 
FAST node, çalışma sırasında kritik hatalarla karşılaşmazsa, yeni test çalışmaları ve temel istekler için sonsuz döngüde çalışarak hedef uygulamayı tekrar test etmek üzere bekler.
  
Docker konteyneri, CI/CD işi tamamlandığında CI/CD aracı tarafından açıkça durdurulmalıdır. 

<!-- -->
Gerekirse [“CI/CD Workflow with FAST”][doc-integration-overview] belgesine başvurabilirsiniz.