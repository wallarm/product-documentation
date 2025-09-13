### メール

ログインに使用している個人メールアドレスに、検出されたホストおよびセキュリティ課題に関する通知が自動的に届きます。以下が含まれます:

* **日次のクリティカルなセキュリティ課題（新規のみ）** - 当日にオープンした[クリティカル][link-aasm-security-issue-risk-level]なセキュリティ課題のすべてで、各課題の詳細な説明と緩和手順を添えて1日に1回送信されます。
* **日次のセキュリティ課題（新規のみ）** - 当日にオープンしたセキュリティ課題の統計で、各[リスクレベル][link-aasm-security-issue-risk-level]の件数および一般的な緩和アクション項目を記載して1日に1回送信されます。
* **週次のAASM統計** - 直近1週間に設定済みドメインで検出されたホスト、API、およびセキュリティ課題の統計情報です。

これらの通知はデフォルトで有効です。いつでも配信停止でき、[こちら][link-integrations-email]の説明に従って、Wallarm Console→**Configuration**→**Integrations**→**Email and messengers**→**Personal email**（あなたのメール）または**Email report**（追加のメールアドレス）で、これらの通知の全部または一部を受け取る追加メールを設定できます。

### 即時通知

新規および再オープンのセキュリティ課題に対する即時通知を設定できます。通知をトリガーするリスクレベルは、すべて選択することも一部のみ選択することもできます。各セキュリティ課題ごとに個別のメッセージが送信されます。

例:

```
[Wallarm System] 新しいセキュリティ課題を検出しました
通知タイプ: security_issue
新しいセキュリティ課題がシステムで検出されました。
ID: 106279
タイトル: 脆弱なバージョンのNginx: 1.14.2
ホスト: <HOST_WITH_ISSUE>
パス:
ポート: 443
URL: <URL_WITH_ISSUE>
メソッド:
検出元: AASM
パラメータ:
タイプ: 脆弱なコンポーネント
リスク: Medium
詳細: 
クライアント: <YOUR_COMPANY_NAME>
Cloud: US
```

即時通知は、[ご利用のインテグレーション][link-integrations-intro]のドキュメントに記載のとおり、Wallarm Console→**Configuration**→**Integrations**→YOUR_INTEGRATIONで設定できます。