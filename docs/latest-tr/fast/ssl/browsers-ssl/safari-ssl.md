[img-cert-request]:         ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-certificate-request.png
[img-downloaded-cert]:      ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-downloaded-certificate.png
[img-keychain-import]:      ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-keychain-prompt.png
[img-untrusted-cert]:       ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-keychain-untrusted-certificate.png
[img-cert-properties]:      ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-keychain-certificate-properties.png
[img-credentials-prompt]:   ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-keychain-credentials-prompt.png
[img-trusted-cert]:         ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-keychain-trusted-certificate.png
[img-https-ok]:             ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-https-ok.png

#   Apple Safari için FAST Node Kendi İmzalı SSL-Sertifikası Kurulumu

Apple Safari tarayıcısı için sertifikayı kurmak için şu adımları izleyin:

1.  Tarayıcınızın HTTP ve HTTPS proxy'si olarak FAST düğümünü kullanacak şekilde ayarlandığından emin olun.

2.  Tarayıcıyı kullanarak herhangi bir alandan `cert.der` dosyasını HTTP üzerinden talep edin.

    Örneğin, aşağıdaki bağlantılardan birini kullanabilirsiniz:

    * <http://wallarm.get/cert.der>
    * <http://example.com/cert.der>

    Tarayıcı, sertifika dosyasını indirecektir. Yapılandırmaya bağlı olarak, dosya ya varsayılan indirme dizinine ya da tercih ettiğiniz bir dizine yerleştirilecektir.
    
    ![Kendi imzalı FAST düğüm sertifikası talep ediliyor][img-cert-request]
    
    İndirilen dosyayı açın.

    ![İndirilen sertifika][img-downloaded-cert]

3.  Anahtar Zinciri Erişim uygulaması, sertifikanın içe aktarılmasını teklif eder.

    Sertifikayı mevcut kullanıcı için veya tüm kullanıcılar için kurabilirsiniz. Uygun olanı seçin ve **Ekle** butonunu seçin.

    ![Anahtar Zinciri Erişimi "Sertifikaları Ekle" penceresi][img-keychain-import]

4.  İçe aktarılan sertifikayı, güvenilmeyen bir sertifika olarak işaretlenmiş olarak göreceksiniz. Sertifikanızın adı ve son kullanma tarihi, resimde gösterilenlerden farklı olacaktır.

    ![Anahtar Zinciri Erişim uygulamasındaki güvenilmeyen sertifika][img-untrusted-cert]

5.  Sertifikayı güvenilir olarak dönüştürmek için, sertifika özellikleri penceresini açmak için çift tıklayın. "Güven" listesini genişletin ve SSL için **Her Zaman Güven**i seçin.

    ![Sertifika özellikleri penceresi][img-cert-properties]

    Devam etmek için şifrenizi girmeniz istenecektir.

    ![Kimlik bilgileri için istem][img-credentials-prompt]

    Artık içe aktarılan sertifikanın güvendiği olarak işaretlenmiş olmalıdır.
    
    ![Anahtar Zinciri Erişim uygulamasındaki güvenilir sertifika][img-trusted-cert]

6.  Sertifikanın doğru bir şekilde kurulduğunu kontrol edin. Bunun için, herhangi bir siteye HTTPS üzerinden gidin. Herhangi bir güvenilmeyen sertifikalar hakkında uyarı mesajı olmaksızın siteye HTTPS sürümüne yönlendirilmeniz gerekir.

    Örneğin, Google Gruyere sitesinin HTTPS sürümüne göz atabilirsiniz:
    <https://google-gruyere.appspot.com>

    ![HTTPS çalışıyor][img-https-ok]