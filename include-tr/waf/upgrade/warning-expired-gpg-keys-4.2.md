!!! uyarı "Hata "imzalar doğrulanamadı""
    Eklenmiş GPG anahtarları süresi dolduysa, aşağıdaki hata geri döndürülür:

    ```
    W: GPG hatası: https://repo.wallarm.com/ubuntu/wallarm-node focal/4.2/ Yayın: Aşağıdakiler
    imzalar çünkü halka açık anahtar hakkında mevcut değil: NO_PUBKEY 1111FQQW999
    E: 'https://repo.wallarm.com/ubuntu/wallarm-node focal/4.2/ Yayın' imzalanmamış olan depo.
    N: Böyle bir depodan güncelleme güvenli bir şekilde yapılamaz ve bu nedenle varsayılan olarak devre dışı bırakılmıştır.
    N: Repository oluşturmak ve kullanıcı yapılandırması detayları için apt-secure(8) elkitabına bakın.
    ```

    Sorunu çözmek için, lütfen Wallarm paketleri için yeni GPG anahtarları içe aktarın ve ardından aşağıdaki komutları kullanarak paketleri yükseltin:

    ```
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sudo apt update
    sudo apt dist-upgrade
    ```