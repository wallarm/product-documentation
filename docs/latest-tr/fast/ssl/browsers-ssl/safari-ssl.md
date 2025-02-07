[img-cert-request]:         ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-certificate-request.png
[img-downloaded-cert]:      ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-downloaded-certificate.png
[img-keychain-import]:      ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-keychain-prompt.png
[img-untrusted-cert]:       ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-keychain-untrusted-certificate.png
[img-cert-properties]:      ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-keychain-certificate-properties.png
[img-credentials-prompt]:   ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-keychain-credentials-prompt.png
[img-trusted-cert]:         ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-keychain-trusted-certificate.png
[img-https-ok]:             ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-https-ok.png

#   Apple Safari için FAST Node Self-signed SSL Sertifikası Kurulumu

Apple Safari tarayıcısına sertifika yüklemek için aşağıdaki adımları izleyin:

1.  Tarayıcınızın HTTP ve HTTPS proxy olarak FAST node'u kullanacak şekilde yapılandırıldığından emin olun.

2.  Tarayıcı üzerinden HTTP kullanarak herhangi bir domain'den `cert.der` dosyasını isteyin.

    Örneğin, aşağıdaki bağlantılardan birini kullanabilirsiniz:

    * <http://wallarm.get/cert.der>
    * <http://example.com/cert.der>

    Tarayıcı, sertifika dosyasını indirecektir. Yapılandırmaya bağlı olarak, dosya varsayılan indirme dizinine veya seçtiğiniz dizine kaydedilecektir.
    
    ![Requesting the self-signed FAST node certificate][img-cert-request]
    
    İndirilen dosyayı açın.

    ![The downloaded certificate][img-downloaded-cert]

3.  Keychain Access uygulaması sertifikayı içe aktarmayı teklif edecektir.

    Sertifikayı mevcut kullanıcı için veya tüm kullanıcılar için yükleyebilirsiniz. Uygun seçeneği seçin ve **Add** butonuna tıklayın.

    ![Keychain Access “Add Certificates” window][img-keychain-import]

4.  İçe aktarılan sertifikayı güvenilmeyen bir sertifika olarak göreceksiniz. Sertifikanızın adı ve son kullanma tarihi, resimde gösterilenden farklı olabilir.

    ![Untrusted certificate in Keychain Access application][img-untrusted-cert]

5.  Sertifikayı güvenilir hale getirmek için, sertifikaya çift tıklayarak sertifika özellikleri penceresini açın. “Trust” listesini genişletin ve SSL için **Always Trust** seçeneğini belirleyin.

    ![The certificate properties window][img-cert-properties]

    İşleme devam edebilmek için şifrenizi girmeniz istenecektir.

    ![Prompt for credentials][img-credentials-prompt]

    Artık içe aktarılan sertifika güvenilir olarak işaretlenmiş olmalıdır.
    
    ![Trusted certificate in Keychain Access application][img-trusted-cert]

6.  Sertifikanın doğru şekilde yüklendiğini kontrol edin. Bunu yapmak için, herhangi bir HTTPS sitesine gidin. Güvenilmeyen sertifikalarla ilgili herhangi bir uyarı mesajı olmaksızın sitenin HTTPS sürümüne yönlendirilmelisiniz.

    Örneğin, Google Gruyere sitesinin HTTPS sürümüne göz atabilirsiniz:
    <https://google-gruyere.appspot.com>

    ![HTTPS is working][img-https-ok]