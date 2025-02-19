```markdown
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

# 修正拡張機能の作成

本書で説明する拡張機能は、着信するベースラインリクエストを修正し、ペイロードを注入します。これらのペイロードにより、[“OWASP Juice Shop”][link-juice-shop]ターゲットアプリケーションのログインフォームに存在するSQLi脆弱性が悪用される可能性があります。

## 準備

FAST拡張機能作成前に、以下の手順を実施することを強く推奨します：
1. 拡張機能を作成する対象のアプリケーションの挙動を[調査する][link-app-examination]。
2. 拡張機能のポイント構築の原則を[参照する][link-points]。

## 拡張機能の構築

拡張機能を記述したファイル（例: `mod-extension.yaml`）を作成し、必要なセクションを記入します：

1. [**`meta-info` セクション**][link-meta-info].

    拡張機能が検知しようとする脆弱性の説明を準備します。
    
    * 脆弱性ヘッダー: `OWASP Juice Shop SQLi (mod extension)`
    * 脆弱性の説明: `Demo of SQLi in OWASP Juice Shop (Admin Login)`
    * 脆弱性の種類: SQL injection
    * 脆弱性の脅威レベル: high
    
    対応する`meta-info`セクションは次のようになります:
    
    ```
    meta-info:
      - type: sqli
      - threat: 80
      - title: 'OWASP Juice Shop SQLi (mod extension)'
      - description: 'Demo of SQLi in OWASP Juice Shop (Admin Login)'
    ```

2. [**`collect` セクション、Collectフェーズ**][doc-collect-phase].

    ログインを試みる際、REST APIの`POST /rest/user/login`メソッドが呼び出されます。
    
    各ベースラインリクエストごとにテストリクエストを作成する必要はありません。脆弱性テストはPOSTリクエストに渡される各データに対して同様に実施されます。
    
    APIがログインリクエストを受信した際に拡張機能が一度だけ実行されるように設定します。そのため、ユニーク性条件を付与したCollectフェーズを拡張機能に追加します。

    ログイン時にAPIへ送信される`/rest/user/login`リクエストは次の要素で構成されます:

    1. パスの最初の部分（値は`rest`）
    2. パスの2番目の部分（値は`user`）
    3. `login`アクションメソッド
    
    これらの値に対応するポイントは以下の通りです:

    1. パスの最初の部分に対する`PATH_0_value`
    2. パスの2番目の部分に対する`PATH_1_value`
    3. `login`アクションメソッドに対する`ACTION_NAME_value`
    
    これら3つの要素の組み合わせがユニークであるという条件を追加すると、APIへの最初の`/rest/user/login`ベースラインリクエストに対してのみ拡張機能が実行されます（このリクエストはユニークと扱われ、以降のログイン用APIリクエストはユニークではなくなります）。
    
    拡張機能のYAMLファイルに対応する`collect`セクションを追加します:
    
    ```
    collect:
      - uniq:
        - [PATH_0_value, PATH_1_value, ACTION_NAME_value]
    ```

3. [**`match` セクション、Matchフェーズ**][doc-match-phase].

    作成中の拡張機能はログインフォームに存在する脆弱性を悪用するため、着信するベースラインリクエストが本当にログイン用APIリクエストであるかを確認する必要があります。
    
    拡張機能を、ベースラインリクエストが以下のURI: `/rest/user/login` を対象としている場合にのみ実行されるように設定します。受信したリクエストに必要な要素が含まれているかを確認するMatchフェーズを追加します。以下の`match`セクションを使用して設定できます:
    
    ```
    match:
      - PATH_0_value: 'rest'
      - PATH_1_value: 'user'
      - ACTION_NAME_value: 'login'
    ```

4. [**`modify` セクション、Modifyフェーズ**][doc-modify-phase].

    ベースラインリクエストを修正して、次の目的を達成する必要があるとします:
    * `Accept-Language` HTTPヘッダーの値をクリアする（この値は脆弱性の検知に必要ありません）。
    * `email`および`password`パラメータの実際の値を、中立的な`dummy`値に置換する。
    
    拡張機能に、上記の目的を達成するためリクエストを変更する以下の`modify`セクションを追加します:
    
    ```
    modify:
      - "HEADER_ACCEPT-LANGUAGE_value": ""
      - "POST_JSON_DOC_HASH_email_value": "dummy"
      - "POST_JSON_DOC_HASH_password_value": "dummy"
    ```
    
    !!! info "リクエスト要素の記述構文"
        JSON形式で含まれるリクエストデータは`<key: value>`ペアで保存されるため、`email`要素の値を参照するポイントは上記のようになります。`password`要素の値を参照するポイントも同様の構造です。
        
        ポイントの構築に関する詳細情報については、この[リンク][link-points]を参照してください。

5. [**`generate` セクション、Generateフェーズ**][doc-generate-phase].

    ターゲットアプリケーションのSQLインジェクション脆弱性を悪用するため、ベースラインリクエスト中の`email`パラメータの値を置換する2種類のペイロードが存在します:
    * `'or 1=1 --`
    * `admin@juice-sh.op'--`
        
    !!! info "修正済みリクエストへのペイロードの挿入"
        ペイロードは前述の修正済みリクエストに挿入されます。これにより、最初のペイロードが`email`フィールドに挿入された後、テストリクエストデータは以下のようになります:
    
        ```
        {
            "email": "'or 1=1 --",
            "password":"dummy"
        }
        ```
    
        選択されたペイロードによりどのパスワードでもログインに成功するため、ペイロードを`password`フィールドに挿入する必要はありません。このフィールドはModifyフェーズ適用後に`dummy`値となります。
    
        上記の要件を満たすテストリクエストを生成する`generate`セクションを追加します:
    
        ```
        generate:
          - payload:
            - "'or 1=1 --"
            - "admin@juice-sh.op'--"
          - into: "POST_JSON_DOC_HASH_email_value"
          - method:
            - replace
        ```

6. [**`detect` セクション、Detectフェーズ**][doc-detect-phase].

    以下の条件は、管理者権限でのユーザー認証が成功したことを示します:
    * レスポンスボディ内にショッピングカート識別子パラメータが`1`の値で存在すること。パラメータはJSON形式で、以下のように表示される必要があります:
    
        ```
        "bid":1
        ```
    
    * レスポンスボディ内にユーザーのメールパラメータが`admin@juice-sh.op`の値で存在すること。パラメータはJSON形式で、以下のように表示される必要があります:
    
        ```
         "umail":"admin@juice-sh.op"
        ```
    
    上記条件に基づき攻撃が成功したかを検出する`detect`セクションを追加します:
    
    ```
    detect:
      - response:
        - body: "\"umail\":\"admin@juice-sh.op\""
        - body: "\"bid\":1"
    ```
    
    !!! info "特殊文字のエスケープ"
        文字列中の特殊文字はエスケープすることを忘れないでください。

## 拡張機能ファイル

これで`mod-extension.yaml`ファイルには拡張機能の動作に必要なすべてのセクションが含まれています。以下にファイル内容の一覧を示します:

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

作成した拡張機能の使用方法に関する詳細は、[こちらのドキュメント][link-using-extension]を参照してください。
```