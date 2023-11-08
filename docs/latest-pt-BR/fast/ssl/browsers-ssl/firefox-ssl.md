[img-cert-request]:     ../../../images/fast/ssl/common/browsers-ssl/firefox-ssl/f-certificate-request.png
[img-cert-download]:    ../../../images/fast/ssl/common/browsers-ssl/firefox-ssl/f-certificate-download.png
[img-https-ok]:         ../../../images/fast/ssl/common/browsers-ssl/firefox-ssl/f-https-ok.png


#   Instalação do Certificado SSL Autossinado da FAST Node para Mozilla Firefox

Para instalar o certificado para o navegador Mozilla Firefox, faça o seguinte:

1.  Certifique-se de que você configurou seu navegador para usar o nodo FAST como proxy HTTP e HTTPS.

2.  Solicite o arquivo `cert.der` de qualquer domínio via HTTP usando o navegador.

    Por exemplo, você pode usar um dos seguintes links:
    
    * <http://wallarm.get/cert.der>
    * <http://example.com/cert.der>

    O navegador irá baixar o arquivo do certificado. Dependendo da configuração, o arquivo será colocado no diretório de download padrão ou no diretório de sua escolha.
    
    ![Solicitando o certificado autossinado da FAST node][img-cert-request]

3.  Uma janela de diálogo irá abrir. Será solicitado que você instale o certificado. Note que o nome e a data de expiração do seu certificado serão diferentes dos exibidos na imagem.    
    
    Escolha a opção "Confiar nesta CA para identificar sites" e selecione o botão **OK**.

    ![Baixando o certificado][img-cert-download]

4.  Verifique se o certificado foi instalado corretamente. Para fazer isso, vá para qualquer site via HTTPS. Você deve ser redirecionado para a versão HTTPS do site sem quaisquer mensagens de advertência sobre certificados não confiáveis.

    Por exemplo, você poderia navegar para a versão HTTPS do site Google Gruyere:
    <https://google-gruyere.appspot.com>

    ![HTTPS está funcionando][img-https-ok]