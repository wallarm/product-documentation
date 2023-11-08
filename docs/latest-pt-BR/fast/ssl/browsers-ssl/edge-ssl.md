[img-cert-request]: ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-certificate-request.png
[img-cert-window]: ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-certificate-window.png
[img-store-location]: ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-store-location.png
[img-store]: ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-store-selection.png
[img-wizard-resume]: ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-wizard-resume.png
[img-fingerprint-warning]: ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-fingerprint-warning.png
[img-import-ok]: ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-import-success.png
[img-https-ok]: ../../../images/fast/ssl/common/browsers-ssl/edge-ssl/e-https-ok.png

    
#   Instalação do certificado SSL autoassinado FAST Node para Microsoft Edge

Para instalar o certificado no navegador Microsoft Edge, faça o seguinte:

1.  Certifique-se de que você configurou seu navegador para usar o nó FAST como proxy para HTTP e HTTPS.

2.  Solicite o arquivo `cert.der` de qualquer domínio via HTTP usando o navegador.

    Por exemplo, você pode usar um dos seguintes links: 
   
    * <http://wallarm.get/cert.der>
    * <http://example.com/cert.der> 

    O navegador irá oferecer a escolha de abrir o arquivo de certificado ou salvá-lo. Selecione o botão **Abrir**.

    ![Solicitando o certificado autoassinado FAST node][img-cert-request]

3.  Uma janela será aberta contendo informações sobre o certificado. Observe que o nome e a data de validade do seu certificado serão diferentes dos mostrados na imagem. Selecione o botão **Instalar Certificado**.

    ![Janela "Certificado"][img-cert-window]

4.  Selecione a opção de instalação de certificado adequada na janela aberta. Você pode instalar o certificado tanto para o usuário atual quanto para todos os usuários. Escolha a opção apropriada e selecione o botão **Proximo**.

    ![Selecione a localização de armazenamento do certificado][img-store-location]

5.  Será solicitado que você escolha uma loja de certificados. Selecione a opção "Colocar todos os certificados no seguinte armazenamento" e defina "Autoridades de Certificação Raiz Confiáveis" como a loja. Selecione o botão **Proximo**.
    ![Selecione a loja de certificados][img-store]

    Certifique-se de que selecionou a loja apropriada para o certificado e inicie o processo de importação, selecionando o botão **Concluir**.
    
    ![Resumo do assistente de importação de certificados][img-wizard-resume]

6.  Será apresentada uma mensagem de aviso sobre a impossibilidade de validar a impressão digital do certificado a ser importado. Selecione o botão **Sim** para concluir o processo de importação.

    ![Aviso de validação de impressão digital][img-fingerprint-warning]

    Dado que a importação tenha sido bem-sucedida, a mensagem informativa "A importação foi bem-sucedida" aparecerá.

    ![Importação bem-sucedida do certificado][img-import-ok]

7.  Verifique se o certificado foi instalado corretamente. Para fazer isso, acesse qualquer site via HTTPS. Você deve ser redirecionado para a versão HTTPS do site sem nenhuma mensagem de aviso sobre certificados não confiáveis.

    Por exemplo, você poderia navegar para a versão HTTPS do site Google Gruyere:
    <https://google-gruyere.appspot.com>

    ![HTTPS está funcionando][img-https-ok]