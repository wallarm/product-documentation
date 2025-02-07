以下のファイルにはNGINXおよびフィルタリングノードの設定が含まれます:

* `/etc/nginx/nginx.conf`はNGINXの設定を定義します
* `/etc/nginx/conf.d/wallarm.conf`はWallarmフィルタリングノードのグローバル設定を定義します
* `/etc/nginx/conf.d/wallarm-status.conf`はフィルタリングノードの監視サービスの設定を定義します

独自の設定ファイルを作成し、NGINXおよびWallarmの動作を定義できます。各ドメイングループごとに同じ方法で処理される場合は、それぞれの`server`ブロックを含む個別の設定ファイルを作成することが推奨されます。

NGINX設定ファイルの詳細な取り扱いについては、[公式NGINXドキュメント](https://nginx.org/en/docs/beginners_guide.html)を参照してください。

Wallarmディレクティブは、Wallarmフィルタリングノードの動作ロジックを定義します。利用可能なWallarmディレクティブの一覧については、[Wallarmの構成オプション](configure-parameters-en.md)ページを参照してください。

**設定ファイルの例**

サーバーを以下の条件で動作させる必要があると仮定します:
* HTTPトラフィックのみが処理され、HTTPSリクエストは処理されません。
* リクエストを受信するドメインは、`example.com`および`www.example.com`です。
* すべてのリクエストはサーバー`10.80.0.5`に転送されます。
* すべての受信リクエストは、サイズが1MB未満とみなされます（デフォルト設定）。
* リクエストの処理時間は60秒以内とみなされます（デフォルト設定）。
* Wallarmはmonitorモードで動作します。
* クライアントは中間にHTTPロードバランサーを挟まずに、直接フィルタリングノードにアクセスします。

!!! info "設定ファイルの作成"
    カスタムNGINX設定ファイル（例：`example.com.conf`）を作成するか、デフォルトのNGINX設定ファイル（`default.conf`）を変更できます。
    
    カスタム設定ファイルを作成する際は、NGINXが空きポートでの受信接続をリッスンしていることを確認してください。

上記の条件を満たすため、設定ファイルの内容は以下のようになります:

```
    server {
      listen 80;
      listen [::]:80 ipv6only=on;

      # トラフィックを処理する対象のドメイン
      server_name example.com; 
      server_name www.example.com;

      # トラフィック処理のmonitorモードを有効にします
      wallarm_mode monitoring; 
      # wallarm_instance 1;

      location / {
        # リクエスト転送先のアドレス設定
        proxy_pass http://10.80.0.5; 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
    }
```