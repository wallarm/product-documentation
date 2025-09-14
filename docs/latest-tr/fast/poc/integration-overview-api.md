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

#   Wallarm API aracılığıyla entegrasyon

Birden fazla dağıtım yöntemi vardır:
1.  [Temel isteklerin kaydı gerçekleşirken API üzerinden dağıtım.][anchor-recording]
2.  [Önceden kaydedilmiş temel istekler kullanılırken API üzerinden dağıtım.][anchor-no-recording]


##  Temel İsteklerin Kaydı Gerçekleşirken API Üzerinden Dağıtım

Bu senaryoda bir [test çalıştırması][doc-testrun] oluşturulur. Temel istekler, test çalıştırmasına karşılık gelen bir test kaydına kaydedilecektir.

İlgili iş akışı adımları şunlardır:

1.  Hedef uygulamanın derlenmesi ve dağıtılması.

2.  FAST node'unun dağıtılması ve yapılandırılması:
    
    1.  [FAST node'u ile Docker konteynerinin dağıtılması][doc-container-deployment].
    
    2.  [Bir test çalıştırmasının oluşturulması][doc-testrun-creation].
    
        Bu işlemleri gerçekleştirdikten sonra, FAST node'unun temel istekleri kaydetme sürecini başlatmaya hazır olduğundan emin olun.
    
3.  Bir test aracının hazırlanması ve yapılandırılması:
    
    1.  Test aracının dağıtılması ve temel yapılandırmasının yapılması.
    
    2.  [FAST node'unun bir proxy sunucusu olarak yapılandırılması][doc-proxy-configuration].
    
4.  Mevcut testlerin çalıştırılması.
    
    FAST node'u, ilk temel isteği aldığında güvenlik test kümesini oluşturmaya ve çalıştırmaya başlayacaktır.
    
5.  Temel istekleri kaydetme sürecinin durdurulması.
    
    Tüm mevcut testler yürütüldükten sonra kayıt süreci [durdurulmalıdır][doc-stopping-recording].
    
    Artık kaydedilen temel istekleri içeren [test kaydı][doc-testrecord], önceden kaydedilmiş temel isteklerle çalışan CI/CD iş akışında yeniden kullanılmaya hazırdır.  
    
6.  FAST güvenlik testlerinin tamamlanmasının beklenmesi.
    
    API isteği yaparak test çalıştırmasının durumunu periyodik olarak kontrol edin. Bu, [güvenlik testlerinin tamamlanıp tamamlanmadığını belirlemeye][doc-waiting-for-tests] yardımcı olur.
    
7.  Test sonuçlarının elde edilmesi.

Bu senaryo aşağıdaki şekilde gösterilmiştir:

![İstek kaydı içeren bir CI/CD işine örnek][img-sample-job-recording]


##  Önceden Kaydedilmiş Temel İstekler Kullanılırken API Üzerinden Dağıtım

Bu senaryoda bir test çalıştırması kopyalanır. Kopyalama sırasında, test çalıştırmasına var olan bir test kaydı tanımlayıcısı aktarılır. Test kaydı, temel isteklerin kaydedildiği CI/CD iş akışında edinilir.

İlgili iş akışı adımları şunlardır:

1.  Hedef uygulamanın derlenmesi ve dağıtılması.

2.  FAST node'unun dağıtılması ve yapılandırılması:
    
    1.  [FAST node'u ile Docker konteynerinin dağıtılması][doc-container-deployment].
    
    2.  [Bir test çalıştırmasının kopyalanması][doc-testrun-copying].    

3.  FAST node'u ile verilen test kaydından temel isteklerin çıkarılması. 

4.  FAST node'u ile hedef uygulamanın güvenlik testlerinin yürütülmesi.

5.  FAST güvenlik testlerinin tamamlanmasının beklenmesi.
    
    API isteği yaparak test çalıştırmasının durumunu periyodik olarak kontrol edin. Bu, [güvenlik testlerinin tamamlanıp tamamlanmadığını belirlemeye][doc-waiting-for-tests] yardımcı olur.
    
6.  Test sonuçlarının elde edilmesi.

![Önceden kaydedilmiş isteklerin kullanıldığı bir CI/CD işine örnek][img-sample-job-no-recording]   


##  FAST node konteynerinin yaşam döngüsü (API üzerinden dağıtım)

Bu senaryo, FAST node'unu içeren Docker konteynerinin belirli bir CI/CD işi için yalnızca bir kez çalıştırıldığını ve iş bittiğinde kaldırıldığını varsayar.
 
FAST node'u çalışma sırasında kritik hatalarla karşılaşmazsa, yeni test çalıştırmalarını ve hedef uygulamayı yeniden test etmek için temel istekleri bekleyerek sonsuz döngüde çalışır.
  
Node'u barındıran Docker konteyneri, CI/CD işi tamamlandığında CI/CD aracı tarafından açıkça durdurulmalıdır. 

<!-- -->
Gerekirse [“FAST ile CI/CD İş Akışı”][doc-integration-overview] belgesine geri başvurabilirsiniz.