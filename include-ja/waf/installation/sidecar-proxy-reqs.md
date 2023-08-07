* Kubernetes プラットフォームバージョン 1.19-1.25
* [Helm v3](https://helm.sh/) パッケージマネージャー
* Kubernetes クラスタ内の Pod としてデプロイされるアプリケーション
* US Wallarm Cloud と連携するための `https://us1.api.wallarm.com` へのアクセス、または EU Wallarm Cloud と連携するための `https://api.wallarm.com` へのアクセス
* Wallarm Helm チャートを追加するための `https://charts.wallarm.com` へのアクセス
* Docker Hub 上の Wallarm リポジトリ `https://hub.docker.com/r/wallarm` へのアクセス
* Google Cloud ストレージの IP アドレスの [リンク](https://www.gstatic.com/ipranges/goog.json) へのアクセス。個々のIPアドレスではなく、全体の国や地域、またはデータセンターを [許可リスト、拒否リスト、またはグレーリスト][ip-lists-docs] にする際、Wallarm ノードは Google Storage にホストされる集約されたデータベースから IP リストのエントリに関連する正確な IP アドレスを取得します
* Wallarm Console での **管理者** 役割を持つアカウントへのアクセス [US Cloud](https://us1.my.wallarm.com/) または [EU Cloud](https://my.wallarm.com/)