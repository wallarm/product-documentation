[link-node-installation]:       install-certificate-on-fast-node.md
[link-safari-ssl]:              browsers-ssl/safari-ssl.md
[link-chrome-ssl]:              browsers-ssl/chrome-ssl.md
[link-edge-ssl]:                browsers-ssl/edge-ssl.md
[link-ie11-ssl]:                browsers-ssl/ie11-ssl.md
[link-firefox-ssl]:             browsers-ssl/firefox-ssl.md

[img-insecure-connection]:      ../../images/fast/qsg/common/deployment/11-qsg-fast-inst-untrusted-cert.png

# はじめに

HTTPSを利用してブラウザからWebアプリケーションにアクセスする場合、不正な証明書に関する次のような警告が表示されることがあります：

![Mozilla Firefoxの不正な証明書警告][img-insecure-connection]

FASTノードはクライアントからのHTTPSリクエストを中断し、リモートサーバへの接続を自ら開始します。お使いのブラウザはFASTノードの証明書を信頼する必要があります。そうでなければ、ブラウザはこの状況を中間者攻撃として認識します。

お使いのブラウザで信頼される証明書を持たないFASTノードの場合、そのブラウザからサーバへHTTPSリクエストを送信しようとすると、セキュリティ保護されていない接続の警告が表示されます。

HTTPSを利用したWebアプリケーションの正常な動作のため、次のいずれかの方法を利用できます：
* お使いのブラウザですでに信頼されている独自のSSL証明書をお持ちの場合、[FASTノードに追加する][link-node-installation]ことができます。
* 独自のSSL証明書をお持ちでない場合、FASTノードの自己署名ルート証明書をブラウザに追加できます。そのためには、お使いのブラウザに合わせた手順に従ってください：
    * [Apple Safari][link-safari-ssl]
    * [Google Chrome][link-chrome-ssl]
    * [Microsoft Edge][link-edge-ssl]
    * [Microsoft Internet Explorer 11][link-ie11-ssl]
    * [Mozilla Firefox][link-firefox-ssl]