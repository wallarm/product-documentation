!!! warning "CentOS GPGキーに関する問題"
    既にWallarmリポジトリを追加しており、無効なCentOS GPGキーに関するエラーが発生した場合は、以下の手順に従ってください：

    1. 「yum remove wallarm-node-repo」コマンドを使用して、追加したリポジトリを削除します。
    2. 上記の適切なタブからのコマンドを使用して、リポジトリを追加します。

    発生する可能性のあるエラーメッセージ：

    * `https://repo.wallarm.com/centos/wallarm-node/7/2.14/x86_64/repodata/repomd.xml: [Errno -1] repomd.xmlの署名をwallarm-node_2.14用に検証できませんでした`
    * `設定済みのリポジトリの1つが失敗しており (Wallarm Node for CentOS 7 - 2.14)、yumは継続するための十分なキャッシュデータを保持していません。`