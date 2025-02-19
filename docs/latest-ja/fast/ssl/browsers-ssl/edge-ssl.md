[img-cert-request]:         ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-certificate-request.png
[img-cert-window]:          ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-certificate-window.png
[img-store-location]:       ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-store-location.png
[img-store]:                ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-store-selection.png
[img-wizard-resume]:        ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-wizard-resume.png
[img-fingerprint-warning]:  ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-fingerprint-warning.png
[img-import-ok]:            ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-import-success.png
[img-https-ok]:             ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-https-ok.png

# Microsoft Edge向けFAST Node自己署名SSL証明書のインストール

Microsoft Edgeブラウザに証明書をインストールするには、次の手順に従ってください。

1. お使いのブラウザがHTTPおよびHTTPSプロキシとしてFAST Nodeを使用するよう設定済みであることを確認してください。

2. ブラウザを使用して、任意のドメインからHTTP経由でファイル`cert.der`をリクエストしてください。

   例えば、以下のリンクのいずれかを使用することができます:

   * <http://wallarm.get/cert.der>
   * <http://example.com/cert.der>

   ブラウザは証明書ファイルを開くか保存するかの選択肢を提示します。[Open]ボタンを選択してください。

   ![自己署名FAST Node証明書のリクエスト][img-cert-request]

3. 証明書に関する情報が表示されるウィンドウが開きます。画像に示されているものと異なる証明書の名称や有効期限であることに注意してください。[Install Certificate]ボタンを選択してください。

   ![「証明書」ウィンドウ][img-cert-window]

4. 開いたウィンドウで適切な証明書のインストールオプションを選択してください。証明書は現在のユーザまたは全ユーザ向けにインストールすることができます。適切なオプションを選択し、[Next]ボタンを選択してください。

   ![証明書ストアの場所を選択][img-store-location]

5. 証明書ストアの選択を求められます。「Place all certificates in the following store」を選択し、ストアに「Trusted Root Certification Authorities」を設定してください。[Next]ボタンを選択してください。    
   
   ![証明書ストアの選択][img-store]

   証明書に適したストアが選択されていることを確認し、[Finish]ボタンを選択してインポート処理を開始してください。
    
   ![証明書インポートウィザードの再開][img-wizard-resume]

6. インポート中の証明書のフィンガープリントを検証できない旨の警告メッセージが表示されます。[Yes]ボタンを選択してインポート処理を完了してください。

   ![フィンガープリント検証警告][img-fingerprint-warning]

   インポートが成功すると、「The import was successful」という情報メッセージが表示されます。

   ![Successful import of the certificate][img-import-ok]

7. 証明書が正しくインストールされているか確認してください。そのためには、HTTPS経由で任意のサイトにアクセスしてください。不正な証明書に関する警告メッセージが表示されることなく、サイトのHTTPS版にリダイレクトされるはずです。

   例えば、Google GruyereサイトのHTTPS版にアクセスすることができます:
   <https://google-gruyere.appspot.com>

   ![HTTPSが機能している][img-https-ok]