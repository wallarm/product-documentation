!!! warning "CentOS GPG鍵に関する問題"
    すでにWallarmリポジトリを追加して、無効なCentOS GPG鍵に関連するエラーが発生した場合は、以下の手順を実行してください：

    1. `yum remove wallarm-node-repo`コマンドを使用して追加したリポジトリを削除します。
    2. 上記の適切なタブからコマンドを使用してリポジトリを追加します。

    可能なエラーメッセージ：

    * `https://repo.wallarm.com/centos/wallarm-node/7/2.14/x86_64/repodata/repomd.xml: [Errno -1] repomd.xml signature could not be verified for wallarm-node_2.14`
    * `One of the configured repositories failed (Wallarm Node for CentOS 7 - 2.14), and yum doesn't have enough cached data to continue.`