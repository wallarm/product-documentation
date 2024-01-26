[doc-fuzzer-internals]:         fuzzer-internals.md
[doc-fuzzer-configuration]:     fuzzer-configuration.md              

[gl-vuln]:                      ../../terms-glossary.md#vulnerability
[gl-anomaly]:                   ../../terms-glossary.md#anomaly

# 異常検知プロセスの設定：概要

[脆弱性][gl-vuln]の検出に加えて、FASTは*fuzzer*を使用して[異常][gl-anomaly]を検出することができます。

このドキュメンテーションセクションでは、以下のポイントについて説明します：

* [Fuzzerの操作原則][doc-fuzzer-internals]
* [ポリシーエディタを使用したFuzzerの設定][doc-fuzzer-configuration]

??? info "異常の例"
    対象アプリケーションの異常な振る舞い、 [OWASP Juice Shop](https://www.owasp.org/www-project-juice-shop/) は [FAST エクステンションの例](../../dsl/extensions-examples/mod-extension.md)で示されています。

    このターゲットアプリケーションは、通常、ログインとパスワードの組み合わせが間違っている認証要求に対して、`403 Unauthorized` コードと `Invalid email or password.` メッセージで応答します。

    しかし、ログイン値の任意の部分に `'` シンボルが渡されると、アプリケーションは `500 Internal Server Error` コードと `...SequelizeDatabaseError: SQLITE_ERROR:...` メッセージで応答します。このような振る舞いは異常です。

    この異常は直接的な脆弱性の悪用にはつながりませんが、攻撃者にアプリケーションのアーキテクチャについての情報を提供し、[SQLインジェクション](../../vuln-list.md#sql-injection)攻撃の実行を促します。