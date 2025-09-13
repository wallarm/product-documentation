* Kubernetesプラットフォームのバージョンは1.24-1.27である必要があります。
* [Helm](https://helm.sh/)パッケージマネージャーが必要です。
* ご利用のサービスが[Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx)バージョン1.9.5と互換性がある必要があります。
* Wallarm Consoleの[US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)で**Administrator**ロールを持つアカウントへのアクセスが必要です。
* USのWallarm Cloudで作業する場合は`https://us1.api.wallarm.com`、EUのWallarm Cloudで作業する場合は`https://api.wallarm.com`へのアクセスが必要です。
* WallarmのHelmチャートを追加するために`https://charts.wallarm.com`へのアクセスが必要です。ファイアウォールでブロックされていないことを確認してください。
* Docker HubのWallarmリポジトリ`https://hub.docker.com/r/wallarm`へのアクセスが必要です。ファイアウォールでブロックされていないことを確認してください。
* 攻撃検出ルールの更新をダウンロードするため、また、[allowlisted, denylisted, or graylisted][ip-lists-docs]の国、地域、またはデータセンターの正確なIPを取得するために、以下のIPアドレスへのアクセスが必要です。

    --8<-- "../include/wallarm-cloud-ips.md"