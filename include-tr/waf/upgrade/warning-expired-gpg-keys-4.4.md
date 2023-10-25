!!! uyarı "Hata "imzalar doğrulanamadı""
    Eklenmiş GPG anahtarlarının süresi dolduysa, aşağıdaki hata döndürülür:

    ```
    W: GPG hata: https://repo.wallarm.com/ubuntu/wallarm-node focal/4.4/ Release: Aşağıdakiler
    imzalar doğrulanamadı çünkü kamu anahtarı mevcut değil: NO_PUBKEY 1111FQQW999
    E: 'https://repo.wallarm.com/ubuntu/wallarm-node focal/4.4/ Release' deposu imzalanmamış.
    N: Böyle bir depodan güvenli bir şekilde güncelleme yapılamaz ve bu nedenle varsayılan olarak devre dışı bırakılmıştır.
    N: Depo oluşturma ve kullanıcı yapılandırma detayları için apt-secure(8) man sayfasına bakın.
    ```

    Sorunu çözmek için, lütfen Wallarm paketleri için yeni GPG anahtarlarını içe aktarın ve ardından aşağıdaki komutları kullanarak paketleri yükseltin:

    ```
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sudo apt update
    sudo apt dist-upgrade
    ```