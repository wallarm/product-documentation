一般的なカスタマイズのオプション:

* [フィルタモードの設定][waf-mode-instr]
* [Wallarmノードの変数のログ記録][logging-instr]
* [フィルタリングノードの後ろのプロキシサーバーのバランサーの使用][proxy-balancer-instr]
* [`block`フィルタモードでのWallarm Scannerのアドレスを許可リストに追加する][scanner-allowlisting-instr]
* [ディレクティブ`wallarm_process_time_limit`での単一リクエストの処理時間の制限][process-time-limit-instr]
* [NGINXディレクティブ `proxy_read_timeout`でのサーバーレスポンスの待ち時間の制限](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [NGINXディレクティブ`client_max_body_size`での最大リクエストサイズの制限](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [NGINXでの動的DNS解決の設定][dynamic-dns-resolution-nginx]
* [**libdetection**での攻撃の二重検出][enable-libdetection-docs]