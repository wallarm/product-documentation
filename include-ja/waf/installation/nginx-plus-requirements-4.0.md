* [USクラウド](https://us1.my.wallarm.com/)あるいは[EUクラウド](https://my.wallarm.com/)のWallarm Consoleで**管理者**ロールにアクセスすること
* SELinuxは無効にするか、[指示][configure-selinux-instr]に従って設定すること
* NGINX Plusリリース28（R28）

    !!! info "カスタムNGINX Plusバージョン"
        他のバージョンを使用している場合は、[NGINXのカスタムビルドにWallarmモジュールを接続する方法][nginx-custom]の指示を参照してください
* 全てのコマンドは超ユーザー（例：`root`）として実行すること
* リクエストの処理とポストアナリティクスは別のサーバで行います：ポストアナリティクスは[指示][install-postanalytics-instr]に従って別のサーバでインストールすること
* パッケージをダウンロードするために `https://repo.wallarm.com` へのアクセス。ファイアウォールによってアクセスがブロックされていないことを確認すること
* US Wallarm Cloudを使うために `https://us1.api.wallarm.com` へのアクセス、またはEU Wallarm Cloudを使うために `https://api.wallarm.com` へのアクセス。アクセスはプロキシサーバ経由でのみ設定できる場合は、[指示][configure-proxy-balancer-instr]を使用してください
* [リンク](https://www.gstatic.com/ipranges/goog.json)内に掲載されているGoogle Cloud StorageのIPアドレスへのアクセス。個々のIPアドレスの代わりに全体の国、地域、データセンターを[許可リスト、拒否リスト、またはグレーリスト][ip-lists-docs]に登録する場合、WallarmノードはGoogle Storageにホストされている集約データベースから関連する正確なIPアドレスを取得します
* テキストエディタ **vim**、 **nano**、または他のいずれかをインストールすること。この説明書では、**vim** を使用します