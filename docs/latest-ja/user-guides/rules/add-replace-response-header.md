[api-discovery-enable-link]:        ../../api-discovery/setup.md#enable

# サーバーのレスポンスヘッダーの変更

**Change server response headers**の[ルール](../../user-guides/rules/rules.md)は、サーバーのレスポンスヘッダーの追加、削除、および値の変更が可能です。

このルールタイプは、アプリケーションのセキュリティを強化する追加レイヤーを構成する目的で、主に次の用途に使用します:

* 特定のページでクライアントが読み込むことを許可されるリソースを制御するレスポンスヘッダー[`Content-Security-Policy`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)を追加します。これは[XSS](../../attacks-vulns-list.md#crosssite-scripting-xss)攻撃からの防御に役立ちます。

    サーバーがこのヘッダーをデフォルトで返さない場合は、ルール**Change server response headers**を使用して追加することを推奨します。MDN Web Docsには、[取り得るヘッダー値](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy#directives)や[ヘッダーの使用例](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP#examples_common_use_cases)が記載されています。

    同様に、このルールを使用して、レスポンスヘッダー[`X-XSS-Protection`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection)、[`X-Frame-Options`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)、[`X-Content-Type-Options`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options)を追加できます。
* インストール済みモジュールのバージョン情報を含むNGINXのヘッダー`Server`やその他のヘッダーを変更します。この種のデータは、攻撃者がインストールされているモジュールのバージョンに存在する脆弱性を特定し、その結果として脆弱性を悪用する目的で利用される可能性があります。

    NGINXのヘッダー`Server`は、Wallarm node 2.16以降で変更できます。

ルール**Change server response headers**は、その他のビジネス上および技術上の課題への対応にも使用できます。

## ルールの作成と適用

ルールを作成して適用するには、次の手順を実行します。


--8<-- "../include/rule-creation-initial-step.md"
1. **If request is**で、ルールを適用する対象範囲を[指定します](rules.md#configuring)。
1. **Then**で、**Change server response headers**を選択し、次を設定します:

    * 追加するヘッダー名、または値を置き換える対象のヘッダー名。
    * 指定したヘッダーの新しい値（複数可）。
    * 既存のレスポンスヘッダーを削除するには、**Replace**タブで値を空にします。

1. [ルールのコンパイルの完了](rules.md#ruleset-lifecycle)を待ちます。

## 例: セキュリティポリシーヘッダーとその値の追加

https://example.com/* のすべてのコンテンツがサイトのオリジンからのみ配信されるようにするには、ルール**Change server response headers**を使用して、次のようにレスポンスヘッダー[`Content-Security-Policy: default-src 'self'`](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP#example_1)を追加できます:

![ルール「Change server response headers」の例](../../images/user-guides/rules/add-replace-response-header.png)