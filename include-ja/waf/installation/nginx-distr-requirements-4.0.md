* [USクラウド](https://us1.my.wallarm.com/)または[EUクラウド](https://my.wallarm.com/)のWallarm Consoleでの**管理者**役割を持つアカウントへのアクセス
* SELinuxは無効化されるか、[指示][configure-selinux-instr]に従って設定されます
* 全てのコマンドはスーパーユーザー（例えば `root`）として実行します
* リクエスト処理とポストアナリティクスを別々のサーバーで行己う場合：ポストアナリティクスは[指示][install-postanalytics-instr]に従って別のサーバーにインストールされます
* パッケージをダウンロードするための`https://repo.wallarm.com`へのアクセス。ファイアウォールによってアクセスがブロックされないことを確認してください
* US Wallarm Cloudで作業するための`https://us1.api.wallarm.com`またはEU Wallarm Cloudで作業するための`https://api.wallarm.com`へのアクセス。アクセスはプロキシサーバ経由でのみ設定することができる場合、[指示][configure-proxy-balancer-instr]を使用してください
* [リンク](https://www.gstatic.com/ipranges/goog.json)内に記載されたGoogle Cloud StorageのIPアドレスへのアクセス。完全な国、地域、データセンターを[許可リスト、拒否リスト、またはグレーリスト][ip-lists-docs]に登録する代わりに個々のIPアドレスを使用すると、WallarmノードはGoogle Storage上にホスティングされた集積データベースからIPリストのエントリに関連した正確なIPアドレスを取得します
* **vim**、**nano**、または他の任意のテキストエディターがインストールされています。この指示では、**vim**を使用します
