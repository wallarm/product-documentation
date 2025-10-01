フィルタリングおよびプロキシ処理のルールは`/etc/kong/nginx-wallarm.template`ファイルで設定します。

NGINXの設定ファイルの取り扱いに関する詳細は、[NGINX公式ドキュメント](https://nginx.org/en/docs/beginners_guide.html)を参照してください。

WallarmのディレクティブはWallarmフィルタリングノードの動作ロジックを定義します。利用可能なWallarmディレクティブの一覧は[Wallarmの設定オプション](../admin-en/configure-parameters-en.md)ページを参照してください。

**設定ファイルの例**

次の条件で動作するようにサーバーを設定するとします。
* HTTPトラフィックのみを処理します。HTTPSリクエストは処理しません。
* 次のドメインがリクエストを受け取ります：`example.com`と`www.example.com`。
* すべてのリクエストはサーバー`10.80.0.5`に転送します。
* すべての受信リクエストはサイズが1MB未満であるとみなします（デフォルト設定）。
* リクエストの処理にかかる時間は60秒を超えません（デフォルト設定）。
* Wallarmはモニタリングモードで動作します。
* クライアントは中間のHTTPロードバランサーを介さず、直接フィルタリングノードにアクセスします。

上記の条件を満たすには、設定ファイルの内容は次のとおりです。

```

    server {
      listen 80;
      listen [::]:80 ipv6only=on;

      # トラフィックを処理する対象ドメインを指定します
      server_name example.com; 
      server_name www.example.com;

      # トラフィック処理のモニタリングモードを有効化します
      wallarm_mode monitoring; 
      # wallarm_application 1;

      location / {
        # リクエスト転送先アドレスを設定します
        proxy_pass http://10.80.0.5; 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
    }

```