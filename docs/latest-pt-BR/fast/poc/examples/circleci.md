[img-demo-app]:                 ../../../images/fast/poc/common/examples/demo-app.png
[img-testing-flow]:             ../../../images/fast/poc/en/examples/testing-flow.png
[img-testing-flow-fast]:        ../../../images/fast/poc/en/examples/testing-flow-fast.png
[img-services-relations]:       ../../../images/fast/poc/common/examples/api-services-relations.png
[img-test-traffic-flow]:        ../../../images/fast/poc/en/examples/test-traffic-flow.png

[img-cci-pass-token]:           ../../../images/fast/poc/common/examples/circleci/pass-token.png
[img-cci-pass-results]:         ../../../images/fast/poc/common/examples/circleci/pass-results.png
[img-cci-workflow]:             ../../../images/fast/poc/en/examples/circleci/api-workflow.png

[img-cci-demo-pass-token]:      ../../../images/fast/poc/common/examples/circleci/demo-pass-token.png
[img-cci-demo-rspec-tests]:     ../../../images/fast/poc/common/examples/circleci/api-demo-rspec-tests.png
[img-cci-demo-testrun]:         ../../../images/fast/poc/common/examples/circleci/demo-testrun.png
[img-cci-demo-tests-failed]:    ../../../images/fast/poc/common/examples/circleci/demo-tests-failed.png
[img-cci-demo-vuln-details]:    ../../../images/fast/poc/common/examples/circleci/demo-vuln-details.png

[doc-env-variables]:            ../../operations/env-variables.md
[doc-testrun-steps]:            ../../operations/internals.md#test-run-execution-flow-baseline-requests-recording-takes-place
[doc-testrun-creation]:         ../node-deployment.md#creating-a-test-run
[doc-get-token]:                ../../operations/create-node.md
[doc-stopping-recording]:       ../stopping-recording.md
[doc-waiting-for-tests]:        ../waiting-for-tests.md
[doc-node-ready-for-recording]: ../node-deployment.md#creating-a-test-run

[link-api-recoding-mode]:       ../integration-overview-api.md#deployment-via-the-api-when-baseline-requests-recording-takes-place

[link-example-project]:         https://github.com/wallarm/fast-example-api-circleci-rails-integration
[link-rspec]:                   https://rspec.info/
[link-capybara]:                https://github.com/teamcapybara/capybara
[link-selenium]:                https://www.seleniumhq.org/
[link-docker-compose-build]:    https://docs.docker.com/compose/reference/build/
[link-circleci]:                https://circleci.com/

[link-wl-portal]:               https://us1.my.wallarm.com
[link-wl-portal-testrun-tab]:   https://us1.my.wallarm.com/testing/?status=running

[anchor-project-description]:           #como-funciona-a-aplicacao-de-amostra
[anchor-cci-integration-description]:   #como-o-fast-integra-com-rspec-and-circleci
[anchor-cci-integration-demo]:          #demonstracao-da-integracao-fast

#   Exemplo de Integração do FAST no CI/CD

!!! info "Convenções do capítulo"
    O seguinte valor de token é usado como um valor de exemplo ao longo do capítulo: `token_Qwe12345`.

Um projeto de amostra [fast-example-api-circleci-rails-integration][link-example-project] está disponível no GitHub da Wallarm. Seu propósito é demonstrar como realizar a integração FAST em processos existentes de CI/CD. Este exemplo segue o cenário [“Implantação via API quando a gravação de solicitações básicas ocorre”][link-api-recoding-mode].

Este documento contém as seguintes informações:
1.  [Uma explicação de como funciona a aplicação de amostra.][anchor-project-description]
2.  [Uma descrição detalhada passo a passo de uma integração FAST.][anchor-cci-integration-description]
3.  [Uma demonstração da integração FAST em ação.][anchor-cci-integration-demo]

##  Como Funciona a Aplicação de Amostra

A aplicação de amostra é um aplicativo da web que permite que você publique posts em um blog e a habilidade de gerenciar os posts do blog.

![A aplicação de amostra][img-demo-app]

A aplicação está escrita em Ruby on Rails e fornecida como um contêiner Docker.

Além disso, testes de integração [RSpec][link-rspec] foram criados para a aplicação. O RSpec emprega [Capybara][link-capybara] para interagir com o aplicativo da web e Capybara usa [Selenium][link-selenium] para enviar requisições HTTP para a aplicação:

![Fluxo de teste][img-testing-flow]

O RSpec executa alguns testes de integração para testar os seguintes cenários:
* Navegando para a página com posts
* Criando um novo post
* Atualizando um post existente
* Deletando um post existente

Capybara e Selenium ajudam a converter esses testes em um conjunto de requisições HTTP ao aplicativo.

!!! info "Localização dos Testes"
    Os testes de integração mencionados são descritos no arquivo `spec/features/posts_spec.rb`.

##  Como o FAST Integra com RSpec e CircleCI

Aqui você encontrará uma visão geral da integração FAST com RSpec e CircleCI para o projeto de amostra.

O RSpec suporta hooks pré-teste e pós-teste:

```
config.before :context, type: :feature do
    # Ações a serem tomadas antes da execução dos testes RSpec
  end
    # Execução dos testes RSpec
  config.after :context, type: :feature do
    # Ações a serem tomadas após a execução dos testes RSpec
  end
```

Isso significa essencialmente que é possível aumentar as etapas que o RSpec leva para testar o aplicativo com as etapas envolvendo testes de segurança FAST.

Podemos apontar um servidor Selenium para um servidor proxy com a variável de ambiente `HTTP_PROXY`. Assim, as solicitações HTTP para o aplicativo serão direcionadas via proxy. O uso do mecanismo de proxy permite passar as solicitações emitidas pelos testes de integração através do nó FAST com intervenção mínima no fluxo de teste existente:

![Fluxo de teste com FAST][img-testing-flow-fast]

Uma tarefa CircleCI é construída com todos esses fatos em mente. A tarefa compreende as seguintes etapas (consulte o arquivo `.circleci/config.yml`):

1.  Preparativos Necessários:
    
     É necessário [obter um token][doc-get-token] e passar seu valor para o projeto CircleCI através da variável de ambiente `TOKEN`.
Após uma nova tarefa CI estar no lugar, o valor da variável é passado para o contêiner Docker, onde a tarefa é executada.
    
     ![Passar o token para o CircleCI][img-cci-pass-token]
    
2.   Construir serviços
    
     Nesse estágio, alguns contêineres Docker devem ser construídos para um conjunto de serviços. Os contêineres são colocados em uma rede Docker compartilhada. Assim, eles podem se comunicar entre si usando os endereços IP e os nomes dos contêineres.
    
     Os seguintes serviços são construídos (consulte o arquivo `docker-compose.yaml`):
    
    * `app-test`: um serviço para o aplicativo de destino e a ferramenta de teste.
        
        Uma imagem Docker para o serviço compreende os seguintes componentes:
        
        * O aplicativo de destino (é alcançável via HTTP em `app-test:3000` após a implantação).
        
        * A ferramenta de teste RSpec combinada com Capybara; A ferramenta contém todas as funções necessárias para executar os testes de segurança FAST.
        
        * Capybara: configurado para enviar solicitações HTTP para o aplicativo de destino `app-test:3000` com o uso do servidor Selenium `selenium:4444` (consulte o arquivo `spec/support/capybara_settings.rb`).
        
        O token é passado para o contêiner de serviço pela variável de ambiente `WALLARM_API_TOKEN=$TOKEN`. O token é usado pelas funções, que são descritas nas seções `config.before` e `config.after` (consulte o arquivo `spec/support/fast-helper.rb`), para realizar manipulações com uma execução de teste.
    
    * `fast`: um serviço para o nó FAST.
        
        O nó é alcançável via HTTP em `fast:8080` após a implantação.
        
        O token é passado para o contêiner de serviço pela variável de ambiente `WALLARM_API_TOKEN=$TOKEN`. O token é necessário para a operação adequada do FAST.
        
        !!! info "Nota sobre solicitações iniciais"
            O exemplo fornecido não emprega a variável de ambiente `ALLOWED_HOSTS` [environment variable][doc-env-variables]. Portanto, o nó FAST reconhece todas as solicitações recebidas como solicitações iniciais.
    
    * `selenium`: um serviço para o servidor Selenium. Capybara do contêiner `app-test` usa o servidor para sua operação.
        
        A variável de ambiente `HTTP_PROXY=http://fast:8080` é passada para o contêiner de serviço para permitir a realização de solicitações proxy através do nó FAST.
        
        O serviço é alcançável via HTTP em `selenium:4444` após a implantação.
        
     Todos os serviços formam as seguintes relações entre eles:
    
    ![Relações entre serviços][img-services-relations]
    
3.   Devido às relações mencionadas, os serviços devem ser implantados em uma ordem estrita como a seguir:
     1.   `fast`.
     2.   `selenium`.
     3.   `app-test`.
    
     Os serviços `fast` e `selenium` são implantados de maneira sequencial emitindo o comando `docker-compose up -d fast selenium`.
    
4.   Após a implantação bem-sucedida do servidor Selenium e do nó FAST, é hora de implantar o serviço `app-test` e executar os testes RSpec.
    
     Para fazer isso, o seguinte comando é emitido:
    
     `docker-compose run --name app-test --service-ports app-test bundle exec rspec spec/features/posts_spec.rb`.
    
     Flows de teste e tráfego HTTP são mostrados na imagem:
    
     ![Fluxos de teste e tráfego HTTP][img-test-traffic-flow]
    
     De acordo com o [cenário][link-api-recoding-mode], os testes RSpec incluem todas as etapas que são necessárias para executar os testes de segurança FAST (consulte o arquivo `spec/support/fast_hooks.rb`):
    
     1.   Uma execução de teste [é criada][doc-testrun-creation] antes da execução dos testes RSpec.
        
          Depois, a chamada API [é emitida][doc-node-ready-for-recording] para verificar se o nó FAST está pronto para gravar as solicitações iniciais. O processo de execução dos testes existentes não é iniciado até que o nó esteja pronto.
        
          !!! info "Política de teste em uso"
              Este exemplo usa a política de teste padrão.
        
     2.   Os testes RSpec são executados.
     3.   As seguintes ações são realizadas após a conclusão dos testes RSpec:
         1.   O processo de gravação de solicitações iniciais [é interrompido][doc-stopping-recording]; 
         2.   O estado da execução do teste [é monitorado periodicamente][doc-waiting-for-tests]:
             * Se os testes de segurança FAST forem concluídos com sucesso (o estado da execução do teste é `state: passed`), então um código de saída `0` é retornado para o RSpec.
             * Se os testes de segurança FAST forem concluídos sem sucesso (algumas vulnerabilidades foram detectadas e o estado da execução do teste é `state: failed`), então um código de saída `1` é retornado para o RSpec.
    
5.   O resultado do teste é obtido:
    
    O código de saída do processo RSpec é passado para o processo `docker-compose run` e depois para o CircleCI.     
    
    ![O resultado da tarefa no CircleCI][img-cci-pass-results]

A tarefa CircleCI descrita segue de perto as etapas listadas [anteriormente][link-api-recoding-mode]:

![Tarefa CircleCI em detalhes][img-cci-workflow]

##  Demonstração da Integração FAST

1.   [Crie um nó FAST][doc-get-token] na nuvem Wallarm e copie o token fornecido.
2.   Copie os [arquivos do projeto de amostra][link-example-project] para seu próprio repositório no GitHub.
3.   Adicione seu repositório GitHub ao [CircleCI][link-circleci] (pressione o botão “Follow Project” no CircleCI) para que a tarefa CI seja iniciada toda vez que você alterar o conteúdo do repositório. Um repositório é chamado de “projeto” na terminologia do CircleCI.
4.   Adicione uma variável de ambiente `TOKEN` ao seu projeto CircleCI. Você pode fazer isso nas configurações do projeto. Passe o token FAST como valor desta variável:
    
    ![Passar o token para o projeto][img-cci-demo-pass-token]
    
5.   Faça um push de algo para o repositório para iniciar a tarefa CI. Certifique-se de que os testes de integração RSpec foram finalizados com sucesso (consulte a saída do console da tarefa):
    
    ![Testes RSpec passaram][img-cci-demo-rspec-tests]
    
6.   Certifique-se de que a execução do teste está em andamento.
    
     Você pode fazer login no [portal Wallarm][link-wl-portal] usando suas informações de conta Wallarm e navegar até a [aba "Testruns"][link-wl-portal-testrun-tab] para observar o processo de teste do aplicativo contra vulnerabilidades em tempo real:
    
     ![Execução do teste][img-cci-demo-testrun]
    
7.   Você pode ver o status da tarefa CI reportado como “Failed” após o processo de teste terminar:
    
     ![A conclusão da tarefa CI][img-cci-demo-tests-failed]
    
     Dado que existe o aplicativo de demonstração Wallarm em teste, a tarefa CI falhou representa as vulnerabilidades que o FAST detectou no aplicativo (a mensagem “FAST tests have failed” deve aparecer nos arquivos de log de compilação). A falha não é invocada por quaisquer problemas técnicos relacionados à compilação nesse caso.
    
     !!! info "Mensagem de erro"
         A mensagem de erro "FAST tests have failed" é produzida pelo método `wait_test_run_finish` que está localizado no arquivo `spec/support/fast_helper.rb`, que é antes da terminação com o código de saída `1`.

8.   Não há informações sobre vulnerabilidades detectadas exibidas no console CircleCI durante o processo de teste. 

     Você pode explorar as vulnerabilidades em detalhes no portal Wallarm. Para fazer isso, navegue até o link da execução do teste. O link é exibido como parte da mensagem informativa FAST no console CircleCI.
    
     Este link deve ser assim:
     `https://us1.my.wallarm.com/testing/testruns/test_run_id`    
    
     Por exemplo, você pode dar uma olhada na execução do teste concluída para descobrir que algumas vulnerabilidades XSS foram encontradas na aplicação de amostra:
    
      ![Informação detalhada sobre a vulnerabilidade][img-cci-demo-vuln-details]
    
Para concluir, foi demonstrado que FAST tem fortes capacidades de integração em processos existentes de CI/CD, bem como a descoberta de vulnerabilidades na aplicação, mesmo quando os testes de integração são passados sem erros.