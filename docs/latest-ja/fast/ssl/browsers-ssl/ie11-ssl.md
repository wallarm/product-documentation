[img-cert-request]:         ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-certificate-request.png
[img-cert-window]:          ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-certificate-window.png
[img-store-location]:       ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-store-location.png
[img-store]:                ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-store-selection.png
[img-wizard-resume]:        ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-wizard-resume.png
[img-fingerprint-warning]:  ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-fingerprint-warning.png
[img-import-ok]:            ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-import-success.png
[img-https-ok]:             ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-https-ok.png
        
    
# Microsoft Internet Explorer 11向けFASTノード自己署名SSL証明書のインストール

Internet Explorer 11ブラウザに証明書をインストールするには、以下の手順に従ってください:

1.  ご利用のブラウザがFASTノードをHTTPおよびHTTPSプロキシとして使用するように設定されていることをご確認ください。

2.  ブラウザを使用して、任意のドメインからHTTP経由でファイル `cert.der` をリクエストしてください。
    
    例えば、以下のリンクのいずれかを使用できます:
    
    * <http://wallarm.get/cert.der>
    * <http://example.com/cert.der>

    ブラウザは証明書ファイルを開くか保存するかの選択肢を表示します。**Open**ボタンを選択してください。

    ![自己署名FASTノード証明書のリクエスト][img-cert-request]

3.  証明書の情報が記載されたウィンドウが表示されます。画像に示されている内容とは異なる名前や有効期限が表示される場合がございます。**Install Certificate**ボタンを選択してください。

    ![“Certificate”ウィンドウ][img-cert-window]

4.  表示されたウィンドウで適切な証明書インストールオプションを選択してください。証明書は現在のユーザーまたは全ユーザー向けにインストールすることができます。該当するオプションを選び、**Next**ボタンを選択してください。  

    ![証明書ストアの場所を選択][img-store-location]

5.  証明書ストアを選択するよう求められます。「Place all certificates in the following store」オプションを選択し、ストアとして「Trusted Root Certification Authorities」を設定してください。**Next**ボタンを選択してください。

    ![証明書ストアを選択][img-store]

    証明書に適切なストアが選択されていることを確認し、**Finish**ボタンを選択してインポートプロセスを開始してください。
    
    ![証明書インポートウィザードの再開][img-wizard-resume]

6.  インポートされる証明書のフィンガープリントを検証できないという警告メッセージが表示されます。インポートプロセスを完了するために、**Yes**ボタンを選択してください。

    ![フィンガープリント検証の警告][img-fingerprint-warning]

    インポートが成功すると、「The import was successful」という情報メッセージが表示されます。

    ![証明書のインポート成功][img-import-ok]
    
7.  証明書が正しくインストールされていることを確認してください。そのためには、HTTPS経由で任意のサイトにアクセスしてください。信頼できない証明書に関する警告メッセージなしに、サイトのHTTPSバージョンにリダイレクトされるはずです。

    例えば、Google GruyereサイトのHTTPSバージョンにアクセスすることができます:
    <https://google-gruyere.appspot.com>

    ![HTTPSが機能している][img-https-ok]