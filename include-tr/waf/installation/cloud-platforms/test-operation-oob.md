1. Test [Path Traversal][ptrav-attack-docs] saldırısına sahip olacak şekilde bir web veya proxy sunucusunun aynalanan trafiğine ya da Wallarm düğümünün bulunduğu makinenin adresine istek:

   ```
   curl http://<ADRES>/etc/passwd
   ```

2. Wallarm Konsolunu açın → [US Cloud](https://us1.my.wallarm.com/search) ya da [EU Cloud](https://my.wallarm.com/search) sayfasında **Olaylar** bölümünü açın ve saldırının listede göründüğünden emin olun.
   ![Arayüzdeki saldırılar][attacks-in-ui-image]

Wallarm OOB izleme modunda çalıştığından, Wallarm düğümü saldırıyı engellemez, ancak kaydeder.