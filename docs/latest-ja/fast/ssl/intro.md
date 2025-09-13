[link-node-installation]:       install-certificate-on-fast-node.md
[link-safari-ssl]:              browsers-ssl/safari-ssl.md
[link-chrome-ssl]:              browsers-ssl/chrome-ssl.md
[link-edge-ssl]:                browsers-ssl/edge-ssl.md
[link-ie11-ssl]:                browsers-ssl/ie11-ssl.md
[link-firefox-ssl]:             browsers-ssl/firefox-ssl.md

[img-insecure-connection]:      ../../images/fast/qsg/common/deployment/11-qsg-fast-inst-untrusted-cert.png


# はじめに

ブラウザでHTTPSを使用してWebアプリケーションを利用していると、信頼されていない証明書に関する次のようなメッセージが表示されることがあります：

![Mozilla Firefoxの「信頼されていない証明書」メッセージ][img-insecure-connection]

FAST nodeはクライアントからのHTTPSリクエストを中継し、リモートサーバーへの接続を自ら開始します。ブラウザはFAST nodeの証明書を信頼する必要があります。そうでない場合、ブラウザはこの状況を中間者攻撃として扱います。  

使用しているブラウザが信頼する証明書をFAST nodeが保持していない場合、そのブラウザからサーバーへHTTPSリクエストを送信しようとすると、保護されていない接続の警告が表示されます。

HTTPS経由でWebアプリケーションを正常に利用するには、次のいずれかの方法を使用できます。
* ブラウザがすでに信頼している独自のSSL証明書をお持ちの場合は、[FAST nodeに追加できます][link-node-installation]。
* 独自のSSL証明書がない場合は、FAST nodeの自己署名ルート証明書をブラウザに追加できます。これを行うには、次のブラウザ向け手順に従ってください：
    * [Apple Safari][link-safari-ssl]
    * [Google Chrome][link-chrome-ssl]
    * [Microsoft Edge][link-edge-ssl]
    * [Microsoft Internet Explorer 11][link-ie11-ssl]
    * [Mozilla Firefox][link-firefox-ssl]