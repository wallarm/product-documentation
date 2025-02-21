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

# FAST Onboarding

--8<-- "../include/fast/cloud-note.md"

İlk kez bir [Wallarm portal][link-wl-portal] girişinizde, FAST ile tanışabilmeniz için beş adımlı bir başlangıç sürecini deneyimleme fırsatınız olacak.

!!! info "Başlangıç Sürecini Kontrol Etme"
    Herhangi bir anda, başlangıç panelindeki ✕ düğmesine tıklayarak başlangıç sürecini durdurabilirsiniz.
    
    Size, başlangıcı tamamen atlama veya üzerinde bulunduğunuz adımdan daha sonra devam etme seçeneği sunulacaktır.
    
    Eğer başlangıcı atladıysanız ve başlatmak istiyorsanız, Wallarm portalının sağ üst köşesindeki soru işaretine basın ve açılan kenar çubuğunda “FAST in 5 minutes” seçeneğini tercih edin:
    
    ![“The Quick Help” button][img-quick-help-howto]
    
    Daha önce ertelediğiniz başlangıç sürecine devam etmek istiyorsanız, Wallarm portalının sağ alt köşesindeki “FAST in 5 minutes” düğmesine tıklayın:
    
    ![The “FAST in 5 minutes” button][img-fast-5mins-button]

FAST ile hızlıca tanışmak için aşağıdakileri yapın:
1.  FAST çözümü hakkında bilgi edinin.
    
    ![FAST çözümü hakkında genel bilgi][img-intro]
    
    Sonraki adıma geçmek için “Deploy FAST Node →” düğmesine tıklayın.
    
2.  Makinenizde FAST node içeren bir Docker konteyneri dağıtın. Bunu yapmak için, bu adımda size gösterilen `docker run` komutunu kopyalayıp çalıştırın. Komut, gerekli tüm parametrelerle önceden doldurulmuştur.
    
    ![Dağıtım ipucu][img-deploy]
    
    !!! info "Docker Kurulumu"
        Docker'a sahip değilseniz, [kurulumunu gerçekleştirin][link-docker-install-docs]. Community Edition veya Enterprise Edition fark etmez, her ikisi de uygundur.
    
    FAST node başladığında, `127.0.0.1:8080` adresinde gelen bağlantıları dinleyecektir.
    
    ![Dağıtılan FAST node][img-cont-deployed]

    Tarayıcınızı, `127.0.0.1:8080` adresini HTTP proxy olarak kullanacak şekilde yapılandırın. Wallarm portalının açık olduğu tarayıcı dışında herhangi bir tarayıcıyı kullanabilirsiniz. Mozilla Firefox'u öneririz (proxy yapılandırması için [talimatlara][link-firefox-proxy] bakın).
    
    ![Mozilla Firefox'taki proxy ayarları][img-ff-proxy-settings]
    
    !!! info "Farklı Bir Port Numarası Kullanma"
        FAST node için `8080` portunu kullanmak istemiyorsanız (örneğin, o portta dinleyen başka bir servis varsa), FAST'in kullanacağı başka bir port numarası belirleyebilirsiniz. Bunu yapmak için, istediğiniz port numarasını `docker run` komutunun `-p` parametresi ile belirtin. Örneğin, `9090` portunu kullanmak için şöyle yazabilirsiniz: `-p 9090:8080`.
    
    Sonraki adıma geçmek için “Create a Test Run →” düğmesine tıklayın.
    
    !!! info "Önceki Adıma Geri Dönme"
        Önceki adıma geri dönmek için her zaman, önceki adımın adıyla etiketlenmiş düğmeye (örneğin, “← Understanding FAST”) tıklayabileceğinizi unutmayın.
   
3.  “Create test run” düğmesine tıklayarak bir test çalışması oluşturun. Test çalışması için bir isim seçin ve ardından başlangıç ipucunda belirtildiği gibi gerekli test politikasını ve node'u açılır listelerden seçin.
    
    ![Bir test çalışması oluşturma][img-create-testrun]
    
    Test çalışmasının oluşturma sürecini tamamlamak için “Create and run” düğmesine basın.
    
    Sonraki adıma geçmek için “Discover Vulnerabilities →” düğmesine tıklayın.
    
4.  FAST node'un konsolunda `Recording baselines for TestRun...` mesajının görüntülendiğinden emin olun:
    
    ![FAST node'un konsolu][img-recording]
    
    Ardından, FAST ile güvenlik açıklarını test etme sürecine başlamak için [Google Gruyere][link-gruyere-app] adlı savunmasız uygulamaya bir istek gönderin.
    
    Bunu yapmak için, başlangıç ipucunda verilen HTTP isteğini kopyalayın, FAST node'u proxy olarak kullanacak şekilde yapılandırdığınız tarayıcının adres çubuğuna yapıştırın ve isteği gönderin:
    
    ![İpucundaki HTTP isteği][img-http-request]
    
    ![HTTP isteğinin gönderilmesi][img-gruyere-app]
    
    İstek gönderildikten sonra, “Actions” açılır menüsünden “Stop recording” seçeneğini seçerek istek kaydetme işlemini durdurun. İşlemi onaylamak için “Yes” düğmesine basın:
    
    ![İstek kaydetme işlemini durdurma][img-stop-recording]
    
    Test tamamlanana kadar bekleyin. FAST, Google Gruyere uygulamasında bir XSS açığını tespit etmelidir. Açığın tanımlayıcısı ve tipi, test çalışmasının “Results” sütununda görüntülenecektir:
    
    ![Test sonucunun görüntüsü][img-results]
    
    !!! info "Açığı Analiz Etme"
        Test çalışmasının “Results” sütunundaki değere tıklayarak, keşfedilen açık hakkında detaylı bilgilere ulaşabilirsiniz:
        
        ![Açık hakkında detaylı bilgi][img-detailed-results]
    
    Sonraki adıma geçmek için “Run With It!” düğmesine tıklayın.
    
5.  Bu adımda, FAST ile başarılı bir şekilde tanışmış ve bir web uygulamasında güvenlik açığı keşfetmiş olacaksınız.
    
    ![Başlangıç sürecinin sonu][img-finish]
    
    FAST'a başlama hakkında daha detaylı bilgi almak için [“Quick Start guide”][link-qsg]'a gidin.
    
    Başlangıç sürecini tamamlamak için “Finish” düğmesine tıklayın.
    
    !!! info "Alınacak Ek İşlemler"
        Güvenlik açığı başarıyla tespit edildikten sonra, FAST node'un Docker konteynerini kapatabilir ve tarayıcıdaki proxy ayarını devre dışı bırakabilirsiniz.