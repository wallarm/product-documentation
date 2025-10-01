# テストポリシーの例

本書では、FASTのテストポリシーの例をいくつか紹介します。FASTドキュメントで使用しているものも含まれ、ポリシーの扱い方のあらゆる側面を示します。

!!! info "リクエスト要素の記述構文"
    FASTのテストポリシーは、ベースラインリクエストの特定の要素をFASTノードが扱う権限を許可または拒否します。

    これらの要素は[ポイント](../../dsl/points/intro.md)で説明されます。

    以下のサンプルテストポリシーでは、各ベースラインリクエストの要素に対応するポイントを併記しています。例: 任意のGETパラメータ（`GET_.*`）。

!!! info "脆弱性の検出"
    [FASTが検出可能な脆弱性の一覧](../../vuln-list.md)

    テストポリシーの設定時に選択する脆弱性の種類は、どの組み込みのFAST拡張（detects）が実行されるかに影響します。

    カスタムFAST拡張は、ポリシー設定でその脆弱性タイプを選択していなくても、自身が検出対象として設計された脆弱性タイプの検出を試みます。

    例えば、ポリシーがRCE向けのテストのみを許可していても、カスタム拡張はアプリケーションをSQLiの脆弱性についてテストします。

## デフォルトのテストポリシー

これは、一般的なリクエスト要素の扱いと典型的な脆弱性のテストを許可する、変更不可のテストポリシーです。

**このポリシーで扱いを許可する要素:**

* 任意のGETおよびPOSTパラメータ（`GET_.*`および`POST_.*`）
* URI（`URI`）
* URI内の任意のパス（`PATH_.*`）
* URLアクション名と拡張子（`ACTION_NAME`および`ACTION_EXT`）

**対象アプリケーションは、組み込みのFAST拡張によって** PTRAV、RCE、SQLI、XSS、XXEの脆弱性についてテストされます。

**このポリシーの特記事項:** fuzzingをサポートしません。fuzzerを有効化するには、別のテストポリシーを作成してください（[例](#policy-that-allows-working-with-uri-and-encoded-email-post-parameters-fuzzer-is-enabled)）。

![ポリシー例](../../../images/fast/operations/en/test-policy/examples/default-policy-example.png)

!!! info "注意"
    次の点にご留意ください。

    * 新しいテストポリシーを作成すると、その設定はデフォルトポリシーと同一です。必要に応じて新しいポリシーの設定を変更できます。
    * このポリシーは、FASTをCI/CDに統合する[例](../../poc/examples/circleci.md)で使用できます。

## すべてのGETおよびPOSTパラメータの扱いを許可するポリシー

このテストポリシーは、リクエスト内のすべてのGET（`GET_.*`）およびPOSTパラメータ（`POST_.*`）の扱いを許可します。

**対象アプリケーションは、組み込みのFAST拡張によって** XSS脆弱性についてテストされます。

**このポリシーの特記事項:** fuzzerは無効です。

![ポリシー例](../../../images/fast/operations/en/test-policy/examples/get-post-policy-example.png)

!!! info "注意"
    Quick Startガイドでは、このポリシーを使用して対象アプリケーション[Google Gruyere](../../qsg/test-run.md)のセキュリティテストを実施できます。

## URIとエンコードされたemailのPOSTパラメータの扱いを許可するポリシー（カスタムFAST拡張のみ実行可能）

このテストポリシーは、リクエスト内のURI（`URI`）と`email`のPOSTパラメータの扱いを許可します。`email`パラメータはJSONでエンコードされています（`POST_JSON_DOC_HASH_email_value`）。

**このポリシーの特記事項:**

* 実行できるのはカスタムFAST拡張のみで、組み込みのFAST detectsは実行されません。
* fuzzerは無効です。

![ポリシー例](../../../images/fast/operations/en/test-policy/examples/custom-dsl-example.png)

!!! info "注意"
    このポリシーは[サンプルのカスタム拡張](../../dsl/using-extension.md)の実行に使用できます。

## URIとエンコードされたemailのPOSTパラメータの扱いを許可するポリシー（Fuzzerを有効化） {#policy-that-allows-working-with-uri-and-encoded-email-post-parameters-fuzzer-is-enabled}

このポリシーは、リクエスト内の`email`のPOSTパラメータの扱いを許可します。`email`パラメータはJSONでエンコードされています（`POST_JSON_DOC_HASH_email_value`）。

**このポリシーの特記事項:**

* fuzzerは有効です。
* 組み込みのFAST拡張はすべて無効です（脆弱性は選択しません）。これはfuzzer使用時に可能です。

**このサンプルポリシーにおけるfuzzerの設定:**

* ペイロードは最大123バイトで、デコード後のポイント値の先頭に挿入します（この例ではポイントは`POST_JSON_DOC_HASH_email_value`の1つのみです）。
* 次を前提とします。

    * サーバーレスポンスボディに`SQLITE_ERROR`という文字列が含まれている場合は異常と見なします。
    * サーバーレスポンスコードの値が`500`未満の場合は異常なしと見なします。
    * すべてのペイロードを確認し終えるか、異常が2件を超えて検出された場合、fuzzerは実行を停止します。

![ポリシー例](../../../images/fast/operations/en/test-policy/examples/enabled-fuzzer-example.png)

!!! info "注意"
    このポリシーは、[OWASP Juice Shopのログインフォーム](../../dsl/extensions-examples/overview.md)の脆弱性発見に使用できます。

## 特定のポイントの値の扱いを拒否するポリシー

このテストポリシーは、リクエスト内のすべてのGETパラメータ（`GET_.*`）の扱いを許可しますが、`sessionid`のGETパラメータ（`GET_sessionid_value`）のみは除外します。

特定のポイントの扱いをFASTに禁止したい場合（例えば、特定のパラメータ値が意図せず変更されると対象アプリケーションの動作に支障をきたすおそれがある場合）に、このような動作を設定すると有用です。

**対象アプリケーションは、組み込みのFAST拡張によって** AUTHおよびIDORの脆弱性についてテストされます。 

**このポリシーの特記事項:** fuzzerは無効です。

![ポリシー例](../../../images/fast/operations/en/test-policy/examples/sessionid-example.png)