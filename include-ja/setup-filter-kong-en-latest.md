フィルタリングとプロキシングのルールは、`/etc/kong/nginx-wallarm.template`ファイルで設定されています。

NGINX設定ファイルの詳細な情報については、[公式NGINXドキュメント](https://nginx.org/en/docs/beginners_guide.html)に進んでください。

Wallarmディレクティブは、Wallarmフィルタリングノードの動作ロジックを定義します。使用可能なWallarmディレクティブのリストについては、[Wallarm設定オプション](../admin-en/configure-parameters-en.md)ページに進んでください。

**設定ファイルの例**

次の条件でサーバーを設定する必要があると仮定しましょう。
* HTTPトラフィックのみを処理します。 HTTPSリクエストは処理されません。
* 次のドメインでリクエストを受け取ります：`example.com`および`www.example.com`。
* すべてのリクエストは、サーバー`10.80.0.5`に渡される必要があります。
* すべての受信リクエストは、1MB未満のサイズと見なされます（デフォルト設定）。
* リクエストの処理には最大60秒（デフォルト設定）しかかかりません。
* Wallarmはモニターモードで動作する必要があります。
* クライアントは、中間のHTTPロードバランサーを介さずにフィルタリングノードに直接アクセスします。

上記の条件を満たすために、設定ファイルの内容は以下のようになります。

```

    server {
      listen 80;
      listen [::]:80 ipv6only=on;

      # トラフィックが処理されるドメイン
      server_name example.com;
      server_name www.example.com;

      # トラフィック処理のモニタリングモードをオンにする
      wallarm_mode monitoring;
      # wallarm_application 1;

      location / {
        # リクエスト転送用のアドレスを設定する
        proxy_pass http://10.80.0.5;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
    }

```