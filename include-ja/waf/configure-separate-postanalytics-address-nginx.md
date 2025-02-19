```bash
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
    }

    # 省略

wallarm_tarantool_upstream wallarm_tarantool;
```

`/etc/nginx/conf.d/wallarm.conf`にpostanalyticsサーバーのアドレスを追加します:

* 各upstreamTarantoolサーバーごとに`max_conns`値を指定して、過剰な接続の作成を防ぐ必要があります。
* Tarantoolサーバーの数より低くならないように`keepalive`値を設定する必要があります。
* `# wallarm_tarantool_upstream wallarm_tarantool;`という文字列は初期設定ではコメントアウトされているため、`#`を削除してください。