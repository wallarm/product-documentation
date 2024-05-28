* [USクラウド](https://us1.my.wallarm.com/)あるいは[EUクラウド](https://my.wallarm.com/)のWallarm Consoleで**管理者**ロールにアクセスすること
* SELinuxは無効にするか、[指示][configure-selinux-instr]に従って設定すること
* NGINX Plusリリース28（R28）

    !!! info "カスタムNGINX Plusバージョン"
        他のバージョンを使用している場合は、[NGINXのカスタムビルドにWallarmモジュールを接続する方法][nginx-custom]の指示を参照してください
* 全てのコマンドは超ユーザー（例：`root`）として実行すること
* リクエストの処理とポストアナリティクスは別のサーバで行います：ポストアナリティクスは[指示][install-postanalytics-instr]に従って別のサーバでインストールすること
* パッケージをダウンロードするために `https://repo.wallarm.com` へのアクセス。ファイアウォールによってアクセスがブロックされていないことを確認すること
* US Wallarm Cloudを使うために `https://us1.api.wallarm.com` へのアクセス、またはEU Wallarm Cloudを使うために `https://api.wallarm.com` へのアクセス。アクセスはプロキシサーバ経由でのみ設定できる場合は、[指示][configure-proxy-balancer-instr]を使用してください
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
* テキストエディタ **vim**、 **nano**、または他のいずれかをインストールすること。この説明書では、**vim** を使用します