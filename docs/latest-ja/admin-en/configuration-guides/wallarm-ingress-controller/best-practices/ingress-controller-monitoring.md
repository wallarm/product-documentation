# NGINXベースのIngressコントローラーモニタリング

--8<-- "../include-ja/ingress-controller-best-practices-intro.md"

NGINX Ingressコントローラーモニタリングの一般的な側面は、すでにインターネット上で十分にカバーされています。Wallarmは、ミッションクリティカルな環境で監視するべき追加のセットの監視メトリクスを提供します。`/wallarm-metrics` メトリクスサービスはデフォルトで無効になっています。

サービスを有効にするには、`controller.wallarm.metrics.enabled` を `true`に設定します：

```
controller:
  wallarm:
    metrics:
      enabled: true
```

以下は、新しく公開されたエンドポイント経由で利用可能なPrometheus形式のWallarm専用メトリクスのリストです：

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
# HELP wallarm_blocked_by_acl ACLによりブロックされたリクエスト数
# TYPE wallarm_blocked_by_acl gauge
wallarm_blocked_by_acl 0
# HELP wallarm_acl_allow_list 許可リストによって通過したリクエスト
# TYPE wallarm_acl_allow_list gauge
wallarm_acl_allow_list 0
# HELP wallarm_abnormal 異常なリクエスト数
# TYPE wallarm_abnormal gauge
wallarm_abnormal 2
# HELP wallarm_tnt_errors tarantool書き込みエラーカウント
# TYPE wallarm_tnt_errors gauge
wallarm_tnt_errors 0
# HELP wallarm_api_errors API書き込みエラーカウント
# TYPE wallarm_api_errors gauge
wallarm_api_errors 0
# HELP wallarm_requests_lost 失われたリクエストカウント
# TYPE wallarm_requests_lost gauge
wallarm_requests_lost 0
# HELP wallarm_overlimits_time overlimits_timeカウント
# TYPE wallarm_overlimits_time gauge
wallarm_overlimits_time 0
# HELP wallarm_segfaults セグメンテーションフォールト数
# TYPE wallarm_segfaults gauge
wallarm_segfaults 0
# HELP wallarm_memfaults vmem上限到達イベント数
# TYPE wallarm_memfaults gauge
wallarm_memfaults 0
# HELP wallarm_softmemfaults リクエストメモリ上限到達イベント数
# TYPE wallarm_softmemfaults gauge
wallarm_softmemfaults 0
# HELP wallarm_proton_errors libproton非メモリ関連libprotonフォールトイベント数
# TYPE wallarm_proton_errors gauge
wallarm_proton_errors 0
# HELP wallarm_time_detect_seconds 検出に費やした時間
# TYPE wallarm_time_detect_seconds gauge
wallarm_time_detect_seconds 0
# HELP wallarm_db_id proton.dbファイルid
# TYPE wallarm_db_id gauge
wallarm_db_id 71
# HELP wallarm_lom_id LOMファイルid
# TYPE wallarm_lom_id gauge
wallarm_lom_id 386
# HELP wallarm_custom_ruleset_id カスタムルールセットファイルid
# TYPE wallarm_custom_ruleset_id gauge
wallarm_custom_ruleset_id 386
# HELP wallarm_custom_ruleset_ver カスタムルールセットファイル形式バージョン
# TYPE wallarm_custom_ruleset_ver gauge
wallarm_custom_ruleset_ver 51
# HELP wallarm_db_apply_time proton.dbファイル適用時間id
# TYPE wallarm_db_apply_time gauge
wallarm_db_apply_time 1674548649
# HELP wallarm_lom_apply_time LOMファイル適用時間
# TYPE wallarm_lom_apply_time gauge
wallarm_lom_apply_time 1674153198
# HELP wallarm_custom_ruleset_apply_time カスタムルールセットファイル適用時間
# TYPE wallarm_custom_ruleset_apply_time gauge
wallarm_custom_ruleset_apply_time 1674153198
# HELP wallarm_proton_instances protonインスタンス数
# TYPE wallarm_proton_instances gauge
wallarm_proton_instances{status="success"} 5
wallarm_proton_instances{status="fallback"} 0
wallarm_proton_instances{status="failed"} 0
# HELP wallarm_stalled_worker_time_seconds libprotonで停滞したワーカーの時間
# TYPE wallarm_stalled_worker_time_seconds gauge

# HELP wallarm_startid 固有のスタートid
# TYPE wallarm_startid gauge
wallarm_startid 3226376659815907920
```

モニタリングの設定と利用可能なメトリクスのリストについての詳細情報は、この[ドキュメンテーション](../../../monitoring/intro.md)で提供されています。