[img-cert-request]:         ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-certificate-request.png
[img-cert-window]:          ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-certificate-window.png
[img-store-location]:       ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-store-location.png
[img-store]:                ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-store-selection.png
[img-wizard-resume]:        ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-wizard-resume.png
[img-fingerprint-warning]:  ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-fingerprint-warning.png
[img-import-ok]:            ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-import-success.png
[img-https-ok]:             ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-https-ok.png
        
    
#   Microsoft Internet Explorer 11 için FAST Node kendinden imzalı SSL sertifikası kurulumu

Internet Explorer 11 tarayıcısı için sertifikayı kurmak üzere aşağıdakileri yapın:

1.  Tarayıcınızı FAST node'u HTTP ve HTTPS proxy'si olarak kullanacak şekilde yapılandırdığınızdan emin olun.

2.  Tarayıcıyı kullanarak herhangi bir alan adından HTTP üzerinden `cert.der` dosyasını isteyin.
    
    Örneğin, aşağıdaki bağlantılardan birini kullanabilirsiniz:
    
    * <http://wallarm.get/cert.der>
    * <http://example.com/cert.der>

    Tarayıcı size sertifika dosyasını açma veya kaydetme seçeneği sunacaktır. **Aç** düğmesini seçin.

    ![Kendinden imzalı FAST node sertifikasının istenmesi][img-cert-request]

3.  Sertifika hakkında bilgi içeren bir pencere açılacaktır. Sertifikanızın adı ve son kullanma tarihinin görüntüde gösterilenden farklı olacağını unutmayın. **Sertifikayı Yükle** düğmesini seçin.

    ![“Sertifika” penceresi][img-cert-window]

4.  Açılan pencerede uygun sertifika kurulum seçeneğini belirleyin. Sertifikayı mevcut kullanıcı için veya tüm kullanıcılar için yükleyebilirsiniz. Uygun seçeneği seçin ve **İleri** düğmesini seçin.  

    ![Sertifika deposu konumunu seçin][img-store-location]

5.  Bir sertifika deposu seçmeniz istenecektir. “Tüm sertifikaları aşağıdaki depoya yerleştir” seçeneğini seçin ve depo olarak “Güvenilir Kök Sertifika Yetkilileri”ni ayarlayın. **İleri** düğmesini seçin.

    ![Sertifika deposunu seçin][img-store]

    Sertifika için uygun depoyu seçtiğinizden emin olun ve **Son** düğmesini seçerek içe aktarma işlemini başlatın.
    
    ![Sertifika içe aktarma sihirbazı özeti][img-wizard-resume]

6.  İçe aktarılan sertifikanın parmak izinin doğrulanamaması hakkında bir uyarı mesajı göreceksiniz. İçe aktarma işlemini tamamlamak için **Evet** düğmesini seçin.

    ![Parmak izi doğrulama uyarısı][img-fingerprint-warning]

    İçe aktarma başarılıysa, “İçe aktarma başarılı oldu” bilgi mesajı görüntülenecektir.

    ![Sertifikanın başarıyla içe aktarılması][img-import-ok]
    
7.  Sertifikanın doğru şekilde yüklendiğini kontrol edin. Bunu yapmak için herhangi bir siteye HTTPS üzerinden gidin. Güvenilmeyen sertifika ile ilgili herhangi bir uyarı mesajı olmadan sitenin HTTPS sürümüne yönlendirilmelisiniz.

    Örneğin, Google Gruyere sitesinin HTTPS sürümünü ziyaret edebilirsiniz:
    <https://google-gruyere.appspot.com>

    ![HTTPS çalışıyor][img-https-ok]