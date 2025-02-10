* [US Cloud](https://us1.my.wallarm.com/) または [EU Cloud](https://my.wallarm.com/) のWallarmコンソールで**管理者**ロールとしてのアカウントへのアクセス。
* サポートされているOS：

    * Debian 10, 11および12.x
    * Ubuntu LTS 18.04, 20.04, 22.04
    * CentOS 7, 8ストリーム、9ストリーム
    * Alma/Rocky Linux 9
    * RHEL 8.x
    * RHEL 9.x
    * Oracle Linux 8.x
    * Oracle Linux 9.x
    * Redox
    * SuSe Linux
    * その他（リストは常に広がっています、あなたのOSがリストにあるかどうかを確認するために[Wallarmサポートチーム](mailto:support@wallarm.com)に連絡してください）

* all-in-one Wallarmインストーラーをダウンロードするための `https://meganode.wallarm.com` へのアクセス。アクセスがファイアウォールによってブロックされていないことを確認してください。
* US Wallarm Cloudを利用するための `https://us1.api.wallarm.com` または EU Wallarm Cloudを利用するための `https://api.wallarm.com` へのアクセス。アクセスがプロキシサーバー経由でのみ設定できる場合は、[instructions][configure-proxy-balancer-instr] を使用してください。
* Access to the IP addresses below for downloading updates to attack detection rules, as well as retrieving precise IPs for your allowlisted, denylisted, or graylisted countries, regions, or data centers

    --8<-- "../include/wallarm-cloud-ips.md"
* 全てのコマンドをスーパーユーザー（例：`root`）として実行します。