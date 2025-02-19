[img-custom-dsl-slider]:    ../../../images/fast/operations/en/test-policy/policy-editor/custom-slider.png

[link-user-extensions]:     ../../dsl/intro.md
[link-connect-extensions]:  ../../dsl/using-extension.md

[doc-fuzzer]:               fuzzer-intro.md

[gl-vuln]:                  ../../terms-glossary.md#vulnerability

[vuln-ptrav]:               ../../vuln-list.md#path-traversal
[vuln-rce]:                 ../../vuln-list.md#remote-code-execution-rce
[vuln-sqli]:                ../../vuln-list.md#sql-injection
[vuln-xss]:                 ../../vuln-list.md#cross-site-scripting-xss
[vuln-xxe]:                 ../../vuln-list.md#attack-on-xml-external-entity-xxe

# 脆弱性検出プロセスの構成

FASTは[脆弱性][gl-vuln]を検出するため、以下のオプションを使用します:

* 組み込みFAST拡張機能
* [カスタム拡張機能][link-user-extensions]

!!! info "カスタム拡張機能"
    カスタム拡張機能を使用するには、FASTノードにそれらを[接続][link-connect-extensions]してください。

アプリケーション内の脆弱性検出手法は、以下の方法で制御できます:

* 組み込みFAST拡張機能を使用してテストを実行したい場合、実行するテスト対象の脆弱性チェックボックスにチェックを入れてください。
* 組み込みFAST拡張機能を除き、カスタム拡張機能のみでテストを実行したい場合、すべてのチェックボックスのチェックを外すか、**Use only custom DSL**スイッチを有効にしてリストから脆弱性を選択してください。

![カスタムDSLスイッチ][img-custom-dsl-slider]

なお、**Use only custom DSL**スイッチが有効の場合、組み込みFAST拡張機能および[FAST fuzzer][doc-fuzzer]は無効化されます。FAST fuzzerが有効の場合、再び**Use only custom DSL**スイッチは無効となります。

!!! info "基本的な脆弱性"
    ポリシー作成時、アプリケーションで検出可能な一般的な脆弱性がデフォルトで選択されます:

    * [パストラバーサル (PTRAV)][vuln-ptrav],
    * [リモートコード実行 (RCE)][vuln-rce],
    * [SQLインジェクション (SQLi)][vuln-sqli],
    * [クロスサイトスクリプティング (XSS)][vuln-xss],
    * [XML外部実体攻撃への脆弱性 (XXE)][vuln-xxe].
    
    カスタムポリシーを使用する場合、任意の時点で対応するチェックボックスのチェックを外すことにより、特定の脆弱性に対するテストを無効にできます。