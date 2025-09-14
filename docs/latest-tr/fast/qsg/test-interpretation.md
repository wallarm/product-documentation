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

    
    
#   Test sonuçlarının yorumlanması

Bu bölüm, [My Wallarm portal][link-wl-console] üzerindeki test sonuçlarını yorumlama araçlarına genel bir bakış sağlayacaktır. Bu bölümün sonunda, [önceki bölümde][link-previous-chapter] keşfedilen XSS zafiyeti hakkında ek bilgiler edinmiş olacaksınız.

1.  Hızlıca neler olup bittiğine bakmak için "Dashboards → FAST" sekmesine tıklayın. Dashboard, seçilen zaman aralığı için tüm test çalıştırmalarının ve durumlarının bir özetini ve zafiyet sayılarını sunar.

    ![Dashboard][img-dashboard]

    <!-- You can use an event search tool as well. To do that, select the “Events” tab, and enter the necessary request into the search box. Help is available through the link “How to search”, which is located near the search box.   -->

    <!-- See the [link][link-how-to-search] for more information about using the search tool. -->

2.  “Test runs” sekmesini seçerseniz, aşağıdakiler gibi her biri hakkında kısa bilgilerle birlikte tüm test çalıştırmalarının listesini görebilirsiniz:

    * Test çalıştırmasının durumu (devam ediyor, başarılı veya başarısız)
    * Bir temel istek kaydı devam edip etmediği
    * Kaç temel istek kaydedildiği
    * Hangi zafiyetlerin bulunduğu (varsa)
    * Hedef uygulamanın alan adı
    * Test üretimi ve yürütümünün nerede gerçekleştiği (düğüm veya bulut)

    ![Test çalıştırmaları][img-testrun]

3.  Üzerine tıklayarak bir test çalıştırmasını ayrıntılı olarak inceleyin:

    ![Genişletilmiş test çalıştırması][img-test-run-expanded]

    Genişletilmiş bir test çalıştırmasından aşağıdaki bilgileri edinebilirsiniz:

    * İşlenen temel istek sayısı
    * Test çalıştırmasının oluşturulma tarihi
    * Test çalıştırmasının süresi
    * Hedef uygulamaya gönderilen istek sayısı
    * Temel isteklerin test edilmesi sürecinin durumu:

        * **Passed** ![Durum: Passed][img-status-passed]
        
            Verilen temel istek için herhangi bir zafiyet bulunmadı (bu, seçilen test ilkesine bağlıdır — başka bir ilke seçerseniz bazı zafiyetler bulunabilir) veya test ilkesi isteğe uygulanabilir değildir.
        
        * **Failed** ![Durum: Failed][img-status-failed]  
        
            Verilen temel istek için zafiyetler bulundu.
            
        * **In progress** ![Durum: In progress][img-status-inprogress]
              
            Temel istek zafiyetler için test ediliyor.
            
        * **Error** ![Durum: Error][img-status-error]  
            
            Test süreci hatalar nedeniyle durduruldu.
            
        * **Waiting** ![Durum: Waiting][img-status-waiting]      
        
            Temel istek test için kuyruğa alındı. Aynı anda yalnızca sınırlı sayıda istek test edilebilir. 
            
        * **Interrupted** ![Durum: Interrupted][img-status-interrupted]
        
            Test süreci ya manuel olarak kesildi («Actions» → «Interrupt») ya da aynı FAST düğümünde başka bir test çalıştırması yürütüldü.   

4.  Bir temel isteği ayrıntılı olarak incelemek için üzerine tıklayın:

    ![Test çalıştırması genişletildi][img-testrun-expanded]
    
    Her bir temel istek için aşağıdaki bilgiler sağlanır:

    * Oluşturulma zamanı
    * Hedef uygulamaya oluşturulup gönderilen test isteklerinin sayısı
    * Kullanımdaki test ilkesi
    * İstek işleme durumu

5.  İstek işlemenin tam günlüğünü görüntülemek için en sağdaki “Details” bağlantısını seçin:

    ![İstek işleme günlüğü][img-log]

6.  Bulunan zafiyetlerin genel görünümünü almak için “Issue” bağlantısına tıklayın:

    ![Zafiyetlerin kısa açıklaması][img-vuln-description]

    Bir zafiyeti ayrıntılı olarak incelemek için zafiyet açıklamasına tıklayın:

    ![Zafiyet ayrıntıları][img-vuln-details]
            
Artık test sonuçlarını yorumlamanıza yardımcı olan araçlara aşina olmalısınız.