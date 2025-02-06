1. Uygulama adresine test [Path Traversal][ptrav-attack-docs] saldırısı ile isteği gönderin:

    ```
    curl http://localhost/etc/passwd
    ```

    Eğer trafik `example.com` adresine proxylenmek üzere yapılandırıldıysa, isteğe `-H "Host: example.com"` başlığını ekleyin.
1. Yeni tipteki node'un isteği **normal** node gibi aynı şekilde işlediğinden emin olun, örneğin:

    * Uygun [filtrasyon modu][waf-mode-instr] yapılandırılmışsa talebi engeller.
    * Yapılandırılmışsa [özel engelleme sayfası][blocking-page-instr]'nı döndürür.
2. [EU Cloud](https://my.wallarm.com/search) veya [US Cloud](https://us1.my.wallarm.com/search) üzerindeki Wallarm Console → **Attacks** bölümünü açın ve şunlardan emin olun:

    * Saldırı listede görüntüleniyor.
    * Vuruş detayları Wallarm node UUID'sini gösteriyor.

    ![Attacks in the interface][attacks-in-ui-image]