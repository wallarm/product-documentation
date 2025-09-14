[statistics-service-all-parameters]:        ../admin-en/configure-statistics-service.md
[img-attacks-in-interface]:                 ../images/admin-guides/test-attacks-quickstart.png
[configure-proxy-balancer-instr]:           ../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[ptrav-attack-docs]:                        ../attacks-vulns-list.md#path-traversal

# All-in-One Yükleyici ile Wallarm NGINX Node'unu Yükseltme

Bu talimatlar, [all‑in‑one installer](../installation/nginx/all-in-one.md) kullanılarak kurulan Wallarm node'unu en son 6.x sürümüne yükseltme adımlarını açıklar.

!!! info "Wallarm servislerinin yeniden kurulması gereklidir"
    Güvenli bir yükseltme prosedürü için, yeni Node'u yeni bir makineye kurun, trafiği yeni makineye yönlendirin ve ardından eskiyi kaldırın.
    
    Alternatif olarak, mevcut makinenizdeki servisleri durdurup kaldırabilir ve ardından node'u yeniden kurabilirsiniz. Ancak bu, önerilmeyen bazı kesinti sürelerine neden olabilir.

    Bu makale en güvenli geçiş yöntemini açıklar.

## Adım 1: Yeni node sürümünü temiz bir makineye kurun

1. 5.x veya daha eski bir sürümden yükseltiyor ve postanalytics modülü ayrı kurulmuşsa, mevcut yapılandırmalarınızı [postanalytics için Tarantool’un wstore ile değiştirilmesi](what-is-new.md#replacing-tarantool-with-wstore-for-postanalytics) doğrultusunda kopyalayıp güncelleyin:

    * Filtreleme node'u makinesinde, `/etc/nginx/nginx.conf` dosyasının `http` bloğunda `wallarm_tarantool_upstream` ögesini [`wallarm_wstore_upstream`](../admin-en/configure-parameters-en.md#wallarm_wstore_upstream) olarak yeniden adlandırın.
    * Postanalytics makinesinde (özel bir host ve port kullanıyorsanız), `/opt/wallarm/etc/wallarm/node.yaml` içinde `tarantool` bölümünü `wstore` olarak yeniden adlandırın.
1. Node’un en yeni sürümünü, NGINX’in en güncel sürümüyle birlikte, **yeni bir makineye** aşağıdaki kılavuzlardan birini izleyerek kurun. Kılavuz, makine için gereksinimleri de kapsar.

    * [Filtreleme ve postanalytics modülleri aynı sunucuda](../installation/nginx/all-in-one.md) - önceki yapılandırma dosyalarınızı aktarabilir ve yeniden kullanabilirsiniz.
    * [Filtreleme ve postanalytics modülleri farklı sunucularda](../admin-en/installation-postanalytics-en.md) - 1. adımda güncellenen yapılandırma dosyalarını kullanın.
1. Trafiği yeni node’un işlemesi için yeni makineye yönlendirin.

## Adım 2: Eski node’u kaldırın

1. Trafik yeni makineye yönlendirildikten ve Cloud üzerinde saklanan verileriniz (kurallar, IP listeleri) senkronize edildikten sonra, kurallarınızın beklendiği gibi çalıştığından emin olmak için bazı test saldırıları gerçekleştirin.
1. Wallarm Console → **Nodes** içinde eski node’u seçip **Delete** tıklayarak silin.
1. İşlemi onaylayın.
    
    Node Cloud’dan silindiğinde, uygulamalarınıza gelen isteklerin filtrelenmesini durduracaktır. Filtreleme node’unun silinmesi geri alınamaz. Node, node listesinde kalıcı olarak silinir.

1. Eski node’un bulunduğu makineyi silin veya yalnızca Wallarm node bileşenlerinden temizleyin:

    ```
    sudo systemctl stop wallarm
    sudo rm -rf /opt/wallarm
    ```