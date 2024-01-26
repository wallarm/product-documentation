[jenkins-config-pipeline]:      https://jenkins.io/doc/book/pipeline
[fast-node-token]:              ../../operations/create-node.md
[jenkins-parameterized-build]:  https://wiki.jenkins.io/display/JENKINS/Parameterized+Build
[jenkins-example-env-var]:     ../../../images/fast/poc/common/examples/jenkins-cimode/jenkins-add-token-example.png
[fast-example-jenkins-result]:  ../../../images/fast/poc/common/examples/jenkins-cimode/jenkins-result-example.png
[fast-ci-mode-record]:          ../ci-mode-recording.md#environment-variables-in-recording-mode
[fast-ci-mode-test]:            ../ci-mode-testing.md#environment-variables-in-testing-mode
[mail-to-us]:                   mailto:support@wallarm.com
[fast-examples-github]:         https://github.com/wallarm/fast-examples 

# Integração do FAST com Jenkins

A integração do FAST no MODO CI no fluxo de trabalho do Jenkins é configurada através do arquivo `Jenkinsfile`. Mais detalhes sobre a configuração do fluxo de trabalho do Jenkins estão disponíveis na [documentação oficial do Jenkins][jenkins-config-pipeline].

## Passando o Token do Nó FAST

Para usar com segurança o [token do nó FAST][fast-node-token], passe o valor dele na [variável de ambiente em suas configurações do projeto][jenkins-parameterized-build].

![Passagem da variável de ambiente do Jenkins][jenkins-example-env-var]

--8<-- "../include-pt-BR/fast/fast-cimode-integration-examples/configured-workflow.md"

## Adicionando a Etapa de Gravação de Solicitações

--8<-- "../include-pt-BR/fast/fast-cimode-integration-examples/request-recording-setup.md"

??? info "Exemplo da etapa de teste automatizado com o nó FAST em execução no modo de gravação"
    ```
    stage('Executar autotests com nó FAST gravando') {
          steps {
             sh label: 'criar rede', script: 'docker network create my-network'
             sh label: 'rodar fast com gravação', script: 'docker run --rm  --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -p 8088:8080 --network my-network wallarm/fast'
             sh label: 'rodar selenium', script: 'docker run --rm -d --name selenium -p 4444:4444 --network my-network -e http_proxy=\'http://fast:8080\' -e https_proxy=\'https://fast:8080\' selenium/standalone-firefox:latest'
             sh label: 'rodar aplicação', script: 'docker run --rm --name app-test --network my-network -e CAPYBARA_SERVER_HOST=app-test -p 3000:3000 app-test bundle exec rspec spec/features/posts_spec.rb'
             sh label: 'parar selenium', script: 'docker stop selenium'
             sh label: 'parar fast', script: 'docker stop fast'
             sh label: 'remover rede', script: 'docker network rm my-network'
          }
       }
    ```

    Um exemplo inclui as seguintes etapas:

    1. Criar a rede Docker `my-network`.
    2. Executar o nó FAST no modo de gravação na rede `my-network`.
    3. Executar a ferramenta para testes automatizados Selenium, com o nó FAST como proxy na rede `my-network`.
    4. Executar a aplicação de teste e os testes automatizados.
    5. Parar Selenium e nó FAST.
    6. Excluir a rede `my-network`.

## Adicionando a Etapa de Teste de Segurança

--8<-- "../include-pt-BR/fast/fast-cimode-integration-examples/security-testing-setup.md"

??? info "Exemplo da etapa de teste de segurança"

    ```
    stage('Executar testes de segurança') {
          steps {
             sh label: 'create network', script: 'docker network create my-network'
             sh label: 'iniciar aplicação', script: ' docker run --rm -d --name app-test --network my-network -e CAPYBARA_SERVER_HOST=app-test -p 3000:3000 app-test'
             sh label: 'rodar fast in mode de testes', script: 'docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE="testing" -e WALLARM_API_HOST="us1.api.wallarm.com"  --network my-network -e TEST_RUN_URI="http://app-test:3000" --rm wallarm/fast'
             sh label: 'parar aplicação', script: ' docker stop app-test '
            sh label: 'remover rede', script: ' docker network rm my-network '
          }
       }
    ```

    Um exemplo inclui as seguintes etapas:

    1. Criar a rede Docker `my-network`.
    2. Iniciar a aplicação de teste na rede `my-network`.
    3. Executar o nó FAST no modo de teste na rede `my-network`. A variável `TEST_RECORD_ID` é omitida, pois o conjunto de solicitações básicas foi criado no pipeline atual e é o último gravado. O nó FAST será parado automaticamente quando o teste terminar.
    4. Parar a aplicação de teste.
    5. Excluir a rede `my-network`.

## Obtendo o Resultado do Teste

O resultado do teste de segurança será exibido na interface do Jenkins.

![O resultado da execução do nó FAST no modo de teste][fast-example-jenkins-result]

## Mais Exemplos

Você pode encontrar exemplos de integração do FAST ao fluxo de trabalho do Jenkins em nosso [GitHub][fast-examples-github].

!!! info "Dúvidas futuras"
    Se você tem dúvidas relacionadas à integração do FAST, por favor, [contacte-nos][mail-to-us].