Environment variable | Description | Required
--- | ---- | ----
`WALLARM_API_TOKEN` | WallarmノードまたはAPIトークンです。 | Yes
`WALLARM_API_HOST` | Wallarm APIサーバー:<ul><li>USクラウドの場合は`us1.api.wallarm.com`</li><li>EUクラウドの場合は`api.wallarm.com`</li></ul>デフォルト：`api.wallarm.com`。 | No
`WALLARM_LABELS` | <p>node4.6以降から利用可能です。`Deploy`ロールを持つ[API token][api-token]として`WALLARM_API_TOKEN`が設定されている場合にのみ動作します。ノードインスタンスのグループ分けのために`group`ラベルを設定します。例えば：</p> <p>`WALLARM_LABELS="group=<GROUP>"`</p> <p>…ノードインスタンスは`<GROUP>`のインスタンスグループに配置されます（既存であればそのグループに、存在しない場合は作成されます）。</p> | Yes (for API tokens)