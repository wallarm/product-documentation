[img-cert-request]:         ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-certificate-request.png
[img-downloaded-cert]:      ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-downloaded-certificate.png
[img-keychain-import]:      ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-keychain-prompt.png
[img-untrusted-cert]:       ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-keychain-untrusted-certificate.png
[img-cert-properties]:      ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-keychain-certificate-properties.png
[img-credentials-prompt]:   ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-keychain-credentials-prompt.png
[img-trusted-cert]:         ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-keychain-trusted-certificate.png
[img-https-ok]:             ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-https-ok.png

# FAST Node自己署名SSL証明書のAppleSafariへのインストール

AppleSafariブラウザ用に証明書をインストールするには、以下の手順に従ってください。

1.  ブラウザがFASTノードをHTTPおよびHTTPSプロキシとして使用するよう設定されていることを確認します。

2.  ブラウザを使用して、任意のドメインからHTTP経由でファイル`cert.der`をリクエストします。

    例えば、下記のリンクのいずれかを使用できます:

    * <http://wallarm.get/cert.der>
    * <http://example.com/cert.der>

    ブラウザは証明書ファイルをダウンロードします。構成に応じて、ファイルは既定のダウンロードディレクトリまたは指定したディレクトリに保存されます。
    
    ![自己署名のFASTノード証明書をリクエスト中][img-cert-request]
    
    ダウンロードしたファイルを開いてください。

    ![ダウンロードした証明書][img-downloaded-cert]

3.  Keychain Accessアプリケーションが証明書のインポートを提案します。  

    現在のユーザー用またはすべてのユーザー用に証明書をインストールできます。適切なオプションを選択し、**Add**ボタンを選んでください。

    ![Keychain Access「Add Certificates」ウィンドウ][img-keychain-import]

4.  インポートした証明書が信頼されていない証明書として表示されます。画像に示されているものとは名前や有効期限が異なる場合がありますのでご注意ください。

    ![Keychain Accessアプリケーションに表示される信頼されていない証明書][img-untrusted-cert]

5.  証明書を信頼済みに変換するには、証明書をダブルクリックして証明書プロパティウィンドウを開いてください。 「Trust」リストを展開し、SSLには**Always Trust**を選択します。

    ![証明書プロパティウィンドウ][img-cert-properties]

    続行するためにパスワードの入力が求められます。

    ![資格情報入力のプロンプト][img-credentials-prompt]

    これで、インポートした証明書が信頼済みとして表示されるはずです。
    
    ![Keychain Accessアプリケーションに表示される信頼済み証明書][img-trusted-cert]

6.  証明書が正しくインストールされているか確認します。確認するには、HTTPS経由で任意のサイトにアクセスしてください。信頼されていない証明書に関する警告メッセージなしに、サイトのHTTPSバージョンにリダイレクトされるはずです。

    例えば、Google GruyereサイトのHTTPSバージョンにアクセスできます:
    <https://google-gruyere.appspot.com>

    ![HTTPSが正常に機能している][img-https-ok]