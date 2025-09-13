一般的なカスタマイズオプションは次のとおりです:

* [フィルタリングモードの構成][waf-mode-instr]
* [Wallarmノード変数のログ記録][logging-instr]
* [フィルタリングノードの背後にあるプロキシサーバのバランサーの使用][proxy-balancer-instr]
* [ディレクティブ`wallarm_process_time_limit`における単一のリクエストの処理時間の制限][process-time-limit-instr]
* [NGINXディレクティブ`proxy_read_timeout`におけるサーバ応答の待機時間の制限](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [NGINXディレクティブ`client_max_body_size`における最大リクエストサイズの制限](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [NGINXでの動的DNS解決の構成][dynamic-dns-resolution-nginx]