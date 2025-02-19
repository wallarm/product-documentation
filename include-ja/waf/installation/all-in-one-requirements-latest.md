* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarmコンソールにおいて**Administrator**ロールのアカウントへアクセスします。
* 対応OS:

    * Debian 10、11、12.x
    * Ubuntu LTS 18.04、20.04、22.04
    * CentOS 7、8 Stream、9 Stream
    * Alma/Rocky Linux 9
    * RHEL 8.x
    * RHEL 9.x
    * Oracle Linux 8.x
    * Redox
    * SuSe Linux
    * その他（リストは常に拡大しており、該当OSが含まれているか、[Wallarm support team](mailto:support@wallarm.com)にお問い合わせください）

* オールインワンWallarmインストーラーをダウンロードするため、`https://meganode.wallarm.com`へのアクセスが必要です。ファイアウォールによりアクセスがブロックされていないことを確認します。
* US Wallarm Cloudを利用する場合は`https://us1.api.wallarm.com`へのアクセス、あるいはEU Wallarm Cloudを利用する場合は`https://api.wallarm.com`へのアクセスが必要です。プロキシサーバー経由でのみアクセスを構成できる場合は、[instructions][configure-proxy-balancer-instr]を参照します。
* 攻撃検知ルールのアップデートと[API specifications][api-spec-enforcement-docs]のダウンロード、さらに[allowlisted, denylisted, or graylisted][ip-lists-docs]国、地域、またはデータセンターに対する正確なIP情報の取得のため、以下のIPアドレスへのアクセスが必要です。

    --8<-- "../include/wallarm-cloud-ips.md"
* すべてのコマンドをスーパーユーザー（例：`root`）として実行します。