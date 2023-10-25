[img-sample-job-ci-mode]:       ../../images/fast/poc/en/integration-overview/sample-job-ci-mode.png

[doc-recording-mode]:           ci-mode-recording.md#running-a-fast-node-in-recording-mode
[doc-testing-mode]:             ci-mode-testing.md#running-a-fast-node-in-testing-mode
[doc-proxy-configuration]:      proxy-configuration.md
[doc-fast-container-stopping]:  ci-mode-recording.md#stopping-and-removing-the-docker-container-with-the-fast-node-in-recording-mode
[doc-recording-variables]:      ci-mode-recording.md#environment-variables-in-recording-mode
[doc-integration-overview]:     integration-overview.md


#   FAST Düğümü ile Entegrasyon: İlkeler ve Adımlar

Bir performans testini CI modunda yapabilmek için FAST düğümünün iki modda sıralı olarak çalıştırılmış olması şarttır:
1.  [Kayıt modu][doc-recording-mode]
2.  [Test modu][doc-testing-mode]

`CI_MODE` ortam değişkeni bir FAST düğümünün çalışma modunun ne olduğunu belirler. Bu değişken aşağıdaki değerlere sahip olabilir:
* `recording`
* `testing`

Bu senaryoda, FAST düğümü ilk olarak bir test kaydı oluşturur ve bu kayıda başlangıç taslak taleplerini yazar. Kaydın tamamlanmasının ardından, düğüm bu önceden kaydedilmiş talepleri temel olarak kullanarak bir güvenlik testini başlatır.  

Bu senaryo aşağıdaki resimde tasvir edilmiştir:

![ci Modunda FAST Düğümü ile CI/CD İşi Örneği][img-sample-job-ci-mode]

İlgili iş akış adımları:

1.  Hedef uygulamanın inşa edilmesi ve dağıtılması.   

2.  [FAST düğümünün kayıt modunda çalıştırılması][doc-recording-mode].

    Kayıt modunda FAST düğümü aşağıdaki eylemleri gerçekleştirir:
    
    * Taleplerin kaynağından hedef uygulamaya kadar öntalepler yönlendirilir.
    * Bu öntalepler, daha sonra temel alınarak güvenlik test seti oluşturmak amacıyla test kaydına kaydedilir.
    
    !!! info "Test Çalıştırmaları Üzerine Not"
        Kayıt modunda bir test çalışması oluşturulmaz.

3.  Test aracının hazırlanması ve kurulumu:
    
    1.  Test aracının dağıtılması ve temel konfigürasyonunun yapılması.
    
    2.  [FAST düğümünün bir proxy sunucusu olarak konfigüre edilmesi][doc-proxy-configuration].
        
4.  Mevcut testlerin çalıştırılması.
    
    FAST düğümü öntalepleri hedef uygulamaya yönlendirir ve kaydeder.
    
5.  FAST düğümü kapsayıcının durdurulması ve çıkarılması.

    Eğer FAST düğümü çalışma sırasında kritik bir hata ile karşı karşıya gelmezse, ya [`INACTIVITY_TIMEOUT`][doc-recording-variables] şeklinde bir zamanlayıcı süresi bitene kadar ya da CI/CD aracı belirgin bir şekilde durdurulana kadar çalışmaya devam eder.
    
    Mevcut testler tamamlandıktan sonra, FAST düğümünün [durdurulması gerekir][doc-fast-container-stopping]. Bu, öntaleplerin kaydedilme sürecini sona erdiren bir işlemdir. Daha sonra düğüm kapsayıcısı çıkarılabilir.          

6.  [FAST düğümünün test modunda çalıştırılması][doc-testing-mode].

    Test modunda FAST düğümü aşağıdaki eylemleri gerçekleştirir:
    
    * Adım 4'te kaydedilen muhtemel taleplere dayalı bir test çalışması oluşturur.
    * Güvenlik test seti oluşturmayı ve yürütmeyi başlatır.
    
7.  Test sonuçlarını alıp FAST düğümü kapsayıcısını durdurma.    
    
    Eğer FAST düğümü çalışma sırasında kritik bir hata ile karşı karşıya gelmezse, güvenlik testleri tamamlanana kadar çalışmaya devam ederler. Ancak bu düğüm otomatik olarak sona erer. Daha sonra düğüm kapsayıcısı çıkarılabilir.

##  Bir FAST Düğümü Kapsayıcısının Yaşam Alokası (CI Modu Üzerinden Dağıtma)
   
Bu senaryo, Docker kapsayıcısındaki FAST düğümünün ilk olarak kayıt modunda çalıştığını, daha sonra test modunda çalıştığını varsayar. 
 
FAST düğümü herhangi bir modda çalışmayı bitirdiğinde, düğüm kapsayıcısı kaldırılır. Bir diğer deyişle, operasyon modu her değiştiğinde, bir FAST düğümü konteyneri yeniden oluşturulur.