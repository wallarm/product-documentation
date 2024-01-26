# テストポリシーの例

このドキュメントでは、FASTドキュメントで使用される以下のテストポリシーポリシーの例をいくつか紹介します。これらの例はポリシーとのすべてのアスペクトの操作をデモンストレーションします。

!!! info "リクエスト要素の説明構文"
FASTテストポリシーは、FASTノードが基準リクエストの特定の要素と作業を許可または拒否します。

これらの要素は[points](../../dsl/points/intro.md)を使用して記述されます。

以下のサンプルテストポリシーでは、すべての基準リクエストの要素は対応するポイントに続きます。例えば、任意のGETパラメータ (`GET_.*`)

!!! info "脆弱性の検出"
[FASTが検出できる脆弱性のリスト](../../vuln-list.md)

テストポリシーの設定時に脆弱性タイプを選択すると、組み込みのFAST拡張（別名検出）の中でどれが実行されるかが影響を受けることに注意してください。

カスタムFAST拡張は、構成時に選択されていなかったこの種の脆弱性であっても、設計通りに脆弱性タイプを検出しようとします。

例えば、ポリシーはRCEの対象アプリケーションのテストを許可できますが、カスタム拡張はSQLi脆弱性をテストします。

## デフォルトのテストポリシー

これは、共通のリクエスト要素と典型的な脆弱性のテストを許可する変更不可能なテストポリシーです。

**このポリシーでは、次の要素の操作が許可されています:**

* 任意のGETとPOSTパラメータ (`GET_.*` と `POST_.*`)
* URI (`URI`)
* URIの任意のパス (`PATH_.*`)
* URLのアクション名と拡張子 (`ACTION_NAME` と `ACTION_EXT`)

**組み込みのFAST拡張により、ターゲットアプリケーションは** PTRAV、RCE、SQLI、XSS、およびXXEの脆弱性でテストされます。

**このポリシーは以下の特性を持っています**：それはfuzzingをサポートしていません。fuzzerを有効にするためには、別のテストポリシーを作成してください（[例](#policy-that-allows-working-with-uri-and-encoded-email-post-parameters-fuzzer-is-enabled)）。

![Policy example](../../../images/fast/operations/en/test-policy/examples/default-policy-example.png)

!!! info "注記"
以下を考慮に入れてください:

* 新しいテストポリシーを作成するとき、その設定はデフォルトのポリシーで使用されるものと同じになります。新しいポリシーの設定は必要に応じて変更できます。
* このポリシーは、FASTをCI/CDに統合する[例](../../poc/examples/circleci.md)で使用できます。

## すべてのGETおよびPOSTパラメータで作業を許可するポリシー

このテストポリシーでは、リクエスト内のすべてのGET (`GET_.*`) とPOSTパラメータ (`POST_.*`) で作業を許可します。

**組み込みのFAST拡張により、ターゲットアプリケーションは** XSSの脆弱性でテストされます。

**このポリシーは次のとおりです**：fuzzerは無効です。

![Policy example](../../../images/fast/operations/en/test-policy/examples/get-post-policy-example.png)

!!! info "注記"
クイックスタートガイドでは、このポリシーを使って[Google Gruyere](../../qsg/test-run.md) ターゲットアプリケーションのセキュリティテストを行うことができます。

## URIとエンコードされた電子メールPOSTパラメータで作業を許可するポリシー（カスタムFAST拡張のみが実行許可）

このテストポリシーでは、リクエスト内のURI (`URI`) と `email` POSTパラメータで作業を許可します。`email` パラメータはJSON (`POST_JSON_DOC_HASH_email_value`) でエンコードされています。

**このポリシーは以下の特性を持っています:**

* カスタムFAST拡張のみを実行することが許可され、組み込みFAST検出は実行されません。
* Fuzzerは無効です。

![Policy example](../../../images/fast/operations/en/test-policy/examples/custom-dsl-example.png)

!!! info "注記"
このポリシーは、[カスタム拡張のサンプル](../../dsl/using-extension.md)を実行するために使用できます。

## URIとエンコードされた電子メールPOSTパラメータで作業を許可するポリシー（Fuzzerが有効）

このポリシーでは、リクエスト内の`email` POSTパラメータで作業を許可します。 `email` パラメータはJSON (`POST_JSON_DOC_HASH_email_value`) でエンコードされています。

**このポリシーは以下の特性を持っています:**

* Fuzzerが有効です。
* すべての組み込みのFAST拡張機能が無効化されています(脆弱性は選択されません)。これはfuzzerを使用時に可能です。

**このサンプルポリシーでは、fuzzerは以下のように設定されています:**

* ペイロードは最大123バイトまで、ポイントのデコード値の先頭に挿入されます（この具体的なケースでは、単一のポイント`POST_JSON_DOC_HASH_email_value`が存在します）。
* 次のことが仮定されています

    * サーバーのレスポンスボディに`SQLITE_ERROR`という文字列が存在する場合、異常が見つかったとみなされます。
    * サーバーレスポンスコードの値が`500`未満の場合、異常は見つからないとみなされます。
    * すべてのペイロードがチェックされた場合または2つ以上の異常が見つかった場合、Fuzzerは実行を停止します。

![Policy example](../../../images/fast/operations/en/test-policy/examples/enabled-fuzzer-example.png)

!!! info "注記"
このポリシーは、[OWASP Juice Shop login form](../../dsl/extensions-examples/overview.md) の脆弱性を見つけるために使用できます。

## 特定のポイントの値で作業を拒否するポリシー

このテストポリシーでは、リクエスト内のすべてのGETパラメータ (`GET_.*`) で作業を許可しますが、`sessionid` GETパラメータ (`GET_sessionid_value`) を除きます。

これは、特定のポイント（例えば、特定のパラメータ値を変更してしまうと、ターゲットアプリケーションの動作が妨げられてしまう可能性がある場合）との作業をFASTに拒否させるような動作を設定するのに便利です。

**ターゲットアプリケーションは、組み込みFAST拡張によって** AUTHとIDORの脆弱性でテストされます。

**このポリシーは以下の特性を持っています**：fuzzerは無効です。

![Example policy](../../../images/fast/operations/en/test-policy/examples/sessionid-example.png)