NGINX-Wallarmモジュールを搭載したマシンのNGINX[configuration file](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/)に、postanalyticsモジュールのサーバーアドレスを指定します:

```
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
    }

    # omitted

wallarm_tarantool_upstream wallarm_tarantool;
```

* 各upstream Tarantoolサーバーに対して`max_conns`の値を指定し、過剰な接続が作成されるのを防ぎます。
* `keepalive`の値はTarantoolサーバーの数未満にしてはいけません。
* `# wallarm_tarantool_upstream wallarm_tarantool;`という文字列はデフォルトでコメントアウトされていますので、`#`を削除してください。

設定ファイルを変更した後、NGINX-WallarmモジュールサーバーでNGINX/NGINX Plusを再起動します:

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
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo systemctl restart nginx
    ```
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart nginx
    ```