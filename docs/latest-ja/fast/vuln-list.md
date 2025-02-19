---
description: FASTが検出可能なソフトウェア脆弱性の一覧です。各項目には当該脆弱性に対応するWallarmコードが付与されています。ほとんどの脆弱性にはCWEコードも併記されています。
---

[cwe-22]:   https://cwe.mitre.org/data/definitions/22.html
[cwe-78]:   https://cwe.mitre.org/data/definitions/78.html
[cwe-79]:   https://cwe.mitre.org/data/definitions/79.html
[cwe-89]:   https://cwe.mitre.org/data/definitions/89.html
[cwe-90]:   https://cwe.mitre.org/data/definitions/90.html
[cwe-94]:   https://cwe.mitre.org/data/definitions/94.html
[cwe-159]:  https://cwe.mitre.org/data/definitions/159.html
[cwe-200]:  https://cwe.mitre.org/data/definitions/200.html
[cwe-209]:  https://cwe.mitre.org/data/definitions/209.html
[cwe-215]:  https://cwe.mitre.org/data/definitions/215.html
[cwe-288]:  https://cwe.mitre.org/data/definitions/288.html
[cwe-352]:  https://cwe.mitre.org/data/definitions/352.html
[cwe-538]:  https://cwe.mitre.org/data/definitions/538.html
[cwe-541]:  https://cwe.mitre.org/data/definitions/541.html
[cwe-548]:  https://cwe.mitre.org/data/definitions/548.html
[cwe-601]:  https://cwe.mitre.org/data/definitions/601.html
[cwe-611]:  https://cwe.mitre.org/data/definitions/611.html
[cwe-639]:  https://cwe.mitre.org/data/definitions/639.html
[cwe-918]:  https://cwe.mitre.org/data/definitions/918.html
[cwe-943]:  https://cwe.mitre.org/data/definitions/943.html

[link-cwe]: https://cwe.mitre.org/

[link-owasp-csrf-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
[link-owasp-xxe-cheatsheet]:                https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html
[link-owasp-xss-cheatsheet]:                https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
[link-owasp-idor-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html
[link-owasp-ssrf-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html
[link-owasp-auth-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
[link-owasp-ldapi-cheatsheet]:              https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html
[link-owasp-sqli-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html

[link-ptrav-mitigation]:                    https://owasp.org/www-community/attacks/Path_Traversal

[anchor-vuln-list]:     #vulnerabilities-list

[anchor-rce]:   #remote-code-execution-rce
[anchor-ssrf]:  #server-side-request-forgery-ssrf

# FASTが検出可能な脆弱性

この文書はFASTが検出可能なソフトウェア脆弱性を一覧化しております。各項目には当該脆弱性に対応するWallarmコードが付与されています。ほとんどの脆弱性には[Common Weakness Enumeration (CWE)][link-cwe]コードも併記されています。

各項目には当該脆弱性に対応するWallarmコードが付与されています。

## 脆弱性一覧

### 異常

**CWEコード:** なし<br>
**Wallarmコード:** `anomaly`

#### 説明

異常は、受信されたリクエストに対してアプリケーションが通常と異なる挙動を示すことが特徴です。

検出された異常は、アプリケーションの脆弱な可能性のある領域を示唆しております。この脆弱性により、攻撃者は直接アプリケーションに攻撃を仕掛けるか、攻撃前にデータを収集する可能性がございます。

### XML外部エンティティ攻撃（XXE）

**CWEコード:** [CWE-611][cwe-611]<br>
**Wallarmコード:** `xxe`

#### 説明

XXE脆弱性により、攻撃者はXMLドキュメント内に外部エンティティを注入し、XMLパーサーによって評価され、その後ターゲットWebサーバー上で実行される可能性がございます。

攻撃が成功すると、攻撃者は
* Webアプリケーションの機密データへアクセス
* 内部ネットワークのスキャン
* Webサーバ上のファイル読み取り
* [SSRF][anchor-ssrf]攻撃の実行
* Denial of Service (DoS)攻撃の実行
の各操作を行う可能性がございます。

本脆弱性は、Webアプリケーションにおいてユーザー提供のXMLドキュメントの外部エンティティ解析に制限がないことに起因しております。

#### 修正方法

以下の推奨事項に従ってください：
* ユーザー提供のXMLドキュメントを処理する際、XML外部エンティティの解析を無効化してください。
* [OWASP XXE Prevention Cheat Sheet][link-owasp-xxe-cheatsheet]の推奨事項を適用してください。

### サーバーサイドテンプレートインジェクション（SSTI）

**CWEコード:** [CWE-94][cwe-94]、[CWE-159][cwe-159]<br>
**Wallarmコード:** `ssti`

#### 説明

攻撃者は、ユーザー入力フォームに実行可能なコードを注入し、脆弱なWebサーバー上でそのコードが解析および実行されるようにすることが可能です。

攻撃が成功すると、脆弱なWebサーバーは完全に侵害される可能性があり、攻撃者は任意のリクエストの実行、サーバー内のファイルシステムの探索、場合によってはリモートで任意のコードの実行（詳細は[「RCE attack」][anchor-rce]を参照）など、さまざまな操作が実行可能になる可能性がございます。

本脆弱性は、ユーザー入力の検証や解析が不適切なことに起因しております。

#### 修正方法

入力内のエンティティが実行されるのを防ぐため、すべてのユーザー入力をサニタイズおよびフィルタリングする推奨事項に従ってください。

### クロスサイトリクエストフォージェリ（CSRF）

**CWEコード:** [CWE-352][cwe-352]<br>
**Wallarmコード:** `csrf`

#### 説明

CSRF攻撃により、攻撃者は正規ユーザーに代わって脆弱なアプリケーションへリクエストを送信することが可能です。

本脆弱性は、クロスサイトリクエスト実行中にユーザーのブラウザがターゲットドメインのクッキーを自動的に追加することに起因しております。

その結果、攻撃者は、認証済みの正規ユーザーになりすまして悪意あるWebサイトから脆弱なWebアプリケーションへリクエストを送信することが可能となり、攻撃者は該当ユーザーのクッキーにアクセスしている必要はございません。

#### 修正方法

以下の推奨事項に従ってください：
* CSRFトークンなどのCSRF保護メカニズムを採用してください。
* `SameSite`クッキー属性を設定してください。
* [OWASP CSRF Prevention Cheat Sheet][link-owasp-csrf-cheatsheet]の推奨事項を適用してください。

### クロスサイトスクリプティング（XSS）

**CWEコード:** [CWE-79][cwe-79]<br>
**Wallarmコード:** `xss`

#### 説明

クロスサイトスクリプティング攻撃により、攻撃者は予め用意した任意のコードをユーザーのブラウザ上で実行させることが可能です。

XSS攻撃には以下の種類がございます：
* ストアドXSS：悪意あるコードがWebアプリケーションのページに事前に埋め込まれている場合です。

    脆弱なWebアプリケーションでは、攻撃者は悪意あるコードをHTMLページに注入でき、このコードは永続的に残り、感染したページをリクエストするすべてのユーザーのブラウザで実行されます。
    
* リフレクトXSS：攻撃者がユーザーをだまして、特別に作成されたリンクを開かせる場合です。

* DOMベースXSS：Webアプリケーションのページに組み込まれたJavaScriptコードスニペットが、入力値を解析し、誤りによりJavaScriptコマンドとして実行してしまう場合です。

これらの脆弱性が悪用されると、任意のJavaScriptコードが実行されます。XSS攻撃が成功すると、攻撃者はユーザーのセッションや認証情報を盗み、ユーザーに代わってリクエストを送信するなどの悪意ある操作が実行可能となります。

本脆弱性は、ユーザー入力の検証や解析が不適切なことに起因しております。

#### 修正方法

以下の推奨事項に従ってください：
* ユーザー入力としてWebアプリケーションが受信するすべてのパラメーターをサニタイズおよびフィルタリングしてください。
* Webアプリケーションのページを生成する際、動的に生成されるエンティティをサニタイズおよびエスケープしてください。
* [OWASP XXS Prevention Cheat Sheet][link-owasp-xss-cheatsheet]の推奨事項を適用してください。

### 不適切な直接オブジェクト参照（IDOR）

**CWEコード:** [CWE-639][cwe-639]<br>
**Wallarmコード:** `idor`

#### 説明

IDOR脆弱性では、脆弱なWebアプリケーションの認証および認可メカニズムが、あるユーザーが別のユーザーのデータやリソースにアクセスするのを防止できません。

本脆弱性は、Webアプリケーションがリクエスト文字列の一部を変更するだけでオブジェクト（例：ファイル、ディレクトリ、データベースエントリ）へのアクセスを許可し、適切なアクセス制御が実施されていないことに起因しております。

攻撃者は、リクエスト文字列を操作することで、脆弱なWebアプリケーションまたはそのユーザーに属する機密情報へ不正にアクセスすることが可能となります。

#### 修正方法

以下の推奨事項に従ってください：
* Webアプリケーションのリソースに対して適切なアクセス制御メカニズムを実装してください。
* ユーザーに割り当てられた役割に基づいてリソースへのアクセスを許可するロールベースのアクセス制御を実装してください。
* 間接オブジェクト参照を利用してください。
* [OWASP IDOR Prevention Cheat Sheet][link-owasp-idor-cheatsheet]の推奨事項を適用してください。

### オープンリダイレクト

**CWEコード:** [CWE-601][cwe-601]<br>
**Wallarmコード:** `redir`

#### 説明

攻撃者は、オープンリダイレクト攻撃により、正当なWebアプリケーションを経由してユーザーを悪意あるWebページにリダイレクトさせることが可能です。

本脆弱性は、URL入力のフィルタリングが不十分であることに起因しております。

#### 修正方法

以下の推奨事項に従ってください：
* ユーザー入力としてWebアプリケーションが受信するすべてのパラメーターをサニタイズおよびフィルタリングしてください。
* 保留中のリダイレクトについてユーザーに通知し、明示的な許可を求めてください。

### サーバーサイドリクエストフォージェリ（SSRF）

**CWEコード:** [CWE-918][cwe-918]<br>
**Wallarmコード:** `ssrf`

#### 説明

SSRF攻撃が成功すると、攻撃者は攻撃されたWebサーバーに代わってリクエストを送信できる可能性がございます。これにより、脆弱なWebアプリケーションが使用するネットワークポートが公開され、内部ネットワークがスキャンされ、認証が回避される可能性があります。

#### 修正方法

以下の推奨事項に従ってください：
* ユーザー入力としてWebアプリケーションが受信するすべてのパラメーターをサニタイズおよびフィルタリングしてください。
* [OWASP SSRF Prevention Cheat Sheet][link-owasp-ssrf-cheatsheet]の推奨事項を適用してください。

### 情報漏洩

**CWEコード:** [CWE-200][cwe-200]（参照：[CWE-209][cwe-209]、[CWE-215][cwe-215]、[CWE-538][cwe-538]、[CWE-541][cwe-541]、[CWE-548][cwe-548]）<br>
**Wallarmコード:** `info`

#### 説明

脆弱なWebアプリケーションは、意図的または非意図的に、機密情報を権限のない対象に開示する可能性がございます。

#### 修正方法

Webアプリケーションが機密情報を表示しないように制限する推奨事項に従ってください。

### リモートコード実行（RCE）

**CWEコード:** [CWE-78][cwe-78]、[CWE-94][cwe-94]およびその他<br>
**Wallarmコード:** `rce`

#### 説明

攻撃者は、Webアプリケーションへのリクエストに悪意あるコードを注入し、アプリケーションがそのコードを実行するよう仕向けることが可能です。また、攻撃者は脆弱なWebアプリケーションが実行されるオペレーティングシステム上で特定のコマンドを実行しようとする可能性がございます。

RCE攻撃が成功すると、攻撃者は以下のような幅広い操作を行う可能性がございます：
* 脆弱なWebアプリケーションのデータの機密性、可用性、完全性を侵害すること。
* Webアプリケーションが動作するオペレーティングシステムおよびサーバーの制御を奪うこと。
* その他のさまざまな操作。

本脆弱性は、ユーザー入力の検証や解析が不適切なことに起因しております。

#### 修正方法

入力内のエンティティが実行されるのを防ぐため、すべてのユーザー入力をサニタイズおよびフィルタリングする推奨事項に従ってください。

### 認証バイパス

**CWEコード:** [CWE-288][cwe-288]<br>
**Wallarmコード:** `auth`

#### 説明

認証メカニズムが存在するにもかかわらず、Webアプリケーションは、主要な認証メカニズムをバイパスさせる代替の認証手法を有している可能性がございます。この組み合わせにより、攻撃者がユーザーまたは管理者権限でアクセスすることが可能となります。

認証バイパス攻撃が成功すると、ユーザーの機密情報の漏洩や、管理者権限で脆弱なアプリケーションの制御を奪われる可能性がございます。

#### 修正方法

以下の推奨事項に従ってください：
* 既存の認証メカニズムを改善し、強化してください。
* 攻撃者が事前定義されたメカニズムを利用して認証手続きを回避できる可能性のある代替認証手法を排除してください。
* [OWASP Authentication Cheat Sheet][link-owasp-auth-cheatsheet]の推奨事項を適用してください。

### LDAPインジェクション

**CWEコード:** [CWE-90][cwe-90]<br>
**Wallarmコード:** `ldapi`

#### 説明

LDAPインジェクションは、攻撃者がLDAPサーバーへのリクエストを変更することで、LDAP検索フィルターを改ざんする攻撃手法の一つです。

LDAPインジェクション攻撃が成功すると、LDAPユーザーやホストに関する機密データの読み取りおよび書き込み操作へのアクセスが可能になる可能性がございます。

本脆弱性は、ユーザー入力の検証や解析が不適切なことに起因しております。

#### 修正方法

以下の推奨事項に従ってください：
* ユーザー入力としてWebアプリケーションが受信するすべてのパラメーターをサニタイズおよびフィルタリングしてください。
* [OWASP LDAP Injection Prevention Cheat Sheet][link-owasp-ldapi-cheatsheet]の推奨事項を適用してください。

### NoSQLインジェクション

**CWEコード:** [CWE-943][cwe-943]<br>
**Wallarmコード:** `nosqli`

#### 説明

本脆弱性は、ユーザー入力のフィルタリングが不十分なことに起因しております。NoSQLインジェクション攻撃は、特別に作成されたクエリをNoSQLデータベースに注入することで実行されます。

#### 修正方法

以下の推奨事項に従ってください：
* ユーザー入力としてWebアプリケーションが受信するすべてのパラメーターをサニタイズおよびフィルタリングしてください。

### パストラバーサル

**CWEコード:** [CWE-22][cwe-22]<br>
**Wallarmコード:** `ptrav`

#### 説明

パストラバーサル攻撃により、攻撃者はWebアプリケーションのパラメーターを操作し、ファイルシステム上に保存された機密データを含むファイルやディレクトリにアクセスすることが可能です。

本脆弱性は、ファイルやディレクトリをリクエストする際のユーザー入力のフィルタリングが不十分であることに起因しております。

#### 修正方法

以下の推奨事項に従ってください：
* ユーザー入力としてWebアプリケーションが受信するすべてのパラメーターをサニタイズおよびフィルタリングしてください。
* 本攻撃の緩和に関する追加推奨事項は[こちら][link-ptrav-mitigation]をご参照ください。

### SQLインジェクション

**CWEコード:** [CWE-89][cwe-89]<br>
**Wallarmコード:** `sqli`

#### 説明

本脆弱性は、ユーザー入力のフィルタリングが不十分なことに起因しております。[SQLインジェクション攻撃](https://www.wallarm.com/what/structured-query-language-injection-sqli-part-1)は、特別に作成されたクエリをSQLデータベースに注入することで実行されます。

SQLインジェクション攻撃により、攻撃者は任意のSQLコードをSQLクエリに注入でき、これにより攻撃者は機密データの読み取りや改変、さらにDBMS管理者権限を取得する可能性がございます。

#### 修正方法

以下の推奨事項に従ってください：
* ユーザー入力としてWebアプリケーションが受信するすべてのパラメーターをサニタイズおよびフィルタリングしてください。
* [OWASP SQL Injection Prevention Cheat Sheet][link-owasp-sqli-cheatsheet]の推奨事項を適用してください。