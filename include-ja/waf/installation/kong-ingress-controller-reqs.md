* Kubernetesプラットフォームバージョン1.22-1.26
* KongがAPI呼び出しを保護対象のマイクロサービスにルーティングできるように構成するK8s Ingressリソース
* Kong 3.1.xとの互換性を持つK8s Ingressリソース
* [Helm v3](https://helm.sh/)パッケージマネージャ
* US Wallarm Cloudを使用して作業するために`https://us1.api.wallarm.com`へのアクセス、またはEU Wallarm Cloudを使用して作業するために`https://api.wallarm.com`へのアクセス
* Wallarm Helmチャートを追加するために`https://charts.wallarm.com`へのアクセス
* Docker Hub上のWallarmリポジトリ`https://hub.docker.com/r/wallarm`へのアクセス
* 攻撃検出ルールの更新をダウンロードするためや、[ホワイトリスト、ブラックリスト、またはグレイリストに登録された][ip-lists-docs]国、地域、データセンター用の正確なIPを取得するために、以下のIPアドレスへのアクセス

    --8<-- "../include/wallarm-cloud-ips.md"
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleで**Administrator**ロールのアカウントへのアクセス