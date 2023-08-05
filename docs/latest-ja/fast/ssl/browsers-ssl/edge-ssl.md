[img-cert-request]:         ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-certificate-request.png
[img-cert-window]:          ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-certificate-window.png
[img-store-location]:       ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-store-location.png
[img-store]:                ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-store-selection.png
[img-wizard-resume]:        ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-wizard-resume.png
[img-fingerprint-warning]:  ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-fingerprint-warning.png
[img-import-ok]:            ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-import-success.png
[img-https-ok]:             ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-https-ok.png

#   FASTノード自己署名SSL証明書のMicrosoft Edgeへのインストール

Microsoft Edgeブラウザ上で証明書をインストールするには、次の手順を実行します：

1.  あなたのブラウザがFASTノードをHTTPおよびHTTPSのプロキシとして使用するように設定されていることを確認します。

2.  ブラウザを使用して、任意のドメインからファイル`cert.der`をHTTPを通じてリクエストします。

    例えば、次のリンクの一つを使用することができます：
   
    * <http://wallarm.get/cert.der>
    * <http://example.com/cert.der> 

    ブラウザは証明書ファイルを開くか保存するかの選択をするでしょう。**開く**ボタンを選択します。

    ![!自己署名FASTノード証明書のリクエスト][img-cert-request]

3.  証明書の情報が記載されているウィンドウが開きます。あなたの証明書の名前と有効期限は、画像に表示されているものと異なります。**証明書のインストール**ボタンを選択します。

    ![!“証明書”ウィンドウ][img-cert-window]

4.  開いたウィンドウで適した証明書のインストールオプションを選択します。証明書は現在のユーザまたは全てのユーザのためにインストールできます。適切なオプションを選択し、**次へ**ボタンを選択します。

    ![!証明書ストアの場所の選択][img-store-location]

5.  証明書ストアを選択するよう求められます。“次のストアにすべての証明書を配置する”オプションを選び、“信頼されたルート認証局”をストアとして設定します。**次へ**ボタンを選択します。    
    ![!証明書ストアの選択][img-store]

    証明書の適切なストアが選択されていること確認し、**完了**ボタンを選択してインポートプロセスを開始します。
    
    ![!証明書インポートウィザードの再開][img-wizard-resume]

6.  インポートされる証明書の指紋を確認できないという警告メッセージが表示されます。インポートプロセスを完了するために**はい**ボタンを選択します。

    ![!指紋検証の警告][img-fingerprint-warning]

    インポートが成功すれば、“インポートは成功しました”という情報メッセージが表示されます。

    ![!証明書の成功したインポート][img-import-ok]

7.  証明書が正しくインストールされたことを確認します。それを行うには、HTTPSを介して任意のサイトに移動します。あなたは警告メッセージなしでサイトのHTTPSバージョンにリダイレクトされるはずです。

    例えば、Google GruyereサイトのHTTPSバージョンにアクセスすることができます：
    <https://google-gruyere.appspot.com>

    ![!HTTPSは動作しています][img-https-ok]