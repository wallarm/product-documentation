#   Kurulum seçenekleri genel bakış

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

NGINX veya NGINX Plus ile kullanılan Wallarm filtreleme düğümü aşağıdaki modülleri içerir:
*   NGINX'e (NGINX Plus) bağlanan modül
*   Postanalytics modülü

Modüllerin kurulum ve yapılandırma sırası, NGINX veya NGINX Plus'ı nasıl kurduğunuza bağlıdır.

Bu belge aşağıdaki bölümleri içerir:

*   [Modül genel bakışı][anchor-mod-overview]
*   [Linkler][anchor-mod-installation] belirli modül kurulumu ve yapılandırma talimatlarına

##  Modüllerin genel bakışı

Filtreleme düğümü isteklerin işlenmesi için kullanıldığında, gelen trafiği önce başlangıç işlemi ve ardından Wallarm modülleri tarafından işlem görür.

1.  Başlangıç trafik işlemesi, sistemde zaten kurulu olan [NGINX][anchor-mod-inst-nginx] veya [NGINX Plus][anchor-mod-inst-nginxplus] 'a bağlanan modül tarafından gerçekleştirilir.
2.  Daha fazla trafik işlemesi, [postanalytics modülü][anchor-mod-inst-postanalytics] tarafından yürütülür, bu, düzgün çalışması için önemli miktarda bellek gerektirir. Bu nedenle, aşağıdaki kurulum seçeneklerinden birini seçebilirsiniz:
    *   NGINX/NGINX Plus ile aynı sunuculara yüklenmiş
    *   NGINX/NGINX Plus'tan ayrı bir grup sunucuya yüklendi

![Postanalytics Modülü Kurulum Seçenekleri][img-postanalytics-options]

##  Modüllerin kurulması ve yapılandırılması

### NGINX için Modül

!!! warning "Kurulacak modülün seçimi"
    Wallarm modülünün kurulum ve bağlantı prosedürleri, kullandığınız NGINX kurulum yöntemine bağlıdır.

NGINX için Wallarm modülü, aşağıdaki kurulum yöntemlerinden biriyle bağlanabilir (her kurulum seçeneği için talimatların bağlantıları parantez içinde listelenmiştir):

![NGINX Kurulum Seçenekleri için Modül][img-nginx-options]

*   Kaynak dosyalardan NGINX'in oluşturulması ([talimat][link-ig-nginx])
*   NGINX depo havuzuundan NGINX paketlerinin kurulması ([talimat][link-ig-nginx])
*   Debian depo havuzuundan NGINX paketlerinin kurulması ([talimat][link-ig-nginx-distr])
*   CentOS depo havuzuundan NGINX paketlerinin kurulması ([talimat][link-ig-nginx-distr])

### NGINX Plus için Modül

[Şu][link-ig-nginxplus] talimatlar, Wallarm'ın bir NGINX Plus modülüne nasıl bağlanacağını anlatır.

### Postanalytics modülü

Postanalytics modülünün kurulumu ve yapılandırılması (hem NGINX/NGINX Plus ile aynı sunucuda hem de ayrı bir sunucuda) hakkında talimatlar, [NGINX][anchor-mod-inst-nginx] modül kurulumu ve [NGINX Plus][anchor-mod-inst-nginxplus] modül kurulumu bölümlerinde bulunur.