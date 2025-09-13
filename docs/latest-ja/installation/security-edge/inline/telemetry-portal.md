# Security Edge Inline用テレメトリポータル <a href="../../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../../images/security-edge-tag.svg" style="border: none;"></a>

[Security Edge Inline](overview.md)のテレメトリポータルは、Wallarmが処理したトラフィックに関するメトリクスをリアルタイムに把握できるGrafanaダッシュボードを提供します。

このダッシュボードには、処理済みリクエスト総数、RPS、検出およびブロックされた攻撃、デプロイ済みEdge Node数、リソース使用量、5xxレスポンス数などの主要なメトリクスが表示されます。

![!](../../../images/waf-installation/security-edge/inline/telemetry-portal.png)

Nodeが[**Active**ステータス](upgrade-and-management.md#statuses)に到達したら、**テレメトリポータルを起動**してください。起動から約5分後にSecurity Edgeセクションの直接リンクからアクセスできるようになります。

![!](../../../images/waf-installation/security-edge/inline/run-telemetry-portal.png)

Grafanaのホームページからダッシュボードに移動するには、**Dashboards** → **Wallarm** → **Portal Inline Overview**を選択します。