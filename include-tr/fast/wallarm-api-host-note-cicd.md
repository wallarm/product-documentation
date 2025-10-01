!!! warning "FAST düğümünü Wallarm Cloud'lardan birine bağlama"
    Bir FAST düğümü, [mevcut Wallarm Cloud'lardan](../../cloud-list.md) biriyle etkileşim kurar. Varsayılan olarak, bir FAST düğümü Amerikan cloud'unda bulunan Wallarm API server ile çalışır.
    
    Bir FAST düğümüne başka bir cloud'daki API server'ı kullanmasını belirtmek için, gerekli Wallarm API server adresini gösteren `WALLARM_API_HOST` ortam değişkenini düğüm konteynerine iletin.
    
    Örnek (Avrupa Wallarm Cloud'unda bulunan API server'ı kullanan bir FAST düğümü için):

    ```
    WALLARM_API_HOST=api.wallarm.com      
    ```