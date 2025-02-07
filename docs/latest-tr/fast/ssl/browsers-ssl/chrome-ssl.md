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
    
    
#   Google Chrome için FAST Node Self-signed SSL-certificate Kurulumu

Google Chrome tarayıcısı için sertifikayı yüklemek amacıyla, aşağıdaki adımları izleyin:

1.  Tarayıcınızın, HTTP ve HTTPS proxy olarak FAST node'u kullanacak şekilde yapılandırıldığından emin olun.

2.  Tarayıcı kullanarak herhangi bir domainden HTTP üzerinden `cert.der` dosyasını isteyin.

    Örneğin, aşağıdaki bağlantılardan birini kullanabilirsiniz:
    
    * <http://wallarm.get/cert.der>
    * <http://example.com/cert.der>

    Tarayıcı, sertifika dosyasını indirecektir. Yapılandırmaya bağlı olarak, dosya ya varsayılan indirme dizinine ya da seçtiğiniz dizine yerleştirilecektir.

    ![Kendi kendine imzalanmış FAST node sertifikasının istenmesi][img-cert-request]

3.  Tarayıcının gizlilik ve güvenlik ayarları listesini açın. Bunu yapmak için, ya <chrome://settings/privacy> bağlantısına gidin ya da tarayıcı ayarlarını açıp listenin sonunda bulunan **Advanced** düğmesine tıklayarak ek ayarları genişletin.

    ![Chrome advanced settings][img-adv-settings]
    
    “Manage certificates” seçeneğini seçin.
    
    ![Chrome “Manage certificates” ayarı][img-cert-mgmt]

4.  Chrome sertifikaları hakkında bilgileri içeren bir “Certificates” penceresi açılacaktır. “Trusted Root Certification Authorities” sekmesine geçin ve **Import** düğmesini seçin. 

    ![“Certificates” penceresi][img-cert-window]
        
    Bir Sertifika İçe Aktarma Sihirbazı açılmalıdır. **Next** düğmesini seçin.
        
    ![Sertifika İçe Aktarma Sihirbazı][img-cert-wizard]

5.  **Browse** düğmesini seçin ve ardından daha önce indirdiğiniz sertifika dosyasını seçin. 
    
    ![Certificate file import][img-cert-import]

    Gerekirse “All files” dosya türünü seçin. **Next** düğmesini tıklayın.

    ![Selection of the certificate file][img-cert-select]

6.  Bir sertifika deposu seçmeniz istenecek. "Place all certificates in the following store" seçeneğini seçin ve depo olarak "Trusted Root Certification Authorities" ayarlayın. **Next** düğmesine tıklayın.

    ![Select certificate store][img-store]
    
    Sertifika için uygun deponun seçildiğinden emin olun ve **Finish** düğmesine tıklayarak içe aktarma işlemini başlatın.
    
    ![Certificate import wizard resume][img-wizard-resume]

7.  İçe aktarılan sertifikanın parmak izinin doğrulanamadığına dair bir uyarı mesajı gösterilecektir. İçe aktarma işlemini tamamlamak için **Yes** düğmesini seçin.

    ![Fingerprint validation warning][img-fingerprint-warning]

    İçe aktarma başarılı olduğunda, “The import was successful” bilgi mesajı görünecektir.

    ![Successful import of the certificate][img-import-ok]
    
    Artık “Certificates” penceresinin “Trusted Root Certification Authorities” sekmesinde içe aktarılan sertifikayı göreceksiniz. Sertifikanızın adı ve son kullanma tarihinin resimde gösterilenden farklı olabileceğini unutmayın.
    
    ![Installed certificate][img-installed-cert]

8.  Sertifikanın doğru şekilde yüklendiğini kontrol edin. Bunu yapmak için, herhangi bir siteye HTTPS üzerinden gidin. Siteye, güvenilmeyen sertifikalarla ilgili herhangi bir uyarı mesajı olmadan, HTTPS sürümüne yönlendirilmelisiniz.

    Örneğin, Google Gruyere sitesinin HTTPS sürümüne gidebilirsiniz:
    <https://google-gruyere.appspot.com>

    ![HTTPS çalışıyor][img-https-ok]