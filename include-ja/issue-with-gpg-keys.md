!!! warning "CentOSのGPGキーに関する問題"
    すでにWallarmリポジトリを追加していて、CentOSのGPGキーが無効であることに関連するエラーが発生した場合は、次の手順に従ってください:

    1. 追加したリポジトリを`yum remove wallarm-node-repo`コマンドで削除します。
    2. 上の該当するタブにあるコマンドを使用してリポジトリを追加します。

    考えられるエラーメッセージ:

    * `https://repo.wallarm.com/centos/wallarm-node/7/2.14/x86_64/repodata/repomd.xml: [Errno -1] repomd.xml signature could not be verified for wallarm-node_2.14`
    * `One of the configured repositories failed (Wallarm Node for CentOS 7 - 2.14), and yum doesn't have enough cached data to continue.`