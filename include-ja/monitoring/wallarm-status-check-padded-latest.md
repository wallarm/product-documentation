1.  統計サービスのデフォルト設定を使用している場合は、`curl http://127.0.0.8/wallarm-status`コマンドを実行します。 
2.  それ以外の場合は、上記と同様の正しいコマンドを作成するために、`/etc/nginx/conf.d/wallarm-status.conf`設定ファイルを参照します。
```
{"requests":64,"attacks":16,"blocked":0,"abnormal":64,"tnt_errors":0,"api_errors":0,"requests_lost":0,"segfaults":0,"memfaults":0,"softmemfaults":0,"time_detect":0,"db_id":46,"custom_ruleset_id":4,"proton_instances": { "total":2,"success":2,"fallback":0,"failed":0 },"stalled_workers_count":0,"stalled_workers":[] }
```