一般的なカスタマイズオプション：

* [フィルタリングモードの設定][waf-mode-instr]
* [Wallarmノード変数のログ記録][logging-instr]
* [フィルタリングノードの背後にあるプロキシサーバのバランサを使用する][proxy-balancer-instr]
* [`block`フィルタリングモードでのWallarm Scannerアドレスの許可リストへの追加][scanner-allowlisting-instr]
* [ディレクティブ`wallarm_process_time_limit`で単一リクエストの処理時間を制限する][process-time-limit-instr]
* [NGINXディレクティブ`proxy_read_timeout`でサーバ応答待ち時間を制限する](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [NGINXディレクティブ`client_max_body_size`で最大リクエストサイズを制限する](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [NGINXでの動的DNS解決の設定][dynamic-dns-resolution-nginx]
* [**libdetection**を使った攻撃の二重検出][enable-libdetection-docs]