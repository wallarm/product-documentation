[doc-fuzzer-internals]:         fuzzer-internals.md
[doc-fuzzer-configuration]:     fuzzer-configuration.md              

[gl-vuln]:                      ../../terms-glossary.md#vulnerability
[gl-anomaly]:                   ../../terms-glossary.md#anomaly

# 異常検知プロセスの設定: 概要

[脆弱性][gl-vuln]の検出に加えて、FASTは*fuzzer*を使用して[異常][gl-anomaly]を検出できます。

このドキュメントセクションでは、以下の項目について説明します:

* [Fuzzerの動作原理][doc-fuzzer-internals]
* [Policy Editorを使用したFuzzerの設定][doc-fuzzer-configuration]

??? info "異常の例"
    対象アプリケーション[OWASP Juice Shop](https://www.owasp.org/www-project-juice-shop/)の異常な挙動は、[FAST拡張の例](../../dsl/extensions-examples/mod-extension.md)で示しています。

    この対象アプリケーションは、ログイン名とパスワードの誤った組み合わせによる認証リクエストに対して、通常は`403 Unauthorized`コードと`Invalid email or password.`メッセージで応答します。

    しかし、ログイン値の任意の部分に`'`記号を含めて送信すると、アプリケーションは`500 Internal Server Error`コードと`...SequelizeDatabaseError: SQLITE_ERROR:...`メッセージで応答します。このような挙動は異常です。

    この異常はいずれの脆弱性の直接的な悪用にもつながりませんが、攻撃者にアプリケーションアーキテクチャに関する情報を与え、[SQLインジェクション](../../vuln-list.md#sql-injection)攻撃の実行を促します。