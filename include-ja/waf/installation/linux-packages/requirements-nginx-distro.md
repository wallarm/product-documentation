* Wallarm Consoleで、二要素認証が無効の**Administrator**ロールのアカウントにアクセスできること（[US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)の場合）
* SELinuxが無効にされているか、[指示][configure-selinux-instr]に従って構成されていること
* すべてのコマンドをスーパーユーザ（例：`root`）権限で実行すること
* パッケージをダウンロードするために`https://repo.wallarm.com`にアクセスできること。ファイアウォールによってアクセスがブロックされていないことを確認すること
* US Wallarm Cloudでの利用の場合は`https://us1.api.wallarm.com`に、EU Wallarm Cloudでの利用の場合は`https://api.wallarm.com`にアクセスできること。もしアクセスがプロキシサーバを経由して構成可能な場合は、[指示][configure-proxy-balancer-instr]を使用すること
* 下記のIPアドレスへのアクセスが可能であること。これにより攻撃検出ルールの更新や、[allowlisted, denylisted,またはgraylisted][ip-lists-docs]国、地域、またはデータセンターに対する正確なIPの取得が可能になります

    --8<-- "../include/wallarm-cloud-ips.md"
* インストール済みのテキストエディタ（**vim**, **nano**等）があること。本手順では**vim**を使用します