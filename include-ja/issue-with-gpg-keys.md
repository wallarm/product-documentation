					!!! warning "CentOS GPGキーに関する問題"
    既にWallarmリポジトリを追加し、無効なCentOS GPGキーに関連するエラーが発生している場合は、次の手順に従ってください：

    1. `yum remove wallarm-node-repo`コマンドを使用して追加したリポジトリを削除します。
    2. 上記の適切なタブからのコマンドを使用して、リポジトリを追加します。

    可能なエラーメッセージ：

    * `https://repo.wallarm.com/centos/wallarm-node/7/2.14/x86_64/repodata/repomd.xml: [Errno -1] repomd.xmlの署名はwallarm-node_2.14用に検証できませんでした`
    * `設定されたリポジトリの1つに失敗しました（CentOS 7用のWallarm Node - 2.14）、yumには続行するための十分なキャッシュデータがありません。`