* Wallarm Consoleの[US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)で**Administrator**ロールを持つアカウントへのアクセス権が必要があります
* SELinuxを無効化している、または[手順][configure-selinux-instr]に従って設定している必要があります
* すべてのコマンドをスーパーユーザー（例：`root`）として実行する必要があります
* パッケージをダウンロードするために`https://repo.wallarm.com`へアクセスできる必要があります。アクセスがファイアウォールによってブロックされていないことを確認してください
* US Wallarm Cloudで作業する場合は`https://us1.api.wallarm.com`、EU Wallarm Cloudで作業する場合は`https://api.wallarm.com`へアクセスできる必要があります。アクセスをプロキシサーバー経由でのみ構成できる場合は、[手順][configure-proxy-balancer-instr]に従ってください
* 攻撃検出ルールの更新をダウンロードし、[許可リスト、拒否リスト、またはグレーリスト][ip-lists-docs]に登録した国、地域、またはデータセンターの正確なIPを取得するために、以下のIPアドレスへアクセスできる必要があります

    --8<-- "../include/wallarm-cloud-ips.md"
* テキストエディタ**vim**、**nano**、またはその他がインストールされている必要があります。この手順では**vim**を使用します