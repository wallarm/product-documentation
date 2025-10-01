以下のファイルには、NGINXおよびフィルタリングノードの設定が含まれます:

* `/etc/nginx/nginx.conf` はNGINXの設定を定義します
* `/etc/nginx/conf.d/wallarm.conf` はWallarmフィルタリングノードのグローバル設定を定義します
* `/etc/nginx/conf.d/wallarm-status.conf` はフィルタリングノードの監視サービス設定を定義します

NGINXとWallarmの動作を定義するために、独自の構成ファイルを作成できます。同じ方法で処理すべきドメイングループごとに、`server`ブロックを含む個別の構成ファイルを作成することを推奨します。

NGINXの構成ファイルの扱いに関する詳細は、[公式NGINXドキュメント](https://nginx.org/en/docs/beginners_guide.html)をご覧ください。

WallarmディレクティブはWallarmフィルタリングノードの動作ロジックを定義します。利用可能なWallarmディレクティブの一覧は、[Wallarmの構成オプション](configure-parameters-en.md)ページをご覧ください。

**構成ファイルの例**

サーバーを次の条件で動作させるよう構成する必要があるとします:
* HTTPトラフィックのみを処理します。HTTPSリクエストは処理しません。
* 次のドメインがリクエストを受け取ります: `example.com` と `www.example.com`。
* すべてのリクエストはサーバー`10.80.0.5`へ転送される必要があります。
* すべての受信リクエストのサイズは1MB未満であると見なします（デフォルト設定）。
* リクエストの処理時間は60秒以内です（デフォルト設定）。
* Wallarmはmonitoringモードで動作する必要があります。
* クライアントは中間のHTTPロードバランサーを介さずにフィルタリングノードに直接アクセスします。

!!! info "構成ファイルの作成"
    カスタムのNGINX構成ファイル（例: `example.com.conf`）を作成するか、デフォルトのNGINX構成ファイル（`default.conf`）を変更できます。
    
    カスタム構成ファイルを作成する場合は、NGINXが空きポートで受信接続を待ち受けるように設定されていることを確認してください。


上記の条件を満たすには、構成ファイルの内容は次のようにします:

```

    server {
      listen 80;
      listen [::]:80 ipv6only=on;

      # トラフィックを処理する対象ドメイン
      server_name example.com; 
      server_name www.example.com;

      # トラフィック処理のmonitoringモードを有効化
      wallarm_mode monitoring; 
      # wallarm_instance 1;

      location / {
        # リクエスト転送先アドレスの設定
        proxy_pass http://10.80.0.5; 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
    }

```