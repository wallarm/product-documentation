#   Installation options overview

[img-postanalytics-options]:    ../images/installation-nginx-overview/postanalytics-options.png
[img-nginx-options]:            ../images/installation-nginx-overview/nginx-options.png

[anchor-mod-overview]:              #modules-overview
[anchor-mod-installation]:          #installing-and-configuring-the-modules
[anchor-mod-inst-nginx]:            #module-for-nginx
[anchor-mod-inst-nginxplus]:        #module-for-nginx-plus
[anchor-mod-inst-postanalytics]:    #postanalytics-module

[link-ig-nginx]:                    ../installation/nginx/dynamic-module.md
[link-ig-nginx-distr]:              ../installation/nginx/dynamic-module-from-distr.md
[link-ig-nginxplus]:                ../installation/nginx-plus.md

<!-- !!!!! TO MOVE -->

The Wallarm filtering node that is used with NGINX or NGINX Plus consists of the following modules:
*   The module that connects to NGINX (NGINX Plus)
*   The postanalytics module

The modules installation and configuration order depends on the way you install NGINX or NGINX Plus.

This document contains the following sections:

*   [Modules overview][anchor-mod-overview]
*   [Links][anchor-mod-installation] to particular module installation and configuration instructions

##  Modules overview

When the filtering node is used to process requests, incoming traffic sequentially proceeds through initial processing and then processing by the Wallarm modules.

1.  The initial traffic processing is performed by the module that connects to [NGINX][anchor-mod-inst-nginx] or [NGINX Plus][anchor-mod-inst-nginxplus] that is already installed in the system.
2.  Further traffic processing is conducted by the [postanalytics module][anchor-mod-inst-postanalytics], which requires a significant amount of memory to work properly. Therefore, you can pick one of the following installation options:
    *   Installed on the same servers as NGINX/NGINX Plus (if server configurations allow this)
    *   Installed on a group of servers separate from NGINX/NGINX Plus

![!Postanalytics Module Installation Options][img-postanalytics-options]

##  Installing and configuring the modules

### Module for NGINX

!!! warning "Selecting the module to install"
    The Wallarm module installation and connection procedures depend on the NGINX installation method you are using.

The Wallarm module for NGINX can be connected by one of the following installation methods (links to instructions for each of the installation options are listed in the parenthesis):

![!Module for NGINX Installation Options][img-nginx-options]

*   Building NGINX from the source files ([instruction][link-ig-nginx])
*   Installing NGINX packages from the NGINX repository ([instruction][link-ig-nginx])
*   Installing NGINX packages from the Debian repository ([instruction][link-ig-nginx-distr])
*   Installing NGINX packages from the CentOS repository ([instruction][link-ig-nginx-distr])

### Module for NGINX Plus

[These][link-ig-nginxplus] instructions describe how to connect Wallarm to an NGINX Plus module.

### Postanalytics module

Instructions on the postanalytics module installation and configuration (either on the same server with NGINX/NGINX Plus or on a separate server) are located in the [NGINX][anchor-mod-inst-nginx] module installation and the [NGINX Plus][anchor-mod-inst-nginxplus] module installation sections.