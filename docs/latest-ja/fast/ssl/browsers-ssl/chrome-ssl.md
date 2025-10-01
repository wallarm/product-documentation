[img-cert-request]:         ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-certificate-request.png
[img-adv-settings]:         ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-advanced-settings.png
[img-cert-mgmt]:            ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-manage-certificates.png
[img-cert-window]:          ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-certificates-window.png
[img-cert-wizard]:          ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-certificates-wizard.png
[img-cert-import]:          ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-file-import.png
[img-cert-select]:          ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-file-selection.png
[img-store]:                ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-store-selection.png
[img-wizard-resume]:        ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-wizard-resume.png    
[img-fingerprint-warning]:  ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-fingerprint-warning.png
[img-import-ok]:            ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-import-success.png
[img-installed-cert]:       ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-installed-certificate.png
[img-https-ok]:             ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-https-ok.png   
    
    
    
    
#   Google Chrome向けFAST Node自己署名SSL証明書のインストール

Google Chromeブラウザに証明書をインストールするには、次の手順を実行します。

1.  ブラウザがFAST nodeをHTTPおよびHTTPSプロキシとして使用するように設定されていることを確認します。

2.  ブラウザを使用してHTTP経由で任意のドメインからファイル`cert.der`をリクエストします。

    例えば、次のリンクのいずれかを使用できます:
    
    * <http://wallarm.get/cert.der>
    * <http://example.com/cert.der>

    ブラウザは証明書ファイルをダウンロードします。設定に応じて、ファイルは既定のダウンロードディレクトリ、または選択したディレクトリに保存されます。

    ![自己署名のFAST node証明書のリクエスト][img-cert-request]

3.  ブラウザのプライバシーとセキュリティの設定一覧を開きます。これを行うには、<chrome://settings/privacy>に移動するか、ブラウザの設定を開き、設定リストの末尾にある**Advanced**ボタンを選択して追加設定を展開します。

    ![Chromeの“Advanced”設定][img-adv-settings]
    
    “Manage certificates”オプションを選択します。
    
    ![Chromeの“Manage certificates”設定][img-cert-mgmt]

4.  “Certificates”ウィンドウが開き、Chromeの証明書に関する情報が表示されます。“Trusted Root Certification Authorities”タブに切り替えて、**Import**ボタンを選択します。 

    ![“Certificates”ウィンドウ][img-cert-window]
        
    Certificate Import Wizardが開きます。**Next**ボタンを選択します。
        
    ![Certificate Import Wizard][img-cert-wizard]

5.  **Browse**ボタンを選択し、先ほどダウンロードした証明書ファイルを選択します。 
    
    ![証明書ファイルのインポート][img-cert-import]

    必要に応じてファイルの種類で“All files”を選択します。**Next**ボタンを選択します。

    ![証明書ファイルの選択][img-cert-select]

6.  証明書ストアの選択を求められます。“Place all certificates in the following store”オプションを選択し、ストアとして“Trusted Root Certification Authorities”を設定します。**Next**ボタンを選択します。

    ![証明書ストアの選択][img-store]
    
    証明書に適切なストアを選択したことを確認し、**Finish**ボタンを選択してインポートを開始します。
    
    ![Certificate Import Wizardの確認][img-wizard-resume]

7.  インポートする証明書のフィンガープリントを検証できない旨の警告メッセージが表示されます。インポートを完了するために**Yes**ボタンを選択します。

    ![フィンガープリント検証の警告][img-fingerprint-warning]

    インポートが成功すると、"The import was successful"という情報メッセージが表示されます。

    ![証明書のインポート成功][img-import-ok]
    
    その後、“Certificates”ウィンドウの“Trusted Root Certification Authorities”タブに、インポートした証明書が表示されます。なお、証明書の名前と有効期限は画像と異なります。
    
    ![インストール済みの証明書][img-installed-cert]

8.  証明書が正しくインストールされたことを確認します。HTTPS経由で任意のサイトにアクセスします。信頼されていない証明書に関する警告メッセージなしで、そのサイトのHTTPS版にリダイレクトされるはずです。

    例えば、Google GruyereサイトのHTTPS版にアクセスできます:
    <https://google-gruyere.appspot.com>

    ![HTTPSが正常に動作][img-https-ok]