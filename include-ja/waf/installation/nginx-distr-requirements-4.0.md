* [USクラウド](https://us1.my.wallarm.com/)または[EUクラウド](https://my.wallarm.com/)のWallarm Consoleでの**管理者**役割を持つアカウントへのアクセス
* SELinuxは無効化されるか、[指示][configure-selinux-instr]に従って設定されます
* 全てのコマンドはスーパーユーザー（例えば `root`）として実行します
* リクエスト処理とポストアナリティクスを別々のサーバーで行己う場合：ポストアナリティクスは[指示][install-postanalytics-instr]に従って別のサーバーにインストールされます
* パッケージをダウンロードするための`https://repo.wallarm.com`へのアクセス。ファイアウォールによってアクセスがブロックされないことを確認してください
* US Wallarm Cloudで作業するための`https://us1.api.wallarm.com`またはEU Wallarm Cloudで作業するための`https://api.wallarm.com`へのアクセス。アクセスはプロキシサーバ経由でのみ設定することができる場合、[指示][configure-proxy-balancer-instr]を使用してください
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
* **vim**、**nano**、または他の任意のテキストエディターがインストールされています。この指示では、**vim**を使用します
