# Integração do FAST com o Bamboo

A integração do FAST no MODO CI no fluxo de trabalho do Bamboo pode ser configurada usando um dos métodos abaixo:

* através da [especificação YAML](https://confluence.atlassian.com/bamboo/bamboo-yaml-specs-938844479.html)
* através da [especificação JAVA](https://confluence.atlassian.com/bamboo/bamboo-java-specs-941616821.html)
* através do [Bamboo UI](https://confluence.atlassian.com/bamboo/jobs-and-tasks-289277035.html)

O exemplo abaixo usa a especificação YAML para configurar a integração.

## Passando o Token do Nó FAST

Para usar com segurança o [token de nó FAST](../../operations/create-node.md), passe seu valor na [variável global Bamboo](https://confluence.atlassian.com/bamboo/defining-global-variables-289277112.html).

![Passando a variável global Bamboo](../../../images/fast/poc/common/examples/bamboo-cimode/bamboo-env-var-example.png)

--8<-- "../include/fast/fast-cimode-integration-examples/configured-workflow.md"

## Adicionando a Etapa de Gravação de Solicitação

Para implementar a gravação de solicitações, aplique as seguintes configurações ao job de teste de aplicação automatizado:

1. Adicione o comando que executa o contêiner Docker FAST no modo `CI_MODE=recording` com outras [variáveis](../ci-mode-recording.md#environment-variables-in-recording-mode) necessárias __antes__ do comando que executa os testes automatizados. Por exemplo:

    ```
    docker run --name fast -d -e WALLARM_API_TOKEN=${bamboo_WALLARM_API_TOKEN} -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=dvwa -p 8080:8080 --network my-network --rm wallarm/fast
    ```

2. Configure o proxy dos testes automatizados via nó FAST. Por exemplo:

    ```
    docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
    ```

!!! aviso "Rede Docker"
    Antes de gravar solicitações, certifique-se de que o nó FAST e a ferramenta para teste automatizado estão executando na mesma rede.

??? info "Exemplo da etapa de teste automatizado com o nó FAST em execução no modo de gravação"
    ```
    test:
    key: TST
    tasks:
        - script:
            interpreter: /bin/sh
            scripts:
            - docker network create my-network
            - docker run --rm --name dvwa -d --network my-network wallarm/fast-example-dvwa-base
            - docker run --name fast -d -e WALLARM_API_TOKEN=${bamboo_WALLARM_API_TOKEN} -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=dvwa -p 8080:8080 --network my-network --rm wallarm/fast
            - docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
            - docker run --rm --name tests --network my-network wallarm/fast-example-dvwa-tests
            - docker stop selenium fast
    ```

    Um exemplo inclui as seguintes etapas:

    1. Criar a rede Docker `my-network`.
    2. Executar o aplicativo de teste `dvwa` na rede `my-network`.
    3. Executar o nó FAST no modo de gravação na rede `my-network`.
    4. Executar a ferramenta de teste automatizada Selenium com o nó FAST como proxy na rede `my-network`.
    5. Executar os testes automatizados na rede `my-network`.
    6. Parar a ferramenta de teste automatizado Selenium e o nó FAST no modo de gravação.

## Adicionando a Etapa de Teste de Segurança

Para implementar o teste de segurança, adicione a correspondente etapa separada ao seu fluxo de trabalho seguindo as instruções:

1. Se o aplicativo de teste não estiver executando, adicione o comando para executar o aplicativo.
2. Adicione o comando que executa o contêiner Docker FAST no modo `CI_MODE=testing` com outras [variáveis](../ci-mode-testing.md#environment-variables-in-testing-mode) necessárias __após__ o comando que executa o aplicativo.

    !!! info "Usando o conjunto gravado de solicitações base"
        Se o conjunto de solicitações básicas foi gravado em outro pipeline, especifique o ID de gravação na variável [TEST_RECORD_ID](../ci-mode-testing.md#environment-variables-in-testing-mode). Caso contrário, o último conjunto gravado será utilizado.

    Exemplo de comando:

    ```
    docker run --name fast -e WALLARM_API_TOKEN=${bamboo_WALLARM_API_TOKEN} -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://dvwa:80 --network my-network --rm wallarm/fast
    ```

!!! aviso "Rede Docker"
    Antes de fazer o teste de segurança, certifique-se de que o nó FAST e o aplicativo de teste estão executando na mesma rede.

??? info "Exemplo da etapa de teste de segurança"
    Os comandos são executados na rede `my-network` criada na etapa de gravação de solicitação. O aplicativo de teste, `app-test`, também é executado na etapa de gravação de solicitação.

   1. Adicionar `security_testing` à lista de `stages`. No exemplo, esta etapa finaliza o fluxo de trabalho.

        ```
        stages:
        - testing:
            manual: false
            jobs:
                - test
        - security_testing:
            final: true
            jobs:
                - security_test
        ```

   2. Defina o corpo do novo job `security_test`.

        ```
        security_test:
        key: SCTST
        tasks:
            - script:
                interpreter: /bin/sh
                scripts:
                - docker run --name fast -e WALLARM_API_TOKEN=${bamboo_WALLARM_API_TOKEN} -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://dvwa:80 --network my-network --rm wallarm/fast 
                - docker stop dvwa
                - docker network rm my-network
        ```

    Um exemplo inclui as seguintes etapas:

    1. Execute o nó FAST no modo de teste na rede `my-network`. A variável `TEST_RECORD_ID` é omitida pois o conjunto de solicitações básicas foi criado no pipeline atual e é o último gravado. O nó FAST será parado automaticamente quando o teste for concluído.
    2. Pare a aplicação de teste `dvwa`.
    3. Delete a rede `my-network`.

## Obtendo o Resultado do Teste

O resultado do teste de segurança será exibido nos logs de build no Bamboo UI. Além disso, o Bamboo permite o download do arquivo completo `.log`.

![O resultado da execução do nó FAST no modo de teste](../../../images/fast/poc/common/examples/bamboo-cimode/bamboo-ci-example.png)

## Mais Exemplos

Você pode encontrar mais exemplos de integração do FAST no fluxo de trabalho do Bamboo em nosso [GitHub](https://github.com/wallarm/fast-examples).

!!! info "Perguntas subsequentes"
    Se você tiver dúvidas relacionadas à integração do FAST, por favor, [entre em contato conosco](mailto:support@wallarm.com).