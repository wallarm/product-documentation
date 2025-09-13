デフォルトでは、デプロイ済みのWallarm Nodeは受信トラフィックを解析しません。

トラフィック解析を有効化し正規のトラフィックをプロキシするには、通常は`/etc/nginx/sites-available/default`にある[NGINX設定ファイル](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/)を更新します。
    
必要な最小限の設定変更は次のとおりです。

1. Wallarm Nodeを`wallarm_mode monitoring;`に設定します。このモードは初期デプロイやテストに推奨されます。

    Wallarmは、blockingやsafe blockingなど、より多くのモードもサポートしており、詳細は[こちら][waf-mode-instr]をご覧ください。
1. 必要なlocationに`proxy_pass`ディレクティブを追加して、正規のトラフィックの転送先を決定します。宛先はアプリケーションサーバーのIP、ロードバランサー、またはDNS名に設定できます。
1. 存在する場合は、ローカルファイルによる干渉なしにトラフィックがWallarmへ送られるよう、変更したlocationから`try_files`ディレクティブを削除します。

```diff
server {
    ...
+   wallarm_mode monitoring;
    location / { 
+        proxy_pass http://example.com;
-        # try_files $uri $uri/ =404;
    }
    ...
}
```