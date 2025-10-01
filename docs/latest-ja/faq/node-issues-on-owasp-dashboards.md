# OWASP DashboardでアラートされたWallarm nodeの問題への対処

Wallarm nodeが更新されていない、またはCloudとの同期に問題がある場合、[OWASP dashboard](../user-guides/dashboards/owasp-api-top-ten.md)に、インフラのセキュリティに影響を及ぼす可能性のある問題を示すエラーメッセージが表示されます。本記事では、これらの問題への対処方法を説明します。

## Wallarm nodeが古くなっています

古いnodeには重要なセキュリティ更新が欠けている可能性があり、悪意のあるトラフィックに防御をすり抜けられる可能性があります。同期の問題が発生するとnodeの機能が損なわれ、Cloudから重要なセキュリティポリシーを受信できなくなります。これらの問題は主にOWASP API8（Security Misconfiguration）の脅威に関連しており、アプリケーションスタックのいずれかの部分でセキュリティソリューションが欠落していると、システムが脆弱になります。これを防ぐために、dashboardはnodeの動作に関する問題を通知します。例えば次のとおりです:

![nodeの問題を示すOWASP dashboard](../images/user-guides/dashboard/owasp-dashboard-node-issues.png)

安全な環境を維持するためには、Wallarm nodeを定期的に更新し、同期の問題に対処することが重要です。Wallarm nodeのバージョンが[サポート終了に達している、または近づいている](../updating-migrating/versioning-policy.md#version-list)場合は、最新バージョンへのアップグレードを推奨します。

## Wallarm nodeとCloudの同期に問題があります

Wallarm Cloudとの同期で問題が発生している場合は、[該当の設定](../admin-en/configure-cloud-node-synchronization-en.md)が正しいことを確認してください。

同期やその他の問題の解決に支援が必要な場合、または他のリクエストがある場合は、[Wallarm support team](mailto:support@wallarm.com)にお問い合わせください。分析のため、以下の[ログ](../admin-en/configure-logging.md)を提供してください:

* `syncnode`スクリプトに問題がないか確認するための、`/opt/wallarm/var/log/wallarm/wcli-out.log`のログ
* 同期の問題に関する追加の詳細を提供するための、（デプロイオプションに応じて）`/var/log/syslog`または`/var/log/messages`ディレクトリのログ

## nodeのuuidおよび/またはsecretを検出できません

作成直後または更新直後のnodeのログに、「Can't detect node uuid and/or secret, please add node to cloud first.」というメッセージが表示されることがあります。

nodeの作成や更新時にはCloudに登録されます。このメッセージは、その登録が成功していない可能性を示しており、nodeとCloudの同期が行われません（[monitoring](../admin-en/configure-wallarm-mode.md)モードでの[基本](../about-wallarm/protecting-against-attacks.md#basic-set-of-detectors)検出のみとなり、Cloudから[rules](../user-guides/rules/rules.md)、[mitigation controls](../about-wallarm/mitigation-controls-overview.md)、[lists](../user-guides/ip-lists/overview.md)は配信されず、monitoringの結果もCloudに送信されません）。

**nodeが登録済み**

最も手早く登録が成功したかを確認する方法は、Wallarm Console→[**Nodes**](../user-guides/nodes/nodes.md)セクションに当該nodeが存在するかを確認することです。以降の同期状況もここで確認できます。

「登録されていないnode」の問題を一般的に解決するには、[Wallarm support team](https://support.wallarm.com/)にお問い合わせください。

**心配する必要がない場合**

場合によっては、nodeの登録処理が完了する前に、ログに「Can't detect node uuid and/or secret, please add node to cloud first」というメッセージが表示されることがあります:

```
YYYY-MM-DD HH:MM:SS* INFO syncnodeXXXXX: Triggers result: 1 success, 0 skipped, 0 errors
```

したがって、このメッセージより前に出力される登録エラーは無視して問題ありません。登録が完了すれば消えます。