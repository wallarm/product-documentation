postanalyticsのサーバーアドレスを`/etc/kong/nginx-wallarm.template`に追加してください：

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
    `max_conns`パラメータと`keepalive`パラメータに対して以下の条件が満たされていることが必要です：
    
    * `keepalive`パラメータの値は、Tarantoolサーバーの数より小さくないこと。
    * 過剰な接続が作成されるのを防ぐために、上流のTarantoolサーバーごとに`max_conns`パラメータの値を指定してください。

    `# wallarm_tarantool_upstream wallarm_tarantool;`の文字列はデフォルトでコメントアウトされています - `#`を削除してください。