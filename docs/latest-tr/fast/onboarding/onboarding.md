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

#   FAST'e Başlangıç

--8<-- "../include/fast/cloud-note.md"

 Wallarm portal'a [Wallarm portal][link-wl-portal] üzerinden ilk girişinizde, beş adımlı başlangıç süreciyle FAST ile tanışma fırsatına sahip olursunuz.

!!! info "Başlangıç sürecini kontrol etme"
    Başlangıç sürecini, başlangıç panelindeki ✕ düğmesine istediğiniz zaman tıklayarak durdurabilirsiniz.
    
    Size, başlangıcı tamamen atlama veya mevcut adımınızdan sürece daha sonra devam etme seçeneği sunulacaktır.
    
    Başlangıcı atladıysanız ve başlatmak istiyorsanız, Wallarm portal'ın sağ üst köşesindeki soru işaretine basın ve açılan kenar çubuğunda “FAST in 5 minutes” öğesini seçin:            
    
    ![“The Quick Help” düğmesi][img-quick-help-howto]
    
    Daha önce ertelediğiniz başlangıç sürecine devam etmek istiyorsanız, Wallarm portal'ın sağ alt köşesindeki “FAST in 5 minutes” düğmesine tıklayın:
    
    ![“FAST in 5 minutes” düğmesi][img-fast-5mins-button]

FAST'e hızlı bir giriş yapmak için aşağıdakileri yapın:
1.  FAST çözümü hakkında bilgi okuyun.
    
    ![FAST çözümü hakkında genel bilgi][img-intro]
    
    Bir sonraki adıma geçmek için “Deploy FAST Node →” düğmesine tıklayın.
    
2.  Makinenizde FAST node içeren bir Docker container dağıtın. Bunu yapmak için, bu adımda gösterilen `docker run` komutunu kopyalayıp çalıştırın. Komut, gerekli tüm parametrelerle önceden doldurulmuştur.
    
    ![Dağıtım ipucu][img-deploy]
    
    !!! info "Docker'ı yükleme"
        Docker yüklü değilse, [yükleyin][link-docker-install-docs]. Community Edition veya Enterprise Edition sürümlerinin herhangi biri uygundur.
    
    FAST node başlatıldıktan sonra `127.0.0.1:8080` adresinde gelen bağlantıları dinleyecektir.
    
    ![Dağıtılmış FAST node][img-cont-deployed]

    Makinenizdeki bir tarayıcıyı HTTP proxy olarak `127.0.0.1:8080` adresini kullanacak şekilde yapılandırın. Wallarm portal'ın açık olduğu tarayıcı dışındaki herhangi bir tarayıcıyı kullanabilirsiniz. Mozilla Firefox'u öneriyoruz (Firefox'u proxy kullanacak şekilde nasıl yapılandıracağınıza ilişkin [talimatlara][link-firefox-proxy] bakın).
    
    ![Mozilla Firefox'ta proxy ayarları][img-ff-proxy-settings]
    
    !!! info "Farklı bir port numarası kullanma"
        `8080` portunu FAST node'a vermek istemiyorsanız (örneğin, o portta dinleyen başka bir servis varsa), FAST tarafından kullanılacak başka bir port numarası ayarlayabilirsiniz. Bunu yapmak için, istenen port numarasını `docker run` komutunun `-p` parametresiyle geçirin. Örneğin, `9090` portunu kullanmak için şu şekilde yazarsınız: `-p 9090:8080`.
    
    Bir sonraki adıma geçmek için “Create a Test Run →” düğmesine tıklayın.
    
    !!! info "Önceki adıma dönme"
        Önceki adımın adına sahip düğmeye tıklayarak her zaman geri dönebileceğinizi unutmayın (ör. “← Understanding FAST”).
   
3.  “Create test run” düğmesine tıklayarak bir test çalışması oluşturun. Test çalışması için bir ad seçin ve ardından başlangıç ipucunda belirtildiği gibi açılır listelerden gerekli test politikasını ve node'u seçin:

    ![Bir test çalışmasının oluşturulması][img-create-testrun]
    
    Test çalışmasının oluşturma işlemini tamamlamak için “Create and run” düğmesine basın.
    
    Bir sonraki adıma geçmek için “Discover Vulnerabilities →” düğmesine tıklayın.
    
4.  FAST node'un konsolunda `Recording baselines for TestRun...` iletisinin görüntülendiğinden emin olun:
    
    ![FAST node'un konsolu][img-recording]
    
    Ardından, FAST ile güvenlik açıklarını test etme sürecini başlatmak için [Google Gruyere][link-gruyere-app] adlı savunmasız uygulamaya bir istek gönderin.
    
    Bunu yapmak için, başlangıç ipucunda verilen HTTP isteğini kopyalayın, FAST node'unu proxy olarak kullanacak şekilde ayarladığınız tarayıcının adres çubuğuna yapıştırın ve isteği çalıştırın:
    
    ![İpucundaki HTTP isteği][img-http-request]
    
    ![HTTP isteğinin yürütülmesi][img-gruyere-app]
    
    İstek gönderildikten sonra, “Actions” açılır menüsünden “Stop recording” öğesini seçerek istek kaydetme işlemini durdurun. İşlemi “Yes” düğmesine basarak onaylayın:
    
    ![İstek kaydını durdurma süreci][img-stop-recording]
    
    Test tamamlanana kadar bekleyin. FAST, Google Gruyere uygulamasında bir XSS güvenlik açığı tespit etmelidir. Test çalışmasının “Results” sütununda güvenlik açığı tanımlayıcısı ve türü görüntülenmelidir:
    
    ![Testin sonucu][img-results]
    
    !!! info "Güvenlik açığını analiz etme"
        Keşfedilen güvenlik açıklığı hakkında bilgi edinmek için test çalışmasının “Results” sütunundaki değere tıklayabilirsiniz:
        
        ![Güvenlik açığı hakkında ayrıntılı bilgi][img-detailed-results]
    
    Bir sonraki adıma geçmek için “Run With It!” düğmesine tıklayın.
    
5.  Bu adıma geldiğinizde, FAST ile başarıyla tanışmış ve bir web uygulamasında bir güvenlik açığı keşfetmiş olursunuz.
    
    ![Başlangıç sürecinin sonu][img-finish]
    
    FAST ile nasıl başlayacağınız hakkında daha ayrıntılı bilgi edinmek için [“Hızlı Başlangıç kılavuzu”][link-qsg]'na gidin.
    
    Başlangıç sürecini tamamlamak için “Finish” düğmesine tıklayın.
    
    !!! info "Yapılacak ek işlemler"
        Güvenlik açığı başarıyla tespit edildikten sonra FAST node'un Docker container'ını kapatabilir ve tarayıcıdaki proxy yönlendirmesini devre dışı bırakabilirsiniz.