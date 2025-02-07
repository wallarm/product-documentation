* Kubernetesプラットフォームバージョン1.24-1.30
* [Helm](https://helm.sh/)パッケージマネージャ
* サービスが[Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx)バージョン1.11.3と互換性があること
* Wallarm Consoleで二要素認証が無効化された**Administrator**ロールのアカウントにアクセスできること（[US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)の場合）
* US Wallarm Cloudで作業するためには`https://us1.api.wallarm.com`に、EU Wallarm Cloudで作業するためには`https://api.wallarm.com`にアクセスできること
* Wallarm Helmチャートを追加するために`https://charts.wallarm.com`にアクセスできること。ファイアウォールによってアクセスがブロックされていないことを確認してください
* Docker HubにあるWallarmリポジトリ（`https://hub.docker.com/r/wallarm`）にアクセスできること。ファイアウォールによってアクセスがブロックされていないことを確認してください
* 以下のIPアドレスにアクセスできること。これらは攻撃検知ルールのアップデートおよび[API specifications][api-spec-enforcement-docs]のダウンロード、さらに[allowlisted,denylisted,orgraylisted][ip-lists-docs]国、地域またはデータセンターに対して正確なIPの取得に使用されます

    --8<-- "../include/wallarm-cloud-ips.md"