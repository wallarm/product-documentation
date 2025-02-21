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

# 脆弱性検索とフィルター

【Vulnerabilities】セクションでは、Wallarmは検出された脆弱性の中から検索するための便利な方法を提供します。

次の方法が利用できます：

* **Filters**でフィルタ条件を選択します
* **Search field**で自然言語に近い属性と修飾子を用いた検索クエリを入力します

フィルターで設定された値は自動的に検索フィールドに複製され、逆もまた同様です。

## フィルター

利用可能なフィルターは、Wallarm Consoleのフィルターパネルに表示されます。このパネルは**Filter**ボタンを使用して展開または折りたたむことができます。

![UIでの脆弱性フィルター](../../images/user-guides/search-and-filters/filters-vuln.png)

異なるフィルターの値が選択された場合、結果はそれらすべての条件を満たします。同じフィルターに対して異なる値が指定された場合、結果はそのいずれかの条件を満たします。

## 検索フィールド

検索フィールドは、属性および修飾子を含む自然言語に近いクエリを受け付けるため、直感的なクエリの送信が可能です。例えば：

* `rce high`: 高リスクレベルの[RCE](../../attacks-vulns-list.md#remote-code-execution-rce)脆弱性をすべて検索します
* `ptrav medium`: 中リスクレベルの[パストラバーサル](../../attacks-vulns-list.md#path-traversal)脆弱性をすべて検索します

異なるパラメーターの値が指定された場合、結果はそれらすべての条件を満たします。同じパラメーターに対して異なる値が指定された場合、結果はそのいずれかの条件を満たします。

!!! info "属性値を否定に設定"
    属性値を否定するには、属性または修飾子名の前に`!`を付けます。例えば、低リスクレベルの[RCE](../../attacks-vulns-list.md#remote-code-execution-rce)脆弱性を除いた全てを表示するには`rce !low`と入力します。

以下に、検索クエリで利用可能な属性および修飾子の一覧を示します。

### 脆弱性タイプで検索

検索文字列に次のように指定します：

<!-- * `anomaly`: [FAST](../../fast/README.md)によって検出された[anomaly][al-anomaly]脆弱性を検索します。 -->
* `sqli`: [SQL injection][al-sqli]脆弱性を検索します。
* `xss`: [クロスサイトスクリプティング][al-xss]脆弱性を検索します。
* `rce`: [OSコマンド実行][al-rce]脆弱性を検索します。
* `ptrav`: [パストラバーサル][al-path-traversal]脆弱性を検索します。
* `crlf`: [CRLF注入][al-crlf]脆弱性を検索します。
* `nosqli`: [NoSQL注入][al-nosqli]脆弱性を検索します。
* `xxe`: [XML外部エンティティ][al-xxe]脆弱性を検索します。
* `ldapi`: [LDAP注入][al-ldapi]脆弱性を検索します。
* `ssti`: [サーバサイドテンプレートインジェクション][ssti-injection]を検索します。
* `infoleak`: [情報漏洩][al-infoleak]型の脆弱性を検索します。
* `vuln_component`: アプリケーションの[コンポーネント][al-vuln-comp]に関連し、古くなっているかセキュリティに影響を及ぼすエラーを含む脆弱性を検索します。
* `redir`: [オープンリダイレクト][al-open-redirect]脆弱性を検索します。
* `idor`: [オブジェクトレベル認可の不備 (BOLA)][al-bola]脆弱性を検索します。
* `ssrf`: [サーバーサイドリクエストフォージェリ (SSRF)][al-ssrf]脆弱性を検索します。
* `csrf`: [クロスサイトリクエストフォージェリ (CSRF)][al-csrf]脆弱性を検索します。
* `weak_auth`: [弱いJWT][al-weak-jwt]脆弱性を検索します。

脆弱性名は大文字と小文字の両方で指定可能です。例えば、`SQLI`、`sqli`、および`SQLi`は同様に正しいです。

### リスクレベルで検索

検索文字列にリスクレベルを指定します：

* `low`: 低リスクレベル
* `medium`: 中リスクレベル
* `high`: 高リスクレベル