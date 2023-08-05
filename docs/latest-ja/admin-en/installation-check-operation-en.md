# フィルタリングノードの動作チェック

[doc-configure-parameters]:     ../admin-en/configure-parameters-en.md
[doc-stat-service]:    ../admin-en/configure-statistics-service.md

すべてが正しく設定されている場合、Wallarmは要求をフィルタリングし、設定ファイルの設定に従ってフィルタリングされた要求をプロキシします。

正しい動作を確認するためには:

1. `wallarm-status`リクエストを実行します。
2. テスト攻撃を行います。

## 1. `wallarm-status`リクエストの実行

`/wallarm-status` URLをリクエストすることでフィルタリングノードの動作統計を取得できます。

次のコマンドを実行します：

```
curl http://127.0.0.8/wallarm-status
```

出力は次のようになります：

```
{ "requests":0,"attacks":0,"blocked":0,"abnormal":0,"tnt_errors":0,"api_errors":0,
"requests_lost":0,"segfaults":0,"memfaults":0, "softmemfaults":0,"time_detect":0,"db_id":46,
"custom_ruleset_id":16767,"proton_instances": { "total":1,"success":1,"fallback":0,"failed":0 },
"stalled_workers_count":0,"stalled_workers":[] }
```

これはフィルタリングノードの統計サービスが実行され、正常に動作していることを意味します。

!!! info "統計サービス"
     統計サービスについて詳しく読むことと、それをどのように設定するかについては[ここ][doc-stat-service]で読むことが出来ます。

## 2. テスト攻撃の実行

Wallarmが攻撃を正しく検出しているかを確認するために、保護されたリソースに対して悪意のあるリクエストを送信します。

例えば：

```
http://<リソース_URL>/etc/passwd
```

Wallarmは、リクエストで[パス横断](../attacks-vulns-list.md#path-traversal)を検出する必要があります。

`wallarm-status`が実行されたときの攻撃の回数のカウンタが増加することは、フィルタリングノードが正常に動作していることを意味します。

Wallarmフィルタリングノード設定の詳細については、[設定オプション][doc-configure-parameters]の章をご覧ください。