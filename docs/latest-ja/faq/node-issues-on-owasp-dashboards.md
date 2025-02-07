# OWASPダッシュボードで警告されたWallarmノードの問題への対処

Wallarmノードが更新されない場合やCloudとの同期に問題が発生したとき、インフラストラクチャのセキュリティに影響を及ぼす可能性のある問題を示すエラーメッセージが[OWASPダッシュボード](../user-guides/dashboards/owasp-api-top-ten.md)に表示されます。本記事では、これらの問題の対処方法について説明します。

古いノードは重要なセキュリティアップデートが欠如している可能性があり、悪意のあるトラフィックが防御を回避できる場合があります。同期の問題により、ノードの機能が妨げられ、Cloudから必要なセキュリティポリシーを受信できなくなります。これらの問題は主に**OWASP API7 (Security Misconfiguration)**の脅威に関連しており、アプリケーションスタックのいずれかの部分でセキュリティ対策が欠落するとシステムが脆弱になる可能性があります。これを防ぐために、ダッシュボードはノードの動作に関する問題を警告します。例：

![OWASP dash with node issues](../images/user-guides/dashboard/owasp-dashboard-node-issues.png)

安全な環境を維持するためには、Wallarmノードを定期的に更新し、同期の問題に対処することが重要です。以下にエラーメッセージの対処方法を示します：

1. Wallarmノードのバージョンが[または寿命終了に近い場合](../updating-migrating/versioning-policy.md#version-list)は、最新バージョンにアップグレードすることを推奨します。
1. Wallarm Cloudとの同期に問題がある場合は、[該当する設定](../admin-en/configure-cloud-node-synchronization-en.md)が正しいか確認してください。

同期やその他の問題の解決、またはその他のご要望がある場合は、[Wallarm support team](mailto:support@wallarm.com)にお問い合わせください。解析のため、以下の[ログ](../admin-en/configure-logging.md)を提供してください：

* `/opt/wallarm/var/log/wallarm/wcli-out.log` のログを確認し、`syncnode`スクリプトに関する問題がないか検証してください。
* `/var/log/syslog` または `/var/log/messages` ディレクトリのログ（デプロイオプションに応じて）を確認し、同期問題に関する追加情報を提供してください。