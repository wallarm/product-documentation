[img-cert-request]:     ../../../images/fast/ssl/common/browsers-ssl/firefox-ssl/f-certificate-request.png
[img-cert-download]:    ../../../images/fast/ssl/common/browsers-ssl/firefox-ssl/f-certificate-download.png
[img-https-ok]:         ../../../images/fast/ssl/common/browsers-ssl/firefox-ssl/f-https-ok.png

# Mozilla Firefox向けFASTノード自己署名SSL証明書のインストール

Mozilla Firefoxブラウザ用に証明書をインストールするには、次の手順に従います:

1. ブラウザがFASTノードをHTTPおよびHTTPSプロキシとして設定していることを確認します。

2. ブラウザを使用して、任意のドメインからHTTP経由で`cert.der`ファイルをリクエストします。

   例えば、次のリンクのいずれかを使用できます:
   
   * <http://wallarm.get/cert.der>
   * <http://example.com/cert.der>

   ブラウザは証明書ファイルをダウンロードします。設定に応じて、ファイルはデフォルトのダウンロードディレクトリまたは指定したディレクトリに保存されます。
   
   ![自己署名FASTノード証明書のリクエスト][img-cert-request]

3. ダイアログウィンドウが表示され、証明書のインストールを求められます。証明書の名称および有効期限は画像に表示されているものと異なる場合がありますのでご注意ください。    
   
   「Trust this CA to identify websites」オプションを選択し、**OK**ボタンを押します。

   ![証明書のダウンロード][img-cert-download]

4. 証明書が正しくインストールされたことを確認します。そのためには、HTTPS経由で任意のサイトにアクセスします。不正な証明書に関する警告メッセージなしに、サイトのHTTPSバージョンにリダイレクトされるはずです。

   例えば、Google GruyereサイトのHTTPSバージョンにアクセスできます:
   <https://google-gruyere.appspot.com>

   ![HTTPSが正常に動作しています][img-https-ok]