`/etc/nginx/conf.d/wallarm.conf`ファイルにpostanalyticsサーバーのアドレスを追加してください：

```bash
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
}

# 省略されています

wallarm_tarantool_upstream wallarm_tarantool;
```

* `max_conns`の値は、上流のTarantoolサーバーそれぞれに対して余計な接続を防ぐために指定する必要があります。
* `keepalive` の値は、Tarantoolサーバーの数以下になってはいけません。
* デフォルトでは `# wallarm_tarantool_upstream wallarm_tarantool;` の行はコメントアウトされています - `#` を削除してください。