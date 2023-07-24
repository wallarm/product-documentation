一般的なカスタマイズオプション：

* [フィルタリングモードの設定][waf-mode-instr]
* [Wallarmノード変数のログ出力][logging-instr]
* [フィルタリングノードの背後にあるプロキシサーバのバランサーの使用][proxy-balancer-instr]
* [ディレクティブ`wallarm_process_time_limit`での単一リクエスト処理時間の制限][process-time-limit-instr]
* [NGINXディレクティブ`proxy_read_timeout`でのサーバ応答待ち時間の制限](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [NGINXディレクティブ`client_max_body_size`での最大リクエストサイズの制限](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [**libdetection**を使用した攻撃の二重検出][enable-libdetection-docs]