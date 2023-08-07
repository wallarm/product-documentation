* [US Cloud](https://us1.my.wallarm.com/) または [EU Cloud](https://my.wallarm.com/) のWallarm Consoleで二要素認証が無効化された**管理者**または**デプロイ**の役割を持つアカウントへのアクセス
* SELinux が無効化されているか、[指示書][configure-selinux-instr]に従って設定されている
* 全てのコマンドをスーパーユーザー（例：`root`）として実行
* リクエスト処理とポストアナリティクスが異なるサーバー上で：[指示書][install-postanalytics-instr]に従って別のサーバーにポストアナリティクスをインストール
* パッケージをダウンロードするための `https://repo.wallarm.com` へのアクセス。ファイアウォールによってアクセスがブロックされていないことを確認
* US Wallarm Cloudを利用するための `https://us1.api.wallarm.com:444` へのアクセス、またはEU Wallarm Cloudを利用するための `https://api.wallarm.com:444` へのアクセス。アクセスはプロキシサーバー経由でのみ設定できる場合、[指示書][configure-proxy-balancer-instr]を使用
* テキストエディタ **vim** 、**nano** またはそれ以外のものをインストール。この説明書では、**vim**が使用されています