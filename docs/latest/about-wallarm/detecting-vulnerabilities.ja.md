[allowlist-scanner-addresses]: ../user-guides/ip-lists/allowlist.ja.md

# 脆弱性の検出

アプリケーションの構築や実装におけるネグレクトや不十分な情報により、アプリケーションは攻撃に対して脆弱となり得ます。本記事から、あなたはWallarmプラットフォームがアプリケーションの脆弱性をどのように検出し、システムのセキュリティを強化することができるのかを理解します。

## 脆弱性とは何か？

脆弱性とは、アプリケーションの構築や実装におけるネグレクトや不十分な情報によるエラーのことを指します。脆弱性は、攻撃者によって（つまり、アプリケーション内で許可されていない行動を行う）特権境界を越えることを可能にします。

## 脆弱性の検出方法

アプリケーションがアクティブな脆弱性を持っているかどうかをスキャンするとき、Wallarmは保護されたアプリケーションのアドレスに攻撃の兆候を含むリクエストを送信し、アプリケーションのレスポンスを分析します。レスポンスが1つ以上の定義済み脆弱性の兆候と一致すれば、Wallarmはアクティブな脆弱性を記録します。

例えば、`/etc/passwd`の内容を読むために送信したリクエストのレスポンスが`/etc/passwd`の内容を返す場合、保護されたアプリケーションはパストラバーサル攻撃に対して脆弱です。Wallarmは適切なタイプで脆弱性を記録します。

アプリケーション内の脆弱性を検出するために、Wallarmは以下の方法で攻撃の兆候を含むリクエストを送信します：

* **パッシブ検出**：セキュリティインシデントが発生したことで脆弱性が見つかった。
* **アクティブな脅威の確認**：攻撃者を侵入テストの役割に変え、アプリケーションやAPIに対する脅威の探求活動から可能なセキュリティ問題を見つけることができます。
* **脆弱性スキャナー**：会社が開放している資産が一般的な脆弱性に対してスキャネる。

### パッシブ検出

パッシブ検出では、Wallarmは発生したセキュリティインシデントによって脆弱性を検出します。アプリケーションの脆弱性が攻撃中に悪用された場合、Wallarmはセキュリティインシデントと悪用された脆弱性を記録します。

パッシブの脆弱性検出はデフォルトで有効になっています。

### アクティブな脅威の確認 <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;height: 24px;margin-bottom: -4px;"></a>

#### 仕組み

--8<-- "../include/how-attack-rechecker-works.ja.md"

!!! 警告 "攻撃がIPによってグループ化された場合のアクティブな脅威の確認"
    攻撃が起源IPによって[グループ化](protecting-against-attacks.ja.md#attack)された場合、この攻撃のアクティブな確認は利用できません。

#### "アクティブな脅威の確認"モジュールからの潜在的なリスク

* **アクティブな脅威の確認**モジュールによって再度プレイされるリクエストが、Wallarmによって攻撃として検出された場合、リクエストは確定的でない可能性があります（例えば、アプリケーション内で新たなオブジェクトを作成する認証済みのリクエスト）。その場合、モジュールによって脅威確認のために生成されたリクエストは、クライアントアカウント内に多くの新規の不要なオブジェクトを作成したり、他の予期せぬ操作を行ったりする可能性があります。

    上記の状況のリスクを最小限に抑えるために、**アクティブな脅威の確認**モジュールは、再度プレイされるリクエストから以下のHTTPヘッダーを自動的に削除します：

    * `Cookie`
    * `Authorization: Basic`
    * `Viewstate`
* アプリケーションが非標準的な認証方法を使用する場合やリクエストの認証を必要としない場合、**アクティブな脅威の確認**モジュールはトラフィックから任意のリクエストを再生でき、システムに損害を与える可能性があります。例えば、100以上の取引や注文を繰り返すなど。この状況のリスクを最小限に抑えるために、攻撃のリプレイにテスト環境やステージング環境を[使用すること](../admin-en/attack-rechecker-best-practices.ja.md#optional-configure-attack-rechecker-request-rewriting-rules-run-tests-against-a-copy-of-the-application)や、非標準的なリクエスト認証パラメータを[マスキングすること](../admin-en/attack-rechecker-best-practices.ja.md#configure-proper-data-masking-rules)が推奨されています。
  。
#### 設定

**アクティブな脅威の確認**モジュールはデフォルトで無効になっています。それを正しく使用するためには、このモジュールを有効にし、適切に設定する必要があります。**アクティブな脅威の確認**の設定オプションとその設定のベストプラクティスについては、[このドキュメント](../admin-en/attack-rechecker-best-practices.ja.md)を参照してください。

### 脆弱性スキャナー <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;height: 24px;margin-bottom: -4px;"></a>

#### 仕組み

脆弱性スキャナーは、会社が公開しているすべての資産を一般的な脆弱性に対してチェックします。スキャナーは固定IPアドレスからアプリケーションのアドレスにリクエストを送信し、リクエストに`X-Wallarm-Scanner-Info`というヘッダーを追加します。

#### 設定

* スキャナーはWallarm Console → **脆弱性** → **設定**で[有効または無効](../user-guides/vulnerabilities.ja.md#configuring-vulnerability-detection)にすることができます。デフォルトでは、スキャナーは有効になっています。
* スキャナーが検出できる[脆弱性のリスト](../user-guides/vulnerabilities.ja.md#configuring-vulnerability-detection)は、Wallarm Console → **脆弱性** → **設定**で設定できます。デフォルトでは、脆弱性スキャナーはすべての利用可能な脆弱性を検出します。
* スキャナーから送信された[リクエストの制限](../user-guides/scanner.ja.md#limiting-vulnerability-scanning)は、Wallarm Console → **スキャナー** → **設定**で各資産に対して設定することができます。
* 追加の設備（ソフトウェアやハードウェア）を使用して自動的にトラフィックをフィルタリングし、ブロックする場合は、Wallarm スキャナーの IP アドレスを設定した許可リストを設定することを推奨します。これにより、Wallarm のコンポーネントがあなたのリソースを問題なく脆弱性スキャンできるようになります。

    * [Wallarm US Cloudに登録されたスキャナーのIPアドレス](../admin-en/scanner-address-us-cloud.ja.md)
    * [Wallarm EU Cloudに登録されたスキャナーのIPアドレス](../admin-en/scanner-address-eu-cloud.ja.md)

    Wallarmスキャナーを使用しているが、追加の設備を使用していない場合、スキャナーのIPアドレスを手動で許可リストに登録する必要はありません。Wallarmノード3.0から、スキャナーのIPアドレスは自動的に許可リストに登録されます。

## 偽陽性

**偽陽性**とは、合法的なリクエストで攻撃の兆候が検出された場合や、合法的なエンティティが脆弱性と認定された場合に発生します。[攻撃検出における偽陽性の詳細 →](protecting-against-attacks.ja.md#false-positives)

保護されたアプリケーションの特性によって、脆弱性スキャン中に偽陽性が発生することがあります。似たようなリクエストへの似たようなレスポンスは、一つの保護されたアプリケーションではアクティブな脆弱性を示し、別の保護されたアプリケーションでは期待される動作を示す可能性があります。

脆弱性の偽陽性が検出された場合、Wallarm Consoleで該当脆弱性に適切なマークを追加することができます。偽陽性とマークされた脆弱性はクローズされ、再チェックされることはありません。

保護されているアプリケーションに検出された脆弱性が存在するが修正できない場合、[**仮想パッチの作成**](../user-guides/rules/vpatch-rule.ja.md)ルールの設定をお勧めします。このルールを設定することで、検出されたタイプの脆弱性を悪用する攻撃をブロックし、インシデントのリスクを無効化することができます。

## 発見した脆弱性の管理

すべての検出脆弱性はWallarm Console → **脆弱性**セクションに表示されます。以下のようにインターフェースを通じて脆弱性を管理することができます：

* 脆弱性の表示と分析
* 脆弱性の状態確認の実行：アプリケーション側でまだアクティブか修正されたか
* 脆弱性のクローズまたは偽陽性としてのマーク付け

![!脆弱性セクション](../images/user-guides/vulnerabilities/check-vuln.png)

Wallarmプラットフォームの[**API Discovery** モジュール](api-discovery.ja.md)を使用している場合、脆弱性は発見されたAPIエンドポイントとリンクされます：

![!API Discovery - Risk score](../images/about-wallarm-waf/api-discovery/api-discovery-risk-score.png)

脆弱性の管理についての詳細は、[脆弱性の操作](../user-guides/vulnerabilities.ja.md)の指示を参照してください。

## 発見した脆弱性についての通知

Wallarmはあなたに発見した脆弱性についての通知を送ることができます。これにより、あなたのアプリケーションの新たに発見された脆弱性を把握することができ、迅速にそれに対応することができます。脆弱性への対応には、アプリケーション側での修正、偽陽性の報告、および仮想パッチの適用が含まれます。

通知を設定するには、

1. [ネイティブな統合](../user-guides/settings/integrations/integrations-intro.ja.md)を作成して通知を送信するシステムと統合します（例：PagerDuty、Opsgenie、Splunk、Slack、Telegram）。
2. 統合カードの中で、利用可能なイベントリストの中から**脆弱性が検出されました**を選択します。

検出された脆弱性についてのSplunk通知の例：

```json
{
    summary:"[Test message] [Test partner(US)] New vulnerability detected",
    description:"Notification type: vuln

                In your system a new vulnerability was detected.

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
