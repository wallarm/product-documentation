* Kubernetesプラットフォームのバージョンは1.19-1.29である必要があります。
* パッケージマネージャー[Helm v3](https://helm.sh/)が必要です。
* Kubernetesクラスター内でPodとしてデプロイされたアプリケーションが必要です。
* US Wallarm Cloudの利用には`https://us1.api.wallarm.com`へのアクセス、EU Wallarm Cloudの利用には`https://api.wallarm.com`へのアクセスが必要です。
* Wallarm Helmチャートを追加するために`https://charts.wallarm.com`へのアクセスが必要です。
* Docker Hub上のWallarmリポジトリ`https://hub.docker.com/r/wallarm`へのアクセスが必要です。
* 攻撃検知ルールの更新をダウンロードし、さらに、[許可リスト、拒否リスト、またはグレーリストに登録された][ip-lists-docs]国、地域、またはデータセンターの正確なIPアドレスを取得するために、以下のIPアドレスへのアクセスが必要です。

    --8<-- "../include/wallarm-cloud-ips.md"
* Wallarm Consoleで**Administrator**ロールを持つアカウントへのアクセスが、[US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)向けに必要です。