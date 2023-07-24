					!!! warning "エラー「署名は確認できませんでした」"
    GPGキーの有効期限が切れている場合、次のエラーが返されます：

    ```
    W: GPG error: https://repo.wallarm.com/ubuntu/wallarm-node focal/4.2/ Release:次の
    署名は公開鍵が利用できないため確認できませんでした: NO_PUBKEY 1111FQQW999
    E: リポジトリ 'https://repo.wallarm.com/ubuntu/wallarm-node focal/4.2/ Release'は署名されていません。
    N: そのようなリポジトリからの更新は安全に行えません、したがってデフォルトでは無効化されています。
    N: リポジトリ作成とユーザー設定の詳細については、apt-secure(8) マンページを参照してください。
    ```

    問題を解決するには、Wallarmのパッケージのための新しいGPGキーをインポートし、次のコマンドを使ってパッケージをアップグレードしてください：

    ```
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sudo apt update
    sudo apt dist-upgrade
    ```