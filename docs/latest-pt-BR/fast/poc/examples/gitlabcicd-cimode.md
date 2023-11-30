[gitlabcicd-config-yaml]:       https://docs.gitlab.com/ee/ci
[fast-node-token]:              ../../operations/create-node.md
[gitlabci-set-env-var]:         https://docs.gitlab.com/ee/ci/variables/
[gitlabci-example-env-var]:     ../../../images/fast/poc/common/examples/gitlabci-cimode/gitlab-ci-env-var-example.png
[fast-example-gitlab-result]:   ../../../images/fast/poc/common/examples/gitlabci-cimode/gitlab-ci-example.png
[fast-ci-mode-record]:          ../ci-mode-recording.md#environment-variables-in-recording-mode
[fast-ci-mode-test]:            ../ci-mode-testing.md#environment-variables-in-testing-mode
[mail-to-us]:                   mailto:support@wallarm.com
[fast-examples-github]:         https://github.com/wallarm/fast-examples 
[fast-example-gitlab-cicd]:     https://gitlab.com/wallarm/fast-example-gitlab-dvwa-integration

# Integração do FAST com GitLab CI/CD

A integração do FAST no modo CI com o fluxo de trabalho do GitLab CI/CD é configurada através do arquivo `~/.gitlab-ci.yml`. Mais detalhes sobre a configuração do fluxo de trabalho do GitLab CI/CD estão disponíveis na [documentação oficial do GitLab][gitlabcicd-config-yaml].

## Passando o Token do Nó FAST

Para usar com segurança o [token do nó FAST][fast-node-token], passe seu valor na [variável de ambiente em suas configurações de projeto][gitlabci-set-env-var].

![Passando variável de ambiente do GitLab CI/CD][gitlabci-example-env-var]

--8<-- "../include-pt-BR/fast/fast-cimode-integration-examples/configured-workflow.md"

## Adicionando o Passo de Gravação de Solicitação

--8<-- "../include-pt-BR/fast/fast-cimode-integration-examples/request-recording-setup.md"

??? info "Exemplo do passo de teste automatizado com a execução do nó FAST no modo de gravação"
    ```
    test:
      stage: test
      script:
        - docker network create my-network 
        - docker run --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 --network my-network --rm wallarm/fast 
        - docker run --rm -d --name selenium -p 4444:4444 -e http_proxy='http://fast:8080' -e https_proxy='https://fast:8080' --network my-network selenium/standalone-firefox:latest 
        - docker run --rm --name app-test --network my-network -e CAPYBARA_SERVER_HOST=app-test -p 3000:3000 app-test bundle exec rspec spec/features/posts_spec.rb 
        - docker stop selenium fast
        - docker network rm my-network
    ```

    Um exemplo inclui os seguintes passos:

    1. Criar a rede Docker `my-network`.
    2. Executar o nó FAST no modo de gravação na rede `my-network`.
    3. Executar a ferramenta de teste automatizado Selenium com o nó FAST como proxy na rede `my-network`.
    4. Executar a aplicação de teste e os testes automatizados na rede `my-network`.
    5. Parar Selenium e nó FAST.

## Adicionando o Passo de Teste de Segurança

--8<-- "../include-pt-BR/fast/fast-cimode-integration-examples/security-testing-setup.md"

??? info "Exemplo do passo de teste de segurança"
    1. Adicione `security_test` à lista de `stages`.

        ```
          stages:
            - build
            - test
            - security_test
            - cleanup
        ```
    2. Defina o corpo do novo estágio `security_test`.

        ```
          security_test:
            stage: security_test
            script:
              - docker network create my-network 
              - docker run --rm -d --name app-test --network my-network -e CAPYBARA_SERVER_HOST=app-test -p 3000:3000 app-test
              - sleep 5 
              - docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 --network my-network -e TEST_RUN_URI="http://app-test:3000" --rm wallarm/fast 
              - docker stop app-test
        ```

    Um exemplo inclui os seguintes passos:

    1. Criar a rede Docker `my-network`.
    2. Executar a aplicação de teste na rede `my-network`.
    3. Executar o nó FAST no modo de teste na rede `my-network`. A variável `TEST_RECORD_ID` é omitida, pois o conjunto de solicitações base foi criado no pipeline atual e é o último gravado. O nó FAST será parado automaticamente quando o teste for concluído.
    4. Parar a aplicação de teste.

## Obtendo o Resultado do Teste

O resultado do teste de segurança será exibido na interface do GitLab CI/CD.

![O resultado de executar o nó FAST no modo de teste][fast-example-gitlab-result]

## Mais Exemplos

Você pode encontrar exemplos de integração do FAST ao fluxo de trabalho do GitLab CI/CD em nosso [GitHub][fast-examples-github] e [GitLab][fast-example-gitlab-cicd].

!!! info "Perguntas adicionais"
    Se você tem perguntas relacionadas à integração do FAST, por favor [entre em contato conosco][mail-to-us].

## Vídeos de demonstração

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/NRQT_7ZMeko" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>