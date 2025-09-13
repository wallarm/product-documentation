* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleで**Administrator**ロールを持つアカウントへのアクセスが必要です
* SELinuxを無効化しているか、[手順][configure-selinux-instr]に従って設定済みである必要があります
* NGINX Plusリリース29または30（R29またはR30）が必要です

    !!! info "カスタムNGINX Plusバージョン"
        異なるバージョンを使用している場合は、[NGINXのカスタムビルドにWallarmモジュールを接続する方法][nginx-custom]の手順を参照します
* すべてのコマンドはスーパーユーザー（例: `root`）として実行します
* パッケージをダウンロードするために`https://repo.wallarm.com`へアクセスできる状態である必要があります。アクセスがファイアウォールでブロックされていないことを確認します
* US Wallarm Cloudを利用する場合は`https://us1.api.wallarm.com`、EU Wallarm Cloudを利用する場合は`https://api.wallarm.com`へアクセスできる状態である必要があります。アクセスをプロキシサーバー経由でしか設定できない場合は、[手順][configure-proxy-balancer-instr]を使用します
* 攻撃検出ルールの更新をダウンロードするため、また、[allowlisted、denylisted、またはgraylisted][ip-lists-docs]の国・地域・データセンターの正確なIPアドレスを取得するために、以下のIPアドレスへアクセスできる状態である必要があります

    --8<-- "../include/wallarm-cloud-ips.md"
* テキストエディター**vim**、**nano**、またはその他がインストールされている必要があります。本手順では**vim**を使用します