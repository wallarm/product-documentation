* [US Cloud](https://us1.my.wallarm.com/) または [EU Cloud](https://my.wallarm.com/) のWallarmコンソールで **管理者** ロールを持つアカウントへのアクセス
* SELinux が無効になっているか、[こちらの指示][configure-selinux-instr]に従って設定すること
* NGINXのバージョンは1.24.0

    !!! info "カスタムNGINX版"
        他のバージョンをお持ちの場合は、[こちらの指示][nginx-custom]に従ってWallarmモジュールをカスタムビルドのNGINXに接続する方法を参照してください
* すべてのコマンドをスーパーユーザー（例： `root`）で実行
* パッケージをダウンロードするための `https://repo.wallarm.com` へのアクセス。ファイアウォールによってアクセスがブロックされていないことを確認
* US Wallarm Cloudと連携するための `https://us1.api.wallarm.com` または EU Wallarm Cloudと連携するための `https://api.wallarm.com` へのアクセス。アクセスをプロキシサーバー経由でのみ設定する場合は、[こちらの指示][configure-proxy-balancer-instr]を使用
* Google Cloud StorageのIPアドレスへのアクセスは、[こちらのリンク](https://www.gstatic.com/ipranges/goog.json)内にリストされています。個々のIPアドレスの代わりに国や地域、データセンター全体を [許可リスト、拒否リスト、グレーリスト化][ip-lists-docs] した場合、WallarmノードはGoogle Storageでホストされている集約データベースからIPリストのエントリーに関連する精確なIPアドレスを取得
* テキストエディター **vim**、**nano**、またはそれ以外のものをインストール。指示では、**vim** を使用