# Saldırılar Wallarm Cloud'a Yüklenmiyor

Trafikten gelen saldırıların Wallarm Cloud'a yüklenmediğini ve sonuç olarak Wallarm Console kullanıcı arayüzünde görünmediğini düşünüyorsanız, bu makaleyi sorunu ayıklamak için kullanın.

Sorunu ayıklamak için sırasıyla aşağıdaki adımları izleyin:

1. Daha fazla ayıklama yapmak için biraz kötü niyetli trafik oluşturun.
1. Filtreleme düğümü çalışma modunu kontrol edin.
1. Günlükleri yakalayın ve Wallarm destek ekibiyle paylaşın.

## 1. Biraz kötü niyetli trafik oluşturun

Wallarm modüllerini daha fazla ayıklamak için:

1. Aşağıdaki kötü niyetli trafiği gönderin:

    ```bash
    for i in `seq 100`; do curl "http://<FILTERING_NODE_IP>/?wallarm_test_xxxx=union+select+$i"; sleep 1; done
    ```

    `<FILTERING_NODE_IP>` ifadesini kontrol etmek istediğiniz filtreleme düğümünün IP adresi ile değiştirin. Gerekirse, komuta `Host:` başlığını ekleyin.
1. Saldırıların Wallarm Console → **Attacks** bölümünde görünmesi için 2 dakikaya kadar bekleyin. Eğer 100 isteğin tamamı görünüyorsa, filtreleme düğümü düzgün çalışıyor demektir.
1. Filtreleme düğümünün yüklü olduğu sunucuya bağlanın ve [düğüm metriklerini](../admin-en/configure-statistics-service.md) alın:

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    Bundan sonra `wallarm-status` çıktısından bahsedeceğiz.

## 2. Filtreleme düğümü çalışma modunu kontrol edin

Filtreleme düğümü çalışma modunu aşağıdaki şekilde kontrol edin:

1. Filtreleme düğümünün [modunun](../admin-en/configure-wallarm-mode.md) `off`'dan farklı olduğundan emin olun. Düğüm `off` modunda gelen trafiği işlemez.

    `off` modu, `wallarm-status` metriklerinin artmamasının yaygın bir sebebidir.
1. Eğer düğüm NGINX tabanlı ise, ayarların uygulandığından emin olmak için NGINX'i yeniden başlatın:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"
1. [Tekrar](#1-generate-some-malicious-traffic) kötü niyetli trafik oluşturun ve saldırıların Cloud'a hala yüklenmediğinden emin olun.

## 3. Günlükleri yakalayın ve Wallarm destek ekibiyle paylaşın

Yukarıdaki adımlar sorunu çözmezse, lütfen düğüm günlüklerini yakalayın ve aşağıdaki şekilde Wallarm destek ekibiyle paylaşın:

1. Wallarm düğümünün yüklü olduğu sunucuya bağlanın.
1. `wallarm-status` çıktısını aşağıdaki şekilde alın:

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    Çıktıyı kopyalayın.
1. Wallarm tanılama komut dosyasını çalıştırın:

    ```bash
    /opt/wallarm/collect-info.sh
    ```

    Günlüklerin bulunduğu dosyayı alın.
1. Toplanan tüm verileri, daha fazla inceleme için [Wallarm destek ekibine](mailto:support@wallarm.com) gönderin.