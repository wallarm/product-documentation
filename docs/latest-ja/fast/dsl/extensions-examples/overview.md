[link-points]:              ../points/intro.md
[link-mod-extension]:       mod-extension.md
[link-non-mod-extension]:   non-mod-extension.md
[link-app-examination]:     app-examination.md
[link-juice-shop]:          https://www.owasp.org/index.php/OWASP_Juice_Shop_Project
[link-juice-shop-deploy]:   https://github.com/bkimminich/juice-shop#setup
[link-juice-shop-docs]:     https://pwning.owasp-juice.shop/companion-guide/latest/
[link-using-extension]:     ../using-extension.md


#   FAST拡張機能の例：概要

脆弱なウェブアプリケーション [OWASP Juice Shop][link-juice-shop] をFAST拡張機構の能力を示すために使用します。

このアプリケーションは、例えばDocker、Node.JS、またはVagrantを使用して、複数の方法で[デプロイ][link-juice-shop-deploy]することができます。

組み込まれた脆弱性のリストを掲載したOWASP Juice Shopのドキュメンテーションをご覧になるには、次の[リンク][link-juice-shop-docs]に進んでください。

!!! warning "脆弱なアプリケーションを用いた作業に際して"
    OWASP Juice Shopが稼働しているホストにはインターネットアクセスやリアルなデータ（例えば、ログイン/パスワードのペア）を提供しないことをお勧めします。

“OWASP Juice Shop”ターゲットアプリケーションを脆弱性についてテストするには次の手順を実行します：

1.  [ウェブアプリケーションを調査します][link-app-examination] その動作に馴染むため。
2.  [サンプルの修正拡張を作成します][link-mod-extension]
3.  [サンプルの非修正拡張を作成します][link-non-mod-extension]
4.  [作成した拡張を使用します][link-using-extension]

!!! info "リクエスト要素記述の構文"
    FAST拡張子を作成する際には、アプリケーションに送信されるHTTPリクエストとアプリケーションから受信されるHTTPレスポンスの構造を理解して、点を使用して作業する必要があるリクエスト要素を正しく記述する必要があります。
    
    詳細な情報をご覧になるには、この[リンク][link-points]に進んでください。