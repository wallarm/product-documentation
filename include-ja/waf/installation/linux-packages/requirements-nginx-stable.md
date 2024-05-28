* [US Cloud](https://us1.my.wallarm.com/) または [EU Cloud](https://my.wallarm.com/) のWallarmコンソールで **管理者** ロールを持つアカウントへのアクセス
* SELinux が無効になっているか、[こちらの指示][configure-selinux-instr]に従って設定すること
* NGINXのバージョンは1.24.0

    !!! info "カスタムNGINX版"
        他のバージョンをお持ちの場合は、[こちらの指示][nginx-custom]に従ってWallarmモジュールをカスタムビルドのNGINXに接続する方法を参照してください
* すべてのコマンドをスーパーユーザー（例： `root`）で実行
* パッケージをダウンロードするための `https://repo.wallarm.com` へのアクセス。ファイアウォールによってアクセスがブロックされていないことを確認
* US Wallarm Cloudと連携するための `https://us1.api.wallarm.com` または EU Wallarm Cloudと連携するための `https://api.wallarm.com` へのアクセス。アクセスをプロキシサーバー経由でのみ設定する場合は、[こちらの指示][configure-proxy-balancer-instr]を使用
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
* テキストエディター **vim**、**nano**、またはそれ以外のものをインストール。指示では、**vim** を使用