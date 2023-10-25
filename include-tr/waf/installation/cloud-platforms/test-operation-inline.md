Wallarm.com belge makalesini İngilizce'den Türkçe'ye çevirin:

1. Bir yük dengeleyici veya Wallarm düğümüne sahip olan makinenin adresine test [Path Traversal][ptrav-attack-docs] saldırısı ile istek:

    ```
    curl http://<ADRES>/etc/passwd
    ```
2. Wallarm Konsolunu açın → [US Cloud](https://us1.my.wallarm.com/search) veya [EU Cloud](https://my.wallarm.com/search) 'da **Etkinlikler** bölümünü ve saldırının listeye çıkıp çıkmadığını kontrol edin.
    ![Arayüzdeki saldırılar][attacks-in-ui-image]

Wallarm izleme modunda çalıştığı için, Wallarm düğümü saldırıyı engellemez ancak kaydeder.