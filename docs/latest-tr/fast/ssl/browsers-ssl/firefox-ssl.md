[img-cert-request]:     ../../../images/fast/ssl/common/browsers-ssl/firefox-ssl/f-certificate-request.png
[img-cert-download]:    ../../../images/fast/ssl/common/browsers-ssl/firefox-ssl/f-certificate-download.png
[img-https-ok]:         ../../../images/fast/ssl/common/browsers-ssl/firefox-ssl/f-https-ok.png
    
    
#   Mozilla Firefox için FAST Node Kendinden İmzalı SSL Sertifikası Kurulumu

Mozilla Firefox tarayıcısı için sertifikayı yüklemek üzere aşağıdakileri yapın:

1.  Tarayıcınızı HTTP ve HTTPS proxy olarak FAST node’u kullanacak şekilde yapılandırdığınızdan emin olun.

2.  Tarayıcıyı kullanarak HTTP üzerinden herhangi bir alan adından `cert.der` dosyasını isteyin.

    Örneğin, aşağıdaki bağlantılardan birini kullanabilirsiniz:
    
    * <http://wallarm.get/cert.der>
    * <http://example.com/cert.der>

    Tarayıcı sertifika dosyasını indirecektir. Yapılandırmaya bağlı olarak, dosya varsayılan indirme dizinine veya seçtiğiniz dizine yerleştirilecektir.
    
    ![Kendinden imzalı FAST node sertifikasını isteme][img-cert-request]

3.  Bir iletişim kutusu açılacaktır. Sizden sertifikayı yüklemeniz istenecektir. Sertifikanızın adı ve son kullanma tarihinin görselde gösterilenlerden farklı olacağını unutmayın.    
    
    “Web sitelerini tanımlamak için bu CA’ya güven” seçeneğini işaretleyin ve **OK** düğmesini seçin.

    ![Sertifikanın indirilmesi][img-cert-download]

4.  Sertifikanın doğru şekilde yüklendiğini kontrol edin. Bunu yapmak için, herhangi bir siteye HTTPS üzerinden gidin. Güvenilmeyen sertifikalarla ilgili uyarı mesajları olmadan sitenin HTTPS sürümüne yönlendirilmelisiniz.

    Örneğin, Google Gruyere sitesinin HTTPS sürümüne gidebilirsiniz:
    <https://google-gruyere.appspot.com>

    ![HTTPS çalışıyor][img-https-ok]