!!! info "複数のWallarmノードをデプロイする場合"
　環境にデプロイされたすべてのWallarmノードは、**同じバージョン**でなければなりません。分離されたサーバーにインストールされたポストアナリティクスモジュールも**同じバージョン**でなければなりません。

追加のノードのインストール前に、そのバージョンがすでにデプロイされているモジュールのバージョンと一致していることを確認してください。デプロイされたモジュールのバージョンが[廃止されるか、近日中に廃止される（`4.0`以下）][versioning-policy]場合は、すべてのモジュールを最新バージョンにアップグレードしてください。

同じサーバーにデプロイされたフィルタリングノードとポストアナリティクスモジュールのバージョンを確認するには：

=== "Debian"
    ```bash
    apt list wallarm-node
    ```
=== "CentOS"
    ```bash
    yum list wallarm-node
    ```

異なるサーバーにデプロイされたフィルタリングノードとポストアナリティクスモジュールのバージョンを確認するには：

=== "Debian"
    ```bash
    # Wallarmフィルタリングノードがインストールされているサーバーから実行
    apt list wallarm-node-nginx
    # ポストアナリティクスがインストールされているサーバーから実行
    apt list wallarm-node-tarantool
    ```
=== "CentOS"
    ```bash
    # Wallarmフィルタリングノードがインストールされているサーバーから実行
    yum list wallarm-node-nginx
    # ポストアナリティクスがインストールされているサーバーから実行
    yum list wallarm-node-tarantool
    ```