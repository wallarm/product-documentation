# フィルタリングノードの動作確認

[doc-configure-parameters]:     ../admin-en/configure-parameters-en.md
[doc-stat-service]:    ../admin-en/configure-statistics-service.md

すべての設定が正しく構成されている場合、Wallarmはリクエストをフィルタリングし、構成ファイルの設定に従ってフィルタリングされたリクエストをプロキシします。

正しい動作を確認するには、以下の手順を実行します:

1. `wallarm-status`リクエストを実行します。
2. テスト攻撃を実行します。

    
## 1. `wallarm-status`リクエストを実行

`/wallarm-status`URLへリクエストすることでフィルタリングノードの動作統計情報を取得できます。

コマンドを実行します:

```
curl http://127.0.0.8/wallarm-status
```

出力例は次のとおりです:

```
{ "requests":0,"attacks":0,"blocked":0,"abnormal":0,"tnt_errors":0,"api_errors":0,
"requests_lost":0,"segfaults":0,"memfaults":0, "softmemfaults":0,"time_detect":0,"db_id":46,
"custom_ruleset_id":16767,"proton_instances": { "total":1,"success":1,"fallback":0,"failed":0 },
"stalled_workers_count":0,"stalled_workers":[] }
```

これはフィルタリングノード統計サービスが正常に稼働していることを意味します。

!!! info "統計サービス"
    統計サービスおよびその設定方法の詳細については[こちら][doc-stat-service]を参照してください。

## 2. テスト攻撃の実行

Wallarmが攻撃を正しく検出するかどうかを確認するため、保護対象リソースに悪意のあるリクエストを送信してください。

たとえば:

```
http://<resource_URL>/etc/passwd
```

Wallarmはリクエスト内の[Path Traversal](../attacks-vulns-list.md#path-traversal)を検出する必要があります。

これにより、`wallarm-status`リクエストを実行すると攻撃件数カウンターが増加し、フィルタリングノードが正常に動作していることを示します。

Wallarmフィルタリングノードの設定の詳細については、[Configuration options][doc-configure-parameters]の章を参照してください。