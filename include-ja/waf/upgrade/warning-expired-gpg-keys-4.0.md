					!!! 警告 "「署名を検証できません」エラー"
    追加したGPGキーが期限切れの場合、次のエラーが返されます：

    ```
    W: GPG error: https://repo.wallarm.com/ubuntu/wallarm-node focal/4.0/ Release:次の
    署名を検証できませんでした。公開キーが利用できないからです：NO_PUBKEY 1111FQQW999
    E: リポジトリ'https://repo.wallarm.com/ubuntu/wallarm-node focal/4.0/ Release'は署名されていません。
    N: このようなリポジトリからの更新は安全に行えません。そのため、デフォルトでは無効化されています。
    N: リポジトリ作成とユーザー設定の詳細はapt-secure(8)マニュアルページを参照してください。
    ```

    問題を修正するために、Wallarmパッケージ用の新しいGPGキーをインポートし、次に以下のコマンドを使用してパッケージをアップグレードしてください：

    ```
    curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
    sudo apt update
    sudo apt dist-upgrade
    ```