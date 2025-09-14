1. Korunan bir kaynak adresine test [Dizin Geçişi][ptrav-attack-docs] saldırısıyla istek gönderin:

    ```
    curl http://localhost/etc/passwd
    ```

    Trafik `example.com` adresine proxy üzerinden iletilecek şekilde yapılandırıldıysa, isteğe `-H "Host: example.com"` başlığını ekleyin.
1. Wallarm Console → [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) içindeki **Attacks** bölümünü açın ve saldırının listede görüntülendiğinden emin olun.

    ![Arayüzde Attacks][attacks-in-ui-image]

1. İsteğe bağlı olarak, düğümün çalışmasının diğer yönlerini [test edin][link-wallarm-health-check].