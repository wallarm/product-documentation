[img-cert-request]:         ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-certificate-request.png
[img-cert-window]:          ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-certificate-window.png
[img-store-location]:       ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-store-location.png
[img-store]:                ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-store-selection.png
[img-wizard-resume]:        ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-wizard-resume.png
[img-fingerprint-warning]:  ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-fingerprint-warning.png
[img-import-ok]:            ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-import-success.png
[img-https-ok]:             ../../../images/fast/ssl/common/browsers-ssl/ie11-ssl/i-https-ok.png

#   Instalação do Certificado SSL autassinado do FAST Node para Microsoft Internet Explorer 11

Para instalar o certificado para o navegador Internet Explorer 11, faça o seguinte:

1.  Certifique-se de que você configura seu navegador para usar o nó FAST como o proxy HTTP e HTTPS.

2.  Solicite o arquivo `cert.der` de qualquer domínio via HTTP usando o navegador.
    
    Por exemplo, você pode usar um dos seguintes links:
    
    * <http://wallarm.get/cert.der>
    * <http://example.com/cert.der>

    O navegador oferecerá a escolha de abrir o arquivo do certificado ou de salvá-lo. Seleciona o botão **Abrir**.

    ![Solicitando o certificado autassinado do nó FAST][img-cert-request]

3.  Uma janela se abrirá contendo informações sobre o certificado. Observe que o nome e a data de expiração do seu certificado serão diferentes dos mostrados na imagem. Selecione o botão **Instalar Certificado**.

    ![Janela "Certificado"][img-cert-window]

4.  Selecione a opção de instalação de certificado adequada na janela aberta. Você pode instalar o certificado para o usuário atual ou para todos os usuários. Escolha a opção apropriada e selecione o botão **Próximo**.  

    ![Selecione localização do armazenamento do certificado][img-store-location]

5.  Será solicitado que você escolha um armazenamento de certificados. Selecione a opção "Colocar todos os certificados no seguinte armazenamento" e defina "Autoridades certificadoras raiz confiáveis" como o armazenamento. Selecione o botão **Próximo**.

    ![Selecione armazenamento do certificado][img-store]

    Certifique-se de que você selecionou o armazenamento adequado para o certificado e inicie o processo de importação, selecionando o botão **Concluir**.
    
    ![Retomar assistente de importação de certificado][img-wizard-resume]

6.  Será apresentada uma mensagem de aviso sobre a impossibilidade de validar a impressão digital do certificado sendo importado. Selecione o botão **Sim** para concluir o processo de importação.

    ![Aviso de validação de impressão digital][img-fingerprint-warning]

    Dado que a importação foi bem-sucedida, aparecerá a mensagem informativa "A importação foi bem-sucedida".

    ![Importação bem-sucedida do certificado][img-import-ok]
    
7.  Verifique se o certificado foi instalado corretamente. Para fazer isso, vá a qualquer site via HTTPS. Você deve ser redirecionado para a versão HTTPS do site sem quaisquer mensagens de aviso sobre certificado não confiável.

    Por exemplo, você pode navegar para a versão HTTPS do site Google Gruyere:
    <https://google-gruyere.appspot.com>

    ![HTTPS está funcionando][img-https-ok]