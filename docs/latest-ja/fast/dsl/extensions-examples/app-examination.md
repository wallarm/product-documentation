[img-login]:                ../../../images/fast/dsl/common/extension-examples/ojs_broken.png
[img-wireshark]:            ../../../images/fast/dsl/common/extension-examples/wireshark.png

[link-juice-shop]:          https://www.owasp.org/index.php/OWASP_Juice_Shop_Project
[link-ojs-install-manual]:  https://pwning.owasp-juice.shop/companion-guide/latest/part1/running.html

#   サンプルアプリケーションの検証

!!! info "アプリケーションに関する補足"
    本ガイドでは、FAST拡張メカニズムの機能を示すため、脆弱な[OWASP Juice Shop][link-juice-shop]アプリケーションを使用します。
    
    このアプリケーションのインスタンスが`ojs.example.local`というドメイン名でアクセス可能であることを前提とします。デプロイ済みアプリケーションに別のドメイン名が割り当てられている場合（[インストール手順][link-ojs-install-manual]を参照）、`ojs.example.local`を適切なドメイン名に置き換えてください。
 正しくFAST拡張を構築するには、脆弱性テストの対象となるWebアプリケーションまたはAPIの動作メカニズム（アプリケーションまたはAPIの内部アーキテクチャ、リクエストとレスポンスの形式、例外処理のロジックなど）を理解する必要があります。

OWASP Juice Shopアプリケーションを調査し、脆弱性を悪用できる可能性のある方法をいくつか見つけます。

これを行うには、ブラウザーでログインページ（`http://ojs.example.local/#/login`）に移動し、「Email」フィールドに`'`記号を、「Password」フィールドに`12345`というパスワードを入力し、「Log in」ボタンを押します。ブラウザーの開発者ツールまたはWiresharkトラフィックキャプチャソフトウェアを用いると、「Email」フィールドでアポストロフィ記号を使用するとサーバー内部エラーが発生することがわかります。

サーバーへのリクエストに含まれるすべての情報を分析すると、次のことがわかります:
* ユーザーがログインを試みると、REST APIメソッド`POST /rest/user/login`が呼び出されます。
* ログイン資格情報は、以下のとおりJSON形式でこのAPIメソッドに渡されます。
    
    ```
    {
        "email": "'",
        "password": "12345"
    }
    ```
    
サーバーのレスポンスに含まれるすべての情報を分析すると、`email`と`password`の値が次のSQLクエリで使用されていると結論できます: 
    
```
SELECT * FROM Users WHERE email = ''' AND password = '827ccb0eea8a706c4c34a16891f84e7b'
```

したがって、OWASP Juice Shopはログインフォームを介したSQLインジェクション攻撃（SQLi）に脆弱である可能性があると推測できます。

![OWASP Juice Shopアプリケーションのログインフォーム][img-login]

!!! info "脆弱性の悪用"
    悪用可能な脆弱性: SQLiです。
    
    公式ドキュメントでは、ログインフォームのemailフィールドに`'or 1=1 -- `を、passwordフィールドに任意の値を入力することでSQLi脆弱性を悪用します。
    
    この攻撃の後、Webアプリケーションの管理者としてログインした状態になります。
    
    あるいは、既存の管理者のメールアドレスを`email`フィールドの値として含むペイロードを使用できます（`password`フィールドの値は任意で構いません）。
    
    ```
    {
        "email": "admin@juice-sh.op'--",
        "password": "12345"
    }
    ```
 脆弱性の悪用が成功したケースをどのように検出するかを理解するため、上記のメールアドレスとパスワードで管理者としてサイトにログインします。Wiresharkアプリケーションを使用してAPIサーバーのレスポンスをキャプチャします:
* レスポンスのHTTPステータス: `200 OK`（ログイン時に問題がある場合、サーバーは`401 Unauthorized`ステータスで応答します）。 
* 認証成功を示すJSON形式のサーバーレスポンス:
    
    ```
    {
        "authentication": {
            "token": "some long token",     # トークンの値は重要ではありません
            "bid": 1,                       # ユーザーのショッピングカート識別子
            "umail": "admin@juice-sh.op"    # ユーザーのメールアドレスはumailパラメータに格納されています
        }
    }
    ```

![WiresharkアプリケーションでAPIサーバーのレスポンスをキャプチャ][img-wireshark]