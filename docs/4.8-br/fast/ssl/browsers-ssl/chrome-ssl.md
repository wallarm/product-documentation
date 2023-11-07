[img-cert-request]:         ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-certificate-request.png
[img-adv-settings]:         ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-advanced-settings.png
[img-cert-mgmt]:            ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-manage-certificates.png
[img-cert-window]:          ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-certificates-window.png
[img-cert-wizard]:          ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-certificates-wizard.png
[img-cert-import]:          ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-file-import.png
[img-cert-select]:          ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-file-selection.png
[img-store]:                ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-store-selection.png
[img-wizard-resume]:        ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-wizard-resume.png    
[img-fingerprint-warning]:  ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-fingerprint-warning.png
[img-import-ok]:            ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-import-success.png
[img-installed-cert]:       ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-installed-certificate.png
[img-https-ok]:             ../../../images/fast/ssl/common/browsers-ssl/chrome-ssl/c-https-ok.png  

# Instalação do certificado SSL autogerado no nó FAST para o Google Chrome

Para instalar o certificado para o navegador Google Chrome, faça o seguinte:

1. Certifique-se de que você configurou o seu navegador para usar o nó FAST como o proxy HTTP e HTTPS.

2. Solicite o arquivo `cert.der` de qualquer domínio por meio de HTTP usando o navegador.

   Por exemplo, você pode usar um dos seguintes links:
   
    * <http://wallarm.get/cert.der>
    * <http://example.com/cert.der>

   O navegador baixará o arquivo do certificado. Dependendo da configuração, o arquivo será colocado no diretório padrão de downloads ou no diretório de sua escolha.

    ![Solicitando o certificado autogerado da FAST node][img-cert-request]

3. Abra a lista de configurações de privacidade e segurança do navegador. Para fazer isso, navegue até o link <chrome://settings/privacy> ou abra as configurações do navegador e expanda as configurações adicionais selecionando o botão **Avançado** no final da lista de configurações.

    ![Configurações avançadas do Chrome][img-adv-settings]
    
    Selecione a opção "Gerenciar certificados".
    
    ![Configuração “Gerenciar certificados” do Chrome][img-cert-mgmt]

4. Uma janela “Certificados” abrirá, contendo informações sobre os certificados do Chrome. Alterne para a aba "Autoridades de Certificação Raiz Confiáveis" e selecione o botão **Importar**. 

    ![Janela “Certificados”][img-cert-window]
        
    Um Assistente de Importação de Certificado deve ser aberto. Selecione o botão **Próximo**.
        
    ![Assistente de importação de certificado][img-cert-wizard]

5. Selecione o botão **Procurar** e escolha o arquivo de certificado que você baixou anteriormente. 
    
    ![Importação do arquivo de certificado][img-cert-import]

    Escolha o tipo de arquivo "Todos os arquivos", se necessário. Selecione o botão **Próximo**.

    ![Seleção do arquivo de certificado][img-cert-select]

6. Será solicitado que você escolha uma loja de certificados. Selecione a opção "Colocar todos os certificados na loja a seguir" e defina "Autoridades de certificação de raízes confiáveis" como a loja. Selecione o botão **Próximo**.

    ![Selecionar loja de certificados][img-store]
    
    Certifique-se de que selecionou a loja apropriada para o certificado e inicie o processo de importação selecionando o botão **Finalizar**.
    
    ![Retomar o assistente de importação de certificado][img-wizard-resume]

7. Será apresentada uma mensagem de aviso sobre a impossibilidade de validar a impressão digital do certificado a ser importado. Selecione o botão **Sim** para concluir o processo de importação.

    ![Aviso de validação de impressão digital][img-fingerprint-warning]


    Dado que a importação seja bem-sucedida, a mensagem informativa "A importação foi bem-sucedida" aparecerá.

    ![Importação bem-sucedida do certificado][img-import-ok]
    
    Agora você verá o certificado importado na aba "Autoridades de Certificação Raiz Confiáveis" da janela "Certificados". Observe que o nome e a data de validade do seu certificado serão diferentes dos mostrados na imagem.
    
    ![Certificado instalado][img-installed-cert]

8. Verifique se o certificado foi instalado corretamente. Para fazer isso, vá a qualquer site via HTTPS. Você deve ser redirecionado para a versão HTTPS do site sem quaisquer mensagens de aviso sobre certificados não confiáveis.

    Por exemplo, você pode navegar para a versão HTTPS do site Google Gruyere:
    <https://google-gruyere.appspot.com>

    ![HTTPS está funcionando][img-https-ok]