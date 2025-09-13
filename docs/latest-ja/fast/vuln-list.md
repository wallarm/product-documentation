---
description: このドキュメントでは、FASTが検出するソフトウェアの脆弱性を一覧します。各項目にはその脆弱性に対応するWallarmコードが付与されています。ほとんどの脆弱性にはCWEコードも付記しています。
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

# FASTで検出可能な脆弱性

このドキュメントでは、FASTが検出するソフトウェアの脆弱性を一覧します。各項目にはその脆弱性に対応するWallarmコードが付与されています。ほとんどの脆弱性には[共通脆弱性タイプ(CWE)][link-cwe]コードも付記しています。

各項目にはその脆弱性に対応するWallarmコードが付与されています。

## 脆弱性一覧

### 異常

**CWEコード:** なし<br>
**Wallarmコード:** `anomaly`

####    説明

異常とは、受信したリクエストに対するアプリケーションの反応が通常と異なることを指します。

検出された異常は、アプリケーションの弱く潜在的に脆弱な領域を示します。この脆弱性により、攻撃者はアプリケーションを直接攻撃するか、攻撃前にデータを収集できます。

### XML外部実体(XXE)への攻撃

**CWEコード:** [CWE-611][cwe-611]<br>
**Wallarmコード:** `xxe`

####    説明

XXE脆弱性により、攻撃者はXMLドキュメントに外部実体を注入し、XMLパーサに評価させ、最終的にターゲットのWebサーバー上でそれを実行させることができます。

攻撃が成功すると、攻撃者は次のことが可能になります
* Webアプリケーションの機密データにアクセスする
* 内部ネットワークをスキャンする
* Webサーバー上のファイルを読み取る
* [SSRF][anchor-ssrf]攻撃を実行する
* サービス拒否(DoS)攻撃を実行する

この脆弱性は、WebアプリケーションにおいてXML外部実体の解析を制限していないことが原因です。

####    対策

次の推奨事項に従うことを推奨します:
* ユーザーが提供したXMLドキュメントを処理する際は、XML外部実体の解析を無効にしてください。
* [OWASPのXXE防止チートシート][link-owasp-xxe-cheatsheet]の推奨事項を適用してください。


### サーバーサイドテンプレートインジェクション(SSTI)

**CWEコード:** [CWE-94][cwe-94], [CWE-159][cwe-159]<br>
**Wallarmコード:** `ssti`

####    説明

SSTIに脆弱なWebサーバーでは、侵入者がユーザー入力フォームに実行可能なコードを注入し、そのコードがWebサーバーによって解釈・実行されてしまいます。

攻撃が成功すると、脆弱なWebサーバーが完全に侵害され、侵入者が任意のリクエストを実行したり、サーバーのファイルシステムを探索したり、特定の条件下では任意のコードをリモートで実行したり([「RCE攻撃」][anchor-rce]を参照)、その他多くのことが可能になります。   

この脆弱性は、ユーザー入力の検証および解析が不適切であることに起因します。

####    対策

入力内の内容が実行されないよう、すべてのユーザー入力をサニタイズおよびフィルタリングすることを推奨します。


### クロスサイトリクエストフォージェリ(CSRF)

**CWEコード:** [CWE-352][cwe-352]<br>
**Wallarmコード:** `csrf`

####    説明

CSRF攻撃により、侵入者は正規ユーザーになりすまして脆弱なアプリケーションへリクエストを送信できます。

この脆弱性は、クロスサイトリクエストの実行時に、対象ドメイン名に設定されたCookieがユーザーのブラウザーによって自動的に付与されることが原因で発生します。 

その結果、侵入者は、脆弱なサイトで認証済みの正規ユーザーになりすまして、悪意のあるWebサイトから脆弱なWebアプリケーションへリクエストを送信できます。さらに、そのユーザーのCookieにアクセスできる必要すらありません。

####    対策

次の推奨事項に従うことを推奨します:
* CSRFトークンなどの対CSRF保護メカニズムを使用してください。
* Cookie属性`SameSite`を設定してください。
* [OWASPのCSRF防止チートシート][link-owasp-csrf-cheatsheet]の推奨事項を適用してください。


### クロスサイトスクリプティング(XSS)

**CWEコード:** [CWE-79][cwe-79]<br>
**Wallarmコード:** `xss`

####    説明

クロスサイトスクリプティング攻撃により、侵入者は準備済みの任意コードをユーザーのブラウザー内で実行できます。

XSS攻撃にはいくつかの種類があります:
* 保存型XSSとは、悪意のあるコードがWebアプリケーションのページにあらかじめ埋め込まれている場合です。

    Webアプリケーションが保存型XSSに脆弱な場合、攻撃者は悪意のあるコードをWebアプリケーションのHTMLページに注入できます。さらに、このコードは永続し、感染したウェブページを要求した任意のユーザーのブラウザーによって実行されます。
    
* 反射型XSSとは、侵入者が特別に作成したリンクをユーザーに開かせる場合です。      

* DOMベースのXSSとは、Webアプリケーションのページに組み込まれたJavaScriptコード片の不備により、入力を解析してそれをJavaScriptコマンドとして実行してしまう場合です。

上記のいずれかの脆弱性が悪用されると、任意のJavaScriptコードが実行されます。XSS攻撃が成功すると、侵入者はユーザーのセッションや認証情報を盗み、ユーザーになりすましてリクエストを送信するなどの悪意ある行為を実行できます。 

このクラスの脆弱性は、ユーザー入力の検証および解析が不適切であることが原因です。


####    対策

次の推奨事項に従うことを推奨します:
* 入力内の内容が実行されないよう、Webアプリケーションが入力として受け取るすべてのパラメータをサニタイズおよびフィルタリングしてください。
* Webアプリケーションのページを生成する際には、動的に生成されるすべての要素をサニタイズし、エスケープしてください。
* [OWASPのXSS防止チートシート][link-owasp-xss-cheatsheet]の推奨事項を適用してください。


### 不適切な直接オブジェクト参照(IDOR)

**CWEコード:** [CWE-639][cwe-639]<br>
**Wallarmコード:** `idor`

####    説明

IDOR脆弱性があると、脆弱なWebアプリケーションの認証・認可メカニズムが、あるユーザーによる別のユーザーのデータやリソースへのアクセスを防止できません。 

この脆弱性は、リクエスト文字列の一部を変更することで(例: ファイル、ディレクトリ、データベースのエントリ)オブジェクトにアクセスできる一方で、適切なアクセス制御メカニズムが実装されていないことが原因です。  

この脆弱性を悪用するために、侵入者はリクエスト文字列を操作し、脆弱なWebアプリケーションまたはそのユーザーに属する機密情報への不正アクセスを得ます。 

####    対策

次の推奨事項に従うことを推奨します:
* Webアプリケーションのリソースに対して適切なアクセス制御メカニズムを実装してください。
* ユーザーに割り当てられたロールに基づいてリソースへのアクセスを付与するロールベースのアクセス制御メカニズムを実装してください。
* 間接オブジェクト参照を使用してください。
* [OWASPのIDOR防止チートシート][link-owasp-idor-cheatsheet]の推奨事項を適用してください。


### オープンリダイレクト

**CWEコード:** [CWE-601][cwe-601]<br>
**Wallarmコード:** `redir`

####    説明

侵入者は、正規のWebアプリケーションを介してユーザーを悪意のあるWebページへリダイレクトするために、オープンリダイレクト攻撃を利用できます。

この攻撃に対する脆弱性は、URL入力のフィルタリングが不適切であることが原因です。

####    対策

次の推奨事項に従うことを推奨します:
* 入力内の内容が実行されないよう、Webアプリケーションが入力として受け取るすべてのパラメータをサニタイズおよびフィルタリングしてください。
* 予定されているすべてのリダイレクトについてユーザーに通知し、明示的な許可を求めてください。


### サーバーサイドリクエストフォージェリ(SSRF)

**CWEコード:** [CWE-918][cwe-918]<br>
**Wallarmコード:** `ssrf`

####    説明

SSRF攻撃が成功すると、侵入者が攻撃対象のWebサーバーになりすましてリクエストを送信できるようになります。これにより、脆弱なWebアプリケーションで使用中のネットワークポートの露呈、内部ネットワークのスキャン、認可のバイパスにつながる可能性があります。  

####    対策

次の推奨事項に従うことを推奨します:
* 入力内の内容が実行されないよう、Webアプリケーションが入力として受け取るすべてのパラメータをサニタイズおよびフィルタリングしてください。
* [OWASPのSSRF防止チートシート][link-owasp-ssrf-cheatsheet]の推奨事項を適用してください。


### 情報漏えい

**CWEコード:** [CWE-200][cwe-200] (参照: [CWE-209][cwe-209], [CWE-215][cwe-215], [CWE-538][cwe-538], [CWE-541][cwe-541], [CWE-548][cwe-548])<br>
**Wallarmコード:** `info`

####    説明

脆弱なWebアプリケーションが、アクセス権限のない主体に対して機密情報を意図的または非意図的に開示してしまいます。 

####    対策

Webアプリケーションが機密情報を表示できないようにすることを推奨します。


### リモートコード実行(RCE)

**CWEコード:** [CWE-78][cwe-78], [CWE-94][cwe-94] など<br>
**Wallarmコード:** `rce`

####    説明

侵入者はWebアプリケーションへのリクエストに悪意のあるコードを注入し、アプリケーションがそのコードを実行してしまいます。また、脆弱なWebアプリケーションが稼働しているオペレーティングシステムに対して特定のコマンドを実行しようとする場合もあります。 

RCE攻撃が成功すると、侵入者は次のような幅広い行為を実行できます
* 脆弱なWebアプリケーションのデータの機密性、可用性、完全性が損なわれます。
* Webアプリケーションが稼働するオペレーティングシステムやサーバーを制御します。
* その他の行為。

この脆弱性は、ユーザー入力の検証および解析が不適切であることが原因です。

####    対策

入力内の内容が実行されないよう、すべてのユーザー入力をサニタイズおよびフィルタリングすることを推奨します。


### 認証バイパス

**CWEコード:** [CWE-288][cwe-288]<br>
**Wallarmコード:** `auth`

####    説明

認証メカニズムが導入されていても、Webアプリケーションに、メインの認証メカニズムを迂回できる代替の認証方法が存在したり、その弱点を突かれたりすることがあります。これらの要因が組み合わさることで、攻撃者がユーザーまたは管理者権限でアクセスを獲得してしまう可能性があります。

認証バイパス攻撃が成功すると、ユーザーの機密データが開示されたり、管理者権限で脆弱なアプリケーションを制御されたりするおそれがあります。

####    対策

次の推奨事項に従うことを推奨します:
* 既存の認証メカニズムを改善・強化してください。
* 所定の認証手順を既定のメカニズムで迂回してアプリケーションへアクセスできてしまう可能性のある代替認証方法を排除してください。
* [OWASPの認証チートシート][link-owasp-auth-cheatsheet]の推奨事項を適用してください。


### LDAPインジェクション

**CWEコード:** [CWE-90][cwe-90]<br>
**Wallarmコード:** `ldapi`

####    説明

LDAPインジェクションは、LDAPサーバーへのリクエストを改変してLDAP検索フィルターを変更させる攻撃のクラスを指します。

LDAPインジェクション攻撃が成功すると、LDAPのユーザーやホストに関する機密データの読み取りおよび書き込み操作へのアクセスが可能になってしまう可能性があります。

この脆弱性は、ユーザー入力の検証および解析が不適切であることが原因です。

####    対策

次の推奨事項に従うことを推奨します:
* 入力内の内容が実行されないよう、Webアプリケーションが入力として受け取るすべてのパラメータをサニタイズおよびフィルタリングしてください。
* [OWASPのLDAPインジェクション防止チートシート][link-owasp-ldapi-cheatsheet]の推奨事項を適用してください。


### NoSQLインジェクション

**CWEコード:** [CWE-943][cwe-943]<br>
**Wallarmコード:** `nosqli`

####    説明

この攻撃に対する脆弱性は、ユーザー入力のフィルタリングが不十分であることが原因です。NoSQLインジェクション攻撃は、NoSQLデータベースに特別に作成したクエリを注入して実行されます。

####    対策

入力内の内容が実行されないよう、すべてのユーザー入力をサニタイズおよびフィルタリングすることを推奨します。


### パストラバーサル

**CWEコード:** [CWE-22][cwe-22]<br>
**Wallarmコード:** `ptrav`

####    説明

パストラバーサル攻撃により、侵入者はWebアプリケーションのパラメータを介して既存のパスを改変し、脆弱なWebアプリケーションが存在するファイルシステム内に保存されている機密データを含むファイルやディレクトリへアクセスできます。

この攻撃に対する脆弱性は、ユーザーがWebアプリケーション経由でファイルやディレクトリを要求する際のユーザー入力のフィルタリングが不十分であることが原因です。

####    対策

次の推奨事項に従うことを推奨します:
* 入力内の内容が実行されないよう、Webアプリケーションが入力として受け取るすべてのパラメータをサニタイズおよびフィルタリングしてください。
* この種の攻撃の軽減に関する追加の推奨事項は[こちら][link-ptrav-mitigation]にあります。


### SQLインジェクション

**CWEコード:** [CWE-89][cwe-89]<br>
**Wallarmコード:** `sqli`

####    説明

この攻撃に対する脆弱性は、ユーザー入力のフィルタリングが不十分であることが原因です。[SQLインジェクション攻撃](https://www.wallarm.com/what/structured-query-language-injection-sqli-part-1)は、SQLデータベースに特別に作成したクエリを注入して実行されます。

SQLインジェクション攻撃により、侵入者はSQLクエリに任意のSQLコードを注入できます。これにより、機密データの読み取りや変更へのアクセス、さらにDBMSの管理者権限が付与されてしまう可能性があります。 

####    対策

次の推奨事項に従うことを推奨します:
* 入力内の内容が実行されないよう、Webアプリケーションが入力として受け取るすべてのパラメータをサニタイズおよびフィルタリングしてください。
* [OWASPのSQLインジェクション防止チートシート][link-owasp-sqli-cheatsheet]の推奨事項を適用してください。