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

FASTは次のオプションを使用して[脆弱性][gl-vuln]を検出します:

* 組み込みのFASTエクステンション
* [カスタムエクステンション][link-user-extensions]

    !!! info "カスタムエクステンション"
        カスタムエクステンションを使用するには、それらをFASTノードに[接続][link-connect-extensions]してください。

アプリケーションの脆弱性検出方法は次のように制御できます:

* 組み込みのFASTエクステンションを使用してテストを実行したい場合は、テストを実行したい脆弱性のチェックボックスをチェックします。
* 組み込みのFASTエクステンションを除外してカスタムエクステンションのみを使用してテストを実行したい場合は、すべてのチェックボックスのチェックを外すか、**カスタムDSLのみを使用する** スイッチをアクティブにして、リストから脆弱性を選択します。

    ![カスタムDSLスイッチ][img-custom-dsl-slider]

    **カスタムDSLのみを使用する** スイッチがアクティブになっている場合、組み込みのFASTエクステンションと[FASTのfuzzer][doc-fuzzer]は無効になります。FASTのfuzzerが有効になっていると、**カスタムDSLのみを使用する** スイッチは再度非アクティブになります。

!!! info "基本的な脆弱性"
    ポリシーを作成する際には、アプリケーションで検出できる最も典型的な脆弱性がデフォルトで選択されています:

    * [パストラバーサル（PTRAV）][vuln-ptrav]
    * [リモートコード実行（RCE）][vuln-rce]
    * [SQLインジェクション（SQLi）][vuln-sqli]
    * [クロスサイトスクリプティング（XSS）][vuln-xss]
    * [XML外部エンティティへの攻撃に対する脆弱性（XXE）][vuln-xxe]
    
    カスタムポリシーを使用している場合、特定の脆弱性のアプリケーションテストを無効にするには、対応するチェックボックスのチェックをいつでも外すことができます。