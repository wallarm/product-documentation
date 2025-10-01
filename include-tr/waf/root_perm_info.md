!!! info "Kullanıcıya `root` izni sağlama"
    NGINX’i `root` izni olmayan bir kullanıcı olarak çalıştırıyorsanız, aşağıdaki komutu kullanarak bu kullanıcıyı `wallarm` grubuna ekleyin:
    
    ```
    usermod -aG wallarm <user_name>;
    ```
    
    burada `<user_name>`, `root` izni olmayan kullanıcının adıdır.