* [US Cloud](https://us1.my.wallarm.com/) または [EU Cloud](https://my.wallarm.com/) にてWallarm Consoleで**管理者**ロールを持つアカウントへのアクセス
* SELinuxが無効化されているか、[指示][configure-selinux-instr]に従って設定されている
* NGINX Plusリリース28（R28）

    !!! info "カスタムNGINX Plusバージョン"
        そちらが異なるバージョンをお持ちの場合は、[NGINXのカスタムビルドにWallarmモジュールを接続する方法][nginx-custom]に関する指示をご参照ください
* 全てのコマンドをスーパーユーザー（例えば `root`）として実行
* パッケージをダウンロードするための `https://repo.wallarm.com` へのアクセス。ファイアウォールによってアクセスがブロックされていないことを確認してください
* US Wallarm Cloudを使用するための `https://us1.api.wallarm.com` またはEU Wallarm Cloudを使用するための `https://api.wallarm.com` へのアクセス。アクセスがプロキシサーバー経由でのみ設定可能な場合は、[指示][configure-proxy-balancer-instr]を使用してください
* Google Cloud StorageのIPアドレスへのアクセスが[リンク](https://www.gstatic.com/ipranges/goog.json)内にリストされています。あなたが個々のIPアドレスではなく、全体の国、地域、またはデータセンターを[ホワイトリスト化、ブラックリスト化、またはグレーリスト化][ip-lists-docs]すると、WallarmノードはGoogleストレージにホストされている集約データベースからIPリストのエントリーに関連する正確なIPアドレスを取得します
* **vim**、 **nano** 、またはその他のテキストエディタをインストールしている。この指示では、**vim**が使用されます