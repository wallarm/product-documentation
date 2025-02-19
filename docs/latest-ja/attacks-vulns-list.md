# 攻撃および脆弱性の種類

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

本記事ではWallarmフィルタリングノードが検出可能な攻撃や脆弱性について、[OWASP Top 10](https://owasp.org/www-project-top-ten/)や[OWASP API Top 10](https://owasp.org/www-project-api-security/)のセキュリティリスクリストに掲載されているものを含め、一覧にして簡潔に説明します。リストにある脆弱性と攻撃のほとんどには、[Common Weakness Enumeration][link-cwe]としても知られるソフトウェア脆弱性タイプのコードが一つまたは複数付与されています。

Wallarmは、リストされた脆弱性および攻撃を自動で検出し、[filtration mode](admin-en/configure-wallarm-mode.md)に従って対策を実施します。なお、カスタム[ルール](user-guides/rules/rules.md)および[トリガー](user-guides/triggers/triggers.md)によって、既定の挙動が変更される可能性があります。

!!! info "一部攻撃タイプのための必要な設定"
    攻撃や脆弱性の中には、行動パターンに基づくもの（[brute force](#brute-force-attack)、[forced browsing](#forced-browsing)、[BOLA](#broken-object-level-authorization-bola)）、[API abuse](#suspicious-api-activity)、[GraphQL](#graphql-attacks)や[credential stuffing](#credential-stuffing) のように、デフォルトでは検出されないものがございます。そのような攻撃/脆弱性については、必要な設定が個別に定義されています。

## DDoS攻撃

DDoS（分散型サービス妨害）攻撃とは、攻撃者が複数のソースからのトラフィックでサーバーやオンラインサービスを過負荷にすることで、ウェブサイトやオンラインサービスを利用不能にすることを目的としたサイバー攻撃の一種です。

攻撃者がDDoS攻撃を実施するために利用する手法は多岐にわたり、その方法やツールは大きく異なる場合があります。中には、サーバーへ大量の接続要求を送るなど、低レベルな手法を用いるものもあれば、IPアドレスのなりすましやネットワークインフラの脆弱性を突くなど、より洗練された複雑な戦術を用いる攻撃も存在します。

[ DDoSに対するリソース保護のためのガイドを読む](admin-en/configuration-guides/protecting-against-ddos.md)

## サーバーサイド攻撃

### SQLインジェクション

**脆弱性/攻撃**

**CWEコード:** [CWE-89][cwe-89]

**Wallarmコード:** `sqli`

**説明:**

この攻撃への脆弱性は、ユーザー入力の十分なフィルタリングが行われていないことに起因します。SQLインジェクション攻撃は、特別に作成されたクエリをSQLデータベースに注入することで実行されます。

SQLインジェクション攻撃により、攻撃者は任意のSQLコードを[SQLクエリ](https://www.wallarm.com/what/structured-query-language-injection-sqli-part-1)に注入できるため、機密データの閲覧や改ざん、あるいはDBMS管理者権限を取得することが可能となります。

**Wallarm保護に加えて、以下の点を実施することを推奨します:**

* ウェブアプリケーションが入力として受信するすべてのパラメータをサニタイズおよびフィルタリングし、入力内のエンティティが実行されないようにします。
* [OWASP SQLインジェクション防止チートシート][link-owasp-sqli-cheatsheet]の推奨事項を適用します。

### NoSQLインジェクション

**脆弱性/攻撃**

**CWEコード:** [CWE-943][cwe-943]

**Wallarmコード:** `nosqli`

**説明:**

この攻撃への脆弱性は、ユーザー入力の十分なフィルタリングが行われていないことに起因します。NoSQLインジェクション攻撃は、特別に作成されたクエリをNoSQLデータベースに注入することで実行されます。

**Wallarm保護に加えて:**

* 悪意のあるペイロードが実行されないよう、すべてのユーザー入力をサニタイズおよびフィルタリングします。

### リモートコード実行 (RCE)

**脆弱性/攻撃**

**CWEコード:** [CWE-78][cwe-78]、[CWE-94][cwe-94] およびその他

**Wallarmコード:** `rce`

**説明:**

攻撃者がウェブアプリケーションへのリクエストに悪意のあるコードを注入し、そのコードが実行される可能性があります。また、攻撃者は脆弱なウェブアプリケーションが動作しているオペレーティングシステムに対して特定のコマンドを実行させようと試みる可能性があります。

RCE攻撃が成功すると、攻撃者は以下を含む多岐にわたる操作を実行できる可能性があります:

* 脆弱なウェブアプリケーションのデータの機密性、可用性、完全性を侵害すること。
* ウェブアプリケーションが動作するオペレーティングシステムおよびサーバーの制御を乗っ取ること。
* その他の操作。

この脆弱性は、ユーザー入力の検証および解析が不正確であることに起因します。

**Wallarm保護に加えて:**

* 悪意ある入力が実行されないよう、すべてのユーザー入力をサニタイズおよびフィルタリングします。

### SSIインジェクション

**攻撃**

**CWEコード:** [CWE-96][cwe-96]、[CWE-97][cwe-97]

**Wallarmコード:** `ssi`

**説明:**

[SSI (Server Side Includes)][ssi-wiki]は、ウェブサーバー上のウェブページに一つまたは複数のファイルの内容を組み込むために非常に有用な、シンプルな解釈型サーバーサイドスクリプト言語です。ApacheやNGINXのウェブサーバーでサポートされています。

SSIインジェクションは、HTMLページに悪意のあるペイロードを注入するか、リモートで任意のコードを実行することにより、ウェブアプリケーションを悪用する攻撃です。アプリケーションで使用されているSSIの操作、またはユーザー入力フィールドを通じてその利用を強制することで悪用される可能性があります。

**例:**

```bash
<!--#config errmsg="Access denied, please enter your username and password"-->
```

**Wallarm保護に加えて:**

* 入力内の悪意あるペイロードが実行されないよう、すべてのユーザー入力をサニタイズおよびフィルタリングします。
* [OWASP入力検証チートシート][link-owasp-inputval-cheatsheet]の推奨事項を適用します。

### サーバーサイドテンプレートインジェクション (SSTI)

**脆弱性/攻撃**

**CWEコード:** [CWE-94][cwe-94]、[CWE-159][cwe-159]

**Wallarmコード:** `ssti`

**説明:**

攻撃者は、ユーザーが入力するフォームに実行可能なコードを注入し、そのコードがウェブサーバーによって解析・実行されるようにすることが可能です。

攻撃が成功すると、脆弱なウェブサーバーが完全に侵害され、攻撃者は任意のリクエストを実行したり、サーバーのファイルシステムを探索したり、場合によってはリモートで任意のコードを実行する（詳細は[リモートコード実行 (RCE)攻撃][anchor-rce]を参照）など、様々な操作を実行できる可能性があります。

この脆弱性は、ユーザー入力の検証および解析が不正確であることに起因します。

**Wallarm保護に加えて:**

* 入力内の内容が実行されないよう、すべてのユーザー入力をサニタイズおよびフィルタリングします。

### LDAPインジェクション

**脆弱性/攻撃**

**CWEコード:** [CWE-90][cwe-90]

**Wallarmコード:** `ldapi`

**説明:**

LDAPインジェクションは、攻撃者がLDAPサーバーへのリクエストを改変することにより、LDAP検索フィルターを操作できる攻撃の一種です。

LDAPインジェクション攻撃が成功すると、LDAPユーザーおよびホストに関する機密データの読み取りおよび書き込み操作へのアクセスが可能になる場合があります。

この脆弱性は、ユーザー入力の検証および解析が不正確であることに起因します。

**Wallarm保護に加えて:**

* ウェブアプリケーションが入力として受信するすべてのパラメータをサニタイズおよびフィルタリングし、入力内のエンティティが実行されないようにします。
* [OWASP LDAPインジェクション防止チートシート][link-owasp-ldapi-cheatsheet]の推奨事項を適用します。

### メールインジェクション

**攻撃**

**CWEコード:** [CWE-20][cwe-20]、[CWE-150][cwe-150]、[CWE-88][cwe-88]

**Wallarmコード:** `mail_injection`

**説明:**

メールインジェクションは、通常、ウェブアプリケーションの問い合わせフォームを通じて送信され、標準的なメールサーバーの挙動を変更するための悪意ある[IMAP][link-imap-wiki]/[SMTP][link-smtp-wiki]表現です。

この攻撃に対する脆弱性は、問い合わせフォームに入力されるデータの検証が不十分であることに起因します。メールインジェクションにより、メールクライアントの制限を回避し、ユーザーデータを盗み、スパムを送信することが可能になります。

**Wallarm保護に加えて:**

* 入力内の悪意あるペイロードが実行されないよう、すべてのユーザー入力をサニタイズおよびフィルタリングします。
* [OWASP入力検証チートシート][link-owasp-inputval-cheatsheet]の推奨事項を適用します。

### サーバーサイドリクエストフォージェリ (SSRF)

**脆弱性/攻撃**

**CWEコード:** [CWE-918][cwe-918]

**Wallarmコード:** `ssrf`

**説明:**

SSRF攻撃が成功すると、攻撃者は攻撃対象のウェブサーバーに代わってリクエストを送信できるため、ウェブアプリケーションで使用されているネットワークポートの情報が漏洩したり、内部ネットワークのスキャンが行われたり、認証を回避することが可能になる場合があります。

**Wallarm保護に加えて:**

* ウェブアプリケーションが入力として受信するすべてのパラメータをサニタイズおよびフィルタリングし、入力内のエンティティが実行されないようにします。
* [OWASP SSRF防止チートシート][link-owasp-ssrf-cheatsheet]の推奨事項を適用します。

### パストラバーサル

**脆弱性/攻撃**

**CWEコード:** [CWE-22][cwe-22]

**Wallarmコード:** `ptrav`

**説明:**

パストラバーサル攻撃により、攻撃者はウェブアプリケーションが配置されているファイルシステム内の機密データを含むファイルやディレクトリにアクセスできるようになります。これは、ウェブアプリケーションのパラメータ操作によって既存のパスを変更することによって実現されます。

この攻撃に対する脆弱性は、ウェブアプリケーションを介してファイルやディレクトリを要求する際に、ユーザー入力の十分なフィルタリングが行われていないことに起因します。

**Wallarm保護に加えて:**

* ウェブアプリケーションが入力として受信するすべてのパラメータをサニタイズおよびフィルタリングし、入力内のエンティティが実行されないようにします。
* このような攻撃を軽減するための追加の推奨事項は[こちら][link-ptrav-mitigation]をご参照ください。

### XML外部エンティティ攻撃 (XXE)

**脆弱性/攻撃**

**CWEコード:** [CWE-611][cwe-611]

**Wallarmコード:** `xxe`

**説明:**

XXE脆弱性により、攻撃者はXMLドキュメントに外部エンティティを注入し、XMLパーサーによって評価された後に対象のウェブサーバー上で実行させることが可能になります。

攻撃が成功すると、攻撃者は以下を実行できる可能性があります:

* ウェブアプリケーションの機密データにアクセスすること。
* 内部データネットワークのスキャンを行うこと。
* ウェブサーバー上のファイルを読み取ること。
* [SSRF][anchor-ssrf]攻撃を実行すること。
* DoS攻撃（サービス妨害攻撃）を実行すること。

この脆弱性は、ウェブアプリケーションにおいてXML外部エンティティの解析に制限がないことに起因します。

**Wallarm保護に加えて:**

* ユーザーから提供されたXMLドキュメントを扱う際、XML外部エンティティの解析を無効にします。
* [OWASP XXE防止チートシート][link-owasp-xxe-cheatsheet]の推奨事項を適用します。

### リソーススキャン

**攻撃**

**CWEコード:** none

**Wallarmコード:** `scanner`

**説明:**

`scanner`コードは、保護対象のリソースに対して攻撃またはスキャンを試みる第三者のスキャナーソフトウェアの一部であると判断されたHTTPリクエストに割り当てられます。Wallarm Scannerのリクエストは、リソーススキャン攻撃とは見なされません。この情報は後に、これらのサービスへの攻撃に利用される可能性があります。

**Wallarm保護に加えて:**

* IPアドレスの許可リストおよび拒否リスト、ならびに認証/認可メカニズムを活用することで、ネットワーク境界スキャンの可能性を制限します。
* ネットワーク境界をファイアウォールの背後に配置し、スキャン可能な領域を最小限に抑えます。
* サービスの運用に必要かつ十分なポートのみを開放するように定義します。
* ネットワークレベルでICMPプロトコルの使用を制限します。
* ITインフラのハードウェアおよびソフトウェアを定期的に更新します。

## クライアントサイド攻撃

### クロスサイトスクリプティング (XSS)

**脆弱性/攻撃**

**CWEコード:** [CWE-79][cwe-79]

**Wallarmコード:** `xss`

**説明:**

クロスサイトスクリプティング攻撃により、攻撃者はユーザーのブラウザ上で任意のコードを実行させることが可能になります。

XSS攻撃にはいくつかの種類があります:

* Stored XSSは、悪意あるコードがウェブアプリケーションのページに事前に埋め込まれる攻撃です。ウェブアプリケーションがStored XSS攻撃に脆弱な場合、攻撃者は悪意あるコードをHTMLページに注入でき、さらにそのコードは感染したウェブページを要求した全てのユーザーのブラウザ上で持続的に実行されます。
* Reflected XSSは、攻撃者がユーザーを騙して特別に作成されたリンクを開かせる攻撃です。
* DOMベースのXSSは、ウェブアプリケーションのページに組み込まれたJavaScriptコードスニペットが入力をパースし、そのコード内のエラーによりそれをJavaScriptコマンドとして実行してしまう場合の攻撃です。

上記のいずれかの脆弱性を利用すると、任意のJavaScriptコードが実行される結果となります。XSS攻撃が成功すると、攻撃者はユーザーのセッションや認証情報を盗んだり、ユーザーの代わりにリクエストを送信したり、その他の悪意ある行為を実行する可能性があります。

**Wallarm保護に加えて:**

* 入力内のエンティティが実行されないよう、ウェブアプリケーションが受信するすべてのパラメータをサニタイズおよびフィルタリングします。
* ウェブアプリケーションのページを生成する際、動的に形成されるすべてのエンティティをサニタイズおよびエスケープします。
* [OWASP XSS防止チートシート][link-owasp-xss-cheatsheet]の推奨事項を適用します。

### オープンリダイレクト

**脆弱性/攻撃**

**CWEコード:** [CWE-601][cwe-601]

**Wallarmコード:** `redir`

**説明:**

攻撃者は、オープンリダイレクト攻撃を利用して、正当なウェブアプリケーションを経由してユーザーを悪意あるウェブページにリダイレクトさせることができます。

この攻撃に対する脆弱性は、URL入力のフィルタリングが不適切であることに起因します。

**Wallarm保護に加えて:**

* ウェブアプリケーションが受信するすべてのパラメータをサニタイズおよびフィルタリングし、入力内のエンティティが実行されないようにします。
* すべての保留中のリダイレクトについてユーザーに通知し、明示的な許可を求めます。

### CRLFインジェクション

**脆弱性/攻撃**

**CWEコード:** [CWE-93][cwe-93]

**Wallarmコード:** `crlf`

**説明:**

CRLFインジェクションは、攻撃者がサーバーへのリクエスト（例：HTTPリクエスト）にキャリッジリターン (CR) およびラインフィード (LF) 文字を注入できる攻撃の一種です。

他の要因と組み合わせることで、このようなCR/LF文字の注入は、HTTPレスポンス分割（[CWE-113][cwe-113]）やHTTPレスポンススマグリング（[CWE-444][cwe-444]）など、さまざまな脆弱性を悪用するのに利用される可能性があります。

CRLFインジェクション攻撃が成功すると、攻撃者はファイアウォールの回避、キャッシュポイズニング、正当なウェブページの置換、オープンリダイレクト攻撃など、さまざまな操作を実行できる可能性があります。

この脆弱性は、ユーザー入力の検証および解析が不正確であることに起因します。

**Wallarm保護に加えて:**

* 入力内のエンティティが実行されないよう、すべてのユーザー入力をサニタイズおよびフィルタリングします。

## マス攻撃

### ブルートフォース攻撃

**攻撃**

**CWEコード:** [CWE-307][cwe-307]、[CWE-521][cwe-521]、[CWE-799][cwe-799]

**Wallarmコード:** `brute`

**説明:**

ブルートフォース攻撃は、大量のリクエストがあらかじめ定義されたペイロードと共にサーバーに送信されることで発生します。これらのペイロードは、何らかの方法で生成されるか、辞書から取得されることがあります。送信されたリクエストに対するサーバーの応答を解析し、ペイロード内のデータの適切な組み合わせを見つけ出します。

ブルートフォース攻撃が成功すると、認証および認可メカニズムの回避や、ウェブアプリケーションの隠されたリソース（ディレクトリ、ファイル、ウェブサイトの一部など）の露呈が起こり、その他の悪意ある操作を実行することが可能になります。

**必要な設定:**

Wallarmは、1つ以上の[ブルートフォーストリガー](admin-en/configuration-guides/protecting-against-bruteforce.md)または[レート制限ルール](user-guides/rules/rate-limiting.md)が設定されている場合にのみ、ブルートフォース攻撃を検出および緩和します。

**Wallarm保護に加えて:**

* ウェブアプリケーションに対して、一定期間内のリクエスト数を制限します。
* ウェブアプリケーションに対して、一定期間内の認証/認可試行回数を制限します。
* 一定回数以上の失敗後に、新たな認証/認可試行をブロックします。
* ウェブアプリケーションが動作するサーバー上の、アプリケーションの範囲外のファイルやディレクトリへのアクセスを制限します。

### 強制ブラウジング

**攻撃**

**CWEコード:** [CWE-425][cwe-425]

**Wallarmコード:** `dirbust`

**説明:**

この攻撃はブルートフォース攻撃の一種です。攻撃の目的は、ウェブアプリケーションの隠されたリソース、すなわちディレクトリやファイルを検出することにあります。これは、何らかのテンプレートに基づいて生成されるか、用意された辞書ファイルから抽出された異なるファイルおよびディレクトリ名を試すことで実現されます。

強制ブラウジング攻撃が成功すると、ウェブアプリケーションのインターフェイス上には明示的に存在しない隠されたリソースへアクセスできる可能性があります。

**必要な設定:**

Wallarmは、1つ以上の[強制ブラウジングトリガー](admin-en/configuration-guides/protecting-against-forcedbrowsing.md)が設定されている場合にのみ、強制ブラウジング攻撃を検出および緩和します。

**Wallarm保護に加えて:**

* ユーザーが直接アクセスすべきではないリソースへのアクセスを制限または制御します（例：認証または認可メカニズムの導入）。
* ウェブアプリケーションに対して、一定期間内のリクエスト数を制限します。
* ウェブアプリケーションに対して、一定期間内の認証/認可試行回数を制限します。
* 一定回数以上の失敗後に、新たな認証/認可試行をブロックします。
* ウェブアプリケーションのファイルやディレクトリに対して、必要かつ十分なアクセス権を設定します。

### クレデンシャルスタッフィング

**攻撃**

**Wallarmコード:** `credential_stuffing`

**説明:**

クレデンシャルスタッフィングは、ハッカーが漏洩したユーザー認証情報のリストを使用して、複数のウェブサイト上のユーザーアカウントに不正アクセスするサイバー攻撃です。多くの人が異なるサービス間で同じユーザー名やパスワードを再利用する、もしくは一般的な弱いパスワードを使用するため、この攻撃は非常に危険です。クレデンシャルスタッフィング攻撃は試行回数が少なくて済むため、攻撃者はリクエストを非常に低頻度で送信でき、その結果、ブルートフォース攻撃対策などの標準的な手法では効果が薄れる可能性があります。

**必要な設定:**

Wallarmは、フィルタリングノードがバージョン4.10以上であり、[Credential Stuffing Detection](about-wallarm/credential-stuffing.md)機能が有効かつ適切に設定されている場合にのみ、クレデンシャルスタッフィングの試行を検出します。

**Wallarm保護に加えて:**

* [OWASPのクレデンシャルスタッフィングに関する説明](https://owasp.org/www-community/attacks/Credential_stuffing)（『Credential Stuffing Prevention Cheat Sheet』を含む）を確認します。
* ユーザーに強力なパスワードの使用を促します。
* ユーザーに異なるリソース間で同じパスワードを使用しないよう推奨します。
* 二要素認証を有効にします。
* 追加のCAPTCHAソリューションを利用します。

## アクセスレベル

### オブジェクトレベル認可の破損 (BOLA)

**脆弱性/攻撃**

**CWEコード:** [CWE-639][cwe-639]

**Wallarmコード:** 脆弱性の場合は`idor`、攻撃の場合は`bola`

**説明:**

攻撃者は、リクエスト内で送信されるオブジェクトのIDを操作することにより、オブジェクトレベル認可に脆弱なAPIエンドポイントを悪用できる可能性があります。これにより、機密データへの不正アクセスが発生する恐れがあります。

この問題は、APIベースのアプリケーションで非常に一般的であり、サーバーコンポーネントがクライアントの状態を完全に把握しておらず、むしろクライアントから送信されるオブジェクトIDなどのパラメータに依存してどのオブジェクトにアクセスするかを判断するためです。APIエンドポイントのロジックによって、攻撃者はウェブアプリケーション、API、ユーザーに関するデータを閲覧するか、変更するかのどちらかを行う可能性があります。

この脆弱性はIDOR（Insecure Direct Object Reference）としても知られています。

[脆弱性の詳細](https://owasp.org/API-Security/editions/2023/en/0xa3-broken-object-property-level-authorization/)

**必要な設定:**

Wallarmはこのタイプの脆弱性を自動で検出します。BOLA攻撃を検出およびブロックするためには、以下のいずれかまたはすべてを実施します:

* [API Discovery](api-discovery/overview.md)を有効にし、本モジュールで検出されたエンドポイントに対して[自動BOLA保護](admin-en/configuration-guides/protecting-against-bola.md)を設定します。
* 1つ以上の[**BOLA**トリガー](admin-en/configuration-guides/protecting-against-bola.md)を設定します。

**Wallarm保護に加えて:**

* ユーザーポリシーおよび階層に基づく適切な認可メカニズムを実装します。
* オブジェクトIDには、[GUIDs](https://en.wikipedia.org/wiki/Universally_unique_identifier)としてランダムで予測不可能な値を使用することを推奨します。
* 認可メカニズムを評価するためのテストを作成し、テストを破る脆弱な変更を展開しないようにします。

### マスアサインメント

**攻撃**

**Wallarmコード:** `mass_assignment`

**説明:**

マスアサインメント攻撃では、攻撃者がHTTPリクエストのパラメータをプログラムコードの変数またはオブジェクトにバインドしようと試みます。APIが脆弱でバインディングを許容する場合、攻撃者は公開されることを意図していない機密のオブジェクトプロパティを変更する可能性があり、これにより権限昇格やセキュリティメカニズムの回避などが発生する恐れがあります。

マスアサインメント攻撃に脆弱なAPIは、適切なフィルタリングなしにクライアント入力を内部変数またはオブジェクトプロパティへ変換することを許容します。この脆弱性は、[OWASP API Security Top 10 2023 (API3:2023 Broken Object Property Level Authorization)](https://owasp.org/API-Security/editions/2023/en/0xa3-broken-object-property-level-authorization/) の最も深刻なAPIセキュリティリスクのリストに含まれています。

**Wallarm保護に加えて:**

* クライアント入力を自動的にコード変数やオブジェクトプロパティにバインドする関数の使用を避けます。
* 組み込み関数の機能を利用して、クライアントが更新すべきプロパティのみをホワイトリストに、プライベートプロパティをブラックリストにします。
* 必要に応じて、入力データペイロードのスキーマを明示的に定義し、強制します。

## API乱用

### 疑わしいAPI活動

**攻撃**

**Wallarmコード:** `api_abuse`

**説明:**

サーバー応答時間の増加、偽アカウントの作成、スカルピングなどを含む、基本的なボットの種類です。

**必要な設定:**

Wallarmは、[API Abuse Prevention](api-abuse-prevention/overview.md)モジュールが有効かつ適切に設定されている場合にのみ、API乱用攻撃を検出および緩和します。

**API Abuse Prevention**モジュールは、複雑なボット検出モデルを用いて、以下のボットタイプを検出します:

* サーバー応答時間の増加やサーバーの利用不能を狙ったAPI乱用。通常、悪意のあるトラフィックの急増によって実現されます。
* [偽アカウントの作成](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-019_Account_Creation)および[スパミング](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-017_Spamming)は、偽アカウントや偽のコンテンツ（例：フィードバック）の作成もしくは確認を伴い、通常はサービスの利用不能には至らず、以下のように通常の業務プロセスを遅延または低下させます:
    * サポートチームによる実際のユーザーリクエストの処理
    * マーケティングチームによる実際のユーザー統計の収集
* [スカルピング](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-005_Scalping)は、ボットがオンラインストアの商品を実際の顧客が利用できなくする（例：全商品を予約して品切れにさせ、利益を得ないようにする）ことを特徴とします。

指標がボット攻撃の兆候を示す場合、モジュールは異常なトラフィックの発信元を1時間、[denylistまたはgraylist](api-abuse-prevention/setup.md#creating-profiles)に追加します。

**Wallarm保護に加えて:**

* ウェブアプリケーションに対する[OWASPの自動脅威に関する説明](https://owasp.org/www-project-automated-threats-to-web-applications/)を確認します。
* アプリケーションに全く関係のない地域およびソース（例：Tor）のIPアドレスをdenylistに追加します。
* サーバーサイドにおけるリクエストのレート制限を設定します。
* 追加のCAPTCHAソリューションを利用します。
* アプリケーションの解析結果からボット攻撃の兆候を調査します。

### アカウント乗っ取り

**攻撃**

**Wallarmコード:** `account_takeover`（4.10.6以前は`api_abuse`）

**説明:**

悪意ある攻撃者が、他者の許可や認知を得ることなく、そのアカウントにアクセスするサイバー攻撃の一種です。一度アカウントにアクセスすると、攻撃者は機密情報の窃盗、不正な取引の実行、スパムやマルウェアの拡散など、様々な目的で使用する可能性があります。

**必要な設定:**

Wallarmは、[API Abuse Prevention](api-abuse-prevention/overview.md)モジュールが有効かつ適切に設定されている場合にのみ、アカウント乗っ取り攻撃を検出および緩和します。

一般的な[検出手法](api-abuse-prevention/overview.md#how-api-abuse-prevention-works)に加え、API Abuse Preventionはアカウント乗っ取り攻撃の各種タイプを検出するための専用検出機能を含んでいます:

* IP rotation – IPアドレスのプールを用いた攻撃に対応
* Session rotation – IPセッションのプールを用いた攻撃に対応
* Persistent ATO – 長期間にわたって徐々に発生する攻撃に対応

API Abuse Preventionは、重要なエンドポイントや認証・登録に関連するエンドポイントに対するブルートフォース攻撃として実行される[credential cracking](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-007_Credential_Cracking.html)を実行するボットを検出します。許容可能な動作の自動閾値は、1時間の正当なトラフィックに基づいて計算されます。

**Wallarm保護に加えて:**

* ウェブアプリケーションに対する[OWASPの自動脅威に関する説明](https://owasp.org/www-project-automated-threats-to-web-applications/)を確認します。
* 強力なパスワードを使用します。
* 異なるリソース間で同じパスワードを使用しないようにします。
* 二要素認証を有効にします。
* 追加のCAPTCHAソリューションを利用します。
* 疑わしい活動についてアカウントを監視します。

### セキュリティクローラー

**攻撃**

**Wallarmコード:** `security_crawlers`（4.10.6以前は`api_abuse`）

**説明:**

セキュリティクローラーは、ウェブサイトをスキャンして脆弱性やセキュリティ問題を検出するために設計されていますが、悪意ある目的で使用される可能性もあります。攻撃者は、これらを利用して脆弱なウェブサイトを特定し、自らの利益のために悪用する可能性があります。また、一部のセキュリティクローラーは設計不十分で、サーバーを過負荷にさせたりクラッシュさせたりするなど、ウェブサイトに思わぬ被害をもたらす可能性があります。

**必要な設定:**

Wallarmは、[API Abuse Prevention](api-abuse-prevention/overview.md)モジュールが有効かつ適切に設定されている場合にのみ、セキュリティクローラー攻撃を検出および緩和します。

**API Abuse Prevention**モジュールは、複雑なボット検出モデルを用いて以下のセキュリティクローラーのボットタイプを検出します:

* [Fingerprinting](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-004_Fingerprinting.html) – 特定のリクエストによりアプリケーションのプロファイリングを行う
* [Footprinting](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-018_Footprinting.html) – アプリケーションの構成やセキュリティメカニズムに関する情報を収集する
* [Vulnerability scanning](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-014_Vulnerability_Scanning) – サービスの脆弱性を探索する

**Wallarm保護に加えて:**

* ウェブアプリケーションに対する[OWASPの自動脅威に関する説明](https://owasp.org/www-project-automated-threats-to-web-applications/)を確認します。
* SSL証明書を使用します。
* 追加のCAPTCHAソリューションを利用します。
* レート制限を実装します。
* 悪意ある活動を示すパターンがないか、トラフィックを監視します。
* 検索エンジンクローラーにどのページをクロール可能かを示すためにrobots.txtファイルを使用します。
* ソフトウェアを定期的に更新します。
* コンテンツデリバリーネットワーク（CDN）を使用します。

### スクレイピング

**攻撃**

**Wallarmコード:** `scraping`（4.10.6以前は`api_abuse`）

**説明:**

ウェブスクレイピング（データスクレイピングまたはウェブハーベスティングとも呼ばれる）は、ウェブサイトから自動的にデータを抽出するプロセスです。これは、ソフトウェアやコードを使用してウェブページからデータを取得・抽出し、スプレッドシートやデータベースなどの構造化された形式で保存することを伴います。

ウェブスクレイピングは悪意ある目的で使用される可能性があります。たとえば、スクレイパーは、ログイン認証情報、個人情報、財務データなどの機密情報をウェブサイトから盗むために使用されることがあります。また、スクレイパーは、ウェブサイトのパフォーマンスを低下させ、DoS攻撃を引き起こすような方法でデータをスクレイピングまたはスパム送信するためにも使用される可能性があります。

**必要な設定:**

Wallarmは、[API Abuse Prevention](api-abuse-prevention/overview.md)モジュールが有効かつ適切に設定されている場合にのみ、スクレイピング攻撃を検出および緩和します。

**API Abuse Prevention**モジュールは、複雑なボット検出モデルを用いて、[scraping](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-011_Scraping)ボットタイプを検出します。これは、アクセス可能なデータおよび/または処理済みの出力を収集し、機密または有料のコンテンツが誰でも利用できるようになる可能性を持つものです。

**Wallarm保護に加えて:**

* ウェブアプリケーションに対する[OWASPの自動脅威に関する説明](https://owasp.org/www-project-automated-threats-to-web-applications/)を確認します。
* 追加のCAPTCHAソリューションを利用します。
* 検索エンジンクローラーにどのページをクロール可能かを示すためにrobots.txtファイルを使用します。
* 悪意ある活動を示すパターンがないか、トラフィックを監視します。
* レート制限を実装します。
* データを難読化または暗号化します。
* 法的措置を講じます。

## GraphQL攻撃

**攻撃**

**Wallarmコード:** `graphql_attacks`

**説明:**

GraphQLには、過剰な情報露出やDoSに関連するプロトコル固有の攻撃を実装できる特性があり、詳細は以下の項目を参照してください。これらの脅威を防ぐための十分な対策は、リクエストサイズ、値のサイズ、クエリの深さ、バッチ処理されるクエリの許容数など、GraphQLリクエストに対して制限を設定することです。Wallarmでは、これらの制限を[GraphQL policy](api-protection/graphql-rule.md)で設定し、制限を超えるGraphQLリクエストはGraphQL攻撃と見なされます。

**必要な設定:**

Wallarmは、1つ以上の[GraphQL攻撃検出ルール](api-protection/graphql-rule.md)が設定されている場合（ノードバージョン4.10.3以上が必要）にのみ、GraphQL攻撃を検出および緩和します。

**Wallarm保護に加えて:**

* 機密または制限されたGraphQL APIにアクセスする際は、認証を必須にします。
* インジェクション攻撃を防ぎ、悪意のある入力値から保護するため、入力および出力をサニタイズします。
* リクエストの詳細やレスポンスデータを含む、GraphQLクエリ活動を追跡および解析するための包括的なログ機構を実装します。
* GraphQLサーバーを、権限およびアクセス制御が制限された安全な実行環境で運用します。

### GraphQLクエリサイズ

**Wallarmコード:** `gql_doc_size`：許容される最大クエリ総サイズの違反

**説明:**

攻撃者は、サーバーが過剰に大きな入力を処理する方法を悪用することで、GraphQLエンドポイントに対してDoS攻撃を行う、または他の問題を引き起こそうとする可能性があります。

### GraphQL値サイズ

**Wallarmコード:** `gql_value_size`：許容される最大値サイズの違反

**説明:**

攻撃者は、変数または引数に対して非常に長い文字列値を含むGraphQLリクエストを送信し、サーバーのリソースを圧迫する（Excessive Value Length攻撃）可能性があります。

### GraphQLクエリ深度

**Wallarmコード:** `gql_depth`：許容される最大クエリ深度の違反

**説明:**

GraphQLクエリは入れ子にすることができ、一度に複雑なデータ構造を要求できる一方で、この柔軟性が悪用され、サーバーを圧迫するほど深く入れ子になったクエリが作成される可能性があります。

### GraphQLエイリアス

**Wallarmコード:** `gql_aliases`：許容される最大エイリアス数の違反

**説明:**

GraphQLでは、エイリアスを使用して結果フィールド名を変更し、衝突を防ぎ、データの整理を容易にできますが、攻撃者はこの機能を悪用し、リソース枯渇攻撃やDoS攻撃を実行する可能性があります。

### GraphQLバッチ処理

**Wallarmコード:** `gql_docs_per_batch`：許容されるバッチ内クエリ数の違反

**説明:**

GraphQLでは、複数のクエリ（オペレーション）を単一のHTTPリクエストにまとめることができます。複数のオペレーションを1つのリクエストにまとめることで、攻撃者はバッチ攻撃を仕掛け、レート制限などのセキュリティ対策を回避しようとする可能性があります。

### GraphQLイントロスペクション

**Wallarmコード:** `gql_introspection`：禁止されたイントロスペクションクエリ

**説明:**

攻撃者は、GraphQLイントロスペクションシステムを利用して、GraphQL APIのスキーマに関する詳細情報を明らかにし、全ての型、クエリ、ミューテーション、およびフィールドについての知識を得ることで、より正確で破壊的なクエリを構築する可能性があります。

### GraphQLデバッグ

**Wallarmコード:** `gql_debug`：禁止されたデバッグモードクエリ

**説明:**

GraphQLでは、デバッグモードが開発者によってオンのまま放置されると、攻撃者はスタックトレースやトレースバックなどの過剰なエラー報告メッセージから貴重な情報を収集する可能性があります。攻撃者は、URI内の「debug=1」パラメータを通じてデバッグモードにアクセスする可能性があります。

## API仕様

**攻撃**

**Wallarmコード:** `api_specification`：全ての仕様に基づく違反を表示します。具体的な違反は以下の項目で説明されています。

**説明:**

[API Specification Enforcement](api-specification-enforcement/overview.md)は、アップロードした仕様に基づき、APIに対してセキュリティポリシーを適用することを目的としています。その主な機能は、仕様書内のエンドポイントの記述と実際にREST APIへ送信されたリクエストとの間の不一致を検出することです。このような不一致が検出されると、システムはそれらに対応するための事前定義されたアクションを実行することができます。

API Specification Enforcementには、リクエストと仕様の比較に対して制限が適用されており、これらの制限を超えると、リクエストの処理を中止し、その旨を通知するイベントを生成します（[processing overlimit](#processing-overlimit)を参照）。

### 未定義のエンドポイント

**Wallarmコード:** `undefined_endpoint`

**説明:**

仕様に記載されていないエンドポイントへのリクエスト試行です。

### 未定義のパラメータ

**Wallarmコード:** `undefined_parameter`

**説明:**

仕様に記載されていないパラメータが含まれているため、攻撃としてマークされたリクエストです。

### 無効なパラメータ

**Wallarmコード:** `invalid_parameter_value`

**説明:**

仕様で定義された型/形式に合致しないパラメータ値が含まれているため、攻撃としてマークされたリクエストです。

### パラメータの欠如

**Wallarmコード:** `missing_parameter`

**説明:**

仕様で必須とされているパラメータまたはその値が含まれていないため、攻撃としてマークされたリクエストです。

### 認証情報の欠如

**Wallarmコード:** `missing_auth`

**説明:**

認証方法に関する必要な情報が含まれていないため、攻撃としてマークされたリクエストです。

### 無効なリクエスト

**Wallarmコード:** `invalid_request`

**説明:**

無効なJSONが含まれているため、攻撃としてマークされたリクエストです。

## データ取り扱い

### データボム

**攻撃**

**CWEコード:** [CWE-409][cwe-409]、[CWE-776][cwe-776]

**Wallarmコード:** `data_bomb`

**説明:**

リクエスト内にZipまたはXMLボムが含まれている場合、Wallarmはそのリクエストをデータボム攻撃としてマークします:

* [Zip bomb](https://en.wikipedia.org/wiki/Zip_bomb)は、読取を行うプログラムやシステムをクラッシュさせたり無効にするよう設計された悪意あるアーカイブファイルです。Zip bombは、プログラムが意図した通りに動作することを可能にしますが、アーカイブの解凍には莫大な時間、ディスク容量および/またはメモリが必要となるように作成されています。
* [XML bomb (billion laughs attack)](https://en.wikipedia.org/wiki/Billion_laughs_attack)は、XMLドキュメントのパーサーを狙ったDoS攻撃の一種です。攻撃者はXMLエンティティ内に悪意あるペイロードを送信します。例えば、`entityOne`は20個の`entityTwo`として定義でき、`entityTwo`も同様に20個の`entityThree`として定義することができます。このパターンを`entityEight`まで続けると、XMLパーサーは`entityOne`の単一の出現を1,280,000,000個の`entityEight`に展開し、5GBのメモリを消費します。

**Wallarm保護に加えて:**

* システムに影響を与えないよう、受信リクエストのサイズを制限します。

### 無効なXML

**攻撃**

**Wallarmコード:** `invalid_xml`

**説明:**

リクエストの本文がXMLドキュメントを含み、かつXMLヘッダーに記載されたエンコーディングと異なる場合、そのリクエストは`invalid_xml`としてマークされます。

### 処理オーバーリミット

**攻撃**

**Wallarmコード:** `processing_overlimit`

**説明:**

リクエストの処理中に[API Specification Enforcement](#api-specification)に適用された制限が違反された場合、**Specification processing overlimit**イベントが攻撃リストに追加されます。

### リソースオーバーリミット

**攻撃**

**Wallarmコード:** `overlimit_res`

**説明:**

Wallarmノードは、受信リクエストの処理に`N`ミリ秒（既定値: `1000`）以上を費やさないように設定されています。指定された時間内にリクエストが処理されない場合、リクエストの処理が中断され、`overlimit_res`攻撃としてマークされます。  
[**Limit request processing time**](user-guides/rules/configure-overlimit-res-detection.md)ルールを使用して、カスタムタイムリミットの指定や、制限を超えた際のノードの既定動作を変更できます。  
リクエスト処理時間を制限することで、Wallarmノードを標的としたバイパス攻撃を防止します。場合によっては、`overlimit_res`としてマークされたリクエストは、Wallarmノードモジュールに割り当てられたリソースが不足しており、リクエスト処理時間が長くなることを示す可能性があります。

## ブロックされた送信元

**攻撃**

**Wallarmコード:** `blocked_source`

**説明:**

**手動で**[denylisted](user-guides/ip-lists/overview.md)されたIPからの攻撃です。

## バーチャルパッチ

**攻撃**

**Wallarmコード:** `vpatch`

**説明:**

バーチャルパッチメカニズム[doc-vpatch]によって緩和された攻撃の一部である場合、リクエストは`vpatch`としてマークされます。

**必要な設定:**

バーチャルパッチは、現在の[filtration mode](admin-en/configure-wallarm-mode.md)に関係なく、特定またはすべてのエンドポイントへのリクエストをブロックするものです。  
バーチャルパッチは、[手動で作成する](doc-vpatch)カスタムルールです。

**Wallarm保護に加えて:**

* パッチによって緩和された脆弱性を解析し、パッチが不要となるように修正します。

## その他

### 認証バイパス

**脆弱性**

**CWEコード:** [CWE-288][cwe-288]

**Wallarmコード:** `auth`

**説明:**

認証メカニズムが実装されていても、ウェブアプリケーションには主要な認証メカニズムを回避する、またはその弱点を突く代替の認証方法が存在する場合があります。このような要因の組み合わせにより、攻撃者がユーザーまたは管理者権限でアクセスできる可能性があります。  
認証バイパス攻撃が成功すると、ユーザーの機密データが漏洩するか、脆弱なアプリケーションの管理者権限を取得する可能性があります。

**Wallarm保護に加えて:**

* 既存の認証メカニズムを改善および強化します。
* 事前定義された仕組みにより、攻撃者が必須の認証手順を回避してアプリケーションにアクセスできる可能性のある代替認証方法を排除します。
* [OWASP Authentication Cheat Sheet][link-owasp-auth-cheatsheet]の推奨事項を適用します。

### クロスサイトリクエストフォージェリ (CSRF)

**脆弱性**

**CWEコード:** [CWE-352][cwe-352]

**Wallarmコード:** `csrf`

**説明:**

クロスサイトリクエストフォージェリ (CSRF) は、現在認証されたウェブアプリケーション上で、エンドユーザーに意図しない操作を実行させる攻撃です。ソーシャルエンジニアリング（例：メールやチャットによるリンク送信）の協力を得ることで、攻撃者はユーザーを騙し、攻撃者が意図した操作を実行させる可能性があります。  
この脆弱性は、ユーザーのブラウザがクロスサイトリクエストを実行する際に、対象ドメインのために設定されたユーザーのセッションCookieを自動的に追加することに起因します。ほとんどのサイトでは、これらのCookieにサイトに関連する認証情報が含まれているため、ユーザーが現在サイトに認証されている場合、サイトは被害者が送信した偽造リクエストと正当なリクエストを区別できません。  
その結果、攻撃者は、脆弱なサイトで認証された正当なユーザーを装い、悪意あるウェブサイトから脆弱なウェブアプリケーションへリクエストを送信することができ、攻撃者がそのユーザーのCookieにアクセスする必要すらありません。  
WallarmはCSRFの脆弱性は検出しますが、CSRF攻撃自体を検出またはブロックはしません。CSRF問題は、すべての最新ブラウザにおいてコンテンツセキュリティポリシー (CSP) により解決されています。

保護策:

* CSRFトークンなど、反CSRF保護メカニズムを採用します。
* `SameSite` Cookie属性を設定します。
* [OWASP CSRF Prevention Cheat Sheet][link-owasp-csrf-cheatsheet]の推奨事項を適用します。

### 情報漏洩

**脆弱性/攻撃**

**CWEコード:** [CWE-200][cwe-200]（※詳細は、[CWE-209][cwe-209]、[CWE-215][cwe-215]、[CWE-538][cwe-538]、[CWE-541][cwe-541]、[CWE-548][cwe-548]、[CWE-598][cwe-598]も参照）

**Wallarmコード:** `infoleak`

**説明:**

この脆弱性は、アプリケーションによる機密情報の不正な開示を伴い、攻撃者にさらなる悪意ある活動のための機密データを提供する可能性があります。  
機密情報の種類:
* メール、財務データ、連絡先情報などの個人のプライベートな情報。
* エラーメッセージやスタックトレースで開示される技術情報。
* オペレーティングシステムやインストール済みパッケージなどのシステムの状態や環境。
* ソースコードまたは内部状態。

Wallarmは、以下の2つの方法で情報漏洩を検出します:

* サーバーレスポンス解析: Wallarmは、パッシブ検出、脆弱性スキャン、脅威リプレイテストなどの[手法](about-wallarm/detecting-vulnerabilities.md#vulnerability-detection-methods)を用いてサーバーの応答を解析し、アプリケーションの応答が意図せず機密情報を漏洩していないかを確認します。
* API Discoveryの知見: [API Discovery](api-discovery/overview.md)モジュールで識別されたエンドポイントがGETリクエストのクエリパラメータ内で個人を識別可能な情報 (PII) を転送する場合、Wallarmはこれを脆弱であると認識します。

Wallarmは`infoleak`攻撃を特定のカテゴリに分類することはなく、発生するセキュリティインシデントとして検出・記録します。  
ただし、これらのインシデントは稀です。情報漏洩が開始された場合、Wallarmの検出機構が速やかに通知し、迅速な脆弱性対策を可能にします。さらに、[blocking mode](admin-en/configure-wallarm-mode.md#available-filtration-modes)でWallarmのフィルタリングノードを使用することで、攻撃試行をブロックし、漏洩の可能性を大幅に低減できます。

**Wallarm保護に加えて:**

* ウェブアプリケーションが機密情報を表示することを禁止します。
* 登録やログインフォームなど、機密データの送信にはGETではなくPOST HTTPメソッドを使用することを推奨します。

### 脆弱なコンポーネント

**脆弱性**

**CWEコード:** [CWE-937][cwe-937]、[CWE-1035][cwe-1035]、[CWE-1104][cwe-1104]

**Wallarmコード:** `vuln_component`

**説明:**

この脆弱性は、ウェブアプリケーションまたはAPIが脆弱または時代遅れのコンポーネントを使用している場合に発生します。  
これには、OS、ウェブ/アプリケーションサーバー、データベース管理システム（DBMS）、ランタイム環境、ライブラリその他のコンポーネントが含まれます。  
この脆弱性は[ A06:2021 – Vulnerable and Outdated Components](https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components)に対応しています。

**Wallarm保護に加えて:**

* 不要な依存関係、不要な機能、コンポーネント、ファイル、ドキュメントを削除します。
* OWASP Dependency Check、retire.jsなどのツールを使用して、クライアントサイドおよびサーバーサイドのコンポーネントとその依存関係のバージョンを継続的に把握します。
* Common Vulnerability and Exposures (CVE)やNational Vulnerability Database (NVD)などの情報源を継続的に監視します。
* 公式の安全なリンク経由でのみコンポーネントを入手し、改ざんされた悪意あるコンポーネントのリスクを低減するため、署名付きパッケージを推奨します。
* 保守されていない、または古いバージョンに対してセキュリティパッチが提供されないライブラリやコンポーネントを監視し、パッチ適用が不可能な場合は、バーチャルパッチの導入を検討します。

### 弱いJWT

**脆弱性**

**CWEコード:** [CWE-1270][cwe-1270]、[CWE-1294][cwe-1294]

**Wallarmコード:** `weak_auth`

**説明:**

[JSON Web Token (JWT)](https://jwt.io/)は、APIなどのリソース間でデータを安全に交換するために使用される一般的な認証標準です。  
JWTの危殆化は、認証メカニズムを突破することで攻撃者にウェブアプリケーションやAPIへの完全なアクセスを提供するため、攻撃者の一般的な標的です。JWTが弱いほど、危殆化される可能性が高まります。  
Wallarmは、以下の場合、JWTが弱いと見なします:

* 暗号化されていない – 署名アルゴリズムが存在しない（`alg`フィールドが`none`または存在しない）。
* 漏洩した秘密鍵を使用して署名されている。

弱いJWTが検出されると、Wallarmは対応する[脆弱性](user-guides/vulnerabilities.md)として記録します。

**Wallarm保護に加えて:**

* [OWASP JSON Web Token Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)の推奨事項を適用します。
* [著名な秘密鍵に対してあなたのJWT実装が脆弱か確認してください](https://lab.wallarm.com/340-weak-jwt-secrets-you-should-check-in-your-code/)
