## 要件

* Wallarm Consoleの**管理者**ロールを持つアカウントへのアクセス。[US クラウド](https://us1.my.wallarm.com/)または[EU クラウド](https://my.wallarm.com/)
* SELinux が無効化されているか、[指示に][configure-selinux-instr]基づいて設定します
* NGINX Plus リリース 28 (R28)

    !!! info "カスタム NGINX Plus バージョン"
        異なるバージョンをお持ちの場合は、[NGINXのカスタムビルドにWallarmモジュールを接続する方法][nginx-custom]の指示を参照してください
* 全てのコマンドをスーパーユーザー (例：`root`) として実行します
* `https://repo.wallarm.com` へのアクセスしてパッケージをダウンロードします。ファイアウォールでアクセスがブロックされないようにしてください
* US Wallarm Cloudを利用するためには `https://us1.api.wallarm.com`、EU Wallarm Cloudを利用するためには `https://api.wallarm.com` へのアクセス。アクセスがプロキシサーバー経由でのみ設定可能な場合は、[指示][configure-proxy-balancer-instr]を使用してください
* [許可リスト、拒否リスト、またはグレーリストに][ip-lists-docs]記録されている国、地域、またはデータセンターのIPアドレスの最新リストをダウンロードするための [GCPストレージアドレス](https://www.gstatic.com/ipranges/goog.json)へのアクセス
* テキストエディタ **vim**、**nano**、またはその他をインストールします。この指示では **vim** が使用されています