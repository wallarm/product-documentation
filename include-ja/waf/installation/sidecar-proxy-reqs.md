* Kubernetes プラットフォームバージョン 1.19-1.25
* [Helm v3](https://helm.sh/) パッケージマネージャー
* Kubernetes クラスタ内の Pod としてデプロイされるアプリケーション
* US Wallarm Cloud と連携するための `https://us1.api.wallarm.com` へのアクセス、または EU Wallarm Cloud と連携するための `https://api.wallarm.com` へのアクセス
* Wallarm Helm チャートを追加するための `https://charts.wallarm.com` へのアクセス
* Docker Hub 上の Wallarm リポジトリ `https://hub.docker.com/r/wallarm` へのアクセス
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
* Wallarm Console での **管理者** 役割を持つアカウントへのアクセス [US Cloud](https://us1.my.wallarm.com/) または [EU Cloud](https://my.wallarm.com/)