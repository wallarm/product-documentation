[img-cert-request]:     ../../../images/fast/ssl/common/browsers-ssl/firefox-ssl/f-certificate-request.png
[img-cert-download]:    ../../../images/fast/ssl/common/browsers-ssl/firefox-ssl/f-certificate-download.png
[img-https-ok]:         ../../../images/fast/ssl/common/browsers-ssl/firefox-ssl/f-https-ok.png
    

#   Mozilla Firefox向けのFASTノード自己署名SSL証明書のインストール

Mozilla Firefoxブラウザに証明書をインストールするには、以下の手順を実行します：

1.  FASTノードをHTTPおよびHTTPSプロキシとして使用するようにブラウザを設定していることを確認します。

2.  ブラウザを使用してHTTP経由で任意のドメインからファイル`cert.der`を要求します。

    例えば、以下のリンクのいずれかを使用できます：
    
    * <http://wallarm.get/cert.der>
    * <http://example.com/cert.der>

    ブラウザは証明書ファイルをダウンロードします。設定により、ファイルはデフォルトのダウンロードディレクトリまたは選択したディレクトリに配置されます。
    
    ![自己署名FASTノード証明書の要求][img-cert-request]

3.  ダイアログウィンドウが開き、証明書のインストールを求められます。画像に表示されているものとは異なり、証明書の名前と有効期限が表示されます。    

    「このCAをウェブサイトを識別するために信頼する」というオプションを選択し、**OK**ボタンをクリックします。

    ![証明書のダウンロード][img-cert-download]

4.  証明書が正しくインストールされたことを確認します。そのためには、HTTPS経由で任意のサイトにアクセスします。信頼できない証明書に関する警告メッセージなしに、サイトのHTTPSバージョンにリダイレクトされるはずです。

    例えば、Google GruyereサイトのHTTPSバージョンにアクセスすることができます：
    <https://google-gruyere.appspot.com>

    ![HTTPSが機能しています][img-https-ok]