* Kubernetesプラットフォームバージョン1.24-1.27
* [Helm](https://helm.sh/) パッケージマネージャー
* あなたのサービスの互換性を[Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx)バージョン1.8.1と確認してください
* Wallarm Consoleの**管理者**ロールを持つアカウントへのアクセスが必要です。それは [US Cloud](https://us1.my.wallarm.com/) 或いは [EU Cloud](https://my.wallarm.com/) 
* 米国のWallarm Cloudと連携するための `https://us1.api.wallarm.com` へのアクセス、又はEUのWallarm Cloudと連携するための `https://api.wallarm.com` へのアクセスが必要です
* WallarmのHelmチャートを追加するための `https://charts.wallarm.com` へのアクセスが必要です。そのアクセスがファイアーウォールによってブロックされていないことを確認してください
* Docker Hub上のWallarmリポジトリ `https://hub.docker.com/r/wallarm` へのアクセスが必要です。そのアクセスがファイアーウォールによってブロックされていないことを確認してください
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
