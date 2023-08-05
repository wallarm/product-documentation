* Kubernetesプラットフォームバージョン1.22-1.26
* 保護したいマイクロサービスにAPI呼び出しをルーティングするためのKongを設定するK8s Ingressリソース
* Kong 3.1.xとのK8s Ingressリソースの互換性
* [Helm v3](https://helm.sh/)パッケージマネージャー
* US Wallarm Cloudと連携するための`https://us1.api.wallarm.com`へのアクセスまたはEU Wallarm Cloudと連携するための`https://api.wallarm.com`へのアクセス
* WallarmのHelmチャートを追加するための`https://charts.wallarm.com`へのアクセス
* Docker Hub上のWallarmリポジトリへのアクセス `https://hub.docker.com/r/wallarm`
* [リンク](https://www.gstatic.com/ipranges/goog.json)内に記載されたGoogle Cloud StorageのIPアドレスへのアクセス。個々のIPアドレスではなく、全体の国、地域、データセンターを[許可リスト、拒否リスト、またはグレーリスト][ip-lists-docs]に登録すると、WallarmノードはGoogle Storageでホストされる集約データベースからIPリストのエントリに関連する正確なIPアドレスを取得します
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarmコンソールで**管理者**ロールのアカウントへのアクセス