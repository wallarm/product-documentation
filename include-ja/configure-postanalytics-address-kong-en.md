`/etc/kong/nginx-wallarm.template`にpostanalyticsのサーバアドレスを追加します:

```bash
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
}

# 省略

wallarm_tarantool_upstream wallarm_tarantool;
```

!!! warning "必要な条件"
    `max_conns`および`keepalive`パラメータについて、以下の条件を満たす必要があります：
    
    * `keepalive`パラメータの値はTarantoolサーバの数より小さくあってはなりません。
    * 過剰な接続の作成を防ぐため、各upstreamTarantoolサーバに対して`max_conns`パラメータの値を指定する必要があります。
    
    デフォルトでは`# wallarm_tarantool_upstream wallarm_tarantool;`という文字列がコメントアウトされているため、`#`を削除してください。