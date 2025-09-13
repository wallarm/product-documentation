[img-cert-request]:         ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-certificate-request.png
[img-cert-window]:          ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-certificate-window.png
[img-store-location]:       ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-store-location.png
[img-store]:                ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-store-selection.png
[img-wizard-resume]:        ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-wizard-resume.png
[img-fingerprint-warning]:  ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-fingerprint-warning.png
[img-import-ok]:            ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-import-success.png
[img-https-ok]:             ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-https-ok.png
    
    
#   Microsoft Edge向けFAST nodeの自己署名SSL証明書のインストール

Microsoft Edgeブラウザに証明書をインストールするには、次の手順を実行します:

1.  ブラウザがHTTPおよびHTTPSプロキシとしてFAST nodeを使用するように設定されていることを確認します。

2.  ブラウザを使用してHTTP経由で任意のドメインから`cert.der`ファイルをリクエストします。

    例えば、次のリンクのいずれかを使用できます:
    
    * <http://wallarm.get/cert.der>
    * <http://example.com/cert.der> 

    ブラウザに証明書ファイルを開くか保存するかの選択肢が表示されます。**Open**を選択します。

    ![自己署名のFAST node証明書のリクエスト][img-cert-request]

3.  証明書に関する情報が表示されたウィンドウが開きます。証明書の名前と有効期限は画像のものとは異なります。**Install Certificate**を選択します。

    ![「Certificate」ウィンドウ][img-cert-window]

4.  開いたウィンドウで、適切な証明書のインストール対象を選択します。証明書は現在のユーザーのみにインストールすることも、すべてのユーザーにインストールすることもできます。該当するオプションを選択し、**Next**を選択します。

    ![証明書ストアの場所を選択][img-store-location]

5.  証明書ストアの選択を求められます。オプション「Place all certificates in the following store」を選択し、ストアとして「Trusted Root Certification Authorities」を指定します。**Next**を選択します。    
    ![証明書ストアを選択][img-store]

    証明書に適切なストアが選択されていることを確認し、**Finish**を選択してインポート処理を開始します。
    
    ![証明書インポートウィザードの概要][img-wizard-resume]

6.  インポートする証明書のフィンガープリントを検証できない旨の警告メッセージが表示されます。インポートを完了するために**Yes**を選択します。

    ![フィンガープリント検証の警告][img-fingerprint-warning]

    インポートが成功した場合、「The import was successful」という情報メッセージが表示されます。

    ![証明書のインポートに成功][img-import-ok]

7.  証明書が正しくインストールされたことを確認します。そのために、HTTPSで任意のサイトにアクセスします。信頼されていない証明書に関する警告メッセージが表示されることなく、サイトのHTTPS版にリダイレクトされるはずです。

    例えば、Google GruyereサイトのHTTPS版にアクセスします:
    <https://google-gruyere.appspot.com>

    ![HTTPSが動作しています][img-https-ok]