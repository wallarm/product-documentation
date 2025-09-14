[img-cert-request]:         ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-certificate-request.png
[img-adv-settings]:         ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-advanced-settings.png
[img-cert-mgmt]:            ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-manage-certificates.png
[img-cert-window]:          ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-certificates-window.png
[img-cert-wizard]:          ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-certificates-wizard.png
[img-cert-import]:          ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-file-import.png
[img-cert-select]:          ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-file-selection.png
[img-store]:                ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-store-selection.png
[img-wizard-resume]:        ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-wizard-resume.png    
[img-fingerprint-warning]:  ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-fingerprint-warning.png
[img-import-ok]:            ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-import-success.png
[img-installed-cert]:       ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-installed-certificate.png
[img-https-ok]:             ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-https-ok.png   
    
    
    
    
#   Google Chrome için FAST Node Öz İmzalı SSL Sertifikasının Kurulumu

Google Chrome tarayıcısı için sertifikayı kurmak üzere şunları yapın:

1.  Tarayıcınızı FAST node’u HTTP ve HTTPS proxy’si olarak kullanacak şekilde yapılandırdığınızdan emin olun.

2.  Tarayıcıyı kullanarak HTTP üzerinden herhangi bir alan adından `cert.der` dosyasını isteyin.

    Örneğin, aşağıdaki bağlantılardan birini kullanabilirsiniz:
    
    * <http://wallarm.get/cert.der>
    * <http://example.com/cert.der>

    Tarayıcı sertifika dosyasını indirecektir. Yapılandırmaya bağlı olarak, dosya ya varsayılan indirme dizinine ya da sizin seçtiğiniz dizine yerleştirilecektir.

    ![Öz imzalı FAST node sertifikasını isteme][img-cert-request]

3.  Tarayıcının gizlilik ve güvenlik ayarları listesini açın. Bunu yapmak için <chrome://settings/privacy> bağlantısına gidin veya tarayıcı ayarlarını açıp ayarlar listesinin sonunda **Advanced** düğmesini seçerek ek ayarları genişletin.

    ![Chrome gelişmiş ayarlar][img-adv-settings]
    
    “Manage certificates” seçeneğini seçin.
    
    ![Chrome “Manage certificates” ayarı][img-cert-mgmt]

4.  Chrome sertifikaları hakkında bilgi içeren bir “Certificates” penceresi açılacaktır. “Trusted Root Certification Authorities” sekmesine geçin ve **Import** düğmesini seçin. 

    ![“Certificates” penceresi][img-cert-window]
        
    Bir Certificate Import Wizard açılacaktır. **Next** düğmesini seçin.
        
    ![Sertifika İçe Aktarma Sihirbazı][img-cert-wizard]

5.  **Browse** düğmesini seçin ve ardından daha önce indirdiğiniz sertifika dosyasını seçin. 
    
    ![Sertifika dosyasını içe aktarma][img-cert-import]

    Gerekirse “All files” dosya türünü seçin. **Next** düğmesini seçin.

    ![Sertifika dosyasının seçimi][img-cert-select]

6.  Bir sertifika deposu seçmeniz istenecektir. “Place all certificates in the following store” seçeneğini seçin ve depo olarak “Trusted Root Certification Authorities” değerini ayarlayın. **Next** düğmesini seçin.

    ![Sertifika deposunu seçin][img-store]
    
    Sertifika için uygun depoyu seçtiğinizden emin olun ve **Finish** düğmesini seçerek içe aktarma işlemini başlatın.
    
    ![Sertifika içe aktarma sihirbazı özeti][img-wizard-resume]

7.  İçe aktarılmakta olan sertifikanın parmak izinin doğrulanamadığına dair bir uyarı mesajı göreceksiniz. İçe aktarma işlemini tamamlamak için **Yes** düğmesini seçin.

    ![Parmak izi doğrulama uyarısı][img-fingerprint-warning]

    İçe aktarma başarılı olursa “The import was successful” bilgilendirme mesajı görüntülenecektir.

    ![Sertifikanın başarılı şekilde içe aktarılması][img-import-ok]
    
    Artık “Certificates” penceresinin “Trusted Root Certification Authorities” sekmesinde içe aktarılan sertifikayı göreceksiniz. Sertifikanızın adı ve sona erme tarihinin görseldekinden farklı olacağını unutmayın.
    
    ![Yüklü sertifika][img-installed-cert]

8.  Sertifikanın doğru şekilde kurulduğunu kontrol edin. Bunu yapmak için HTTPS üzerinden herhangi bir siteye gidin. Güvenilmeyen sertifikalarla ilgili uyarı mesajları olmadan sitenin HTTPS sürümüne yönlendirilmelisiniz.

    Örneğin, Google Gruyere sitesinin HTTPS sürümüne göz atabilirsiniz:
    <https://google-gruyere.appspot.com>

    ![HTTPS çalışıyor][img-https-ok]