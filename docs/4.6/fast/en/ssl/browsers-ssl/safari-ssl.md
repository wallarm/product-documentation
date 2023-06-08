[img-cert-request]:         ../../../images/ssl/common/browsers-ssl/safari-ssl/s-certificate-request.png
[img-downloaded-cert]:      ../../../images/ssl/common/browsers-ssl/safari-ssl/s-downloaded-certificate.png
[img-keychain-import]:      ../../../images/ssl/common/browsers-ssl/safari-ssl/s-keychain-prompt.png
[img-untrusted-cert]:       ../../../images/ssl/common/browsers-ssl/safari-ssl/s-keychain-untrusted-certificate.png
[img-cert-properties]:      ../../../images/ssl/common/browsers-ssl/safari-ssl/s-keychain-certificate-properties.png
[img-credentials-prompt]:   ../../../images/ssl/common/browsers-ssl/safari-ssl/s-keychain-credentials-prompt.png
[img-trusted-cert]:         ../../../images/ssl/common/browsers-ssl/safari-ssl/s-keychain-trusted-certificate.png
[img-https-ok]:             ../../../images/ssl/common/browsers-ssl/safari-ssl/s-https-ok.png

#   FAST Node Self-signed SSL-certificate Installation for Apple Safari

To install the certificate for the Apple Safari browser, do the following: 

1.  Make sure that you have set up your browser to use the FAST node as the HTTP and HTTPS proxy.

2.  Request the file `cert.der` from any domain via HTTP using the browser.

    For example, you can use one of the following links:
    -   <http://wallarm.get/cert.der>
    -   <http://example.com/cert.der>
    <br><br>

    The browser will download the certificate file. Depending on the configuration, the file will be either placed in the default download directory or in the directory of your choice.
    
    ![Requesting the self-signed FAST node certificate][img-cert-request]
    
    Open the downloaded file.

    ![The downloaded certificate][img-downloaded-cert]

3.  The Keychain Access application will offer to import the certificate.  

    You can install the certificate either for the current user or for all users. Choose the appropriate option and select the **Add** button.

    ![Keychain Access “Add Certificates” window][img-keychain-import]

4.  You will see the imported certificate marked as an untrusted certificate. Notice that the name and expiration date of your certificate will differ from those shown in the image.

    ![Untrusted certificate in Keychain Access application][img-untrusted-cert]

5.  To convert the certificate to a trusted one, double-click on it to open the certificate properties window. Expand the “Trust” list and select **Always Trust** for SSL.

    ![The certificate properties window][img-cert-properties]

    You will be asked to enter your password to continue.

    ![Prompt for credentials][img-credentials-prompt]

    Now the imported certificate should be marked as trusted.
    
    ![Trusted certificate in Keychain Access application][img-trusted-cert]

6.  Check that the certificate was installed correctly. To do that, go to any site via HTTPS. You should be redirected to the HTTPS version of the site without any warning messages about untrusted certificates.

    For example, you could browse to the HTTPS version of the Google Gruyere site:
    <https://google-gruyere.appspot.com>

    ![HTTPS is working][img-https-ok]