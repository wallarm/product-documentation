!!! uyarı "FAST düğümünü Wallarm bulutlarından birine bağlama"
    FAST düğümü, mevcut olan [Wallarm bulutlarından biri](../cloud-list.md) ile etkileşim kurar. Varsayılan olarak, bir FAST düğümü Amerikan bulutunda bulunan Wallarm API sunucusu ile çalışır. 
    
    FAST düğümünün başka bir buluttaki API sunucusunu kullanması için, düğüm konteynırına gerekli Wallarm API sunucusunun adresini gösteren `WALLARM_API_HOST` ortam değişkenini iletilir.

    Örnek (API sunucusu Avrupa Wallarm bulutunda bulunan bir FAST düğümü için):

    ```
    WALLARM_API_HOST=api.wallarm.com      
    ```