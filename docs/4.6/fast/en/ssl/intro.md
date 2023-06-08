[link-node-installation]:       install-certificate-on-fast-node.md
[link-safari-ssl]:              browsers-ssl/safari-ssl.md
[link-chrome-ssl]:              browsers-ssl/chrome-ssl.md
[link-edge-ssl]:                browsers-ssl/edge-ssl.md
[link-ie11-ssl]:                browsers-ssl/ie11-ssl.md
[link-firefox-ssl]:             browsers-ssl/firefox-ssl.md

[img-insecure-connection]:      ../../images/qsg/common/deployment/11-qsg-fast-inst-untrusted-cert.png


# Introduction

When working with a web application through a browser using HTTPS, you may see this or a similar message about an untrusted certificate:

![Mozilla Firefox's untrusted certificate message][img-insecure-connection]

The FAST node interrupts HTTPS requests from a client and initiates connection to the remote server itself. Your browser must trust the FAST node certificate, otherwise the browser will treat this situation as a man-in-the-middle attack.  

If a FAST node does not have a certificate that is trusted by the browser you are using, then attempting to send HTTPS requests to the server from that browser will result in an unsecured connection warning. 

For successful work with web applications via HTTPS you can use one of the following solutions:
*   If you have your own SSL certificate that your browser already trusts, you can [add it to the FAST node][link-node-installation].
*   If you don't have your own SSL certificate, you can add the self-signed root certificate of the FAST node to your browser. To do this, follow the instructions for your browser:
    *   [Apple Safari][link-safari-ssl]
    *   [Google Chrome][link-chrome-ssl]
    *   [Microsoft Edge][link-edge-ssl]
    *   [Microsoft Internet Explorer 11][link-ie11-ssl]
    *   [Mozilla Firefox][link-firefox-ssl]