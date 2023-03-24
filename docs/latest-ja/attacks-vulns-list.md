					#   攻撃と脆弱性のタイプ

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

[link-ptrav-mitigation]:                    https://www.checkmarx.com/knowledge/knowledgebase/path-traversal
[link-wl-process-time-limit-directive]:     admin-en/configure-parameters-en.md#wallarm_process_time_limit

[doc-vpatch]:   user-guides/rules/vpatch-rule.md

[anchor-main-list]:     #the-main-list-of-attacks-and-vulnerabilities        
[anchor-special-list]:  #the-list-of-special-attacks-and-vulnerabilities

[anchor-brute]: #bruteforce-attack
[anchor-rce]:   #remote-code-execution-rce
[anchor-ssrf]:  #server-side-request-forgery-ssrf

[link-imap-wiki]:                                https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol
[link-smtp-wiki]:                                https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol
[ssi-wiki]:     https://en.wikipedia.org/wiki/Server_Side_Includes
[link-owasp-csrf-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html

Wallarmフィルタリングノードは、多くの攻撃と脆弱性を検出することができます。これらの攻撃と脆弱性は[下記][anchor-main-list]にリストされています。

リスト内の各エンティティは、

* **攻撃**、**脆弱性**、または両方のタグが付けられています。

    特定の攻撃の名前は、この攻撃が悪用する脆弱性の名前と同じ場合があります。この場合、そのようなエンティティには、組み合わせた**脆弱性/攻撃**タグが付けられます。

* このエンティティに対応するWallarmコード。

このリストにあるほとんどの脆弱性と攻撃は、ソフトウェアの弱点タイプのリスト（[Common Weakness Enumeration][link-cwe]またはCWEとしても知られています）からの1つまたは複数のコードが付随しています。

さらに、Wallarmフィルタリングノードは、処理済みのトラフィックをマークする内部目的で、いくつかの特別な攻撃と脆弱性のタイプを使用しています。このようなエンティティはCWEコードには付随しておらず、[別個にリストされています][anchor-special-list]。

??? info "動画を見て、WallarmがOWASPトップ10に対してどのように保護するかを学びましょう"
    <div class="video-wrapper">
    <iframe width="1280" height="720" src="https://www.youtube.com/embed/27CBsTQUE-Q" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>

## 攻撃と脆弱性の主なリスト

### XML外部エンティティ（XXE）への攻撃

**脆弱性/攻撃**

**CWEコード：** [CWE-611][cwe-611]

**Wallarmコード：** `xxe`

**説明：**

XXE脆弱性により、攻撃者はXMLパーサーによって評価されるXMLドキュメントに外部エンティティを注入し、その後、ターゲットのWebサーバー上で実行できます。

成功した攻撃の結果、攻撃者は以下のことができます。

*   Webアプリケーションの機密データにアクセスする
*   内部データネットワークをスキャンする
*   Webサーバーにあるファイルを読む
*   [SSRF][anchor-ssrf]攻撃を行う
*   サービス拒否（DoS）攻撃を行う

この脆弱性は、WebアプリケーションにおけるXML外部エンティティの解析に制限がないために発生します。

**対策：**

以下の対策を講じることができます。

*   ユーザーから提供されたXMLドキュメントを操作する際に、XML外部エンティティの解析を無効にします。
*   [OWASP XXE Prevention Cheat Sheet][link-owasp-xxe-cheatsheet]の推奨事項を適用します。### 総当たり攻撃

**攻撃**

**CWEコード：** [CWE-307][cwe-307]、[CWE-521][cwe-521]、[CWE-799][cwe-799]

**Wallarmコード：** `brute`

**説明：**

総当たり攻撃は、予め定義されたペイロードを含む大量のリクエストがサーバに送信される攻撃です。これらのペイロードは、何らかの手段で生成されるか、辞書から取り出されます。次に、サーバの応答が分析され、ペイロード内のデータの正しい組み合わせが見つかります。

成功した総当たり攻撃は、認証や認可メカニズムをバイパスしたり、ウェブアプリケーションの隠しリソース（ディレクトリ、ファイル、ウェブサイトの一部など）を明らかにしたりできるため、他の悪意のある行為を実行できるようになります。

**修復：**

以下の対策を講じることができます。

*   ウェブアプリケーションに対する一定期間内のリクエスト数を制限する。
*   ウェブアプリケーションに対する認証/認可試行回数を一定期間内に制限する。
*   失敗した試行回数が一定数に達した後、新たな認証/認可試行をブロックする。
*   ウェブアプリケーションがそれが実行されるサーバ上のファイルやディレクトリにアクセスできないように制限する。ただし、アプリケーションの範囲内のものに限ります。

[総当たり攻撃からアプリケーションを保護するためのWallarmソリューションの設定方法→](admin-en/configuration-guides/protecting-against-bruteforce.md)

### リソーススキャン

**攻撃**

**CWEコード：** なし

**Wallarmコード：** `scanner`

**説明：**

この`scanner`コードは、保護されたリソースを攻撃またはスキャンすることを目的としたサードパーティのスキャナーソフトウェアの活動の一部であると考えられるHTTPリクエストに割り当てられます。Wallarm Scannerのリクエストは、リソーススキャン攻撃とは見なされません。この情報は後でこれらのサービスを攻撃するために使用される可能性があります。

**修復：**

以下の対策を講じることができます。

*   IPアドレスの許可リストや拒否リスト、認証/認可メカニズムを使用して、ネットワークパラメータのスキャンの可能性を制限する。
*   ネットワークパラメータをファイアウォールの後ろに置くことで、スキャン面積を最小化する。
*   サービスの運用に必要かつ十分なポートのセットを定義する。
*   ネットワークレベルでICMPプロトコルの使用を制限する。
*   定期的にITインフラストラクチャ機器を更新する。これには以下が含まれます。

    *   サーバーやその他の機器のファームウェア
    *   オペレーティングシステム
    *   その他のソフトウェア

### サーバサイドテンプレートインジェクション（SSTI）

**脆弱性/攻撃**

**CWEコード：** [CWE-94][cwe-94]、[CWE-159][cwe-159]

**Wallarmコード：** `ssti`

**説明：**

攻撃者は、SSTI攻撃に脆弱なウェブサーバ上のユーザー入力フォームに実行可能なコードを注入することができます。そのコードはウェブサーバによって解析され実行されます。

成功した攻撃によって、脆弱なウェブサーバは完全に危険にさらされ、攻撃者が任意のリクエストを実行したり、サーバのファイルシステムを調査したり、一定の条件下でリモートで任意のコードを実行したり（[RCE攻撃][anchor-rce]を参照してください）、さまざまな他のことを行ったりする可能性があります。

この脆弱性は、ユーザー入力の検証と解析が不適切であることが原因です。

**修復：**

すべてのユーザー入力を洗浄し、フィルタリングして、入力内のエンティティが実行されないようにすることをお勧めします。

### データボム

**攻撃**

**CWEコード：** [CWE-409][cwe-409]、[CWE-776][cwe-776]

**Wallarmコード：** `data_bomb`

**説明：**

Wallarmは、ZipまたはXMLボムを含むリクエストをデータボム攻撃としてマークします。

* [Zipボム](https://en.wikipedia.org/wiki/Zip_bomb)：プログラムやシステムをクラッシュさせるか無用にするよう設計された悪意のあるアーカイブファイルです。Zipボムは、プログラムが予定どおりに動作するように許可しますが、解凍に膨大な時間、ディスク容量、メモリが必要となるようにアーカイブが調整されています。
* [XMLボム（1000000000回の笑い攻撃）](https://en.wikipedia.org/wiki/Billion_laughs_attack)：XML文書のパーサーを狙ったDoS攻撃の一種です。攻撃者はXML実体に悪意のあるペイロードを送信します。

    例えば、「entityOne」は20の「entityTwo」として定義され、それ自体が20の「entityThree」として定義されます。このパターンが「entityEight」まで続いた場合、XMLパーサは「entityOne」の1回の発生を5GBのメモリを持つ1,280,000,000の「entityEight」に展開します。

**修復：**

システムに害を及ぼさないよう、着信リクエストのサイズを制限します。

### クロスサイトスクリプティング（XSS）

**脆弱性/攻撃**

**CWEコード：** [CWE-79][cwe-79]

**Wallarmコード：** `xss`

**説明：**

クロスサイトスクリプティング攻撃では、攻撃者がユーザーのブラウザで準備された任意のコードを実行できます。

XSS攻撃には以下のようなタイプがあります。

*   Stored XSS：悪意のあるコードが事前にウェブアプリケーションのページに埋め込まれています。

    ウェブアプリケーションがStored XSS攻撃に対して脆弱である場合、攻撃者はウェブアプリケーションのHTMLページに悪意のあるコードを注入することができます。さらに、このコードは持続的に存在し、感染したウェブページを要求するすべてのユーザーのブラウザで実行されます。

*   Reflected XSS：攻撃者がユーザーに特別に作成されたリンクを開くように仕向ける攻撃です。

*   DOMベースのXSS：ウェブアプリケーションのページに組み込まれたJavaScriptコードスニペットが、このコードスニペット内のエラーのために入力を解析し、それをJavaScriptコマンドとして実行します。

上記の脆弱性のいずれかを悪用すると、任意のJavaScriptコードが実行されます。XSS攻撃が成功した場合、攻撃者はユーザーのセッションや資格情報を盗むことができるほか、ユーザーに代わってリクエストを行ったり、その他の悪意のある行為を行ったりすることができます。

このクラスの脆弱性は、ユーザー入力の検証と解析が不適切であるために発生します。

**修復：**

以下の対策を講じることができます。

*   ウェブアプリケーションが入力として受け取るすべてのパラメータを洗浄し、フィルタリングして、入力内のエンティティが実行されないようにする。
*   ウェブアプリケーションのページを構成する際に、動的に形成されるエンティティを洗浄し、エスケープする。
*   [OWASP XSS Prevention Cheat Sheet][link-owasp-xss-cheatsheet]の推奨事項を適用する。

### Broken Object Level Authorization (BOLA)

**脆弱性/攻撃**

**CWEコード：** [CWE-639][cwe-639]

**Wallarmコード：** インジェクションに対しては`idor`、バイパスに対しては`bola`

**説明：**

攻撃者は、リクエスト内で送信されるオブジェクトのIDを操作することで、Broken Object Level Authorizationに脆弱なAPIエンドポイントを悪用することができます。これにより、機密データへの認証を回避する可能性があります。

この問題は、APIベースのアプリケーションでは非常に一般的であり、サーバコンポーネントが通常、クライアントの状態を完全に追跡せず、代わりに、オブジェクトIDなどのパラメータによって、どのオブジェクトにアクセスするかを決定します。

APIエンドポイントのロジックに応じて、攻撃者はウェブアプリケーション、API、ユーザーのデータを参照するだけでなく、それらを変更することもできます。

この脆弱性は、IDOR（Insecure Direct Object Reference）としても知られています。

[脆弱性に関する詳細](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa1-broken-object-level-authorization.md)

**修復：**

* ユーザーポリシーと階層に基づく適切な認証メカニズムを実装する。
* オブジェクトのIDとして、ランダムで予測不可能な値を使用することを推奨します（[GUID](https://ru.wikipedia.org/wiki/GUID)など）。
* 認証メカニズムを評価するためのテストを作成する。テストに失敗する脆弱な変更をデプロイしないようにする。

**Wallarmの挙動：**

* Wallarmはこのタイプの脆弱性を自動的に発見します。
* Wallarmは、この脆弱性を悪用する攻撃をデフォルトで検出しません。BOLA攻撃の検出とブロックを行うために、[**BOLA**トリガ](admin-en/configuration-guides/protecting-against-bola.md)を設定してください。### オープンリダイレクト

**攻撃**

**CWEコード：** [CWE-601][cwe-601]

**Wallarmコード：** `redir`

**説明：**

攻撃者は、オープンリダイレクト攻撃を使用して、ユーザーを合法的なWebアプリケーションを経由して悪意のあるWebページにリダイレクトできます。

この攻撃に対する脆弱性は、URL入力の誤ったフィルタリングによって発生します。

**対策：**

以下の対策を講じることができます：

* ウェブアプリケーションが受け取るすべてのパラメータを、入力内のエンティティが実行されないようにクレンジングおよびフィルタリングしてください。
* ユーザーにすべての保留中のリダイレクトについて通知し、明示的な許可を求めます。

### サーバーサイドリクエストフォージェリ（SSRF）

**脆弱性/攻撃**

**CWEコード：** [CWE-918][cwe-918]

**Wallarmコード：** `ssrf`

**説明：**

SSRF攻撃が成功すると、攻撃者が攻撃されたWebサーバーに代わってリクエストを行い、Webアプリケーションの使用中のネットワークポートの開示、内部ネットワークのスキャン、および承認のバイパスにつながる可能性があります。

リリース4.4.3から、WallarmはSSRF攻撃の試みを緩和します。 SSRFの脆弱性は、[サポートされているすべてのWallarmバージョン](updating-migrating/versioning-policy.md)によって検出されます。

**対策：**

以下の対策を講じることができます：

* ウェブアプリケーションが受け取るすべてのパラメータを、入力内のエンティティが実行されないようにクレンジングおよびフィルタリングしてください。
* [OWASP SSRF予防チートシート][link-owasp-ssrf-cheatsheet]からの推奨事項を適用してください。

### クロスサイトリクエストフォージェリ（CSRF）

**脆弱性**

**CWEコード：** [CWE-352][cwe-352]

**Wallarmコード：** `csrf`

**説明：**

クロスサイトリクエストフォージェリ（CSRF）は、現在認証されているWebアプリケーションでエンドユーザーによって実行された望まないアクションを強制する攻撃です。ソーシャルエンジニアリング（メールやチャットでのリンク送信など）の助けを借りて、攻撃者はWebアプリケーションのユーザーをだまして、攻撃者が選択したアクションを実行させることができます。

対応する脆弱性は、ユーザーのブラウザがクロスサイトリクエストを実行する際に、対象ドメイン名に設定されているユーザーのセッションCookieを自動的に追加するために発生します。

ほとんどのサイトでは、これらのCookieにはサイトに関連する認証情報が含まれます。したがって、ユーザーが現在サイトに認証されている場合、サイトは被害者が送信する偽造リクエストと正当なリクエストを区別することができません。

その結果、攻撃者は、認証済みの合法ユーザーとして偽装して、悪意のあるWebサイトから脆弱なWebアプリケーションへリクエストを送信できます。攻撃者はそのユーザーのCookieにアクセスする必要はありません。

**Wallarmの動作：**

WallarmはCSRFの脆弱性を発見するだけであり、CSRFの攻撃を検出およびブロックしません。CSRFの問題は、コンテンツセキュリティポリシー（CSP）を介してすべての最新ブラウザで解決されています。

**対策：**

CSRFはブラウザで解決されるため、他の保護方法はそれほど有用ではありませんが、まだ使用することができます。

以下の対策を講じることができます：

* CSRF対策を行うためのアンチ-CSRF保護機構（CSRFトークンなど）を導入します。
* `SameSite`クッキー属性を設定します。
* [OWASP CSRF予防チートシート][link-owasp-csrf-cheatsheet]からの推奨事項を適用してください。

### 強制ブラウジング

**攻撃**

**CWEコード：** [CWE-425][cwe-425]

**Wallarmコード：** `dirbust`

**説明：**

この攻撃は、ブルートフォース攻撃のクラスに属します。この攻撃の目的は、Webアプリケーションの隠されたリソース、つまりディレクトリとファイルを検出することです。これは、いくつかのテンプレートに基づいて生成されるか、準備された辞書ファイルから抽出されるファイル名とディレクトリ名を試すことによって達成されます。

強制ブラウジング攻撃が成功すると、Webアプリケーションのインターフェースから明示的に利用できない隠されたリソースへのアクセスが潜在的に許可されますが、直接アクセスすると公開されます。

**対策：**

以下の対策を講じることができます：

* ユーザーが直接アクセスすることが許可されていないリソースへのアクセスを制限または制限します（たとえば、認証または承認メカニズムを使用します）。
* 一定期間内にWebアプリケーションでリクエストの数を制限します。
* 一定期間内にWebアプリケーションで認証/承認の試行回数を制限します。
* 一定数の失敗した試行後に、新しい認証/承認試行をブロックします。
* Webアプリケーションのファイルとディレクトリに必要かつ十分なアクセス権を設定します。

[Wallarmソリューションを使用して、ブルートフォースからアプリケーションを保護する方法について→](admin-en/configuration-guides/protecting-against-bruteforce.md)

### 情報の晒し出し

**脆弱性/攻撃**

**CWEコード：** [CWE-200][cwe-200]（詳細：[CWE-209][cwe-209]、[CWE-215][cwe-215]、[CWE-538][cwe-538]、[CWE-541][cwe-541]、[CWE-548][cwe-548]）

**Wallarmコード：** `infoleak`

**説明：**

アプリケーションは故意または無意識のうちに、アクセスを許可されていない対象に機密情報を開示します。

このタイプの脆弱性は、[パッシブ検出](about-wallarm/detecting-vulnerabilities.md#passive-detection)の方法でのみ検出できます。リクエストへの応答が機密情報を開示している場合、Wallarmはインシデントと**情報の晒し出し**タイプのアクティブ脆弱性を記録します。Wallarmが検出できる機密情報の種類には、以下のものがあります。

* システムおよび環境の状態（例：スタックトレース、警告、致命的なエラー）
* ネットワークの状態および構成
* アプリケーションコードまたは内部状態
* メタデータ（例：接続のログ記録やメッセージヘッダー）

**対策：**

ウェブアプリケーションが機密情報を表示する機能を持たせないようにする対策を講じることができます。

### 脆弱なコンポーネント

**脆弱性**

**CWEコード：** [CWE-937][cwe-937]、[CWE-1035][cwe-1035]、[CWE-1104][cwe-1104]

**Wallarmコード：** `vuln_component`

**説明：**

ウェブアプリケーションやAPIが脆弱であるか、時代遅れのコンポーネントを使用している場合、この脆弱性が発生します。これには、OS、Web/アプリケーションサーバー、データベース管理システム（DBMS）、ランタイム環境、ライブラリや他のコンポーネントが含まれます。

この脆弱性は、[A06：2021 - 脆弱で古いコンポーネント](https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components)でマッピングされています。

**対策：**

アプリケーションやAPIの更新および構成変更を監視し、適時適用することを推奨します。

* 未使用の依存関係、不要な機能、コンポーネント、ファイル、およびドキュメントを削除します。
* OWASP Dependency Check、retire.jsなどのツールを使用して、クライアントサイド・サーバーサイドのコンポーネント（フレームワーク、ライブラリ）および依存関係のバージョンを継続的に調査します。
* コンポーネントの脆弱性に関する情報源（CVE、NVD）を継続的に監視します。
* 公式な情報源から安全なリンクを介してコンポーネントを入手してください。署名されたパッケージを好むことで、改変された悪意のあるコンポーネントが含まれる可能性を減らすことができます。
* ライブラリおよびコンポーネントが保守されていないか、古いバージョンに対してセキュリティパッチが作成されていないかを監視してください。パッチが適用できない場合は、仮想パッチを展開し、発見された問題に対して監視、検出、保護することを検討してください。### リモートコード実行（RCE）

**脆弱性/攻撃**

**CWEコード：** [CWE-78][cwe-78]、[CWE-94][cwe-94] およびその他

**Wallarmコード：** `rce`

**説明：**

攻撃者は、リクエストに悪意のあるコードを挿入して、ウェブアプリケーションに送信できます。そして、アプリケーションはこのコードを実行します。また、攻撃者は、脆弱なWebアプリケーションが実行されているオペレーティングシステムの特定のコマンドを実行しようとすることもできます。

RCE攻撃が成功すると、攻撃者は以下のような幅広いアクションを実行できます。

* 脆弱なウェブアプリケーションのデータの機密性、アクセシビリティ、および完全性を侵害する。
* ウェブアプリケーションが実行されているオペレーティングシステムとサーバーを制御する。
* その他の可能なアクション。
 
この脆弱性は、ユーザー入力の不正確な検証および解析によって発生します。

**対策：**

すべてのユーザー入力をサニタイズおよびフィルタリングして、入力内のエンティティが実行されないようにすることをお勧めします。

### 認証バイパス

**脆弱性**

**CWEコード：** [CWE-288][cwe-288]

**Wallarmコード：** `auth`

**説明：**

ウェブアプリケーションに認証メカニズムが存在していても、主要な認証メカニズムをバイパスするか、その脆弱性を悪用する代替認証方法が存在する可能性があります。これらの要素の組み合わせにより、攻撃者がユーザーまたは管理者権限でアクセスする可能性があります。

認証バイパス攻撃が成功すると、ユーザーの機密データが漏えいしたり、脆弱なアプリケーションを管理者権限で制御したりする可能性があります。

**対策：**

以下の推奨事項に従ってください。

* 既存の認証メカニズムを改善および強化する。
* 攻撃者が事前に定義されたメカニズムを経由して必要な認証手順をバイパスしてアプリケーションにアクセスできるようにする、代替認証方法を排除する。
* [OWASP Authentication Cheat Sheet][link-owasp-auth-cheatsheet] の推奨事項を適用する。

### CRLFインジェクション

**脆弱性/攻撃**

**CWEコード：** [CWE-93][cwe-93]

**Wallarmコード：** `crlf`

**説明：**

CRLFインジェクションは、攻撃者がキャリッジリターン（CR）およびラインフィード（LF）文字をサーバーへのリクエスト（例：HTTPリクエスト）に挿入できるようにする攻撃のクラスを表します。

CR / LF文字の挿入は他の要因と組み合わせることで、さまざまな脆弱性（例：HTTPレスポンス分割[CWE-113][cwe-113]、HTTPレスポンス密輸[CWE-444][cwe-444]）を悪用できます。

CRLFインジェクション攻撃が成功すると、攻撃者はファイアウォールをバイパスしたり、キャッシュを毒素化したり、正当なWebページを悪意のあるものに置き換えたり、「オープンリダイレクト」攻撃を実行したり、その他多数のアクションを実行できるようになります。

この脆弱性は、ユーザー入力の不正確な検証および解析によって発生します。

**対策：**

すべてのユーザー入力をサニタイズおよびフィルタリングして、入力内のエンティティが実行されないようにすることをお勧めします。

### LDAPインジェクション

**脆弱性/攻撃**

**CWEコード：** [CWE-90][cwe-90]

**Wallarmコード：** `ldapi`

**説明：**

LDAPインジェクションは、攻撃者がLDAPサーバーへのリクエストを変更することでLDAP検索フィルタを変更できるようにする攻撃のクラスを表します。

LDAPインジェクション攻撃が成功すると、LDAPユーザーおよびホストの機密データに対する読み取りおよび書き込み操作にアクセスが許可される可能性があります。

この脆弱性は、ユーザー入力の不正確な検証および解析によって発生します。

**対策：**

以下の推奨事項に従ってください。

* ウェブアプリケーションが入力として受け取るすべてのパラメータをサニタイズおよびフィルタリングして、入力内のエンティティが実行されないようにする。
* [OWASP LDAP Injection Prevention Cheat Sheet][link-owasp-ldapi-cheatsheet] の推奨事項を適用する。

### NoSQLインジェクション

**脆弱性/攻撃**

**CWEコード：** [CWE-943][cwe-943]

**Wallarmコード：** `nosqli`

**説明：**

この攻撃の脆弱性は、ユーザー入力の不十分なフィルタリングによって発生します。NoSQLインジェクション攻撃は、NoSQLデータベースに特別に作成されたクエリを挿入することで実行されます。

**対策：**

すべてのユーザー入力をサニタイズおよびフィルタリングして、入力内のエンティティが実行されないようにすることをお勧めします。

### パストラバーサル

**脆弱性/攻撃**

**CWEコード：** [CWE-22][cwe-22]

**Wallarmコード：** `ptrav`

**説明：**

パストラバーサル攻撃により、攻撃者は、ウェブアプリケーションのパラメータを介してファイルやディレクトリを要求する際に、ユーザー入力のフィルタリングが不十分であることを利用して、脆弱なウェブアプリケーションが存在するファイルシステム内の機密データを格納しているファイルやディレクトリにアクセスできます。

**対策：**

以下の推奨事項に従ってください。

* ウェブアプリケーションが入力として受け取るすべてのパラメータをサニタイズおよびフィルタリングして、入力内のエンティティが実行されないようにする。
* この種の攻撃を軽減するための追加の推奨事項が [こちら][link-ptrav-mitigation] にあります。

### SQLインジェクション

**脆弱性/攻撃**

**CWEコード：** [CWE-89][cwe-89]

**Wallarmコード：** `sqli`

**説明：**

この攻撃の脆弱性は、ユーザー入力の不十分なフィルタリングによって発生します。SQLインジェクション攻撃は、SQLデータベースに特別に作成されたクエリを挿入することで実行されます。

SQLインジェクション攻撃によって、攻撃者は機密データの読取りおよび変更を許可される可能性があります。また、DBMS管理者権限も取得できる可能性があります。

**対策：**

以下の推奨事項に従ってください。

* ウェブアプリケーションが入力として受け取るすべてのパラメータをサニタイズおよびフィルタリングして、入力内のエンティティが実行されないようにする。
* [OWASP SQL Injection Prevention Cheat Sheet][link-owasp-sqli-cheatsheet] の推奨事項を適用する。

### メールインジェクション

**攻撃**

**CWEコード：** [CWE-20][cwe-20], [CWE-150][cwe-150], [CWE-88][cwe-88]

**Wallarmコード：** `mail_injection`

**説明：**

メールインジェクションは、悪意のある [IMAP][link-imap-wiki] / [SMTP][link-smtp-wiki] 式で、通常はWebアプリケーションのコンタクトフォームを介して送信され、標準のメールサーバーの動作を変更します。

この攻撃の脆弱性は、連絡先フォームに入力されたデータの検証が不十分であるために発生します。メールインジェクションを使用して、メールクライアントの制限を回避し、ユーザーデータが盗まれることを防ぎ、スパムを送信します。

**対策：**

* すべてのユーザー入力をサニタイズおよびフィルタリングして、入力内の悪意のあるペイロードが実行されないようにする。
* [OWASP Input Validation Cheatsheet][link-owasp-inputval-cheatsheet] の推奨事項を適用する。

### SSIインジェクション

**攻撃**

**CWEコード：** [CWE-96][cwe-96], [CWE-97][cwe-97]

**Wallarmコード：** `ssi`

**説明：**

[SSI（Server Side Includes）][ssi-wiki]は、ウェブサーバー上のウェブページに1つ以上のファイルの内容を含めるのに最も便利な簡単な解釈されたサーバーサイドスクリプト言語です。これは、ウェブサーバーApacheおよびNGINXでサポートされています。

SSIインジェクションは、HTMLページに悪意のあるペイロードを挿入することでウェブアプリケーションを悪用したり、任意のコードをリモートで実行したりします。アプリケーションで使用されているSSIを操作するか、ユーザー入力フィールドを介してその使用を強制することで悪用できます。

**例：**

攻撃者はメッセージの出力を変更し、ユーザーの動作を変更することができます。SSIインジェクションの例：

```bash
<!--#config errmsg="Access denied, please enter your username and password"-->
```

**対策：**

* すべてのユーザー入力をサニタイズおよびフィルタリングして、入力内の悪意のあるペイロードが実行されないようにする。
* [OWASP Input Validation Cheatsheet][link-owasp-inputval-cheatsheet] の推奨事項を適用する。### Mass Assignment

**攻撃**

**Wallarm コード：** `mass_assignment`

**説明：**

Mass Assignment 攻撃では、攻撃者はHTTPリクエストパラメータをプログラムコード変数またはオブジェクトにバインドしようとします。APIが脆弱でバインディングを許可している場合、攻撃者は公開する意図のない機密オブジェクトプロパティを変更して、権限のエスカレーションやセキュリティ機構のバイパスなどの結果を引き起こす可能性があります。

Mass Assignment 攻撃に脆弱な API は、適切なフィルタリングなしにクライアント入力を内部変数またはオブジェクトプロパティに変換することを許可します。この脆弱性は、[OWASP API Top 10 (API6:2019 Mass Assignment)](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa6-mass-assignment.md) API セキュリティリスクの最も深刻なリストに含まれています。

リリース 4.4.3 から、Wallarm は Mass Assignment の試みを緩和します。

**対策：**

API を保護するために、以下の推奨事項に従うことができます。

* クライアントの入力をコード変数またはオブジェクトプロパティに自動的にバインドする関数の使用を避けます。
* 組み込みの関数機能を使用して、クライアントによって更新されるべきプロパティのみをホワイトリストに登録し、プライベートプロパティをブラックリストに登録します。
* 可能であれば、入力データペイロードのスキーマを明示的に定義し、強制します。

### Weak JWT

**脆弱性**

**CWE コード：** [CWE-1270][cwe-1270], [CWE-1294][cwe-1294]

**Wallarm コード：** `weak_auth`

**説明：**

[JSON Web Token (JWT)](https://jwt.io/) は、API などのリソース間でデータを安全に交換するために使用される一般的な認証標準です。

JWT の妥協は、攻撃者にとって一般的な目標であり、認証メカニズムの突破は、 Webアプリケーション や API への完全なアクセスを提供します。JWT が弱いほど、妥協する可能性が高くなります。

**Wallarm の動作：**

Wallarm は、フィルタリングノードがバージョン4.4以上であり、[**Weak JWT** トリガー](user-guides/triggers/trigger-examples.md#detect-weak-jwts)が有効になっている場合にのみ、弱い JWT を検出します。

Wallarm が対象とする弱い JWT には次のものが含まれます。

* 暗号化されていない - 署名アルゴリズムがない（`alg`フィールドが`none`または欠落している）。
* 妥協した秘密鍵を使用して署名されている。

弱い JWT が検出されると、Wallarm は対応する[脆弱性](user-guides/vulnerabilities/check-vuln.md) を記録します。

**対策：**

* [OWASP JSON Web Token Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)の推奨事項を適用します
* [JWT 実装が著名なシークレットに対して脆弱であるかどうかを確認](https://lab.wallarm.com/340-weak-jwt-secrets-you-should-check-in-your-code/)

### API abuse

**攻撃**

**Wallarm コード：** `api_abuse`

**説明：**

サーバー応答時間の増加、偽アカウントの作成、そしてスカルピングを含む基本的なボットタイプのセット。

**Wallarm の動作：**

Wallarm は、フィルタリングノードがバージョン 4.2 以降である場合にのみ、API の乱用を検出します。

[API Abuse Prevention](about-wallarm/api-abuse-prevention.md) モジュールは、複雑なボット検出モデルを使用して、次のボットタイプを検出します。

* サーバー応答時間の増加やサーバーの利用不可を狙った API の乱用。通常、悪意のあるトラフィックのピークによって実現されます。
* [偽アカウント作成](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-019_Account_Creation) および [スパミング](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-017_Spamming) は、偽のアカウントの作成や偽コンテンツ（評価など）の承認です。通常、サービスの利用不可にはつながらないが、通常のビジネスプロセスを遅くするか、劣化させるために行われます。例えば：

    * サポートチームによる本物のユーザーリクエストの処理
    * マーケティングチームによる本物のユーザー統計の収集

* [スカルピング](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-005_Scalping) は、ボットがオンラインストアの商品を本当の顧客に利用できなくすることを特徴としています。たとえば、すべてのアイテムを予約して在庫切れにし、利益を上げないようにします。

メトリックがボット攻撃の兆候を示している場合、モジュールは異常なトラフィックの送信元を1時間[denylist または graylist](about-wallarm/api-abuse-prevention.md#reaction-to-malicious-bots) に登録します。

**対策：**

次の推奨事項に従うことができます。

* Web アプリケーションでの自動化された脅威に関する [OWASP の説明](https://owasp.org/www-project-automated-threats-to-web-applications/) を理解する。
* アプリケーションに関係のない地域やソース（Tor など）の IP アドレスを denylist に追加します。
* サーバー側のレート制限を設定します。
* 追加の CAPTCHA ソリューションを使用します。
* アプリケーションの分析でボット攻撃の兆候を検索します。

### API abuse - アカウントの乗っ取り

**攻撃**

**Wallarm コード：** `api_abuse`

**説明：**

誰か他の人のアカウントへのアクセス権を、その人の許可や認識なしに取得するサイバー攻撃のタイプです。これは、攻撃者がフィッシング、マルウェア、ソーシャルエンジニアリングなどの手段でユーザーのログイン資格情報を取得した場合に発生することがあります。アカウントにアクセスできるようになると、攻撃者は機密情報の盗み、不正取引の実施、スパムやマルウェアの拡散など、様々な目的でそれを利用することができます。アカウントの乗っ取り攻撃は、個人や企業に対して深刻な結果を引き起こす可能性があります。例えば、金銭的損失、評判の損傷、信頼の喪失などです。

**Wallarm の動作：**

Wallarm は、フィルタリングノードがバージョン 4.2 以降である場合にのみ、API の乱用を検出します。

[API Abuse Prevention](about-wallarm/api-abuse-prevention.md) モジュールは、複雑なボット検出モデルを使用して、次のアカウントの乗っ取りボットタイプを検出します。

* [クレデンシャルクラッキング](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-007_Credential_Cracking.html) は、アプリケーションの認証プロセスに対して使われる、ブルートフォース攻撃、辞書（単語リスト）攻撃、および推測攻撃を含みます。これにより、有効なアカウント資格情報が特定されます。
* [Credential stuffing](https://owasp.org/www-community/attacks/Credential_stuffing) は、ウェブサイトのログインフォームに盗まれたユーザー資格情報を自動的に挿入することで、不正にユーザーアカウントへのアクセスを得ることです。

**対策：**

次の推奨事項に従うことができます。

* Web アプリケーションでの自動化された脅威に関する [OWASP の説明](https://owasp.org/www-project-automated-threats-to-web-applications/) を理解する。
* 強力なパスワードを使用する。
* 異なるリソースに同じパスワードを使用しない。
* 2要素認証を有効にする。
* 追加の CAPTCHA ソリューションを使用する。
* 不審なアクティビティのあるアカウントを監視する。### API abuse - セキュリティクローラ

**攻撃**

**Wallarmコード:** `api_abuse`

**説明:**

セキュリティクローラは、Webサイトをスキャンし、脆弱性やセキュリティ問題を検出するように設計されていますが、悪意のある目的で使用されることもあります。悪意のある者は、脆弱なWebサイトを特定し、自分の利益のためにそれらを悪用するために使用することがあります。

さらに、セキュリティクローラの一部は設計が不十分で、サーバーへの負荷が高すぎたり、クラッシュを引き起こしたり、その他のタイプの障害を引き起こすことによって、過ちのないWebサイトに損害を与える可能性があります。

**Wallarmの動作:**

Wallarmは、フィルタリングノードがバージョン4.2以上である場合にのみ、APIの悪用を検出します。

[API Abuse Prevention](about-wallarm/api-abuse-prevention.md)モジュールは、以下のセキュリティクローラボットタイプを検出するために、複雑なボット検出モデルを使用しています。

* [Fingerprinting](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-004_Fingerprinting.html)は、アプリケーションをプロファイル化するために情報を引き出すためにアプリケーションに送信される特定のリクエストを悪用します。
* [Footprinting](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-018_Footprinting.html)は、アプリケーションの構成、設定、およびセキュリティメカニズムについて可能な限り多くの情報を収集することを目的とした情報収集です。
* [Vulnerability scanning](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-014_Vulnerability_Scanning)は、サービスの脆弱性を探すことに特徴づけられています。

**対策:**

以下の推奨事項に従ってください。

* Webアプリケーションに対する [OWASP description for automated threats](https://owasp.org/www-project-automated-threats-to-web-applications/) に精通してください。
* SSL証明書を使用してください。
* 追加のCAPTCHAソリューションを使用してください。
* レート制限を実装してください。
* 悪意のある活動を示唆するパターンを探すためにトラフィックを監視してください。
* robots.txtファイルを使用して、検索エンジンクローラがクロールできるページとクロールできないページを指定してください。
* 定期的にソフトウェアを更新してください。
* コンテンツ配信ネットワーク（CDN）を使用してください。

### API abuse - スクレイピング

**攻撃**

**Wallarmコード:** `api_abuse`

**説明:**

Webスクレイピング（データスクレイピングやWebハーベスティングとも呼ばれる）は、Webサイトから自動的にデータを抽出するプロセスです。Webページからデータを取得および抽出し、スプレッドシートやデータベースなどの構造化された形式で保存するために、ソフトウェアやコードを使用します。

Webスクレイピングは、悪意のある目的で使用されることがあります。たとえば、スクレイパーは、Webサイトからログイン認証情報、個人情報、または財務データなどの機密情報を盗むために使用されることがあります。スクレイパーはまた、パフォーマンスを低下させる方法でWebサイトからデータをスパムやスクレイピングするために使用され、サービス拒否（DoS）攻撃を引き起こす可能性があります。

**Wallarmの動作:**

Wallarmは、フィルタリングノードがバージョン4.2以上である場合にのみ、APIの悪用を検出します。

[API Abuse Prevention](about-wallarm/api-abuse-prevention.md)モジュールは、複雑なボット検出モデルを使用して、アプリケーションからアクセス可能なデータと/または処理された出力を収集し、プライベートまたは非無料のコンテンツがすべてのユーザーに利用可能になる結果をもたらす[scraping](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-011_Scraping)ボットタイプを検出します

**対策:**

以下の推奨事項に従ってください。

* Webアプリケーションに対する [OWASP description for automated threats](https://owasp.org/www-project-automated-threats-to-web-applications/) に精通してください。
* 追加のCAPTCHAソリューションを使用してください。
* robots.txtファイルを使用して、検索エンジンクローラがクロールできるページとクロールできないページを指定してください。
* 悪意のある活動を示唆するパターンを探すためにトラフィックを監視してください。
* レート制限を実装してください。
* データを難読化または暗号化します。
* 法的措置を講じてください。

## 特別な攻撃や脆弱性の一覧

### 仮想パッチ

**攻撃**

**Wallarmコード:** `vpatch`

**説明:**     

リクエストが[仮想パッチメカニズム][doc-vpatch]によって緩和された攻撃の一部である場合、そのリクエストは `vpatch`としてマークされます。

### 安全でないXMLヘッダー

**攻撃**

**Wallarmコード:** `invalid_xml`

**説明:**  

リクエストの本文にXMLドキュメントが含まれていて、そのドキュメントのエンコーディングがXMLヘッダーで指定されたエンコーディングと異なる場合、そのリクエ스트は`invalid_xml`としてマークされます。

### 計算リソースの制限超過

**攻撃**

**Wallarmコード:** `overlimit_res`

**説明:**

Wallarmノードが`overlimit_res`攻撃としてリクエストをマークする2つのシナリオがあります。

* Wallarmノードが、送信されたリクエストを`N`ミリ秒以下で処理するように設定されています（デフォルト値：`1000`）。指定された時間内にリクエストが処理されない場合、リクエストの処理が停止され、そのリクエストが`overlimit_res`攻撃としてマークされます。

    [rule **Fine-tune the overlimit_res attack detection**](user-guides/rules/configure-overlimit-res-detection.md) オプションを使用して、カスタムの制限時間を指定したり、制限が超過した場合のデフォルトのノード動作を変更できます。

    リクエスト処理時間を制限することで、Wallarmノードを対象としたバイパス攻撃が防止されます。一部の場合、`overlimit_res`としてマークされたリクエストは、Wallarmノードモジュールに割り当てられたリソースが不十分であり、リクエストの処理に時間がかかることを示すことがあります。
* 512 MBを超えるgzipファイルをアップロードするリクエスト。

### DDoS（分散サービス拒否）攻撃

DDoS（分散サービス拒否）攻撃は、複数のソースからのトラフィックでWebサイトやオンラインサービスを圧倒することにより、利用できなくなるようにしようとするサイバー攻撃の一種です。

攻撃者がDDoS攻撃を開始するために使用できる技術は多く、使用する方法やツールは大幅に異なることがあります。一部の攻撃は、サーバーへの大量の接続要求を送信するなどの低レベルな手法を使用する比較的単純なものであり、他の攻撃は、IPアドレスを偽装するか、ネットワークインフラストラクチャの脆弱性を悪用するなど、より複雑な戦術を使用する洗練されたものです。

[リソースをDDoSから守るためのガイド](admin-en/configuration-guides/protecting-against-ddos.md) を参照してください。