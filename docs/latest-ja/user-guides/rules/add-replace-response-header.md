[api-discovery-enable-link]:        ../../api-discovery/setup.md#enable

# サーバーレスポンスヘッダーの変更

**Change server response headers** [rule](../../user-guides/rules/rules.md)はサーバーレスポンスヘッダーの追加、削除および値の変更を可能にします。

このルールタイプは通常、アプリケーションセキュリティの追加レイヤを構成するために使用されます。例えば：

* あるページに対してクライアントが読み込むことを許可されたリソースを制御する[`Content-Security-Policy`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)レスポンスヘッダーを追加します。これにより[XSS](../../attacks-vulns-list.md#crosssite-scripting-xss)攻撃から保護されます。

    サーバーが既定でこのヘッダーを返さない場合は、**Change server response headers**ルールを使用して追加することを推奨します。MDN Web Docsでは、[可能なヘッダー値](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy#directives)や[ヘッダー使用例](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP#examples_common_use_cases)の説明が記載されています。

    同様に、このルールを利用して[`X-XSS-Protection`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection)、[`X-Frame-Options`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)、[`X-Content-Type-Options`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options)のレスポンスヘッダーを追加できます。

* NGINXのヘッダー`Server`またはインストール済みモジュールバージョンに関するデータを含むその他のヘッダーを変更します。これらのデータは、攻撃者によってインストール済みモジュールの脆弱性を発見され、結果として発見された脆弱性を悪用される可能性があります。

    NGINXのヘッダー`Server`はWallarm node 2.16以降で変更可能です。

**Change server response headers**ルールは、その他のビジネスおよび技術的な課題に対処するためにも利用できます。

## ルールの作成と適用

ルールを作成して適用するには：

--8<-- "../include/rule-creation-initial-step.md"
1. **If request is**で、ルールを適用するスコープを[describe](rules.md#configuring)します。
1. **Then**で、「Change server response headers」を選択し、以下を設定します：
    * 追加するかその値を置換するヘッダーの名前。
    * 指定されたヘッダーの新しい値。
    * 既存のレスポンスヘッダーを削除するには、**Replace**タブ上でその値を空欄のままにします。
1. [rule compilation to complete](rules.md#ruleset-lifecycle)するのを待ちます。

## 例：セキュリティポリシーヘッダーとその値の追加

サイトのオリジンからのみ`https://example.com/*`の全コンテンツを読み込ませるため、以下のように**Change server response headers**ルールを使用して[`Content-Security-Policy: default-src 'self'`](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP#example_1)レスポンスヘッダーを追加できます。

![「Change server response headers」ルールの例](../../images/user-guides/rules/add-replace-response-header.png)