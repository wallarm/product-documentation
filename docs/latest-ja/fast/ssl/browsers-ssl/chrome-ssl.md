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

#   Google Chrome用のFASTノード自己署名SSL証明書のインストール

Google Chromeブラウザーに証明書をインストールするには、次の手順を実施してください：

1.  FASTノードをHTTPおよびHTTPSプロキシとして使用するようにブラウザを設定したことを確認します。

2.  ブラウザを使用して、任意のドメインからファイル`cert.der`をHTTPで要求します。

    例えば、以下のリンクの一つを使用できます：
    
    * <http://wallarm.get/cert.der>
    * <http://example.com/cert.der>

    ブラウザは証明書ファイルをダウンロードします。設定により、ファイルはデフォルトのダウンロードディレクトリまたは選択したディレクトリに配置されます。

    ![!自己署名のFASTノード証明書の要求][img-cert-request]

3.  ブラウザのプライバシーとセキュリティ設定のリストを開きます。これには、<chrome://settings/privacy>リンクに移動するか、ブラウザの設定を開き、設定リストの最後にある**詳細設定**ボタンを選択して追加設定を展開します。

    ![!Chromeの詳細設定][img-adv-settings]
    
    「証明書の管理」オプションを選択します。
    
    ![!Chromeの「証明書の管理」設定][img-cert-mgmt]

4.  Chromeの証明書に関する情報を含む「証明書」ウィンドウが開きます。「信頼されたルート認証局」タブに切り替えて、**インポート**ボタンを選択します。 

    ![!「証明書」ウィンドウ][img-cert-window]
        
    証明書のインポートウィザードが開かれます。**次へ**ボタンを選択します。
        
    ![!証明書のインポートウィザード][img-cert-wizard]

5.  **参照**ボタンを選択し、前にダウンロードした証明書ファイルを選択します。
    
    ![!証明書ファイルのインポート][img-cert-import]

    必要に応じて、「すべてのファイル」のファイルタイプを選択します。次に、**次へ**ボタンを選択します。

    ![!証明書ファイルの選択][img-cert-select]

6.  証明書ストアを選択するように求められます。「次のストアにすべての証明書を配置します」というオプションを選び、「信頼されたルート認証局」をストアとして設定します。そして、**次へ**ボタンを選択します。

    ![!証明書ストアの選択][img-store]
    
    証明書に適切なストアが選択されていることを確認し、**完了**ボタンを選択してインポートプロセスを開始します。
    
    ![!証明書のインポートウィザードの再開][img-wizard-resume]

7.  インポート中の証明書の指紋を検証できないという警告メッセージが表示されます。インポートプロセスを完了させるために、**はい**ボタンを選択します。

    ![!指紋検証の警告][img-fingerprint-warning]

    インポートが成功した場合、「インポートは成功しました」という情報メッセージが表示されます。

    ![!証明書のインポート成功][img-import-ok]
    
    これで、「証明書」ウィンドウの「信頼されたルート認証局」タブにインポートした証明書が表示されます。画像に表示されているものとは異なり、証明書の名前と有効期限が異なることに注意してください。
    
    ![!インストールされた証明書][img-installed-cert]

8.  証明書が正しくインストールされたことを確認します。そのために、HTTPS経由で任意のサイトに移動します。証明書が信頼できないという警告メッセージなしに、サイトのHTTPSバージョンにリダイレクトされるはずです。

    例えば、Google GruyereサイトのHTTPSバージョンに移動してみてください：
    <https://google-gruyere.appspot.com>

    ![!HTTPSが動作しています][img-https-ok]