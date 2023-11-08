[img-cert-request]:         ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-certificate-request.png
[img-downloaded-cert]:      ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-downloaded-certificate.png
[img-keychain-import]:      ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-keychain-prompt.png
[img-untrusted-cert]:       ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-keychain-untrusted-certificate.png
[img-cert-properties]:      ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-keychain-certificate-properties.png
[img-credentials-prompt]:   ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-keychain-credentials-prompt.png
[img-trusted-cert]:         ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-keychain-trusted-certificate.png
[img-https-ok]:             ../../../images/fast/ssl/common/browsers-ssl/safari-ssl/s-https-ok.png

#   Instalação do Certificado SSL Autossinado do Nó FAST para Apple Safari

Para instalar o certificado para o navegador Apple Safari, faça o seguinte:

1.  Certifique-se de ter configurado o seu navegador para usar o nó FAST como proxy HTTP e HTTPS.

2.  Solicite o arquivo `cert.der` de qualquer domínio via HTTP usando o navegador.

    Por exemplo, você pode usar um dos seguintes links:

    * <http://wallarm.get/cert.der>
    * <http://example.com/cert.der>

    O navegador irá baixar o arquivo do certificado. Dependendo da configuração, o arquivo será colocado no diretório de download padrão ou no diretório de sua escolha.
    
    ![Solicitando o certificado autossinado do nó FAST][img-cert-request]
    
    Abra o arquivo baixado.

    ![O certificado baixado][img-downloaded-cert]

3.  O aplicativo Keychain Access oferecerá para importar o certificado.  

    Você pode instalar o certificado para o usuário atual ou para todos os usuários. Escolha a opção apropriada e selecione o botão **Adicionar**.

    ![Janela "Adicionar Certificados" do Keychain Access][img-keychain-import]

4.  Você verá o certificado importado marcado como um certificado não confiável. Observe que o nome e a data de expiração do seu certificado serão diferentes daqueles mostrados na imagem.

    ![Certificado não confiável no aplicativo Keychain Access][img-untrusted-cert]

5.  Para converter o certificado em um confiável, clique duas vezes nele para abrir a janela de propriedades do certificado. Expanda a lista "Confiar" e selecione **Sempre Confiar** para SSL.

    ![A janela de propriedades do certificado][img-cert-properties]

    Você será solicitado a digitar sua senha para continuar.

    ![Solicitação de credenciais][img-credentials-prompt]

    Agora o certificado importado deve ser marcado como confiável.
    
    ![Certificado confiável no aplicativo Keychain Access][img-trusted-cert]

6.  Verifique se o certificado foi instalado corretamente. Para fazer isso, vá para qualquer site via HTTPS. Você deve ser redirecionado para a versão HTTPS do site sem nenhuma mensagem de aviso sobre certificados não confiáveis.

    Por exemplo, você pode navegar para a versão HTTPS do site Google Gruyere:
    <https://google-gruyere.appspot.com>

    ![HTTPS está funcionando][img-https-ok]