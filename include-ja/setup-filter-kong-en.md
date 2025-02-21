フィルタリングおよびプロキシングのルールは、`/etc/kong/nginx-wallarm.template`ファイル内で設定されます。

NGINX設定ファイルの操作に関する詳細情報については、[公式NGINXドキュメント](https://nginx.org/en/docs/beginners_guide.html)を参照してください。

WallarmディレクティブはWallarmフィルタリングノードの動作ロジックを定義します。利用可能なWallarmディレクティブの一覧については、[Wallarm設定オプション](../admin-en/configure-parameters-en.md)ページを参照してください。

**設定ファイルの例**

サーバを以下の条件で動作させる必要があると仮定します:
* HTTPトラフィックのみが処理されます。HTTPSリクエストは処理されません。
* 以下のドメインがリクエストを受け取ります: `example.com`および`www.example.com`
* すべてのリクエストはサーバ`10.80.0.5`に転送されます。
* すべての着信リクエストは1MB未満とみなされます（デフォルト設定）。
* リクエストの処理時間は60秒を超えません（デフォルト設定）。
* Wallarmはモニタリングモードで動作します。
* クライアントは中間のHTTPロードバランサを経由せずにフィルタリングノードに直接アクセスします。

上記条件を満たすため、設定ファイルの内容は以下のようになります:

```
    server {
      listen 80;
      listen [::]:80 ipv6only=on;

      # トラフィックが処理されるドメイン
      server_name example.com;
      server_name www.example.com;

      # トラフィック処理のモニタリングモードを有効にします
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