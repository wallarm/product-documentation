[img-cert-request]:         ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-certificate-request.png
[img-downloaded-cert]:      ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-downloaded-certificate.png
[img-keychain-import]:      ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-keychain-prompt.png
[img-untrusted-cert]:       ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-keychain-untrusted-certificate.png
[img-cert-properties]:      ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-keychain-certificate-properties.png
[img-credentials-prompt]:   ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-keychain-credentials-prompt.png
[img-trusted-cert]:         ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-keychain-trusted-certificate.png
[img-https-ok]:             ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-https-ok.png

#   Apple Safari向けFASTノード自己署名SSL証明書のインストール

Apple Safariブラウザーに証明書をインストールするには、次の手順に従います。 

1.  ブラウザーがFASTノードをHTTPおよびHTTPSプロキシとして使用するように設定されていることを確認します。

2.  ブラウザーを使用してHTTP経由で任意のドメインから`cert.der`ファイルをリクエストします。

    例として、次のいずれかのリンクを使用できます。

    * <http://wallarm.get/cert.der>
    * <http://example.com/cert.der>

    ブラウザーは証明書ファイルをダウンロードします。設定に応じて、ファイルは既定のダウンロードディレクトリまたは選択したディレクトリに保存されます。
    
    ![自己署名FASTノード証明書の要求][img-cert-request]
    
    ダウンロードしたファイルを開きます。

    ![ダウンロードした証明書][img-downloaded-cert]

3.  Keychain Accessアプリケーションが証明書のインポートを促します。  

    証明書は現在のユーザーのみ、またはすべてのユーザー向けにインストールできます。適切なオプションを選択し、Addボタンを選択します。

    ![Keychain Access「Add Certificates」ウィンドウ][img-keychain-import]

4.  インポートされた証明書は未信頼として表示されます。証明書の名前と有効期限は画像のものとは異なることに注意してください。

    ![Keychain Accessアプリケーションの未信頼証明書][img-untrusted-cert]

5.  証明書を信頼済みにするには、証明書をダブルクリックしてプロパティウィンドウを開きます。「Trust」リストを展開し、SSLに対してAlways Trustを選択します。

    ![証明書のプロパティウィンドウ][img-cert-properties]

    続行するにはパスワードの入力を求められます。

    ![認証情報の入力プロンプト][img-credentials-prompt]

    これでインポートされた証明書は信頼済みとして表示されるはずです。
    
    ![Keychain Accessアプリケーションの信頼済み証明書][img-trusted-cert]

6.  証明書が正しくインストールされたことを確認します。そのために、HTTPSで任意のサイトにアクセスします。未信頼な証明書に関する警告メッセージなしに、そのサイトのHTTPS版へリダイレクトされるはずです。

    例として、Google GruyereサイトのHTTPS版にアクセスできます:
    <https://google-gruyere.appspot.com>

    ![HTTPSが機能しています][img-https-ok]