# Saldırılar Wallarm Buluta yüklenmiyor

Trafikten gelen saldırıların Wallarm Buluta yüklenmediğini ve sonuç olarak Wallarm Konsol UI'da görünmediğini düşünüyorsanız, bu sorunu hata ayıklamak için bu makaleyi kullanın.

Sorunu hata ayıklamak için, aşağıdaki adımları sırayla gerçekleştirin:

1. Daha fazla hata ayıklama yapmak için bazı kötü niyetli trafik oluşturun.
1. Filtreleme düğümü işletim modunu kontrol edin.
1. Tarantool'un talepleri işlemek için yeterli kaynağa sahip olduğunu kontrol edin.
1. Günlükleri yakalayın ve bunları Wallarm destek ekibiyle paylaşın.

## 1. Bazı kötü niyetli trafik oluşturun

Wallarm modüllerinin daha fazla hata ayıklamasını yapmak için:

1. Aşağıdaki kötü niyetli trafiği gönderin:

    ```bash
    for i in `seq 100`; do curl "http://<FILTERING_NODE_IP>/?wallarm_test_xxxx=union+select+$i"; sleep 1; done
    ```

    `<FILTERING_NODE_IP>`'yi kontrol etmek istediğiniz bir filtreleme düğümü IP'siyle değiştirin. Gerekirse, komuta `Host:` başlığını ekleyin.
1. Saldırıların Wallarm Konsol → **Olaylar**'da görünmesi için en fazla 2 dakika bekleyin. Tüm 100 istek görünürse, filtreleme düğümü düzgün çalışır.
1. Kurulu filtreye sahip olan sunucuya bağlanın ve [düğüm metriklerini](../admin-en/monitoring/intro.md) alın:

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    Daha sonra, `wallarm-status` çıktısına referans vereceğiz.

## 2. Filtreleme düğümü işletim modunu kontrol edin

Filtreleme düğümü işletim modunu aşağıdaki gibi kontrol edin:

1. Filtreleme düğümü[modunun](../admin-en/configure-wallarm-mode.md)`off`undan farklı olduğundan emin olun. Düğüm `off` modunda gelen trafiği işlemez.

    `Off` modu, `wallarm-status` metriklerinin artmamasının yaygın bir nedenidir.
1. Wallarm düğüm ayarlarının uygulandığından emin olmak için NGINX'i yeniden başlatın (eğer düğüm DEB/RPM paketlerinden kurulduysa):

    --8<-- "../include-tr/waf/restart-nginx-4.4-and-above.md"
1. Saldırıların hala Buluta yüklenmediğinden emin olmak için bir kez daha kötü niyetli trafiği [oluşturun](#1-generate-some-malicious-traffic).

## 3. Tarantool'un talepleri işlemek için yeterli kaynağa sahip olduğunu kontrol edin

Aşağıdaki Tarantool'un temel metrikleri, saldırı ihracıyla bağlantılı Tarantool sorunlarına işaret eder:

* `wallarm.stat.export_delay` Wallarm Buluta saldırıların yüklenmesindeki gecikmeyi belirtir (saniye cinsinden)
* `wallarm.stat.timeframe_size` Tarantool'un talepleri sakladığı zaman aralığını belirtir (saniye cinsinden)
* `wallarm.stat.dropped_before_export` Wallarm Buluta yüklenmek için yeterli zamanı olmayan isabetlerin sayısını belirtir

Metrikleri görüntülemek için:

1. Kurulu postanalitik modülü (Tarantool) olan sunucuya bağlanın.
1. Aşağıdaki komutları kullanın:

    ```bash
    wtarantool
    require('console').connect('127.0.0.1:3313')
    wallarm.stat.export_delay()
    wallarm.stat.timeframe_size()
    wallarm.stat.dropped_before_export()
    ```

Eğer `wallarm.stat.dropped_before_export` değeri `0`'dan farklıysa:

* Tarantool için ayrılan bellek miktarını [artırın](../admin-en/configuration-guides/allocate-resources-for-node.md#tarantool) (`wallarm.stat.timeframe_size` 10 dakikadan azsa).

    !!! info "Önerilen hafıza"
        `wallarm.stat.timeframe_size` metriğinin zirve yükler sırasında `300` saniyenin altına düşmemesi için Tarantool için ayrılan hafızayı ayarlamanız önerilir.

* `/etc/wallarm/node.yaml` → `export_attacks`da `export_attacks` işleyicilerinin sayısını artırın, örn.:

    ```yaml
    export_attacks:
      threads: 5
      api_chunk: 20
    ```

    `export_attacks` ayarları varsayılan olarak aşağıdaki gibidir:

    * `threads: 2`
    * `api_chunk: 10` 

## 4. Günlükleri yakalayın ve bunları Wallarm destek ekibiyle paylaşın

Yukarıdaki adımlar sorunu çözmeye yardımcı olmazsa, lütfen düğüm günlüklerini yakalayın ve bunları aşağıdaki gibi Wallarm destek ekibiyle paylaşın:

1. Kurulu Wallarm düğümü olan sunucuya bağlanın.
1. `wallarm-status` çıktısını aşağıdaki gibi alın:

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    Bir çıktıyı kopyalayın.
1. Wallarm teşhis betiğini çalıştırın:

    ```bash
    sudo /usr/share/wallarm-common/collect-info.sh
    ```

    Günlüklerle oluşturulan dosyayı edinin.
1. Tüm toplanan verileri daha fazla inceleme için [Wallarm destek ekibine](mailto:support@wallarm.com) gönderin.