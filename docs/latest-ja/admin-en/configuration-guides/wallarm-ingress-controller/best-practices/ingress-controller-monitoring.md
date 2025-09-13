# NGINXベースのIngress Controllerの監視

--8<-- "../include/ingress-controller-best-practices-intro.md"

NGINX Ingress Controllerの監視の一般的な側面は、すでにインターネット上で十分に解説されています。Wallarmは、ミッションクリティカルな環境で監視すべき追加の監視メトリクスを提供します。デフォルトでは`/wallarm-metrics`メトリクスサービスは無効です。

サービスを有効にするには、`controller.wallarm.metrics.enabled`を`true`に設定します:

```
controller:
  wallarm:
    metrics:
      enabled: true
```

以下は、新たに公開されたエンドポイントから利用できるPrometheus形式のWallarm固有メトリクスの一覧です:

```
# HELP wallarm_requests リクエスト数
# TYPE wallarm_requests gauge
wallarm_requests 2
# HELP wallarm_messages リクエスト数
# TYPE wallarm_messages gauge
wallarm_messages 0
# HELP wallarm_attacks 攻撃リクエスト数
# TYPE wallarm_attacks gauge
wallarm_attacks 0
# HELP wallarm_blocked ブロックされたリクエスト数
# TYPE wallarm_blocked gauge
wallarm_blocked 0
# HELP wallarm_blocked_by_acl ACLによってブロックされたリクエスト数
# TYPE wallarm_blocked_by_acl gauge
wallarm_blocked_by_acl 0
# HELP wallarm_acl_allow_list 許可リストにより通過したリクエスト数
# TYPE wallarm_acl_allow_list gauge
wallarm_acl_allow_list 0
# HELP wallarm_abnormal 異常リクエスト数
# TYPE wallarm_abnormal gauge
wallarm_abnormal 2
# HELP wallarm_tnt_errors wstore書き込みエラー数
# TYPE wallarm_tnt_errors gauge
wallarm_tnt_errors 0
# HELP wallarm_api_errors API書き込みエラー数
# TYPE wallarm_api_errors gauge
wallarm_api_errors 0
# HELP wallarm_requests_lost 失われたリクエスト数
# TYPE wallarm_requests_lost gauge
wallarm_requests_lost 0
# HELP wallarm_overlimits_time overlimits_timeのカウント
# TYPE wallarm_overlimits_time gauge
wallarm_overlimits_time 0
# HELP wallarm_segfaults セグメンテーションフォールト数
# TYPE wallarm_segfaults gauge
wallarm_segfaults 0
# HELP wallarm_memfaults vmem制限到達イベント数
# TYPE wallarm_memfaults gauge
wallarm_memfaults 0
# HELP wallarm_softmemfaults リクエストメモリ制限到達イベント数
# TYPE wallarm_softmemfaults gauge
wallarm_softmemfaults 0
# HELP wallarm_proton_errors libprotonのメモリ関連以外の障害イベント数
# TYPE wallarm_proton_errors gauge
wallarm_proton_errors 0
# HELP wallarm_time_detect_seconds 検出に要した時間
# TYPE wallarm_time_detect_seconds gauge
wallarm_time_detect_seconds 0
# HELP wallarm_db_id proton.dbファイルID
# TYPE wallarm_db_id gauge
wallarm_db_id 71
# HELP wallarm_lom_id LOMファイルID
# TYPE wallarm_lom_id gauge
wallarm_lom_id 386
# HELP wallarm_custom_ruleset_id Custom RulesetファイルID
# TYPE wallarm_custom_ruleset_id gauge
wallarm_custom_ruleset_id{format="51"} 386
# HELP wallarm_custom_ruleset_ver Custom Rulesetファイルフォーマットのバージョン
# TYPE wallarm_custom_ruleset_ver gauge
wallarm_custom_ruleset_ver 51
# HELP wallarm_db_apply_time proton.dbファイル適用時刻ID
# TYPE wallarm_db_apply_time gauge
wallarm_db_apply_time 1674548649
# HELP wallarm_lom_apply_time LOMファイル適用時刻
# TYPE wallarm_lom_apply_time gauge
wallarm_lom_apply_time 1674153198
# HELP wallarm_custom_ruleset_apply_time Custom Rulesetファイル適用時刻
# TYPE wallarm_custom_ruleset_apply_time gauge
wallarm_custom_ruleset_apply_time 1674153198
# HELP wallarm_proton_instances protonインスタンス数
# TYPE wallarm_proton_instances gauge
wallarm_proton_instances{status="success"} 5
wallarm_proton_instances{status="fallback"} 0
wallarm_proton_instances{status="failed"} 0
# HELP wallarm_stalled_worker_time_seconds libproton内でワーカーが停止していた時間
# TYPE wallarm_stalled_worker_time_seconds gauge
wallarm_stalled_worker_time_seconds{pid="3169104"} 25

# HELP wallarm_startid 一意の起動ID
# TYPE wallarm_startid gauge
wallarm_startid 3226376659815907920
```

監視の設定と利用可能なメトリクスの一覧に関する詳細は、この[ドキュメント](../../../configure-statistics-service.md)に記載しています。