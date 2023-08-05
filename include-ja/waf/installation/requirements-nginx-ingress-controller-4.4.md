* Kubernetesプラットフォームバージョン1.23-1.25
* [Helm](https://helm.sh/)パッケージマネージャ
* あなたのサービスが[Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx)バージョン1.6.4以下と互換性があること
* Wallarm Consoleにおける**管理者**役割を持つアカウントへのアクセスを持っていること。[US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)
* US Wallarm Cloudで作業するための`https://us1.api.wallarm.com`、またはEU Wallarm Cloudで作業するための`https://api.wallarm.com`へのアクセス
* Wallarm Helmチャートを追加するための`https://charts.wallarm.com`へのアクセスを持っていること。ファイアウォールによってアクセスがブロックされていないことを確認してください
* Docker Hub上のWallarmリポジトリ`https://hub.docker.com/r/wallarm`へのアクセス。ファイアウォールによるアクセス制限がないことを確認してください
* Google Cloud StorageのIPアドレスへのアクセス[link](https://www.gstatic.com/ipranges/goog.json)。個々のIPアドレスの代わりに全国、地域、またはデータセンターを[ip-list-docs]へ許可、拒否、またはグレーリスト化した場合、WallarmノードはGoogle Storageにホストされた集約されたデータベースから関連する正確なIPアドレスを取得します。