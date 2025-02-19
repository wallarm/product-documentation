The following files contain NGINX and filtering node settings:  
以下のファイルはNGINXとフィルタリングノードの設定を含みます:

* `/etc/nginx/nginx.conf` defines the configuration of NGINX  
  `/etc/nginx/nginx.conf` はNGINXの設定を定義します
* `/etc/nginx/conf.d/wallarm.conf` defines the global configuration of Wallarm filtering node  
  `/etc/nginx/conf.d/wallarm.conf` はWallarmフィルタリングノードのグローバル設定を定義します
* `/etc/nginx/conf.d/wallarm-status.conf` defines the filtering node monitoring service configuration  
  `/etc/nginx/conf.d/wallarm-status.conf` はフィルタリングノード監視サービスの設定を定義します

NGINXとWallarmの動作を定義するために、お客様独自の構成ファイルを作成することができます。ドメイングループごとに同じ方法で処理される場合、各グループごとに`server`ブロックを含む個別の構成ファイルを作成することを推奨します。

NGINX構成ファイルの操作に関する詳細情報については、[公式NGINXドキュメント](https://nginx.org/en/docs/beginners_guide.html)をご覧ください。

Wallarmディレクティブは、Wallarmフィルタリングノードの動作ロジックを定義します。利用可能なWallarmディレクティブの一覧については、[Wallarm構成オプション](configure-parameters-en.md)のページをご覧ください.

**構成ファイル例**

サーバーを以下の条件で動作させる必要があると仮定します:
* HTTPトラフィックのみが処理され、HTTPSリクエストは一切処理されません。
* リクエストを受信するドメインは`example.com`および`www.example.com`です。
* すべてのリクエストは`10.80.0.5`サーバーに転送されます。
* すべての着信リクエストは1MB未満のサイズと見なされます（デフォルト設定）。
* リクエストの処理時間は最大60秒以内です（デフォルト設定）。
* Wallarmはモニターモードで動作します。
* クライアントは中間のHTTPロードバランサーを経由せず、直接フィルタリングノードにアクセスします。

!!! info "構成ファイルの作成"
    カスタムNGINX構成ファイル（例: `example.com.conf`）を作成するか、デフォルトNGINX構成ファイル（`default.conf`）を変更することができます。
    
    カスタム構成ファイルを作成する際は、NGINXが空いているポートで着信接続を受信するように設定されていることを確認してください。

上記の条件を満たすため、構成ファイルの内容は以下のようにする必要があります:

```
    server {
      listen 80;
      listen [::]:80 ipv6only=on;

      # トラフィックを処理するドメイン
      server_name example.com; 
      server_name www.example.com;

      # トラフィック処理のモニターモードを有効化
      wallarm_mode monitoring; 
      # wallarm_application 1;

      location / {
        # リクエスト転送用のアドレスを設定
        proxy_pass http://10.80.0.5; 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
    }
```