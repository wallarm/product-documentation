postanalyticsのサーバーアドレスを`/etc/kong/nginx-wallarm.template`に追加してください:

```bash
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
}

# 省略

wallarm_tarantool_upstream wallarm_tarantool;
```

!!! warning "必須条件"
    `max_conns`および`keepalive`パラメータについて、次の条件を満たす必要があります:
    
    * `keepalive`パラメータの値はTarantoolサーバーの台数未満にしてはいけません。
    * 過剰な接続の生成を防ぐため、各upstreamのTarantoolサーバーごとに`max_conns`パラメータの値を指定する必要があります。

    デフォルトでは`# wallarm_tarantool_upstream wallarm_tarantool;`の行はコメントアウトされています。`#`を削除してください。