* Kubernetesプラットフォームバージョン1.24-1.26
* [Helm](https://helm.sh/)パッケージマネージャ
* [Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx)バージョン1.7.0以下と互換性があるサービス
* Wallarm Consoleの**Administrator**ロールを持つアカウントへのアクセスがある[US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)
* US Wallarm Cloudを利用する場合は`https://us1.api.wallarm.com`、EU Wallarm Cloudを利用する場合は`https://api.wallarm.com`へのアクセス
* Wallarm Helmチャートを追加するための`https://charts.wallarm.com`へのアクセス。ファイアウォールでアクセスがブロックされていないことを確認してください
* Docker HubのWallarmリポジトリ`https://hub.docker.com/r/wallarm`へのアクセス。ファイアウォールでアクセスがブロックされていないことを確認してください
* [許可リスト、否認リスト、グレーリスト][ip-list-docs]の国、地域、データセンターに登録されたIPアドレスの実際のリストをダウンロードするための[GCP storage addresses](https://www.gstatic.com/ipranges/goog.json)へのアクセス