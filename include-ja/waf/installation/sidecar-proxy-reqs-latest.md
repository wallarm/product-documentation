* Kubernetesプラットフォームのバージョン1.19〜1.29が必要です
* [Helm v3](https://helm.sh/)パッケージマネージャーが必要です
* Kubernetesクラスター内にPodとしてデプロイされたアプリケーションが必要です
* US Wallarm Cloudを使用するための`https://us1.api.wallarm.com`へのアクセス、またはEU Wallarm Cloudを使用するための`https://api.wallarm.com`へのアクセスが必要です
* WallarmのHelmチャートを追加するための`https://charts.wallarm.com`へのアクセスが必要です
* Docker Hub上のWallarmリポジトリ`https://hub.docker.com/r/wallarm`へのアクセスが必要です
* 以下のIPアドレスへのアクセスが必要です。これは、攻撃検知ルールおよび[API仕様][api-spec-enforcement-docs]の更新をダウンロードし、さらにお客様の[allowlisted, denylisted, or graylisted][ip-lists-docs]の国、地域、またはデータセンターに対応する正確なIPアドレスを取得するために必要です

    --8<-- "../include/wallarm-cloud-ips.md"
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleで**Administrator**ロールを持つアカウントへのアクセスが必要です