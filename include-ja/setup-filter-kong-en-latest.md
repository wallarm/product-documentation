The filtering and proxying rules are configured in the `/etc/kong/nginx-wallarm.template` file.  

NGINX設定ファイルの取り扱いに関する詳細情報については[公式NGINXドキュメント](https://nginx.org/en/docs/beginners_guide.html)をご覧ください。  

WallarmディレクティブはWallarmフィルタリングノードの動作ロジックを定義します。利用可能なWallarmディレクティブの一覧については[Wallarm configuration options](../admin-en/configure-parameters-en.md)ページをご覧ください。  

**設定ファイルの例**  

以下の条件でサーバーを設定する必要があると仮定します：  
* HTTPトラフィックのみ処理されます。HTTPSリクエストは処理されません。  
* リクエストを受信するドメインは`example.com`および`www.example.com`です。  
* すべてのリクエストはサーバー`10.80.0.5`に転送されなければなりません。  
* すべての受信リクエストは1MB未満（デフォルト設定）と見なされます。  
* リクエストの処理時間は60秒以内（デフォルト設定）です。  
* Wallarmはmonitorモードで動作しなければなりません。  
* クライアントは中間のHTTPロードバランサーを介さず、直接フィルタリングノードにアクセスします。  

上記条件を満たすには、設定ファイルの内容は以下のようになっている必要があります：  

```
    server {
      listen 80;
      listen [::]:80 ipv6only=on;

      # トラフィックが処理されるドメイン
      server_name example.com; 
      server_name www.example.com;

      # トラフィック処理のmonitorモードを有効にします
      wallarm_mode monitoring; 
      # wallarm_application 1;

      location / {
        # リクエスト転送先アドレスの設定
        proxy_pass http://10.80.0.5; 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
    }
```