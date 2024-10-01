* Kubernetesプラットフォームバージョン1.23-1.25
* [Helm](https://helm.sh/)パッケージマネージャ
* あなたのサービスが[Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx)バージョン1.6.4以下と互換性があること
* Wallarm Consoleにおける**管理者**役割を持つアカウントへのアクセスを持っていること。[US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)
* US Wallarm Cloudで作業するための`https://us1.api.wallarm.com`、またはEU Wallarm Cloudで作業するための`https://api.wallarm.com`へのアクセス
* Wallarm Helmチャートを追加するための`https://charts.wallarm.com`へのアクセスを持っていること。ファイアウォールによってアクセスがブロックされていないことを確認してください
* Docker Hub上のWallarmリポジトリ`https://hub.docker.com/r/wallarm`へのアクセス。ファイアウォールによるアクセス制限がないことを確認してください
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
