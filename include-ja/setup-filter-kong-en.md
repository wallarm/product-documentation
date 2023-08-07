フィルタリングとプロキシングのルールは `/etc/kong/nginx-wallarm.template` ファイルで設定されます。

NGINX設定ファイルの詳細な取り扱いについては、[公式のNGINXドキュメンテーション](https://nginx.org/en/docs/beginners_guide.html)を参照してください。

WallarmのディレクティブはWallarmのフィルタリングノードの操作ロジックを定義します。利用可能なWallarmディレクティブのリストを見るには、[Wallarm設定オプション](../admin-en/configure-parameters-en.md) ページに進んでください。

**設定ファイルの例**

以下の条件でサーバーを設定する必要があると仮定しましょう:
* HTTPトラフィックのみが処理されます。HTTPSリクエストは処理されません。
* リクエストを受け付けるドメインは `example.com` と `www.example.com` です。
* すべてのリクエストは `10.80.0.5` のサーバーに渡されなければなりません。
* すべての受信リクエストは1MB未満と見なされます（デフォルト設定）。
* リクエストの処理には最大60秒かかります（デフォルト設定）。
* Wallarmはモニタリングモードで動作しなければなりません。
* クライアントは、中間のHTTPロードバランサーなしで直接フィルタリングノードにアクセスします。

上記の条件を満たすためには、設定ファイルの内容は以下のようになります：

```

    server {
      listen 80;
      listen [::]:80 ipv6only=on;

      # トラフィックが処理されるドメイン
      server_name example.com; 
      server_name www.example.com;

      # トラフィック処理のモニタリングモードをオンにする
      wallarm_mode monitoring; 
      # wallarm_instance 1;

      location / {
        # リクエスト転送のためのアドレスを設定する
        proxy_pass http://10.80.0.5; 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
    }

```