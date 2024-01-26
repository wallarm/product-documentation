!!! uyarı "FAST düğümünü Wallarm bulutlarından birine bağlama"
    Bir FAST düğümü, [mevcut Wallarm bulutlarından](../../cloud-list.md) biriyle etkileşimde bulunur. Varsayılan olarak, bir FAST düğümü Amerikan bulutunda bulunan Wallarm API sunucusu ile çalışır.
    
    Bir FAST düğümüne başka bir buluttaki API sunucusunu kullanması için talimat vermek için, gerekli Wallarm API sunucusunun adresini belirten `WALLARM_API_HOST` çevre değişkenini düğüm konteynerine iletin.
    
    Örnek (Avrupa Wallarm bulutundaki API sunucusunu kullanan bir FAST düğümü için):

    ```
    WALLARM_API_HOST=api.wallarm.com      
    ```