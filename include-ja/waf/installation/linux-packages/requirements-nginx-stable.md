* US CloudまたはEU Cloud用Wallarm Consoleにおいて、two‑factor authenticationが無効な**Administrator**ロールのアカウントにアクセスできること
* SELinuxが無効であるか、[手順][configure-selinux-instr]に従って設定されていること
* NGINXバージョン1.24.0

    !!! info "カスタムNGINXバージョン"
        別のバージョンをお使いの場合は、[NGINXのカスタムビルドにWallarmモジュールを接続する方法][nginx-custom]に関する手順を参照してください
* すべてのコマンドをスーパーユーザー（例：`root`）で実行する
* パッケージのダウンロードのために`https://repo.wallarm.com`へのアクセスが可能であり、ファイアウォールによってブロックされていないこと
* US Wallarm Cloudで動作させる場合は`https://us1.api.wallarm.com`、またはEU Wallarm Cloudで動作させる場合は`https://api.wallarm.com`へのアクセスが必要です。アクセスがプロキシサーバー経由でしか設定できない場合は、[手順][configure-proxy-balancer-instr]に従ってください
* 攻撃検知ルールの更新のダウンロードおよび[allowlisted, denylisted, or graylisted][ip-lists-docs]国・地域またはデータセンターの正確なIP取得のために、下記IPアドレスへのアクセスが必要です

    --8<-- "../include/wallarm-cloud-ips.md"
* テキストエディタ**vim**、**nano**、またはその他のエディタがインストールされていること。手順書では**vim**が使用されています