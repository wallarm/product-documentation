以下のファイルには、NGINXとフィルタリングノードの設定が含まれています:

* `/etc/nginx/nginx.conf` は NGINX の設定を定義します。
* `/etc/nginx/conf.d/wallarm.conf` は Wallarm フィルタリングノードの全体設定を定義します。
* `/etc/nginx/conf.d/wallarm-status.conf` は フィルタリングノード監視サービスの設定を定義します。

NGINXとWallarmの動作を定義するための独自の設定ファイルを作成することができます。同じ方法で処理するべきドメインの各グループに対して、`server` ブロックを持つ別の設定ファイルを作成することを推奨します。

NGINXの設定ファイルの操作に関する詳細な情報を見るには、[公式なNGINXの文書](https://nginx.org/en/docs/beginners_guide.html) に進んでください。

Wallarmの指示は、Wallarmフィルタリングノードの操作ロジックを定義します。利用可能なWallarmの指令のリストを見るには、 [Wallarmの設定オプション](configure-parameters-en.md) ページに進んでください。

**設定ファイルの例**

サーバーを以下の条件で動作させる必要があるとします:
* HTTPトラフィックのみが処理されます。 HTTPSのリクエストは処理されません。
* 次のドメインがリクエストを受け取ります: `example.com` および `www.example.com`。
* すべてのリクエストは `10.80.0.5` のサーバーに渡されなければなりません。
* すべての受信リクエストは1MB未満のサイズと見なされます(デフォルト設定)。
* リクエストの処理は60秒以上かかりません(デフォルト設定)。
* Wallarmは監視モードで動作する必要があります。
* クライアントは、中間のHTTPロードバランサーなしに直接フィルタリングノードにアクセスします。

!!! info "設定ファイルの作成"
    カスタムのNGINX設定ファイル (例: `example.com.conf`) を作成したり、デフォルトのNGINX設定ファイル(`default.conf`)を変更することができます。
    
    カスタムの設定ファイルを作成するときは、NGINXが空いているポートで受信接続をリッスンするように確認をしてください。

上記の条件を満たすために、設定ファイルの内容は以下のようになる必要があります:

```

    server {
      listen 80;
      listen [::]:80 ipv6only=on;

      # トラフィックが処理されるドメイン
      server_name example.com; 
      server_name www.example.com;

      # トラフィック処理の監視モードをオンにする
      wallarm_mode monitoring; 
      # wallarm_application 1;

      location / {
        # リクエスト転送用のアドレスの設定
        proxy_pass http://10.80.0.5; 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
    }

```