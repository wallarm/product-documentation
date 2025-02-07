# 一般的なカスタマイズオプション:

* [フィルトレーションモードの設定][waf-mode-instr]
* [Wallarmノード変数のログ出力][logging-instr]
* [フィルタリングノード背後のプロキシサーババランサーの使用][proxy-balancer-instr]
* [`block`フィルトレーションモードにおけるWallarm Scannerアドレスの許可リストへの追加][scanner-allowlisting-instr]
* [`wallarm_process_time_limit`ディレクティブにおける単一リクエスト処理時間の制限][process-time-limit-instr]
* [NGINXディレクティブ`proxy_read_timeout`におけるサーバ応答待機時間の制限](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [NGINXディレクティブ`client_max_body_size`における最大リクエストサイズの制限](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [NGINXにおける動的DNS解決の設定][dynamic-dns-resolution-nginx]
* [**libdetection**を利用した攻撃の二重検出][enable-libdetection-docs]