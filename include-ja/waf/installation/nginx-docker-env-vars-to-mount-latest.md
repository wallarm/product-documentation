環境変数 | 説明 | 必須
--- | ---- | ----
`WALLARM_API_TOKEN` | WallarmノードまたはAPIトークン。 | はい
`WALLARM_API_HOST` | Wallarm APIサーバー:<ul><li>`us1.api.wallarm.com` はUSクラウドのため</li><li>`api.wallarm.com` はEUクラウドのため</li></ul>デフォルトは `api.wallarm.com`。 | いいえ
`WALLARM_LABELS` | <p>ノード4.6から利用可能。`WALLARM_API_TOKEN`が`Deploy`ロールを持つ[API token][api-token]に設定されている場合のみ動作します。例として、ノードインスタンスのグループ化に`group`ラベルをセットします：</p> <p>`WALLARM_LABELS="group=<GROUP>"`</p> <p>...これにより、ノードインスタンスは`<GROUP>`インスタンスグループ（既存の場合、または存在しない場合は作成されます）に配置されます。</p> | はい（APIトークンの場合）