#   Kurulum seçeneklerine genel bakış

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

NGINX veya NGINX Plus ile kullanılan Wallarm filtreleme düğümü aşağıdaki modüllerden oluşur:
*   NGINX (NGINX Plus) ile bağlantı kuran modül
*   Postanalytics modülü

Modüllerin kurulum ve yapılandırma sırası, NGINX veya NGINX Plus'ı nasıl kurduğunuza bağlıdır.

Bu belge aşağıdaki bölümleri içerir:

*   [Modüllere genel bakış][anchor-mod-overview]
*   Belirli modül kurulum ve yapılandırma talimatlarına [bağlantılar][anchor-mod-installation]

##  Modüllere genel bakış

Filtreleme düğümü istekleri işlemek için kullanıldığında, gelen trafik önce ilk işlemden, ardından Wallarm modülleri tarafından gerçekleştirilen işlemden sıralı olarak geçer.

1.  İlk trafik işleme, sistemde zaten kurulu olan [NGINX][anchor-mod-inst-nginx] veya [NGINX Plus][anchor-mod-inst-nginxplus] ile bağlantı kuran modül tarafından gerçekleştirilir.
2.  Sonraki trafik işleme, düzgün çalışmak için önemli miktarda belleğe ihtiyaç duyan [postanalytics modülü][anchor-mod-inst-postanalytics] tarafından gerçekleştirilir. Bu nedenle aşağıdaki kurulum seçeneklerinden birini seçebilirsiniz:
    *   Sunucu yapılandırmaları buna izin veriyorsa NGINX/NGINX Plus ile aynı sunuculara kurulum
    *   NGINX/NGINX Plus'tan ayrı bir sunucu grubuna kurulum

![Postanalytics Modülü Kurulum Seçenekleri][img-postanalytics-options]

##  Modüllerin kurulumu ve yapılandırılması

### NGINX için modül

!!! warning "Yüklenecek modülün seçimi"
    Wallarm modülünün kurulumu ve bağlantı prosedürleri, kullandığınız NGINX kurulum yöntemine bağlıdır.

NGINX için Wallarm modülü aşağıdaki kurulum yöntemlerinden biriyle bağlanabilir (parantez içinde her kurulum seçeneğine ait talimatların bağlantıları listelenmiştir):

![NGINX için Modül Kurulum Seçenekleri][img-nginx-options]

*   NGINX'i kaynak dosyalardan derlemek ([talimat][link-ig-nginx])
*   NGINX paketlerini NGINX deposundan kurmak ([talimat][link-ig-nginx])
*   NGINX paketlerini Debian deposundan kurmak ([talimat][link-ig-nginx-distr])
*   NGINX paketlerini CentOS deposundan kurmak ([talimat][link-ig-nginx-distr])

### NGINX Plus için modül

Bu [talimatlar][link-ig-nginxplus], Wallarm'ın bir NGINX Plus modülüne nasıl bağlanacağını açıklar.

### Postanalytics modülü

Postanalytics modülünün kurulumu ve yapılandırmasına ilişkin talimatlar (NGINX/NGINX Plus ile aynı sunucuda veya ayrı bir sunucuda) [NGINX][anchor-mod-inst-nginx] modülünün kurulumu ve [NGINX Plus][anchor-mod-inst-nginxplus] modülünün kurulumu bölümlerinde yer almaktadır.