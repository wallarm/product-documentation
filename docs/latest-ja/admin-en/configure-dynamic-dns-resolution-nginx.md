# NGINXにおける動的DNS解決の設定

NGINXの設定ファイルの`proxy_pass`ディレクティブでドメイン名が指定されると、NGINXは起動後にホストのIPアドレスを一度のみ解決します。DNSサーバがホストのIPアドレスを変更した場合、NGINXは再読み込みまたは再起動されるまで古いIPアドレスを使用し続けます。その間、NGINXは誤ったIPアドレスにリクエストを送信します。

例えば：

```bash
location / {
        proxy_pass https://demo-app.com;
        include proxy_params;
    }
```

動的DNS解決を実現するには、`proxy_pass`ディレクティブに変数を設定します。この場合、NGINXは変数計算時に[`resolver`](https://nginx.org/en/docs/http/ngx_http_core_module.html#resolver)ディレクティブで設定されたDNSアドレスを使用します。

!!! warning "動的DNS解決がトラフィック処理に及ぼす影響"
    * `proxy_pass`ディレクティブに変数を用い、`resolver`ディレクティブが設定されたNGINXの設定では、リクエスト処理に動的DNS解決の追加ステップが発生するため、処理速度が低下します。
    * NGINXはTTLが切れるとドメイン名を再解決します。`resolver`ディレクティブに`valid`パラメータを付与することで、TTLを無視し、指定した頻度で名前を再解決するよう設定できます。
    * DNSサーバがダウンしている場合、NGINXはトラフィックを処理しません。

例えば：

```bash
location / {
        resolver 172.43.1.2 valid=10s;
        set $backend https://demo-app.com$uri$is_args$args;
        proxy_pass $backend;
        include proxy_params;
    }
```

!!! info "NGINX Plusにおける動的DNS解決"
    NGINX Plusは、既定でドメイン名の動的解決をサポートします。