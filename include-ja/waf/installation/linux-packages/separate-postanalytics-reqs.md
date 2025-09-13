* Wallarm Consoleの[US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)で**Administrator**ロールを持つアカウントへのアクセスが必要です
* SELinuxが無効化されているか、[手順][configure-selinux-instr]に従って構成されている必要があります
* すべてのコマンドはスーパーユーザー(例:`root`)として実行してください
* パッケージをダウンロードするために`https://repo.wallarm.com`へのアクセスが必要です。アクセスがファイアウォールでブロックされていないことを確認してください
* US Wallarm Cloudで作業する場合は`https://us1.api.wallarm.com`へのアクセス、EU Wallarm Cloudで作業する場合は`https://api.wallarm.com`へのアクセスが必要です。アクセスをプロキシサーバー経由でのみ構成できる場合は、[手順][configure-proxy-balancer-instr]を使用してください
* テキストエディタ**vim**、**nano**、またはその他のエディタがインストールされている必要があります。この記事のコマンドでは**vim**を使用します