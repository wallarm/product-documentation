postanalyticsのサーバーアドレスを `/etc/kong/nginx-wallarm.template` に追加してください。

```bash
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
}

# 省略されている部分

wallarm_tarantool_upstream wallarm_tarantool;
```

!!! warning "必要条件"
    `max_conns` および `keepalive` パラメータについて、以下の条件が満たされている必要があります：
    
    * `keepalive` パラメータの値は、Tarantoolサーバーの数より低くしてはいけません。
    * 上流のTarantoolサーバーごとに `max_conns` パラメータの値を指定して、過剰な接続の作成を防ぐ必要があります。

    `# wallarm_tarantool_upstream wallarm_tarantool;` 文字列はデフォルトでコメントされています。`#` を削除してください。