1. Test [Path Traversal][ptrav-attack-docs] saldırısıyla, ya yük dengeleyicinin ya da Wallarm node bulunan makinenin adresine istek gönderilir:

    ```
    curl http://<ADDRESS>/etc/passwd
    ```

2. Wallarm Console → **Attacks** bölümünü açın, [US Cloud](https://us1.my.wallarm.com/search) veya [EU Cloud](https://my.wallarm.com/search) üzerinden saldırının listede görüntülendiğinden emin olun.
    ![Arayüzdeki saldırılar][attacks-in-ui-image]

Wallarm izleme modunda çalıştığından, Wallarm node saldırıyı engellemez, sadece kaydeder.