[doc-fuzzer-internals]:         fuzzer-internals.md
[doc-fuzzer-configuration]:     fuzzer-configuration.md              

[gl-vuln]:                      ../../terms-glossary.md#vulnerability
[gl-anomaly]:                   ../../terms-glossary.md#anomaly

# 異常検出プロセスの構成：概要

脆弱性の検出に加え、FASTは*fuzzer*を使用して異常の検出が可能です。

本ドキュメントのセクションでは、以下の点について説明します:

* [fuzzerの動作原理][doc-fuzzer-internals]
* [Policy Editorを使用したfuzzerの構成][doc-fuzzer-configuration]

??? info "異常の例"
    対象アプリケーション[OWASP Juice Shop](https://www.owasp.org/www-project-juice-shop/)の異常な動作は[FAST拡張機能の例](../../dsl/extensions-examples/mod-extension.md)で示されています.

    この対象アプリケーションは通常、誤ったログインとパスワードの組み合わせによる認証リクエストに対して`403 Unauthorized`コードと`Invalid email or password.`メッセージで応答します.

    しかし、ログイン値の一部に`'`記号が渡された場合、アプリケーションは`500 Internal Server Error`コードと`...SequelizeDatabaseError: SQLITE_ERROR:...`メッセージで応答します。このような動作は異常です.

    この異常は直接脆弱性の悪用につながるものではありませんが、攻撃者にアプリケーションの構造に関する情報を提供し、[SQL Injection](../../vuln-list.md#sql-injection)攻撃の実行を促します.