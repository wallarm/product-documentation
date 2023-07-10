[img-cert-request]:     ../../../images/fast/ssl/common/browsers-ssl/firefox-ssl/f-certificate-request.png
[img-cert-download]:    ../../../images/fast/ssl/common/browsers-ssl/firefox-ssl/f-certificate-download.png
[img-https-ok]:         ../../../images/fast/ssl/common/browsers-ssl/firefox-ssl/f-https-ok.png
    
    
#   FAST Node Self-signed SSL-certificate Installation for Mozilla Firefox

To install the certificate for the Mozilla Firefox browser, do the following:

1.  Make sure that you have set up your browser to use the FAST node as the HTTP and HTTPS proxy.

2.  Request the file `cert.der` from any domain via HTTP using the browser.

    For example, you can use one of the following links:
    
    * <http://wallarm.get/cert.der>
    * <http://example.com/cert.der>

    The browser will download the certificate file. Depending on the configuration, the file will be either placed in the default download directory or in the directory of your choice.
    
    ![!Requesting the self-signed FAST node certificate][img-cert-request]

3.  A dialog window will open. You will be asked to install the certificate. Notice that the name and expiration date of your certificate will differ from those shown in the image.    
    
    Choose the “Trust this CA to identify websites” option and select the **OK** button.

    ![!Downloading the certificate][img-cert-download]

4.  Check that the certificate was installed correctly. To do that, go to any site via HTTPS. You should be redirected to the HTTPS version of the site without any warning messages about untrusted certificates.

    For example, you could browse to the HTTPS version of the Google Gruyere site:
    <https://google-gruyere.appspot.com>

    ![!HTTPS is working][img-https-ok]