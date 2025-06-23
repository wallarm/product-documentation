1. Test [Path Traversal][ptrav-attack-docs] saldırısı ile Wallarm node'unun bulunduğu makine veya web/proxy sunucusunun trafiğini yansıtan adrese gönderilen istek:

    ```
    curl http://<ADDRESS>/etc/passwd
    ```
2. Wallarm Console'u açın → [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) üzerinden **Attacks** bölümüne gidin ve saldırının listede görüntülendiğinden emin olun.
    ![Attacks in the interface][attacks-in-ui-image]

Wallarm OOB izleme modunda çalıştığından, Wallarm node saldırıyı engellemez, yalnızca kaydeder.