[fast-jenkins-cimode]:          ./examples/jenkins-cimode.md
[fast-ci-mode-test]:            ../ci-mode-testing.md#environment-variables-in-recording-mode
[recording-mode]:               ci-mode-recording.md
[fast-node-token]:              ../operations/create-node.md
[circleci-set-env-var]:         https://circleci.com/docs/2.0/env-vars/#setting-an-environment-variable-in-a-project
[circleci-example-env-var]:     ../../images/fast/poc/common/examples/circleci-cimode/circleci-env-var-example.png
[circleci-fast-plugin]:         https://circleci.com/orbs/registry/orb/wallarm/fast
[circleci-using-orbs]:          https://circleci.com/docs/2.0/using-orbs/
[mail-to-us]:                   mailto:support@wallarm.com

# Integração dos Orbs Wallarm FAST com CircleCI

Esta instrução descreve o método para integrar o FAST com o fluxo de trabalho CircleCI através dos [Orbs Wallarm FAST (plugin)][circleci-fast-plugin]. A configuração de integração é realizada no arquivo de configuração `~/.circleci/config.yml`. Mais detalhes sobre os Orbs CircleCI estão disponíveis na [documentação oficial do CircleCI][circleci-using-orbs].

!!! warning "Requisitos"

    * CircleCI versão 2.1
    * Fluxo de trabalho CircleCI configurado com um conjunto já [gravado de solicitações base][recording-mode]

    Se você trabalha com outra versão do CircleCI ou precisa adicionar a etapa de gravação de solicitação, então confira o [exemplo de integração com o CircleCI via nó FAST][fast-jenkins-cimode].

## Passo 1: Passando o Token do Nó FAST

Passe o valor do [token do nó FAST][fast-node-token] na variável de ambiente `WALLARM_API_TOKEN` nas configurações do projeto CircleCI. O método de configuração de variáveis de ambiente é descrito na [documentação do CircleCI][circleci-set-env-var].

![Passando a variável de ambiente CircleCI][circleci-example-env-var]

## Passo 2: Conectando Orbs Wallarm FAST

Para conectar os Orbs Wallarm FAST, defina as seguintes configurações no arquivo `~/.circleci/config.yml`:

1. Certifique-se de que a versão 2.1 do CircleCI está especificada no arquivo:

    ```
    version: 2.1
    ```
2. Inicialize o plugin Wallarm FAST na seção `orbs`:

    ```
    orbs:
        fast: wallarm/fast@1.1.0
    ```

## Passo 3: Configurando a Etapa de Testes de Segurança

Para configurar os testes de segurança, adicione a etapa separada `fast/run_security_tests` ao seu fluxo de trabalho CircleCI e defina os parâmetros listados abaixo:

| Parâmetro | Descrição | Obrigatório |
| -------- | -------- | --------------- |
| test_record_id| ID do registro de teste. Corresponde ao [TEST_RECORD_ID](ci-mode-testing.md#environment-variables-in-testing-mode).<br>Valor padrão é o último registro de teste criado pelo nó FAST usado. | Sim |
| app_host | O endereço do aplicativo de teste. O valor pode ser um endereço IP ou um nome de domínio.<br>Valor padrão é IP interno. | Não |
| app_port | A porta do aplicativo de teste.<br>Valor padrão é 80. | Não |
| policy_id | [ID da política de teste](../operations/test-policy/overview.md).<br>Valor padrão é `[null]`-`Default Test Policy`. | Não |
| stop_on_first_fail | Indicador para parar o teste quando ocorrer um erro. | Não |
| test_run_name | O nome do teste executado.<br>Por padrão, o valor será gerado automaticamente a partir da data de criação do teste. | Não |
| test_run_desc | A descrição do teste executado. | Não |
| test_run_rps | Um limite no número de solicitações de teste (*RPS*, *requests per second*) para serem enviadas ao aplicativo alvo.<br>Valor mínimo: `1`.<br>Valor máximo: `1000`.<br>Valor padrão: `null` (RPS é ilimitado). | Não |
| wallarm_api_host | Endereço do servidor API Wallarm. <br>Valores permitidos: <br>`us1.api.wallarm.com` para o servidor na nuvem Wallarm US e <br>`api.wallarm.com` para o servidor na nuvem Wallarm EU<br>Valor padrão é `us1.api.wallarm.com`. | Não |
| wallarm_fast_port | A porta do nó FAST. <br>Valor padrão é 8080. | Não |
| wallarm_version | A versão dos Orbs Wallarm FAST utilizados.<br>A lista de versões está disponível clicando no [link][circleci-fast-plugin].<br>Valor padrão é o mais recente. | Não |

??? info "Exemplo de ~/.circleci/config.yml"
    ```
    version: 2.1
    jobs:
      build:
        machine:
          image: 'ubuntu-1604:201903-01'
        steps:
          - checkout
          - run:
              command: >
                docker run -d --name app-test -p 3000:3000
                wallarm/fast-example-rails
              name: Run application
          - fast/run_security_tests:
              app_port: '3000'
              test_record_id: '9058'
    orbs:
      fast: 'wallarm/fast@dev:1.1.0'
    ```

    Você pode encontrar mais exemplos de integração do FAST ao fluxo de trabalho CircleCI em nosso [GitHub](https://github.com/wallarm/fast-examples) e [CircleCI](https://circleci.com/gh/wallarm/fast-example-circleci-orb-rails-integration).

!!! info "Dúvidas futuras"
    Se você tiver perguntas relacionadas à integração do FAST, por favor [entre em contato conosco][mail-to-us].