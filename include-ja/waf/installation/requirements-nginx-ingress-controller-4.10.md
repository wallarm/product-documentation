* Kubernetesプラットフォームのバージョン1.24-1.27が必要です。
* [Helm](https://helm.sh/)パッケージマネージャーが必要です。
* お使いのサービスが[Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx)バージョン1.9.5と互換性がある必要があります。
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleで**Administrator**ロールを持つアカウントへのアクセスが必要です。
* US Wallarm Cloudの利用のための`https://us1.api.wallarm.com`へのアクセス、またはEU Wallarm Cloudの利用のための`https://api.wallarm.com`へのアクセスが必要です。
* Wallarm Helmチャートを追加するための`https://charts.wallarm.com`へのアクセスが必要です。ファイアウォールでブロックされていないことを確認してください。
* Docker HubのWallarmリポジトリ`https://hub.docker.com/r/wallarm`へのアクセスが必要です。ファイアウォールでブロックされていないことを確認してください。
* 攻撃検知ルールおよび[API仕様][api-spec-enforcement-docs]の更新をダウンロードし、さらに[allowlisted、denylisted、graylisted][ip-lists-docs]の国、地域、またはデータセンターの正確なIPアドレスを取得するために、以下のIPアドレスへのアクセスが必要です。

    --8<-- "../include/wallarm-cloud-ips.md"