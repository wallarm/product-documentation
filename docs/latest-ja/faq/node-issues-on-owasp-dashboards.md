# OWASPダッシュボードで警告されるWallarmノードの問題への対処法

Wallarmノードが更新されないか、クラウドとの同期に問題が発生した場合、インフラストラクチャのセキュリティに影響を及ぼす可能性のある問題を示すエラーメッセージが[OWASPダッシュボード](../user-guides/dashboards/owasp-api-top-ten.md)に表示されます。本記事では、これらの問題に対処する方法を説明します。

古いノードでは重要なセキュリティ更新が欠けている可能性があり、その結果、悪意のあるトラフィックが防御を回避することができます。同期の問題はノードの機能を中断させ、クラウドから重要なセキュリティポリシーを受け取ることを防ぐことがあります。これらの問題は主に、**OWASP API7（セキュリティ設定ミス）**という脅威に関連しており、アプリケーションスタックの任意の部分にセキュリティソリューションが欠けていると、システムが脆弱になる可能性があります。これを防ぐため、ダッシュボードはノードの運用問題、例えば以下のようなものを警告します：

![OWASP dash with node issues](../images/user-guides/dashboard/owasp-dashboard-node-issues.png)

安全な環境を維持するためには、Wallarmノードを定期的に更新し、同期問題に対処することが重要です。エラーメッセージを処理する方法についての指示は以下の通りです：

1. あなたのWallarmノードのバージョンが[終わり、または終わりが近づいている](../updating-migrating/versioning-policy.md#version-list)場合、ノードを最新バージョンにアップグレードすることをお勧めします。
1. Wallarm Cloudとの同期に問題が発生した場合は、[対応する設定](../admin-en/configure-cloud-node-synchronization-en.md)が正しいことを確認してください。

同期やその他の問題、またはその他の要求の解決に助けが必要な場合は、[Wallarmサポートチーム](mailto:support@wallarm.com)に助けを求めることができます。以下の[ログ](../admin-en/configure-logging.md)を提供し、解析を依頼してください：

* `syncnode`スクリプトの問題をチェックするための`/var/log/wallarm/syncnode.log`からのログ
* 同期問題に関する追加の詳細を提供するための`/var/log/syslog`または`/var/log/messages`ディレクトリ（デプロイオプションによる）からのログ