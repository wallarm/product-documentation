* Wallarm Consoleで[US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のアカウントに**Administrator**または**Deploy**ロールが付与され、二要素認証が無効になっている状態でアクセスしてください。
* SELinuxが無効、または[手順][configure-selinux-instr]に従って設定されている必要があります。
* すべてのコマンドをスーパーユーザー（例：`root`）として実行してください。
* リクエスト処理とポストアナリティクスを異なるサーバーで実行する場合は、[手順][install-postanalytics-instr]に従って別のサーバーにポストアナリティクスをインストールしてください。
* パッケージをダウンロードするために`https://repo.wallarm.com`にアクセスできる状態にし、ファイアウォールでアクセスがブロックされないようにしてください。
* US Wallarm Cloudで作業する場合は`https://us1.api.wallarm.com:444`、EU Wallarm Cloudで作業する場合は`https://api.wallarm.com:444`にアクセスしてください。アクセスをプロキシサーバー経由にのみ設定できる場合は、[手順][configure-proxy-balancer-instr]に従ってください。
* 攻撃検知ルールのアップデートをダウンロードするため、また[allowlisted,denylisted,またはgraylisted][ip-lists-docs]の国、地域、またはデータセンターに対して正確なIPを取得するために、以下のIPアドレスにアクセスしてください

    --8<-- "../include/wallarm-cloud-ips.md"
* テキストエディタ**vim**、**nano**またはその他のエディタがインストールされている必要があります。手順では**vim**が使用されています。