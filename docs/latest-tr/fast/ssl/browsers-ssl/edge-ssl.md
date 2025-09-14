[img-cert-request]:         ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-certificate-request.png
[img-cert-window]:          ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-certificate-window.png
[img-store-location]:       ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-store-location.png
[img-store]:                ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-store-selection.png
[img-wizard-resume]:        ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-wizard-resume.png
[img-fingerprint-warning]:  ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-fingerprint-warning.png
[img-import-ok]:            ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-import-success.png
[img-https-ok]:             ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-https-ok.png
    
    
#   Microsoft Edge için FAST Node Kendi İmzalı SSL Sertifikasının Kurulumu

Microsoft Edge tarayıcısına sertifikayı kurmak için aşağıdakileri yapın:

1.  Tarayıcınızı, HTTP ve HTTPS proxy'si olarak FAST node'u kullanacak şekilde yapılandırdığınızdan emin olun.

2.  Tarayıcıyı kullanarak, HTTP üzerinden herhangi bir alan adından `cert.der` dosyasını isteyin.

    Örneğin, aşağıdaki bağlantılardan birini kullanabilirsiniz:
    
    * <http://wallarm.get/cert.der>
    * <http://example.com/cert.der> 

    Tarayıcı size sertifika dosyasını açma veya kaydetme seçeneklerini sunacaktır. **Aç** düğmesini seçin.

    ![Kendi imzalı FAST node sertifikasının istenmesi][img-cert-request]

3.  Sertifikaya ilişkin bilgileri içeren bir pencere açılacaktır. Sertifikanızın adı ve sona erme tarihinin görseldekinden farklı olacağını unutmayın. **Sertifika Yükle** düğmesini seçin.

    ![“Sertifika” penceresi][img-cert-window]

4.  Açılan pencerede uygun sertifika yükleme seçeneğini belirleyin. Sertifikayı mevcut kullanıcı için veya tüm kullanıcılar için yükleyebilirsiniz. Uygun seçeneği seçin ve **İleri** düğmesini tıklayın.

    ![Sertifika deposu konumunu seçin][img-store-location]

5.  Bir sertifika deposu seçmeniz istenecektir. “Tüm sertifikaları aşağıdaki depoya yerleştir” seçeneğini işaretleyin ve depo olarak “Trusted Root Certification Authorities” öğesini ayarlayın. **İleri** düğmesini seçin.    
    ![Sertifika deposunu seçin][img-store]

    Sertifika için uygun depoyu seçtiğinizden emin olun ve **Bitir** düğmesini seçerek içe aktarma işlemini başlatın.
    
    ![Sertifika içe aktarma sihirbazı özeti][img-wizard-resume]

6.  İçe aktarılan sertifikanın parmak izinin doğrulanamaması hakkında bir uyarı mesajı göreceksiniz. İçe aktarma işlemini tamamlamak için **Evet** düğmesini seçin.

    ![Parmak izi doğrulama uyarısı][img-fingerprint-warning]

    İçe aktarma başarılı olduğunda, “The import was successful” bilgi mesajı görünecektir.

    ![Sertifikanın başarıyla içe aktarılması][img-import-ok]

7.  Sertifikanın doğru şekilde kurulup kurulmadığını kontrol edin. Bunu yapmak için herhangi bir siteye HTTPS üzerinden gidin. Güvenilmeyen sertifikalarla ilgili uyarı mesajları olmadan sitenin HTTPS sürümüne yönlendirilmelisiniz.

    Örneğin, Google Gruyere sitesinin HTTPS sürümüne gidebilirsiniz:
    <https://google-gruyere.appspot.com>

    ![HTTPS çalışıyor][img-https-ok]