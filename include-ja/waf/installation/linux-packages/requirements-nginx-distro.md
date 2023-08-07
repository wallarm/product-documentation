* Wallarmコンソール内で**管理者**役割を持つアカウントへのアクセス ([USクラウド](https://us1.my.wallarm.com/) または [EUクラウド](https://my.wallarm.com/))
* SELinuxが無効または[指示][configure-selinux-instr]に従って設定されている
* すべてのコマンドをスーパーユーザー（例： `root`）として実行
* パッケージをダウンロードするための `https://repo.wallarm.com` へのアクセス。アクセスがファイアウォールによってブロックされていないことを確認してください
* US Wallarm Cloudと連携するための `https://us1.api.wallarm.com` もしくは EU Wallarm Cloudと連携するための `https://api.wallarm.com` へのアクセス。アクセスはプロキシサーバー経由でのみ設定できるなら、[指示書][configure-proxy-balancer-instr]を使用してください
* [リンク](https://www.gstatic.com/ipranges/goog.json)内に記載されているGoogleクラウドストレージのIPアドレスへのアクセス。個々のIPアドレスの代わりに全国、地域、またはデータセンター全体を[許可リスト、拒否リスト、またはグレーリスト][ip-lists-docs]にすると、WallarmノードはGoogleストレージにホストされている集計データベースからIPリストのエントリに関連する正確なIPアドレスを取得します
* テキストエディター **vim**、 **nano**、または他のものがインストールされています。取り扱い説明書では、 **vim** が使用されています