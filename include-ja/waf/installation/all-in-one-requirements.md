* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)用Wallarm Consoleで**Administrator**ロールのアカウントにアクセスできること。
* 対応OS:
    * Debian 10, 11および12.x
    * Ubuntu LTS 18.04, 20.04, 22.04
    * CentOS 7, 8 Stream, 9 Stream
    * Alma/Rocky Linux 9
    * RHEL 8.x
    * Oracle Linux 8.x
    * Oracle Linux 9.x
    * Redox
    * SuSe Linux
    * その他（リストは随時拡大中です。お使いのOSがリストに含まれているか確認するため、[Wallarm support team](mailto:support@wallarm.com)にお問い合わせください。）
* `https://meganode.wallarm.com`へアクセスし、オールインワンWallarmインストーラーをダウンロードしてください。ファイアウォールによりアクセスがブロックされていないことを確認します。
* US Wallarm Cloud用の場合は`https://us1.api.wallarm.com`、またEU Wallarm Cloud用の場合は`https://api.wallarm.com`へアクセスしてください。アクセスがプロキシサーバ経由でのみ構成可能な場合は[手順][configure-proxy-balancer-instr]を参照してください。
* 攻撃検知ルールのアップデートのダウンロードや[allowlisted, denylisted, or graylisted][ip-lists-docs]な国、地域、またはデータセンターに対する正確なIPを取得するため、下記のIPアドレスへアクセスしてください

    --8<-- "../include/wallarm-cloud-ips.md"
* すべてのコマンドをスーパーユーザー（例: `root`）として実行してください。