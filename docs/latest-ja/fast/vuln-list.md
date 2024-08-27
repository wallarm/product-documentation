---
description: この文書は、FASTが検出するソフトウェアの脆弱性をリストアップしています。リストに含まれる各エンティティは、該当する脆弱性に対応するWallarmのコードを持っています。ほとんどの脆弱性は、CWEのコードも添えられています。
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
[anchor-ssrf]:  #serverside-request-forgery-ssrf

# FASTによって検出可能な脆弱性

この文書は、FASTが検出するソフトウェアの脆弱性をリストアップしています。リストに含まれる各エンティティは、該当する脆弱性に対応するWallarmのコードを持っています。ほとんどの脆弱性は、[Common Weakness Enumeration（CWE）][link-cwe]のコードも添えられています。

リストに含まれる各エンティティは、該当する脆弱性に対応するWallarmのコードを持っています。

## 脆弱性リスト

### 異常

**CWEコード:** なし<br>
**Wallarmコード:** `anomaly`

####    説明

異常は、アプリケーションが受信した要求に対する非典型的な反応によって表現されます。

検出された異常は、アプリケーションの弱く、潜在的に脆弱な領域を示しています。この脆弱性は、攻撃者がアプリケーションを直接攻撃するか、攻撃前にデータを収集することを可能にします。

### XML外部エンティティ（XXE）への攻撃

**CWEコード:** [CWE-611][cwe-611]<br>
**Wallarmコード:** `xxe`

####    説明

XXE脆弱性により、攻撃者はXMLパーサーに評価され、その後、ターゲットのWebサーバー上で実行される外部エンティティをXMLドキュメントに注入することができます。

成功した攻撃の結果として、攻撃者は以下のことが可能となります。
* Webアプリケーションの機密データにアクセスする
* 内部データネットワークをスキャンする
* Webサーバー上のファイルを読む
* [SSRF][anchor-ssrf]攻撃を行う
* サービス拒否（DoS）攻撃を行う

脆弱性は、WebアプリケーションでXML外部エンティティのパースに制限がない場合に発生します。

####    対策

次の対策を講じることができます：
* ユーザーが提供するXMLドキュメントを扱う際に、XML外部エンティティのパースを無効にします。
* [OWASP XXE Prevention Cheat Sheet][link-owasp-xxe-cheatsheet]の推奨事項を適用します。


### サーバーサイドテンプレートインジェクション（SSTI）

**CWEコード:** [CWE-94][cwe-94], [CWE-159][cwe-159]<br>
**Wallarmコード:** `ssti`

####    説明

不正アクセス者が、SSTI攻撃に対して脆弱なWebサーバー上のユーザーが入力したフォームに実行可能なコードを注入することができます。このコードは、Webサーバーによって解析および実行されます。

成功した攻撃により、脆弱なWebサーバーが完全に侵害される可能性があります。これにより、不正アクセス者は恣意的なリクエストを実行したり、サーバーのファイルシステムを探索したり、特定の条件下で任意のコードをリモートで実行したり（[「RCE攻撃」][anchor-rce]の詳細）、その他の多くのことが可能となります。

この脆弱性は、ユーザー入力の誤った検証とパースにより発生します。

####    対策

次の対策を講じることができます：すべてのユーザー入力をサニタイズおよびフィルタリングし、入力内のエンティティが実行されないようにします。


### クロスサイトリクエストフォージェリ（CSRF）

**CWEコード:** [CWE-352][cwe-352]<br>
**Wallarmコード:** `csrf`

####    説明

CSRF攻撃により、攻撃者は合法的なユーザーになりすまして脆弱なアプリケーションへのリクエストを送信することができます。

該当の脆弱性は、クロスサイトリクエストを実行する際にユーザーのブラウザが自動的にターゲットのドメイン名に対して設定されたクッキーを追加するために発生します。

その結果、攻撃者は、悪意のあるウェブサイトから脆弱なウェブアプリケーションにリクエストを送信し、そのサイトで認証された合法的なユーザーとして装うことができます。攻撃者は、そのユーザーのクッキーへのアクセスを必要としません。

####    対策

次の対策を講じることができます：
* CSRFトークンなどのアンチCSRF保護メカニズムを使用します。
* `SameSite`のクッキー属性を設定します。
* [OWASP CSRF Prevention Cheat Sheet][link-owasp-csrf-cheatsheet]の推奨事項を適用します。


### クロスサイトスクリプティング（XSS）

**CWEコード:** [CWE-79][cwe-79]<br>
**Wallarmコード:** `xss`

####    説明

クロスサイトスクリプティング攻撃では、攻撃者がユーザーのブラウザで準備した任意のコードを実行することができます。

いくつかのXSS攻撃のタイプがあります：
* ストアドXSSは、悪意のあるコードがWebアプリケーションのページに事前に組み込まれている場合です。

    もしWebアプリケーションがストアドXSS攻撃に対して脆弱である場合、攻撃者はWebアプリケーションのHTMLページに悪意のあるコードを注入することが可能です。さらに、このコードは持続して存在し、感染したウェブページを要求するすべてのユーザーのブラウザによって実行されます。

* リフレクテッドXSSは、攻撃者がユーザーに特別に作られたリンクを開かせる場合です。      

* DOMベースのXSSは、Webアプリケーションのページに組み込まれたJavaScriptコードスニペットが、このコードスニペットのエラーにより、入力をパースしてJavaScriptコマンドとして実行する場合です。

上記のいずれかの脆弱性を利用すると、任意のJavaScriptコードが実行されます。もしXSS攻撃が成功した場合、攻撃者はユーザーのセッションや認証情報を盗んだり、ユーザーになりすましてリクエストを送信したり、その他の悪意のある行為を行うことが可能になります。

このクラスの脆弱性は、ユーザー入力の誤った検証とパースに起因しています。

####    対策

次の対策を講じることができます：
* Webアプリケーションが入力として受け取るすべてのパラメータをサニタイズおよびフィルタリングし、入力のエンティティが実行されないようにします。
* Webアプリケーションのページを形成する際に、動的に形成されるエンティティをサニタイズし、エスケープします。
* [OWASP XSS Prevention Cheat Sheet][link-owasp-xss-cheatsheet]の推奨事項を適用します。


### 不適切な直接オブジェクト参照（IDOR）

**CWEコード:** [CWE-639][cwe-639]<br>
**Wallarmコード:** `idor`

####    説明

IDORの脆弱性により、脆弱なWebアプリケーションの認証および承認メカニズムが、あるユーザーが別のユーザーのデータやリソースにアクセスするのを防ぐことができません。 

この脆弱性は、Webアプリケーションがリクエスト文字列の一部を変更することでオブジェクト（例えば、ファイル、ディレクトリ、データベースエントリ）にアクセスする能力を付与し、適切なアクセス制御メカニズムを実装していない場合に発生します。

この脆弱性を悪用するために、攻撃者はリクエスト文字列を操作して、脆弱なWebアプリケーションまたはそのユーザーが所有する機密情報に無許可でアクセスします。

####    対策

次の対策を講じることができます：
* Webアプリケーションのリソースに対する適切なアクセス制御メカニズムを実装します。
* ロールベースのアクセス制御メカニズムを実装して、ユーザーに割り当てられたロールに基づいてリソースへのアクセスを許可します。
* 間接的なオブジェクト参照を使用します。
* [OWASP IDOR Prevention Cheat Sheet][link-owasp-idor-cheatsheet]の推奨事項を適用します。


### オープンリダイレクト

**CWEコード:** [CWE-601][cwe-601]<br>
**Wallarmコード:** `redir`

####    説明

攻撃者は、オープンリダイレクト攻撃を利用して、ユーザーを合法的なWebアプリケーションを介して悪意のあるWebページにリダイレクトすることができます。

この攻撃に対する脆弱性は、URL入力の不十分なフィルタリングにより発生します。

####    対策

次の対策を講じることができます：
* Webアプリケーションが入力として受け取るすべてのパラメータをサニタイズおよびフィルタリングし、入力のエンティティが実行されないようにします。
* すべての保留中のリダイレクトについてユーザーに通知し、明示的な許可を求めます。


### サーバーサイドリクエストフォージェリ（SSRF）

**CWEコード:** [CWE-918][cwe-918]<br>
**Wallarmコード:** `ssrf`

####    説明

成功したSSRF攻撃により、攻撃者が攻撃されたWebサーバーに代わってリクエストを行うことができる可能性があります。これにより、脆弱なWebアプリケーションの使用中のネットワークポートの開示、内部ネットワークのスキャン、および認証の回避が可能となります。

####    対策

次の対策を講じることができます：
* Webアプリケーションが入力として受け取るすべてのパラメータをサニタイズおよびフィルタリングし、入力のエンティティが実行されないようにします。
* [OWASP SSRF Prevention Cheat Sheet][link-owasp-ssrf-cheatsheet]の推奨事項を適用します。


### 情報の露出

**CWEコード:** [CWE-200][cwe-200]（参照：[CWE-209][cwe-209], [CWE-215][cwe-215], [CWE-538][cwe-538], [CWE-541][cwe-541], [CWE-548][cwe-548]）<br>
**Wallarmコード:** `info`

####    説明

脆弱なウェブアプリケーションは、故意または無意識に機密情報を、それにアクセスする権限を持たない主体に開示します。 

####    対策

次の対策を講じることができます：ウェブアプリケーションが任意の機密情報を表示する機能を禁止します。


### リモートコード実行（RCE）

**CWEコード:** [CWE-78][cwe-78], [CWE-94][cwe-94] など<br>
**Wallarmコード:** `rce`

####    説明

攻撃者はウェブアプリケーションへのリクエストに悪意のあるコードを注入し、そのアプリケーションがこのコードを実行します。また、攻撃者は、脆弱なウェブアプリケーションが動作するオペレーティングシステムで特定のコマンドを実行しようとすることもあります。

成功したRCE攻撃により、攻撃者は以下のような広範な行動を行うことができます。
* 脆弱なWebアプリケーションのデータの機密性、アクセシビリティ、および完全性を脅かす。
* Webアプリケーションが動作するオペレーティングシステムおよびサーバーを制御する。
* その他の可能な行動。

この脆弱性は、ユーザー入力の誤った検証とパースに起因しています。

####    対策

次の対策を講じることができます：すべてのユーザー入力をサニタイズおよびフィルタリングし、入力内のエンティティが実行されないようにします。


### 認証バイパス

**CWEコード:** [CWE-288][cwe-288]<br>
**Wallarmコード:** `auth`

####    説明

認証メカニズムが存在するにも関わらず、ウェブアプリケーションには主要な認証メカニズムをバイパスするか、その弱点を悪用する代替的な認証方法が存在することがあります。この要素の組み合わせが、攻撃者がユーザーまたは管理者の権限でアクセスを得る結果となる可能性があります。

成功した認証バイパス攻撃は、ユーザーの機密データの開示や、管理者権限で脆弱なアプリケーションを制御する可能性を含みます。

####    対策

次の対策を講じることができます：
* 既存の認証メカニズムを改善し、強化します。
* 攻撃者が必要な認証手続きをバイパスしてアプリケーションにアクセスできるようにする事前定義されたメカニズムを介して代替的な認証方法を排除します。
* [OWASP Authentication Cheat Sheet][link-owasp-auth-cheatsheet] の推奨事項を適用します。


### LDAPインジェクション

**CWEコード:** [CWE-90][cwe-90]<br>
**Wallarmコード:** `ldapi`

####    説明

LDAPインジェクションは、攻撃者がLDAPサーバーへのリクエストを変更して、LDAP検索フィルタを変更することを可能にする攻撃のクラスを表します。

成功したLDAPインジェクション攻撃は、LDAPユーザーやホストに関する機密データに対する読み取りおよび書き込み操作へのアクセスを可能にします。

この脆弱性は、ユーザー入力の誤った検証とパースに起因しています。

####    対策

次の対策を講じることができます：
* Webアプリケーションが入力として受け取るすべてのパラメータをサニタイズおよびフィルタリングし、入力のエンティティが実行されないようにします。
* [OWASP LDAP Injection Prevention Cheat Sheet][link-owasp-ldapi-cheatsheet]の推奨事項を適用します。


### NoSQLインジェクション

**CWEコード:** [CWE-943][cwe-943]<br>
**Wallarmコード:** `nosqli`

####    説明

この攻撃に対する脆弱性は、ユーザー入力の不十分なフィルタリングにより発生します。NoSQLインジェクション攻撃は、NoSQLデータベースに特別に作成されたクエリを注入することによって行います。

####    対策

次の対策を講じることができます：すべてのユーザー入力をサニタイズおよびフィルタリングし、入力内のエンティティが実行されないようにします。


### パストラバーサル

**CWEコード:** [CWE-22][cwe-22]<br>
**Wallarmコード:** `ptrav`

####    説明

パストラバーサル攻撃により、攻撃者は既存のパスを変更して、脆弱なウェブアプリケーションが存在するファイルシステムに保存された機密データを含むファイルやディレクトリにアクセスすることができます。これは、ウェブアプリケーションのパラメータを介して行われます。

この攻撃に対する脆弱性は、ユーザーがウェブアプリケーションを介してファイルやディレクトリを要求するときのユーザー入力の不十分なフィルタリングにより発生します。

####    対策

次の対策を講じることができます：
* Webアプリケーションが入力として受け取るすべてのパラメータをサニタイズおよびフィルタリングし、入力のエンティティが実行されないようにします。
* このような攻撃を軽減するための追加の推奨事項は[こちら][link-ptrav-mitigation]で利用可能です。


### SQLインジェクション

**CWEコード:** [CWE-89][cwe-89]<br>
**Wallarmコード:** `sqli`

####    説明

この攻撃に対する脆弱性は、ユーザー入力の不十分なフィルタリングにより発生します。[SQLインジェクション攻撃](https://www.wallarm.com/what/structured-query-language-injection-sqli-part-1)は、SQLデータベースに特別に作られたクエリを注入することにより行います。

SQLインジェクション攻撃により攻撃者は、SQLクエリに任意のSQLコードを注入することが可能になります。これにより、攻撃者が機密データを読み取りおよび変更するアクセスを獲得し、DBMSの管理者権限を取得する可能性があります。

####    対策

次の対策を講じることができます：
* Webアプリケーションが入力として受け取るすべてのパラメータをサニタイズおよびフィルタリングし、入力のエンティティが実行されないようにします。
* [OWASP SQL Injection Prevention Cheat Sheet][link-owasp-sqli-cheatsheet]の推奨事項を適用します。