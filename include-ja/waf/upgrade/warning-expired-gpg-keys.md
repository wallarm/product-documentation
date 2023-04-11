!!! warning "エラー「署名を検証できませんでした」"
    追加されたGPGキーが期限切れの場合、次のエラーが返されます：

    ```
    W: GPG error: https://repo.wallarm.com/ubuntu/wallarm-node focal/3.6/ Release:以下の
    署名は、公開キーが利用できないため検証できません：NO_PUBKEY 1111FQQW999
    E: リポジトリ'https://repo.wallarm.com/ubuntu/wallarm-node focal/3.6/ Release' は署名されていません。
    N: このようなリポジトリからの更新は安全には行えず、デフォルトで無効になっています。
    N: リポジトリ作成とユーザー設定の詳細については、apt-secure(8)のマンページを参照してください。
    ```

    問題を解決するには、Wallarmパッケージ用の新しいGPGキーをインポートし、次のコマンドを使用してパッケージをアップグレードしてください：

    ```
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sudo apt update
    sudo apt dist-upgrade
    ```