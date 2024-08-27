[link-points]:              ../points/intro.md
[link-mod-extension]:       mod-extension.md
[link-non-mod-extension]:   non-mod-extension.md
[link-app-examination]:     app-examination.md
[link-juice-shop]:          https://www.owasp.org/index.php/OWASP_Juice_Shop_Project
[link-juice-shop-deploy]:   https://github.com/bkimminich/juice-shop#setup
[link-juice-shop-docs]:     https://pwning.owasp-juice.shop/companion-guide/latest/
[link-using-extension]:     ../using-extension.md


#   Examples of the FAST Extensions: Overview

The vulnerable web application [OWASP Juice Shop][link-juice-shop] will be used to demonstrate the capabilities of the FAST extension mechanism.

This application can be [deployed][link-juice-shop-deploy] in multiple ways (for example, using Docker, Node.JS, or Vagrant).

To see the OWASP Juice Shop documentation that lists the vulnerabilities embedded into it, proceed to the following [link][link-juice-shop-docs].

!!! warning "Working with a vulnerable application"
    We suggest you avoid providing the host that the OWASP Juice Shop runs on with internet access or real data (for example, login/password pairs).

To test the “OWASP Juice Shop” target application for vulnerabilities, take the following steps:

1.  [Examine the web application][link-app-examination] to become familiar with its behavior.
2.  [Craft a sample modifying extension.][link-mod-extension]
3.  [Craft a sample nonmodifying extension.][link-non-mod-extension]
4.  [Use the created extensions.][link-using-extension]

!!! info "Request elements description syntax"
    When creating a FAST extension, you need to understand the structure of the HTTP request sent to the application and that of the HTTP response received from the application in order to correctly describe the request elements that you need to work with using the points.
    
    To see detailed information, proceed to this [link][link-points].
