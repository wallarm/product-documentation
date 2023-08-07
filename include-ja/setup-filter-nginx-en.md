次のファイルには、NGINXとフィルタリングノードの設定が含まれています：

* `/etc/nginx/nginx.conf`は、NGINXの設定を定義します
* `/etc/nginx/conf.d/wallarm.conf`は、Wallarmフィルタリングノードのグローバル設定を定義します
* `/etc/nginx/conf.d/wallarm-status.conf`は、フィルタリングノード監視サービスの設定を定義します

NGINXとWallarmの操作を定義する独自の設定ファイルを作成することができます。同じ方法で処理するべきドメインの各グループに対して、`server`ブロックを持つ別の設定ファイルを作成することを推奨します。

NGINX設定ファイルの操作に関する詳細情報を見るには、[公式NGINXドキュメンテーション](https://nginx.org/en/docs/beginners_guide.html)に進んでください。

Wallarmのディレクティブは、Wallarmフィルタリングノードの動作論理を定義します。利用可能なWallarmディレクティブのリストを見るには、[Wallarm設定オプション](configure-parameters-en.md)ページに進んでください。

**設定ファイルの例**

以下の条件でサーバーを設定する必要があると仮定しましょう：
* HTTPトラフィックのみが処理されます。HTTPSリクエストは処理されません。
* 次のドメインがリクエストを受信します：`example.com`および`www.example.com`。
* すべてのリクエストはサーバー`10.80.0.5`に渡される必要があります。
* すべての受信リクエストは1MB以下（デフォルト設定）と見なされます。
* リクエストの処理には60秒以下（デフォルト設定）しかかかりません。
* Wallarmはモニタモードで動作する必要があります。
* クライアントはHTTPロードバランサーを介さずにフィルタリングノードに直接アクセスします。

!!! info "設定ファイルの作成"
    カスタムのNGINX設定ファイル（例：`example.com.conf`）を作成するか、デフォルトのNGINX設定ファイル（`default.conf`）を編集することができます。
    
    カスタム設定ファイルを作成する場合、NGINXが空きポートでの受信接続をリッスンしていることを確認してください。


リストされた条件を満たすために、設定ファイルの内容は次のようになります：

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