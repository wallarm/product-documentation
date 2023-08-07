一般的なカスタマイズオプション:

* [フィルタリングモードの設定][waf-mode-instr]
* [Wallarmノード変数のロギング][logging-instr]
* [フィルタリングノードの後ろのプロキシサーバーのバランサーを使用する][proxy-balancer-instr]
* [ディレクティブ `wallarm_process_time_limit` 内の単一リクエスト処理時間を制限する][process-time-limit-instr]
* [NGINXディレクティブ `proxy_read_timeout`内でサーバー応答待ち時間を制限する](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [NGINXディレクティブ `client_max_body_size`内で最大リクエストサイズを制限する](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [NGINXで動的DNS解決を設定する][dynamic-dns-resolution-nginx]
* [**libdetection**を用いた攻撃のダブル検出][enable-libdetection-docs]