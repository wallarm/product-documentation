[link-node-installation]:       install-certificate-on-fast-node.md
[link-safari-ssl]:              browsers-ssl/safari-ssl.md
[link-chrome-ssl]:              browsers-ssl/chrome-ssl.md
[link-edge-ssl]:                browsers-ssl/edge-ssl.md
[link-ie11-ssl]:                browsers-ssl/ie11-ssl.md
[link-firefox-ssl]:             browsers-ssl/firefox-ssl.md

[img-insecure-connection]:      ../../images/fast/qsg/common/deployment/11-qsg-fast-inst-untrusted-cert.png

# Introdução

Ao trabalhar com um aplicativo da web por meio de um navegador usando HTTPS, você pode ver esta ou uma mensagem similar sobre um certificado não confiável:

![Mensagem de certificado não confiável do Mozilla Firefox][img-insecure-connection]

O nó FAST interrompe solicitações HTTPS de um cliente e inicia a conexão com o servidor remoto. Seu navegador deve confiar no certificado do nó FAST, caso contrário, o navegador tratará essa situação como um ataque de homem no meio.

Se um nó FAST não tiver um certificado confiável pelo navegador que você está usando, a tentativa de enviar solicitações HTTPS para o servidor a partir desse navegador resultará em um aviso de conexão não segura.

Para um trabalho bem-sucedido com aplicativos da web via HTTPS, você pode usar uma das seguintes soluções:
* Se você tem seu próprio certificado SSL que seu navegador já confia, você pode [adicioná-lo ao nó FAST][link-node-installation].
* Se você não tem seu próprio certificado SSL, você pode adicionar o certificado raiz autoassinado do nó FAST ao seu navegador. Para fazer isso, siga as instruções para o seu navegador:
    * [Apple Safari][link-safari-ssl]
    * [Google Chrome][link-chrome-ssl]
    * [Microsoft Edge][link-edge-ssl]
    * [Microsoft Internet Explorer 11][link-ie11-ssl]
    * [Mozilla Firefox][link-firefox-ssl]