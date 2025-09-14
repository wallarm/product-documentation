1. Yük dengeleyicinin veya Wallarm node'un bulunduğu makinenin adresine test amaçlı [Dizin Geçişi][ptrav-attack-docs] saldırısı içeren istek:

    ```
    curl http://<ADDRESS>/etc/passwd
    ```
2. [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) içindeki Wallarm Console → Attacks bölümünü açın ve saldırının listede görüntülendiğinden emin olun.
    ![Arayüzdeki Attacks][attacks-in-ui-image]

    Wallarm izleme modunda çalıştığından, Wallarm node saldırıyı engellemez, ancak kaydeder.

1. İsteğe bağlı olarak, Wallarm node'un işleyişinin diğer yönlerini [test edin][link-wallarm-health-check].