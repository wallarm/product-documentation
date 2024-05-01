# Integração do FAST com Azure DevOps

A integração do FAST em MODO CI no pipeline do Azure DevOps é configurada através do arquivo `azure-pipelines.yml`. O esquema detalhado do arquivo `azure-pipelines.yml` está descrito na [documentação oficial do Azure DevOps](https://docs.microsoft.com/en-us/azure/devops/pipelines/yaml-schema?view=azure-devops&tabs=schema%2Cparameter-schema).

!!! info "Fluxo de trabalho configurado"
    As instruções seguintes requerem um fluxo de trabalho já configurado que corresponde a um dos seguintes pontos:

    * A automação de testes está implementada. Neste caso, o token de nó FAST deve ser [passado](#passando-o-token-do-nó-fast) e as etapas de [gravação de solicitação](#adicionando-a-etapa-de-gravação-de-solicitação) e [teste de segurança](#adicionando-a-etapa-de-teste-de-segurança) devem ser adicionadas.
    * O conjunto de solicitações base já está gravado. Neste caso, o token de nó FAST deve ser [passado](#passando-o-token-do-nó-fast) e a etapa de [teste de segurança](#adicionando-a-etapa-de-teste-de-segurança) deve ser adicionada.

## Passando o Token do Nó FAST

Para usar de forma segura o [token do nó FAST](../../operations/create-node.md), abra as configurações do seu pipeline atual e passe o valor do token na [variável de ambiente do Azure DevOps](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/variables?view=azure-devops&tabs=yaml%2Cbatch#environment-variables).

![Passando a variável de ambiente do Azure DevOps](../../../images/fast/poc/common/examples/azure-devops-cimode/azure-env-var-example.png)

## Adicionando a Etapa de Gravação de Solicitação

--8<-- "../include-pt-BR/fast/fast-cimode-integration-examples/request-recording-setup.md"

??? info "Exemplo da etapa de teste automatizado com execução do nó FAST no modo de gravação"
    ```
    - job: tests
      steps:
      - script: docker network create my-network
        displayName: 'Criar my-network'
      - script: docker run --rm --name dvwa -d --network my-network wallarm/fast-example-dvwa-base
        displayName: 'Executar aplicação de teste na my-network'
      - script: docker run --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=dvwa -p 8080:8080 --network my-network --rm wallarm/fast
        displayName: 'Executar o nó FAST em modo de gravação na my-network'
      - script: docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
        displayName: 'Executar o Selenium com nó FAST como proxy na my-network'
      - script: docker run --rm --name tests --network my-network wallarm/fast-example-dvwa-tests
        displayName: 'Executar testes automatizados na my-network'
      - script: docker stop selenium fast
        displayName: 'Parar o Selenium e o nó FAST no modo de gravação'
    ```

## Adicionando a Etapa de Teste de Segurança

O método de configuração do teste de segurança depende do método de autenticação utilizado na aplicação de teste:

* Se a autenticação for necessária, adicione a etapa de teste de segurança ao mesmo trabalho que a etapa de gravação de solicitação.
* Se a autenticação não for necessária, adicione a etapa de teste de segurança como um trabalho separado ao seu pipeline.

Para implementar o teste de segurança, siga as instruções:

1. Certifique-se de que a aplicação de teste está em execução. Se necessário, adicione o comando para executar a aplicação.
2. Adicione o comando de execução do contêiner Docker FAST no modo `CI_MODE=testing` com outras [variáveis](../ci-mode-testing.md#environment-variables-in-testing-mode) necessárias __após__ o comando de execução da aplicação.

    !!! info "Usando o conjunto gravado de solicitações base"
        Se o conjunto de solicitações base foi gravado em outro pipeline, especifique o ID de gravação na variável [TEST_RECORD_ID](../ci-mode-testing.md#environment-variables-in-testing-mode). Caso contrário, o último conjunto gravado será utilizado.

    Exemplo do comando:

    ```
    docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://app-test:3000 --network my-network --rm wallarm/fast
    ```

!!! warning "Docker Network"
    Antes do teste de segurança, certifique-se de que o nó FAST e a aplicação de teste estão sendo executados na mesma rede.

??? info "Exemplo da etapa de teste automatizado com execução do nó FAST no modo de teste"
    Como o exemplo abaixo testa a aplicação DVWA que requer autenticação, a etapa de teste de segurança é adicionada ao mesmo trabalho que a etapa de gravação de solicitação.

    ```
    stages:
    - stage: testing
      jobs:
      - job: tests
        steps:
        - script: docker network create my-network
          displayName: 'Criar my-network'
        - script: docker run --rm --name dvwa -d --network my-network wallarm/fast-example-dvwa-base
          displayName: 'Executar aplicação de teste na my-network'
        - script: docker run --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=dvwa -p 8080:8080 --network my-network --rm wallarm/fast
          displayName: 'Executar o nó FAST em modo de gravação na my-network'
        - script: docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
          displayName: 'Executar o Selenium com nó FAST como proxy na my-network'
        - script: docker run --rm --name tests --network my-network wallarm/fast-example-dvwa-tests
          displayName: 'Executar testes automatizados na my-network'
        - script: docker stop selenium fast
          displayName: 'Parar o Selenium e o nó FAST no modo de gravação'
        - script: docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://dvwa:80 --network my-network --rm wallarm/fast 
          displayName: 'Executar o nó FAST no modo de teste na my-network'
        - script: docker stop dvwa
          displayName: 'Parar aplicação de teste'
        - script: docker network rm my-network
          displayName: 'Deletar my-network'
    ```

## Obtendo o Resultado do Teste

O resultado do teste de segurança será exibido na interface do Azure DevOps.

![Resultado da execução do nó FAST no modo de teste](../../../images/fast/poc/common/examples/azure-devops-cimode/azure-ci-example.png)

## Mais Exemplos

Você pode encontrar exemplos de integração do FAST ao fluxo de trabalho do Azure DevOps em nosso [GitHub](https://github.com/wallarm/fast-examples).

!!! info "Dúvidas adicionais"
    Se você tiver dúvidas relacionadas à integração do FAST, por favor [entre em contato conosco](mailto:support@wallarm.com).