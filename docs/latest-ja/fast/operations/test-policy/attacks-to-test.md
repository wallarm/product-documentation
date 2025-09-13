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


#   脆弱性検出プロセスの設定

FASTは、次のオプションを使用して[脆弱性][gl-vuln]を検出します：

* 組み込みのFAST拡張
* [カスタム拡張][link-user-extensions]

    !!! info "カスタム拡張"
        カスタム拡張を使用するには、それらをFASTノードに[接続][link-connect-extensions]してください。

アプリケーションにおける脆弱性の検出方法は、次のように制御できます。

* 組み込みのFAST拡張を使用してテストを実行する場合は、実行したい脆弱性のチェックボックスにチェックを入れます。
* 組み込みのFAST拡張を除外してカスタム拡張のみを使用してテストを実行する場合は、すべてのチェックボックスのチェックを外すか、**Use only custom DSL**スイッチを有効にして、リストから脆弱性を選択します。

    ![custom DSLスイッチ][img-custom-dsl-slider]

    なお、**Use only custom DSL**スイッチを有効にすると、組み込みのFAST拡張と[FAST fuzzer][doc-fuzzer]は無効になります。FAST fuzzerが有効になっている場合は、**Use only custom DSL**スイッチは再び非アクティブになります。

!!! info "基本的な脆弱性"
    ポリシーを作成する際、アプリケーションで検出可能な最も一般的な脆弱性がデフォルトで選択されます：

    * [パストトラバーサル（PTRAV）][vuln-ptrav]、
    * [リモートコード実行（RCE）][vuln-rce]、
    * [SQLインジェクション（SQLi）][vuln-sqli]、
    * [クロスサイトスクリプティング（XSS）][vuln-xss]、
    * [XML外部実体（XXE）への攻撃に対する脆弱性][vuln-xxe]。
    
    カスタムポリシーを使用する場合は、いつでも対応するチェックボックスのチェックを外すことで、特定の脆弱性に対するアプリケーションのテストを無効にできます。