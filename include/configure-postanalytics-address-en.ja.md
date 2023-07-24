postanalyticsのサーバーアドレスを `/etc/nginx-wallarm/conf.d/wallarm.conf` に追加します。

```bash
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
}

# 省略

wallarm_tarantool_upstream wallarm_tarantool;
```

!!! warning "必要条件"
    `max_conns` および `keepalive` パラメータには以下の条件が満たされる必要があります。
    
    * `keepalive` パラメータの値は、Tarantool サーバーの数よりも低くしてはいけません。
    * 上流の Tarantool サーバーごとに `max_conns` パラメータを指定して、過剰な接続の作成を防ぐ必要があります。

    `# wallarm_tarantool_upstream wallarm_tarantool;` という文字列はデフォルトでコメント化されています - `#` を削除してください。