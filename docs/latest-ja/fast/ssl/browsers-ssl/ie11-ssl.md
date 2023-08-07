[img-cert-request]:         ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-certificate-request.png
[img-cert-window]:          ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-certificate-window.png
[img-store-location]:       ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-store-location.png
[img-store]:                ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-store-selection.png
[img-wizard-resume]:        ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-wizard-resume.png
[img-fingerprint-warning]:  ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-fingerprint-warning.png
[img-import-ok]:            ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-import-success.png
[img-https-ok]:             ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-https-ok.png


#   Microsoft Internet Explorer 11 のためのFAST ノード自己署名 SSL証明書インストール

Internet Explorer 11 ブラウザに証明書をインストールするには、以下の手順に従ってください:

1.  HTTPおよびHTTPSプロキシとしてFASTノードを使用するようにブラウザを設定していることを確認してください。

2.  ブラウザを使用してHTTPを介して任意のドメインから `cert.der` ファイルをリクエストします。

    例えば、以下のリンク人気のリンクを使うことができます。
    
    * <http://wallarm.get/cert.der>
    * <http://example.com/cert.der>

    ブラウザは証明書ファイルを開くか保存するかを選ぶことができます。**開く**ボタンを選択します。

    ![!自己署名FAST ノード証明書のリクエスト][img-cert-request]

3.  証明書に関する情報が含まれているウィンドウが開きます。あなたの証明書の名前と有効期限は画像に表示されているものと異なることに注意してください。**証明書のインストール**ボタンを選択します。

    ![!“Certification” window][img-cert-window]

4.  開かれたウィンドウで適切な証明書のインストールオプションを選択します。現在のユーザーまたはすべてのユーザーのために証明書をインストールすることができます。適切なオプションを選択し、**次へ**ボタンを選択します。

    ![!証明書ストアの場所の選択][img-store-location]

5.  証明書ストアを選択するよう求められます。“以下のストアにすべての証明書を配置する”というオプションを選択し、ストアとして“信頼されたルート認証局”を設定します。**次へ**ボタンを選択します。

    ![!証明書ストアの選択][img-store]

    証明書の適切なストアが選択されていることを確認し、**完了**ボタンを選択してインポートのプロセスを開始します。

    ![!証明書インポートウィザードの再開][img-wizard-resume]

6.  インポートされる証明書の指紋の検証ができないという警告メッセージが表示されます。インポートプロセスを完了するためには、**はい**ボタンを選択します。

    ![!指紋検証警告][img-fingerprint-warning]

    インポートが成功した場合、“インポートは成功しました”という情報メッセージが表示されます。

    ![!証明書のインポートの成功][img-import-ok]

7.  証明書が正しくインストールされたことを確認します。それを行うために、HTTPS経由で任意のサイトにアクセスします。信頼できない証明書についての警告メッセージなしに、サイトのHTTPSバージョンにリダイレクトされるべきです。

    例えば、Google GruyereサイトのHTTPSバージョンにアクセスすることができます:
    <https://google-gruyere.appspot.com>

    ![!HTTPS が動作している][img-https-ok]