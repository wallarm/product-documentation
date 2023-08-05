フィルタリングとプロキシングのルールは `/etc/kong/nginx-wallarm.template` ファイルで設定されます。

NGINX設定ファイルの詳細な情報については、[公式NGINXドキュメンテーション](https://nginx.org/en/docs/beginners_guide.html) を参照してください。

Wallarmの指令はWallarmのフィルタリングノードの運用ロジックを定義します。利用可能なWallarm指令のリストを見るためには、[Wallarm設定オプション](../admin-en/configure-parameters-en.md) ページに進んでください。

**設定ファイルの例**

以下の条件でサーバーを設定する必要があるとしましょう：
* HTTPトラフィックのみが処理されます。HTTPSリクエストは処理されません。
* 次のドメインがリクエストを受け取ります： `example.com` と `www.example.com`。
* すべてのリクエストはサーバー `10.80.0.5` へと渡さなければならない。
* すべての受信リクエストのサイズは1MB未満と見なされます（デフォルト設定）。
* リクエストの処理には60秒以上かからない（デフォルト設定）。
* Wallarmは監視モードで運用しなければなりません。
* クライアントは中間のHTTPロードバランサーなしに直接フィルタリングノードにアクセスします。

記載された条件を満たすために、設定ファイルの内容は以下のようになるべきです：

```

    server {
      listen 80;
      listen [::]:80 ipv6only=on;

      # トラフィックを処理するドメイン
      server_name example.com; 
      server_name www.example.com;

      # トラフィック処理の監視モードをオンにする
      wallarm_mode monitoring; 
      # wallarm_application 1;

      location / {
        # リクエスト転送のアドレスを設定する
        proxy_pass http://10.80.0.5; 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
    }

```
