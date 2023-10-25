!!! bilgi "Kullanıcıya `root` izni verme"
    Eğer NGINX'i `root` izni olmayan bir kullanıcı olarak çalıştırıyorsanız, bu kullanıcıyı aşağıdaki komutu kullanarak `wallarm` grubuna ekleyin:
    
    ```
    usermod -aG wallarm <kullanıcı_adı>;
    ```
    
    burada `<kullanıcı_adı>`, `root` izni olmayan kullanıcının adıdır.