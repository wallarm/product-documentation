環境変数 | 説明| 必須
--- | ---- | ----
`WALLARM_API_TOKEN` | WallarmノードまたはAPIトークンです。 | はい
`WALLARM_API_HOST` | Wallarm APIサーバー:<ul><li>`us1.api.wallarm.com`はUS Cloud向けです</li><li>`api.wallarm.com`はEU Cloud向けです</li></ul>デフォルト: `api.wallarm.com`。 | いいえ
`WALLARM_LABELS` | <p>ノード4.6以降で利用可能です。`WALLARM_API_TOKEN`が`Deploy`ロールを持つ[APIトークン][api-token]に設定されている場合にのみ動作します。ノードインスタンスをグループ化するための`group`ラベルを設定します。例:</p> <p>`WALLARM_LABELS="group=<GROUP>"`</p> <p>...はノードインスタンスを`<GROUP>`インスタンスグループに配置します（既存の場合はそのグループに、存在しない場合は作成されます）。</p> | はい（APIトークンの場合）
`SLAB_ALLOC_ARENA` (`TARANTOOL_MEMORY_GB` [NGINXノード5.x以前][what-is-new-wstore]) | wstoreに割り当てられる[メモリ量][allocating-memory-guide]です。値は浮動小数点数を指定できます（小数点の区切り文字はドット<code>.</code>です）。デフォルト: 1.0（1ギガバイト）です。 | いいえ
`WALLARM_APID_ONLY`（5.3.7以降） | このモードでは、トラフィックで検出された攻撃はノードによってローカルでブロックされます（[有効化][filtration-modes]されている場合）。ただしWallarm Cloudへはエクスポートされません。一方、[API Discovery][api-discovery-docs]やその他の一部の機能は引き続き完全に機能し、APIインベントリを検出してCloudにアップロードし、可視化します。このモードは、まずAPIインベントリを確認して機微データを特定し、そのうえで攻撃データのエクスポートを計画的に実施したい方に適しています。ただし、Wallarmは攻撃データを安全に処理し、必要に応じて[機微な攻撃データのマスキング][sensitive-data-rule]も提供しますので、攻撃データのエクスポートを無効化することは稀です。[詳細][apid-only-mode-details]<br>デフォルト: `false`です。 | いいえ
`APIFW_METRICS_ENABLED`（6.4.1以降） | API Specification Enforcementモジュール用のPrometheusメトリクスを有効にします。<br>デフォルト: `false`（無効）です。 | いいえ
`APIFW_METRICS_HOST`（6.4.1以降） | API Specification Enforcementがメトリクスを公開するホストとポートを定義します。<br>デフォルト: `:9010`。 | いいえ
`APIFW_METRICS_ENDPOINT_NAME`（6.4.1以降） | API Specification EnforcementのメトリクスエンドポイントのHTTPパスを定義します。<br>デフォルト: `metrics`。 | いいえ