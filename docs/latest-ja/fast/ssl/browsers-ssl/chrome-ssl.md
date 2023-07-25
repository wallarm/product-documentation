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
    
    
    
    
#   FAST Node Self-signed SSL-certificate Installation for Google Chrome

To install the certificate for the Google Chrome browser, do the following:

1.  Make sure that you have set up your browser to use the FAST node as the HTTP and HTTPS proxy.

2.  Request the file `cert.der` from any domain via HTTP using the browser.

    For example, you can use one of the following links:
    
    * <http://wallarm.get/cert.der>
    * <http://example.com/cert.der>

    The browser will download the certificate file. Depending on the configuration, the file will be either placed in the default download directory or in the directory of your choice.

    ![!Requesting the self-signed FAST node certificate][img-cert-request]

3.  Open the browser's privacy and security settings list. To do this, either navigate to the <chrome://settings/privacy> link or open the browser settings and expand the additional settings by selecting the **Advanced** button in the end of the settings list.

    ![!Chrome advanced settings][img-adv-settings]
    
    Select the “Manage certificates” option.
    
    ![!Chrome “Manage certificates” setting][img-cert-mgmt]

4.  A “Certificates” window will open, containing information about Chrome certificates. Switch to the “Trusted Root Certification Authorities” tab and select the **Import** button. 

    ![!“Certificates” window][img-cert-window]
        
    A Certificate Import Wizard should be opened. Select the **Next** button.
        
    ![!Certificate Import Wizard][img-cert-wizard]

5.  Select the **Browse** button and then choose the certificate file you downloaded earlier. 
    
    ![!Certificate file import][img-cert-import]

    Choose “All files” file type if necessary. Select the **Next** button.

    ![!Selection of the certificate file][img-cert-select]

6.  You will be asked to choose a certificate store. Select the option “Place all certificates in the following store” and set “Trusted Root Certification Authorities” as the store. Select the **Next** button.

    ![!Select certificate store][img-store]
    
    Make sure that you have selected the appropriate store for the certificate and start the import process by selecting the **Finish** button.
    
    ![!Certificate import wizard resume][img-wizard-resume]

7.  You will be presented with a warning message about the inability to validate the fingerprint of the certificate being imported. Select the **Yes** button in order to complete the import process.

    ![!Fingerprint validation warning][img-fingerprint-warning]

    Given that the import is successsful, “The import was successful” informational message will appear.

    ![!Successful import of the certificate][img-import-ok]
    
    Now you will see the imported certificate in the “Trusted Root Certification Authorities” tab of the “Certificates” window. Notice that the name and expiration date of your certificate will differ from those shown in the image.
    
    ![!Installed certificate][img-installed-cert]

8.  Check that the certificate was installed correctly. To do that, go to any site via HTTPS. You should be redirected to the HTTPS version of the site without any warning messages about untrusted certificates.

    For example, you could browse to the HTTPS version of the Google Gruyere site:
    <https://google-gruyere.appspot.com>

    ![!HTTPS is working][img-https-ok]