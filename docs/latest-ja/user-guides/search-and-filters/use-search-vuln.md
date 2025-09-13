[al-sqli]:                ../../attacks-vulns-list.md#sql-injection
[al-xss]:                 ../../attacks-vulns-list.md#crosssite-scripting-xss
[al-rce]:                 ../../attacks-vulns-list.md#remote-code-execution-rce
[al-path-traversal]:      ../../attacks-vulns-list.md#path-traversal
[al-crlf]:                ../../attacks-vulns-list.md#crlf-injection
[al-open-redirect]:       ../../attacks-vulns-list.md#open-redirect
[al-nosqli]:              ../../attacks-vulns-list.md#nosql-injection
[al-xxe]:                 ../../attacks-vulns-list.md#attack-on-xml-external-entity-xxe
[al-ldapi]:               ../../attacks-vulns-list.md#ldap-injection
[al-infoleak]:            ../../attacks-vulns-list.md#information-exposure
[al-vuln-comp]:           ../../attacks-vulns-list.md#vulnerable-component
[al-ssrf]:                ../../attacks-vulns-list.md#serverside-request-forgery-ssrf
[al-csrf]:                ../../attacks-vulns-list.md#cross-site-request-forgery-csrf
[al-vuln-component]:      ../../attacks-vulns-list.md#vulnerable-component
[ssti-injection]:         ../../attacks-vulns-list.md#serverside-template-injection-ssti
[al-weak-jwt]:            ../../attacks-vulns-list.md#weak-jwt
[al-bola]:                ../../attacks-vulns-list.md#broken-object-level-authorization-bola
[al-anomaly]:             ../../fast/vuln-list.md#anomaly

# 脆弱性の検索とフィルター

**Vulnerabilities**セクションでは、Wallarmは検出された脆弱性を検索するための便利な方法を提供します。

次を使用できます:

* **Filters**: 絞り込み条件を選択します。
* **Search field**: 人間の言語に近い属性と修飾子を含む検索クエリを入力します。

Filtersに設定した値はSearch fieldに自動的に反映され、その逆も同様です。

## Filters

利用可能なフィルターはWallarm ConsoleのFilters panelに表示され、**Filter**ボタンで展開および折りたたみできます。

![UIにおける脆弱性フィルター](../../images/user-guides/search-and-filters/filters-vuln.png)

異なるフィルターの値が選択された場合、結果はそれらすべての条件を満たします。同じフィルターに対して異なる値が指定された場合、結果はいずれかの条件を満たします。

## Search field

Search fieldは、人間の言語に近い属性と修飾子を含むクエリを受け付けます。これにより、直感的にクエリを入力できます。例:

* `rce high`: 高いリスクレベルのすべての[RCE](../../attacks-vulns-list.md#remote-code-execution-rce)脆弱性を検索します。
* `ptrav medium`: 高いリスクレベルのすべての[パストラバーサル](../../attacks-vulns-list.md#path-traversal)脆弱性を検索します。

異なるパラメーターの値が指定された場合、結果はそれらすべての条件を満たします。同じパラメーターに対して異なる値が指定された場合、結果はいずれかの条件を満たします。

!!! info "属性値をNOTに設定する"
    属性値を否定するには、属性名または修飾子名の前に`!`を使用します。例: `rce !low`は、低リスクレベルのものを除くすべてのRCE脆弱性を表示します。

以下は検索クエリで使用できる属性と修飾子の一覧です。

### 脆弱性タイプで検索

検索文字列で次を指定します:

<!-- * `anomaly`: to search for [anomaly][al-anomaly] vulnerabilities detected by [FAST](../../fast/README.md). -->
* `sqli`: [SQLインジェクション][al-sqli]の脆弱性を検索します。
* `xss`: [クロスサイトスクリプティング][al-xss]の脆弱性を検索します。
* `rce`: [OSコマンド実行][al-rce]の脆弱性を検索します。
* `ptrav`: [パストラバーサル][al-path-traversal]の脆弱性を検索します。
* `crlf`: [CRLFインジェクション][al-crlf]の脆弱性を検索します。
* `nosqli`: [NoSQLインジェクション][al-nosqli]の脆弱性を検索します。
* `xxe`: [XML外部エンティティ][al-xxe]の脆弱性を検索します。
* `ldapi`: [LDAPインジェクション][al-ldapi]の脆弱性を検索します。
* `ssti`: [サーバーサイドテンプレートインジェクション][ssti-injection]を検索します。
* `infoleak`: [情報露出][al-infoleak]タイプの脆弱性を検索します。
* `vuln_component`: アプリケーションの[コンポーネント][al-vuln-comp]のうち、古いものやセキュリティに影響する不具合を含むものに関連する脆弱性を検索します。
* `redir`: [オープンリダイレクト][al-open-redirect]の脆弱性を検索します。
* `idor`: [オブジェクトレベル認可の破綻(BOLA)][al-bola]の脆弱性を検索します。
* `ssrf`: [サーバーサイドリクエストフォージェリ(SSRF)][al-ssrf]の脆弱性を検索します。
* `csrf`: [クロスサイトリクエストフォージェリ(CSRF)][al-csrf]の脆弱性を検索します。
* `weak_auth`: [脆弱なJWT][al-weak-jwt]の脆弱性を検索します。

脆弱性名は大文字と小文字のどちらでも指定できます。`SQLI`、`sqli`、`SQLi`のいずれも正しい指定です。

### リスクレベルで検索

検索文字列にリスクレベルを指定します:

* `low`: 低リスクレベルです。
* `medium`: 中リスクレベルです。
* `high`: 高リスクレベルです。