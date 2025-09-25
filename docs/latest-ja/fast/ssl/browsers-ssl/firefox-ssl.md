[img-cert-request]:     ../../../images/fast/ssl/common/browsers-ssl/firefox-ssl/f-certificate-request.png
[img-cert-download]:    ../../../images/fast/ssl/common/browsers-ssl/firefox-ssl/f-certificate-download.png
[img-https-ok]:         ../../../images/fast/ssl/common/browsers-ssl/firefox-ssl/f-https-ok.png
    
    
#   Mozilla Firefox向けFASTノード自己署名SSL証明書のインストール

Mozilla Firefoxブラウザに証明書をインストールするには、次の手順を実行してください:

1.  ブラウザがFASTノードをHTTPおよびHTTPSプロキシとして使用するよう設定してあることを確認してください。

2.  ブラウザを使用して、HTTP経由で任意のドメインから`cert.der`ファイルをリクエストしてください。

    例えば、次のいずれかのリンクを使用できます:
    
    * <http://wallarm.get/cert.der>
    * <http://example.com/cert.der>

    ブラウザが証明書ファイルをダウンロードします。設定に応じて、ファイルは既定のダウンロードディレクトリか、指定したディレクトリに保存されます。
    
    ![自己署名のFASTノード証明書をリクエスト中][img-cert-request]

3.  ダイアログウィンドウが開き、証明書をインストールするよう求められます。なお、お使いの証明書の名称と有効期限は画像の例とは異なります。    
    
    “Trust this CA to identify websites”オプションを選択し、**OK**ボタンを選択します。

    ![証明書をダウンロード中][img-cert-download]

4.  証明書が正しくインストールされたことを確認してください。そのために、HTTPSで任意のサイトにアクセスしてください。信頼されていない証明書に関する警告メッセージが表示されることなく、サイトのHTTPS版にリダイレクトされるはずです。

    例えば、Google GruyereサイトのHTTPS版にアクセスします:
    <https://google-gruyere.appspot.com>

    ![HTTPSが動作しています][img-https-ok]