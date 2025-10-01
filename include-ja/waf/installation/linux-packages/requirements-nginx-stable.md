* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleで**Administrator**ロールを持つアカウントへのアクセスが必要があります
* SELinuxが無効化されているか、[手順][configure-selinux-instr]に従って設定されている必要があります
* NGINXバージョン1.24.0が必要があります

    !!! info "カスタムNGINXのバージョン"
        異なるバージョンをお使いの場合は、[NGINXのカスタムビルドにWallarmモジュールを接続する方法][nginx-custom]の手順を参照してください
* すべてのコマンドをスーパーユーザー（例：`root`）として実行する必要があります
* パッケージをダウンロードするための`https://repo.wallarm.com`へのアクセスが必要があります。アクセスがファイアウォールでブロックされていないことを確認してください
* USのWallarm Cloudで作業するための`https://us1.api.wallarm.com`またはEUのWallarm Cloudで作業するための`https://api.wallarm.com`へのアクセスが必要があります。アクセスをプロキシサーバー経由でのみ設定できる場合は、[手順][configure-proxy-balancer-instr]に従ってください
* 攻撃検出ルールの更新をダウンロードし、[allowlisted, denylisted, or graylisted][ip-lists-docs]の国、地域、またはデータセンターの正確なIPアドレスを取得するため、以下のIPアドレスへのアクセスが必要があります

    --8<-- "../include/wallarm-cloud-ips.md"
* **vim**、**nano**などのテキストエディターがインストールされている必要があります。本手順では**vim**を使用します