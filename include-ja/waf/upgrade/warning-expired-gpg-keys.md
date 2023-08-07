!!! 警告 "「署名が検証できません」というエラー"
    追加したGPGキーが有効期限切れの場合、次のエラーが返されます:

    ```
    W: GPG error: https://repo.wallarm.com/ubuntu/wallarm-node focal/3.6/ Release:次の
    署名は公開鍵が利用できないため検証できません: NO_PUBKEY 1111FQQW999
    E: リポジトリ 'https://repo.wallarm.com/ubuntu/wallarm-node focal/3.6/ Release' は署名されていません。
    N: このようなリポジトリからの更新は安全に行えないため、デフォルトでは無効化されています。
    N: リポジトリの作成とユーザー設定の詳細については、apt-secure(8)のマニュアルページを参照してください。
    ```

    問題を解決するには、Wallarmパッケージ用の新しいGPGキーをインポートしてから、次のコマンドを使ってパッケージをアップグレードしてください:

    ```
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sudo apt update
    sudo apt dist-upgrade
    ```