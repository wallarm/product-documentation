一般的なカスタマイズオプション:

* [フィルタリングモードの設定][waf-mode-instr]
* [Wallarmノード変数のロギング][logging-instr]
* [フィルタリングノードの背後でプロキシサーバーのバランサーを使用する][proxy-balancer-instr]
* [`block`フィルタモードでWallarmスキャナーのアドレスを許可リストに追加する][scanner-allowlisting-instr]
* [ディレクティブ`wallarm_process_time_limit`内の単一リクエスト処理時間を制限する][process-time-limit-instr]
* [NGINXディレクティブ `proxy_read_timeout` におけるサーバー返答待機時間の制限](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [NGINXディレクティブ `client_max_body_size` における最大リクエストサイズの制限](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [**libdetection**を用いた二重攻撃検出][enable-libdetection-docs]