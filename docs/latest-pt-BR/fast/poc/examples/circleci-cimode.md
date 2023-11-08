[circleci-config-yaml]:         https://circleci.com/docs/2.0/writing-yaml/#section=configuration
[fast-node-token]:              ../../operations/create-node.md
[circleci-set-env-var]:         https://circleci.com/docs/2.0/env-vars/#setting-an-environment-variable-in-a-project
[circleci-example-env-var]:     ../../../images/fast/poc/common/examples/circleci-cimode/circleci-env-var-example.png
[fast-example-result]:          ../../../images/fast/poc/common/examples/circleci-cimode/circleci-example.png
[fast-ci-mode-record]:          ../ci-mode-recording.md#environment-variables-in-recording-mode
[fast-ci-mode-test]:            ../ci-mode-testing.md#environment-variables-in-testing-mode
[mail-to-us]:                   mailto:support@wallarm.com
[fast-examples-github]:         https://github.com/wallarm/fast-examples 
[fast-example-circleci]:        https://circleci.com/gh/wallarm/fast-example-circleci-dvwa-integration

# Integração de FAST com CircleCI

A integração do FAST no MODO CI no fluxo de trabalho do CircleCI é configurada por meio do arquivo `~/.circleci/config.yml`. Mais detalhes sobre a configuração do fluxo de trabalho do CircleCI estão disponíveis na [documentação oficial do CircleCI][circleci-config-yaml].

## Passando Token do Node FAST

Para usar com segurança o [token do nó FAST][fast-node-token], passe seu valor na [variável de ambiente nas configurações do seu projeto][circleci-set-env-var].

![Passando variável de ambiente CircleCI][circleci-example-env-var]

--8<-- "../include-pt-BR/fast/fast-cimode-integration-examples/configured-workflow.md"

## Adicionando o Passo de Gravação de Solicitações

--8<-- "../include-pt-BR/fast/fast-cimode-integration-examples/request-recording-setup.md"

??? info "Exemplo do passo de teste automatizado com a execução do nó FAST no modo de gravação"
    ```
    - run:
          name: Iniciar testes e gravação FAST
          command: |
            docker network create my-network \
            && docker run --rm  --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 --network my-network wallarm/fast \
            && docker run --rm -d --name selenium -p 4444:4444 -e http_proxy='http://fast:8080' -e https_proxy='https://fast:8080' --network my-network selenium/standalone-firefox:latest \
            && docker run --rm --name app-test --network my-network -e CAPYBARA_SERVER_HOST=app-test -p 3000:3000 test-application bundle exec rspec spec/features/posts_spec.rb \
            && docker stop selenium fast 
    ```

    Um exemplo inclui as seguintes etapas:

    1. Criar a rede Docker `my-network`.
    2. Executar o nó FAST no modo de gravação na rede `my-network`.
    3. Executar a ferramenta de teste automatizado Selenium com o nó FAST como um proxy na rede `my-network`.
    4. Executar o aplicativo de teste e testes automatizados na rede `my-network`.
    5. Parar a ferramenta de teste automatizado Selenium e o nó FAST no modo de gravação.

## Adicionando o Passo de Teste de Segurança

--8<-- "../include-pt-BR/fast/fast-cimode-integration-examples/security-testing-setup.md"

??? info "Exemplo do passo de teste de segurança"
    ```
    - run:
        name: Iniciar testes FAST
        command: |
          docker run --rm -d --name app-test --network my-network -e CAPYBARA_SERVER_HOST=app-test -p 3000:3000 test-application \
          && docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 --network my-network -e TEST_RUN_URI="http://app-test:3000" --rm wallarm/fast \
          && docker stop app-test
    ```

    Um exemplo inclui as seguintes etapas:

    1. Executar o aplicativo de teste na rede `my-network`.
    2. Executar o nó FAST no modo de teste na rede `my-network`. A variável `TEST_RECORD_ID` é omitida, pois o conjunto de solicitações-base foi criado no pipeline atual e é o último gravado. O nó FAST será parado automaticamente quando o teste for concluído.
    3. Parar o aplicativo de teste.

## Obtendo o Resultado do Teste

O resultado do teste de segurança será exibido na interface CircleCI.

![O resultado da execução do nó FAST no modo de teste][fast-example-result]

## Mais Exemplos

Você pode encontrar exemplos de integração de FAST ao fluxo de trabalho CircleCI em nosso [GitHub][fast-examples-github] e [CircleCI][fast-example-circleci].

!!! info "Dúvidas adicionais"
    Se você tem perguntas relacionadas à integração FAST, por favor [entre em contato][mail-to-us].