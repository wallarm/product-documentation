[allowlist-scanner-addresses]: ../user-guides/ip-lists/overview.md

# 脆弱性検出

アプリケーションの構築や実装時の不注意または不十分な情報により、攻撃に対して脆弱になる可能性があります。本記事では、Wallarmプラットフォームがどのようにアプリケーションの脆弱性を検出し、システムセキュリティの強化に役立てるかを解説します。

## 脆弱性とは

脆弱性とは、アプリケーションの構築や実装時の不注意または不十分な情報により発生するエラーです。攻撃者はこの脆弱性を悪用して、アプリケーション内で権限の境界を越え（つまり、許可されていない操作を実行する）、攻撃を行うことができます。

## 脆弱性検出の手法

Wallarmは、アプリケーション内の脆弱性をスキャンする際、攻撃の兆候を含むリクエストを保護対象のアプリケーションアドレスに送信し、アプリケーションの応答を解析します。もし応答が1つ以上の事前定義された脆弱性の兆候に一致した場合、Wallarmはその脆弱性を記録します。

例えば、`/etc/passwd`の内容を読み取るために送信されたリクエストに対して、`/etc/passwd`の内容が返された場合、保護対象アプリケーションはパストラバーサル攻撃に脆弱であると判断され、Wallarmは適切なタイプで脆弱性を記録します。

アプリケーション内の脆弱性を検出するため、Wallarmは以下の手法を用いて攻撃の兆候を含むリクエストを送信します:

* **パッシブ検出**：リクエストとレスポンスを含む実際のトラフィックを解析して脆弱性を特定します。これはセキュリティインシデント時に実際の欠陥が悪用された場合や、直接的な欠陥の悪用を伴わずにJWTが侵害されるなど脆弱性の兆候が現れる場合に発生する可能性があります。
* **スレットリプレイテスト**：攻撃者をペネトレーションテスターに変え、アプリケーションやAPIの脆弱性を探る際の攻撃活動から潜在的なセキュリティ問題を発見します。このモジュールは、トラフィックからの実際の攻撃データを用いてアプリケーションのエンドポイントを探査することで潜在的な脆弱性を見つけます。デフォルトではこの手法は無効です。
* **脆弱性スキャナー**：企業の公開資産に対して、一般的な脆弱性がスキャンされます。
* **API Discoveryインサイト**：GETリクエストのクエリパラメータ内で個人情報（PII）が転送されるため、[API Discovery](../api-discovery/overview.md)モジュールにより脆弱性が発見されます。

### パッシブ検出

パッシブ検出とは、リクエストとレスポンスを含む実際のトラフィックを解析して脆弱性を特定することを指します。悪意あるリクエストにより欠陥が悪用され、インシデントと脆弱性の双方が検出されるセキュリティインシデント時、または直接的な欠陥の悪用を伴わずにJWTが侵害されるなど、リクエストに脆弱性の兆候が現れる場合に脆弱性が発見されることがあります。

パッシブ脆弱性検出はデフォルトで有効です。

### スレットリプレイテスト <a href="../subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;height: 24px;margin-bottom: -4px;"></a>

Wallarmのスレットリプレイテストは、攻撃者を自社のペネトレーションテスターに変えます。最初の攻撃試行を解析し、その後同じ攻撃が悪用され得る他の方法を検証します。これにより、元々の攻撃者でさえ発見できなかった環境内の脆弱な箇所を明らかにします。 [詳細はこちら](../vulnerability-detection/threat-replay-testing/overview.md)

スレットリプレイテストの機能:

* **リアルタイムテスト**：ライブ攻撃データを用いて現状および今後の潜在的な脆弱性を発見し、ハッカーに一歩先んじます。
* **セーフ＆スマートなシミュレーション**：テスト中に機微な認証情報を省略し、有害なコードを除去します。攻撃手法を模擬して最大限のセキュリティを確保し、実際の被害のリスクを伴いません。
* **セーフな非本番環境テスト**：実際の本番データを用いながら、システムの過負荷やデータ露出のリスクなしに、[ステージングまたは開発環境で脆弱性チェックを実行](../vulnerability-detection/threat-replay-testing/setup.md)できます。

### 脆弱性スキャナー <a href="../subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;height: 24px;margin-bottom: -4px;"></a>

#### 仕組み

脆弱性スキャナーは、企業の公開資産に対して一般的な脆弱性を検査します。スキャナーは固定IPアドレスからアプリケーションアドレスにリクエストを送信し、リクエストに`X-Wallarm-Scanner-Info`ヘッダーを追加します。

#### 構成

* スキャナーはWallarm Console→**Vulnerabilities**→**Configure**で[有効または無効に設定](../user-guides/vulnerabilities.md#configuring-vulnerability-detection)できます。デフォルトではスキャナーは有効です。
* スキャナーが検出できる[脆弱性の一覧](../user-guides/vulnerabilities.md#configuring-vulnerability-detection)はWallarm Console→**Vulnerabilities**→**Configure**にて設定できます。デフォルトでは、脆弱性スキャナーはすべての利用可能な脆弱性を検出します。
* Wallarm Console→**Scanner**→**Configure**にて、各資産ごとに[スキャナーから送信されるリクエストの制限](../user-guides/scanner.md#limiting-vulnerability-scanning)を設定できます。
* もし、トラフィックを自動でフィルタリングまたはブロックするために追加の設備（ソフトウェアやハードウェア）を利用している場合、Wallarmスキャナー用の[IPアドレス](../admin-en/scanner-addresses.md)でallowlistを設定することを推奨します。これにより、Wallarmの各コンポーネントがシームレスにリソースの脆弱性をスキャンできます。

 WallarmにおいてスキャナーのIPアドレスを手動でallowlistに追加する必要はありません。Wallarm node 3.0以降、スキャナーのIPアドレスは自動的にallowlistに追加されます。

### API Discoveryインサイト

GETリクエストのクエリパラメータ内で個人を特定できる情報（PII）が転送されるエンドポイントが[API Discovery](../api-discovery/overview.md)モジュールにより識別された場合、Wallarmはこれらのエンドポイントに[情報漏洩](../attacks-vulns-list.md#information-exposure)脆弱性が存在すると認識します。

## 誤検知

誤検知とは、正当なリクエストに攻撃の兆候が検出された場合、または正当なエンティティが脆弱性として認定された場合に発生します。 [攻撃検出における誤検知の詳細はこちら→](protecting-against-attacks.md#false-positives)

脆弱性スキャンにおける誤検知は、保護対象アプリケーションの特性に起因して発生する可能性があります。同様のリクエストに対する類似のレスポンスは、一方の保護対象アプリケーションでは脆弱性の兆候であり、別の保護対象アプリケーションでは期待される動作である場合があります。

脆弱性に対して誤検知が認定された場合、Wallarm Consoleにて該当脆弱性に適切なマークを付与できます。誤検知としてマークされた脆弱性はクローズされ、再検査されることはありません。

検出された脆弱性が保護対象アプリケーション内に存在するものの修正が不可能な場合、[**Create a virtual patch**](../user-guides/rules/vpatch-rule.md)ルールの設定を推奨します。このルールは、検出された脆弱性の種類を悪用する攻撃をブロックし、インシデントのリスクを排除します。

## 検出された脆弱性の管理

検出されたすべての脆弱性はWallarm Consoleの**Vulnerabilities**セクションに表示されます。脆弱性は、以下の方法でインターフェースから管理できます:

* 脆弱性の確認および解析
* 脆弱性の状態確認の実行：依然として有効か、アプリケーション側で修正済みかを検証
* 脆弱性をクローズする、または誤検知としてマークする

![Vulnerabilities section](../images/user-guides/vulnerabilities/check-vuln.png)

Wallarmプラットフォームの[**API Discovery**モジュール](../api-discovery/overview.md)を利用している場合、脆弱性は検出されたAPIエンドポイントと連携されます。例:

![API Discovery - Risk score](../images/about-wallarm-waf/api-discovery/api-discovery-risk-score.png)

脆弱性の管理に関する詳細は、[脆弱性の取り扱い](../user-guides/vulnerabilities.md)に関する手順をご確認ください。

## 検出された脆弱性に関する通知

Wallarmは検出された脆弱性に関する通知を送信できます。これにより、アプリケーションに新たに発見された脆弱性に迅速に対応できるようになります。対応には、アプリケーション側での修正、誤検知の報告、及びバーチャルパッチの適用が含まれます。

通知を設定するには:

1. 通知を送信するためにシステムと[ネイティブインテグレーション](../user-guides/settings/integrations/integrations-intro.md)を作成します（例：PagerDuty、Opsgenie、Splunk、Slack、Telegram）。
2. インテグレーションカード内の利用可能なイベント一覧から**Vulnerabilities detected**を選択します。

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