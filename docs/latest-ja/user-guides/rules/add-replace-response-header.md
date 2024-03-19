# レスポンスヘッダーの設定

ルール **サーバーのレスポンスヘッダーを変更** は、サーバーのレスポンスヘッダーの追加、削除、値の変更を可能にします。

このルールタイプは、アプリケーションセキュリティの追加レイヤーを設定するために最もよく使用されます。例えば：

* クライアントが特定のページでロードを許可されたリソースを制御するレスポンスヘッダー [`Content-Security-Policy`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) を追加する。これは[XSS](../../attacks-vulns-list.md#crosssite-scripting-xss)攻撃に対する防御に役立ちます。

  サーバーがデフォルトでこのヘッダーを返さない場合は、ルール **サーバーのレスポンスヘッダーを変更** を使用して追加することが推奨されます。MDN Web Docsでは、[可能なヘッダー値](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy#directives)と[ヘッダー使用例](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP#examples_common_use_cases)の説明を見つけることができます。

  同様に、このルールはレスポンスヘッダー [`X-XSS-Protection`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection)、[`X-Frame-Options`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)、[`X-Content-Type-Options`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options) を追加するために使用できます。
* NGINXヘッダー `Server` や、インストールされたモジュールバージョンに関するデータを含む他の任意のヘッダーを変更する。このデータは攻撃者によってインストールされたモジュールバージョンの脆弱性を発見し、結果として発見した脆弱性を悪用するために使用されてしまう可能性があります。

  NGINXヘッダー `Server` はWallarmノード2.16から変更可能です。

ルール **サーバーのレスポンスヘッダーを変更** はまた、ビジネスやテクニカルな問題に対処するためにも使用できます。

## ルールの作成と適用

--8<-- "../include-ja/waf/features/rules/rule-creation-options.md"

**ルール** セクションでルールを作成して適用するためには：

1. Wallarm Console の **ルール** セクションでルール **サーバーのレスポンスヘッダーを変更** を作成します。ルールは次のコンポーネントで構成されています：

     * **条件** [は](rules.md#branch-description)、ルールが適用されるエンドポイントを説明します。
     * 追加されるヘッダーの名前、またはその値を置き換えます。
     * 指定されたヘッダーの新しい値。

       既存のレスポンスヘッダーを削除する場合は、**置換**タブでこのヘッダーの値を空にしてください。

2. [ルールのコンパイルが完了する](rules.md)のを待ちます。

## ルールの例

`https://example.com/*` のすべてのコンテンツをサイトのオリジンからのみに許可するために、レスポンスヘッダー [`Content-Security-Policy: default-src 'self'`](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP#example_1) をルール **サーバーのレスポンスヘッダーを変更** を使用して以下のように追加できます：

![ルール "サーバーのレスポンスヘッダーを変更" の例](../../images/user-guides/rules/add-replace-response-header.png)