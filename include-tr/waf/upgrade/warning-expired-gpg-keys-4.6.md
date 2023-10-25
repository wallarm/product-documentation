!!! uyarı "Hata "imzalar doğrulanamadı""
    Eklenen GPG anahtarları süresi dolduysa, aşağıdaki hata döner:

    ```
    W: GPG hata: https://repo.wallarm.com/ubuntu/wallarm-node focal/4.6/ Yayın: Şu imzalar 
    doğrulanamadı çünkü genel anahtar mevcut değil: NO_PUBKEY 1111FQQW999
    E: 'https://repo.wallarm.com/ubuntu/wallarm-node focal/4.6/ Yayın' deposu imzalanmamış.
    N: Böyle bir depodan güvenli bir şekilde güncelleme yapılamaz ve bu nedenle varsayılan olarak devre dışı bırakılır.
    N: Depo oluşturma ve kullanıcı yapılandırma detayları için apt-secure (8) manpage'ine bakın.
    ```

    Sorunu çözmek için, lütfen Wallarm paketleri için yeni GPG anahtarlarını içe aktarın ve ardından aşağıdaki komutları kullanarak paketleri yükseltin:

    ```
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sudo apt update
    sudo apt dist-upgrade
    ```