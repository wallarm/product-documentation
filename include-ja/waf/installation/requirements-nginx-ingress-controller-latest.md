* Kubernetesプラットフォームのバージョンは1.26〜1.30です
* [Helm](https://helm.sh/)パッケージマネージャーが必要です
* 運用中のサービスが[Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx)バージョン1.11.5と互換性があります
* Wallarm Consoleの[US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)で**Administrator**ロールを持つアカウントへのアクセス権が必要です
* US Wallarm Cloudでの作業用`https://us1.api.wallarm.com`へのアクセス、またはEU Wallarm Cloudでの作業用`https://api.wallarm.com`へのアクセスが必要です
* WallarmのHelmチャートを追加するための`https://charts.wallarm.com`へのアクセスが必要です。アクセスがファイアウォールによりブロックされていないことを確認します
* Docker Hub上のWallarmリポジトリ`https://hub.docker.com/r/wallarm`へのアクセスが必要です。アクセスがファイアウォールによりブロックされていないことを確認します
* 攻撃検知ルールおよび[API仕様][api-spec-enforcement-docs]の更新をダウンロードし、さらに[allowlisted, denylisted, or graylisted][ip-lists-docs]の国・地域・データセンターの正確なIPアドレスを取得するために、以下のIPアドレスへのアクセスが必要です

    --8<-- "../include/wallarm-cloud-ips.md"