環境変数 | 説明| 必須
--- | ---- | ----
`WALLARM_API_TOKEN` | WallarmノードまたはAPIトークンです。 | はい
`WALLARM_API_HOST` | Wallarm APIサーバー：<ul><li>`us1.api.wallarm.com`（US Cloud用）</li><li>`api.wallarm.com`（EU Cloud用）</li></ul>デフォルト：`api.wallarm.com`です。 | いいえ
`WALLARM_LABELS` | <p>ノード4.6以降で利用可能です。`WALLARM_API_TOKEN`が`Deploy`ロールを持つ[APIトークン][api-token]に設定されている場合にのみ機能します。ノードインスタンスをグルーピングするための`group`ラベルを設定します。例：</p> <p>`WALLARM_LABELS="group=<GROUP>"`</p> <p>...はノードインスタンスを`<GROUP>`インスタンスグループに配置します（既存の場合はそのグループを使用し、存在しない場合は作成されます）。</p> | はい（APIトークンの場合）