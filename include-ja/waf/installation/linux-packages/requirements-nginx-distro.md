## 必要条件

* [USクラウド](https://us1.my.wallarm.com/)または[EUクラウド](https://my.wallarm.com/)のWallarmコンソールで**管理者**役割のあるアカウントへのアクセス
* SELinuxは無効化するか、[指示書][configure-selinux-instr]に従って設定
* 全てのコマンドはスーパーユーザー（例 `root`）として実行
* パッケージをダウンロードするための`https://repo.wallarm.com`へのアクセス。ファイアウォールによってアクセスがブロックされていないことを確認
* US Wallarmクラウドを利用するための`https://us1.api.wallarm.com`へのアクセス、またはEU Wallarmクラウドを利用するための`https://api.wallarm.com`へのアクセス。アクセスがプロキシサーバー経由でのみ設定可能な場合は、[指示書][configure-proxy-balancer-instr]を使用
* [許可リスト、拒否リスト、またはグレイリスト][ip-lists-docs]に登録された国や地域、データセンターの現在のIPアドレスリストをダウンロードするための、[GCPストレージアドレス](https://www.gstatic.com/ipranges/goog.json)へのアクセス
* テキストエディター**vim**、**nano**、またはその他のエディターがインストールされていること。この手順では、**vim**を使用します。