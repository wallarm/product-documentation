NGINX-Wallarmモジュールを搭載したマシンのNGINX[設定ファイル](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/)（通常は`/etc/nginx/nginx.conf`にあります）で、postanalyticsモジュールのサーバーアドレスを指定します:

```
http {
    # 省略
    upstream wallarm_wstore {
        server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
        server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
        
        keepalive 2;
    }

    wallarm_wstore_upstream wallarm_wstore;

    # 省略
}
```

* 過剰な接続の作成を防ぐため、各upstreamのwstoreサーバーに対して`max_conns`の値を指定する必要があります。
* `keepalive`の値はwstoreサーバーの数より小さくしてはいけません。
* `# wallarm_wstore_upstream wallarm_wstore;`の行は既定ではコメントアウトされています。`#`を削除してください。

設定ファイルを変更したら、NGINX-WallarmモジュールのサーバーでNGINX/NGINX Plusを再起動します:

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