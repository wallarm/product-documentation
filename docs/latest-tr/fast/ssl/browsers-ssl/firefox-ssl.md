[img-cert-request]:     ../../../images/fast/ssl/common/browsers-ssl/firefox-ssl/f-certificate-request.png
[img-cert-download]:    ../../../images/fast/ssl/common/browsers-ssl/firefox-ssl/f-certificate-download.png
[img-https-ok]:         ../../../images/fast/ssl/common/browsers-ssl/firefox-ssl/f-https-ok.png
    
    
#   Mozilla Firefox için FAST Node Kendi İmzalı SSL Sertifikası Kurulumu

Mozilla Firefox tarayıcısı için sertifikayı yüklemek amacıyla şu adımları izleyin:

1.  Tarayıcınızın FAST node'u HTTP ve HTTPS proxy olarak kullanacak şekilde yapılandırıldığından emin olun.

2.  Tarayıcınızla HTTP üzerinden herhangi bir alandan `cert.der` dosyasını isteyin.

    Örneğin, aşağıdaki bağlantılardan birini kullanabilirsiniz:
    
    * <http://wallarm.get/cert.der>
    * <http://example.com/cert.der>

    Tarayıcı, sertifika dosyasını indirecektir. Yapılandırmaya bağlı olarak dosya, varsayılan indirme dizinine veya tercihinize bağlı olarak seçtiğiniz dizine kaydedilecektir.
    
    ![Sertifika isteği][img-cert-request]

3.  Bir iletişim penceresi açılacaktır. Sertifikayı yüklemeniz istenecek. Sertifikanızın adı ve son kullanma tarihi, resimde gösterilenden farklı olabilir.    
    
    “Web sitelerini tanımlamak için bu CA'ya güven” seçeneğini seçin ve **OK** düğmesine tıklayın.

    ![Sertifikanın indirilmesi][img-cert-download]

4.  Sertifikanın doğru şekilde yüklendiğini kontrol edin. Bunu yapmak için, HTTPS üzerinden herhangi bir siteye gidin. Güvenilmeyen sertifikalarla ilgili uyarı mesajı almadan sitenin HTTPS sürümüne yönlendirilmiş olmalısınız.

    Örneğin, Google Gruyere sitesinin HTTPS sürümünü ziyaret edebilirsiniz:
    <https://google-gruyere.appspot.com>

    ![HTTPS çalışıyor][img-https-ok]