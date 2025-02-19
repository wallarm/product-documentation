postanalyticsのサーバーアドレスを`/etc/nginx-wallarm/conf.d/wallarm.conf`に追加します:

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
    以下の条件が`max_conns`および`keepalive`パラメータに対して満たされる必要があります:
    
    * `keepalive`パラメータの値はTarantoolサーバの数より低くしてはなりません。
    * 過剰な接続の作成を防ぐため、upstreamの各Tarantoolサーバに対して`max_conns`パラメータの値が指定されている必要があります。
    
    デフォルトでは`# wallarm_tarantool_upstream wallarm_tarantool;`の文字列はコメントアウトされているので、`#`を削除してください。