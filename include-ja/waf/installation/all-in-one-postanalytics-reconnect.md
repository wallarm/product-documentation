NGINX-Wallarmモジュールを搭載したマシンでは、NGINXの設定ファイル内でpostanalyticsモジュールのサーバーアドレスを指定します：

```
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
    }

    # omitted

wallarm_tarantool_upstream wallarm_tarantool;
```

* `max_conns`の値は、各アップストリームTarantoolサーバーに対して過剰な接続の作成を防ぐために指定する必要があります。
* `keepalive`の値は、Tarantoolサーバーの数より小さくてはなりません。
* `# wallarm_tarantool_upstream wallarm_tarantool;`の文字列はデフォルトでコメント化されています - `#`を削除してください。

設定ファイルが変更されたら、NGINX-Wallarmモジュールサーバー上のNGINX/NGINX Plusを再起動します：

=== "Debian"
    ```bash
    sudo systemctl restart nginx
    ```
=== "Ubuntu"
    ```bash
    sudo service nginx restart
    ```
=== "CentOS"
    ```bash
    sudo systemctl restart nginx
    ```
=== "AlmaLinux, Rocky LinuxまたはOracle Linux 8.x"
    ```bash
    sudo systemctl restart nginx
    ```