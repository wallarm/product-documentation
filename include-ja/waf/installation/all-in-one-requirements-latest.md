* Wallarm Consoleの[US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)に対して**Administrator**ロールを持つアカウントへのアクセス権が必要です。
* サポート対象OS：

    * Debian 10、11および12.x
    * Ubuntu LTS 18.04、20.04、22.04
    * CentOS 7、8 Stream、9 Stream
    * Alma/Rocky Linux 9
    * Oracle Linux 9.x
    * RHEL 8.x
    * RHEL 9.x
    * Oracle Linux 8.x
    * Redox
    * SuSe Linux
    * その他（対象は継続的に拡大しています。お使いのOSが対象かどうかは[Wallarmサポートチーム](mailto:support@wallarm.com)にご確認ください）

* オールインワンのWallarmインストーラーをダウンロードするための`https://meganode.wallarm.com`へのアクセスが必要です。アクセスがファイアウォールでブロックされていないことを確認してください。
* US Wallarm Cloudで作業するための`https://us1.api.wallarm.com`へのアクセス、またはEU Wallarm Cloudで作業するための`https://api.wallarm.com`へのアクセスが必要です。アクセスをプロキシサーバー経由でのみ設定できる場合は、[手順][configure-proxy-balancer-instr]に従ってください。
* 攻撃検出ルールおよび[API仕様][api-spec-enforcement-docs]の更新をダウンロードし、また、[許可リスト、拒否リスト、またはグレーリスト][ip-lists-docs]に設定した国、地域、またはデータセンターの正確なIPを取得するために、以下のIPアドレスへのアクセスが必要です。

    --8<-- "../include/wallarm-cloud-ips.md"
* すべてのコマンドはスーパーユーザー（例：`root`）として実行します。