[img-cert-request]:         ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-certificate-request.png
[img-cert-window]:          ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-certificate-window.png
[img-store-location]:       ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-store-location.png
[img-store]:                ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-store-selection.png
[img-wizard-resume]:        ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-wizard-resume.png
[img-fingerprint-warning]:  ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-fingerprint-warning.png
[img-import-ok]:            ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-import-success.png
[img-https-ok]:             ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-https-ok.png
        
    
#   Microsoft Internet Explorer 11向けFAST Node自己署名SSL証明書のインストール

Internet Explorer 11ブラウザに証明書をインストールするには、次の手順を実行します。

1.  ブラウザでHTTPおよびHTTPSプロキシとしてFAST nodeを使用するように設定していることを確認します。

2.  ブラウザを使用して、HTTPで任意のドメインから`cert.der`ファイルを要求します。
    
    例えば、次のいずれかのリンクを使用できます:
    
    * <http://wallarm.get/cert.der>
    * <http://example.com/cert.der>

    ブラウザは証明書ファイルを開くか保存するかの選択肢を表示します。**Open**ボタンを選択します。

    ![自己署名のFAST node証明書の要求][img-cert-request]

3.  証明書に関する情報を含むウィンドウが開きます。証明書の名前と有効期限は、画像に表示されているものとは異なります。**Install Certificate**ボタンを選択します。

    ![「Certificate」ウィンドウ][img-cert-window]

4.  開いたウィンドウで、適切な証明書インストールのオプションを選択します。証明書は現在のユーザーのみ、またはすべてのユーザー向けにインストールできます。該当するオプションを選択し、**Next**ボタンを選択します。  

    ![証明書ストアの保存先を選択][img-store-location]

5.  証明書ストアの選択を求められます。「Place all certificates in the following store」を選択し、ストアには「Trusted Root Certification Authorities」を指定します。**Next**ボタンを選択します。

    ![証明書ストアを選択][img-store]

    証明書に適切なストアが選択されていることを確認し、**Finish**ボタンを選択してインポートを開始します。
    
    ![証明書インポートウィザードの要約][img-wizard-resume]

6.  インポート対象の証明書のフィンガープリントを検証できない旨の警告メッセージが表示されます。インポートを完了するため、**Yes**ボタンを選択します。

    ![フィンガープリント検証の警告][img-fingerprint-warning]

    インポートが成功すると、「The import was successful」という情報メッセージが表示されます。

    ![証明書のインポート成功][img-import-ok]
    
7.  証明書が正しくインストールされたことを確認します。そのために、HTTPSで任意のサイトにアクセスします。信頼されていない証明書に関する警告メッセージなしに、そのサイトのHTTPS版へリダイレクトされるはずです。

    例えば、Google GruyereサイトのHTTPS版にアクセスできます:
    <https://google-gruyere.appspot.com>

    ![HTTPSが機能しています][img-https-ok]