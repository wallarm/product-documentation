* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarmコンソールで、**Administrator**ロールを持つアカウントに2要素認証が無効な状態でアクセスできること  
* [instructions][configure-selinux-instr]の指示に従い、SELinuxが無効化されている、または設定されていること  
* リリース29または30（R29またはR30）のNGINX Plus

    !!! info "カスタムNGINX Plusバージョン"
        別のバージョンをご利用の場合は、[nginx-custom][nginx-custom]の指示をご参照ください  
* すべてのコマンドをスーパーユーザー（例：`root`）として実行できること  
* パッケージをダウンロードするために`https://repo.wallarm.com`にアクセスできること。ファイアウォールによってアクセスがブロックされていないことを確認してください  
* US Wallarm Cloudで作業するために`https://us1.api.wallarm.com`、またはEU Wallarm Cloudで作業するために`https://api.wallarm.com`にアクセスできること。アクセスがプロキシサーバー経由でのみ設定できる場合は、[configure-proxy-balancer-instr][configure-proxy-balancer-instr]の指示をご利用ください  
* 攻撃検出ルールの更新をダウンロードするため、および[allowlisted, denylisted, or graylisted][ip-lists-docs]された国、地域、またはデータセンターの正確なIPを取得するために、以下のIPアドレスにアクセスできること

    --8<-- "../include/wallarm-cloud-ips.md"  
* インストールされているテキストエディターとして**vim**、**nano**、またはその他のエディターを利用できること。本ドキュメントでは**vim**が使用されています