!!! warning "Connecting FAST node to one of the Wallarm clouds"
    Bir FAST node, [mevcut Wallarm clouds](../../cloud-list.md) arasından biriyle etkileşim kurar. Varsayılan olarak, bir FAST node, Amerikan cloud'da bulunan Wallarm API sunucusuyla çalışır.
    
    FAST node'un farklı bir cloud'daki API sunucusunu kullanmasını sağlamak için, node konteynerine gerekli Wallarm API sunucusunun adresine işaret eden `WALLARM_API_HOST` ortam değişkenini iletin.
    
    Örnek (Avrupa Wallarm cloud'unda bulunan API sunucusunu kullanan bir FAST node için):

    ```
    WALLARM_API_HOST=api.wallarm.com      
    ```