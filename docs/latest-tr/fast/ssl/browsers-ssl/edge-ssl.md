[img-cert-request]:         ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-certificate-request.png
[img-cert-window]:          ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-certificate-window.png
[img-store-location]:       ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-store-location.png
[img-store]:                ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-store-selection.png
[img-wizard-resume]:        ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-wizard-resume.png
[img-fingerprint-warning]:  ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-fingerprint-warning.png
[img-import-ok]:            ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-import-success.png
[img-https-ok]:             ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-https-ok.png

#   Microsoft Edge için FAST Node Öz-İmzalanmış SSL-Sertifikası Kurulumu

Microsoft Edge tarayıcısı için sertifikayı kurmak için aşağıdakileri yapın:

1.  HTTP ve HTTPS proxy'si olarak FAST node'u kullanacak şekilde tarayıcınızı ayarladığınızdan emin olun.

2.  Tarayıcıyı kullanarak `cert.der` dosyasını herhangi bir alan adından HTTP üzerinden isteyin.

    Örneğin, aşağıdaki bağlantılardan birini kullanabilirsiniz:
    
    * <http://wallarm.get/cert.der>
    * <http://example.com/cert.der>

    Tarayıcı, sertifika dosyasını açmayı veya kaydetmeyi seçme seçeneği sunar. **Aç** düğmesini seçin.

    ![Öz imzalı FAST node sertifikasının istenmesi][img-cert-request]

3.  Sertifika hakkında bilgi içeren bir pencere açılır. Sertifikanızın adı ve son kullanma tarihi, resimde gösterilenlerden farklı olacaktır. **Sertifikayı Yükle** düğmesini seçin.

    ![Sertifika penceresi][img-cert-window]

4.  Açılan pencerede uygun sertifika kurulum seçeneğini seçin. Sertifikayı şu anki kullanıcı için veya tüm kullanıcılar için yükleyebilirsiniz. Uygun seçeneği seçin ve **İleri** düğmesini seçin.

    ![Sertifika mağaza konumunu seçin][img-store-location]

5.  Bir sertifika mağazası seçmeniz istenecektir. “Tüm sertifikaları aşağıdaki mağazaya yerleştir” seçeneğini seçin ve “Güvenilir Kök Sertifika Otoriteleri”ni mağaza olarak belirleyin. **İleri** düğmesini seçin.
    ![Sertifika mağazasını seçin][img-store]

    Sertifika için uygun mağazayı seçtiğinizden emin olun ve **Bitir** düğmesini seçerek içe aktarma sürecini başlatın.

    ![Sertifika içe aktarma sihirbazı özeti][img-wizard-resume]

6.  İçe aktarılan sertifikanın parmak izinin doğrulanamaması hakkında bir uyarı mesajı alacaksınız. İçe aktarma sürecini tamamlamak için **Evet** düğmesini seçin.
    
    ![Parmak izi doğrulama uyarısı][img-fingerprint-warning]

    İçe aktarma başarılı olduğunda, “İçe aktarma başarılı oldu” bilgilendirme mesajı görünecektir.

    ![Sertifikanın başarılı bir şekilde içe aktarılması][img-import-ok]

7.  Sertifikanın doğru bir şekilde yüklendiğini kontrol edin. Bunu yapmak için, herhangi bir siteye HTTPS üzerinden gidin. Herhangi bir güvenilmez sertifikalar hakkında uyarı mesajı olmadan siteye yönlendirilmelisiniz.

    Örneğin, Google Gruyere sitesinin HTTPS versiyonuna göz atabilirsiniz:
    <https://google-gruyere.appspot.com>

    ![HTTPS çalışıyor][img-https-ok]