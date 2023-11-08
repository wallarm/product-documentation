Para implementar o teste de segurança, adicione a etapa separada correspondente ao seu fluxo de trabalho seguindo estas instruções:

1. Se o aplicativo de teste não estiver em execução, adicione o comando para executar o aplicativo.
2. Adicione o comando que executa o contêiner FAST Docker no modo `CI_MODE=testing` com outras [variáveis](../ci-mode-testing.md#environment-variables-in-testing-mode) necessárias __após__ o comando de execução do aplicativo.

    !!! info "Usando o conjunto gravado de solicitações de linha de base"
        Se o conjunto de solicitações de linha de base foi gravado em outro pipeline, especifique o ID do registro na variável [TEST_RECORD_ID][fast-ci-mode-test]. Caso contrário, o último conjunto gravado será usado.

    Exemplo do comando:

    ```
    docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://app-test:3000 --network my-network --rm wallarm/fast
    ```

!!! warning "Rede Docker"
    Antes do teste de segurança, certifique-se de que o nó FAST e o aplicativo de teste estão sendo executados na mesma rede.