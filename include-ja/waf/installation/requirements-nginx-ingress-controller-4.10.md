* Kubernetesプラットフォームバージョン1.24-1.27
* [Helm](https://helm.sh/)パッケージマネージャー
* お客様のサービスが[Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx)バージョン1.9.5と互換性があること
* Wallarm Consoleで[US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)の**Administrator**ロールを持つアカウントにアクセスでき、かつ二段階認証が無効になっていること
* US Wallarm Cloudを利用するために`https://us1.api.wallarm.com`へ、またはEU Wallarm Cloudを利用するために`https://api.wallarm.com`へアクセスできること
* Wallarm Helmチャートを追加するために`https://charts.wallarm.com`へアクセスでき、ファイアウォールによりアクセスがブロックされていないことを確認してください
* Docker Hub上のWallarmリポジトリ（`https://hub.docker.com/r/wallarm`）へアクセスでき、ファイアウォールによりアクセスがブロックされていないことを確認してください
* 攻撃検知ルールの更新および[API仕様][api-spec-enforcement-docs]のダウンロード、ならびに[許可リスト、拒否リスト、またはグレイリスト][ip-lists-docs]に登録された国、地域、データセンターに対する正確なIPの取得のために、以下のIPアドレスへアクセスできること

    --8<-- "../include/wallarm-cloud-ips.md"