[img-cert-request]:         ../../../images/ssl/common/browsers-ssl/ie11-ssl/i-certificate-request.png
[img-cert-window]:          ../../../images/ssl/common/browsers-ssl/ie11-ssl/i-certificate-window.png
[img-store-location]:       ../../../images/ssl/common/browsers-ssl/ie11-ssl/i-store-location.png
[img-store]:                ../../../images/ssl/common/browsers-ssl/ie11-ssl/i-store-selection.png
[img-wizard-resume]:        ../../../images/ssl/common/browsers-ssl/ie11-ssl/i-wizard-resume.png
[img-fingerprint-warning]:  ../../../images/ssl/common/browsers-ssl/ie11-ssl/i-fingerprint-warning.png
[img-import-ok]:            ../../../images/ssl/common/browsers-ssl/ie11-ssl/i-import-success.png
[img-https-ok]:             ../../../images/ssl/common/browsers-ssl/ie11-ssl/i-https-ok.png
        
    
#   FAST Node Self-signed SSL-certificate Installation for Microsoft Internet Explorer 11

To install the certificate for the Internet Explorer 11 browser, do the following:

1.  Make sure that you have set up your browser to use the FAST node as the HTTP and HTTPS proxy.

2.  Request the file `cert.der` from any domain via HTTP using the browser.
    
    For example, you can use one of the following links:
    -   <http://wallarm.get/cert.der>
    -   <http://example.com/cert.der>
    <br><br>

    The browser will give you the choice to open the certificate file or to save it. Select the **Open** button.

    ![Requesting the self-signed FAST node certificate][img-cert-request]

3.  A window will open containing information about the certificate. Notice that the name and expiration date of your certificate will differ from those shown in the image. Select the **Install Certificate** button.

    ![“Certificate” window][img-cert-window]

4.  Select the suitable certificate installation option in the opened window. You can install the certificate either for the current user or for all users. Choose the appropriate option and select the **Next** button.  

    ![Select certificate store location][img-store-location]

5.  You will be asked to choose a certificate store. Select the option “Place all certificates in the following store” and set “Trusted Root Certification Authorities” as the store. Select the **Next** button.

    ![Select certificate store][img-store]

    Make sure that you have selected the appropriate store for the certificate and start the import process by selecting the **Finish** button.
    
    ![Certificate import wizard resume][img-wizard-resume]

6.  You will be presented with a warning message about the inability to validate the fingerprint of the certificate being imported. Select the **Yes** button in order to complete the import process.

    ![Fingerprint validation warning][img-fingerprint-warning]

    Given that the import is successsful, “The import was successful” informational message will appear.

    ![Successful import of the certificate][img-import-ok]
    
7.  Check that the certificate was installed correctly. To do that, go to any site via HTTPS. You should be redirected to the HTTPS version of the site without any warning messages about untrusted certificate.

    For example, you could browse to the HTTPS version of the Google Gruyere site:
    <https://google-gruyere.appspot.com>

    ![HTTPS is working][img-https-ok]