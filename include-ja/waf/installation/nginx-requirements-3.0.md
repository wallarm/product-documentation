* [US Cloud](https://us1.my.wallarm.com/) または [EU Cloud](https://my.wallarm.com/) のWallarmコンソールで2要素認証が無効化された **管理者** または **Deploy** 役割のアカウントへのアクセス
* SELinuxが無効化されているか、[指示書][configure-selinux-instr]に基づき設定されている
* すべてのコマンドをスーパーユーザー（例：`root`）として実行
* リクエスト処理とポストアナリティクスを異なるサーバーで行う場合：ポストアナリティクスが[指示書][install-postanalytics-instr]に基づき別のサーバーにインストールされている
* パッケージをダウンロードするための `https://repo.wallarm.com` へのアクセス。 アクセスがファイヤーウォールによりブロックされていないことを確認してください
* US Wallarm Cloudで作業するための `https://us1.api.wallarm.com:444` へのアクセス、または EU Wallarm Cloudで作業するための `https://api.wallarm.com:444` へのアクセス。アクセスがプロキシサーバー経由でのみ設定できる場合は、[指示書][configure-proxy-balancer-instr]を使用してください
* Access to the IP addresses below for downloading updates to attack detection rules, as well as retrieving precise IPs for your allowlisted, denylisted, or graylisted countries, regions, or data centers

    === "US Cloud"
        ```
        34.96.64.17
        34.110.183.149
        ```
    === "EU Cloud"
        ```
        34.160.38.183
        34.144.227.90
        ```
* テキストエディタ **vim**、**nano** またはそれ以外のものがインストールされている。 この指示書では **vim** を使用しています