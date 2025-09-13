* Wallarm Consoleの[US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)で**Administrator**ロールを持つアカウントへのアクセスが必要です。
* オールインワンのWallarmインストーラをダウンロードするために`https://meganode.wallarm.com`にアクセスできる必要があります。アクセスがファイアウォールでブロックされていないことを確認してください。
* US Wallarm Cloudで作業するための`https://us1.api.wallarm.com`またはEU Wallarm Cloudで作業するための`https://api.wallarm.com`へのアクセスが必要です。アクセスの設定がプロキシサーバー経由でのみ可能な場合は、[手順][configure-proxy-balancer-instr]に従ってください。
* すべてのコマンドをスーパーユーザー（例: `root`）として実行する必要があります。
* 攻撃検知ルールおよびAPI仕様の更新をダウンロードし、allowlisted、denylisted、graylistedの国、地域、またはデータセンターの正確なIPを取得するために、以下のIPアドレスへのアクセスが必要です。

    --8<-- "../include/wallarm-cloud-ips.md"