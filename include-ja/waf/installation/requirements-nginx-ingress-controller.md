* Kubernetesプラットフォームバージョン1.24-1.27
* [Helm](https://helm.sh/)パッケージマネージャ
* お客様のサービスが[Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx)バージョン1.9.5と互換性があること
* Wallarm Consoleの[US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)において、**Administrator**ロールが付与され、二要素認証が無効になっているアカウントへのアクセス
* US Wallarm Cloudの利用のために`https://us1.api.wallarm.com`にアクセスできること。またはEU Wallarm Cloudの利用のために`https://api.wallarm.com`にアクセスできること
* Wallarm Helmチャートを追加するために`https://charts.wallarm.com`にアクセスできること。ファイアウォールによってアクセスがブロックされていないことをご確認ください
* Docker Hub上のWallarmリポジトリ(`https://hub.docker.com/r/wallarm`)にアクセスできること。ファイアウォールによってアクセスがブロックされていないことをご確認ください
* 以下のIPアドレスにアクセスできること。これにより、攻撃検出ルールの更新をダウンロードしたり、お客様の[allowlisted,denylisted,or graylisted][ip-lists-docs]の国、地域、またはデータセンターに対応する正確なIPを取得できるようになります
    --8<-- "../include/wallarm-cloud-ips.md"