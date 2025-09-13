* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleで**Administrator**または**Deploy**ロールを持つアカウントへのアクセス権が必要です
* SELinuxを無効化するか、[手順][configure-selinux-instr]に従って構成されている必要があります
* すべてのコマンドはスーパーユーザー(例: `root`)として実行する必要があります
* リクエスト処理とpostanalyticsを別サーバーで行う場合は、[手順][install-postanalytics-instr]に従ってpostanalyticsが別サーバーにインストールされている必要があります
* パッケージをダウンロードするために`https://repo.wallarm.com`へアクセスできる必要があります。ファイアウォールでアクセスがブロックされていないことを確認してください
* US Wallarm Cloudで作業するには`https://us1.api.wallarm.com:444`へ、EU Wallarm Cloudで作業するには`https://api.wallarm.com:444`へアクセスできる必要があります。アクセスをプロキシサーバー経由でのみ設定できる場合は、[手順][configure-proxy-balancer-instr]に従ってください
* テキストエディター**vim**、**nano**、またはその他がインストールされている必要があります。この手順では**vim**を使用します