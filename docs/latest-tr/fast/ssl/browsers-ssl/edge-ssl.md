[img-cert-request]:         ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-certificate-request.png
[img-cert-window]:          ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-certificate-window.png
[img-store-location]:       ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-store-location.png
[img-store]:                ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-store-selection.png
[img-wizard-resume]:        ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-wizard-resume.png
[img-fingerprint-warning]:  ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-fingerprint-warning.png
[img-import-ok]:            ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-import-success.png
[img-https-ok]:             ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-https-ok.png
    
    
#   Microsoft Edge için FAST Node Self-signed SSL-certificate Kurulumu

Microsoft Edge tarayıcısı için sertifikayı yüklemek amacıyla aşağıdaki adımları izleyin:

1.  Tarayıcınızın FAST node'u HTTP ve HTTPS proxy olarak kullanacak şekilde yapılandırıldığından emin olun.

2.  Tarayıcınızı kullanarak herhangi bir alandan HTTP üzerinden `cert.der` dosyasını isteyin.

    Örneğin, aşağıdaki bağlantılardan birini kullanabilirsiniz:
    
    * <http://wallarm.get/cert.der>
    * <http://example.com/cert.der> 

    Tarayıcı, sertifika dosyasını açma veya kaydetme seçeneği sunacaktır. **Open** düğmesini seçin.

    ![Requesting the self-signed FAST node certificate][img-cert-request]

3.  Sertifika bilgilerini içeren bir pencere açılacaktır. Sertifikanızın adı ve son kullanma tarihinin resimde gösterilenden farklı olabileceğini unutmayın. **Install Certificate** düğmesini seçin.

    ![“Certificate” window][img-cert-window]

4.  Açılan pencerede uygun sertifika kurulum seçeneğini belirleyin. Sertifikayı mevcut kullanıcı için veya tüm kullanıcılar için yükleyebilirsiniz. Uygun seçeneği belirleyip **Next** düğmesini seçin.

    ![Select certificate store location][img-store-location]

5.  Bir sertifika deposu seçmeniz istenecektir. “Place all certificates in the following store” seçeneğini seçin ve depo olarak “Trusted Root Certification Authorities” ayarlayın. **Next** düğmesini seçin.    
    ![Select certificate store][img-store]

    Sertifika için uygun deponun seçildiğinden emin olun ve içe aktarma işlemini başlatmak için **Finish** düğmesini tıklayın.
    
    ![Certificate import wizard resume][img-wizard-resume]

6.  İçe aktarılan sertifikanın parmak izini doğrulamada başarısız olunduğuna dair bir uyarı mesajı görünecektir. İçe aktarma işlemini tamamlamak için **Yes** düğmesini seçin.

    ![Fingerprint validation warning][img-fingerprint-warning]

    İçe aktarma başarılı olduğunda “The import was successful” bilgi mesajı görüntülenecektir.

    ![Successful import of the certificate][img-import-ok]

7.  Sertifikanın doğru şekilde yüklendiğini kontrol edin. Bunun için herhangi bir siteye HTTPS üzerinden gidin. Güvenilmeyen sertifikalara dair uyarı mesajı olmaksızın sitenin HTTPS sürümüne yönlendirilebilmelisiniz.

    Örneğin, Google Gruyere sitesinin HTTPS sürümüne gidebilirsiniz:
    <https://google-gruyere.appspot.com>

    ![HTTPS is working][img-https-ok]