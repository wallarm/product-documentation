postanalyticsのサーバーアドレスを `/etc/nginx-wallarm/conf.d/wallarm.conf`に追加します：

```bash
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
}

#省略

wallarm_tarantool_upstream wallarm_tarantool;
```

!!! warning "必要な条件"
    `max_conns` と `keepalive` パラメータについて、以下の条件が必要です：

    * `keepalive` パラメータの値は、Tarantoolサーバーの数より少なくてはなりません。
    * 上流のTarantoolサーバーそれぞれに対して、`max_conns` パラメータの値を指定して、接続数が過剰にならないようにする必要があります。

    `# wallarm_tarantool_upstream wallarm_tarantool;` 行はデフォルトでコメントアウトされています - `#` を削除してください。