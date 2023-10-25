!!! uyarı "Hata "imzalar doğrulanamadı""
    Eklenen GPG anahtarları süresi dolmuşsa, aşağıdaki hata döner:

    ```
    W: GPG hatası: https://repo.wallarm.com/ubuntu/wallarm-node focal/4.0/ Yayın: Aşağıdaki
    imzalar doğrulanamadı çünkü genel anahtar mevcut değil: NO_PUBKEY 1111FQQW999
    E: 'https://repo.wallarm.com/ubuntu/wallarm-node focal/4.0/ Yayın' deposu imzalanmış değil.
    N: Böyle bir depodan güvenli şekilde güncelleme yapılamaz ve bu nedenle varsayılan olarak devre dışı bırakılır.
    N: Depo oluşturma ve kullanıcı yapılandırma detayları için apt-secure(8) man sayfasına bakınız.
    ```

    Sorunu çözmek için, lütfen Wallarm paketleri için yeni GPG anahtarlarını içe aktarın ve ardından aşağıdaki komutları kullanarak paketleri güncelleyin:

    ```
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sudo apt update
    sudo apt dist-upgrade
    ```