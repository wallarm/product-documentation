1. Test [Path Traversal][ptrav-attack-docs] saldırısını korunan bir kaynak adresine gönderin:

   ```
   curl http://localhost/etc/passwd
   ```
2. Wallarm Konsolunu açın → [US Cloud](https://us1.my.wallarm.com/search) veya [EU Cloud](https://my.wallarm.com/search) üzerinde **Olaylar** bölümüne gidin ve saldırının listeye eklenmiş olduğunu kontrol edin.
   ![Arayüzdeki saldırılar][attacks-in-ui-image]