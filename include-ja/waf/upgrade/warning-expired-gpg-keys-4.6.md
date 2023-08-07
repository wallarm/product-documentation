					!!! 警告 "エラー "署名が検証できません""
    もし追加されたGPGキーの期限が切れていた場合、次のエラーが返されます：

    ```
    W: GPG error: https://repo.wallarm.com/ubuntu/wallarm-node focal/4.6/ Release:次の
    署名が検証できませんでした。なぜなら公開キーが利用できないからです：NO_PUBKEY 1111FQQW999
    E: リポジトリ 'https://repo.wallarm.com/ubuntu/wallarm-node focal/4.6/ Release'は署名されていません。
    N: このようなリポジトリからのアップデートは安全に行えませんし、そのためデフォルトでは無効化されています。
    N: リポジトリの作成とユーザー設定の詳細については、apt-secure(8)のマニュアルページを参照してください。
    ```

    この問題を解決するために、Wallarmパッケージの新しいGPGキーをインポートし、次のコマンドを使用してパッケージをアップグレードしてください：

    ```
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sudo apt update
    sudo apt dist-upgrade
    ```
