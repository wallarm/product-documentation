* Wallarmコンソール内で**管理者**役割を持つアカウントへのアクセス ([USクラウド](https://us1.my.wallarm.com/) または [EUクラウド](https://my.wallarm.com/))
* SELinuxが無効または[指示][configure-selinux-instr]に従って設定されている
* すべてのコマンドをスーパーユーザー（例： `root`）として実行
* パッケージをダウンロードするための `https://repo.wallarm.com` へのアクセス。アクセスがファイアウォールによってブロックされていないことを確認してください
* US Wallarm Cloudと連携するための `https://us1.api.wallarm.com` もしくは EU Wallarm Cloudと連携するための `https://api.wallarm.com` へのアクセス。アクセスはプロキシサーバー経由でのみ設定できるなら、[指示書][configure-proxy-balancer-instr]を使用してください
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
* テキストエディター **vim**、 **nano**、または他のものがインストールされています。取り扱い説明書では、 **vim** が使用されています