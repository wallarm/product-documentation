* [US Cloud](https://us1.my.wallarm.com/) または [EU Cloud](https://my.wallarm.com/) の Wallarm Console で **管理者** または **デプロイ** ロールと二要素認証が無効化されたアカウントへのアクセス
* SELinux を無効化するか、[手順][configure-selinux-instr] に従って設定
* すべてのコマンドをスーパーユーザー（例：`root`）として実行
* リクエスト処理と postanalytics を異なるサーバーで行う場合：別のサーバーに [手順][install-postanalytics-instr] に従って postanalytics をインストール
* パッケージをダウンロードするための `https://repo.wallarm.com` へのアクセス（ファイアウォールによってアクセスがブロックされていないことを確認）
* US Wallarm Cloud との連携のための `https://us1.api.wallarm.com:444` へのアクセスまたは EU Wallarm Cloud との連携のための `https://api.wallarm.com:444` へのアクセス。プロキシサーバー経由でのみアクセスが設定されている場合は、[手順][configure-proxy-balancer-instr] を使用
* [許可リスト、ブロックリスト、グレーリストに登録された][ip-lists-docs] 国や地域、データセンターで登録された IP アドレスの実際のリストをダウンロードするための [GCP ストレージアドレス](https://www.gstatic.com/ipranges/goog.json) へのアクセス
* テキストエディタ **vim**、 **nano**、またはそれ以外のものがインストール済み。この手順では **vim** を使用します