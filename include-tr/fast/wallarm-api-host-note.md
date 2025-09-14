!!! warning "FAST node'u Wallarm cloud'larından birine bağlama"
    Bir FAST node, [mevcut Wallarm cloud'larından](../cloud-list.md) biriyle etkileşime girer. Varsayılan olarak, bir FAST node Amerikan Wallarm cloud'unda bulunan Wallarm API sunucusuyla çalışır.
    
    Bir FAST node'un başka bir cloud'daki API sunucusunu kullanmasını sağlamak için, gerekli Wallarm API sunucusunun adresini gösteren `WALLARM_API_HOST` ortam değişkenini node konteynerine iletin.

    Örnek (Avrupa Wallarm cloud'unda bulunan API sunucusunu kullanan bir FAST node için):

    ```
    WALLARM_API_HOST=api.wallarm.com      
    ```