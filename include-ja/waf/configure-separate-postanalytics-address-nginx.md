ファイル`/etc/nginx/conf.d/wallarm.conf`にpostanalyticsサーバーのアドレスを追加します:

```bash
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
    }

    # 省略

wallarm_tarantool_upstream wallarm_tarantool;
```

* 過剰な接続の作成を防ぐため、upstreamのTarantoolサーバーそれぞれに対して`max_conns`の値を指定する必要があります。
* `keepalive`の値はTarantoolサーバーの数を下回らない必要があります。
* デフォルトでは`# wallarm_tarantool_upstream wallarm_tarantool;`の行はコメントアウトされています。`#`を削除してください。