[img-fast-node-internals]: ../../images/fast/qsg/en/test-run/18-qsg-fast-test-run-proxy-internals.png
[img-view-recording-cloud]: ../../images/fast/qsg/common/test-run/20-qsg-fast-test-run-baselines-recording.png
[img-request-exec-result]:  ../../images/fast/qsg/common/test-run/22-qsg-fast-test-run-gruyere-request.png
[img-incoming-baselines]:   ../../images/fast/qsg/common/test-run/23-qsg-fast-test-run-processing.png    
[img-xss-found]:            ../../images/fast/qsg/common/test-run/24-qsg-fast-test-run-vuln.png

[link-deployment]:          deployment.md
[link-wl-console]:          https://us1.my.wallarm.com
[link-previous-chapter]:    test-preparation.md
[link-create-tr-gui]:       ../operations/create-testrun.md#creating-a-test-run-via-web-interface

[anchor1]:  #1-create-and-run-the-test-run  
[anchor2]:  #2-execute-the-https-baseline-request-you-created-earlier 

#   Executando o teste

Este capítulo o guiará pelo processo de geração e execução de um conjunto de testes de segurança. O conjunto de testes será construído usando a política de teste e a solicitação de linha de base que você criou [anteriormente][link-previous-chapter]. Após a conclusão de todas as etapas necessárias, você encontrará uma vulnerabilidade do XSS como resultado do teste.

Para iniciar o teste de segurança de aplicativos, deve ser criado um teste. *Teste* descreve um processo de teste de vulnerabilidade único. Cada teste possui um identificador único, que é crucial para a operação correta do FAST. Quando você cria um teste, um ID de teste e uma política de teste são enviados para o nó FAST. A seguir, o processo de teste de segurança é iniciado no nó.

O FAST gera e executa um conjunto de testes de segurança da seguinte maneira:

1.  O nó atua como um proxy transparente para todas as solicitações recebidas até que a política de teste e o ID do teste sejam enviados a ele.

2.  Dado que o teste é criado e executado, o nó FAST receberá a política de teste e o ID do teste da nuvem Wallarm.

3.  Se o nó receber uma solicitação de linha de base para o aplicativo de destino, então:
    1.  O nó marca a solicitação recebida com o ID do teste
    2.  A solicitação marcada é salva na nuvem Wallarm
    3.  A solicitação de linha de base inicial é enviada sem modificações para o aplicativo de destino
    
    !!! info "O processo de gravação de solicitações de linha de base"
        Este processo é frequentemente referido como gravação de solicitações de linha de base. Você pode interromper a gravação por meio da interface web da nuvem ou fazendo uma chamada de API para a API do Wallarm. O nó continuará enviando as linhas de base iniciais para o aplicativo de destino.
    
    A gravação de linha de base começa se o nó receber a política de teste e o ID do teste primeiro.
    
    O nó FAST determina se uma solicitação é de linha de base examinando a variável de ambiente `ALLOWED_HOSTS`. Esta variável foi configurada durante o [processo de implantação][link-deployment] do nó FAST. Se o domínio de destino da solicitação for permitido pela variável, então a solicitação é considerada de linha de base. Se você seguiu o guia, todas as solicitações para o domínio `google-gruyere.appspot.com` seriam consideradas de linha de base.
    
    Todas as outras solicitações que não são direcionadas para o aplicativo são encaminhadas como um proxy transparente sem qualquer modificação.

4.  O nó FAST recupera todas as solicitações de linha de base gravadas da nuvem Wallarm com base no ID do teste.

5.  O nó FAST gera testes de segurança para cada solicitação de linha de base usando a política de teste recebida da nuvem.

6.  Um conjunto de testes de segurança gerado é executado enviando as solicitações para o aplicativo de destino a partir do nó. Os resultados do teste são associados ao ID do teste e armazenados na nuvem.

    ![Lógica interna do nó FAST][img-fast-node-internals]

    !!! info "Nota sobre um teste em uso"
        Em qualquer intervalo de tempo, apenas um teste pode estar em execução no nó FAST. Se você criar outro teste para o mesmo nó, a execução do teste atual é interrompida.
       
Para iniciar o processo de geração e execução do teste de segurança, faça o seguinte:

1.  [Crie e execute o teste][anchor1]
2.  [Execute a solicitação de linha de base HTTPS que você criou anteriormente][anchor2]
    
##  1.  Crie e execute o teste  

Crie um teste por meio da interface web da conta Wallarm seguindo as [instruções][link-create-tr-gui].

Após seguir as instruções, definir os seguintes parâmetros básicos ao criar um teste:

* nome do teste: `DEMO TEST RUN`;
* política de teste: `DEMO POLICY`;
* nó FAST: `DEMO NODE`.

Estas instruções não contêm configurações avançadas.

Depois que o teste é salvo, seu ID será automaticamente passado para o nó FAST. Na aba "Testruns" você verá o teste criado com um indicador de ponto vermelho piscando. Este indicador significa que as solicitações de linha de base para o teste estão sendo gravadas.

Você pode clicar na coluna "Baseline req." para ver todas as solicitações de linha de base que estão sendo gravadas.

![Visualizando solicitações de linha de base gravadas][img-view-recording-cloud]

!!! info "A prontidão do nó para a gravação"
    Você deve esperar até ver a saída do console sinalizando que o nó FAST chamado `DEMO NODE` está pronto para gravar solicitações de linha de base para o teste chamado `DEMO TEST RUN`
    
    Se o nó estiver pronto para gravar a solicitação de linha de base, você verá uma mensagem semelhante na saída do console:
    
    `[info] Recording baselines for TestRun#N ‘DEMO TEST RUN’`
    
    O nó será capaz de gerar um conjunto de testes de segurança com base nas solicitações de linha de base somente após esta mensagem ser mostrada.	

É observável na saída do console que o nó FAST chamado `DEMO NODE` está pronto para gravar solicitações de linha de base para o teste chamado `DEMO TEST RUN`:

--8<-- "../include/fast/console-include/qsg/fast-node-ready-for-recording.md"
    
    
##  2.  Execute a solicitação de linha de base HTTPS que você criou anteriormente

Para isso, navegue até o link que você [criou][link-previous-chapter] utilizando o navegador Mozilla Firefox pré-configurado.

!!! info "Exemplo de um link"
    <https://google-gruyere.appspot.com/430232491618310677730226710602783767322/snippets.gtl?password=paSSw0rd&uid=123>

O resultado da execução da solicitação está mostrado abaixo:

![O resultado da execução da solicitação][img-request-exec-result]

É observável pela saída do console que o nó FAST registrou uma solicitação de linha de base:

--8<-- "../include/fast/console-include/qsg/fast-node-testing.md"

Você pode observar que algumas solicitações de linha de base estão sendo salvas na nuvem Wallarm:

![Solicitações de linha de base chegando][img-incoming-baselines]

Este documento sugere que apenas uma solicitação seja executada para fins de demonstração. Considerando que não há solicitações adicionais para o aplicativo de destino, interrompa o processo de gravação da linha de base selecionando a opção **Stop recording** no menu suspenso "Actions".

!!! info "Controlando o processo de execução do teste"
    O conjunto de testes de segurança foi gerado rapidamente para o teste que você criou. No entanto, o processo pode levar um tempo significativo, dependendo do número de solicitações de linha de base, da política de teste em uso e da capacidade de resposta do aplicativo de destino. Você poderia pausar ou parar o processo de teste selecionando uma opção adequada no menu suspenso "Actions".

O teste para automaticamente quando o processo de teste é concluído, desde que nenhuma gravação de linha de base esteja em andamento. Algumas informações breves sobre as vulnerabilidades detectadas serão exibidas na coluna "Resultado". O FAST deve encontrar algumas vulnerabilidades de XSS para a solicitação HTTPS executada:

![A vulnerabilidade descoberta][img-xss-found]
    
Agora, você deveria ter concluído todos os objetivos do capítulo, além do resultado do teste da solicitação HTTPS para o aplicativo Google Gruyere. O resultado mostra três vulnerabilidades XSS encontradas.
