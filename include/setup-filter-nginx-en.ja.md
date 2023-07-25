以下のファイルは、NGINXとフィルタリングノードの設定を含んでいます。

* `/etc/nginx/nginx.conf`は、NGINXの設定を定義します
* `/etc/nginx/conf.d/wallarm.conf`は、Wallarmフィルタリングノードのグローバル設定を定義します
* `/etc/nginx/conf.d/wallarm-status.conf`は、フィルタリングノードモニタリングサービスの設定を定義します

NGINXとWallarmの動作を定義する独自の設定ファイルを作成することができます。同じ方法で処理されるべきドメインの各グループに対して、`server`ブロックを含む別の設定ファイルを作成することが推奨されます。

NGINX設定ファイルの操作に関する詳細情報については、[公式NGINXドキュメント](https://nginx.org/en/docs/beginners_guide.html)に進んでください。

Wallarmのディレクティブは、Wallarmフィルタリングノードの操作ロジックを定義します。利用可能なWallarmディレクティブのリストを参照するには、[ Wallarm設定オプション](configure-parameters-en.ja.md)ページに進んでください。

**設定ファイルの例**

次の条件でサーバーを設定する必要があると仮定しましょう：
* HTTPトラフィックのみが処理されます。 HTTPSリクエストは処理されません。
* 次のドメインがリクエストを受信します：`example.com`および`www.example.com`。
* すべてのリクエストが`10.80.0.5`のサーバーに渡されなければなりません。
* すべての受信リクエストサイズは1MB未満と見なされます（デフォルト設定）。
* リクエストの処理には最大60秒かかります（デフォルト設定）。
* Wallarmはモニタモードで動作する必要があります。
* クライアントは、中間HTTPロードバランサーなしでフィルタリングノードに直接アクセスします。

!!! info "設定ファイルの作成"
    カスタムNGINX設定ファイル（たとえば、`example.com.conf`）を作成するか、デフォルトのNGINX設定ファイル（`default.conf`）を変更できます。

    カスタム設定ファイルを作成する場合、NGINXが空きポートで着信接続をリッスンするようにしてください。

上記の条件を満たすために、設定ファイルの内容は以下のようになります：

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
        # リクエスト転送のアドレスを設定する
        proxy_pass http://10.80.0.5; 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
    }

```