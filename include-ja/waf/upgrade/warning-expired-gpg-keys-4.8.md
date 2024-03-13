!!! warning "エラー「署名を検証できませんでした」"
    GPGキーの有効期限が切れていた場合、以下のエラーが返されます：

    ```
    W: GPG error: https://repo.wallarm.com/ubuntu/wallarm-node focal/4.8/ Release:次の
    署名は公開鍵が利用できないため、検証できませんでした：NO_PUBKEY 1111FQQW999
    E: リポジトリ 'https://repo.wallarm.com/ubuntu/wallarm-node focal/4.8/ Release' は署名されていません。
    N: このようなリポジトリからのアップデートは安全に行うことができず、デフォルトでは無効化されています。
    N: リポジトリの作成とユーザー設定の詳細については、apt-secure(8) マニュアルページを参照してください。
    ```

    この問題を解決するためには、Wallarmパッケージ向けの新しいGPGキーをインポートし、次に示すコマンドを使用してパッケージをアップグレードしてください：

    ```
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sudo apt update
    sudo apt dist-upgrade
    ```