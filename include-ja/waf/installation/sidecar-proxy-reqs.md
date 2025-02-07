* Kubernetesプラットフォームバージョン1.19-1.29
* [Helm v3](https://helm.sh/)パッケージマネージャー
* Kubernetesクラスタ内にPodとしてデプロイされたアプリケーション
* US Wallarm Cloudでの利用には`https://us1.api.wallarm.com`に、EU Wallarm Cloudでの利用には`https://api.wallarm.com`にアクセスします
* Wallarm Helmチャートを追加するために`https://charts.wallarm.com`にアクセスします
* Docker HubのWallarmリポジトリ（`https://hub.docker.com/r/wallarm`）にアクセスします
* 攻撃検知ルールの更新をダウンロードするためや、[許可リスト、拒否リスト、またはグレイリスト][ip-lists-docs]に登録した国、地域、またはデータセンター向けの正確なIPアドレスを取得するため、以下のIPアドレスにアクセスします

    --8<-- "../include/wallarm-cloud-ips.md"
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleで**Administrator**ロールのアカウントにアクセスします