1. Test [Dizin Geçişi][ptrav-attack-docs] saldırısını içeren isteği uygulama adresine gönderin:

    ```
    curl http://localhost/etc/passwd
    ```

    Trafik `example.com` adresine proxy üzerinden yönlendirilecek şekilde yapılandırıldıysa, isteğe `-H "Host: example.com"` başlığını ekleyin.
1. Yeni türdeki node'un isteği **standart** node'un yaptığı şekilde işlediğinden emin olun; örneğin:

    * Uygun [filtreleme modu][waf-mode-instr] yapılandırıldıysa isteği engeller.
    * Yapılandırıldıysa [özel engelleme sayfasını][blocking-page-instr] döndürür.
2. [EU Cloud](https://my.wallarm.com/attacks) veya [US Cloud](https://us1.my.wallarm.com/attacks) içinde Wallarm Console → **Attacks** bölümünü açın ve şunları doğrulayın:

    * Saldırı listede görüntülenir.
    * Hit details, Wallarm node UUID bilgisini gösterir.

    ![Arayüzdeki Attacks][attacks-in-ui-image]