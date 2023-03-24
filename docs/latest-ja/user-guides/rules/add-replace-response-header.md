# 応答ヘッダーの設定

ルール **サーバー応答ヘッダーの変更** は、サーバー応答ヘッダーの追加、削除、および値の変更を許可します。

このルールタイプは、アプリケーションのセキュリティの追加レイヤーを設定するために最もよく使用されます。例えば：

* クライアントが特定のページに対してロードできるリソースを制御する応答ヘッダー [`Content-Security-Policy`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) を追加します。これにより、[XSS](../../attacks-vulns-list.md#crosssite-scripting-xss)攻撃に対する防御が可能になります。

    サーバーがデフォルトでこのヘッダーを返さない場合は、ルール **サーバー応答ヘッダーの変更** を使用して追加することをお勧めします。MDN Web Docs で、[可能なヘッダー値](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy#directives)と [ヘッダー使用例](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP#examples_common_use_cases)の説明を見つけることができます。

    同様に、このルールを使用して、応答ヘッダー [`X-XSS-Protection`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection) 、[`X-Frame-Options`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options) 、[`X-Content-Type-Options`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options) を追加することができます。
* NGINX ヘッダー `Server` またはインストールされたモジュールバージョンのデータを含むその他のヘッダーを変更します。このデータは、攻撃者がインストールされたモジュールバージョンの脆弱性を検出し、その結果、検出された脆弱性を悪用するために使用される可能性があります。

    NGINX ヘッダー `Server` は Wallarm ノード 2.16 から変更できます。

ルール **サーバー応答ヘッダーの変更** は、ビジネスや技術的な問題に対応するためにも使用できます。

## ルールの作成と適用

--8<-- "../include-ja/waf/features/rules/rule-creation-options.md"

**ルール** セクションでルールを作成および適用するには：

1. Wallarm Console の **ルール** セクションで、**サーバー応答ヘッダーの変更** ルールを作成します。ルールは以下のコンポーネントで構成されます。

      * ルールが適用されるエンドポイントを[説明](add-rule.md#branch-description)する **条件** 。
      * 追加するヘッダーの名前または値を置き換える。
      * 指定されたヘッダーの新しい値。

        既存の応答ヘッダーを削除するには、**置換** タブでこのヘッダーの値にスペースを指定してください。

2. [ルールのコンパイルが完了する](compiling.md) のを待ちます。

## ルールの例

`https://example.com/*` のすべてのコンテンツをサイトのオリジンからのみ許可するようにするには、ルール **サーバー応答ヘッダーの変更** を使用して、応答ヘッダー [`Content-Security-Policy: default-src 'self'`](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP#example_1) を追加できます。

![!ルール "サーバー応答ヘッダーの変更" の例](../../images/user-guides/rules/add-replace-response-header.png)