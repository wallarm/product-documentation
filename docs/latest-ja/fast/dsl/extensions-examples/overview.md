[link-points]:              ../points/intro.md
[link-mod-extension]:       mod-extension.md
[link-non-mod-extension]:   non-mod-extension.md
[link-app-examination]:     app-examination.md
[link-juice-shop]:          https://www.owasp.org/index.php/OWASP_Juice_Shop_Project
[link-juice-shop-deploy]:   https://github.com/bkimminich/juice-shop#setup
[link-juice-shop-docs]:     https://pwning.owasp-juice.shop/companion-guide/latest/
[link-using-extension]:     ../using-extension.md

# FAST拡張の例：概要

脆弱なウェブアプリケーション[OWASP Juice Shop][link-juice-shop]を使用して、FAST拡張メカニズムの機能を実証します。

このアプリケーションは、[展開][link-juice-shop-deploy]をDocker、Node.JS、またはVagrantといった複数の方法で行うことができます。

OWASP Juice Shopに組み込まれている脆弱性を一覧したドキュメントを確認するには、以下の[リンク][link-juice-shop-docs]に進んでください。

!!! warning "脆弱なアプリケーションの扱い"
    OWASP Juice Shopが動作するホストにインターネットアクセスや実際のデータ（例えば、login/password pairs）を与えないことを推奨します。

「OWASP Juice Shop」ターゲットアプリケーションの脆弱性をテストするには、次の手順を実行してください:

1.  [ウェブアプリケーションを検証][link-app-examination]して、その挙動を把握してください。
2.  [修正を加える拡張機能のサンプルを作成][link-mod-extension]してください。
3.  [修正を加えない拡張機能のサンプルを作成][link-non-mod-extension]してください。
4.  作成した拡張機能を[使用][link-using-extension]してください。

!!! info "リクエスト要素の記述構文"
    FAST拡張機能を作成する際には、対象アプリケーションに送信されるHTTPリクエストの構造および対象アプリケーションから受信するHTTPレスポンスの構造を理解し、ポイントを使用して対象となるリクエスト要素を正しく記述できるようにする必要があります。
    
    詳細情報を確認するには、この[リンク][link-points]に進んでください。