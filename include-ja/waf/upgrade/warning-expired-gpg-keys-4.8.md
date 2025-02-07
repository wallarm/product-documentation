!!! warning "エラー「signatures couldn't be verified」"
    追加されたGPGキーの有効期限が切れた場合、次のエラーが返されます:

    ```
    W: GPG error: https://repo.wallarm.com/ubuntu/wallarm-node focal/4.8/ Release:The following
    signatures couldn't be verified because the public key is not available: NO_PUBKEY 1111FQQW999
    E: The repository 'https://repo.wallarm.com/ubuntu/wallarm-node focal/4.8/ Release' is not signed.
    N: Updating from such a repository can't be done securely, and is therefore disabled by default.
    N: See apt-secure(8) manpage for repository creation and user configuration details.
    ```

    問題を修正するには、Wallarmパッケージ用の新しいGPGキーをインポートし、次のコマンドを使用してパッケージをアップグレードしてください:

    ```
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sudo apt update
    sudo apt dist-upgrade
    ```