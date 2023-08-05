					!!! warning "「署名を検証できませんでした」というエラー"
    追加されたGPGキーが期限切れになった場合、以下のエラーが返されます:

    ```
    W: GPG error: https://repo.wallarm.com/ubuntu/wallarm-node focal/4.0/ Release:次の署名は公開鍵が利用できないため検証できません: NO_PUBKEY 1111FQQW999
    E: リポジトリ'https://repo.wallarm.com/ubuntu/wallarm-node focal/4.0/ Release'は署名されていません。
    N: そのようなリポジトリからの更新は安全に行えず、デフォルトでは無効化されています。
    N: リポジトリ作成とユーザー設定の詳細については、apt-secure(8) manpageを参照してください。
    ```

    問題を解決するには、Wallarmパッケージの新しいGPGキーをインポートし、次のコマンドを使用してパッケージをアップグレードしてください:

    ```
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sudo apt update
    sudo apt dist-upgrade
    ```