```markdown
!!! warning "İmzaların doğrulanamadı hatası"
    Eklenen GPG anahtarlarının süresi dolduğunda, aşağıdaki hata döndürülecektir:

    ```
    W: GPG error: https://repo.wallarm.com/ubuntu/wallarm-node focal/4.0/ Release:The following
    signatures couldn't be verified because the public key is not available: NO_PUBKEY 1111FQQW999
    E: The repository 'https://repo.wallarm.com/ubuntu/wallarm-node focal/4.0/ Release' is not signed.
    N: Updating from such a repository can't be done securely, and is therefore disabled by default.
    N: See apt-secure(8) manpage for repository creation and user configuration details.
    ```

    Sorunu düzeltmek için, lütfen Wallarm paketleri için yeni GPG anahtarlarını içe aktarın ve ardından paketleri aşağıdaki komutları kullanarak yükseltin:

    ```
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sudo apt update
    sudo apt dist-upgrade
    ```
```