# NGINXベースのIngressコントローラー監視

--8<-- "../include/ingress-controller-best-practices-intro.md"

NGINX Ingressコントローラーの監視に関する一般的な側面は、既にインターネット上で十分に取り上げられています。しかし、Wallarmは本番環境で重要な状況において監視する必要がある追加の監視メトリクスを提供します。デフォルトでは、`/wallarm-metrics`メトリクスサービスは無効化されています。

サービスを有効にするには、`controller.wallarm.metrics.enabled`を`true`に設定してください:

```
controller:
  wallarm:
    metrics:
      enabled: true
```

以下は、新たに公開されたエンドポイントから利用可能なPrometheus形式のWallarm固有のメトリクス一覧です:

```
# HELP wallarm_requests リクエスト数
# TYPE wallarm_requests gauge
wallarm_requests 2
# HELP wallarm_attacks 攻撃リクエスト数
# TYPE wallarm_attacks gauge
wallarm_attacks 0
# HELP wallarm_blocked ブロックされたリクエスト数
# TYPE wallarm_blocked gauge
wallarm_blocked 0
# HELP wallarm_blocked_by_acl aclによりブロックされたリクエスト数
# TYPE wallarm_blocked_by_acl gauge
wallarm_blocked_by_acl 0
# HELP wallarm_acl_allow_list allow listを通過したリクエスト数
# TYPE wallarm_acl_allow_list gauge
wallarm_acl_allow_list 0
# HELP wallarm_abnormal 異常なリクエスト数
# TYPE wallarm_abnormal gauge
wallarm_abnormal 2
# HELP wallarm_tnt_errors tarantool書き込みエラー数
# TYPE wallarm_tnt_errors gauge
wallarm_tnt_errors 0
# HELP wallarm_api_errors API書き込みエラー数
# TYPE wallarm_api_errors gauge
wallarm_api_errors 0
# HELP wallarm_requests_lost 失われたリクエスト数
# TYPE wallarm_requests_lost gauge
wallarm_requests_lost 0
# HELP wallarm_overlimits_time overlimits_time数
# TYPE wallarm_overlimits_time gauge
wallarm_overlimits_time 0
# HELP wallarm_segfaults セグメンテーションフォルト数
# TYPE wallarm_segfaults gauge
wallarm_segfaults 0
# HELP wallarm_memfaults vmem制限に達したイベント数
# TYPE wallarm_memfaults gauge
wallarm_memfaults 0
# HELP wallarm_softmemfaults リクエストのメモリ制限に達したイベント数
# TYPE wallarm_softmemfaults gauge
wallarm_softmemfaults 0
# HELP wallarm_proton_errors libprotonのメモリ以外に起因する障害のエラー数
# TYPE wallarm_proton_errors gauge
wallarm_proton_errors 0
# HELP wallarm_time_detect_seconds 検出に費やされた時間（秒）
# TYPE wallarm_time_detect_seconds gauge
wallarm_time_detect_seconds 0
# HELP wallarm_db_id proton.dbファイルのID
# TYPE wallarm_db_id gauge
wallarm_db_id 71
# HELP wallarm_lom_id LOMファイルのID
# TYPE wallarm_lom_id gauge
wallarm_lom_id 386
# HELP wallarm_custom_ruleset_id カスタムルールセットファイルのID
# TYPE wallarm_custom_ruleset_id gauge
wallarm_custom_ruleset_id{format="51"} 386
# HELP wallarm_custom_ruleset_ver カスタムルールセットファイルフォーマットのバージョン
# TYPE wallarm_custom_ruleset_ver gauge
wallarm_custom_ruleset_ver 51
# HELP wallarm_db_apply_time proton.dbファイルの適用時間
# TYPE wallarm_db_apply_time gauge
wallarm_db_apply_time 1674548649
# HELP wallarm_lom_apply_time LOMファイルの適用時間
# TYPE wallarm_lom_apply_time gauge
wallarm_lom_apply_time 1674153198
# HELP wallarm_custom_ruleset_apply_time カスタムルールセットファイルの適用時間
# TYPE wallarm_custom_ruleset_apply_time gauge
wallarm_custom_ruleset_apply_time 1674153198
# HELP wallarm_proton_instances protonインスタンスの数
# TYPE wallarm_proton_instances gauge
wallarm_proton_instances{status="success"} 5
wallarm_proton_instances{status="fallback"} 0
wallarm_proton_instances{status="failed"} 0
# HELP wallarm_stalled_worker_time_seconds libprotonで停止していたワーカーの時間（秒）
# TYPE wallarm_stalled_worker_time_seconds gauge
wallarm_stalled_worker_time_seconds{pid="3169104"} 25

# HELP wallarm_startid ユニークなスタートID
# TYPE wallarm_startid gauge
wallarm_startid 3226376659815907920
```

監視設定に関する詳細な情報および利用可能なメトリクスの一覧は、この[ドキュメント](../../../configure-statistics-service.md)に記載されています。