[img-quick-help-howto]:     ../../images/fast/onboarding/common/1-quick-help.png
[img-fast-5mins-button]:    ../../images/fast/onboarding/common/2-fast-in-5mins.png
[img-intro]:                ../../images/fast/onboarding/common/3-intro.png
[img-deploy]:               ../../images/fast/onboarding/common/4-deploy.png
[img-cont-deployed]:        ../../images/fast/onboarding/common/5-cont-deployed.png
[img-ff-proxy-settings]:    ../../images/fast/onboarding/common/6-ff-proxy.png
[img-create-testrun]:       ../../images/fast/onboarding/common/7-create-testrun.png
[img-recording]:            ../../images/fast/onboarding/common/8-check-recording.png
[img-http-request]:         ../../images/fast/onboarding/common/9-request.png
[img-gruyere-app]:          ../../images/fast/onboarding/common/10-gruyere-app.png
[img-stop-recording]:       ../../images/fast/onboarding/common/11-stop-recording.png
[img-results]:              ../../images/fast/onboarding/common/12-detected-vuln.png
[img-detailed-results]:     ../../images/fast/onboarding/common/13-vuln-details.png
[img-finish]:               ../../images/fast/onboarding/common/14-finish.png

[link-wl-portal]:           https://us1.my.wallarm.com
[link-docker-install-docs]: https://docs.docker.com/install/overview/
[link-firefox-proxy]:       https://support.mozilla.org/en-US/kb/connection-settings-firefox
[link-gruyere-app]:         http://google-gruyere.appspot.com/
[link-qsg]:                 ../qsg/deployment-options.md

# Introdução Rápida ao FAST

--8<-- "../include-pt-BR/fast/cloud-note.md"

Na sua primeira vez no [portal Wallarm][link-wl-portal], você terá a oportunidade de conhecer o FAST passando por um processo de introdução de cinco passos.

!!! info "Controlando o processo de introdução"
    Você pode parar o processo de introdução a qualquer momento clicando no botão ✕ no painel de introdução.
    
    Será apresentada a opção de pular a introdução completamente ou retomar o processo mais tarde a partir do passo em que você está.
    
    Se você pulou a introdução e deseja iniciá-la, pressione o ponto de interrogação no canto superior direito do portal Wallarm e escolha a opção "FAST em 5 minutos" na barra lateral que se abre:
    
    ![Botão “Ajuda rápida”][img-quick-help-howto]
    
    Se você quiser retomar o processo de introdução que adiou anteriormente, clique no botão "FAST em 5 minutos" no canto inferior direito do portal Wallarm:
    
    ![Botão “FAST em 5 minutos”][img-fast-5mins-button]

Para obter uma introdução rápida ao FAST, faça o seguinte:
1. Leia sobre a solução FAST.
    
    ![Informação geral sobre a solução FAST][img-intro]
    
    Clique no botão “Implantar FAST Node →” para ir para o próximo passo.
    
2. Implemente um container Docker com o nó FAST na sua máquina. Para isso, copie e execute o comando `docker run` que é mostrado neste passo. O comando já está preenchido com todos os parâmetros necessários.
    
    ![A dica de implementação][img-deploy]
    
    !!! info "Instalando Docker"
        Se você não tem Docker, então [instale-o][link-docker-install-docs]. Qualquer edição do Docker é considerada adequada - Community Edition ou Enterprise Edition.
    
    O nó FAST ouvirá conexões de entrada em `127.0.0.1:8080` após iniciar.
    
    ![O nó FAST implementado][img-cont-deployed]

    Configure um navegador na sua máquina para usar `127.0.0.1:8080` como seu proxy HTTP. Você pode usar qualquer navegador, com exceção do que o portal Wallarm está aberto. Recomendamos o Mozilla Firefox (veja as [instruções][link-firefox-proxy] sobre como configurar o Firefox para usar proxy).
    
    ![As configurações de proxy no Mozilla Firefox][img-ff-proxy-settings]
    
    !!! info "Usando um número de porta diferente"
        Se você não quer fornecer a porta `8080` para o nó FAST (por exemplo, há outro serviço ouvindo nessa porta), você pode definir outro número de porta para ser usado pelo FAST. Para isso, passe o número de porta desejado através do parâmetro `-p` do comando `docker run`. Por exemplo, para usar a porta `9090`, você escreveria o seguinte: `-p 9090:8080`.
    
    Clique no botão “Criar Teste →” para ir para o próximo passo.
    
    !!! info "Retornando ao passo anterior"
        Note que você sempre pode voltar ao passo anterior clicando no botão com o nome do passo anterior (por exemplo, “← Compreendendo o FAST”).
   
3. Crie um teste clicando no botão “Criar teste”. Escolha um nome para o teste e então selecione a política de teste e o nó necessários nas listas suspensas, conforme indicado na dica de introdução:

    ![A criação de um teste][img-create-testrun]
    
    Pressione o botão “Criar e executar” para completar o processo de criação do teste.
    
    Clique no botão “Descubra Vulnerabilidades →” para ir para o próximo passo.
    
4. Certifique-se de que a mensagem `Gravando base para TesteRun...` está sendo exibida no console do nó FAST:
    
    ![O console do nó FAST][img-recording]
    
    Em seguida, envie uma solicitação para o aplicativo vulnerável chamado [Google Gruyere][link-gruyere-app] para começar o processo de testes de vulnerabilidades com o FAST.
    
    Para fazer isso, copie a solicitação HTTP que é fornecida na dica de introdução, cole-a na barra de endereços do navegador que você configurou anteriormente para usar o nó FAST como proxy, e execute a solicitação:
    
    ![Solicitação HTTP na dica][img-http-request]
    
    ![A execução da solicitação HTTP][img-gruyere-app]
    
    Depois de enviar a solicitação, pare o processo de gravação da solicitação selecionando a entrada “Parar gravação” no menu suspenso "Ações". Confirme a ação pressionando o botão “Sim”:
    
    ![Parando o processo de gravação de solicitação][img-stop-recording]
    
    Aguarde até que a testagem seja concluída. O FAST deve detectar uma vulnerabilidade XSS no aplicativo Google Gruyere. O identificador e o tipo da vulnerabilidade devem ser exibidos na coluna “Resultados” do teste:
    
    ![O resultado dos testes][img-results]
    
    !!! info "Analisando a vulnerabilidade"
        Você pode clicar no valor na coluna “Resultados” do teste para obter informações sobre a vulnerabilidade descoberta:
        
        ![Informação detalhada sobre a vulnerabilidade][img-detailed-results]
    
    Clique no botão “Vamos lá!” para ir para o próximo passo.
    
5. A essa altura, você já se familiarizou com o FAST e descobriu uma vulnerabilidade em uma aplicação web.
    
    ![O fim do processo de introdução][img-finish]
    
    Navegue até o [“Guia de Início Rápido”][link-qsg] para obter informações mais detalhadas sobre como começar com o FAST.
    
    Clique no botão “Concluir” para finalizar o processo de introdução.
    
    !!! info "Ações adicionais a serem tomadas"
        Você pode encerrar o container Docker do nó FAST e desativar a utilização de proxy no navegador após a detecção bem-sucedida da vulnerabilidade.