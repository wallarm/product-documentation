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
    
# FAST Node自己署名SSL証明書のGoogle Chrome用インストール

Google Chromeブラウザに証明書をインストールするには、次の手順に従ってください:

1. ブラウザがHTTPおよびHTTPSプロキシとしてFAST Nodeを使用するように設定されていることをご確認ください。

2. ブラウザを使用して、任意のドメインからHTTP経由で`cert.der`ファイルをリクエストしてください。

   たとえば、以下のリンクのいずれかを使用できます:
    
   * <http://wallarm.get/cert.der>
   * <http://example.com/cert.der>

   ブラウザは証明書ファイルをダウンロードします。構成によっては、ファイルは既定のダウンロードディレクトリまたは指定したディレクトリに保存されます。

   ![自己署名FAST Node証明書のリクエスト][img-cert-request]

3. ブラウザのプライバシーとセキュリティ設定リストを開いてください。これを行うには、<chrome://settings/privacy>リンクにアクセスするか、ブラウザの設定を開いて設定リストの末尾にある**Advanced**ボタンを選択し、追加設定を展開してください。

   ![Chrome advanced settings][img-adv-settings]
    
   「Manage certificates」オプションを選択してください。

   ![Chrome “Manage certificates” setting][img-cert-mgmt]

4. Chrome証明書に関する情報が含まれるCertificatesウィンドウが表示されます。「Trusted Root Certification Authorities」タブに切り替え、**Import**ボタンを選択してください。

   ![Certificatesウィンドウ][img-cert-window]
        
   Certificate Import Wizardが起動されますので、**Next**ボタンを選択してください。
        
   ![Certificate Import Wizard][img-cert-wizard]

5. **Browse**ボタンを選択し、以前にダウンロードした証明書ファイルを選択してください。 

   ![証明書ファイルのインポート][img-cert-import]

   必要に応じて「All files」ファイルタイプを指定してください。**Next**ボタンを選択してください。

   ![証明書ファイルの選択][img-cert-select]

6. 証明書ストアの選択を求められます。'Place all certificates in the following store'オプションを選択し、証明書ストアとして'Trusted Root Certification Authorities'を指定してください。**Next**ボタンを選択してください。

   ![証明書ストアの選択][img-store]
    
   適切な証明書ストアを選択したことを確認し、**Finish**ボタンを選択してインポートプロセスを開始してください。
    
   ![Certificate import wizard resume][img-wizard-resume]

7. インポート中の証明書のフィンガープリントが検証できない旨の警告メッセージが表示されます。インポートプロセスを完了するために**Yes**ボタンを選択してください。

   ![フィンガープリント検証警告][img-fingerprint-warning]

   インポートが成功すると、「The import was successful」という情報メッセージが表示されます。

   ![証明書のインポート成功][img-import-ok]
    
   次に、Certificatesウィンドウの「Trusted Root Certification Authorities」タブにインポートした証明書が表示されます。なお、証明書の名称や有効期限は画像に表示されているものと異なる場合があります。
    
   ![インストールされた証明書][img-installed-cert]

8. 証明書が正しくインストールされたことをご確認ください。そのために、任意のサイトにHTTPSでアクセスしてください。未認証の証明書に関する警告メッセージなしに、HTTPS版のサイトにリダイレクトされます。

   たとえば、Google GruyereサイトのHTTPS版にアクセスしてください:
   <https://google-gruyere.appspot.com>

   ![HTTPSが動作している][img-https-ok]