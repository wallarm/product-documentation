# 脆弱性の検出

アプリケーションの構築や実装における不注意や情報不足により、攻撃に対して脆弱になることがあります。本記事では、Wallarmプラットフォームがアプリケーションの脆弱性をどのように検出し、システムのセキュリティ強化に役立てられるかを説明します。

## 脆弱性とは

脆弱性とは、アプリケーションの構築または実装時の不注意や情報不足によって生じる誤りです。脆弱性は攻撃者に悪用され、アプリケーション内で権限境界を越える（すなわち、許可されていない操作を実行する）ことを可能にします。

## 脆弱性の検出方法

アクティブな脆弱性をスキャンする際、Wallarmは攻撃の兆候を含むリクエストを保護対象アプリケーションのアドレスに送信し、アプリケーションのレスポンスを解析します。レスポンスがあらかじめ定義された脆弱性の兆候の1つ以上に一致した場合、Wallarmはアクティブな脆弱性として記録します。

例えば、`/etc/passwd`の内容を読み取るために送信したリクエストへのレスポンスが`/etc/passwd`の内容を返した場合、保護対象アプリケーションはパストラバーサル攻撃に対して脆弱です。Wallarmは適切なタイプでこの脆弱性を記録します。

アプリケーションの脆弱性を検出するために、Wallarmは以下の方法を使用します:

* **パッシブ検出**: リクエストとレスポンスを含む実トラフィックを解析して脆弱性を特定します。これは、実際の欠陥が悪用されるセキュリティインシデント中に発生することもあれば、直接の欠陥悪用がなくても、侵害されたJWTのように脆弱性の兆候を示すリクエストから判明することもあります。
* **Threat Replay Testing**: 攻撃者をペネトレーションテスターに変えることで、アプリケーションやAPIの脆弱性を探る活動から生じる可能性のあるセキュリティ課題を発見します。このモジュールは、トラフィックからの実際の攻撃データを用いてアプリケーションのエンドポイントをプロービングし、潜在的な脆弱性を見つけます。既定ではこの方法は無効です。
* **API Attack Surface Management (AASM)**: APIを持つ外部ホストを発見し、それぞれに対して未導入のWAF/WAAPソリューションや脆弱性を特定します。
* **API Discoveryのインサイト**: [API Discovery](../api-discovery/overview.md)モジュールにより、GETリクエストのクエリパラメータでPIIの転送があったために脆弱性が発見されました。

### パッシブ検出

パッシブ検出は、リクエストとレスポンスを含む実トラフィックを解析して脆弱性を特定することを指します。悪意のあるリクエストが欠陥の悪用に成功し、インシデントと脆弱性の両方が検出されるセキュリティインシデントの最中に露見することがあります。また、直接の欠陥悪用がなくても、侵害されたJWTのような脆弱性の兆候を示すリクエストから判明する場合もあります。

パッシブな脆弱性検出は既定で有効です。

### Threat Replay Testing <a href="../subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;height: 24px;margin-bottom: -4px;"></a>

WallarmのThreat Replay Testingは、攻撃者をお客様自身のペネトレーションテスターへと変えます。初期の攻撃試行を分析し、同じ攻撃が悪用され得る他の方法をさらに探ります。これにより、元の攻撃者でさえ見つけられなかった環境の弱点が明らかになります。[詳細はこちら](../vulnerability-detection/threat-replay-testing/overview.md)

Threat Replay Testingの機能:

* **リアルタイムテスト**: ライブな攻撃データを用いて現在および将来起こり得る弱点を特定し、攻撃者より一歩先を行けます。
* **安全でスマートなシミュレーション**: テストで機密な認証情報をスキップし、有害なコードを除去します。実際の被害を伴うことなく、最大限の安全性を確保して攻撃手法をシミュレートします。
* **安全な非本番テスト**: 本番の実データを使用しつつも、システム過負荷やデータ露出などのリスクなしに、[ステージングや開発環境で脆弱性チェックを実行](../vulnerability-detection/threat-replay-testing/setup.md)できます。

### API Attack Surface Management (AASM)

#### 動作概要

Wallarmの[API Attack Surface Management](../api-attack-surface/overview.md) (AASM)はAPIエコシステムに特化したエージェントレスの検出ソリューションで、APIを持つ外部ホストを発見し、未導入のWAF/WAAPソリューションを特定し、APIリークやその他の脆弱性を軽減します。

#### 設定

API Attack Surface Managementを有効化・設定し、選択したドメイン配下のホストを検出して、これらのホストに関連するセキュリティ問題を検索します。手順は[こちら](../api-attack-surface/setup.md)に記載しています。

検出されたホストに対して、Wallarmは自動で[脆弱性を検索](../api-attack-surface/security-issues.md)します。

#### 旧Scannerの置き換え

2025年5月7日より、ホストおよびAPIの発見において、AASMはより高度で使いやすいツールとして[旧Scannerを置き換えました](../api-attack-surface/api-surface.md#replacement-of-old-scanner)。

### API Discoveryのインサイト

[API Discovery](../api-discovery/overview.md)モジュールで特定されたエンドポイントが、GETリクエストのクエリパラメータで個人を特定できる情報(PII)を転送している場合（[CWE-598](https://cwe.mitre.org/data/definitions/598.html)参照）、Wallarmはこれらのエンドポイントに[情報露出](../attacks-vulns-list.md#information-exposure)の脆弱性があると認識します。

## 誤検知

**誤検知**は、正当なリクエストに攻撃の兆候が検出された場合、または正当な対象が脆弱性として判定された場合に発生します。[攻撃検出における誤検知の詳細 →](protecting-against-attacks.md#false-positives)

脆弱性スキャンにおける誤検知は、保護対象アプリケーションの特性に起因して発生することがあります。似たリクエストに対する似たレスポンスでも、あるアプリケーションではアクティブな脆弱性を示す一方、別のアプリケーションでは想定どおりの挙動である場合があります。

脆弱性の誤検知が判明した場合は、Wallarm Consoleで当該脆弱性に誤検知のマークを付けることができます。誤検知としてマークされた脆弱性はクローズされ、再検証されません。

検出された脆弱性が保護対象アプリケーションに存在するものの修正できない場合は、[**Create a virtual patch**](../user-guides/rules/vpatch-rule.md)ルールの設定を推奨します。このルールにより、検出されたタイプの脆弱性を悪用する攻撃をブロックでき、インシデントのリスクを排除できます。

## 検出された脆弱性の管理

検出されたすべての脆弱性は、Wallarm Console → **Vulnerabilities**セクションに表示されます。インターフェースから次の操作ができます:

* 脆弱性の表示と分析
* 脆弱性のステータス検証の実行（アプリケーション側でまだアクティブか、修正済みか）
* 脆弱性をクローズする、または誤検知としてマークする

![Vulnerabilitiesセクション](../images/user-guides/vulnerabilities/check-vuln.png)

Wallarmプラットフォームの[**API Discovery**モジュール](../api-discovery/overview.md)を使用している場合、脆弱性は発見されたAPIエンドポイントに紐付けられます。例:

![API Discovery - Risk score](../images/about-wallarm-waf/api-discovery/api-discovery-risk-score.png)

脆弱性の管理についての詳細は、[脆弱性の取り扱い](../user-guides/vulnerabilities.md)の手順を参照してください。

## 検出された脆弱性の通知

Wallarmは、検出された脆弱性に関する通知を送信できます。これにより、アプリケーションの新たに検出された脆弱性を把握し、迅速に対応できます。対応には、アプリケーション側での修正、誤検知の報告、仮想パッチの適用が含まれます。

通知の設定手順:

1. 通知を送信するシステム（例: PagerDuty、Opsgenie、Splunk、Slack、Telegram）との[ネイティブインテグレーション](../user-guides/settings/integrations/integrations-intro.md)を作成します。
2. インテグレーションカードで、利用可能なイベント一覧から**Vulnerabilities detected**を選択します。

検出された脆弱性に関するSplunk通知の例:

```json
{
    summary:"[Test message] [Test partner(US)] New vulnerability detected",
    description:"Notification type: vuln

                New vulnerability was detected in your system.

                ID: 
                Title: Test
                Domain: example.com
                Path: 
                Method: 
                Discovered by: 
                Parameter: 
                Type: Info
                Threat: Medium

                More details: https://us1.my.wallarm.com/object/555


                Client: TestCompany
                Cloud: US
                ",
    details:{
        client_name:"TestCompany",
        cloud:"US",
        notification_type:"vuln",
        vuln_link:"https://us1.my.wallarm.com/object/555",
        vuln:{
            domain:"example.com",
            id:null,
            method:null,
            parameter:null,
            path:null,
            title:"Test",
            discovered_by:null,
            threat:"Medium",
            type:"Info"
        }
    }
}
```