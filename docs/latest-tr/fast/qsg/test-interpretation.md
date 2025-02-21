[img-dashboard]:            ../../images/fast/qsg/common/test-interpretation/25-qsg-fast-test-int-dashboard.png
[img-testrun]:              ../../images/fast/qsg/common/test-interpretation/27-qsg-fast-test-int-testrun-screen.png
[img-test-run-expanded]:    ../../images/fast/qsg/common/test-interpretation/28-qsg-fast-testrun-opened.png
[img-status-passed]:        ../../images/fast/qsg/common/test-interpretation/passed-colored.png
[img-status-failed]:        ../../images/fast/qsg/common/test-interpretation/failed-colored.png
[img-status-inprogress]:    ../../images/fast/qsg/common/test-interpretation/in-progress.png
[img-status-error]:         ../../images/fast/qsg/common/test-interpretation/error-colored.png
[img-status-waiting]:       ../../images/fast/qsg/common/test-interpretation/waiting-colored.png
[img-status-interrupted]:   ../../images/fast/qsg/common/test-interpretation/interrupted-colored.png
[img-testrun-expanded]:     ../../images/fast/qsg/common/test-interpretation/29-qsg-fast-test-int-testrun-expanded.png
[img-log]:                  ../../images/fast/qsg/common/test-interpretation/30-qsg-fast-test-int-testrun-log.png
[img-vuln-description]:     ../../images/fast/qsg/common/test-interpretation/31-qsg-fast-test-int-events-vuln-description.png     
[img-vuln-details]:         ../../images/fast/qsg/common/test-interpretation/32-qsg-fast-int-issue-details.png

[link-previous-chapter]:    test-run.md
[link-wl-console]:          https://us1.my.wallarm.com
[link-how-to-search]:       https://docs.wallarm.com/en/user-en/use-search-en.html    

    
# Test Sonuçlarının Yorumlanması

Bu bölüm, [My Wallarm portal][link-wl-console] üzerindeki test sonucu yorumlama araçlarının genel bir görünümünü sunacaktır. Bu bölümü tamamladıktan sonra, [önceki bölüm][link-previous-chapter]'de tespit edilen XSS açığı hakkında ek bilgiler edinmiş olacaksınız.

1.  Neler olup bittiğine hızlıca göz atmak için "Dashboards → FAST" sekmesine tıklayın. Gösterge paneli, belirli bir zaman dilimi için tüm test çalıştırmalarının durumu ve güvenlik açığı sayıları ile ilgili özet bilgileri sunar.

    ![Dashboard][img-dashboard]

    <!-- Ayrıca bir olay arama aracını da kullanabilirsiniz. Bunu yapmak için “Events” sekmesini seçin ve gerekli sorguyu arama kutusuna girin. Arama kutusunun yakınlarında bulunan “How to search” bağlantısı aracılığıyla yardım alabilirsiniz. -->

    <!-- Arama aracının kullanımı hakkında daha fazla bilgi için [link][link-how-to-search] bağlantısına bakın. -->

2.  “Test runs” sekmesini seçerseniz, her biri hakkında kısa bilgilerin yer aldığı tüm test çalıştırmalarının listesini görebilirsiniz; örneğin:

    * Test çalıştırma durumu (devam ediyor, başarılı veya başarısız)
    * Bir temel istek kaydının yapılıyor olup olmadığı
    * Kayıt altına alınan temel istek sayısı
    * Bulunan güvenlik açıkları (varsa)
    * Hedef uygulamanın alan adı
    * Test oluşturma ve yürütme sürecinin gerçekleştirildiği yer (node veya cloud)

    ![Testruns][img-testrun]

3.  Bir test çalıştırmasını detaylı incelemek için üzerine tıklayın:

    ![Test run expanded][img-test-run-expanded]

    Genişletilmiş bir test çalıştırmasından aşağıdaki bilgileri elde edebilirsiniz:

    * İşlenen temel istek sayısı
    * Test çalıştırma oluşturulma tarihi
    * Test çalıştırma süresi
    * Hedef uygulamaya gönderilen istek sayısı
    * Temel isteklerin test edilme süreci durumu:

        * **Passed** ![Status: Passed][img-status-passed]
        
            Verilen temel istek için herhangi bir güvenlik açığı tespit edilmedi (seçilen test politikasına bağlı olarak — farklı bir politika seçerseniz bazı güvenlik açıkları tespit edilebilir) veya test politikası isteğe uygulanamaz.
        
        * **Failed** ![Status: Failed][img-status-failed]  
        
            Verilen temel istek için güvenlik açıkları tespit edildi.
            
        * **In progress** ![Status: In progress][img-status-inprogress]
              
            Temel istek, güvenlik açıkları açısından test ediliyor.
            
        * **Error** ![Status: Error][img-status-error]  
            
            Test süreci, hatalar nedeniyle durduruldu.
            
        * **Waiting** ![Status: Waiting][img-status-waiting]      
        
            Temel istek test için kuyruğa alındı. Aynı anda yalnızca sınırlı sayıda istek test edilebilir. 
            
        * **Interrupted** ![Status: Interrupted][img-status-interrupted]
        
            Test süreci ya manuel olarak («Actions» → «Interrupt») kesildi ya da aynı FAST node üzerinde başka bir test çalıştırması gerçekleştirildi.

4.  Bir temel isteği detaylı incelemek için üzerine tıklayın:

    ![Test run expanded][img-testrun-expanded]
    
    Her bir bireysel temel istek için aşağıdaki bilgiler sağlanır:

    * Oluşturulma zamanı
    * Hedef uygulamaya gönderilen test isteklerinin sayısı
    * Kullanılan test politikası
    * İsteğin işlenme durumu

5.  İstek işleme sürecinin tam günlüğünü görüntülemek için, en sağdaki “Details” bağlantısını seçin:

    ![Request processing log][img-log]

6.  Bulunan güvenlik açıklarının genel görünümünü elde etmek için “Issue” bağlantısına tıklayın:

    ![Vulnerabilities brief description][img-vuln-description]

    Bir güvenlik açığını detaylı incelemek için, güvenlik açığı açıklamasına tıklayın:

    ![Vulnerability details][img-vuln-details]
            
Artık, test sonuçlarını yorumlamanıza yardımcı olan araçlarla ilgili bilgi sahibi olmalısınız.