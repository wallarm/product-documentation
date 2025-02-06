!!! warning "Wallarm cloudlarından birine FAST node Bağlama"
    Bir FAST node, [mevcut Wallarm cloudları](../cloud-list.md)'ndan biriyle etkileşim kurar. Varsayılan olarak, bir FAST node, Amerikan cloud'unda bulunan Wallarm API sunucusuyla çalışır.
    
    FAST node'un başka bir cloud'daki API sunucusunu kullanmasını sağlamak için, node konteynerine gerekli Wallarm API sunucusunun adresine işaret eden `WALLARM_API_HOST` ortam değişkenini iletin.

    Örnek (Avrupa Wallarm cloud'unda bulunan API sunucusunu kullanan bir FAST node için):

    ```
    WALLARM_API_HOST=api.wallarm.com      
    ```