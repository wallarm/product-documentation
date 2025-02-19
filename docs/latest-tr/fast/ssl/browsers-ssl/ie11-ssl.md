[img-cert-request]:         ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-certificate-request.png
[img-cert-window]:          ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-certificate-window.png
[img-store-location]:       ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-store-location.png
[img-store]:                ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-store-selection.png
[img-wizard-resume]:        ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-wizard-resume.png
[img-fingerprint-warning]:  ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-fingerprint-warning.png
[img-import-ok]:            ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-import-success.png
[img-https-ok]:             ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-https-ok.png
        
    
# Microsoft Internet Explorer 11 için FAST Node Self-signed SSL Sertifikası Kurulumu

Internet Explorer 11 tarayıcısı için sertifikayı kurmak amacıyla, aşağıdaki adımları uygulayın:

1.  Tarayıcınızın FAST node'u HTTP ve HTTPS proxy olarak kullanacak şekilde ayarlandığından emin olun.

2.  Tarayıcınızı kullanarak herhangi bir domainden HTTP üzerinden `cert.der` dosyasını isteyin.
    
    Örneğin, aşağıdaki bağlantılardan birini kullanabilirsiniz:
    
    * <http://wallarm.get/cert.der>
    * <http://example.com/cert.der>

    Tarayıcı, sertifika dosyasını açma veya kaydetme seçeneği sunacaktır. **Aç** düğmesini seçin.

    ![Requesting the self-signed FAST node certificate][img-cert-request]

3.  Sertifika bilgilerini içeren bir pencere açılacaktır. Sertifikanızın adı ve son kullanma tarihinin resimde gösterilenden farklı olabileceğine dikkat edin. **Sertifikayı Yükle** düğmesini seçin.

    ![“Certificate” window][img-cert-window]

4.  Açılan pencerede uygun sertifika kurulum seçeneğini belirleyin. Sertifikayı mevcut kullanıcı için veya tüm kullanıcılar için kurabilirsiniz. Uygun seçeneği belirleyip **İleri** düğmesini seçin.  

    ![Select certificate store location][img-store-location]

5.  Bir sertifika deposu seçmeniz istenecektir. “Tüm sertifikaları aşağıdaki depoya yerleştir” seçeneğini seçin ve depo olarak “Trusted Root Certification Authorities” ayarını yapın. **İleri** düğmesini seçin.

    ![Select certificate store][img-store]

    Sertifika için doğru depoyu seçtiğinizden emin olun ve **Bitir** düğmesini seçerek ithalat işlemini başlatın.
    
    ![Certificate import wizard resume][img-wizard-resume]

6.  İthal ettiğiniz sertifikanın parmak izini doğrulamanın mümkün olmadığına dair bir uyarı mesajı göreceksiniz. İthalat işlemini tamamlamak için **Evet** düğmesini seçin.

    ![Fingerprint validation warning][img-fingerprint-warning]

    İthalat başarılı olduğunda, “İthalat başarılı” bilgilendirme mesajı görüntülenecektir.

    ![Successful import of the certificate][img-import-ok]
    
7.  Sertifikanın doğru şekilde yüklendiğini kontrol edin. Bunun için HTTPS üzerinden herhangi bir siteye gidin. Güvenilmeyen sertifikaya dair uyarı mesajları olmadan sitenin HTTPS sürümüne yönlendirileceksiniz.

    Örneğin, Google Gruyere sitesinin HTTPS sürümüne göz atabilirsiniz:
    <https://google-gruyere.appspot.com>

    ![HTTPS is working][img-https-ok]