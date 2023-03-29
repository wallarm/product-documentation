* [USクラウド](https://us1.my.wallarm.com/)または[EUクラウド](https://my.wallarm.com/)のWallarm Consoleで二要素認証が無効になっている**管理者**または**デプロイ**ロールのアカウントへのアクセス
* [指示][configure-selinux-instr]に従ってSELinuxを無効にするか設定する
* すべてのコマンドをスーパーユーザー（例：`root`）で実行
* リクエスト処理とポストアナリティクスが別のサーバーで行われる場合：別のサーバーに[指示][install-postanalytics-instr]に従ってポストアナリティクスをインストール
* パッケージをダウンロードするための`https://repo.wallarm.com`へのアクセス。ファイアウォールによってアクセスがブロックされないよう確認してください
* US Wallarm Cloudを利用するための`https://us1.api.wallarm.com:444`へのアクセス、またはEU Wallarm Cloudを利用するための`https://api.wallarm.com:444`へのアクセス。アクセスがプロキシサーバー経由でのみ設定できる場合は、[指示][configure-proxy-balancer-instr]を使用してください
* **vim**、**nano** または他のテキストエディターがインストールされている。この指示では **vim** を使用