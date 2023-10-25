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
    
    
    
#   Google Chrome için FAST Node Öz İmzalı SSL Sertifikasının Kurulumu

Google Chrome tarayıcısı için sertifikayı kurmak için aşağıdaki adımları izleyin:

1.  Tarayıcınızın HTTP ve HTTPS proxy olarak FAST node'u kullanmaya ayarlandığından emin olun.

2.  `cert.der` dosyasını herhangi bir alan adından HTTP kullanarak tarayıcınızla isteyin.

    Örneğin, aşağıdaki linklerden birini kullanabilirsiniz:
    
    * <http://wallarm.get/cert.der>
    * <http://example.com/cert.der>

    Tarayıcı sertifika dosyasını indirecektir. Konfigürasyona bağlı olarak, dosya ya varsayılan indirme dizinine yerleştirilir veya sizin tercih ettiğiniz bir dizinde olacaktır.

    ![Öz imzalı FAST node sertifikasını talep etme][img-cert-request]

3.  Tarayıcının gizlilik ve güvenlik ayarlarını açın. Bunu yapmak için ya <chrome://settings/privacy> linkine gidin ya da tarayıcı ayarlarını açıp **Advanced (İleri)** butonunu seçerek ek ayarları genişletin.

    ![Chrome gelişmiş ayarlar][img-adv-settings]
    
    “Manage certificates (Sertifikaları Yönet)” seçeneğini seçin.
    
    ![Chrome “Sertifikaları Yönet” ayarı][img-cert-mgmt]

4.  Chrome sertifikalarına dair bilgilerin bulunduğu “Certificates (Sertifikalar)” penceresi açılır. "Trusted Root Certification Authorities (Güvenilen Kök Sertifika Otoritelerı)" sekmesine geçin ve **Import (İçe Aktar)** butonunu seçin. 

    ![“Sertifikalar” penceresi][img-cert-window]
        
    Bir Sertifika İçe Aktarma Sihirbazı açılır. **Next (İleri)** butonunu seçin.
        
    ![Sertifika İçe Aktarma Sihirbazı][img-cert-wizard]

5.  **Browse (Göz At)** butonunu seçin ve daha önce indirdiğiniz sertifika dosyasını seçin. 
    
    ![Sertifika dosyasını içe aktarma][img-cert-import]

    Gerekirse “All files (Tüm dosyalar)” dosya türünü seçin. **Next (İleri)** butonunu seçin.

    ![Sertifika dosyasını seçme][img-cert-select]

6.  Bir sertifika deposunu seçmeniz istenecektir. “Place all certificates in the following store (Tüm sertifikaları aşağıdaki depoda yerleştir)” seçeneğini seçin ve depo olarak "Trusted Root Certification Authorities (Güvenilen Kök Sertifika Otoritelerı)" seçeneğini belirtin. **Next (İleri)** butonunu seçin.

    ![Sertifika deposunu seçme][img-store]
    
    Sertifika için uygun depoyu seçtiğinize emin olun ve **Finish (Bitir)** butonunu seçerek içe aktarılan işlemi başlatın.
    
    ![Sertifika içe aktarma sihirbazı özeti][img-wizard-resume]

7.  İçe aktarılacak sertifikanın parmak izinin doğrulanamaması hakkında bir uyarı mesajı alırsınız. İçe aktarma işlemini tamamlamak için **Yes (Evet)** butonunu seçin.

    ![Parmak izi doğrulama uyarısı][img-fingerprint-warning]

    İçe aktarım işlemi başarılı olursa, "The import was successful (İçe aktarma başarılı oldu)" bilgilendirme mesajı görünecektir.

    ![Başarılı sertifika içe aktarma][img-import-ok]
    
    Şimdi "Trusted Root Certification Authorities (Güvenilen Kök Sertifika Otoritelerı)" sekmesinde içe aktarılan sertifikayı görebilirsiniz. Sertifikanın adı ve son kullanma tarihi görselde gösterilenden farklı olacaktır.
    
    ![İçe aktarılan sertifika][img-installed-cert]

8.  Sertifikanın düzgün bir şekilde yüklendiğini kontrol edin. Bunun için, herhangi bir siteye HTTPS üzerinden gidin. Herhangi bir güvenilmeyen sertifika hakkında uyarı mesajı olmaksızın siteye HTTPS sürümüne yönlendirilmeniz gerekir.

    Örneğin, Google Gruyere sitesinin HTTPS sürümüne göz atabilirsiniz:
    <https://google-gruyere.appspot.com>

    ![HTTPS çalışıyor][img-https-ok]