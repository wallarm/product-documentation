# Kurulum Seçenekleri Genel Bakış

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

NGINX veya NGINX Plus ile kullanılan Wallarm filtreleme düğümü, aşağıdaki modüllerden oluşur:
*   NGINX (NGINX Plus) ile bağlantıyı sağlayan modül
*   postanalytics modülü

Modüllerin kurulumu ve yapılandırma sırası, NGINX veya NGINX Plus kurulum yöntemine bağlıdır.

Bu doküman aşağıdaki bölümleri içerir:

*   [Modüllerin Genel Bakışı][anchor-mod-overview]
*   [Kurulum ve Yapılandırma Talimatlarına Bağlantılar][anchor-mod-installation]

## Modüllerin Genel Bakışı

Filtreleme düğümü istekleri işlemek için kullanıldığında, gelen trafik sırasıyla ilk işleme tabi tutulur ve ardından Wallarm modülleri tarafından işlenir.

1.  İlk trafik işleme, sistemde halihazırda kurulu olan [NGINX][anchor-mod-inst-nginx] veya [NGINX Plus][anchor-mod-inst-nginxplus] ile bağlantı sağlayan modül tarafından gerçekleştirilir.
2.  Daha sonraki trafik işleme, düzgün çalışması için önemli miktarda bellek gerektiren [postanalytics modülü][anchor-mod-inst-postanalytics] tarafından yapılır. Bu nedenle, aşağıdaki kurulum seçeneklerinden birini tercih edebilirsiniz:
    *   NGINX/NGINX Plus ile aynı sunucularda kurulum (sunucu yapılandırmaları buna izin veriyorsa)
    *   NGINX/NGINX Plus'dan ayrı bir sunucu grubuna kurulum

![Postanalytics Module Installation Options][img-postanalytics-options]

## Modüllerin Kurulumu ve Yapılandırılması

### NGINX için Modül

!!! warning "Yüklenecek modülü seçme"
    Wallarm modülünün kurulumu ve bağlantı prosedürleri, kullandığınız NGINX kurulum yöntemine bağlıdır.

NGINX için Wallarm modülü, aşağıdaki kurulum yöntemlerinden biriyle bağlanabilir (her kurulum seçeneği için talimatlara bağlantılar parantez içinde listelenmiştir):

![Module for NGINX Installation Options][img-nginx-options]

*   Kaynak dosyalardan NGINX derlemek ([instruction][link-ig-nginx])
*   NGINX deposundan NGINX paketlerini yüklemek ([instruction][link-ig-nginx])
*   Debian deposundan NGINX paketlerini yüklemek ([instruction][link-ig-nginx-distr])
*   CentOS deposundan NGINX paketlerini yüklemek ([instruction][link-ig-nginx-distr])

### NGINX Plus için Modül

[Bunlar][link-ig-nginxplus] Wallarm'ın NGINX Plus modülüne nasıl bağlanacağını açıklayan talimatlardır.

### postanalytics modülü

postanalytics modülünün kurulumu ve yapılandırmasıyla ilgili talimatlar (NGINX/NGINX Plus ile aynı sunucuda veya ayrı bir sunucuda) [NGINX][anchor-mod-inst-nginx] modül kurulumu ve [NGINX Plus][anchor-mod-inst-nginxplus] modül kurulumu bölümlerinde yer almaktadır.