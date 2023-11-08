Para implementar o registro de solicitações, aplique as seguintes configurações à etapa de teste automatizado da aplicação:

1. Adicione o comando para executar o contêiner FAST Docker no modo `CI_MODE=recording` com outras [variáveis](../ci-mode-recording.md#environment-variables-in-recording-mode) necessárias __antes__ do comando que executa os testes automatizados. Por exemplo:

    ```
    docker run --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=app-test -p 8080:8080 --network my-network --rm wallarm/fast
    ```
2. Configure o proxy dos testes automatizados via nó FAST. Por exemplo:

    ```
    docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
    ```

!!! Aviso "Rede Docker"
    Antes de registrar solicitações, certifique-se de que o nó FAST e a ferramenta para testes automatizados estejam rodando na mesma rede.