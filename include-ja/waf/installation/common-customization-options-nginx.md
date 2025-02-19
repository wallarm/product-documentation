```markdown
一般的なカスタマイズオプション：

* [フィルタリングモードの設定][waf-mode-instr]
* [Wallarmノード変数のログ記録][logging-instr]
* [フィルタリングノード背後のプロキシサーバーのバランサーの使用方法][proxy-balancer-instr]
* [ディレクティブ`wallarm_process_time_limit`による単一リクエスト処理時間の制限][process-time-limit-instr]
* [NGINXディレクティブ`proxy_read_timeout`によるサーバー応答待機時間の制限](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [NGINXディレクティブ`client_max_body_size`による最大リクエストサイズの制限](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [NGINXにおける動的DNS解決の設定][dynamic-dns-resolution-nginx]
* [**libdetection**を使用した攻撃の二重検知][enable-libdetection-docs]
```