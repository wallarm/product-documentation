# 脆弱性検索とフィルタ

**脆弱性**セクションでは、Wallarmは検出された脆弱性の中から検索するための便利な方法を提供しています。

使用できるのは：

* **フィルター**でフィルタリング条件を選択
* **検索フィールド**で人間の言葉に似た属性と修飾子を使って検索クエリを入力

フィルターで設定された値は自動的に検索フィールドに複製され、その逆も同様です。

## フィルター

利用可能なフィルターはWallarmコンソールのフィルターパネルに表示されており、**フィルター**ボタンを使って展開および折りたたむことができます。

![UI内の脆弱性フィルター](../../images/user-guides/search-and-filters/filters-vuln.png)

異なるフィルターの値が選択された時、結果はそれらの条件を全て満たします。同じフィルターに異なる値が指定された時、結果はそれらの条件のいずれかを満たします。

## 検索フィールド

検索フィールドは、人間の言葉に似た属性と修飾子を受け付けるため、クエリを直感的に提出することができます。例えば：

* `rce high`：リスクレベルが高い[RCE](../../attacks-vulns-list.md#remote-code-execution-rce)脆弱性をすべて検索
* `ptrav medium`：リスクレベルが高い[path traversal](../../attacks-vulns-list.md#path-traversal)脆弱性をすべて検索

異なるパラメーターの値が指定された時、結果はそれらの条件を全て満たします。同じパラメーターの異なる値が指定された時、結果はそれらの条件のいずれかを満たします。

!!! info "属性値にNOTを設定する"
    属性値を否定したい場合は、属性または修飾子名の前に`!`を使用してください。例えば：`rce !low`でリスクレベルが低いものを除くすべてのRCE脆弱性を表示。

以下に、検索クエリで使用できる属性と修飾子のリストを示します。

### 脆弱性タイプによる検索

検索文字列に指定：

* `anomaly`：[FAST](../../fast/README.md)によって検出された[異常][al-anomaly]脆弱性を検索。
* `sqli`：[SQLインジェクション][al-sqli]脆弱性を検索。
* `xss`：[クロスサイトスクリプティング][al-xss]脆弱性を検索。
* `rce`：[OSコマンド実行][al-rce]脆弱性を検索。
* `ptrav`：[パストラバーサル][al-path-traversal]脆弱性を検索。
* `crlf`：[CRLFインジェクション][al-crlf]脆弱性を検索。
* `nosqli`：[NoSQLインジェクション][al-nosqli]脆弱性を検索。
* `xxe`：[XML外部エンティティ][al-xxe]脆弱性を検索。
* `ldapi`：[LDAPインジェクション][al-ldapi]脆弱性を検索。
* `ssti`：[サーバーサイドテンプレートインジェクション][ssti-injection]を検索。
* `infoleak`：[情報漏洩][al-infoleak]タイプの脆弱性を検索。
* `vuln_component`：アプリケーションの[コンポーネント][al-vuln-comp]に関連する脆弱性を検索。これらのコンポーネントは時代遅れであるか、セキュリティに影響を与えるエラーを含んでいる可能性があります。
* `redir`：[オープンリダイレクト][al-open-redirect]脆弱性を検索。
* `idor`：[認可の破壊 (BOLA)][al-bola]脆弱性を検索。
* `ssrf`：[サーバーサイドリクエストフォージェリ (SSRF)][al-ssrf]脆弱性を検索。
* `csrf`：[クロスサイトリクエストフォージェリ (CSRF)][al-csrf]脆弱性を検索。
* `weak_auth`：[弱いJWT][al-weak-jwt]脆弱性を検索。

脆弱性名は大文字と小文字の両方で指定できます：`SQLI`、`sqli`、`SQLi`はすべて正しいです。

### リスクレベルによる検索

検索文字列にリスクレベルを指定：

* `low`：リスクレベルが低い。
* `medium`：リスクレベルが中程度。
* `high`：リスクレベルが高い。