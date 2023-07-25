# フィルタリングノード操作の確認

[doc-configure-parameters]:     ../admin-en/configure-parameters-en.ja.md
[doc-stat-service]:    ../admin-en/configure-statistics-service.ja.md

すべてが正しく設定されている場合、Wallarm はリクエストをフィルタリングし、設定ファイルの設定に従ってフィルタリングされたリクエストをプロキシします。

正常な操作を確認するには、次の手順を実行する必要があります：

1. `wallarm-status`リクエストを実行します。
2. テスト攻撃を実行します。

## 1. `wallarm-status`リクエストを実行する

`/wallarm-status` URL をリクエストすることで、フィルタリングノード操作統計を取得できます。

次のコマンドを実行します：

```
curl http://127.0.0.8/wallarm-status
```

出力は以下のようになります：

```
{ "requests":0,"attacks":0,"blocked":0,"abnormal":0,"tnt_errors":0,"api_errors":0,
"requests_lost":0,"segfaults":0,"memfaults":0, "softmemfaults":0,"time_detect":0,"db_id":46,
"custom_ruleset_id":16767,"proton_instances": { "total":1,"success":1,"fallback":0,"failed":0 },
"stalled_workers_count":0,"stalled_workers":[] }
```

これは、フィルタリングノード統計サービスが実行中で正常に動作していることを意味します。

!!! info "統計サービスについて"
    統計サービスやその設定方法についての詳細は[こちら][doc-stat-service]をご覧ください。

## 2. テスト攻撃を実行する

Wallarm が攻撃を正しく検出しているかどうかを確認するには、保護されたリソースに対して悪意のあるリクエストを送信します。

例えば：

```
http://<resource_URL>/etc/passwd
```

Wallarm は、リクエスト内で [パストラバーサル](../attacks-vulns-list.ja.md#path-traversal) を検出する必要があります。

これで、`wallarm-status` のリクエストを実行すると、攻撃の回数カウンタが増加し、フィルタリングノードが正常に動作していることがわかります。

Wallarm フィルタリングノード設定の詳細については、[設定オプション][doc-configure-parameters]の章を参照してください。