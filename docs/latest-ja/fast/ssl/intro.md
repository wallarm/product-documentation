[link-node-installation]:       install-certificate-on-fast-node.md
[link-safari-ssl]:              browsers-ssl/safari-ssl.md
[link-chrome-ssl]:              browsers-ssl/chrome-ssl.md
[link-edge-ssl]:                browsers-ssl/edge-ssl.md
[link-ie11-ssl]:                browsers-ssl/ie11-ssl.md
[link-firefox-ssl]:             browsers-ssl/firefox-ssl.md

[img-insecure-connection]:      ../../images/fast/qsg/common/deployment/11-qsg-fast-inst-untrusted-cert.png


# はじめに

HTTPSを使用してブラウザーからウェブアプリケーションを操作しているとき、これまたはこれに類似した信頼できない証明書についてのメッセージが表示される場合があります：

![Mozilla Firefox's untrusted certificate message][img-insecure-connection]

FASTノードは、クライアントからのHTTPSリクエストを中断し、自己接続をリモートサーバーに開始します。ブラウザーはFASTノードの証明書を信頼しなければならず、そうでなければブラウザーはこの状況をman-in-the-middle攻撃として扱います。

ブラウザーが信頼する証明書をFASTノードが持っていない場合、そのブラウザーからサーバーにHTTPSリクエストを送信しようとすると、セキュリティが確保されていない接続の警告が表示されます。

HTTPS経由でウェブアプリケーションとの正常な作業を行うには、次のうちのいずれかの解決策を使用できます：
* ブラウザーがすでに信頼している自身のSSL証明書がある場合、それを[FASTノードに追加][link-node-installation]することができます。
* 自身のSSL証明書がない場合、FASTノードの自己署名ルート証明書をブラウザーに追加できます。これを行うには、使用するブラウザーの指示に従ってください：
    * [Apple Safari][link-safari-ssl]
    * [Google Chrome][link-chrome-ssl]
    * [Microsoft Edge][link-edge-ssl]
    * [Microsoft Internet Explorer 11][link-ie11-ssl]
    * [Mozilla Firefox][link-firefox-ssl]