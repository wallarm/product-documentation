* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)向けのWallarm Consoleで**Administrator**ロールを持つアカウントにアクセスできる必要があります。
* サポート対象OSは次のとおりです。
    
    * Debian 10、11および12.x
    * Ubuntu LTS 18.04、20.04、22.04
    * CentOS 7、8 Stream、9 Stream
    * Alma/Rocky Linux 9
    * RHEL 8.x
    * Oracle Linux 8.x
    * Oracle Linux 9.x
    * Redox
    * SuSe Linux
    * その他（対応OSは継続的に拡大しています。ご利用のOSが含まれるかは[Wallarmサポートチーム](mailto:support@wallarm.com)へお問い合わせください）
* all-in-one Wallarmインストーラーをダウンロードするために`https://meganode.wallarm.com`へアクセスできる必要があります。アクセスがファイアウォールでブロックされていないことを確認してください。
* US Wallarm Cloudを利用するための`https://us1.api.wallarm.com`、またはEU Wallarm Cloudを利用するための`https://api.wallarm.com`へのアクセスが必要です。アクセスをプロキシサーバー経由でのみ構成できる場合は、[手順][configure-proxy-balancer-instr]を参照してください。
* 攻撃検知ルールの更新をダウンロードし、[allowlisted、denylisted、graylisted][ip-lists-docs]の国、地域、またはデータセンターの正確なIPアドレスを取得するために、以下のIPアドレスへアクセスできる必要があります。
    
    --8<-- "../include/wallarm-cloud-ips.md"
* すべてのコマンドはスーパーユーザー（例: `root`）として実行する必要があります。