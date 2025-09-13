[link-points]:              ../points/intro.md
[link-mod-extension]:       mod-extension.md
[link-non-mod-extension]:   non-mod-extension.md
[link-app-examination]:     app-examination.md
[link-juice-shop]:          https://www.owasp.org/index.php/OWASP_Juice_Shop_Project
[link-juice-shop-deploy]:   https://github.com/bkimminich/juice-shop#setup
[link-juice-shop-docs]:     https://pwning.owasp-juice.shop/companion-guide/latest/
[link-using-extension]:     ../using-extension.md


#   FAST拡張機能の例：概要

脆弱なWebアプリケーションである[OWASP Juice Shop][link-juice-shop]を使用して、FAST拡張メカニズムの機能を示します。

このアプリケーションは複数の方法で[デプロイ][link-juice-shop-deploy]できます（例：Docker、Node.JS、Vagrantを使用）。

内在する脆弱性を一覧化したOWASP Juice Shopのドキュメントについては、次の[リンク][link-juice-shop-docs]をご覧ください。

!!! warning "脆弱なアプリケーションの取り扱い"
    OWASP Juice Shopを実行するホストには、インターネット接続を提供したり実データ（例：ログイン/パスワードの組み合わせ）を使用したりしないことを推奨します。

対象アプリケーション「OWASP Juice Shop」に脆弱性がないかをテストするには、次の手順を実行します。

1.  [Webアプリケーションを調査][link-app-examination]して、その動作に慣れます。
2.  [変更を加えるサンプル拡張機能を作成します。][link-mod-extension]
3.  [変更を加えないサンプル拡張機能を作成します。][link-non-mod-extension]
4.  [作成した拡張機能を使用します。][link-using-extension]

!!! info "リクエスト要素の記述構文"
    FAST拡張機能を作成する際、ポイントを使用して操作する必要があるリクエスト要素を正しく記述するため、アプリケーションに送信されるHTTPリクエストおよびアプリケーションから受信するHTTPレスポンスの構造を理解する必要があります。
    
    詳細については、この[リンク][link-points]をご覧ください。