以下のファイルにNGINXおよびフィルタリングノードの設定が含まれています。

* `/etc/nginx/nginx.conf` はNGINXの設定を定義するファイルです
* `/etc/nginx/conf.d/wallarm.conf` はWallarmフィルタリングノードのグローバル設定を定義するファイルです
* `/etc/nginx/conf.d/wallarm-status.conf` はフィルタリングノードの監視サービスの設定を定義するファイルです

NGINXとWallarmの動作を定義するために、独自の設定ファイルを作成できます。同じ方法で処理すべきドメインの各グループごとに、`server`ブロックを含む個別の設定ファイルを作成することを推奨します。

NGINXの設定ファイルの扱いに関する詳細は、[公式のNGINXドキュメント](https://nginx.org/en/docs/beginners_guide.html)を参照してください。

WallarmディレクティブはWallarmフィルタリングノードの動作ロジックを定義します。利用可能なWallarmディレクティブの一覧は、[Wallarmの設定オプション](configure-parameters-en.md)のページを参照してください。

**設定ファイルの例**

サーバーを次の条件で動作するように設定する必要があるとします:
* HTTPトラフィックのみを処理します。HTTPSリクエストは処理しません。
* 次のドメインがリクエストを受け取ります: `example.com` と `www.example.com`。
* すべてのリクエストはサーバー`10.80.0.5`へ転送します。
* 受信するすべてのリクエストのサイズは1MB未満であると想定します（デフォルト設定）。
* リクエストの処理に要する時間は60秒以内です（デフォルト設定）。
* Wallarmは監視モードで動作します。
* クライアントは中間のHTTPロードバランサーを介さずに、フィルタリングノードへ直接アクセスします。

!!! info "設定ファイルの作成"
    NGINXのカスタム設定ファイル（例: `example.com.conf`）を作成するか、デフォルトのNGINX設定ファイル（`default.conf`）を修正できます。
    
    カスタム設定ファイルを作成する際は、NGINXが空いているポートで受信接続を待ち受けるように設定されていることを確認してください。

上記の条件を満たすため、設定ファイルの内容は次のとおりです:

```

    server {
      listen 80;
      listen [::]:80 ipv6only=on;

      # トラフィックを処理する対象ドメイン
      server_name example.com; 
      server_name www.example.com;

      # トラフィック処理の監視モードを有効化
      wallarm_mode monitoring; 
      # wallarm_application 1;

      location / {
        # リクエスト転送先のアドレスを設定
        proxy_pass http://10.80.0.5; 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
    }

```