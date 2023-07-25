# NGINXでの動的DNS解決の設定

ドメイン名がNGINXの設定ファイルの `proxy_pass` ディレクティブに渡される場合、NGINXはホストのIPアドレスを開始時に一度だけ解決します。DNSサーバーがホストのIPアドレスを変更すると、NGINXがリロードまたは再起動されるまで古いIPアドレスを使用し続けます。そのまえに、NGINXは誤ったIPアドレスにリクエストを送信します。

例：

```bash
location / {
        proxy_pass https://demo-app.com;
        include proxy_params;
    }
```

動的DNS解決のために、`proxy_pass`ディレクティブを変数として設定できます。この場合、NGINXは変数の計算時に、[`resolver`](https://nginx.org/en/docs/http/ngx_http_core_module.html#resolver)ディレクティブで設定されたDNSアドレスを使用します。

!!! warning "動的DNS解決がトラフィック処理に与える影響"
    * `resolver`ディレクティブと`proxy_pass`ディレクティブの変数を含むNGINX設定は、リクエスト処理中に動的DNS解決の追加手順があるため、リクエスト処理が遅くなります。
    * DNSサーバーがダウンしている場合、NGINXはトラフィックを処理しません。

例：

```bash
location / {
        resolver 172.43.1.2;
        set $backend https://demo-app.com$uri$is_args$args;
        proxy_pass $backend;
        include proxy_params;
    }
```

!!! info "NGINX Plusでの動的DNS解決"
    NGINX Plusは、デフォルトでドメイン名の動的解決をサポートしています。