一般的なカスタマイズオプション:

* [フィルタリングモードの設定][waf-mode-instr]
* [Wallarmノード変数のログ出力][logging-instr]
* [フィルタリングノードの背後にあるプロキシサーバーのバランサーの使用][proxy-balancer-instr]
* [`block`フィルタリングモードでWallarmの脆弱性スキャン用IPアドレスを許可リストに追加][scanner-allowlisting-instr]
* [ディレクティブ`wallarm_process_time_limit`で単一リクエストの処理時間を制限][process-time-limit-instr]
* [NGINXディレクティブ`proxy_read_timeout`でサーバーからの応答待ち時間を制限](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [NGINXディレクティブ`client_max_body_size`でリクエストの最大サイズを制限](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [**libdetection**による攻撃の二重検知][enable-libdetection-docs]