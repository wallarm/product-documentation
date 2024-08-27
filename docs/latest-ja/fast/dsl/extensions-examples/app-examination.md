[img-login]:                ../../../images/fast/dsl/common/extension-examples/ojs_broken.png
[img-wireshark]:            ../../../images/fast/dsl/common/extension-examples/wireshark.png

[link-juice-shop]:          https://www.owasp.org/index.php/OWASP_Juice_Shop_Project
[link-ojs-install-manual]:  https://pwning.owasp-juice.shop/companion-guide/latest/part1/running.html

#   サンプルアプリケーションの調査

!!! info "アプリケーションについてのいくつかの言葉"
    このガイドでは、脆弱性を持つ [OWASP Juice Shop][link-juice-shop] アプリケーションを使用して、FAST拡張機構の機能を示しています。
    
    このアプリケーションのインスタンスが `ojs.example.local` ドメイン名経由でアクセス可能であると想定しています。デプロイされたアプリケーションに別のドメイン名が割り当てられている場合（[インストール手順][link-ojs-install-manual]を参照）、適切なドメイン名に `ojs.example.local` を置き換えてください。
    脆弱性をテストするために必要なウェブアプリケーションまたはAPIの操作メカニズムを理解した上で、FAST拡張を正常に構築する必要があります（アプリケーションまたはAPIの内部アーキテクチャ、リクエストとレスポンスの形式、例外処理のロジックなど）。

OWASP Juice Shopアプリケーションを調査して、脆弱性を悪用する可能性のあるいくつかの方法を見つけましょう。

これを行うために、ブラウザを使用してログインページ (`http://ojs.example.local/#/login`) に進み、"Email" フィールドに `'` シンボルを、"Password" フィールドに `12345` パスワードを入力し、"Log in" ボタンを押します。ブラウザの開発者ツールやWiresharkトラフィックキャプチャソフトウェアを使用して、"Email" フィールドでアポストロフィシンボルを使用するとサーバー内部でエラーが発生することがわかります。

サーバーへのリクエストから得られた全ての情報を分析した結果、次の結論を得ることができます：
* ユーザーがログインしようとすると、REST APIメソッド `POST /rest/user/login` が呼び出されます。
* ログインのための資格情報は、以下に示すように、このAPIメソッドにJSON形式で転送されます。
    
    ```
    {
        "email": "'",
        "password": "12345"
    }
    ```
    
サーバーのレスポンスから得られる全ての情報を分析した結果、次のSQLクエリで `email` および `password` 値が使用されると結論付けることができます：
    
```
SELECT * FROM Users WHERE email = ''' AND password = '827ccb0eea8a706c4c34a16891f84e7b'
```

したがって、OWASP Juice Shopが、ログインフォームを介したSQLインジェクション攻撃（SQLi）に対して脆弱である可能性があると推測できます。

![OWASP Juice Shopアプリケーションのログインフォーム][img-login]

!!! info "脆弱性の悪用"
    悪用可能な脆弱性：SQLi。
    
    公式ドキュメンテーションでは、SQLi脆弱性を利用して、ログインフォームに `'or 1=1 -- ` のメールと任意のパスワードを入力します。
    
    この攻撃後、ウェブアプリケーション管理者としてログインします。
    
    または、既存の管理者のメールを `email` フィールドの値として含むペイロードを使用することもできます（`password` フィールドは任意の値を含んで構いません）。
    
    ```
    {
        "email": "admin@juice-sh.op'--",
        "password": "12345"
    }
    ```
上記のメールとパスワードの値を使用して、管理者としてサイトにログインし、成功した脆弱性の悪用のケースを検出する方法を理解するために、Wiresharkアプリケーションを使ってAPIサーバーのレスポンスをインターセプトします：
* レスポンスのHTTPステータス：`200 OK` （ログイン中に問題がある場合、サーバーは `401 Unauthorized` ステータスで応答します）。 
* 成功した認証について通知するサーバーからのJSON形式のレスポンス：

    ```
    {
        "authentication": {
            "token": "some long token",     # トークンの値は重要ではありません
            "bid": 1,                       # ユーザーのショッピングカート識別子
            "umail": "admin@juice-sh.op"    # umailパラメータにはユーザーのメールアドレスが格納されています
        }
    }
    ```

![Wiresharkアプリケーションを用いてAPIサーバーのレスポンスをインターセプトする][img-wireshark]