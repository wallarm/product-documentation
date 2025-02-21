!!! info "Kullanıcıya `root` İzni Sağlama"
    Eğer NGINX'i `root` izni olmayan bir kullanıcı olarak çalıştırıyorsanız, bu kullanıcıyı aşağıdaki komutu kullanarak `wallarm` grubuna ekleyin:
    
    ```
    usermod -aG wallarm <user_name>;
    ```
    
    burada `<user_name>`, `root` iznine sahip olmayan kullanıcının adıdır.