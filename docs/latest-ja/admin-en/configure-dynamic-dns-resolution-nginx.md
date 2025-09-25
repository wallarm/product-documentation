# NGINXでの動的DNS解決の設定

NGINXの設定ファイルの`proxy_pass`ディレクティブにドメイン名を指定した場合、NGINXは起動後にホストのIPアドレスを1回だけ解決します。DNSサーバーがホストのIPアドレスを変更しても、NGINXをリロードまたは再起動するまで古いIPアドレスを引き続き使用します。それまでの間、NGINXは誤ったIPアドレスにリクエストを送信します。

例:

```bash
location / {
        proxy_pass https://demo-app.com;
        include proxy_params;
    }
```

動的DNS解決を行うには、`proxy_pass`ディレクティブを変数として設定できます。この場合、NGINXは変数を評価する際に[`resolver`](https://nginx.org/en/docs/http/ngx_http_core_module.html#resolver)ディレクティブで設定されたDNSサーバーアドレスを使用します。

!!! warning "動的DNS解決がトラフィック処理に与える影響"
    * `resolver`ディレクティブと`proxy_pass`ディレクティブ内の変数を含むNGINXの設定では、リクエスト処理中に動的DNS解決の追加のステップが入るため、処理が遅くなります。
    * NGINXはTTL(Time To Live)の有効期限が切れたときにドメイン名を再解決します。`resolver`ディレクティブに`valid`パラメータを指定すると、TTLを無視して、代わりに指定した頻度でドメイン名を再解決するようNGINXに指示できます。
    * DNSサーバーがダウンしている場合、NGINXはトラフィックを処理しません。

例:

```bash
location / {
        resolver 172.43.1.2 valid=10s;
        set $backend https://demo-app.com$uri$is_args$args;
        proxy_pass $backend;
        include proxy_params;
    }
```

!!! info "NGINX Plusでの動的DNS解決"
    NGINX Plusはドメイン名の動的解決をデフォルトでサポートします。