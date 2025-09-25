フィルタリングおよびプロキシのルールは`/etc/kong/nginx-wallarm.template`ファイルで設定します。

NGINXの設定ファイルの扱いに関する詳細は、[公式のNGINXドキュメント](https://nginx.org/en/docs/beginners_guide.html)をご参照ください。

WallarmディレクティブはWallarmフィルタリングノードの動作ロジックを定義します。利用可能なWallarmディレクティブの一覧については、[Wallarmの設定オプション](../admin-en/configure-parameters-en.md)ページをご参照ください。

**設定ファイルの例**

次の条件でサーバーが動作するように設定する必要があると想定します：
* HTTPトラフィックのみを処理します。HTTPSリクエストは処理しません。
* 次のドメインがリクエストを受け取ります：`example.com`と`www.example.com`。
* すべてのリクエストはサーバー`10.80.0.5`に転送します。
* すべての受信リクエストはサイズが1MB未満であるとみなします（デフォルト設定）。
* リクエストの処理に要する時間は60秒以下です（デフォルト設定）。
* Wallarmはmonitoringモードで動作します。
* クライアントは中間のHTTPロードバランサーを介さずにフィルタリングノードに直接アクセスします。

これらの条件を満たすため、設定ファイルの内容は次のとおりです：

```

    server {
      listen 80;
      listen [::]:80 ipv6only=on;

      # トラフィックを処理対象とするドメインです
      server_name example.com; 
      server_name www.example.com;

      # トラフィック処理のmonitoringモードを有効にします
      wallarm_mode monitoring; 
      # wallarm_instance 1;

      location / {
        # リクエスト転送先のアドレスを設定します
        proxy_pass http://10.80.0.5; 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
    }

```