!!! uyarı "Hata: "imzalar doğrulanamadı""
    Eklenen GPG anahtarları süresi dolmuşsa, aşağıdaki hata döndürülür:

    ```
    W: GPG hatası: https://repo.wallarm.com/ubuntu/wallarm-node focal/3.6/ Release: Aşağıdaki
    imzalar kamu anahtarı mevcut olmadığı için doğrulanamadı: NO_PUBKEY 1111FQQW999
    E: 'https://repo.wallarm.com/ubuntu/wallarm-node focal/3.6/ Release' imzalanmamış bir depodur.
    N: Bu tür bir depodan güvenli bir şekilde güncelleme yapılamaz ve bu nedenle varsayılan olarak devre dışı bırakılır.
    N: Depo oluşturma ve kullanıcı yapılandırma ayrıntıları için apt-secure(8) manpage'ine bakın.
    ```

    Sorunu çözmek için, lütfen Wallarm paketleri için yeni GPG anahtarlarını içe aktarın ve ardından aşağıdaki komutları kullanarak paketleri yükseltin:

    ```
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sudo apt update
    sudo apt dist-upgrade
    ```