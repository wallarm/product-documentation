一般的なカスタマイズ設定:

* [フィルトレーションモードの設定][waf-mode-instr]
* [Wallarmノード変数のログ記録][logging-instr]
* [フィルタリングノード背後にあるプロキシサーババランサの使用][proxy-balancer-instr]
* [`block`フィルトレーションモードでWallarmScannerのアドレスを許可リストに追加する][scanner-allowlisting-instr]
* [ディレクティブ`wallarm_process_time_limit`における単一リクエスト処理時間の制限][process-time-limit-instr]
* [NGINXディレクティブ`proxy_read_timeout`におけるサーバ応答待機時間の制限](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [NGINXディレクティブ`client_max_body_size`における最大リクエストサイズの制限](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [**libdetection**を用いた攻撃の二重検出][enable-libdetection-docs]