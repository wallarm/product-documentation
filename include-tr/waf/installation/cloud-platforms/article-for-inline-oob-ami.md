[img-security-group]:                ../../../images/aws-ami/security-group.png
[latest-node-version]:              ../../../updating-migrating/node-artifact-versions.md#amazon-machine-image-ami
[nginx-native-node]:                       ../../../installation/nginx-native-node-internals.md
[wallarm-logs]:                     ../../../admin-en/configure-logging.md
[log-level]:                        ../../../installation/native-node/all-in-one-conf.md#loglevel


# AWS AMI ile NGINX Node’unu Dağıtma

Bu makale, Wallarm [NGINX düğümü][nginx-native-node]’nü AWS üzerinde [in-line][inline-docs] olarak [resmi Amazon Machine Image (AMI)](https://aws.amazon.com/marketplace/pp/B073VRFXSD) kullanarak dağıtma talimatlarını sağlar.

İmaj Debian tabanlıdır ve Debian tarafından sağlanan NGINX sürümünü içerir. Şu anda en güncel imaj Debian 12’yi kullanır ve NGINX stable 1.22.1 içerir.

AWS üzerinde AMI’den Wallarm Node’un dağıtılması genellikle yaklaşık 10 dakika sürer.

![!](../../../images/waf-installation/aws/aws-ami-flow.png)

!!! info "Güvenlik notu"
    Bu çözüm, AWS güvenlik en iyi uygulamalarını takip edecek şekilde tasarlanmıştır. Dağıtım için AWS root hesabını kullanmaktan kaçınmanızı öneririz. Bunun yerine, yalnızca gerekli izinlere sahip IAM kullanıcıları veya rollerini kullanın.

    Dağıtım süreci en az ayrıcalık ilkesini esas alır; Wallarm bileşenlerini sağlamak ve işletmek için gereken asgari erişimleri verir.

Bu dağıtım için AWS altyapı maliyetlerinin tahmini konusunda rehberlik için, [AWS üzerinde Wallarm dağıtımı için Maliyet Kılavuzu][aws-costs] sayfasına bakın.

## Kullanım senaryoları

--8<-- "../include/waf/installation/cloud-platforms/ami-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami-latest.md"

### 4. Örneği Wallarm Cloud’a bağlayın

Örneğin düğümü, [cloud-init.py][cloud-init-spec] betiği aracılığıyla Wallarm Cloud’a bağlanır. Bu betik, sağlanan bir token kullanarak düğümü Wallarm Cloud’a kaydeder, onu global olarak monitoring [modu][wallarm-mode]na ayarlar ve `--proxy-pass` bayrağına göre düğümün meşru trafiği iletmesini yapılandırır.

Bulut imajından oluşturulan örnekte `cloud-init.py` betiğini aşağıdaki gibi çalıştırın:

=== "US Cloud"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS> -H us1.api.wallarm.com
    ```
=== "EU Cloud"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS>
    ```

* `WALLARM_LABELS='group=<GROUP>'`, düğüm grup adını (var olan; yoksa oluşturulacak) ayarlar. Yalnızca bir API token’ı kullanılıyorsa uygulanır.
* `<TOKEN>`, kopyalanan token değeridir.
* `<PROXY_ADDRESS>`, Wallarm düğümünün meşru trafiği proxy’lediği adrestir. Mimarinizine bağlı olarak bir uygulama örneğinin IP’si, bir yük dengeleyici veya bir DNS adı olabilir; `http` veya `https` protokolü belirtilmelidir, örn. `http://example.com` veya `https://192.0.2.1`. [Proxy adresi biçimi hakkında daha fazla bilgi için bakın](https://nginx.org/en/docs/http/ngx_http_proxy_module.html?&_ga=2.23729850.1231698478.1756133814-1504295816.1756133814#proxy_pass).

### 5. Trafiği Wallarm örneğine göndermeyi yapılandırın

--8<-- "../include/waf/installation/sending-traffic-to-node-inline.md"

### 6. Wallarm’ın çalışmasını test edin

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## Günlükler ve metrikleri kullanarak düğümün çalışmasını doğrulama

Düğümün trafiği algıladığını doğrulamak için metrikleri ve günlükleri aşağıdaki şekilde kontrol edebilirsiniz:

* Düğüm tarafından sunulan Prometheus metriklerini kontrol edin:

    ```
    curl http://127.0.0.1:9001/metrics
    ```

* Gelen istekleri ve hataları incelemek için NGINX günlüklerini gözden geçirin:

    * Erişim günlükleri: `/var/log/nginx/access.log`
    * Hata günlükleri: `/var/log/nginx/error.log`

* Wallarm Cloud’a gönderilen veriler, tespit edilen saldırılar ve daha fazlası gibi ayrıntıları içeren [Wallarm’a özgü günlükleri][wallarm-logs] gözden geçirin. Bu günlükler `/opt/wallarm/var/log/wallarm` dizininde yer alır.

## Dağıtılan çözüme ince ayar yapma

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options-5.0.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"