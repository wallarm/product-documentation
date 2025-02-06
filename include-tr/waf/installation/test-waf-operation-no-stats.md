1. Test [Path Traversal][ptrav-attack-docs] saldırısı ile korunan bir kaynak adresine istek gönderin:

    ```
    curl http://localhost/etc/passwd
    ```

    Trafik `example.com` adresine proxy edilecek şekilde yapılandırıldıysa, isteğe `-H "Host: example.com"` başlığını ekleyin.
2. Wallarm Console → **Attacks** bölümünü [US Cloud](https://us1.my.wallarm.com/search) veya [EU Cloud](https://my.wallarm.com/search) içinde açın ve saldırının listede görüntülendiğinden emin olun.
    ![Attacks in the interface][attacks-in-ui-image]