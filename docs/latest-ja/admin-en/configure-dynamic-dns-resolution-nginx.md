# NGINXで動的DNS解決を設定する

ドメイン名がNGINXの設定ファイルの `proxy_pass` ディレクティブに渡されている場合、NGINXはホストのIPアドレスをスタート時に一度だけ解決します。もしDNSサーバーがホストのIPアドレスを変更した場合でも、NGINXが再度読み込まれたり再起動されたりするまで、古いIPアドレスを使用し続けます。それまでは、NGINXは間違ったIPアドレスにリクエストを送り続けます。

例えば：

```bash
location / {
        proxy_pass https://demo-app.com;
        include proxy_params;
    }
```

動的DNS解決のために、 `proxy_pass` ディレクティブを変数として設定することができます。この場合、NGINXは変数を計算する際に [`resolver`](https://nginx.org/en/docs/http/ngx_http_core_module.html#resolver) ディレクティブで設定されたDNSアドレスを使用します。

!!! warning "動的DNS解決がトラフィック処理に与える影響"
    * `resolver` ディレクティブと `proxy_pass` ディレクティブ内の変数を含むNGINXの設定は、リクエスト処理の動的DNS解決の追加ステップとなり、リクエスト処理が遅くなる可能性があります。
    * NGINXは、そのタイム・トゥ・ライフ（TTL）が期限切れになるとドメイン名を再解決します。 `resolver` ディレクティブに `valid` パラメーターを含めることで、NGINXにTTLを無視して、指定した頻度で名前を再解決するよう指示することができます。
    * DNSサーバーがダウンしている場合、NGINXはトラフィックを処理しません。

例えば：

```bash
location / {
        resolver 172.43.1.2 valid=10s;
        set $backend https://demo-app.com$uri$is_args$args;
        proxy_pass $backend;
        include proxy_params;
    }
```

!!! info "NGINX Plusでの動的DNS解決"
    NGINX Plusは、デフォルトでドメイン名の動的解決をサポートしています。