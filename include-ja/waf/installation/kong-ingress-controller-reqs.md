* Kubernetesプラットフォームのバージョン1.22〜1.26
* Kongが保護対象のマイクロサービスへAPIリクエストをルーティングするように構成されたK8s Ingressリソース
* Kong 3.1.xと互換性のあるK8s Ingressリソース
* [Helm v3](https://helm.sh/)パッケージマネージャー
* US Wallarm Cloud利用のための`https://us1.api.wallarm.com`へのアクセス、またはEU Wallarm Cloud利用のための`https://api.wallarm.com`へのアクセス
* Wallarm Helmチャート追加のための`https://charts.wallarm.com`へのアクセス
* Docker Hub上のWallarmリポジトリ`https://hub.docker.com/r/wallarm`へのアクセス
* 攻撃検知ルールの更新のダウンロードならびに[allowlisted, denylisted, or graylisted][ip-lists-docs]の国、地域、またはデータセンターの正確なIPアドレスの取得のために、以下のIPアドレスへのアクセス

    --8<-- "../include/wallarm-cloud-ips.md"
* Wallarm Consoleの[US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)で**Administrator**ロールを持つアカウントへのアクセス