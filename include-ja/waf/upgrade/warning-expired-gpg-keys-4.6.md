```markdown
!!! warning "エラー「signatures couldn't be verified」"
    追加されたGPGキーの有効期限が切れている場合、以下のエラーが返されます:

    ```
    W: GPG error: https://repo.wallarm.com/ubuntu/wallarm-node focal/4.6/ Release:The following
    signatures couldn't be verified because the public key is not available: NO_PUBKEY 1111FQQW999
    E: The repository 'https://repo.wallarm.com/ubuntu/wallarm-node focal/4.6/ Release' is not signed.
    N: Updating from such a repository can't be done securely, and is therefore disabled by default.
    N: See apt-secure(8) manpage for repository creation and user configuration details.
    ```

    問題を解決するため、Wallarmパッケージ用の新しいGPGキーを追加し、その後、次のコマンドでパッケージをアップグレードしてください:

    ```
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sudo apt update
    sudo apt dist-upgrade
    ```
```