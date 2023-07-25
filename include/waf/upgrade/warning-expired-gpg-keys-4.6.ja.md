					!!! 警告 "署名を確認できませんでしたというエラー"
    GPGキーが期限切れであれば、以下のエラーが返されます：

    ```
    W: GPG error: https://repo.wallarm.com/ubuntu/wallarm-node focal/4.6/ Release:次の署名は公開キーが存在しないため確認できません：NO_PUBKEY 1111FQQW999
    E: リポジトリ 'https://repo.wallarm.com/ubuntu/wallarm-node focal/4.6/ Release'は署名されていません。
    N: そのようなリポジトリからの更新は安全に行うことができず、デフォルトでは無効化されています。
    N: リポジトリの作成とユーザー設定の詳細については、apt-secure(8) manpageを参照してください。
    ```

    この問題を解決するには、Wallarmパッケージに新しいGPGキーをインポートし、次のコマンドを使用してパッケージをアップグレードしてください：

    ```
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sudo apt update
    sudo apt dist-upgrade
    ```