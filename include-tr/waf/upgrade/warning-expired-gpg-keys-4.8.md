!!! uyarı "Hata "imzalar doğrulanamadı""
    Eklenen GPG anahtarları süresi dolarsa, aşağıdaki hata dönecektir:

    ```
    W: GPG hata: https://repo.wallarm.com/ubuntu/wallarm-node focal/4.8/ Sürüm: Aşağıdaki
    imzalar doğrulanamadı çünkü genel anahtar kullanılabilir değil: NO_PUBKEY 1111FQQW999
    E: 'https://repo.wallarm.com/ubuntu/wallarm-node focal/4.8/ Sürüm' imzalanmadı.
    N: Bu tür bir depodan güncelleme güvenli bir şekilde yapılamaz ve bu nedenle varsayılan olarak devre dışı bırakılmıştır.
    N: Depo oluşturma ve kullanıcı yapılandırma detayları için apt-secure(8) adlı el kitabına bakın.
    ```

    Sorunu çözmek için, lütfen Wallarm paketleri için yeni GPG anahtarlarını içe aktarın ve ardından aşağıdaki komutları kullanarak paketleri yükseltin:

    ```
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sudo apt güncelleme
    sudo apt dist-upgrade
    ```