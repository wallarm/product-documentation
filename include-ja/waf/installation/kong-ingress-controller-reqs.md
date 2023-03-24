* Kubernetesプラットフォームバージョン 1.22-1.26
* 保護対象のマイクロサービスにAPI呼び出しをルーティングするためにKongを設定するK8s Ingressリソース
* Kong 3.1.xとK8s Ingressリソースの互換性
* [Helm v3](https://helm.sh/)パッケージマネージャ
* US Wallarm Cloudで動作させる場合は`https://us1.api.wallarm.com`へのアクセス、またはEU Wallarm Cloudで動作させる場合は`https://api.wallarm.com`へのアクセス
* Wallarm Helmチャートを追加するための`https://charts.wallarm.com`へのアクセス
* Docker Hub上のWallarmリポジトリへのアクセス `https://hub.docker.com/r/wallarm`
* [許可リスト、拒否リスト、またはグレーリスト][ip-lists-docs]の国、地域、データセンターに登録されているIPアドレスの実際のリストをダウンロードするための[GCPストレージアドレス](https://www.gstatic.com/ipranges/goog.json)へのアクセス
* [USクラウド](https://us1.my.wallarm.com/) または [EUクラウド](https://my.wallarm.com/)のWallarmコンソールで**管理者**役割を持つアカウントへのアクセス