NGINX-Wallarmモジュールを搭載したマシン上で、NGINXの[設定ファイル](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/)にpostanalyticsモジュールのサーバーアドレスを指定します:

```
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
    }

    # 省略

wallarm_tarantool_upstream wallarm_tarantool;
```

- 過剰な接続の確立を防ぐため、upstreamの各Tarantoolサーバーに対して`max_conns`の値を指定する必要があります。
- `keepalive`の値はTarantoolサーバーの台数より小さくしてはいけません。
- `# wallarm_tarantool_upstream wallarm_tarantool;`の行はデフォルトでコメントアウトされています。`#`を削除してください。

設定ファイルを変更したら、NGINX-Wallarmモジュールを搭載したサーバー上のNGINX/NGINX Plusを再起動します:

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
=== "AlmaLinux、Rocky LinuxまたはOracle Linux 8.x"
    ```bash
    sudo systemctl restart nginx
    ```
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart nginx
    ```