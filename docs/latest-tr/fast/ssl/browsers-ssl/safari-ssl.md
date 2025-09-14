[img-cert-request]:         ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-certificate-request.png
[img-downloaded-cert]:      ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-downloaded-certificate.png
[img-keychain-import]:      ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-keychain-prompt.png
[img-untrusted-cert]:       ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-keychain-untrusted-certificate.png
[img-cert-properties]:      ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-keychain-certificate-properties.png
[img-credentials-prompt]:   ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-keychain-credentials-prompt.png
[img-trusted-cert]:         ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-keychain-trusted-certificate.png
[img-https-ok]:             ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-https-ok.png

#   Apple Safari için FAST Düğümü Kendinden İmzalı SSL Sertifikası Kurulumu

Apple Safari tarayıcısı için sertifikayı kurmak üzere aşağıdakileri yapın: 

1.  Tarayıcınızı HTTP ve HTTPS proxy’si olarak FAST düğümünü kullanacak şekilde yapılandırdığınızdan emin olun.

2.  Tarayıcıyı kullanarak herhangi bir alan adından HTTP üzerinden `cert.der` dosyasını isteyin.

    Örneğin aşağıdaki bağlantılardan birini kullanabilirsiniz:

    * <http://wallarm.get/cert.der>
    * <http://example.com/cert.der>

    Tarayıcı sertifika dosyasını indirecektir. Yapılandırmaya bağlı olarak dosya varsayılan indirme dizinine veya seçtiğiniz dizine yerleştirilecektir.
    
    ![Kendinden imzalı FAST düğümü sertifikası isteniyor][img-cert-request]
    
    İndirilen dosyayı açın.

    ![İndirilen sertifika][img-downloaded-cert]

3.  Keychain Access uygulaması sertifikayı içe aktarmayı önerecektir.  

    Sertifikayı yalnızca geçerli kullanıcı için veya tüm kullanıcılar için kurabilirsiniz. Uygun seçeneği seçin ve **Add** düğmesini tıklayın.

    ![Keychain Access “Add Certificates” penceresi][img-keychain-import]

4.  İçe aktarılan sertifikanın güvenilmeyen olarak işaretlendiğini göreceksiniz. Sertifikanızın adı ve son kullanma tarihinin görseldekinden farklı olacağını unutmayın.

    ![Keychain Access uygulamasında güvenilmeyen sertifika][img-untrusted-cert]

5.  Sertifikayı güvenilir hale dönüştürmek için üzerine çift tıklayarak sertifika özellikleri penceresini açın. “Trust” listesini genişletin ve SSL için **Always Trust** seçeneğini seçin.

    ![Sertifika özellikleri penceresi][img-cert-properties]

    Devam etmek için parolanızı girmeniz istenecektir.

    ![Kimlik bilgileri istemi][img-credentials-prompt]

    Artık içe aktarılan sertifika güvenilir olarak işaretlenmiş olmalıdır.
    
    ![Keychain Access uygulamasında güvenilir sertifika][img-trusted-cert]

6.  Sertifikanın doğru şekilde kurulduğunu kontrol edin. Bunu yapmak için HTTPS üzerinden herhangi bir siteye gidin. Güvenilmeyen sertifikalarla ilgili uyarı mesajları olmadan sitenin HTTPS sürümüne yönlendirilmelisiniz.

    Örneğin, Google Gruyere sitesinin HTTPS sürümüne gidebilirsiniz:
    <https://google-gruyere.appspot.com>

    ![HTTPS çalışıyor][img-https-ok]