フィルタリングとプロキシングルールは、`/etc/kong/nginx-wallarm.template`ファイルで設定されます。

NGINX設定ファイルの詳細な情報については、[公式NGINXドキュメント](https://nginx.org/en/docs/beginners_guide.html)を参照してください。

Wallarmディレクティブは、Wallarmフィルタリングノードの動作ロジックを定義します。利用可能なWallarmディレクティブの一覧を見るには、[Wallarm設定オプション](../admin-en/configure-parameters-en.ja.md)ページに進んでください。

**設定ファイルの例**

次の条件でサーバーを設定する必要があると仮定しましょう。
* HTTPトラフィックのみが処理されます。 HTTPSリクエストは処理されません。
* 次のドメインがリクエストを受け取ります：`example.com`および`www.example.com`。
* すべてのリクエストは、サーバー`10.80.0.5`に渡す必要があります。
* すべての受信リクエストは1MB未満のサイズ（デフォルト設定）であると見なされます。
* リクエストの処理にかかる時間は最大60秒（デフォルト設定）です。
* Wallarmは監視モードで動作する必要があります。
* クライアントは、中間HTTPロードバランサなしでフィルタリングノードに直接アクセスします。

上記の条件を満たすために、設定ファイルの内容は次のようになります。

```

    server {
      listen 80;
      listen [::]:80 ipv6only=on;

      # トラフィックを処理するドメイン
      server_name example.com; 
      server_name www.example.com;

      # トラフィック処理の監視モードをオンにする
      wallarm_mode monitoring; 
      # wallarm_instance 1;

      location / {
        # リクエスト転送のアドレスを設定
        proxy_pass http://10.80.0.5; 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
    }

```