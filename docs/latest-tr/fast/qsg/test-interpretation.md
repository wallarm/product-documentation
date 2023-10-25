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

Bu bölüm, [My Wallarm portalı][link-wl-console]'nda test sonucu yorumlama araçlarına genel bir bakış sağlayacaktır. Bu bölümü tamamladığınızda, [önceki bölümde][link-previous-chapter] bulunan XSS zafiyeti hakkında ek bilgiler edineceksiniz.        

1. Her şeyin ne durumda olduğunu hızlıca görmek için "Dashboards → FAST" sekmesine tıklayın. Gösterge tablosu, tüm test çalışmalarını ve durumlarını, seçilen bir zaman dilimi için zafiyet sayılarının yanı sıra size bir özet sağlar.

    ![Dashboard][img-dashboard]

2. "Test çalışmaları" sekmesini seçerseniz, tüm test çalışmalarının listesini ve bunlar hakkında bazı kısa bilgileri görebilirsiniz:

    * Test çalışması durumu (devam ediyor, başarılı veya başarısız)
    * Temel bir istek kaydının devam edip etmediği
    * Kaç temel istek kaydedildi
    * Bulunan zafiyetler (varsa)
    * Hedef uygulamanın alan adı
    * Test oluşturma ve yürütme sürecinin nerede gerçekleştiği (düğüm veya bulut)

    ![Testler][img-testrun]

3. Bir test çalışmasını ayrıntılı olarak incelemek için üzerine tıklayın:

    ![Test çalışması genişletildi][img-test-run-expanded]

    Genişletilmiş bir test çalışmasından aşağıdaki bilgileri edinebilirsiniz:

    * İşlenen temel isteklerin sayısı
    * Test çalışması oluşturma tarihi
    * Test çalışmasının süresi
    * Hedef uygulamaya gönderilen isteklerin sayısı
    * Temel isteklerin test sürecinin durumu:

        * **Passed** ![Durum: Geçti][img-status-passed]
        
            Verilen temel istek için zafiyet bulunmadı (bu, seçilen test politikasına bağlıdır - başka birini seçerseniz, bazı zafiyetler bulunabilir) veya test politikası isteğe uygulanamaz.
        
        * **Failed** ![Durum: Başarısız][img-status-failed]  
        
            Verilen temel istek için zafiyetler bulundu.
            
        * **In progress** ![Durum: Devam Ediyor][img-status-inprogress]
              
            Temel istek, zafiyetler için test ediliyor.
            
        * **Error** ![Durum: Hata][img-status-error]  
            
            Test süreci hatalar nedeniyle durduruldu.
            
        * **Waiting** ![Durum: Bekliyor][img-status-waiting]      
        
            Temel istek, test için sıraya alındı. Aynı anda sadece sınırlı sayıda istek test edilebilir.
            
        * **Interrupted** ![Durum: Kesildi][img-status-interrupted]
        
            Test süreci ya manuel olarak durduruldu ("Actions" → "Interrupt") ya da aynı FAST düğümünde başka bir test çalışması yürütüldü.

4. Bir temel isteği ayrıntılı olarak incelemek için üzerine tıklayın:

    ![Test çalışması genişletildi][img-testrun-expanded]
    
    Her bir temel istek için aşağıdaki bilgiler sağlanır:

    * Oluşturma zamanı
    * Hedef uygulamaya gönderilen ve oluşturulan test isteklerinin sayısı
    * Kullanılan test politikası
    * İstek işleme durumu

5. İsteğin tam günlüğünü görmek için çok sağdaki "Details" bağlantısını seçin:

    ![İstek işleme günlüğü][img-log]

6. Bulunan zafiyetlere genel bir bakış elde etmek için "Issue" bağlantısını tıklayın:

    ![Zafiyetlerin kısa açıklaması][img-vuln-description]

    Bir zafiyeti ayrıntılı olarak incelemek için zafiyet açıklamasına tıklayın:

    ![Zafiyet detayları][img-vuln-details]
            
Şimdi, test sonuçlarını yorumlamaya yardımcı olacak araçlarla tanışmış olmalısınız.