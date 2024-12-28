[allowlist-scanner-addresses]: ../user-guides/ip-lists/allowlist.md

# 脆弱性の検出

アプリケーションを構築または実装する際の過失や情報不足により、アプリケーションは攻撃に対して脆弱になることがあります。この記事から、Wallarmプラットフォームがアプリケーションの脆弱性をどのように検出し、システムのセキュリティを強化するための援助を提供するかを学びます。

## 脆弱性とは何ですか？

脆弱性とは、アプリケーションを構築または実装する際の過失や情報不足によるエラーです。攻撃者は脆弱性を悪用して、アプリケーション内で権限境界を越える (つまり、認証されていない操作を行う) ことができます。

## 脆弱性の検出方法

アプリケーションに存在するアクティブな脆弱性をスキャンするとき、Wallarmは攻撃の兆候を持つリクエストを保護対象のアプリケーションアドレスに送信し、アプリケーションのレスポンスを分析します。レスポンスが1つ以上の事前定義された脆弱性の兆候と一致する場合、Wallarmはアクティブな脆弱性を記録します。

例えば： `/etc/passwd` の内容を読み取るために送信されたリクエストに対するレスポンスが `/etc/passwd` の内容を返すなら、保護対象のアプリケーションはパストラバーサル攻撃に対して脆弱となります。Wallarmは適切なタイプの脆弱性としてそれを記録します。

アプリケーションの脆弱性を検出するため、Wallarmは以下の方法で攻撃の兆候を持つリクエストを送信します：

* **パッシブ検出**：セキュリティインシデントが起きたことで脆弱性が見つかった。
* **アクティブな脅威の検証**：攻撃者を侵入テスト担当者に変え、彼らの活動からアプリケーション／APIの可能性のあるセキュリティ問題を発見できます。このモジュールは、トラフィックから実際の攻撃データを使用してアプリケーションのエンドポイントを探ることで可能な脆弱性を見つけます。デフォルトではこの方法は無効になっています。
* **脆弱性スキャナー**：会社が公開している資産が、典型的な脆弱性を持っているかどうかをスキャンします。

### パッシブ検出

パッシブ検出では、Wallarmはセキュリティインシデントが発生したことにより脆弱性を検出します。アプリケーションの脆弱性が攻撃中に悪用されていた場合、Wallarmはそのセキュリティインシデントと、悪用された脆弱性を記録します。

パッシブな脆弱性検出はデフォルトで有効になっています。

### アクティブな脅威の検証 <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;height: 24px;margin-bottom: -4px;"></a>

#### その動作方法

--8<-- "../include-ja/how-attack-rechecker-works.md"

!!! warning "IPによってグループ化されたヒットがある場合のアクティブな脅威の検証"
    攻撃が発生元のIPによって[グループ化](protecting-against-attacks.md#attack)されている場合、この攻撃のアクティブな検証は利用できません。

#### 「アクティブな脅威の検証」モジュールからの潜在的なリスク

* Wallarmが合法的なリクエストを攻撃として検出した場合、**アクティブ脅威検証**モジュールによってリクエストが再実行されます。リクエストが冪等でない場合（たとえば、アプリケーションで新しいオブジェクトを作成する認証済みリクエストなど）、脅威検証のためにモジュールによって生成されたリクエストは、クライアントのアカウント内に多数の新しい不要なオブジェクトを作成したり、他の予期しない操作を実行する可能性があります。

    この状況のリスクを最小限に抑えるために、**アクティブ脅威検証**モジュールは再放送されたリクエストから以下のHTTPヘッダーを自動的に削除します：

    * `Cookie`
    * `Authorization: Basic`
    * `Viewstate`
* アプリケーションが非標準的な認証方法を使用している場合やリクエストの認証が必要ない場合、**アクティブ脅威検証**モジュールはトラフィックからの任意のリクエストを再放送し、システムに悪影響を与える可能性があります。例えば、100以上のお金の取引や注文を繰り返すなどです。この状況のリスクを最小限に抑えるために、[攻撃の再生のためのテスト環境やステージング環境を使用する](../vulnerability-detection/threat-replay-testing/setup.md#optional-configure-attack-rechecker-request-rewriting-rules-run-tests-against-a-copy-of-the-application)ことと、[非標準的なリクエスト認証パラメータをマスクする](../vulnerability-detection/threat-replay-testing/setup.md#configure-proper-data-masking-rules)ことを推奨します。

#### 設定

**アクティブ脅威検証**モジュールはデフォルトでは無効になっています。適切に動作させるためには、有効にし、適切に設定する必要があります。**アクティブ脅威検証**の設定オプションと、これらのオプションの設定のベストプラクティスについては、[こちらのドキュメント](../vulnerability-detection/threat-replay-testing/setup.md)をご覧ください。

### 脆弱性スキャナー <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;height: 24px;margin-bottom: -4px;"></a>

#### その動作方法

脆弱性スキャナーは、企業が公開しているすべての資産を典型的な脆弱性についてチェックします。スキャナーはアプリケーションのアドレスに対して固定のIPアドレスからリクエストを送信し、リクエストに `X-Wallarm-Scanner-Info` ヘッダーを追加します。

#### 設定

* スキャナーはWallarmコンソール → **脆弱性** → **設定**で[有効または無効](../user-guides/vulnerabilities.md#configuring-vulnerability-detection)にできます。デフォルトでは、スキャナーは有効です。
* Wallarmコンソール → **脆弱性** → **設定**でスキャナーによって検出可能な[脆弱性のリスト](../user-guides/vulnerabilities.md#configuring-vulnerability-detection)を設定できます。デフォルトでは、脆弱性スキャナーは利用可能なすべての脆弱性を検出します。
* Wallarmコンソール→**スキャナー**→**構成**で、スキャナーから送信される[リクエストの限度](../user-guides/scanner.md#limiting-vulnerability-scanning)を各アセットごとに設定することができます。
* 自動的にトラフィックをフィルタリングし、ブロックする追加機能（ソフトウェアまたはハードウェア）を使用している場合、Wallarmスキャナー用の許可リストにIPアドレスを設定することをお勧めします。これにより、Wallarmのコンポーネントがあなたのリソースをシームレスにスキャンして脆弱性を検出することができます。

    * [Wallarm US Cloudに登録されたスキャナーのIPアドレス](../admin-en/scanner-addresses.md)
    * [Wallarm EU Cloudに登録されたスキャナーのIPアドレス](../admin-en/scanner-addresses.md)

    追加の設備を使用せずにWallarmスキャナーを使用している場合、手動でスキャナーのIPアドレスを許可リストに追加する必要はありません。Wallarmノード3.0から、スキャナーのIPアドレスは自動的に許可リストに追加されます。

## 偽陽性

**偽陽性**は、合法的なリクエストに攻撃の兆候が検出された場合や、合法的なエンティティが脆弱性と判断された場合に発生します。[攻撃検出における偽陽性の詳細はこちら→](protecting-against-attacks.md#false-positives)

脆弱性スキャニングの偽陽性は、保護されたアプリケーションの特性によって発生する可能性があります。同様のレスポンスが同様のリクエストに対して返されることは、一つの保護されたアプリケーションではアクティブな脆弱性を示す一方で、別の保護されたアプリケーションでは予期された動作を示すことがあります。

脆弱性の偽陽性が検出された場合、Wallarmコンソールで脆弱性に適切なマークを追加できます。偽陽性とマークされた脆弱性はクローズされ、再チェックは行われません。

保護されたアプリケーションに脆弱性が存在し、修正することができない場合、[**仮想パッチを作成する**](../user-guides/rules/vpatch-rule.md)ルールを設定することをお勧めします。このルールにより、検出されたタイプの脆弱性を悪用する攻撃をブロックし、インシデントのリスクを排除することができます。

## 発見された脆弱性の管理

すべての検出された脆弱性はWallarmコンソール → **脆弱性** セクションに表示されます。以下のようにインターフェースを通じて脆弱性を管理することができます：

* 脆弱性を表示し、分析する
* 脆弱性のステータス検証を実行：アプリケーション側で依然としてアクティブか、または修正されている
* 脆弱性をクローズするか、偽陽性としてマークする

![脆弱性セクション](../images/user-guides/vulnerabilities/check-vuln.png)

Wallarmプラットフォームの[**API Discovery**モジュール](../api-discovery/overview.md)を使用している場合、脆弱性は検出されたAPIエンドポイントと関連付けられます。たとえば：

![API Discovery - Risk score](../images/about-wallarm-waf/api-discovery/api-discovery-risk-score.png)

脆弱性の管理に関する詳細情報は、[脆弱性の操作](../user-guides/vulnerabilities.md)に関する指示をご覧ください。

## 発見した脆弱性に関する通知

Wallarmは発見した脆弱性に関する通知を送信することができます。これにより、アプリケーションの新たに発見された脆弱性を把握し、それに迅速に対応することができます。脆弱性への対応には、アプリケーション側での修正、偽陽性の報告、仮想パッチの適用が含まれます。

通知を設定するには：

1. 通知を送信するシステムと[native integration](../user-guides/settings/integrations/integrations-intro.md) を作成します（例：PagerDuty、Opsgenie、Splunk、Slack、Telegram）。
2. インテグレーションカードの利用可能なイベントリストで**脆弱性が検出された** を選択します。

検出された脆弱性についてのSplunk通知の例：

```json
{
    summary:"[テストメッセージ] [テストパートナー(US)] 新しい脆弱性が検出されました",
    description:"通知タイプ: vuln

                システム内で新しい脆弱性が検出されました。

                ID: 
                タイトル: テスト
                ドメイン: example.com
                パス: 
                メソッド: 
                検出者: 
                パラメータ: 
                タイプ: info
                脅威: 中

                詳細: https://us1.my.wallarm.com/object/555


                クライアント: TestCompany
                クラウド: US
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
            type:"info"
        }
    }
}
```
