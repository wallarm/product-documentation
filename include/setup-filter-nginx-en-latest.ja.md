次のファイルには、NGINXおよびフィルタリングノードの設定が含まれています:

* `/etc/nginx/nginx.conf`は、NGINXの設定を定義します。
* `/etc/nginx/conf.d/wallarm.conf`は、Wallarmフィルタリングノードのグローバル設定を定義します。
* `/etc/nginx/conf.d/wallarm-status.conf`は、フィルタリングノード監視サービスの設定を定義します。

NGINXとWallarmの動作を定義する独自の設定ファイルを作成できます。同じ方法で処理されるべきドメインの各グループに対して`server`ブロックを含む個別の設定ファイルを作成することをお勧めします。

NGINX設定ファイルの詳細については、[公式NGINXドキュメント](https://nginx.org/en/docs/beginners_guide.html)に進んでください。

Wallarmディレクティブは、Wallarmフィルタリングノードの動作ロジックを定義します。使用可能なWallarmディレクティブのリストを表示するには、[Wallarm設定オプション](configure-parameters-en.md)ページに進んでください。

**設定ファイルの例**

次の条件でサーバーを設定する必要があると仮定しましょう。
* HTTPトラフィックのみが処理されます。 HTTPSリクエストは処理されません。
* 次のドメインがリクエストを受信します：`example.com`および`www.example.com`。
* すべてのリクエストは、サーバー`10.80.0.5`に渡されなければなりません。
* すべての着信リクエストは1MB未満（デフォルト設定）と見なされます。
* リクエストの処理には最大60秒（デフォルト設定）かかります。
* Wallarmはモニタモードで動作する必要があります。
* クライアントは、中間HTTPロードバランサーなしにフィルタリングノードに直接アクセスします。

!!! info "設定ファイルの作成"
    独自のNGINX設定ファイル（例：`example.com.conf`）を作成するか、デフォルトのNGINX設定ファイル（`default.conf`）を変更できます。

    独自の設定ファイルを作成する場合は、NGINXが空いているポートで着信接続をリッスンしていることを確認してください。

リストされた条件を満たすために、設定ファイルの内容は次のようになります。

```

    server {
      listen 80;
      listen [::]:80 ipv6only=on;

      # traffic processed for the domains
      server_name example.com; 
      server_name www.example.com;

      # turn on the monitoring mode of traffic processing
      wallarm_mode monitoring; 
      # wallarm_application 1;

      location / {
        # setting the address for request forwarding
        proxy_pass http://10.80.0.5; 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
    }

```