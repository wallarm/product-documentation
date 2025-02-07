デフォルトでは、デプロイされたWallarm Nodeは受信トラフィックを解析しません。

受信トラフィックの解析および正当なトラフィックのプロキシを有効にするには、通常`/etc/nginx/sites-available/default`に配置されている[NGINX構成ファイル](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/)を更新します。
    
以下の最小限の構成調整が必要です：

1. Wallarm Nodeを`wallarm_mode monitoring;`に設定します。このモードは初期デプロイおよびテストに推奨です。

    Wallarmは、ブロッキングやセーフブロッキングなどの他のモードもサポートしており、[詳細をご参照ください][waf-mode-instr]。
1. ノードが正当なトラフィックを転送すべき場所を、必要な箇所で`proxy_pass`ディレクティブを追加して指定します。これは、アプリケーションサーバのIP、ロードバランサ、またはDNS名である可能性があります。
1. 必要なら、修正箇所から`try_files`ディレクティブを削除し、ローカルファイルの干渉なくトラフィックがWallarmに向けられるようにします。

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