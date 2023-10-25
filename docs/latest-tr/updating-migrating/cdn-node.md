# CDN düğümünü yükseltme

Bu talimatlar, versiyon 3.6'dan itibaren mevcut olan Wallarm CDN düğümünü yükseltmek için adımları anlatır.

1. Korumalı domainin DNS kayıtlarından Wallarm CNAME kaydını silin.

    !!! uyarı "Kötü niyetli talep azaltma durdurulacak"
        Bir kez CNAME kaydı kaldırıldı ve değişiklikler internette etkili oldu, Wallarm CDN düğümü talep proxy'lemesini durduracak ve yasal ve kötü niyetli trafik doğrudan korunan kaynağa yönlendirilecek.

        Silinen DNS kaydı etkili oldu ama yeni düğüm sürümü için oluşturulan CNAME kaydı henüz etkili olmadığında korunan sunucunun güvenlik açığı riski ortaya çıkar.
1. Değişikliklerin yayılması için bekleyin. Gerçek CNAME kaydı durumu Wallarm Konsolu → **Düğümler** → **CDN** → **Düğümü sil**'de görüntülenir.
1. CDN düğümünü Wallarm Konsolu → **Düğümler**'dan silin.

    ![Düğümü silme](../images/user-guides/nodes/delete-cdn-node.png)
1. Aynı alanı koruyan daha yeni sürümdeki CDN düğümünü oluşturun, [talimatlara](../installation/cdn-node.md) uyun.

Tüm CDN düğüm ayarları Wallarm Bulutunda saklandığından, yeni CDN düğümü bunları otomatik olarak alır. Korumalı alan değişmediyse düğüm konfigürasyonunu manuel olarak taşımanız gerekmez.