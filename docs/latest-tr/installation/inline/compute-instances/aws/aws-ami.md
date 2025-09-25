# AWS AMI ile NGINX Düğümünün Dağıtımı

Bu makale, Wallarm [NGINX düğümünün][nginx-native-node] AWS üzerinde [inline][inline-docs] olarak [resmi Amazon Machine Image (AMI)](https://aws.amazon.com/marketplace/pp/B073VRFXSD) kullanılarak dağıtılması için talimatlar sağlar.

İmaj, Debian ve Debian'ın sağladığı NGINX sürümü temel alınarak hazırlanmıştır. Şu anda en güncel imaj Debian 12 kullanır ve NGINX'in kararlı 1.22.1 sürümünü içerir.

AWS üzerinde AMI'den Wallarm düğümünün dağıtılması genellikle yaklaşık 10 dakika sürer.

![!][aws-ami-traffic-flow]

!!! info "Güvenlik notu"
    Bu çözüm, AWS güvenlik en iyi uygulamalarını takip edecek şekilde tasarlanmıştır. Dağıtım için AWS root hesabını kullanmaktan kaçınmanızı öneririz. Bunun yerine, yalnızca gerekli izinlere sahip IAM kullanıcılarını veya rolleri kullanın.

    Dağıtım süreci, Wallarm bileşenlerini sağlamak ve işletmek için gereken asgari erişimi veren asgari ayrıcalık ilkesini esas alır.

Bu dağıtım için AWS altyapı maliyetlerini tahmin etmeye yönelik rehberlik için [AWS'de Wallarm'ın Dağıtımı için Maliyet Rehberi][aws-costs] sayfasına bakın.

## Kullanım senaryoları

--8<-- "../include/waf/installation/cloud-platforms/ami-use-cases.md"

--8<-- "../include/waf/installation/cloud-platforms/reqs-and-steps-to-deploy-ami-latest.md"

### 4. Instance'ı Wallarm Cloud'a bağlayın

Instance'ın düğümü, [cloud-init.py][cloud-init-spec] betiği aracılığıyla Wallarm Cloud'a bağlanır. Bu betik, sağlanan bir token kullanarak düğümü Wallarm Cloud'a kaydeder, genel olarak Monitoring [mode]'a ayarlar ve `--proxy-pass` bayrağına göre düğümün meşru trafiği iletmesini yapılandırır.

Bulut imajından oluşturulan instance üzerinde `cloud-init.py` betiğini şu şekilde çalıştırın:

=== "US Cloud"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS> -H us1.api.wallarm.com
    ```
=== "EU Cloud"
    ``` bash
    sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS>
    ```

* `WALLARM_LABELS='group=<GROUP>'` bir düğüm grup adını ayarlar (mevcutsa kullanılır, mevcut değilse oluşturulur). Yalnızca bir API token'ı kullanıyorsanız uygulanır.
* `<TOKEN>` kopyalanan token değeridir.
* `<PROXY_ADDRESS>`, Wallarm düğümünün meşru trafiği proxy'lediği adrestir. Mimarinize bağlı olarak bir uygulama instance'ının IP'si, bir yük dengeleyici veya bir DNS adı olabilir; belirtilmiş `http` veya `https` protokolü ile, örn. `http://example.com` veya `https://192.0.2.1`. [Proxy adres biçimi hakkında daha fazla bilgi edinin](https://nginx.org/en/docs/http/ngx_http_proxy_module.html?&_ga=2.23729850.1231698478.1756133814-1504295816.1756133814#proxy_pass).

### 5. Trafiğin Wallarm instance'ına gönderilmesini yapılandırın

--8<-- "../include/waf/installation/sending-traffic-to-node-inline.md"

### 6. Wallarm'ın çalışmasını test edin

--8<-- "../include/waf/installation/cloud-platforms/test-operation-inline.md"

## Düğüm çalışmasını günlükler ve metriklerle doğrulama

Düğümün trafiği algıladığını doğrulamak için metrikleri ve günlükleri aşağıdaki gibi kontrol edebilirsiniz:

* Düğümün sunduğu Prometheus metriklerini kontrol edin:

    ```
    curl http://127.0.0.1:9001/metrics
    ```

* Gelen istekleri ve hataları incelemek için NGINX günlüklerini gözden geçirin:

    * Erişim günlükleri: `/var/log/nginx/access.log`
    * Hata günlükleri: `/var/log/nginx/error.log`

* Wallarm Cloud'a gönderilen veriler, tespit edilen saldırılar ve daha fazlası gibi ayrıntıları içeren [Wallarm'a özgü günlükleri][wallarm-logs] gözden geçirin. Bu günlükler `/opt/wallarm/var/log/wallarm` dizininde bulunur.

## Dağıtılan çözüme ince ayar yapın

--8<-- "../include/waf/installation/cloud-platforms/fine-tuning-options.md"

--8<-- "../include/waf/installation/cloud-platforms/restart-nginx.md"