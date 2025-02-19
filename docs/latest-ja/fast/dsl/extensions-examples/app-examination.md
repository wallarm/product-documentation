[img-login]:                ../../../images/fast/dsl/common/extension-examples/ojs_broken.png
[img-wireshark]:            ../../../images/fast/dsl/common/extension-examples/wireshark.png

[link-juice-shop]:          https://www.owasp.org/index.php/OWASP_Juice_Shop_Project
[link-ojs-install-manual]:  https://pwning.owasp-juice.shop/companion-guide/latest/part1/running.html

# サンプルアプリケーションの検証

!!! info "アプリケーションについて一言"
    本ガイドでは、脆弱な[OWASP Juice Shop][link-juice-shop]アプリケーションを使用してFAST拡張機構の機能を実証します。
    
    このアプリケーションのインスタンスが`ojs.example.local`ドメイン名を介してアクセス可能であることを前提としています。展開されたアプリケーションに異なるドメイン名が割り当てられている場合は（[インストール手順][link-ojs-install-manual]を参照）、`ojs.example.local`を適切なドメイン名に置き換えてください。
 webアプリケーションまたはAPI内の脆弱性をテストするにあたり、FAST拡張の構築が成功するためには、対象のwebアプリケーションまたはAPIの動作機構（内部アーキテクチャ、リクエスト及びレスポンスフォーマット、例外処理のロジックなど）の理解が必要です。

OWASP Juice Shopアプリケーションを検証し、脆弱性を悪用するための潜在的な方法をいくつか見出します。

これを行うため、ブラウザを使用してログインページ(`http://ojs.example.local/#/login`)にアクセスし、“Email”フィールドに`'`記号を、"Password"フィールドに`12345`のパスワードを入力し、“Log in”ボタンを押します。ブラウザの開発者ツールまたはWiresharkのトラフィックキャプチャソフトウェアの助けを借りることで、“Email”フィールドにアポストロフィ記号を使用するとサーバで内部エラーが発生することが判明します。

サーバへのリクエストに関するすべての情報を解析した結果、以下の結論に達します:
* ユーザがログインを試みる際、REST APIメソッド`POST /rest/user/login`が呼び出されます。
* ログインに使用する認証情報は以下に示すようにJSON形式でこのAPIメソッドに転送されます。
    
    ```
    {
        "email": "'",
        "password": "12345"
    }
    ```
    
サーバのレスポンスに関するすべての情報を解析した結果、`email`および`password`の値が以下のSQLクエリで使用されていると判明します: 
    
```
SELECT * FROM Users WHERE email = ''' AND password = '827ccb0eea8a706c4c34a16891f84e7b'
```

従って、OWASP Juice Shopがログインフォームを通じたSQLインジェクション攻撃(SQLi)に脆弱であると推定されます。

![OWASP Juice Shopアプリケーションのログインフォーム][img-login]

!!! info "脆弱性の悪用"
    悪用可能な脆弱性: SQLi。
    
    公式ドキュメントでは、ログインフォームに`'or 1=1 -- `というemailと任意のパスワードを入力することでSQLi脆弱性を悪用する方法が推奨されています。
    
    この攻撃により、webアプリケーションの管理者としてログインします。
    
    別の方法として、既存の管理者のemailを`email`フィールドの値として含むペイロードも使用可能です（`password`フィールドには任意の値を入力できます）。
    
    ```
    {
        "email": "admin@juice-sh.op'--",
        "password": "12345"
    }
    ```
 脆弱性悪用が成功した場合の検出方法について理解するため、上記のemailおよびpassword値を使用して管理者としてサイトにログインし、Wiresharkアプリケーションを使用してAPIサーバのレスポンスを取得します:
* レスポンスのHTTPステータス: `200 OK`（ログイン中に問題が発生すると、サーバは`401 Unauthorized`ステータスを返します）。
* JSON形式のサーバレスポンスは、認証が成功したことを示します:

    ```
    {
        "authentication": {
            "token": "some long token",     # tokenの値は重要ではありません
            "bid": 1,                       # ユーザのショッピングカート識別子
            "umail": "admin@juice-sh.op"    # ユーザのemailアドレスがumailパラメータに格納されています
        }
    }
    ```

![Wiresharkアプリケーションを使用してAPIサーバのレスポンスを取得][img-wireshark]