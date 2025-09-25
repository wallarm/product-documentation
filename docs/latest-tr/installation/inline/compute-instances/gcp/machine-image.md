# GCP Makine İmajı ile Wallarm Dağıtımı

Bu makale, [resmi Makine İmajı](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node) kullanılarak GCP üzerinde Wallarm'ı [inline][inline-docs] dağıtma talimatlarını sağlar.

İmaj, Debian ve Debian tarafından sağlanan NGINX sürümü temel alınarak oluşturulmuştur. Şu anda en güncel imaj Debian 12 kullanır ve NGINX stable 1.22.1 içerir.

## Kullanım senaryoları

--8<-- "../include/waf/installation/cloud-platforms/gcp-machine-image-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-gcp-image.md"

## 5. Filtreleme düğümünü Wallarm Cloud'a bağlayın

Bulut örneğinin düğümü, [cloud-init.py][cloud-init-spec] betiği aracılığıyla Wallarm Cloud'a bağlanır. Bu betik, sağlanan bir token kullanarak düğümü Wallarm Cloud'a kaydeder, düğümü global olarak monitoring [modu][wallarm-mode]na ayarlar ve `--proxy-pass` bayrağına göre meşru trafiği iletecek şekilde yapılandırır. NGINX'in yeniden başlatılmasıyla kurulum tamamlanır.

Bulut imajından oluşturulan örnek üzerinde `cloud-init.py` betiğini aşağıdaki gibi çalıştırın:

=== "ABD Bulutu"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS> -H us1.api.wallarm.com
    ```
=== "AB Bulutu"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS>
    ```

* `WALLARM_LABELS='group=<GROUP>'` düğüm grup adını ayarlar (var olan bir ad; yoksa oluşturulur). Yalnızca bir API token kullanıyorsanız uygulanır.
* `<TOKEN>`, token'ın kopyalanmış değeridir.
* `<PROXY_ADDRESS>`, Wallarm düğümünün meşru trafiği proxy'leyeceği hedefin adresidir. Mimarinizine bağlı olarak bir uygulama örneğinin IP'si, bir yük dengeleyici ya da bir DNS adı vb. olabilir.

## 6. Wallarm örneğine trafik gönderimini yapılandırın

--8<-- "../include/waf/installation/sending-traffic-to-node-inline.md"

## 7. Wallarm çalışmasını test edin

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## 8. Dağıtılan çözüme ince ayar yapın

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"