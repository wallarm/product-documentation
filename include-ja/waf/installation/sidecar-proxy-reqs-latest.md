* Kubernetesプラットフォームのバージョン1.19-1.29
* [Helm v3](https://helm.sh/)パッケージマネージャー
* KubernetesクラスタにPodとしてデプロイされたアプリケーション
* USWallarmCloudで作業するためには`https://us1.api.wallarm.com`、またはEUWallarmCloudで作業するためには`https://api.wallarm.com`へのアクセスが必要です
* WallarmHelmチャートを追加するために`https://charts.wallarm.com`へのアクセスが必要です
* DockerHub上のWallarmリポジトリ`https://hub.docker.com/r/wallarm`へのアクセスが必要です
* 攻撃検知ルールの更新および[API仕様][api-spec-enforcement-docs]のダウンロード、さらに[許可リスト、拒否リスト、またはグレイリスト][ip-lists-docs]に登録された国、地域、もしくはデータセンターの正確なIP取得のため、以下のIPアドレスへのアクセスが必要です

    --8<-- "../include/wallarm-cloud-ips.md"
* WallarmConsole内の**Administrator**ロールを持つアカウントへのアクセスが必要です。[USCloud](https://us1.my.wallarm.com/)または[EUCloud](https://my.wallarm.com/)用です