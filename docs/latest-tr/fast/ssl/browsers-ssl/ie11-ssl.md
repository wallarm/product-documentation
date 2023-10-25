[img-cert-request]:         ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-certificate-request.png
[img-cert-window]:          ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-certificate-window.png
[img-store-location]:       ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-store-location.png
[img-store]:                ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-store-selection.png
[img-wizard-resume]:        ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-wizard-resume.png
[img-fingerprint-warning]:  ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-fingerprint-warning.png
[img-import-ok]:            ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-import-success.png
[img-https-ok]:             ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-https-ok.png


#   Microsoft Internet Explorer 11 İçin FAST Node Kullanıcı Tarafından İmzalı SSL Sertifikası Kurulumu

Internet Explorer 11 tarayıcısına sertifikayı kurmak için aşağıdaki adımları izleyin:

1.  Tarayıcınızın HTTP ve HTTPS proxy olarak FAST düğümünü kullanacak şekilde ayarlandığından emin olun.

2.  Tarayıcı aracılığıyla HTTP kullanarak herhangi bir domainden `cert.der` dosyasını isteyin.
    
    Örneğin, aşağıdaki bağlantıları kullanabilirsiniz:
    
    * <http://wallarm.get/cert.der>
    * <http://example.com/cert.der>

    Tarayıcı, sertifika dosyasını açmanızı ya da kaydetmeniz gerekip gerekmediğine siz karar verirsiniz. **Aç** düğmesini seçin.

    ![Kullanıcı tarafından imzalı FAST düğüm sertifikasını isteme][img-cert-request]

3.  Sertifikayla ilgili bilgileri içeren bir pencere açılır. Sertifikanızın adının ve son kullanma tarihinin resimde gösterilenden farklı olacağını unutmayın. **Sertifikayı Yükle** düğmesini seçin.

    ![“Sertifika” penceresi][img-cert-window]

4.  Açılan pencerede uygun sertifikayı kurma seçeneğini seçin. Sertifikayı mevcut kullanıcı için ya da tüm kullanıcılar için yükleyebilirsiniz. Uygun seçeneği belirleyin ve **İleri** düğmesini seçin.  

    ![Sertifika deposu konumunu seçme][img-store-location]

5.  Bir sertifika deposunu seçmeniz istenecektir. “Tüm sertifikaları aşağıdaki depoya yerleştir” seçeneğini seçin ve depo olarak “Güvenilen Kök Sertifika Yetkilileri” ayarlayın. **İleri** düğmesini seçin.

    ![Sertifika deposunu seçin][img-store]

    Sertifika için uygun depoyu seçtiğinize emin olun ve **Bitir** düğmesini seçerek ithalat işlemini başlatın.
    
    ![Sertifika ithalat sihirbazı özeti][img-wizard-resume]

6.  İthal edilen sertifikanın parmak izinin doğrulanamadığına dair bir uyarı mesajı alacaksınız. İthalat işlemini tamamlamak için **Evet** düğmesini seçin.

    ![Parmak izi doğrulama uyarısı][img-fingerprint-warning]

    İthalat başarılı olmuşsa, “İthalat başarılı oldu” bilgilendirme mesajı belirecektir.

    ![Sertifikanın başarılı bir şekilde ithal edilmesi][img-import-ok]
    
7.  Sertifikanın doğru bir şekilde yüklendiğini kontrol edin. Bunu yapmak için herhangi bir siteye HTTPS üzerinden gidin. Herhangi bir güvenilmeyen sertifika hakkında uyarı mesajı almadan siteye HTTPS sürümüne yönlendirilmeniz gerekir.

    Örneğin, Google Gruyere sitesine HTTPS sürümünü incelemek için gitmeyi deneyin:
    <https://google-gruyere.appspot.com>

    ![HTTPS çalışıyor][img-https-ok]
