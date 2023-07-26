# 攻撃と脆弱性の種類 

[cwe-20]: https://cwe.mitre.org/data/definitions/20.html
[cwe-22]: https://cwe.mitre.org/data/definitions/22.html
[cwe-78]: https://cwe.mitre.org/data/definitions/78.html
[cwe-79]: https://cwe.mitre.org/data/definitions/79.html
[cwe-88]: https://cwe.mitre.org/data/definitions/88.html
[cwe-89]: https://cwe.mitre.org/data/definitions/89.html
[cwe-90]: https://cwe.mitre.org/data/definitions/90.html
[cwe-93]: https://cwe.mitre.org/data/definitions/93.html
[cwe-94]: https://cwe.mitre.org/data/definitions/94.html
[cwe-113]: https://cwe.mitre.org/data/definitions/113.html
[cwe-96]: https://cwe.mitre.org/data/definitions/96.html
[cwe-97]: https://cwe.mitre.org/data/definitions/97.html
[cwe-150]: https://cwe.mitre.org/data/definitions/150.html
[cwe-159]: https://cwe.mitre.org/data/definitions/159.html
[cwe-200]: https://cwe.mitre.org/data/definitions/200.html
[cwe-209]: https://cwe.mitre.org/data/definitions/209.html
[cwe-215]: https://cwe.mitre.org/data/definitions/215.html
[cwe-288]: https://cwe.mitre.org/data/definitions/288.html
[cwe-307]: https://cwe.mitre.org/data/definitions/307.html
[cwe-352]: https://cwe.mitre.org/data/definitions/352.html
[cwe-409]: https://cwe.mitre.org/data/definitions/409.html
[cwe-425]: https://cwe.mitre.org/data/definitions/425.html
[cwe-444]: https://cwe.mitre.org/data/definitions/444.html
[cwe-511]: https://cwe.mitre.org/data/definitions/511.html
[cwe-521]: https://cwe.mitre.org/data/definitions/521.html
[cwe-538]: https://cwe.mitre.org/data/definitions/538.html
[cwe-541]: https://cwe.mitre.org/data/definitions/541.html
[cwe-548]: https://cwe.mitre.org/data/definitions/548.html
[cwe-601]: https://cwe.mitre.org/data/definitions/601.html
[cwe-611]: https://cwe.mitre.org/data/definitions/611.html
[cwe-776]: https://cwe.mitre.org/data/definitions/776.html
[cwe-799]: https://cwe.mitre.org/data/definitions/799.html
[cwe-639]: https://cwe.mitre.org/data/definitions/639.html
[cwe-918]: https://cwe.mitre.org/data/definitions/918.html
[cwe-943]: https://cwe.mitre.org/data/definitions/943.html
[cwe-1270]: https://cwe.mitre.org/data/definitions/1270.html
[cwe-1294]: https://cwe.mitre.org/data/definitions/1294.html
[cwe-937]: https://cwe.mitre.org/data/definitions/937.html
[cwe-1035]: https://cwe.mitre.org/data/definitions/1035.html
[cwe-1104]: https://cwe.mitre.org/data/definitions/1104.html

[link-cwe]: https://cwe.mitre.org/

[link-owasp-xxe-cheatsheet]: https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html
[link-owasp-xss-cheatsheet]: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
[link-owasp-idor-cheatsheet]: https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html
[link-owasp-ssrf-cheatsheet]: https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html
[link-owasp-auth-cheatsheet]: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
[link-owasp-ldapi-cheatsheet]: https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html
[link-owasp-sqli-cheatsheet]: https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html
[link-owasp-inputval-cheatsheet]: https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html

[link-ptrav-mitigation]: https://www.checkmarx.com/knowledge/knowledgebase/path-traversal
[link-wl-process-time-limit-directive]: admin-en/configure-parameters-en.md#wallarm_process_time_limit

[doc-vpatch]: user-guides/rules/vpatch-rule.md

[anchor-main-list]: #the-main-list-of-attacks-and-vulnerabilities
[anchor-special-list]: #the-list-of-special-attacks-and-vulnerabilities

[anchor-brute]: #bruteforce-attack
[anchor-rce]: #remote-code-execution-rce
[anchor-ssrf]: #server-side-request-forgery-ssrf

[link-imap-wiki]:  https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol
[link-smtp-wiki]:  https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol
[ssi-wiki]: https://en.wikipedia.org/wiki/Server_Side_Includes
[link-owasp-csrf-cheatsheet]: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html

Wallarm のフィルタリングノードは、OWASP API トップ10 の脅威リストに含まれる多くの攻撃と脆弱性を検出することができます。これらの攻撃と脆弱性は[以下][anchor-main-list]にリストアップされています。

リストの各エンティティは、

* **攻撃**、**脆弱性**、またはその両方でタグ付けされています。

    特定の攻撃の名前は、その攻撃が悪用する脆弱性の名前と同じになることがあります。この場合、そのようなエンティティは **脆弱性/攻撃**のタグでタグ付けされます。

* このエンティティに対応する Wallarm のコードを持っています。

このリストの脆弱性や攻撃の多くは、ソフトウェアの弱点の種類のリスト、別名 [Common Weakness Enumeration][link-cwe] または CWE の1つ以上のコードにも伴っています。

また、Wallarm のフィルタリングノードは、処理済みのトラフィックにマーキングするための内部目的で、いくつかの特別な攻撃と脆弱性のタイプを使用します。そのようなエンティティはCWE コードに伴われず、[別途リストアップ][anchor-special-list]されています。 

??? info "WallarmがOWASP Top 10に対してどのように保護するかのビデオを視聴する"
    <div class="video-wrapper">
    <iframe width="1280" height="720" src="https://www.youtube.com/embed/27CBsTQUE-Q" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>

## 攻撃と脆弱性の主なリスト

### XML外部エンティティ（XXE）への攻撃

**脆弱性/攻撃**

**CWE コード:** [CWE-611][cwe-611]

**Wallarmのコード:** `xxe`

**説明:**

XXEの脆弱性は、攻撃者がXMLパーサーに評価され、ターゲットのウェブサーバー上で実行されるXMLドキュメントに外部エンティティを注入することを可能にします。

成功した攻撃の結果、攻撃者は次のことが可能になります：

*   ウェブアプリケーションの機密データへのアクセスを得る
*   内部データネットワークをスキャンする
*   ウェブサーバー上のファイルを読む
*   [SSRF][anchor-ssrf]攻撃を行う
*   サービス拒否（DoS）攻撃を行う

この脆弱性は、ウェブアプリケーションにおけるXML外部エンティティの解析に制限がないために発生します。

**対策:**

以下の推奨事項に従うことができます：

*   ユーザーが提供するXMLドキュメントの操作時にXML外部エンティティの解析を無効にします。
*   [OWASP XXE Prevention Cheat Sheet][link-owasp-xxe-cheatsheet] の推奨事項を適用します。### ブルートフォース攻撃

**攻撃**

**CWE コード:** [CWE-307][cwe-307], [CWE-521][cwe-521], [CWE-799][cwe-799]

**Wallarm コード:** `brute`

**説明：**

ブルートフォース攻撃は、定義済みのペイロードを含む大量のリクエストがサーバーに送信されると発生します。これらのペイロードは何かの手段で生成されるか、辞書から取得されます。サーバーの応答は、ペイロード内のデータの正しい組み合わせを見つけるために分析されます。

成功したブルートフォース攻撃は、認証および認可メカニズムを迂回したり、ウェブアプリケーションの隠れたリソース（ディレクトリ、ファイル、ウェブサイトの一部など）を明らかにしたりする可能性があり、他の悪意のある行動を行う能力を付与します。

**対策：**

以下の推奨事項に従うことができます：

* ウェブアプリケーションの一定の期間あたりのリクエスト数を制限します。
* ウェブアプリケーションの一定の期間あたりの認証/認可試行回数を制限します。
* 失敗した試行の一定数の後に新しい認証/認可の試行をブロックします。
* アプリケーションの範囲内のものを除いて、ウェブアプリケーションがそれが運用されているサーバー上の任意のファイルやディレクトリにアクセスするのを制限します。

[ブルートフォースからアプリケーションを保護するための Wallarm ソリューションの設定方法 →](admin-en/configuration-guides/protecting-against-bruteforce.md)

### リソーススキャニング

**攻撃**

**CWE コード:** なし

**Wallarm コード:** `scanner`

**説明：**    

`scanner` コードは、このリクエストが保護されたリソースを攻撃またはスキャンするようにターゲットにされた第三者のスキャナソフトウェアの活動の一部であるとみなされる場合、HTTPリクエストに割り当てられます。Wallarmスキャナーのリクエストは、リソーススキャニング攻撃とはみなされません。この情報は後でこれらのサービスを攻撃するために使用することができます。

**対策：**

以下の推奨事項に従うことができます：

* IPアドレスの許可リストおよび拒否リストと認証/認可メカニズムを使用して、ネットワークパラメータのスキャンの可能性を制限します。
* ネットワークパラメータをファイアウォールの後ろに配置して、スキャン面を最小化します。
* サービスが運用するために開かれるべきポートの必要かつ十分なセットを定義します。
* ネットワークレベルでのICMPプロトコルの使用を制限します。
* 定期的にITインフラストラクチャの機器を更新します。これには以下のものが含まれます:

    * サーバーおよびその他の機器のファームウェア
    * オペレーティングシステム
    * その他のソフトウェア


### サーバーサイドテンプレートインジェクション（SSTI）

**脆弱性/攻撃**

**CWEコード：** [CWE-94][cwe-94], [CWE-159][cwe-159]

**Wallarmコード：** `ssti`

**説明：**

攻撃者は、ユーザーが記入したウェブサーバー上のフォームに実行可能なコードを注入することで、SSTI攻撃に対して脆弱なウェブサーバーに対して、そのコードがウェブサーバーによって解析および実行されるようにすることができます。

成功した攻撃により、脆弱なウェブサーバーは完全に妨害される可能性があり、攻撃者は任意のリクエストを実行したり、サーバーのファイルシステムを探索したり、場合によってはリモートから任意のコードを実行したりできます（詳細は [RCE 攻撃][anchor-rce] を参照）、また他の多くのことが可能になります。

この脆弱性は、ユーザー入力の誤った検証と解析から生じます。

**対策：**

入力から実体が実行されるのを防ぐために、すべてのユーザー入力を消毒およびフィルタリングするように推奨します。

### データボム

**攻撃**

**CWE コード:** [CWE-409][cwe-409], [CWE-776][cwe-776]

**Wallarm コード:** `data_bomb`

**説明：**

Wallarmは、リクエストにZipボムまたはXMLボムが含まれる場合、それをデータボム攻撃としてマークします：

* [Zipボム](https://en.wikipedia.org/wiki/Zip_bomb) は、プログラムまたはシステムをクラッシュさせるか、無用化するように設計された悪意のあるアーカイブファイルです。Zipボムはプログラムが意図した通りに動作することを許しますが、アーカイブはそれを展開するのに過度な時間、ディスクスペース、および/またはメモリが必要となるように作られています。
* [XMLボム（billion laughs attack）](https://en.wikipedia.org/wiki/Billion_laughs_attack) は、XML文書のパーサーを標的にしたDoS攻撃の一種です。攻撃者はXMLエンティティで悪意のあるペイロードを送信します。

    例えば、`entityOne`を20の`entityTwo`として定義することができ、それ自体を20の`entityThree`として定義することができます。`entityEight`まで同じパターンが続けられると、XMLパーサーは`entityOne`の単一の出現を1,280,000,000の`entityEight`に展開し、5GBのメモリを消費します。

**対策：**

システムに悪影響を及ぼさないように、入ってくるリクエストのサイズを制限します。

### クロスサイトスクリプティング（XSS）

**脆弱性/攻撃**

**CWE コード:** [CWE-79][cwe-79]

**Wallarm コード:** `xss`

**説明：**

クロスサイトスクリプティング攻撃により、攻撃者はユーザーのブラウザで準備された任意のコードを実行することができます。

XSS攻撃にはいくつかのタイプがあります：

* ストアドXSSは、悪意のあるコードがウェブアプリケーションのページに事前に埋め込まれているものです。

    ウェブアプリケーションがストアドXSS攻撃に対して脆弱である場合、攻撃者は悪意のあるコードをウェブアプリケーションのHTMLページに注入することが可能であり、さらに、このコードは維持され、感染したウェブページを要求するユーザーのブラウザで実行されます。
    
* リフレクティッドXSSは、攻撃者がユーザーを特別に作成されたリンクを開くようにだますものです。

* DOMベースのXSSは、ウェブアプリケーションのページに組み込まれたJavaScriptコードスニペットが入力を解析し、このコードスニペットのエラーによりJavaScriptコマンドとしてそれを実行するものです。

上記の脆弱性のいずれかを悪用すると、任意のJavaScriptコードが実行されます。XSS攻撃が成功すると、攻撃者はユーザーのセッションや資格情報を盗んだり、ユーザーに代わってリクエストを発行したり、他の悪意のある行動を行うことが可能になります。

この種類の脆弱性は、ユーザー入力の誤った検証および解析によって発生します。

**対策：**

以下の推奨事項に従うことができます：

* ウェブアプリケーションが入力として受け取るすべてのパラメーターを消毒およびフィルタリングして、入力のエンティティが実行されるのを防ぎます。
* ウェブアプリケーションのページを形成する際に、動的に形成されるエンティティを消毒およびエスケープします。
* [OWASP XSS Prevention Cheat Sheet][link-owasp-xss-cheatsheet] の推奨事項を適用します。

### 壊れたオブジェクトレベルの承認（BOLA）

**脆弱性/攻撃**

**CWE code:** [CWE-639][cwe-639]

**Wallarm code:** `idor` for vulnerabilities, `bola` for attacks

**説明:**

壊れたオブジェクトレベルの承認に対して脆弱なAPIエンドポイントを悪用するために、攻撃者はリクエスト内で送信されるオブジェクトのIDを操作することができます。これにより、機密データへの不正アクセスが可能となる場合があります。

APIベースのアプリケーションではこの問題が非常に一般的で、サーバーコンポーネントは通常、クライアントの状態を完全に追跡せず、代わりにアクセスするオブジェクトを決定するために、クライアントから送信されるパラメーター（オブジェクトIDなど）により依存します。

APIエンドポイントのロジックによって、攻撃者はウェブアプリケーション、API、およびユーザーのデータを読むだけでなく、それらを変更することもできます。

この脆弱性はIDOR（不安全な直接オブジェクト参照）とも呼ばれます。

[脆弱性の詳細](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa1-broken-object-level-authorization.md)

**対策：**

* ユーザーポリシーや階層に基づく適切な認証メカニズムを実装します。
* オブジェクトのIDとしてランダムで予測不可能な値を使用することを推奨します（[GUID](https://en.wikipedia.org/wiki/Universally_unique_identifier)を参照）。
* 認証メカニズムを評価するためのテストを作成します。テストを破る脆弱な変更をデプロイしないでください。

**Wallarmの動作：**

* Wallarmはこのタイプの脆弱性を自動的に発見します。
* Wallarmは、この脆弱性を悪用する攻撃をデフォルトでは検出しません。BOLA攻撃を検出しブロックするには、[**BOLA**トリガー](admin-en/configuration-guides/protecting-against-bola.md)を設定します。

### オープンリダイレクト

**脆弱性/攻撃**

**CWE code:** [CWE-601][cwe-601]

**Wallarm code:** `redir`

**説明:**

攻撃者は、オープンリダイレクト攻撃を使用して、ユーザーを合法的なウェブアプリケーションを経由して悪意のあるウェブページにリダイレクトすることができます。

この攻撃に対する脆弱性は、URL入力の誤ったフィルタリングにより発生します。

**対策：**

以下の推奨事項に従うことができます：

* ウェブアプリケーションが入力として受け取るすべてのパラメーターを消毒およびフィルタリングして、入力のエンティティが実行されるのを防ぎます。
* すべての保留中のリダイレクトについてユーザーに通知し、明示的な許可を求めます。
### サーバーサイドリクエストフォージェリ（SSRF）

**脆弱性/攻撃**

**CWEコード：** [CWE-918][cwe-918]

**Wallarmコード：** `ssrf`

**説明：**

成功したSSRF攻撃によって攻撃者は、攻撃されたウェブサーバーを代表してリクエストを行うことが可能となります。このことは、ウェブアプリケーションの使用中のネットワークポートの公開、内部ネットワークのスキャン、また認証のバイパスにつながる可能性があります。

リリース4.4.3から、WallarmはSSRF攻撃の試みを軽減します。SSRFの脆弱性は、すべての[サポートされているWallarmバージョン](updating-migrating/versioning-policy.md)によって検出されます。

**対策：**

以下の推奨事項に従うことができます：

*   ウェブアプリケーションが入力として受け取るすべてのパラメータをクリーニングおよびフィルタリングし、入力のエンティティが実行されるのを防止します。
*   [OWASP SSRF Prevention Cheat Sheet][link-owasp-ssrf-cheatsheet]の推奨事項を適用します。

### Cross-Site Request Forgery (CSRF)

**脆弱性**

**CWEコード：** [CWE-352][cwe-352]

**Wallarmコード：** `csrf`

**説明：**

Cross-Site Request Forgery (CSRF)は、エンドユーザーがログインしているウェブアプリケーションで不望の行動を強制する攻撃です。ソーシャルエンジニアリング（メールやチャットでリンクを送信するなど）を少し使うことで、攻撃者はウェブアプリケーションのユーザーをだまして、攻撃者の選択した行動を実行させることができます。

対応する脆弱性は、ユーザーのブラウザーがターゲットのドメイン名に設定されたユーザーのセッションクッキーを自動的に追加するために発生します。

ほとんどのサイトでは、これらのクッキーにはサイトに関連する資格情報が含まれています。したがって、ユーザーが現在そのサイトに認証されている場合、サイトは被害者が送信した偽造リクエストと被害者が送信した正当なリクエストを区別する方法がありません。

その結果、攻撃者は、脆弱なサイトで認証された正当なユーザーとして悪意のあるウェブサイトから脆弱なウェブアプリケーションにリクエストを送信することができます。攻撃者はそのユーザーのクッキーにアクセスする必要すらありません。

**Wallarmの挙動：**

Wallarmは CSRFの脆弱性のみを発見し、攻撃を検出およびブロックしません。 CSRFの問題はすべての現代のブラウザーでコンテンツセキュリティポリシー（CSP）を介して解決されています。

**対策：**

CSRFはブラウザーによって解決され、他の保護方法はあまり役立ちませんが、それでも使用することができます。

以下の推奨事項に従うことができます：

*   CSRFトークンなどのanti-CSRF保護メカニズムを使用します。
*   `SameSite`というクッキーアトリビュートを設定します。
*   [OWASP CSRF Prevention Cheat Sheet][link-owasp-csrf-cheatsheet]の推奨事項を適用します。

### 強制ブラウジング

**攻撃**

**CWEコード：** [CWE-425][cwe-425]

**Wallarmコード：** `dirbust`

**説明：**

この攻撃は、ブルートフォース攻撃のクラスに属します。この攻撃の目的は、あるテンプレートに基づいて生成されたものか、準備された辞書ファイルから抽出されたものか、さまざまなファイルとディレクトリの名前を試して、ウェブアプリケーションの隠されたリソース、つまりディレクトリとファイルを検出することです。

成功した強制ブラウジング攻撃により、ウェブアプリケーションのインターフェースから明示的に利用できないが、直接アクセスすると露出する隠されたリソースへのアクセスが可能になる可能性があります。

**対策：**

以下の推奨事項に従うことができます：

*   直接アクセスしてはならないリソースに対するユーザーのアクセスを制限または制約します（たとえば、何らかの認証または認可メカニズムを用いる）。
*   一定の時間枠でのウェブアプリケーションのリクエスト数を制限します。
*   一定の時間枠でのウェブアプリケーションの認証/承認試行の回数を制限します。
*   失敗した試行の一定数を超えると新たな認証/承認試行をブロックします。
*   ウェブアプリケーションのファイルとディレクトリに対して必要かつ十分なアクセス権を設定します。

[brute forceからのアプリケーション保護に向けたWallarmソリューションの設定方法 →](admin-en/configuration-guides/protecting-against-bruteforce.md)

### 情報漏洩

**脆弱性/攻撃**

**CWEコード：** [CWE-200][cwe-200] (参考 : [CWE-209][cwe-209], [CWE-215][cwe-215], [CWE-538][cwe-538], [CWE-541][cwe-541], [CWE-548][cwe-548])

**Wallarmコード：** `infoleak`

**説明：**

アプリケーションは故意にまたはうっかりと、それにアクセスする権限のない対象に敏感な情報を開示します。

このタイプの脆弱性は、[パッシブ検出](about-wallarm/detecting-vulnerabilities.md#passive-detection)の方法だけで検出できます。リクエストに対する応答が敏感な情報を開示する場合、Wallarmはインシデントと、情報公開タイプのアクティブな脆弱性を記録します。Wallarmが検出できる敏感な情報の一部は以下の通りです:

* システムと環境の状態 (例: スタックトレース, 警告, 致命的なエラー)
* ネットワークの状態と構成
* アプリケーションコードまたは内部状態
* メタデータ（例えば、接続のロギングやメッセージヘッダー）

**対策：**

任意の敏感な情報を表示する能力をウェブアプリケーションから禁止するという推奨事項に従うことができます。

### 脆弱なコンポーネント

**脆弱性**

**CWEコード：** [CWE-937][cwe-937], [CWE-1035][cwe-1035], [CWE-1104][cwe-1104]

**Wallarmコード：** `vuln_component`

**説明：**

この脆弱性は、ウェブアプリケーションまたはAPIが脆弱または時代遅れのコンポーネントを使用している場合に発生します。これには、OS、ウェブ/アプリケーションサーバ、データベース管理システム（DBMS）、ランタイム環境、ライブラリ、その他のコンポーネントが含まれます。

この脆弱性は、[A06：2021 - 脆弱で古いコンポーネント]（https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components）にマッピングされています。

**対策：**

以下のように、アプリケーションまたはAPIの寿命全体でアップデートまたは設定変更をモニタリングし、適時適用することを推奨します：

* 使われていない依存関係、不必要な機能、コンポーネント、ファイルやドキュメントを削除します。
* OWASP Dependency Check, retire.jsなどのツールを使ったクライアントサイドとサーバーサイドのコンポーネント（フレームワークやライブラリ）やそれらの依存関係のバージョンを継続的に監査します。
* 対象のコンポーネントの脆弱性に関する情報源、例えばCommon Vulnerability and Exposures (CVE) や National Vulnerability Database (NVD) を継続的に見るようにします。
* 公式のリンクから安全なウェブサイトでのみコンポーネントを入手します。変更されたり悪意のあるコンポーネントが含まれる可能性を減らすために、署名付きのパッケージが推奨されます。
* メンテナンスが行われていないライブラリやコンポーネントや、古いバージョンのセキュリティパッチを作成しないものを監視します。パッチが不可能な場合は、見つかった問題に対してモニタリング、検出、または保護を行う仮想パッチを実装することを考えます。

### リモートコード実行（RCE）

**脆弱性/攻撃**

**CWEコード：** [CWE-78][cwe-78], [CWE-94][cwe-94] 他

**Wallarmコード：** `rce`

**説明：**

攻撃者は、ウェブアプリケーションへのリクエストに悪意のあるコードを注入し、そのアプリケーションはそのコードを実行します。また、攻撃者は、脆弱なウェブアプリケーションが動作しているオペレーティングシステムに対して特定のコマンドを実行しようとすることもできます。

RCE攻撃が成功した場合、攻撃者は幅広いアクションを実行することができます。これには以下のようなことが含まれます：

*   脆弱なウェブアプリケーションのデータの機密性、アクセシビリティ、完全性を侵害します。
*   ウェブアプリケーションが動作しているオペレーティングシステムとサーバーを制御します。
*   その他の可能なアクション。

この脆弱性は、ユーザー入力の検証と解析が不適切なために発生します。

**対策：**

すべてのユーザー入力をクリーニングおよびフィルタリングし、入力内のエンティティが実行されるのを防止するという推奨事項に従うことができます。

### 認証バイパス

**脆弱性**

**CWEコード：** [CWE-288][cwe-288]

**Wallarmコード：** `auth`

**説明：**

認証メカニズムがあるにもかかわらず、ウェブアプリケーションは主要な認証メカニズムをバイパスするか、その弱点を利用する代替の認証方法を持つことができます。これらの要素の組み合わせが、攻撃者がユーザーまたは管理者の権限でアクセスを得るための結果となります。

成功した認証バイパス攻撃は、ユーザーの機密データを開示するか、管理者権限で脆弱なアプリケーションを制御する可能性があります。

**対策：**

以下の推奨事項に従うことができます：

*   既存の認証メカニズムを改善し、強化します。
*   攻撃者が所定のメカニズムを経由して必要な認証手続きをバイパスしてアプリケーションにアクセスできるようにする可能性のある代替の認証方法を排除します。
*   [OWASP Authentication Cheat Sheet][link-owasp-auth-cheatsheet]の推奨事項を適用します。
### CRLFインジェクション

**脆弱性/攻撃**

**CWEコード:** [CWE-93][cwe-93]

**Wallarmコード:** `crlf`

**説明:**

CRLFインジェクションは、攻撃者がキャリッジリターン(CR)とラインフィード(LF)の文字をサーバーへの要求（例：HTTP要求）に注入できるようにする攻撃の一種を示します。

これらのCR/LF文字の注入は、他の要素と組み合わせることで、さまざまな脆弱性（例：HTTPレスポンス分割[CWE-113][cwe-113]、HTTPレスポンススマグリング[CWE-444][cwe-444]）を悪用するのに役立ちます。

成功したCRLFインジェクション攻撃により、攻撃者はファイアウォールをバイパスしたり、キャッシュポイズニングを行ったり、正規のウェブページを悪意のあるものに置き換えたり、"Open redirect"攻撃を行ったり、その他多数の行動を履行する能力を得ることができます。

この脆弱性は、ユーザー入力の不適切な検証と解析により発生します。

**修正:**

ユーザー入力の実行を防ぐために、すべてのユーザー入力を洗浄し、フィルタリングすることを推奨します。


### LDAPインジェクション

**脆弱性/攻撃**

**CWEコード:** [CWE-90][cwe-90]

**Wallarmコード:** `ldapi`

**説明:**

LDAPインジェクションは、攻撃者がLDAPサーバーへの要求を変更することでLDAP検索フィルターを変更できるようにする攻撃の一種を示します。

成功したLDAPインジェクション攻撃は、LDAPユーザーやホストに関する機密データの読み取りと書き込み操作へのアクセスを可能にする場合があります。

この脆弱性は、ユーザー入力の不適切な検証と解析により発生します。

**修正:**

以下の推奨事項に従うことができます：

*   ユーザー入力の実行を防ぐために、ウェブアプリケーションが入力として受け取るすべてのパラメータを洗浄し、フィルタリングします。
*   [OWASP LDAPインジェクション防止チートシート][link-owasp-ldapi-cheatsheet]からの推奨事項を適用します。


### NoSQLインジェクション

**脆弱性/攻撃**

**CWEコード:** [CWE-943][cwe-943]

**Wallarmコード:** `nosqli`

**説明:**

この攻撃に対する脆弱性は、ユーザー入力の不適切なフィルタリングにより発生します。NoSQLインジェクション攻撃は、特別に作成されたクエリをNoSQLデータベースに注入することで実行されます。

**修正:**

ユーザー入力の実行を防ぐために、すべてのユーザー入力を洗浄し、フィルタリングすることを推奨します。


### パストラバーサル

**脆弱性/攻撃**

**CWEコード:** [CWE-22][cwe-22]

**Wallarmコード:** `ptrav`

**説明:**

パストラバーサル攻撃により、攻撃者はウェブアプリケーションが存在するファイルシステム内のファイルやディレクトリに保存されている機密データにアクセスすることができます。これはウェブアプリケーションのパラメータを通じて既存のパスを改ざんすることで可能となります。

この攻撃に対する脆弱性は、ユーザーがウェブアプリケーションを通じてファイルやディレクトリを要求する際のユーザー入力の不適切なフィルタリングにより発生します。

**修正:**

以下の推奨事項に従うことができます：

*   ユーザー入力の実行を防ぐために、ウェブアプリケーションが入力として受け取るすべてのパラメータを洗浄し、フィルタリングします。
*   このような攻撃を軽減するための追加の推奨事項は[こちら][link-ptrav-mitigation]で利用可能です。


### SQLインジェクション

**脆弱性/攻撃**

**CWEコード:** [CWE-89][cwe-89]

**Wallarmコード:** `sqli`

**説明:**

この攻撃に対する脆弱性は、ユーザー入力の不適切なフィルタリングにより発生します。SQLインジェクション攻撃は、特別に作成されたクエリをSQLデータベースに注入することで行われます。

SQLインジェクション攻撃により攻撃者は、任意のSQLコードを[SQLクエリ](https://www.wallarm.com/what/structured-query-language-injection-sqli-part-1)に注入し、これにより攻撃者は機密データの読み取りと変更、およびDBMSの管理者権限へのアクセスを許可される可能性があります。

**修正:**

以下の推奨事項に従うことができます：

*   ユーザー入力の実行を防ぐために、ウェブアプリケーションが入力として受け取るすべてのパラメータを洗浄し、フィルタリングします。
*   [OWASP SQLインジェクション防止チートシート][link-owasp-sqli-cheatsheet]からの推奨事項を適用します。


### Emailインジェクション

**攻撃**

**CWEコード:** [CWE-20][cwe-20], [CWE-150][cwe-150], [CWE-88][cwe-88]

**Wallarmコード:** `mail_injection`

**説明:**

Email Injectionは、[IMAP][link-imap-wiki]/[SMTP][link-smtp-wiki]を通じて通常のメールサーバーの動作を変更するためにウェブアプリケーションの連絡フォームを介して送信される悪意のある表現です。

この攻撃への脆弱性は、連絡フォームのデータ入力の検証不足により発生します。メールインジェクションでは、電子メールクライアントの制限をバイパスしたり、ユーザーデータを盗んだり、スパムを送信したりします。

**修正:**

* ユーザー入力に含まれる悪意のあるペイロードの実行を防ぐために、すべてのユーザー入力を洗浄し、フィルタリングします。
* [OWASP入力検証チートシート][link-owasp-inputval-cheatsheet]の推奨事項を適用します。


### SSIインジェクション

**攻撃**

**CWEコード:** [CWE-96][cwe-96], [CWE-97][cwe-97]

**Wallarmコード:** `ssi`

**説明:**

[SSI(Server Side Includes)][ssi-wiki]は、ウェブサーバー上のウェブページに一つ以上のファイルを組み込むために最も有用な単純なインタープリタ型のサーバー側スクリプト言語です。ウェブサーバーApacheとNGINXがこれをサポートしています。

SSIインジェクションは、HTMLページへの悪意のあるペイロードの注入や任意のコードのリモート実行により、ウェブアプリケーションを悪用します。これは、アプリケーションで使用されているSSIの操作を通じて、またはユーザー入力フィールドを通じてその使用を強制することにより、悪用可能です。

**例:**

攻撃者は、メッセージの出力を変更し、ユーザーの振る舞いを変更することができます。SSIインジェクションの例：

```bash
<!--#config errmsg="Access denied, please enter your username and password"-->
```

**修正:**

* ユーザー入力に含まれる悪意のあるペイロードの実行を防ぐために、すべてのユーザー入力を洗浄し、フィルタリングします。
* [OWASP入力検証チートシート][link-owasp-inputval-cheatsheet]の推奨事項を適用します。


### マスアサインメント

**攻撃**

**Wallarmコード:** `mass_assignment`

**説明:**

マスアサインメント攻撃では、攻撃者はHTTPリクエストパラメーターをプログラムコードの変数やオブジェクトにバインドしようとします。もしAPIが脆弱でバインドを許可しているなら、攻撃者は公開を意図していない敏感なオブジェクトプロパティを変更することができ、これは特権昇格やセキュリティ機構のバイパスなどを引き起こす可能性があります。

クライアント入力を内部変数やオブジェクトプロパティに適切にフィルタリングせずに変換するAPIは、マスアサインメント攻撃に対して脆弱です。この脆弱性は[OWASP API Top 10 (API6:2019 Mass Assignment)](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa6-mass-assignment.md)に含まれているAPIセキュリティリスクの中でも最も深刻なものの一つです。

リリース4.4.3から、Wallarmはマスアサインメントの試みを軽減します。

**修正:**

APIを保護するため、次の推奨事項を遵守することを推奨します：

* クライアントの入力をコード変数やオブジェクトプロパティに自動的にバインドする関数の使用を避けます。
* クライアントから更新されるべきプロパティのみをホワイトリストに登録し、プライベートプロパティをブラックリスト化するために組み込み関数の機能を使用します。
* 適用可能であれば、入力データペイロードのスキーマを明確に定義し、それを強制します。


### 弱いJWT

**脆弱性**

**CWEコード:** [CWE-1270][cwe-1270], [CWE-1294][cwe-1294]

**Wallarmコード:** `weak_auth`

**説明:**

[JSON Web Token (JWT)](https://jwt.io/)は、APIなどのリソース間でデータを安全に交換するために使用される一般的な認証規格です。

JWTの妨害は、攻撃者の共通の目標であり、認証メカニズムを突破することにより、ウェブアプリケーションとAPIへの完全なアクセスを提供します。JWTが弱いほど、妨害される可能性が高くなります。

**Wallarmの振る舞い:**

フィルタリングノードがバージョン4.4以上であり、[**Weak JWT**トリガー](user-guides/triggers/trigger-examples.md#detect-weak-jwts)が有効にされている場合にのみ、Wallarmは弱いJWTを検出します。

Wallarmは、次の場合にJWTを弱いと見なします：

* 未暗号化 - 署名アルゴリズムが存在しない（`alg`フィールドが`none`または欠落）。
* 強制的な秘密鍵を使用して署名されています。

弱いJWTが検出されると、Wallarmは対応する[脆弱性](user-guides/vulnerabilities.md)を記録します。

**修正:**

* [OWASP JSON Web Tokenチートシート](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)からの推奨事項を適用します
* [あなたのJWT実装が著名な秘密鍵に対して脆弱でないか確認します](https://lab.wallarm.com/340-weak-jwt-secrets-you-should-check-in-your-code/)
### APIの悪用

**攻撃**

**Wallarmのコード:** `api_abuse`

**説明：**

サーバー応答時間の増加、偽アカウントの作成、及びスキャルピングを含む基本的なボットタイプのセット。

**Wallarmの振る舞い：**

フィルタリングノードがバージョン4.2以上でなければ、WallarmはAPIの悪用を検出しません。

[API Abuse Prevention](about-wallarm/api-abuse-prevention.md) モジュールは、以下のボットタイプを検出するために複雑なボット検出モデルを利用します：

* APIの悪用は、通常、悪意のあるトラフィックの急増によって達成される、サーバー応答時間の増加またはサーバーの使用不可を目的としています。
* [偽アカウントの作成](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-019_Account_Creation) および [スパミング](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-017_Spamming) は、通常サービスが使用できなくなる結果ではなく、サポートチームによるリアルユーザーのリクエストの処理やマーケティングチームによるリアルユーザー統計の収集など、通常のビジネスプロセスを遅くしたり、劣化させる偽アカウントの作成または偽コンテンツの確認（例えば、フィードバック）です。
* [スキャルピング](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-005_Scalping)は、ボットがオンラインストアの製品を本物の顧客にとって利用できなくすることが特徴で、例えばすべてのアイテムを予約して在庫切れにさせているが利益を得ていません。

メトリクスがボット攻撃の兆候を示している場合、モジュールは異常なトラフィックの発信元を1時間[denylistまたはgraylist](about-wallarm/api-abuse-prevention.md#reaction-to-malicious-bots)します。

**修復策：**

以下の推奨事項に従うことができます：

* [Webアプリケーションに対する自動化された脅威のOWASPの説明](https://owasp.org/www-project-automated-threats-to-web-applications/)を理解してください。
* アプリケーションとは明らかに関連性のない地域やソース（Torなど）のIPアドレスをdenylistに登録します。
* サーバーサイドでリクエストのレート制限を設定します。
* 追加のCAPTCHAソリューションを利用します。
* ボット攻撃の兆候をアプリケーションの分析で探します。

### APIの悪用 - アカウントの乗っ取り

**攻撃**

**Wallarmのコード:** `api_abuse`

**説明：**

許可も知識もなしに他人のアカウントにアクセスを得るサイバー攻撃の一種。攻撃者がフィッシング、マルウェア、ソーシャルエンジニアリングなどのさまざまな手段を通じてユーザーのログイン認証情報を手に入れるときにこれが発生します。攻撃者がアカウントにアクセスを持つと、センシティブ情報の盗難、詐欺取引の実行、またはスパムやマルウェアの拡散など、さまざまな目的のためにそれを使用することが可能になります。アカウントの乗っ取り攻撃は、個人や事業に深刻な結果をもたらす可能性があり、この中には金融的損失、評判の損害、信頼の喪失が含まれます。

**Wallarmの振る舞い：**

フィルタリングノードがバージョン4.2以上でなければ、WallarmはAPIの悪用を検出しません。

[API Abuse Prevention](about-wallarm/api-abuse-prevention.md) モジュールは、以下のアカウント乗っ取りボットタイプを検出するために複雑なボット検出モデルを使用しています：

* [資格情報のクラッキング](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-007_Credential_Cracking.html)は、有効なアカウントの資格情報を特定するために、アプリケーションの認証プロセスに対して使用される、ブルートフォース、辞書（ワードリスト）および推測攻撃を含みます。
* [資格情報の詰め込み](https://owasp.org/www-community/attacks/Credential_stuffing)は、盗まれたユーザー資格情報を自動的にウェブサイトのログインフォームに注入し、不正にユーザーアカウントへのアクセスを得ることです。

**修復策：**

以下の推奨事項に従うことができます：

* [Webアプリケーションに対する自動化された脅威のOWASPの説明](https://owasp.org/www-project-automated-threats-to-web-applications/)を理解してください。
* 強力なパスワードを使用してください。
* 異なるリソースで同じパスワードを使用しないでください。
* 二要素認証を有効にしてください。
* 追加のCAPTCHAソリューションを利用してください。
* 疑わしい活動をアカウントで監視してください。

### APIの悪用 - セキュリティクローラー

**攻撃**

**Wallarmのコード:** `api_abuse`

**説明：**

セキュリティクローラーは、ウェブサイトをスキャンし、脆弱性とセキュリティ問題を検出するために設計されている一方で、悪意のある目的に利用される可能性があります。悪意のあるアクターが、脆弱なウェブサイトを特定し、それらを自分たちの利益のために悪用するためにそれらを使用する場合があります。

さらに、一部のセキュリティクローラーは設計が不十分であり、サーバーを圧倒したり、クラッシュを引き起こしたり、他の種類の中断を引き起こすことによって無意識にウェブサイトに被害を与える可能性があります。

**Wallarmの振る舞い：**

フィルタリングノードがバージョン4.2以上でなければ、WallarmはAPIの悪用を検出しません。

[API Abuse Prevention](about-wallarm/api-abuse-prevention.md) モジュールは、以下のセキュリティクローラーボットタイプを検出するために複雑なボット検出モデルを利用します：

* [フィンガープリンティング](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-004_Fingerprinting.html)は、アプリケーションのプロファイルを作成するための情報を引き出す特定のリクエストを利用しています。
* [フットプリンティング](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-018_Footprinting.html)は、アプリケーションの構成、設定、およびセキュリティメカニズムについて可能な限り多くの情報を学ぶことを目的とした情報収集です。
* [脆弱性スキャン](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-014_Vulnerability_Scanning)は、サービス脆弱性の検索を特徴としています。

**修復策：**

以下の推奨事項に従うことができます：

* [Webアプリケーションに対する自動化された脅威のOWASPの説明](https://owasp.org/www-project-automated-threats-to-web-applications/)を理解してください。
* SSL証明書を使ってください。
* 追加のCAPTCHAソリューションを利用してください。
* レート制限を実装してください。
* 悪意のある活動を示す可能性のあるパターンを探すためにトラフィックを監視してください。
* robots.txtファイルを使用して、検索エンジンのクローラにどのページを巡回できるか、またはできないかを伝えてください。
* 定期的にソフトウェアを更新してください。
* コンテンツ配信ネットワーク（CDN）を使用してください。

### APIの悪用 - スクレイピング

**攻撃**

**Wallarmのコード:** `api_abuse`

**説明：**

Webスクレイピング、別名データスクレイピングやWebハーベスティング、はウェブサイトから自動的にデータを抽出するプロセスです。ソフトウェアやコードを使用してウェブページからデータを取得・抽出し、それをスプレッドシートやデータベースなどの構造化された形式で保存することが含まれます。

Webスクレイピングは悪意のある目的に使用される可能性があります。例えば、スクレイパーを使用してログイン情報、個人情報、または金融数据など、ウェブサイトからセンシティブ情報を盗みます。また、スクレイパーはスパムを送信したり、ウェブサイトの性能を低下させる方法でデータをスクレイピングしたりするために使用することもでき、サービス妨害（DoS）攻撃を引き起こす可能性があります。

**Wallarmの振る舞い：**

フィルタリングノードがバージョン4.2以上でなければ、WallarmはAPIの悪用を検出しません。

[API Abuse Prevention](about-wallarm/api-abuse-prevention.md) モジュールは、[スクレイピング](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-011_Scraping) ボットタイプを検出するための複雑なボット検出モデルを使用しています。これにより、アプリケーションからアクセス可能なデータおよび/または処理された出力が収集され、非公開または非無料のコンテンツが全ユーザーが利用可能になる可能性があります。

**修復策：**

以下の推奨事項に従うことができます：

* [Webアプリケーションに対する自動化された脅威のOWASPの説明](https://owasp.org/www-project-automated-threats-to-web-applications/)を理解してください。
* 追加のCAPTCHAソリューションを利用してください。
* robots.txtファイルを使用して、検索エンジンのクローラにどのページを巡回できるか、またはできないかを伝えてください。
* 悪意のある活動を示す可能性のあるパターンを探すためにトラフィックを監視してください。
* レート制限を実装してください。
* データを難読化または暗号化します。
* 法的な措置を取ることもできます。

## 特殊な攻撃と脆弱性のリスト

### 仮想パッチ

**攻撃**

**Wallarmのコード:** `vpatch`

**説明：**     

リクエストは、[仮想パッチ機構][doc-vpatch]によって緩和された攻撃の一部である場合、`vpatch`としてマークされます。

### 不適切なXMLヘッダー

**攻撃**

**Wallarmのコード:** `invalid_xml`

**説明：**  

リクエストのボディがXMLドキュメントを含み、ドキュメントのエンコーディングがXMLヘッダーで宣言されたエンコーディングと異なる場合、リクエストは `invalid_xml` とマークされます。

### 計算資源の過剰制限

**攻撃**

**Wallarmのコード:** `overlimit_res`

**説明：**

Wallarmのノードは、リクエストを `overlimit_res` 攻撃とマークする2つのシナリオがあります：

* Wallarmのノードは、受信リクエストの処理に `N` ミリ秒以上を費やすように設定されています（デフォルト値： `1000`）。指定した時間内にリクエストが処理されなかった場合、リクエストの処理が停止し、リクエストは `overlimit_res` 攻撃としてマークされます。

    [ルール **overlimit_res攻撃検出の調整**](user-guides/rules/configure-overlimit-res-detection.md) を使用してカスタムのタイムリミットを指定し、制限超過時のデフォルトのノードの振る舞いを変更することができます。

    リクエストの処理時間を制限することにより、Wallarmノードを狙ったバイパス攻撃が防止されます。場合によっては、 `overlimit_res`とマークされたリクエストは、リクエストの処理時間が長い原因としてWallarmノードモジュールに割り当てられたリソースが不足していることを示す可能性があります。
* リクエストが512 MB以上のgzipファイルをアップロードします。### DDoS（分散型サービス拒否）攻撃

DDoS（分散型サービス拒否）攻撃は、攻撃者が複数のソースからのトラフィックでウェブサイトやオンラインサービスを過負荷にして利用できなくするタイプのサイバー攻撃です。

攻撃者がDDoS攻撃を開始するために使用できる手法は多数あり、使用する方法やツールは大きく異なることがあります。一部の攻撃は比較的簡単で、サーバーへの大量の接続要求の送信などの低レベルの手法を使用しますが、他の攻撃はより高度で、IPアドレスのなりすましやネットワークインフラの脆弱性を悪用するなどの複雑な戦術を使用します。

[DDoS攻撃から資源を保護するためのガイドをお読みください](admin-en/configuration-guides/protecting-against-ddos.md)