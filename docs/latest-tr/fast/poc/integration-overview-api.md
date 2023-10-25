[img-sample-job-recording]:     ../../images/fast/poc/en/integration-overview/sample-job.png
[img-sample-job-no-recording]:  ../../images/fast/poc/en/integration-overview/sample-job-no-recording.png

[doc-testrun]:                  ../operations/internals.md#test-run
[doc-container-deployment]:     node-deployment.md#deployment-of-the-docker-container
[doc-testrun-creation]:         node-deployment.md#creating-a-test-run 
[doc-testrun-copying]:          node-deployment.md#copying-a-test-run     
[doc-proxy-configuration]:      proxy-configuration.md
[doc-stopping-recording]:       stopping-recording.md
[doc-testrecord]:               ../operations/internals.md#test-record
[doc-waiting-for-tests]:        waiting-for-tests.md

[anchor-recording]:             #deployment-via-the-api-when-baseline-requests-recording-takes-place 
[anchor-no-recording]:          #deployment-via-the-api-when-prerecorded-baseline-requests-are-used

[doc-integration-overview]:     integration-overview.md

#   Wallarm API İle Entegrasyon

Birkaç farklı dağıtım yöntemi bulunmaktadır:
1.  [API üzerinden dağıtım sırasında temel isteklerin kaydedildiği durum.][anchor-recording]
2.  [Önceden kaydedilmiş temel isteklerin kullanıldığı API üzerinden dağıtım.][anchor-no-recording]


##  API Üzerinden Dağıtım Sırasında Temel İsteklerin Kaydedilmesi

Bu senaryoda bir [test çalıştırması][doc-testrun] yaratılır. Temel istekler, test çalıştırması ile ilgili test kaydına kaydedilir. 

Söz konusu iş akış adımları şunları içerir:

1.  Hedef uygulamanın inşa edilip dağıtılması.

2.  Hızlı bir düğüm kurma ve ayarlama:

    1.  [Docker konteynerında hızlı düğümle dağıtım yapılması.][doc-container-deployment].
    
    2.  [Bir test çalıştırmasının oluşturulması.][doc-testrun-creation].
    
        Bu eylemleri gerçekleştirdikten sonra, hızlı düğümün temel isteklerin kayıt sürecine başlamaya hazır olduğundan emin olun.
    
3.  Bir test aracını hazırlama ve kurma:

    1.  Test aracının dağıtılması ve temel bir yapılandırma gerçekleştirilmesi.
    
    2.  [Hızlı düğümün bir proxy sunucusu olarak yapılandırılması.][doc-proxy-configuration].
    
4.  Mevcut testlerin çalıştırılması.
    
    İlk temel isteği aldığında hızlı düğüm, güvenlik test setini oluşturup çalıştırmaya başlar.
    
5.  Temel isteklerin kayıt sürecinin durdurulması.
    
    Tüm mevcut testlerin yürütülmesinin ardından, kayıt süreci [durdurulmalıdır][doc-stopping-recording].
    
    Şimdi, kaydedilen temel istekleri içeren [test kaydı][doc-testrecord], zaten kaydedilmiş temel isteklerle çalışan CI/CD iş akışında yeniden kullanıma hazır.  
    
6.  Hızlı güvenlik testlerinin bitmesini beklemek.
    
    Düzenli olarak test çalıştırmasının durumunu kontrol etmek için bir API isteği yapın. Bu, [güvenlik testlerinin tamamlanıp tamamlanmadığını belirlemeye][doc-waiting-for-tests] yardımcı olur.
    
7.  Test sonuçlarının elde edilmesi.

Bu senaryo aşağıdaki resimde gösterilmektedir:

![Örnek bir CI/CD işi ile isteklerin kaydedilmesi][img-sample-job-recording]


##  Önceden Kaydedilmiş Temel İsteklerin Kullanıldığı API Üzerinden Dağıtım

Bu senaryoda bir test çalıştırması kopyalanır. Kopyalarken, mevcut bir test kayıt belirleyici test çalıştırmasına iletilir. Test kaydı, temel isteklerin kayıt oldugu CI/CD iş akışından elde edilir.

Söz konusu iş akış adımları şunları içerir:

1.  Hedef uygulamanın inşa edilip dağıtılması.

2.  Hızlı düğüm kurma ve ayarlama:

    1.  [Docker konteynerında hızlı düğümle dağıtım yapılması.][doc-container-deployment].
    
    2.  [Bir test çalıştırmasının kopyalanması.][doc-testrun-copying].    

3.  Verilen test kaydından hızlı düğümle temel isteklerin çıkarılması. 

4.  Hızlı düğümle hedef uygulamanın güvenlik testlerinin yürütülmesi.

5.  Hızlı güvenlik testlerinin bitmesini beklemek.

    Düzenli olarak test çalıştırmasının durumunu kontrol etmek için bir API isteği yapın. Bu, [güvenlik testlerinin tamamlanıp tamamlanmadığını belirlemeye][doc-waiting-for-tests] yardımcı olur.
    
6.  Test sonuçlarının elde edilmesi.

![Önceden kaydedilmiş isteklerin kullanıldığı bir CI/CD işi örneği][img-sample-job-no-recording]   


##  Bir Hızlı Düğüm Konteyner Yaşam Döngüsü (API Üzerinden Dağıtım)

Bu senaryo, Docker konteynerındaki hızlı düğümün, belirli bir CI/CD işi için yalnızca bir kez çalıştığını ve iş sona erdiğinde kaldırıldığını varsayar.

Hızlı düğüm, operasyon sırasında kritik hatalarla karşılaşmazsa, yeni test çalıştırmalarını ve temel istekleri bekleyerek sürekli bir döngüde çalışır.

CI/CD işi bittiğinde, düğümle gelen Docker konteyner, CI/CD aracı tarafından açıkça durdurulmalıdır.

<!-- -->
Gerekirse, [“CI/CD İş Akışında HIZLI ile”][doc-integration-overview] belgesine geri dönebilirsiniz. 
