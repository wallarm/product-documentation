[allowlist-scanner-addresses]: ../user-guides/ip-lists/allowlist.md

# 脆弱性の検出

アプリケーションの構築または実装時に疎忽や不十分な情報が原因で攻撃の対象になることがあります。この記事では、Wallarmプラットフォームがアプリケーションの脆弱性を検出する方法を説明し、システムセキュリティを向上させることができます。

## 脆弱性とは？

脆弱性は、アプリケーションを構築または実装する際の疎忽や不十分な情報によって発生するエラーです。攻撃者は、脆弱性を利用して（つまり、認可されていないアクションを実行して）アプリケーション内で特権境界を越えることができます。

## 脆弱性の検出方法

Wallarmは、アプリケーションのアクティブな脆弱性をスキャンするとき、攻撃サインを含むリクエストを保護されたアプリケーションアドレスに送信し、応答を分析します。応答が1つ以上の事前定義済みの脆弱性サインに一致する場合、Wallarmはアクティブな脆弱性を記録します。

例えば、`/etc/passwd`コンテンツの読み取りに送信されたリクエストへの応答が`/etc/passwd`コンテンツを返す場合、保護されたアプリケーションはパス漫遊攻撃の脆弱性があることがわかります。Wallarmは、適切な種類で脆弱性を記録します。

Wallarmは、攻撃サインを含むリクエストを使用して、次の方法を使用してアプリケーション中の脆弱性を検出します。

* **パッシブ検出**：セキュリティインシデントが発生したことによって脆弱性が検出されました。
* **アクティブ脅威検証**：攻撃者を侵入テスターに変え、アプリケーション/ APIを探索して脆弱性を見つけることができます。このモジュールは、trafficeからの実際の攻撃データを使用して、アプリケーションエンドポイントを調査して可能性のある脆弱性を見つけます。デフォルトでは、この方法は無効になっています。
* **脆弱性スキャナー**：会社の公開されたアセットをタイプ別の脆弱性でスキャンします。

### パッシブ検出

パッシブ検出では、Wallarmはセキュリティインシデントが発生したことによって脆弱性が検出されます。アプリケーションの脆弱性が攻撃中に悪用された場合、Wallarmはセキュリティインシデントと悪用された脆弱性を記録します。

パッシブ脆弱性検出はデフォルトで有効になっています。

### アクティブ脅威検証 <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;height: 24px;margin-bottom: -4px;"></a>

#### 動作方法

--8<-- "../include-ja/how-attack-rechecker-works.md"

!!! warning "アクティブ脅威検証：攻撃がIPでグループ化されている場合"
    攻撃が[グループ化](protecting-against-attacks.md#attack)された場合、この攻撃のアクティブ検証は利用できません。#### 「アクティブ脅威検証」モジュールからの潜在的なリスク

* Wallarmが攻撃として正当なリクエストを検出した場合、要求は「アクティブ脅威検証」モジュールによって再生されることがあります。 リクエストが冪等でない場合（たとえば、アプリケーション内で新しいオブジェクトを作成する認証済みリクエストの場合）、脅威検証のためにモジュールによって生成されたリクエストは、クライアントアカウント内に多数の新しい不要なオブジェクトを作成したり、その他の予期しない操作を実行したりする場合があります。

    記載された状況のリスクを最小限に抑えるために、**アクティブ脅威検証**モジュールは再生された要求から以下のHTTPヘッダーを自動的に削除します。

    * `Cookie`
    * `Authorization: Basic`
    * `Viewstate`
* アプリケーションが非標準の認証方法を使用する場合や、リクエストの認証が必要ない場合、 **アクティブ脅威検証**モジュールはトラフィックから任意のリクエストを再生してシステムを損傷する可能性があります。 たとえば、100回以上のマネートランザクションまたは注文を繰り返します。 記載された状況のリスクを最小限に抑えるためには、[攻撃再生のためのテストまたはステージング環境を使用](../admin-en/attack-rechecker-best-practices.md#optional-configure-attack-rechecker-request-rewriting-rules-run-tests-against-a-copy-of-the-application)し、[非標準のリクエスト認証パラメータをマスク](../admin-en/attack-rechecker-best-practices.md#configure-proper-data-masking-rules)することをお勧めします。

#### 設定

モジュール「アクティブ脅威検証」はデフォルトで無効になっています。正しく動作するように有効にし、適切に設定する必要があります。 [このドキュメント](../admin-en/attack-rechecker-best-practices.md)から、「アクティブ脅威検証」の設定オプションと最適な実装手順を学びます。

### バルナム脆弱性スキャナー<a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;height: 24px;margin-bottom: -4px;"></a>

#### 動作方法

脆弱性スキャナーは、すべての会社の公開されたアセットを典型的な脆弱性のためにチェックします。スキャナーは固定されたIPアドレスからアプリケーションアドレスにリクエストを送信し、リクエストにヘッダ「X-Wallarm-Scanner-Info」を追加します。#### 設定

* スキャナは、Wallarmコンソールの**Scanner**セクションで[有効化/無効化](../user-guides/scanner/configure-scanner-modules.md)されます。デフォルトで、スキャナは有効になっています。
* スキャナで検出可能な[脆弱性のリスト](../user-guides/scanner/configure-scanner-modules.md)は、Wallarmコンソールの**Scanner**セクションで設定できます。デフォルトでは、Vulnerability Scannerは利用可能なすべての脆弱性を検出します。
* スキャナから送信されるリクエストの[リミット](../user-guides/scanner/configure-scanner.md#scanners-rps-limits)は、Wallarmコンソールの**Scanner**セクションで設定できます。
* トラフィックを自動的にフィルタリングしてブロックするために追加の設備（ソフトウェアまたはハードウェア）を使用する場合、Wallarm ScannerのIPアドレス用にallowlistを設定することをお勧めします。これにより、Wallarmコンポーネントは脆弱性をスキャンするためにリソースをシームレスにスキャンできるようになります。

    * [Wallarm US Cloudに登録されたスキャナのIPアドレス](../admin-en/scanner-address-us-cloud.md)
    * [Wallarm EU Cloudに登録されたスキャナのIPアドレス](../admin-en/scanner-address-eu-cloud.md)

    追加の設備を使用せずにWallarmスキャナを使用する場合、Scanner IPアドレスを手動でallowlistする必要はありません。Wallarmノード3.0からは、Scanner IPアドレスが自動的にallowlistに登録されるようになりました。

## 偽陽性

**偽陽性**とは、正当なリクエストで攻撃の兆候が検出される場合、または正当な実体が脆弱性と見なされる場合に発生します。[攻撃検出における偽陽性の詳細については、こちらをご覧ください。→](/protecting-against-attacks.md#false-positives)

脆弱性スキャンにおける偽陽性は、保護されたアプリケーションの特異性によって発生する可能性があります。類似したリクエストに対する類似した応答は、保護されたアプリケーションの1つでアクティブな脆弱性を示し、他の保護されたアプリケーションでは想定される動作です。

脆弱性の偽陽性が検出された場合、Wallarmコンソールで適切なマークを脆弱性に追加できます。偽陽性とマークされた脆弱性は、適切なステータスに切り替えられ、**Active threat verification**モジュールによってチェックされなくなります。[Wallarmコンソールを使用した偽陽性の管理について詳しくは、こちらをご覧ください。→](../user-guides/vulnerabilities/false-vuln.md)

保護されたアプリケーションに検出された脆弱性が修正できない場合は、[**仮想パッチを作成**](../user-guides/rules/vpatch-rule.md)するルールを設定することをお勧めします。このルールにより、検出されたタイプの脆弱性を悪用する攻撃をブロックし、インシデントのリスクを除去できます。## 見つかった脆弱性の管理

WallarmコンソールのVulnerabilitiesセクションにて、検出されたすべての脆弱性が表示されます。以下の手順に従って、インターフェイスから脆弱性を管理することができます。

* 脆弱性の閲覧と分析
* 脆弱性ステータスの検証の実行: アプリケーション側でまだ有効か、修正されたか
* 脆弱性のクローズまたは誤検知マーク

![!Vulnerabilities section](../images/about-wallarm-waf/vulnerabilities-list.png)

Wallarmプラットフォームの[API Discoveryモジュール](api-discovery.md)を使用している場合、脆弱性は発見されたAPIエンドポイントにリンクされます。例:

![!API Discovery - Risk score](../images/about-wallarm-waf/api-discovery/api-discovery-risk-score.png)

脆弱性の管理に関する詳細は、[脆弱性の処理に関する手順](../user-guides/vulnerabilities/check-vuln.md)を参照してください。

## 見つかった脆弱性に関する通知

Wallarmは、見つかった脆弱性に関する通知を送信することができます。これにより、アプリケーションの新たに発見された脆弱性について把握し、迅速に対処することができます。脆弱性への対処は、アプリケーション側で修正し、誤検知の報告を行い、バーチャルパッチを適用することを含みます。

通知の設定方法:

1. 通知を送信するシステムと[ネイティブインテグレーション](../user-guides/settings/integrations/integrations-intro.md)を作成します(PagerDuty、Opsgenie、Splunk、Slack、Telegramなど)。
2. 統合カードで、利用可能なイベントのリストから**Vulnerabilities detected**を選択します。

発見した脆弱性に関するSplunk通知の例:

```json
{
    summary:"[テストメッセージ] [テストパートナー(米国)] 新しい脆弱性が検出されました",
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