[img-quick-help-howto]:     ../../images/fast/onboarding/common/1-quick-help.png
[img-fast-5mins-button]:    ../../images/fast/onboarding/common/2-fast-in-5mins.png
[img-intro]:                ../../images/fast/onboarding/common/3-intro.png
[img-deploy]:               ../../images/fast/onboarding/common/4-deploy.png
[img-cont-deployed]:        ../../images/fast/onboarding/common/5-cont-deployed.png
[img-ff-proxy-settings]:    ../../images/fast/onboarding/common/6-ff-proxy.png
[img-create-testrun]:       ../../images/fast/onboarding/common/7-create-testrun.png
[img-recording]:            ../../images/fast/onboarding/common/8-check-recording.png
[img-http-request]:         ../../images/fast/onboarding/common/9-request.png
[img-gruyere-app]:          ../../images/fast/onboarding/common/10-gruyere-app.png
[img-stop-recording]:       ../../images/fast/onboarding/common/11-stop-recording.png
[img-results]:              ../../images/fast/onboarding/common/12-detected-vuln.png
[img-detailed-results]:     ../../images/fast/onboarding/common/13-vuln-details.png
[img-finish]:               ../../images/fast/onboarding/common/14-finish.png

[link-wl-portal]:           https://us1.my.wallarm.com
[link-docker-install-docs]: https://docs.docker.com/install/overview/
[link-firefox-proxy]:       https://support.mozilla.org/en-US/kb/connection-settings-firefox
[link-gruyere-app]:         http://google-gruyere.appspot.com/
[link-qsg]:                 ../qsg/deployment-options.md

#   FAST Giriş

--8<-- "../include-tr/fast/cloud-note.md"

 İlk [Wallarm portalı][link-wl-portal] girişinizde FAST ile tanışma fırsatı bulabileceksiniz.

!!! info "Giriş sürecini kontrol etme"
    Giriş panelindeki ✕ düğmesine tıklayarak giriş sürecini istediğiniz zaman durdurabilirsiniz.
    
    Girişi tamamen atlamayı veya giriş sürecini daha sonra, bulunduğunuz adımdan itibaren devam ettirmeyi seçebilirsiniz.
    
    Girişi atlarsanız ve yeniden başlatmak isterseniz, Wallarm portalının sağ üst köşesindeki soru işaretine basın ve açılan yan menüde "FAST in 5 minutes" öğesini seçin:            
            
    ![Hızlı yardım düğmesi][img-quick-help-howto]
    
    Daha önce ertelediğiniz giriş sürecini sürdürmek isterseniz, Wallarm portalının sağ alt köşesindeki "FAST in 5 minutes" düğmesine tıklayın:
    
    [“5 dakikada FAST” düğmesi][img-fast-5mins-button]

FAST'a hızlı bir giriş yapmak için şunları yapın:
1.  FAST çözümü hakkında bilgi edinin.
    
    ![FAST çözümü hakkında genel bilgi][img-intro]
    
    İleri adıma geçmek için “Deploy FAST Node →” düğmesine tıklayın.
    
2.  Makinenizde FAST düğümüyle bir Docker konteyneri dağıtın. Bunun için, bu adımda size gösterilen `docker run` komutunu kopyalayın ve yürütün. Komut, zaten gerekli tüm parametrelerle doldurulmuştur.
    
    ![Konuşlandırma ipucu][img-deploy]
    
    !!! info "Docker'ın Kurulumu"
        Docker'iniz yoksa, [kurun][link-docker-install-docs]. Topluluk Edition veya Enterprise Edition olması fark etmez.
    
    FAST düğümü başladıktan sonra `127.0.0.1:8080` adresinde gelen bağlantıları dinlemeye başlar.
    
    ![Dağıtılmış FAST düğümü][img-cont-deployed]

    Makinenizdeki bir tarayıcıyı, HTTP proxy'si olarak `127.0.0.1:8080`i kullanmak üzere yapılandırın. Wallarm portalının açıldığı tarayıcı dışında herhangi bir tarayıcıyı kullanabilirsiniz. Mozilla Firefox'u öneririz (Firefox'un proxy'i nasıl kullanılacağına dair [talimatlara][link-firefox-proxy] bakın).
    
    ![Mozilla Firefox'taki proxy ayarları][img-ff-proxy-settings]
    
    !!! info "Farklı bir port numarası kullanmak"
        FAST düğümüne `8080` portunu sağlamak istemezseniz (örneğin, bu portta başka bir hizmetin dinleniyor olması durumu), FAST tarafından kullanılacak başka bir port numarası ayarlayabilirsiniz. Bunu yapmak için, istenen port numarasını `docker run` komutunun `-p` parametresi üzerinden geçirin. Örneğin, `9090` portunu kullanmak için şunları yazın: `-p 9090:8080`.
    
    İleri adıma geçmek için “Create a Test Run →” düğmesine tıklayın.
    
    !!! info "Önceki adıma dönme"
        Önceki adıma her zaman önceki adımın adını taşıyan düğmeye tıklayarak geri dönebileceğinizi unutmayın (Ör., “← FAST'ı Anlama”).
   
3.  "Create test run" düğmesini tıklayarak bir test çalışması oluşturun. Test çalışması için bir ad seçin ve daha sonra giriş ipucunda belirtildiği gibi açılır listelerden gereken test politikasını ve düğümü seçin:

    ![Bir test çalışmasının oluşturulması][img-create-testrun]
    
    Test çalışmasının oluşturulma sürecini tamamlamak için "Create and run" düğmesine basın.
    
    İleri adıma geçmek için “Discover Vulnerabilities →” düğmesine tıklayın.
    
4.  FAST düğümünün konsolunda `Recording baselines for TestRun...` mesajının görüntülendiğinden emin olun:
    
    ![FAST düğümünün konsolu][img-recording]
    
    Ardından, FAST ile güvenlik açığı tespiti sürecini başlatmak için [Google Gruyere][link-gruyere-app] adlı güvenlik açıklı olan uygulamaya bir istek gönderin.
    
    Bunun için, giriş ipucunda sunulan HTTP isteğini kopyalayın, daha önce FAST düğümü olarak kullanmak üzere ayarladığınız tarayıcının adres çubuğuna yapıştırın ve isteği yürütün:
    
    ![İpucundaki HTTP isteği][img-http-request]
    
    ![HTTP isteğinin yürütülmesi][img-gruyere-app]
    
    İsteği gönderdikten sonra, istek kayıt sürecini durdurun. Bunun için "Actions" açılır menüsündeki “Stop recording” seçeneğini seçin. İşlemi "Yes" düğmesine basarak onaylayın:
    
    ![İstek kaydının durdurulması][img-stop-recording]
    
    Testin tamamlanmasını bekleyin. FAST, Google Gruyere uygulamasında bir XSS güvenlik açığı tespit etmelidir. Güvenlik açığının tanımlayıcısı ve türü, test çalışmasının "Results" sütununda görüntülenmelidir:
    
    ![Test sonucu][img-results]
    
    !!! info "Güvenlik açığının analizi"
        Test çalışmasının “Results” sütunundaki değeri tıklayarak keşfedilen güvenlik açığı hakkında biraz bilgi alabilirsiniz:
        
        ![Güvenlik açığı hakkında detaylı bilgi][img-detailed-results]
    
    İleri adıma geçmek için "Run With It!" düğmesine tıklayın.
    
5.  Bu adımda, başarıyla FAST ile tanışmayı tamamladınız ve bir web uygulamasında bir güvenlik açığı tespit ettiniz.
    
    ![Giriş sürecinin sonu][img-finish]
    
    FAST ile nasıl başlayacağınıza dair daha ayrıntılı bilgi almak için [“Hızlı Başlama kılavuzu”][link-qsg]na yönelin.
    
    "Finish" düğmesine tıklayarak giriş sürecini tamamlayın.
    
    !!! info "Atılması gereken ek eylemler"
        Güvenlik açığının başarıyla tespit edilmesi üzerine, FAST düğümünün Docker konteynerini kapatabilir ve tarayıcıdaki proxy'yi devre dışı bırakabilirsiniz.