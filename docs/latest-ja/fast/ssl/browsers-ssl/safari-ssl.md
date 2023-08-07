[img-cert-request]:         ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-certificate-request.png
[img-downloaded-cert]:      ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-downloaded-certificate.png
[img-keychain-import]:      ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-keychain-prompt.png
[img-untrusted-cert]:       ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-keychain-untrusted-certificate.png
[img-cert-properties]:      ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-keychain-certificate-properties.png
[img-credentials-prompt]:   ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-keychain-credentials-prompt.png
[img-trusted-cert]:         ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-keychain-trusted-certificate.png
[img-https-ok]:             ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-https-ok.png

#   Apple Safari用 FAST Node Self-signed SSL証明書のインストール

Apple Safariブラウザに証明書をインストールするには、以下の手順を実行します。

1.  ブラウザがFASTノードをHTTPおよびHTTPSプロキシとして使用するように設定していることを確認します。

2.  ブラウザを使用して、任意のドメインから `cert.der` ファイルをHTTPで要求します。

    例えば、次のリンクのいずれかを使用できます。

    * <http://wallarm.get/cert.der>
    * <http://example.com/cert.der>

    ブラウザは証明書ファイルをダウンロードします。設定により、そのファイルはデフォルトのダウンロードディレクトリに配置されるか、あなたが選択したディレクトリに配置されます。
    
    ![!自己署名FASTノード証明書の要求][img-cert-request]
    
    ダウンロードしたファイルを開きます。

    ![!ダウンロード済みの証明書][img-downloaded-cert]

3.  Keychain Accessアプリケーションが証明書のインポートを提案します。

    現在のユーザーまたはすべてのユーザーのために証明書をインストールできます。適切なオプションを選択し、**追加**ボタンをクリックします。

    ![!Keychain Access「証明書の追加」ウィンドウ][img-keychain-import]

4.  インポートされた証明書が信頼できない証明書として印付けされていることがわかります。証明書の名前と有効期限はイメージに示されているものとは異なることに注意してください。

    ![!Keychain Accessアプリケーション内の信頼できない証明書][img-untrusted-cert]

5.  証明書を信頼されたものに変換するために、証明書のプロパティウィンドウを開くためにそれをダブルクリックします。「信頼」リストを展開し、SSLについて**常に信頼**を選択します。

    ![!証明書のプロパティウィンドウ][img-cert-properties]

    オペレーションを続けるためにパスワードの入力が求められます。

    ![!クレデンシャルのプロンプト][img-credentials-prompt]

    インポートされた証明書は信頼済みとしてマークされるべきです。
    
    ![!Keychain Accessアプリケーション内の信頼済み証明書][img-trusted-cert]

6.  証明書が正しくインストールされたことを確認します。そのために、HTTPS経由で任意のサイトに移動します。信頼できない証明書に関する警告メッセージなしに、HTTPSバージョンのサイトにリダイレクトされるはずです。

    例えば、Google GruyereサイトのHTTPSバージョンにアクセスすることができます：
    <https://google-gruyere.appspot.com>

    ![!HTTPSが動作しています][img-https-ok]