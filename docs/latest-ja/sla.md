# Wallarmのサービスレベルアグリーメント（SLA）

本記事では、Wallarmのサービスレベルに関する事項として、サービスの可用性（稼働率）、想定される問題の分類とそれぞれの応答・解決時間について説明します。クライアントのコンテキストへの[強い依存](#normal-functioning-characteristics)があるため、通常の動作特性は本SLAには記載していません。

## 一般事項

Wallarmは、各暦月においてサービスを少なくとも99.95%の可用性で提供できるよう、商業的に合理的な努力を行います。

## 問題の分類

以下は、Wallarmのサービスで発生し得る問題の分類と優先度の定義です。

| 優先度レベル | 問題の分類 | 説明 |
| ------- | ------- | ------- |
| 1 | 緊急 | サービスが完全に利用不能である、またはパフォーマンスが著しく低下してサービスを使用できない状態です。 |
| 2 | 高 | サービスの主要な機能が利用不能で、機能が制限される、または多数の認可されたユーザーに影響が及ぶ状態です。 |
| 3 | 中 | サービスの機能に深刻な影響を与えない範囲で、機能またはリソースの一部が失われている状態です。 |
| 4 | 低 | その他すべてのサービスリクエスト（一般的な使用方法に関する質問や機能拡張の要望など）です。 |

Wallarmサポートチームへは任意の連絡チャネルでお問い合わせでき、その際にリクエストの優先度を設定できます。例えば、[Customer Portal](https://wallarm.atlassian.net/servicedesk/customer/portal/5)で新しいサービスリクエストを作成する際に**Priority**フィールドを設定します。設定した優先度は、[Wallarmサポートのエスカレーションおよびインシデントプロセス](https://wallarm.atlassian.net/servicedesk/customer/portal/5/article/4319051777)の一環として、サポートチームまたはお客様が変更できます。

## 応答および解決時間

問題が発生した場合のWallarmのサービスレベルは次のとおりです。

| 問題の分類 | 初回応答‍（オフピーク時） | 解決/‍緩和 | ステータス更新 |
| ------- | ------- | ------- | ------- |
| 緊急 | 2時間 | 4時間 | 30分ごと |
| 高 | 3時間 | 24時間 | 4時間ごと |
| 中 | 12時間 | [次回の予定リリース](updating-migrating/versioning-policy.md) | 毎週 |
| 低 | 36時間 | 四半期ごと | 月2回 |

ステータス更新は、[Customer Portal](https://wallarm.atlassian.net/servicedesk/customer/portal/5)で起票されたサービスリクエストへのコメントとして提供され、新しいコメントまたは変更のたびにメール/Slack通知が送信されます。すべてのサービスリクエストはCustomer Portalのプロフィールに一覧表示されます。

## 通常の動作特性

Wallarmのサービスの可用性と速度、および[責任分担](about-wallarm/shared-responsibility.md)は、特定のクライアントコンテキストに関連する複数の要因に強く依存し、クライアントごとに異なります。これらの要因には、以下が含まれますが、これらに限定されません。

* クライアントのネットワークインフラストラクチャ、構成および接続性
* 選択したWallarmの[デプロイ形態](about-wallarm/overview.md#where-wallarm-works)
* 選択したWallarmのデプロイオプション：[Security Edge](installation/security-edge/overview.md)、[セルフホスト型](installation/supported-deployment-options.md)または[Connector](installation/connectors/overview.md)
* 有効化しているWallarmの[コンポーネントと機能](about-wallarm/overview.md)
* トラフィック量、特性、強度

以上の理由から、通常の動作特性については本SLAで具体的な数値を記載していません。

## 詳細情報

詳細および関連情報は、Wallarm公式サイトの[サービスレベルアグリーメント](https://www.wallarm.com/service-level-agreement)ページで参照できます。