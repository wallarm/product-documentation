#   攻撃および脆弱性の種類

[cwe-20]:   https://cwe.mitre.org/data/definitions/20.html
[cwe-22]:   https://cwe.mitre.org/data/definitions/22.html
[cwe-78]:   https://cwe.mitre.org/data/definitions/78.html
[cwe-79]:   https://cwe.mitre.org/data/definitions/79.html
[cwe-88]:   https://cwe.mitre.org/data/definitions/88.html
[cwe-89]:   https://cwe.mitre.org/data/definitions/89.html
[cwe-90]:   https://cwe.mitre.org/data/definitions/90.html
[cwe-93]:   https://cwe.mitre.org/data/definitions/93.html
[cwe-94]:   https://cwe.mitre.org/data/definitions/94.html
[cwe-113]:  https://cwe.mitre.org/data/definitions/113.html
[cwe-96]:   https://cwe.mitre.org/data/definitions/96.html
[cwe-97]:   https://cwe.mitre.org/data/definitions/97.html
[cwe-150]:  https://cwe.mitre.org/data/definitions/150.html
[cwe-159]:  https://cwe.mitre.org/data/definitions/159.html
[cwe-200]:  https://cwe.mitre.org/data/definitions/200.html
[cwe-209]:  https://cwe.mitre.org/data/definitions/209.html
[cwe-215]:  https://cwe.mitre.org/data/definitions/215.html
[cwe-288]:  https://cwe.mitre.org/data/definitions/288.html
[cwe-307]:  https://cwe.mitre.org/data/definitions/307.html
[cwe-352]:  https://cwe.mitre.org/data/definitions/352.html
[cwe-409]:  https://cwe.mitre.org/data/definitions/409.html
[cwe-425]:  https://cwe.mitre.org/data/definitions/425.html
[cwe-444]:  https://cwe.mitre.org/data/definitions/444.html
[cwe-511]:  https://cwe.mitre.org/data/definitions/511.html
[cwe-521]:  https://cwe.mitre.org/data/definitions/521.html
[cwe-538]:  https://cwe.mitre.org/data/definitions/538.html
[cwe-541]:  https://cwe.mitre.org/data/definitions/541.html
[cwe-548]:  https://cwe.mitre.org/data/definitions/548.html
[CWE-598]:  https://cwe.mitre.org/data/definitions/598.html
[cwe-601]:  https://cwe.mitre.org/data/definitions/601.html
[cwe-611]:  https://cwe.mitre.org/data/definitions/611.html
[cwe-776]:  https://cwe.mitre.org/data/definitions/776.html
[cwe-799]:  https://cwe.mitre.org/data/definitions/799.html
[cwe-639]:  https://cwe.mitre.org/data/definitions/639.html
[cwe-918]:  https://cwe.mitre.org/data/definitions/918.html
[cwe-943]:  https://cwe.mitre.org/data/definitions/943.html
[cwe-1270]: https://cwe.mitre.org/data/definitions/1270.html
[cwe-1294]: https://cwe.mitre.org/data/definitions/1294.html
[cwe-937]:  https://cwe.mitre.org/data/definitions/937.html
[cwe-1035]: https://cwe.mitre.org/data/definitions/1035.html
[cwe-1104]: https://cwe.mitre.org/data/definitions/1104.html

[link-cwe]: https://cwe.mitre.org/

[link-owasp-xxe-cheatsheet]:                https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html
[link-owasp-xss-cheatsheet]:                https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
[link-owasp-idor-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html
[link-owasp-ssrf-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html
[link-owasp-auth-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
[link-owasp-ldapi-cheatsheet]:              https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html
[link-owasp-sqli-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html
[link-owasp-inputval-cheatsheet]:           https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html

[link-ptrav-mitigation]:                    https://owasp.org/www-community/attacks/Path_Traversal
[link-wl-process-time-limit-directive]:     admin-en/configure-parameters-en.md#wallarm_process_time_limit

[doc-vpatch]:   user-guides/rules/vpatch-rule.md

[anchor-brute]: #brute-force-attack
[anchor-rce]:   #remote-code-execution-rce
[anchor-ssrf]:  #serverside-request-forgery-ssrf

[link-imap-wiki]:                                https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol
[link-smtp-wiki]:                                https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol
[ssi-wiki]:     https://en.wikipedia.org/wiki/Server_Side_Includes
[link-owasp-csrf-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html

この記事では、Wallarmが検出できる攻撃や脆弱性を一覧し説明します。これには[OWASP Top 10](https://owasp.org/www-project-top-ten/)や[OWASP API Top 10](https://owasp.org/www-project-api-security/)で提示されているものも含まれます。リスト内のほとんどの脆弱性や攻撃には、ソフトウェアの弱点種別の一覧、すなわち[Common Weakness Enumeration][link-cwe]（CWE）から1つ以上のコードが付与されています。

!!! info "設定は不要です"
    攻撃/脆弱性の説明に特定の設定が記載されていない場合、Wallarmはデフォルトで、あなた側の**いかなる設定も不要で**当該攻撃/脆弱性を検出し、[filtration mode](admin-en/configure-wallarm-mode.md)に従って処理します。

## 攻撃の種類

技術的には、Wallarmが検出できる攻撃は次の2種類に大別されます。

* **入力バリデーション攻撃**: リクエストに送信される特定の記号の組み合わせが特徴です（[SQLインジェクション](#sql-injection)、[クロスサイトスクリプティング](#crosssite-scripting-xss)、[リモートコード実行](#remote-code-execution-rce)、[パストラバーサル](#path-traversal)など）。

    入力バリデーション攻撃を検出するには、リクエストの構文解析、すなわち特定の記号の組み合わせを検出するためのパースが必要です。

    Wallarmは、SVG、JPEG、PNG、GIF、PDFなどのバイナリファイルを含め、リクエストのあらゆる部分にある入力バリデーション攻撃を検出します。

    Wallarmは入力バリデーション攻撃および関連する脆弱性を**自動検出**し、[filtration mode](admin-en/configure-wallarm-mode.md)に従ってアクションを実行します。デフォルト動作は、あなたが作成したカスタム[Rules](user-guides/rules/rules.md)や[Triggers](user-guides/triggers/triggers.md)によって変更される場合があります。

* **振る舞いベースの攻撃**: 特定のリクエスト構文、**および/または** リクエスト数とリクエスト間時間の特定の相関が特徴です（[ブルートフォース](#brute-force-attack)、[フォースドブラウジング](#forced-browsing)、[BOLA](#broken-object-level-authorization-bola)、[API悪用](#suspicious-api-activity)、[クレデンシャルスタッフィング](#credential-stuffing)など）。

    振る舞いベースの攻撃を検出するには、リクエストの構文解析に加え、リクエスト数とリクエスト間時間の相関分析が必要です。

<!-- ??? info "Watch video about how Wallarm protects against OWASP Top 10"
    <div class="video-wrapper">
    <iframe width="1280" height="720" src="https://www.youtube.com/embed/27CBsTQUE-Q" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div> -->

## DDoS攻撃

DDoS（Distributed Denial of Service）攻撃は、複数のソースからのトラフィックでターゲットのウェブサイトやAPIを圧倒して利用不能にしようとするタイプのサイバー攻撃です。

攻撃者がDDoS攻撃を実行するために使える手法は数多く、用いる方法やツールは大きく異なります。サーバーに大量の接続要求を送るなどの低レベルな手法を用いる比較的単純な攻撃もあれば、IPアドレスのスプーフィングやネットワークインフラの脆弱性悪用などの複雑な戦術を用いる高度な攻撃もあります。

[リソースをDDoSから保護する方法に関するガイドを読む](admin-en/configuration-guides/protecting-against-ddos.md)

## サーバーサイド攻撃

### SQLインジェクション

**脆弱性/攻撃**

**CWEコード:** [CWE-89][cwe-89]

**Wallarmコード:** `sqli`

**説明:**

この攻撃に対する脆弱性は、ユーザー入力のフィルタリングが不十分であることが原因で発生します。SQLインジェクション攻撃は、特別に細工したクエリをSQLデータベースに注入して実行します。

SQLインジェクション攻撃により、攻撃者は[SQLクエリ](https://www.wallarm.com/what/structured-query-language-injection-sqli-part-1)に任意のSQLコードを注入できます。これにより機密データの読み取りや改ざん、さらにはDBMS管理者権限の取得につながる可能性があります。

**Wallarmによる保護に加えて:**

Wallarmによる保護措置に加え、次の推奨事項に従うことができます。

* すべてのAPIリクエストパラメータをサニタイズおよびフィルタリングし、悪意のある要素が実行されないようにします。
* [OWASP SQL Injection Prevention Cheat Sheet][link-owasp-sqli-cheatsheet]の推奨事項を適用します。

### NoSQLインジェクション

**脆弱性/攻撃**

**CWEコード:** [CWE-943][cwe-943]

**Wallarmコード:** `nosqli`

**説明:**

この攻撃に対する脆弱性は、ユーザー入力のフィルタリングが不十分であることが原因で発生します。NoSQLインジェクション攻撃は、特別に細工したクエリをNoSQLデータベースに注入して実行します。

**Wallarmによる保護に加えて:**

* すべてのユーザー入力をサニタイズおよびフィルタリングし、入力中の悪意のある要素が実行されないようにします。

### リモートコード実行（RCE）

**脆弱性/攻撃**

**CWEコード:** [CWE-78][cwe-78], [CWE-94][cwe-94] ほか

**Wallarmコード:** `rce`

**説明:**

攻撃者はあなたのAPIへのリクエストに悪意のあるコードを注入でき、サーバー上でそのスクリプトが実行される可能性があります。また、脆弱なアプリケーションが動作しているOS上で特定のコマンドを実行しようとする場合があります。 

RCE攻撃が成功すると、攻撃者は以下を含む広範な行為を実行できる可能性があります。

* 脆弱なデータの機密性、可用性、完全性の侵害
* アプリケーションが稼働するOSやサーバーの乗っ取り
* その他の可能な行為

この脆弱性は、ユーザー入力の検証およびパースが正しくないことが原因で発生します。

**Wallarmによる保護に加えて:**

* すべてのユーザー入力をサニタイズおよびフィルタリングし、入力中の要素が実行されないようにします。

### SSIインジェクション

**攻撃**

**CWEコード:** [CWE-96][cwe-96], [CWE-97][cwe-97]

**Wallarmコード:** `ssi`

**説明:**

[SSI（Server Side Includes）][ssi-wiki]は、Webサーバー上のWebページに1つ以上のファイルの内容を取り込むのに最も有用な、単純なインタプリタ型サーバーサイドスクリプト言語です。ApacheおよびNGINXのWebサーバーでサポートされています。

SSIインジェクションにより、HTMLページに悪意のあるペイロードを注入したり、任意のコードをリモートで実行したりして、アプリケーションを悪用できます。アプリケーションで使用されているSSIを操作する、あるいはユーザー入力フィールドを通じてSSIの利用を強制することで悪用される可能性があります。

**例:**

攻撃者はメッセージ出力を変更してユーザーの行動を変えることができます。SSIインジェクションの例:

```bash
<!--#config errmsg="Access denied, please enter your username and password"-->
```

**Wallarmによる保護に加えて:**

* すべてのユーザー入力をサニタイズおよびフィルタリングし、入力中の悪意のあるペイロードが実行されないようにします。
* [OWASP Input Validation Cheatsheet][link-owasp-inputval-cheatsheet]の推奨事項を適用します。

### サーバーサイドテンプレートインジェクション（SSTI）

**脆弱性/攻撃**

**CWEコード:** [CWE-94][cwe-94], [CWE-159][cwe-159]

**Wallarmコード:** `ssti`

**説明:**

SSTIに対して脆弱なWebサーバー上のユーザー入力フォームに、攻撃者が実行可能なコードを注入すると、そのコードがWebサーバーによってパースおよび実行されます。

攻撃が成功すると、脆弱なWebサーバーが完全に侵害される可能性があり、攻撃者が任意のリクエストを実行したり、サーバーのファイルシステムを探索したり、条件によっては任意のコードをリモートで実行したり（詳細は[RCE攻撃][anchor-rce]を参照）、その他多くの行為が可能になります。   

この脆弱性は、ユーザー入力の検証およびパースが正しくないことに起因します。

**Wallarmによる保護に加えて:**

* すべてのユーザー入力をサニタイズおよびフィルタリングし、入力中の要素が実行されないようにします。

### LDAPインジェクション

**脆弱性/攻撃**

**CWEコード:** [CWE-90][cwe-90]

**Wallarmコード:** `ldapi`

**説明:**

LDAPインジェクションは、攻撃者がLDAPサーバーへのリクエストを改ざんすることでLDAP検索フィルターを変更できる攻撃の総称です。

LDAPインジェクション攻撃が成功すると、LDAPユーザーやホストに関する機密データの読み取りおよび書き込み操作にアクセスできる可能性があります。

この脆弱性は、ユーザー入力の検証およびパースが正しくないことが原因で発生します。

**Wallarmによる保護に加えて:**

Wallarmによる保護措置に加え、次の推奨事項に従うことができます。

* アプリケーションが入力として受け取るすべてのパラメータをサニタイズおよびフィルタリングし、入力中の要素が実行されないようにします。
* [OWASP LDAP Injection Prevention Cheat Sheet][link-owasp-ldapi-cheatsheet]の推奨事項を適用します。

### メールインジェクション

**攻撃**

**CWEコード:** [CWE-20][cwe-20], [CWE-150][cwe-150], [CWE-88][cwe-88]

**Wallarmコード:** `mail_injection`

**説明:**

メールインジェクションは、アプリケーションのお問い合わせフォーム経由で送られ、標準的なメールサーバーの動作を変更することを目的とした悪意のある[IMAP][link-imap-wiki]/[SMTP][link-smtp-wiki]式です。

この攻撃に対する脆弱性は、お問い合わせフォームに入力されたデータの検証が不十分であることが原因で発生します。メールインジェクションにより、メールクライアントの制限をバイパスし、ユーザーデータを盗み、スパム送信が可能になります。

**Wallarmによる保護に加えて:**

* すべてのユーザー入力をサニタイズおよびフィルタリングし、入力中の悪意のあるペイロードが実行されないようにします。
* [OWASP Input Validation Cheatsheet][link-owasp-inputval-cheatsheet]の推奨事項を適用します。

### サーバーサイドリクエストフォージェリ（SSRF）

**脆弱性/攻撃**

**CWEコード:** [CWE-918][cwe-918]

**Wallarmコード:** `ssrf`

**説明:**

SSRF攻撃が成功すると、攻撃者が攻撃対象のWebサーバーになりすましてリクエストを送信できる可能性があります。これにより、使用中のネットワークポートの露呈、内部ネットワークのスキャン、認可のバイパスにつながる恐れがあります。

**Wallarmによる保護に加えて:**

* すべてのリクエストパラメータをサニタイズおよびフィルタリングし、入力中の悪意のある要素が実行されないようにします。
* [OWASP SSRF Prevention Cheat Sheet][link-owasp-ssrf-cheatsheet]の推奨事項を適用します。

### パストラバーサル

**脆弱性/攻撃**

**CWEコード:** [CWE-22][cwe-22]

**Wallarmコード:** `ptrav`

**説明:**

パストラバーサル攻撃により、攻撃者はリクエストパラメータを通じて既存のパスを改ざんし、脆弱なWebアプリケーションやAPIが存在するファイルシステム内の機密データを含むファイルやディレクトリにアクセスできます。

この攻撃に対する脆弱性は、ユーザーがファイルやディレクトリを要求する際のユーザー入力のフィルタリングが不十分であることに起因します。

**Wallarmによる保護に加えて:**

Wallarmによる保護措置に加え、次の推奨事項に従うことができます。

* すべてのリクエストパラメータをサニタイズおよびフィルタリングし、入力中の悪意のある要素が実行されないようにします。
* この種の攻撃を緩和するための追加の推奨事項は[こちら][link-ptrav-mitigation]にあります。

### XML外部実体（XXE）への攻撃

**脆弱性/攻撃**

**CWEコード:** [CWE-611][cwe-611]

**Wallarmコード:** `xxe`

**説明:**

XXE脆弱性により、攻撃者はXMLドキュメントに外部実体を注入し、それがXMLパーサーによって評価され、ターゲットWebサーバー上で実行される可能性があります。

攻撃が成功すると、攻撃者は次のことが可能になります。

* 機密データへのアクセス
* 内部データネットワークのスキャン
* Webサーバー上のファイルの読み取り
* [SSRF][anchor-ssrf]攻撃の実行
* DoS（サービス拒否）攻撃の実行

この脆弱性は、アプリケーションにおけるXML外部実体のパースに制限がないことが原因で発生します。

**Wallarmによる保護に加えて:**

* ユーザーから提供されたXMLドキュメントを扱う際は、XML外部実体のパースを無効化します。
* [OWASP XXE Prevention Cheat Sheet][link-owasp-xxe-cheatsheet]の推奨事項を適用します。

### リソーススキャン

**攻撃**

**CWEコード:** なし

**Wallarmコード:** `scanner`

**説明:**    

このHTTPリクエストが保護対象リソースを攻撃またはスキャンすることを目的としたサードパーティ製スキャナーの活動の一部であると判断される場合、`scanner`コードが付与されます。Wallarm Scannerによるリクエストはリソーススキャン攻撃とは見なされません。この情報は後にこれらのサービスへの攻撃に利用される可能性があります。

**Wallarmによる保護に加えて:**

* IPアドレスのallowlisting/denylistingと認証/認可機構を併用し、ネットワーク境界のスキャン可能性を制限します。
* ネットワーク境界をファイアウォールの背後に配置し、スキャン対象面を最小化します。
* サービスの運用に必要十分なポートのみを開放します。
* ネットワークレベルでICMPプロトコルの使用を制限します。
* ITインフラのハード・ソフトウェアを定期的に更新します。

## クライアントサイド攻撃

### クロスサイトスクリプティング（XSS）

**脆弱性/攻撃**

**CWEコード:** [CWE-79][cwe-79]

**Wallarmコード:** `xss`

**説明:**

クロスサイトスクリプティング攻撃により、攻撃者はユーザーのブラウザ内で準備した任意コードを実行できます。

XSS攻撃にはいくつかのタイプがあります。

* 永続型（Stored）XSS: 悪意のあるコードがWebアプリケーションのページにあらかじめ埋め込まれている場合。

    Webアプリケーションが永続型XSSに脆弱な場合、攻撃者は悪意のあるコードをWebアプリケーションのHTMLページに注入でき、このコードは感染したページを要求した任意のユーザーのブラウザで永続的に実行されます。
    
* 反射型（Reflected）XSS: 攻撃者が特別に細工したリンクをユーザーに開かせる場合。      

* DOMベースXSS: Webアプリケーションのページに組み込まれたJavaScriptコード断片に欠陥があり、入力をパースしてJavaScriptコマンドとして実行してしまう場合。

上記のいずれかの脆弱性を悪用すると、任意のJavaScriptコードが実行されます。XSS攻撃が成功すると、攻撃者はユーザーのセッションや認証情報を盗み、ユーザーになりすましてリクエストを送信するなどの悪意ある行為が可能になります。

この種の脆弱性は、ユーザー入力の検証およびパースが正しくないことに起因します。

**Wallarmによる保護に加えて:**

* アプリケーションが入力として受け取るすべてのパラメータをサニタイズおよびフィルタリングし、入力中の要素が実行されないようにします。
* Webアプリケーションのページを生成する際は、動的に生成される全ての要素をサニタイズしエスケープします。
* [OWASP XSS Prevention Cheat Sheet][link-owasp-xss-cheatsheet]の推奨事項を適用します。

### オープンリダイレクト

**脆弱性/攻撃**

**CWEコード:** [CWE-601][cwe-601]

**Wallarmコード:** `redir`

**説明:**

攻撃者は、正規のWebアプリケーションを介してユーザーを悪意のあるWebページにリダイレクトするためにオープンリダイレクト攻撃を利用できます。

この攻撃に対する脆弱性は、URL入力のフィルタリングが正しくないことが原因で発生します。

**Wallarmによる保護に加えて:**

* アプリケーションが入力として受け取るすべてのパラメータをサニタイズおよびフィルタリングし、入力中の要素が実行されないようにします。
* すべての保留中のリダイレクトについてユーザーに通知し、明示的な許可を求めます。

### CRLFインジェクション

**脆弱性/攻撃**

**CWEコード:** [CWE-93][cwe-93]

**Wallarmコード:** `crlf`

**説明:**

CRLFインジェクションは、攻撃者がサーバー（例: HTTPリクエスト）へのリクエストにキャリッジリターン（CR）とラインフィード（LF）の文字を注入できる攻撃の総称です。

他の要因と組み合わせることで、こうしたCR/LF文字の注入はさまざまな脆弱性の悪用に寄与します（例: HTTP Response Splitting [CWE-113][cwe-113]、HTTP Response Smuggling [CWE-444][cwe-444]）。

CRLFインジェクション攻撃が成功すると、ファイアウォールのバイパス、キャッシュポイズニング、正規のWebページの置換、オープンリダイレクト攻撃の実行など、多数の行為が可能になります。 

この脆弱性は、ユーザー入力の検証およびパースが正しくないことが原因で発生します。

**Wallarmによる保護に加えて:**

* すべてのユーザー入力をサニタイズおよびフィルタリングし、入力中の要素が実行されないようにします。

## 列挙攻撃

列挙攻撃は、攻撃者がさまざまな入力を体系的に試し応答を観察することで、ターゲットのシステム、ネットワーク、またはアプリケーションに関する有効な情報を収集しようとするタイプのサイバー攻撃です。目的は、システム内に存在する有効なユーザー名、メールアドレス、アカウント名、リソース、サービスなどを特定することです。

### 汎用列挙攻撃

**攻撃**

**Wallarmコード:** `Enum`

**説明:**

アプリケーションの通常は露出していないあらゆるデータ（ユーザーアカウント、名前、メール、トークン、クレデンシャルの組、システム構成、サービス、各種パラメータ）の列挙を試みる行為です。

**必要な設定:**

Wallarmは、1つ以上の[列挙対策コントロール](api-protection/enumeration-attack-protection.md)（Advanced API Securityの[サブスクリプション](about-wallarm/subscription-plans.md#core-subscription-plans)が必要）を有効にしている場合にのみ、汎用列挙攻撃を検出および緩和します。

[デフォルトのコントロール](api-protection/enumeration-attack-protection.md#generic-enumeration)は監視モード（新規クライアント）で提供されるか、無効です（必要に応じて有効化してください）。

**Wallarmによる保護に加えて:**

* 一定期間あたりのAPIまたは特定エンドポイントへのリクエスト数を制限します。
* 一定期間あたりのAPIまたは特定エンドポイントへの認証/認可試行回数を制限します。
* 一定回数の失敗後は新たな認証/認可試行をブロックします。
* アプリケーションが稼働するサーバー上のファイルやディレクトリへのアクセスは、アプリケーションのスコープ内に限定します。

### ブルートフォース攻撃

**攻撃**

**CWEコード:** [CWE-307][cwe-307], [CWE-521][cwe-521], [CWE-799][cwe-799]

**Wallarmコード:** `brute`（**Attacks**内）、`Brute force`（**API Sessions**内）

**説明:**

定義済みのペイロードを含む大量のリクエストがサーバーに送られるとブルートフォース攻撃が発生します。ペイロードは何らかの方法で生成されるか、辞書から取得されます。サーバーの応答を分析し、ペイロード内データの正しい組み合わせを見つけます。

ブルートフォース攻撃が成功すると、認証・認可機構のバイパスや、隠しリソース（ディレクトリ、ファイル、サイトの一部など）の露呈につながり、その後の悪意のある行為が可能になる恐れがあります。

**必要な設定:**

Wallarmは以下のいずれかが有効な場合にのみ、ブルートフォース攻撃を検出・緩和します。 

* [列挙に対する汎用保護](#generic-enumeration-attack)
* サブスクリプションプランで利用可能な方法で構成された[ブルートフォース保護](admin-en/configuration-guides/protecting-against-bruteforce.md)
* [Rate limit rules](user-guides/rules/rate-limiting.md)

[デフォルトのコントロール](api-protection/enumeration-attack-protection.md#default-protection)は監視モード（新規クライアント）で提供されるか、無効です（必要に応じて有効化してください）。

**Wallarmによる保護に加えて:**

* 一定期間あたりのAPIまたは特定エンドポイントへのリクエスト数を制限します。
* 一定期間あたりのAPIまたは特定エンドポイントへの認証/認可試行回数を制限します。
* 一定回数の失敗後は新たな認証/認可試行をブロックします。
* アプリケーションが稼働するサーバー上のファイルやディレクトリへのアクセスは、アプリケーションのスコープ内に限定します。

### Broken object level authorization（BOLA）

**脆弱性/攻撃**

**CWEコード:** [CWE-639][cwe-639]

**Wallarmコード:** 脆弱性は`idor`、`bola`（**Attacks**内）、`BOLA`（**API Sessions**内）

**説明:**

攻撃者は、リクエスト内で送信されるオブジェクトIDを改ざんすることで、BOLAに脆弱なAPIエンドポイントを悪用できます。これにより、機密データへの不正アクセスにつながる可能性があります。

この問題はAPIベースのアプリケーションで非常に一般的です。サーバー側コンポーネントは通常クライアントの状態を完全には追跡せず、アクセス対象のオブジェクトを決定する際にクライアントから送られるパラメータ（オブジェクトIDなど）により強く依存するためです。

APIエンドポイントのロジックに応じて、攻撃者はWebアプリケーション、API、ユーザーのデータを読み取るだけでなく、変更することもできます。

この脆弱性はIDOR（Insecure Direct Object Reference）とも呼ばれます。

[脆弱性の詳細はこちら](https://owasp.org/API-Security/editions/2023/en/0xa3-broken-object-property-level-authorization/)

**必要な設定:**

Wallarmはこのタイプの脆弱性を自動的に発見しますが、BOLA攻撃の検出・緩和は以下のいずれかが有効な場合にのみ行います。

* [列挙に対する汎用保護](#generic-enumeration-attack)
* サブスクリプションプランで利用可能な方法で構成された[BOLA protection](admin-en/configuration-guides/protecting-against-bola-trigger.md)
* [API Discovery](api-discovery/overview.md)が発見したエンドポイントに対する[Automatic BOLA protection](admin-en/configuration-guides/protecting-against-bola.md)

[デフォルトのコントロール](api-protection/enumeration-attack-protection.md#default-protection)は監視モード（新規クライアント）で提供されるか、無効です（必要に応じて有効化してください）。

### フォースドブラウジング

**攻撃**

**CWEコード:** [CWE-425][cwe-425]

**Wallarmコード:** `dirbust`（**Attacks**内）、`Forced browsing`（**API Sessions**内）

**説明:**

この攻撃の目的は隠しリソース、すなわちディレクトリやファイルを検出することです。テンプレートに基づき生成された、または辞書から抽出された様々なファイル名やディレクトリ名を試行することで達成されます。

フォースドブラウジング攻撃が成功すると、アプリケーションのインターフェースからは明示的に利用できないが直接アクセスすると露出する隠しリソースへのアクセスが可能になる恐れがあります。

**必要な設定:**

Wallarmは、サブスクリプションプランで利用可能な方法で構成された[forced browsing protection](admin-en/configuration-guides/protecting-against-forcedbrowsing.md)が有効な場合にのみ、フォースドブラウジングを検出および緩和します。

[デフォルトのコントロール](api-protection/enumeration-attack-protection.md#forced-browsing)は監視モード（新規クライアント）で提供されるか、無効です（必要に応じて有効化してください）。

**Wallarmによる保護に加えて:**

* 本来アクセス権のないリソースへのユーザーのアクセスを制限または禁止します（例: 認証や認可の仕組みを導入）。
* 一定期間あたりのAPIまたは特定エンドポイントへのリクエスト数を制限します。
* 一定期間あたりのAPIまたは特定エンドポイントへの認証/認可試行回数を制限します。
* 一定回数の失敗後は新たな認証/認可試行をブロックします。
* ファイルやディレクトリに必要十分なアクセス権を設定します。

## アクセスレベル 

**Wallarmによる保護に加えて:**

* ユーザーポリシーと階層に基づく適切な認可メカニズムを実装します。
* オブジェクトIDには[GUID](https://en.wikipedia.org/wiki/Universally_unique_identifier)のようなランダムで予測不能な値を使用することを推奨します。
* 認可メカニズムを評価するテストを書きます。テストを破壊する脆弱な変更はデプロイしないでください。

### マスアサインメント

**攻撃**

**Wallarmコード:** `mass_assignment`

**説明:**

マスアサインメント攻撃では、攻撃者がHTTPリクエストパラメータをプログラムコードの変数やオブジェクトにバインドしようとします。APIに脆弱性がありバインドを許している場合、公開を意図していない機密オブジェクトのプロパティが変更され、権限昇格、セキュリティ機構の回避などにつながる可能性があります。

マスアサインメントに脆弱なAPIは、適切なフィルタリングなしにクライアント入力を内部の変数やオブジェクトプロパティに変換することを許します。この脆弱性は、[OWASP API Security Top 10 2023（API3:2023 Broken Object Property Level Authorization）](https://owasp.org/API-Security/editions/2023/en/0xa3-broken-object-property-level-authorization/)に含まれています。

**Wallarmによる保護に加えて:**

* クライアント入力をコードの変数やオブジェクトのプロパティに自動的にバインドする関数の使用は避けます。
* クライアントによって更新されるべきプロパティのみをホワイトリスト化し、プライベートプロパティをブラックリスト化するために、組み込み関数の機能を使用します。
* 適用可能な場合、入力データペイロードのスキーマを明示的に定義し、強制します。

## API悪用

### 兆候のあるAPIアクティビティ

**攻撃**

**Wallarmコード:** `api_abuse`

**説明:**

サーバーの応答時間の増加、偽アカウント作成、スカルピングを含む基本的なボットタイプのセットです。

**必要な設定:**

Wallarmは、[API Abuse Prevention](api-abuse-prevention/overview.md)モジュールが有効化され適切に構成されている場合にのみ、API悪用攻撃を検出・緩和します。

**API Abuse Prevention**モジュールは複合的なボット検出モデルを使用して、次のボットタイプを検出します。

* サーバー応答時間の増加またはサーバーの不利用性を狙ったAPI悪用。通常、悪意のあるトラフィックスパイクによって発生します。
* [Fake account creation](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-019_Account_Creation)や[Spamming](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-017_Spamming): 偽アカウントの作成や偽コンテンツ（例: 口コミ）の承認。通常はサービスの停止には至りませんが、以下のように通常の業務プロセスを遅延・劣化させます。

    * サポートチームによる実ユーザーからの問い合わせの処理
    * マーケティングチームによる実ユーザー統計の収集

* [Scalping](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-005_Scalping): ボットがオンラインストアの商品を実ユーザーが利用できないようにする行為が特徴です。例えば、全商品を予約して在庫切れにし、利益は発生させないといった手口です。

メトリクスがボット攻撃の兆候を示す場合、モジュールは異常トラフィックの送信元を1時間[denylistまたはgraylist](api-abuse-prevention/setup.md#creating-profiles)します。

**Wallarmによる保護に加えて:**

* [OWASPの自動化された脅威の説明](https://owasp.org/www-project-automated-threats-to-web-applications/)に目を通してください。
* アプリケーションと無関係と判断できる地域やソース（Torなど）のIPアドレスをdenylistします。
* サーバー側のリクエストレート制限を構成します。
* 追加のCAPTCHAソリューションを使用します。
* アプリケーション分析からボット攻撃の兆候を探します。

### アカウント乗っ取り

**攻撃**

**Wallarmコード:** `account_takeover`（4.10.6以前は`api_abuse`）

**説明:**

攻撃者が他人の許可や認識なしにその人のアカウントへアクセスを獲得するサイバー攻撃です。いったんアクセスを得ると、機密情報の窃取、不正取引の実行、スパムやマルウェアの拡散など、さまざまな目的にアカウントを悪用できます。

**必要な設定:**

Wallarmは、[API Abuse Prevention](api-abuse-prevention/overview.md)モジュールが有効化され適切に構成されている場合にのみ、アカウント乗っ取り攻撃を検出・緩和します。

共通の[検出器](api-abuse-prevention/overview.md#how-api-abuse-prevention-works)に加えて、API Abuse Preventionにはさまざまなタイプのアカウント乗っ取り攻撃を特定するための専用検出器が含まれます。 

* **IP rotation**: IPアドレスプールを使用するアカウント乗っ取り攻撃。
* **Session rotation**: セッションプールを使用するアカウント乗っ取り攻撃。
* **Persistent ATO**: 長期間にわたり徐々に発生するアカウント乗っ取り攻撃。
* **Credential stuffing**: 異なるクレデンシャルでの繰り返しログイン試行を、安定したリクエスト属性を維持しながら行うアカウント乗っ取り攻撃（[credential stuffing](#credential-stuffing)）。
* **Low-frequency credential stuffing**: セッションやクライアントごとのログイン試行回数を意図的に制限して検知回避を図る、孤立または最小限の認証試行（[credential stuffing](#credential-stuffing)）に特徴づけられ、その後のAPIインタラクションを伴わないアカウント乗っ取り攻撃。しばしば盗難・合成・自動生成されたクレデンシャルを使用し、複数のIPアドレス、セッション、時間枠に分散させます。

API Abuse Preventionは、通常は認証/登録関連のクリティカルなエンドポイントに対するブルートフォースとして実行される[credential cracking](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-007_Credential_Cracking.html)を行うボットを検出します。許容される振る舞いメトリクスの自動しきい値は、直近1時間の正当なトラフィックに基づいて計算されます。

**Wallarmによる保護に加えて:**

* [OWASPの自動化された脅威の説明](https://owasp.org/www-project-automated-threats-to-web-applications/)に目を通してください。
* 強力なパスワードを使用します。
* 複数のリソースで同じパスワードを使用しないでください。
* 二要素認証を有効にします。
* 追加のCAPTCHAソリューションを使用します。
* アカウントの不審な活動を監視します。

### セキュリティクローラー

**攻撃**

**Wallarmコード:** `security_crawlers`（4.10.6以前は`api_abuse`）

**説明:**

セキュリティクローラーはウェブサイトやAPIをスキャンし脆弱性やセキュリティ問題を検出するために設計されていますが、悪意のある目的に使用されることもあります。攻撃者が脆弱なAPIを特定し、それを悪用して利益を得るために用いる場合があります。

さらに、一部のセキュリティクローラーは設計が不十分で、サーバーを過負荷にしてクラッシュさせるなど、ウェブサイトに意図せず害を与える可能性があります。

**必要な設定:**

Wallarmは、[API Abuse Prevention](api-abuse-prevention/overview.md)モジュールが有効化され適切に構成されている場合にのみ、セキュリティクローラーの攻撃を検出・緩和します。

**API Abuse Prevention**モジュールは複合的なボット検出モデルを使用して、次のセキュリティクローラーのボットタイプを検出します。

* [Fingerprinting](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-004_Fingerprinting.html): APIのプロファイリングのために、情報を引き出す特定のリクエストを悪用します。
* [Footprinting](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-018_Footprinting.html): APIの構成、設定、セキュリティ機構について可能な限り学習することを目的とした情報収集です。
* [Vulnerability scanning](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-014_Vulnerability_Scanning): サービスの脆弱性を探索する行為です。

**Wallarmによる保護に加えて:**

* [OWASPの自動化された脅威の説明](https://owasp.org/www-project-automated-threats-to-web-applications/)に目を通してください。
* SSL証明書を使用します。
* 追加のCAPTCHAソリューションを使用します。
* レート制限を実装します。
* 悪意のある活動を示すパターンがないか、トラフィックを監視します。
* 検索エンジンクローラーにクロール可能/不可のページを伝えるためrobots.txtを使用します。
* ソフトウェアを定期的に更新します。
* CDN（コンテンツ配信ネットワーク）を使用します。

### スクレイピング

**攻撃**

**Wallarmコード:** `scraping`（4.10.6以前は`api_abuse`）

**説明:**

スクレイピング（データスクレイピング、ウェブハーベスティングとも）は、ウェブサイトやAPIからデータを自動的に抽出するプロセスです。ソフトウェアやコードを用いてウェブページやAPIからデータを取得・抽出し、スプレッドシートやデータベースなどの構造化形式で保存します。

スクレイピングは悪意のある目的に使用されることがあります。例えば、スクレイパーはAPIからログイン情報、個人情報、金融データなどの機密情報を盗むために使われる可能性があります。また、スパムや性能を劣化させるような方法でデータを大量取得し、DoS（サービス拒否）攻撃を引き起こすこともあります。

**必要な設定:**

Wallarmは、[API Abuse Prevention](api-abuse-prevention/overview.md)モジュールが有効化され適切に構成されている場合にのみ、スクレイピング攻撃を検出・緩和します。

**API Abuse Prevention**モジュールは複合的なボット検出モデルを使用して、[scraping](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-011_Scraping)ボットタイプを検出します。これは、アプリケーションからアクセス可能なデータや処理済み出力を収集し、非公開または有償コンテンツが任意のユーザーに利用可能になってしまう可能性があります。

**Wallarmによる保護に加えて:**

* [OWASPの自動化された脅威の説明](https://owasp.org/www-project-automated-threats-to-web-applications/)に目を通してください。
* 追加のCAPTCHAソリューションを使用します。
* 検索エンジンクローラーにクロール可能/不可のページを伝えるためrobots.txtを使用します。
* 悪意のある活動を示すパターンがないか、トラフィックを監視します。
* レート制限を実装します。
* データを難読化または暗号化します。
* 必要に応じて法的措置を取ります。

### 無制限なリソース消費

**攻撃**

**Wallarmコード:** `resource_consumption`

**説明:**

適切な制限なしに、自動化されたクライアントがAPIまたはアプリケーションのリソースを過剰に消費するタイプの悪用行為です。これは、大量の非悪意なリクエスト送信、計算・メモリ・帯域の枯渇、正当なユーザーに対するサービス品質の低下を含みます。

適切な制限が欠如している事例:

* **レスポンスタイミング**（**Response time anomaly**[ボット検出器](api-abuse-prevention/overview.md#how-api-abuse-prevention-works)）: バックエンドの悪用試行や自動化された悪用を示す可能性のあるAPI応答レイテンシの異常パターン。ベースラインと比較して、リクエストが一貫して異常に高い、または不規則に変動する応答時間を生成します。ボットによる計算コストの高いクエリ、システム挙動を測定するための意図的な遅延、レート制限を下回るように試みる低速攻撃技術が原因となる場合があります。
* **リクエストサイズ**（**Excessive request consumption**[ボット検出器](api-abuse-prevention/overview.md#how-api-abuse-prevention-works)）: APIに対する異常に大きなリクエストペイロードで、バックエンドの処理リソースの悪用や誤用を示す可能性があります。過剰なJSON本文、ファイルアップロード、深くネストされた構造など、パース・バリデーション・ストレージ能力の枯渇を狙う振る舞いを含みます。攻撃者はこれらのペイロードを用いてバックエンドに負荷をかけ、レート制限をバイパスしたり、システムの境界を探索したりすることがよくあります。
* **レスポンスサイズ**（**Excessive response consumption**[ボット検出器](api-abuse-prevention/overview.md#how-api-abuse-prevention-works)）: セッション期間中に転送されたレスポンスデータの総量が不審であること。セッション全体の集計レスポンスサイズにより、スロードリップや分散型のスクレイピング攻撃を特定します。個々のリクエストごとには無害に見えても、時間の経過とともに大量のデータ流出につながることがあります。

**必要な設定:**

!!! tip ""
    [NGINX Node](installation/nginx-native-node-internals.md#nginx-node) 6.3.0以降が必要で、現時点では[Native Node](installation/nginx-native-node-internals.md#native-node)では未サポートです。

Wallarmは、[API Abuse Prevention](api-abuse-prevention/overview.md)モジュールが有効化され適切に構成されている場合にのみ、無制限なリソース消費攻撃を検出・緩和します。

このボット攻撃タイプの検出を高精度にするため、[API Sessions](api-sessions/overview.md)を適切に[構成](api-sessions/setup.md)する必要があります。

## GraphQL攻撃

**攻撃**

**Wallarmコード:** `graphql_attacks`

**説明:**

GraphQLには、過剰な情報露出やDoSに関連するプロトコル固有の攻撃を実装可能にする特性があります。詳細はサブセクションを参照してください。

これらの脅威を防ぐための適切な対策は、リクエストおよび値のサイズ、クエリ深度、バッチ化クエリの許可数など、GraphQLリクエストの制限を設定することです。Wallarmでは、これらの制限を[GraphQL policy](api-protection/graphql-rule.md)で設定します。制限を超えるGraphQLリクエストはGraphQL攻撃と見なされます。

**必要な設定:**

Wallarmは、1つ以上の[Detect GraphQL attacksの緩和コントロールまたはルール](api-protection/graphql-rule.md)（node 4.10.3以降が必要）が構成されている場合にのみ、GraphQL攻撃を検出・緩和します。

[デフォルトのコントロール](api-protection/graphql-rule.md#default-protection)は監視モード（新規クライアント）で提供されるか、無効です（必要に応じて有効化してください）。

**Wallarmによる保護に加えて:**

* 機密または制限付きGraphQL APIへのアクセスには認証を必須にします。
* 入出力をサニタイズし、インジェクション攻撃や悪意のある入力値から保護します。
* GraphQLクエリ活動（リクエスト詳細やレスポンスデータを含む）を追跡・分析する包括的なログ機構を実装します。
* 制限された権限とアクセス制御を備えた安全な実行環境でGraphQLサーバーを運用します。

### GraphQLクエリサイズ

**Wallarmコード:** `gql_doc_size`: 許可される合計クエリサイズの最大値違反

**説明:** 

攻撃者は、過度に大きな入力をサーバーが処理する方法を悪用して、GraphQLエンドポイントに対するDoS（サービス拒否）やその他の問題を引き起こす可能性があります。

### GraphQL値サイズ

**Wallarmコード:** `gql_value_size`: 許可される値サイズの最大値違反

**説明:**

攻撃者は、変数や引数に対して極端に長い文字列値を持つGraphQLリクエストを送信し、サーバーのリソースを圧迫する可能性があります（Excessive Value Length攻撃）。

### GraphQLクエリ深度

**Wallarmコード:** `gql_depth`: 許可されるクエリ深度の最大値違反

**説明:** 

GraphQLクエリはネスト可能で、複雑なデータ構造を一度に要求できます。しかし、この柔軟性は悪用され、深くネストされたクエリを作成してサーバーを過負荷にする可能性があります。

### GraphQLエイリアス

**Wallarmコード:** `gql_aliases`: 許可されるエイリアス数の最大値違反

**説明:** 

GraphQLのエイリアスは、フィールドの結果名を変更して衝突を避け、データ整理を改善する機能です。しかし、攻撃者がこの機能を悪用して、リソース消費やDoS（サービス拒否）攻撃を仕掛ける可能性があります。

### GraphQLバッチング

**Wallarmコード:** `gql_docs_per_batch`: 許可されるバッチ化クエリ数の最大値違反

**説明:** 

GraphQLでは複数のクエリ（オペレーション）を1つのHTTPリクエストにバッチ化できます。複数のオペレーションを1つのリクエストにまとめることで、攻撃者がバッチング攻撃を組織し、レート制限などのセキュリティ対策を回避しようとする可能性があります。

### GraphQLイントロスペクション

**Wallarmコード:** `gql_introspection`: 禁止されたイントロスペクションクエリ

**説明:** 

攻撃者はGraphQLのイントロスペクション機構を利用して、GraphQL APIのスキーマに関する詳細を明らかにする可能性があります。システムにクエリを送ることで、APIで利用可能な型、クエリ、ミューテーション、フィールドの全貌を把握し、より精緻で破壊的なクエリ構築にこの情報を用いる可能性があります。

### GraphQLデバッグ

**Wallarmコード:** `gql_debug`: 禁止されたデバッグモードクエリ

**説明:**

GraphQLで開発者がデバッグモードを有効のままにしている場合、攻撃者は過剰なエラーメッセージ（スタックトレースやトレースバック全体など）から重要な情報を収集できる可能性があります。攻撃者はURIの“debug=1“パラメータ経由でデバッグモードにアクセスできる場合があります。

## API仕様

**攻撃**

**Wallarmコード:** `api_specification`は、仕様ベースのすべての違反を示します。個別の違反はサブセクションで説明します。

**説明:**

[API Specification Enforcement](api-specification-enforcement/overview.md)は、アップロードした仕様に基づきAPIにセキュリティポリシーを適用するよう設計されています。主な機能は、仕様に記載されたエンドポイントの説明と、実際にREST APIに送られるリクエストとの不一致を検出することです。不一致が特定された場合、あらかじめ定義されたアクションを実行できます。

API Specification Enforcementには、仕様との比較に関する処理上限が適用されます。この上限を超えるとリクエストの処理を停止し、その旨を知らせるイベントを作成します。詳細は[processing overlimit](#processing-overlimit)を参照してください。

### 未定義エンドポイント

**Wallarmコード:** `undefined_endpoint`

**説明:**

仕様に存在しないエンドポイントへのリクエスト試行です。

### 未定義パラメータ

**Wallarmコード:** `undefined_parameter`

**説明:**

仕様の当該エンドポイントに存在しないパラメータを含むため、攻撃としてマークされたリクエストです。

### 無効なパラメータ

**Wallarmコード:** `invalid_parameter_value`

**説明:**

仕様で定義された型/フォーマットにパラメータ値が一致しないため、攻撃としてマークされたリクエストです。

### 必須パラメータの欠如

**Wallarmコード:** `missing_parameter`

**説明:**

仕様で必須とマークされているパラメータまたはその値を含まないため、攻撃としてマークされたリクエストです。

### 認証の欠如

**Wallarmコード:** `missing_auth`

**説明:**

必要な認証方法に関する情報を含まないため、攻撃としてマークされたリクエストです。

### 無効なリクエスト

**Wallarmコード:** `invalid_request`

**説明:**

無効なJSONを含むため、攻撃としてマークされたリクエストです。

## データ処理

### データボム

**攻撃**

**CWEコード:** [CWE-409][cwe-409], [CWE-776][cwe-776]

**Wallarmコード:** `data_bomb`

**説明:**

リクエストにZipボムまたはXMLボムが含まれる場合、Wallarmは当該リクエストをデータボム攻撃としてマークします。

* [Zipボム](https://en.wikipedia.org/wiki/Zip_bomb)は、読み取り側のプログラムやシステムをクラッシュさせる、あるいは役に立たない状態にするよう設計された悪意あるアーカイブファイルです。Zipボムはプログラム自体は正常動作させつつ、展開に過大な時間・ディスク容量・メモリを要するように作られています。
* [XMLボム（billion laughs攻撃）](https://en.wikipedia.org/wiki/Billion_laughs_attack)は、XMLドキュメントのパーサーを狙うDoS攻撃の一種です。攻撃者はXML実体に悪意のあるペイロードを送信します。

    例えば、`entityOne`を20個の`entityTwo`として定義し、`entityTwo`を20個の`entityThree`として定義し……というパターンを`entityEight`まで継続すると、XMLパーサーは単一の`entityOne`を展開するだけで1,280,000,000個の`entityEight`になり、5GBのメモリを消費します。

**Wallarmによる保護に加えて:**

* 受信リクエストのサイズを制限し、システムに害を与えないようにします。

### 無効なXML

**攻撃**

**Wallarmコード:** `invalid_xml`

**説明:**  

リクエスト本文にXMLドキュメントが含まれ、そのドキュメントのエンコーディングがXMLヘッダーに記載されたエンコーディングと一致しない場合、`invalid_xml`としてマークされます。

### Processing overlimit

**攻撃**

**Wallarmコード:** `processing_overlimit`

**説明:**

[API Specification Enforcement](#api-specification)がリクエストを処理する際に適用される上限に違反した場合、**Specification processing overlimit**イベントが攻撃一覧に追加されます。

### Resource overlimit

**攻撃**

**Wallarmコード:** `overlimit_res`

**説明:**

Wallarmノードは、受信リクエストの処理に費やす時間を最大`N`ミリ秒に制限するよう構成されています（デフォルト値: `1000`）。指定時間内にリクエストが処理されない場合、そのリクエストの処理は停止され、`overlimit_res`攻撃としてマークされます。 

カスタムの時間制限を指定し、制限超過時のデフォルト動作を変更するには、[**Limit request processing time**](user-guides/rules/configure-overlimit-res-detection.md)ルールを使用します。

リクエスト処理時間の制限は、Wallarmノードを狙うバイパス攻撃の防止に役立ちます。場合によっては、`overlimit_res`としてマークされたリクエストは、Wallarmノードモジュールに割り当てられたリソースが不十分で、リクエスト処理時間が長くなっていることを示す場合があります。

## Blocked source

**攻撃**

**Wallarmコード:** `blocked_source`

**説明:**

**手動で**[denylist登録](user-guides/ip-lists/overview.md)されたIPからの攻撃です。

## Virtual patch

**攻撃**

**Wallarmコード:** `vpatch`

**説明:**     

[virtual patch機構][doc-vpatch]によって緩和された攻撃の一部であるリクエストは、`vpatch`としてマークされます。

**必要な設定:**

Virtual patchingは、現在の[filtration mode](admin-en/configure-wallarm-mode.md)に関係なく、特定のエンドポイントまたはすべてのリクエストをブロックする仕組みです。Virtual patchは、あなたが[手動で作成する][doc-vpatch]カスタムルールです。

**Wallarmによる保護に加えて:**

* パッチで緩和した脆弱性を分析し、パッチが不要になるように脆弱性を解消します。

<!--### API leak

**Wallarm code:** `apileak`

Description TBD (not presented in docs, but presented in UI)
-->

## その他

### 認証バイパス

**脆弱性**

**CWEコード:** [CWE-288][cwe-288]

**Wallarmコード:** `auth`

**説明:**

認証機構が実装されていても、アプリケーションやAPIに別の認証方法が存在し、主要な認証機構をバイパスできたり、その弱点を突くことが可能な場合があります。これらの要因が組み合わさると、攻撃者がユーザーまたは管理者権限でアクセスを得る結果につながる可能性があります。

認証バイパス攻撃が成功すると、ユーザーの機密データの流出や、管理者権限で脆弱なAPIを乗っ取られる恐れがあります。

**Wallarmによる保護に加えて:**

* 既存の認証機構を改善し強化します。
* 事前定義のメカニズムを介した必須の認証手続きを回避してAPIにアクセスできるような、代替の認証方法を排除します。
* [OWASP Authentication Cheat Sheet][link-owasp-auth-cheatsheet]の推奨事項を適用します。

### クレデンシャルスタッフィング

**攻撃**

**Wallarmコード:** `credential_stuffing`

**説明:**

攻撃者が漏えいしたユーザークレデンシャルのリストを使って、複数のリソース上のユーザーアカウントへ不正アクセスを試みるサイバー攻撃です。多くの人が複数のサービスで同じユーザー名とパスワードを使い回したり、一般的で弱いパスワードを使用したりするため、この攻撃は危険です。クレデンシャルスタッフィング攻撃は少ない試行回数で成功する可能性があるため、攻撃者はリクエストを低頻度で送信でき、ブルートフォース対策のような標準的な対策が効きにくくなります。 

**必要な設定:**

Wallarmは、フィルタリングノードがバージョン4.10以上で、[Credential Stuffing Detection](about-wallarm/credential-stuffing.md)機能が有効化され適切に構成されている場合にのみ、クレデンシャルスタッフィングの試行を検出します。

**Wallarmによる保護に加えて:**

* [OWASPのcredential stuffingの説明](https://owasp.org/www-community/attacks/Credential_stuffing)（"Credential Stuffing Prevention Cheat Sheet"を含む）に目を通してください。
* ユーザーに強力なパスワードの使用を義務付けます。
* 異なるリソースで同じパスワードを使用しないようユーザーに推奨します。
* 二要素認証を有効にします。
* 追加のCAPTCHAソリューションを使用します。

### クロスサイトリクエストフォージェリ（CSRF）

**脆弱性**

**CWEコード:** [CWE-352][cwe-352]

**Wallarmコード:** `csrf`

**説明:**

クロスサイトリクエストフォージェリ（CSRF）は、ユーザーが現在認証されているアプリケーション上で、望まないアクションを実行させる攻撃です。ソーシャルエンジニアリング（メールやチャットでリンクを送るなど）を少し用いることで、攻撃者はアプリケーションのユーザーに攻撃者が選んだアクションの実行を促すことができます。

対応する脆弱性は、クロスサイトリクエストを行う際に、ユーザーのブラウザが対象ドメインに設定されたユーザーのセッションクッキーを自動的に追加してしまうことに起因します。

ほとんどのサイトでは、これらのクッキーにサイトのクレデンシャルが含まれます。したがって、ユーザーが現在サイトに認証済みであれば、サイトは被害者が送った偽造リクエストと正規のリクエストを区別できません。

結果として、攻撃者は脆弱なWebアプリケーションに対し、正規ユーザーになりすまして悪意のあるウェブサイトからリクエストを送ることができ、そのユーザーのクッキーにアクセスする必要すらありません。

WallarmはCSRFの脆弱性を発見するのみで、CSRF攻撃を検出しないためブロックもしません。CSRFの問題は、すべてのモダンブラウザでコンテンツセキュリティポリシー（CSP）によって解決されています。

**保護:**

CSRFはブラウザによって解決されていますが、他の保護方法も有用性は低いものの依然として使用できます。

* CSRFトークンなどのアンチCSRF保護メカニズムを採用します。
* `SameSite`クッキー属性を設定します。
* [OWASP CSRF Prevention Cheat Sheet][link-owasp-csrf-cheatsheet]の推奨事項を適用します。

### ファイルアップロード違反

**攻撃**

**Wallarmコード:** `file_upload_violation`

**説明:**

[unrestricted resource consumption](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa4-unrestricted-resource-consumption.md)は、最も深刻なAPIセキュリティリスクの[OWASP API Top 10 2023](user-guides/dashboards/owasp-api-top-ten.md#wallarm-security-controls-for-owasp-api-2023)に含まれています。これはそれ自体が脅威（過負荷によるサービスの低速化や停止）であるだけでなく、列挙攻撃などさまざまな攻撃タイプの土台にもなります。過度に大きなファイルアップロードを許可することは、これらのリスクの原因の1つです。

**必要な設定:**

Wallarmは、サブスクリプションプランで利用可能な方法で1つ以上の[ポリシー](api-protection/file-upload-restriction.md)が構成されている場合にのみ、ファイルアップロード制限を適用します。

ファイルサイズのアップロード制限は、Wallarmが提供する[無制限なリソース消費を防ぐための措置](api-protection/file-upload-restriction.md#comparison-to-other-measures-for-preventing-unrestricted-resource-consumption)の唯一の手段ではないことに注意してください。

**Wallarmによる保護に加えて:**

* クライアント側JavaScriptでファイルサイズ検証を設定します。
* Webサーバー（NginxやApacheなど）を構成し、大きなファイルを拒否します。
* アプリケーションコード内でファイルサイズチェックを実装します。

### 情報露出

**脆弱性/攻撃**

**CWEコード:** [CWE-200][cwe-200]（参考: [CWE-209][cwe-209], [CWE-215][cwe-215], [CWE-538][cwe-538], [CWE-541][cwe-541], [CWE-548][cwe-548], [CWE-598][CWE-598]）

**Wallarmコード:** `infoleak`

**説明:**

この脆弱性は、アプリケーションが機密情報を不正に開示してしまうもので、攻撃者にさらなる悪意のある活動のための機微なデータを提供する可能性があります。

機密情報の例:

* メール、財務データ、連絡先などの私的・個人的情報
* エラーメッセージやスタックトレースで開示される技術情報
* OSやインストールされたパッケージなどのシステム状況と環境
* ソースコードや内部状態

Wallarmは次の2つの方法で情報露出を検出します。

* サーバーレスポンスの分析: Wallarmは、パッシブ検出、脆弱性スキャン、スレットリプレイテストなどの[手法](about-wallarm/detecting-vulnerabilities.md#vulnerability-detection-methods)を用いてサーバーレスポンスを分析します。これらの方法は、アプリケーションのレスポンスが機密情報を不意に露出していないかを確認することで脆弱性を特定することを目的とします。
* API Discoveryの知見: [API Discovery](api-discovery/overview.md)モジュールが特定したエンドポイントが、GETリクエストのクエリパラメータに個人を特定できる情報（PII）を含めて転送している場合、Wallarmはそれらを脆弱と認識します。

Wallarmは`infoleak`攻撃を特定の分類として扱うのではなく、該当するセキュリティインシデントが発生した際に検出・記録します。ただし、インシデントは頻繁ではありません。情報露出が始まると、Wallarmの検出機構が迅速に通知し、すばやく脆弱性を修正できるようにします。さらに、[blocking mode](admin-en/configure-wallarm-mode.md#available-filtration-modes)でWallarmのフィルタリングノードを使用することで、すべての攻撃試行をブロックして露出を未然に防ぎ、データ漏えいの可能性を大幅に低減できます。

**Wallarmによる保護に加えて:**

* Webアプリケーションが機密情報を表示できる機能を禁止します。
* 登録やログインフォームなど、機密データの送信には可能であればGETではなくPOSTメソッドを使用します。

### 脆弱なコンポーネント

**脆弱性**

**CWEコード:** [CWE-937][cwe-937], [CWE-1035][cwe-1035], [CWE-1104][cwe-1104]

**Wallarmコード:** `vuln_component`

**説明:**

この脆弱性は、アプリケーションやAPIが脆弱または古いコンポーネントを使用している場合に発生します。OS、Web/アプリケーションサーバー、データベース管理システム（DBMS）、ランタイム環境、ライブラリその他のコンポーネントが含まれます。

この脆弱性は[ A06:2021 – Vulnerable and Outdated Components](https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components)に対応しています。

**Wallarmによる保護に加えて:**

* 未使用の依存関係、不要な機能・コンポーネント・ファイル・ドキュメントを削除します。
* OWASP Dependency Checkやretire.jsなどのツールを用いて、クライアント側/サーバー側コンポーネント（フレームワーク、ライブラリなど）およびその依存関係のバージョンを継続的に棚卸しします。
* CVEやNVDなどの情報源を継続的に監視し、コンポーネントの脆弱性を把握します。
* 公式ソースから安全なリンク経由でのみコンポーネントを取得します。改ざん・悪意あるコンポーネントが紛れ込む可能性を減らすため、署名付きパッケージを優先します。
* メンテナンスされていない、または旧バージョン向けのセキュリティパッチを提供しないライブラリやコンポーネントを監視します。パッチ適用が不可能な場合は、検出された問題を監視・検出・防御するためにVirtual patchの展開を検討します。

### 弱いJWT

**脆弱性**

**CWEコード:** [CWE-1270][cwe-1270], [CWE-1294][cwe-1294]

**Wallarmコード:** `weak_auth`

**説明:**

[JSON Web Token（JWT）](https://jwt.io/)は、APIなどのリソース間でデータを安全に交換するために使用される一般的な認証標準です。

JWTの侵害は一般的な攻撃目標です。認証機構を突破されると、攻撃者にアプリケーションやAPIへの完全なアクセスを与えてしまうためです。JWTが弱ければ弱いほど、侵害される可能性が高まります。

Wallarmは、次の条件に該当するJWTを弱いと見なします。

* 署名なし: 署名アルゴリズムがない（`alg`フィールドが`none`、または存在しない）。
* 侵害された秘密鍵で署名されている。

弱いJWTが検出されると、Wallarmは対応する[脆弱性](user-guides/vulnerabilities.md)を記録します。

**Wallarmによる保護に加えて:**

* [OWASP JSON Web Token Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)の推奨事項を適用します。
* [広く知られたシークレットに対してJWT実装が脆弱か確認します](https://lab.wallarm.com/340-weak-jwt-secrets-you-should-check-in-your-code/)