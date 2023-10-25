[img-cert-request]:     ../../../images/fast/ssl/common/browsers-ssl/firefox-ssl/f-certificate-request.png
[img-cert-download]:    ../../../images/fast/ssl/common/browsers-ssl/firefox-ssl/f-certificate-download.png
[img-https-ok]:         ../../../images/fast/ssl/common/browsers-ssl/firefox-ssl/f-https-ok.png
    
    
#   Mozilla Firefox İçin FAST Node Kendinden İmzalı SSL Sertifikası Kurulumu

Mozilla Firefox tarayıcısı için sertifikayı kurmak için aşağıdaki adımları izleyin:

1.  Tarayıcınızın HTTP ve HTTPS proxy'si olarak FAST düğümünü kullanacak şekilde ayarladığınızdan emin olun.

2.  Tarayıcıyı kullanarak HTTP üzerinden herhangi bir alan adından `cert.der` dosyasını isteyin.

    Örneğin, aşağıdaki bağlantıları kullanabilirsiniz:
    
    * <http://wallarm.get/cert.der>
    * <http://example.com/cert.der>

    Tarayıcı, sertifika dosyasını indirecektir. Yapılandırmaya bağlı olarak, dosya ya varsayılan indirme dizinine veya seçtiğiniz dizine yerleştirilir.
    
    ![Kendinden imzalı FAST düğüm sertifikasını istemek][img-cert-request]

3.  Bir iletişim kutusu açılacaktır. Sertifikayı yüklemeniz istenecektir. Sertifikanızın adı ve geçerlilik süresi, resimde gösterilenlerden farklı olacaktır.
    
    “Bu CA'nın web sitelerini tanımlamasına güven” seçeneğini seçin ve **Tamam** düğmesini tıklayın.

    ![Sertifikayı indirme][img-cert-download]

4.  Sertifikanın doğru bir şekilde yüklendiğini kontrol edin. Bunu yapmak için, herhangi bir siteye HTTPS üzerinden gidin. Herhangi bir güvenilmeyen sertifika hakkında uyarı mesajı olmadan siteye HTTPS sürümüne yönlendirilmiş olmalısınız.

    Örneğin, Google Gruyere sitesinin HTTPS sürümüne göz atabilirsiniz:
    <https://google-gruyere.appspot.com>

    ![HTTPS çalışıyor][img-https-ok]