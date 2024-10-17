* Kubernetesプラットフォームバージョン1.22-1.26
* 保護したいマイクロサービスにAPI呼び出しをルーティングするためのKongを設定するK8s Ingressリソース
* Kong 3.1.xとのK8s Ingressリソースの互換性
* [Helm v3](https://helm.sh/)パッケージマネージャー
* US Wallarm Cloudと連携するための`https://us1.api.wallarm.com`へのアクセスまたはEU Wallarm Cloudと連携するための`https://api.wallarm.com`へのアクセス
* WallarmのHelmチャートを追加するための`https://charts.wallarm.com`へのアクセス
* Docker Hub上のWallarmリポジトリへのアクセス `https://hub.docker.com/r/wallarm`
* Access to the IP addresses below for downloading updates to attack detection rules, as well as retrieving precise IPs for your allowlisted, denylisted, or graylisted countries, regions, or data centers

    --8<-- "../include/wallarm-cloud-ips.md"
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarmコンソールで**管理者**ロールのアカウントへのアクセス