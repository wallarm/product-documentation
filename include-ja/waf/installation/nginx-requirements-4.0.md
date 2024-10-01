* Wallarm Consoleで**管理者**役割を持つアカウントへのアクセス（[US Cloud](https://us1.my.wallarm.com/) や [EU Cloud](https://my.wallarm.com/)）
* SELinuxが無効化されているか、[手順][configure-selinux-instr]に従って設定されていること
* NGINXのバージョンが1.24.0であること

    !!! info "カスタムNGINXバージョン"
        異なるバージョンをお持ちの場合、[カスタムビルドのNGINXにWallarmモジュールを接続する方法][nginx-custom] の指示に従ってください
* 全てのコマンドをスーパーユーザー(例: `root`)として実行すること
* リクエスト処理とポスト分析を別々のサーバーで行う場合：[手順][install-postanalytics-instr]に従って別のサーバーにポスト分析をインストールすること
* パッケージをダウンロードするための `https://repo.wallarm.com`へのアクセス。ファイアウォールによってアクセスがブロックされていないことを確認してください
* US Wallarm Cloudを利用するための `https://us1.api.wallarm.com` または EU Wallarm Cloudを利用するための `https://api.wallarm.com`へのアクセス。アクセスはプロキシサーバー経由のみで設定可能な場合は、[手順][configure-proxy-balancer-instr]を使用してください
* Access to the IP addresses below for downloading updates to attack detection rules, as well as retrieving precise IPs for your allowlisted, denylisted, or graylisted countries, regions, or data centers

    === "US Cloud"
        ```
        34.96.64.17
        34.110.183.149
        35.235.66.155
        ```
    === "EU Cloud"
        ```
        34.160.38.183
        34.144.227.90
        34.90.110.226
        ```
* テキストエディター **vim**、**nano**、またはそれ以外のものをインストールしていること。この説明書では**vim**を使用します