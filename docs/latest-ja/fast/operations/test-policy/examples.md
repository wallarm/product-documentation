# テストポリシー例

本書では、FASTテストポリシーの例をいくつか示します。これらの例はFASTドキュメントで使用されるものを含み、ポリシーでの作業に関するすべての側面を示しています。

!!! info "リクエスト要素記述構文"
    FASTテストポリシーは、ベースラインリクエストの特定の要素で作業するためのFASTノードの許可または禁止を行います。

    これらの要素は[points](../../dsl/points/intro.md)を使用して記述されています。

    下記のサンプルテストポリシーでは、すべてのベースラインリクエストの要素の後に、対応するポイントが続きます。例えば、任意のGETパラメータ(`GET_.*`)のようにです。

!!! info "脆弱性の検出"
    [FASTが検出可能な脆弱性の一覧](../../vuln-list.md)

    テストポリシーの設定中に脆弱性の種類を選択することが、組み込みFAST拡張機能（detectsとして知られる）のうちどれが実行されるかに影響します。

    カスタムFAST拡張機能は、ポリシー設定時にその脆弱性タイプが選択されていなくても、対象の脆弱性タイプの検出を試みます。

    例えば、あるポリシーはターゲットアプリケーションのRCE検査を許可していても、カスタム拡張機能はSQLi脆弱性検査を実施します。

## デフォルトテストポリシー

これは、一般的なリクエスト要素を用いた作業および典型的な脆弱性検査を可能にする、変更不可能なテストポリシーです。

**このポリシーでは、次の要素での作業が許可されます:**

* 任意のGETおよびPOSTパラメータ(`GET_.*`と`POST_.*`)
* URI(`URI`)
* URI内の任意のパス(`PATH_.*`)
* URLのアクション名および拡張子(`ACTION_NAME`と`ACTION_EXT`)

**ターゲットアプリケーションは、組み込みFAST拡張機能によってPTRAV、RCE、SQLI、XSSおよびXXE脆弱性についてテストされます。**

**このポリシーには以下の特記事項があります:** ファジングをサポートしておりません。ファザーを有効にするには、別のテストポリシーを作成してください（[例](#policy-that-allows-working-with-uri-and-encoded-email-post-parameters-fuzzer-is-enabled)）。

![Policy example](../../../images/fast/operations/en/test-policy/examples/default-policy-example.png)

!!! info "注意"
    次の点にご留意ください:

    * 新しいテストポリシーを作成すると、その設定はデフォルトポリシーと同一となります。必要に応じて新しいポリシーの設定を変更してください。
    * このポリシーは、FASTのCI/CDへの統合の[例](../../poc/examples/circleci.md)で使用可能です。

## すべてのGETおよびPOSTパラメータでの作業を許可するポリシー

このテストポリシーでは、リクエスト内のすべてのGET(`GET_.*`)およびPOSTパラメータ(`POST_.*`)での作業が許可されます。

**ターゲットアプリケーションは、組み込みFAST拡張機能によってXSS脆弱性についてテストされます。**

**このポリシーには以下の特記事項があります:** ファザーは無効です。

![Policy example](../../../images/fast/operations/en/test-policy/examples/get-post-policy-example.png)

!!! info "注意"
    クイックスタートガイドでは、このポリシーを使用して[Google Gruyere](../../qsg/test-run.md)ターゲットアプリケーションのセキュリティテストを実施できます。

## URIおよびエンコードされたemail POSTパラメータでの作業を許可するポリシー（カスタムFAST拡張機能のみ実行可能）

このテストポリシーでは、リクエスト内のURI(`URI`)および`email` POSTパラメータでの作業が許可されます。`email`パラメータはJSON形式でエンコードされています（`POST_JSON_DOC_HASH_email_value`）。

**このポリシーには以下の特記事項があります:**

* カスタムFAST拡張機能のみが実行され、組み込みFAST検知機能は実行されません。
* ファザーは無効です。

![Policy example](../../../images/fast/operations/en/test-policy/examples/custom-dsl-example.png)

!!! info "注意"
    このポリシーは、[サンプルカスタム拡張機能](../../dsl/using-extension.md)の実行に使用できます。

## URIおよびエンコードされたemail POSTパラメータでの作業を許可するポリシー（ファザーが有効）

このポリシーでは、リクエスト内の`email` POSTパラメータでの作業が許可されます。`email`パラメータはJSON形式でエンコードされています（`POST_JSON_DOC_HASH_email_value`）。

**このポリシーには以下の特記事項があります:**

* ファザーが有効です。
* すべての組み込みFAST拡張機能は無効であり（脆弱性が選択されていません）。これはファザーを使用する場合に可能です。

**このサンプルポリシーでは、ファザーは次のように設定されています:**

* 123バイトまでのペイロードが、ポイントのデコードされた値の先頭に挿入されます（このケースでは、`POST_JSON_DOC_HASH_email_value`という単一のポイントがあります）。
* 以下の場合、異常が検出されたとみなします:
    * サーバのレスポンスボディに`SQLITE_ERROR`文字列が含まれている場合。
    * サーバのレスポンスコードが`500`未満の場合、異常は検出されないとみなします。
    * すべてのペイロードがチェックされるか、あるいは2つ以上の異常が検出された場合、ファザーの実行が停止されます。

![Policy example](../../../images/fast/operations/en/test-policy/examples/enabled-fuzzer-example.png)

!!! info "注意"
    このポリシーは、[OWASP Juice Shop login form](../../dsl/extensions-examples/overview.md)における脆弱性検出に使用できます。

## 特定のポイントの値での作業を拒否するポリシー

このテストポリシーでは、リクエスト内のすべてのGETパラメータ(`GET_.*`)での作業が許可されますが、`sessionid` GETパラメータ(`GET_sessionid_value`)は除外されます。

特定のポイントでの作業を拒否する必要がある場合（たとえば、特定パラメータ値の意図しない変更がターゲットアプリケーションの動作に支障をきたす可能性がある場合）、このような動作を設定することが有用です。

**ターゲットアプリケーションは、組み込みFAST拡張機能によってAUTHおよびIDOR脆弱性についてテストされます。**

**このポリシーには以下の特記事項があります:** ファザーは無効です。

![Example policy](../../../images/fast/operations/en/test-policy/examples/sessionid-example.png)