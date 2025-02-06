# CDN düğümünü yükseltme

Bu talimatlar, sürüm 3.6 ve sonrasında mevcut olan Wallarm CDN node'unun nasıl yükseltileceğini açıklar.

1. Korumalı domainin DNS kayıtlarından Wallarm CNAME kaydını silin.

    !!! warning "Kötü niyetli istek hafifletmesi durdurulacak"
        CNAME kaydı kaldırıldıktan ve değişiklikler İnternet'te etkili olduktan sonra, Wallarm CDN node'u istek proxy'leme işlemini durdurur ve meşru ile kötü niyetli trafik doğrudan korunan kaynağa gider.

        Bu, silinen DNS kaydı etkili olup da yeni node sürümü için oluşturulan CNAME kaydı henüz etkili olmadığında, korunan sunucunun açıklarından faydalanılma riskini beraberinde getirir.
1. Değişikliklerin yayılmasını bekleyin. Gerçek CNAME kaydı durumu Wallarm Console → **Nodes** → **CDN** → **Delete node** bölümünde gösterilir.
1. Wallarm Console → **Nodes** üzerinden CDN node'unu silin.

    ![Düğüm siliniyor](../images/user-guides/nodes/delete-cdn-node.png)
1. Aynı domaini koruyan daha yeni sürüm CDN node'unu, [talimatları](../installation/cdn-node.md) izleyerek oluşturun.

Wallarm Cloud'da tüm CDN node ayarları kaydedildiğinden, yeni CDN node'u bunları otomatik olarak alacaktır. Korunan domain değişmediyse node yapılandırmasını manuel olarak taşımanıza gerek yoktur.