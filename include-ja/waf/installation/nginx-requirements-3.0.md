* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleで**Administrator**または**Deploy**ロールを持つアカウントへのアクセス権が必要です
* SELinuxは無効化されているか、[手順][configure-selinux-instr]に従って設定されています。
* すべてのコマンドはスーパーユーザー（例: `root`）として実行します。
* リクエスト処理とpostanalyticsを別サーバーで実行する場合は、[手順][install-postanalytics-instr]に従ってpostanalyticsが別サーバーにインストールされている必要があります。
* パッケージをダウンロードするために`https://repo.wallarm.com`へアクセスできる必要があります。アクセスがファイアウォールでブロックされていないことを確認します。
* US Wallarm Cloudで使用する場合は`https://us1.api.wallarm.com:444`、EU Wallarm Cloudで使用する場合は`https://api.wallarm.com:444`へアクセスできる必要があります。アクセスをプロキシサーバー経由でのみ設定できる場合は、[手順][configure-proxy-balancer-instr]に従います。
* 以下のIPアドレスへアクセスできる必要があります。これは、攻撃検出ルールの更新をダウンロードするほか、[allowlisted, denylisted, or graylisted][ip-lists-docs]の国・地域・データセンターの正確なIPアドレスを取得するためにも必要です。

    --8<-- "../include/wallarm-cloud-ips.md"
* テキストエディタ**vim**、**nano**、またはその他がインストールされている必要があります。本手順では**vim**を使用します。