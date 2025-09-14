1. Trafiği yansıtan web veya proxy sunucusunun ya da Wallarm node'unun bulunduğu makinenin adresine yönelik, test amaçlı [Dizin Geçişi][ptrav-attack-docs] saldırısı içeren istek:

    ```
    curl http://<ADDRESS>/etc/passwd
    ```
2. [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) içindeki Wallarm Console → **Attacks** bölümünü açın ve saldırının listede görüntülendiğinden emin olun.
    ![Arayüzdeki saldırılar][attacks-in-ui-image]

Wallarm OOB izleme modunda çalıştığından, Wallarm node saldırıyı engellemez, ancak kaydeder.