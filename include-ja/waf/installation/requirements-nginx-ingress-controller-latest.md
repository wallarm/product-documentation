* Kubernetesプラットフォームバージョン1.24-1.27
* [Helm](https://helm.sh/) パッケージマネージャー
* あなたのサービスの互換性を[Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx)バージョン1.8.1と確認してください
* Wallarm Consoleの**管理者**ロールを持つアカウントへのアクセスが必要です。それは [US Cloud](https://us1.my.wallarm.com/) 或いは [EU Cloud](https://my.wallarm.com/) 
* 米国のWallarm Cloudと連携するための `https://us1.api.wallarm.com` へのアクセス、又はEUのWallarm Cloudと連携するための `https://api.wallarm.com` へのアクセスが必要です
* WallarmのHelmチャートを追加するための `https://charts.wallarm.com` へのアクセスが必要です。そのアクセスがファイアーウォールによってブロックされていないことを確認してください
* Docker Hub上のWallarmリポジトリ `https://hub.docker.com/r/wallarm` へのアクセスが必要です。そのアクセスがファイアーウォールによってブロックされていないことを確認してください
* [このリンク](https://www.gstatic.com/ipranges/goog.json)に示されたGoogle Cloud StorageのIPアドレスへのアクセスが必要です。個々のIPアドレスの代わりに、全体の国、地域、データセンターを[許可リスト、拒否リスト、或いはグレーリスト][ip-list-docs]にする場合、WallarmノードはGoogle Storageにホストされた集約されたデーアベースから関連する正確なIPアドレスを取得します