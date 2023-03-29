!!! warning "エラー「署名を検証できませんでした」"
    追加されたGPGキーが期限切れの場合、次のエラーが返されます。

    ```
    W: GPG error: http://repo.wallarm.com/ubuntu/wallarm-node focal/4.4/ Release:以下の署名が
    検証できませんでした。公開鍵が利用できません: NO_PUBKEY 1111FQQW999
    E: リポジトリ 'http://repo.wallarm.com/ubuntu/wallarm-node focal/4.4/ Release' は署名されていません。
    N: そのようなリポジトリからの更新は安全に行えないため、デフォルトでは無効になっています。
    N: リポジトリの作成とユーザー構成の詳細については、apt-secure(8)マニュアルページを参照してください。
    ```

    問題を解決するには、Wallarmパッケージの新しいGPGキーをインポートしてから、次のコマンドを使用してパッケージをアップグレードしてください。

    ```
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sudo apt update
    sudo apt dist-upgrade
    ```