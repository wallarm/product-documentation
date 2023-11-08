# Configurando a Autenticação de Testes

Se as solicitações ao seu aplicativo precisam ser autenticadas, os testes de segurança também exigem autenticação. Esta instrução fornece o método de passar credenciais para autenticar com sucesso as execuções de teste.

## Método de Configuração da Autenticação de Execução de Teste

Para passar as credenciais para a autenticação da execução do teste, execute as seguintes etapas antes de [implantar](../qsg/deployment.md#4-deploy-the-fast-node-docker-container) o contêiner FAST node Docker:

1. Crie o arquivo local com a extensão `.yml` ou `.yaml`. Por exemplo: `auth_dsl.yaml`.
2. Defina os parâmetros de autenticação no arquivo criado usando a sintaxe [FAST DSL](../dsl/intro.md) da seguinte maneira:
    1. Adicione a seção [`modify`](../dsl/phase-modify.md) ao arquivo.
    2. Na seção `modify`, especifique a parte da solicitação onde os parâmetros de autenticação são passados. A parte da solicitação deve ser especificada no formato [ponto](../dsl/points/basics.md).

        !!! info "Exemplo de um ponto para o parâmetro token"
            Se um token é usado para autenticação de solicitação e seu valor é passado no parâmetro `token` no cabeçalho de solicitação `Cookie`, o ponto pode se parece com `HEADER_COOKIE_COOKIE_token_value`.
    
    3. Especifique os valores dos parâmetros de autenticação da seguinte forma:
        
        ```
        modify:
            - HEADER_COOKIE_COOKIE_token_value:  "fl49qam93mfu0uhgh00gilssj2"
        ```

        O número de parâmetros de autenticação utilizados não é limitado.
3. Monte o diretório com o arquivo `.yml`/`.yaml` no contêiner FAST node Docker usando a opção `-v {path_to_folder}:/opt/dsl_auths` ao implantar o contêiner. Por exemplo:
    ```
    docker run --name fast-proxy -e WALLARM_API_TOKEN='dfjyt8C79DxZptWwQS3/0RHiuJLNFrqTdgCIzPPZq' -v /home/username/dsl_auth:/opt/dsl_auths -p 8080:8080 wallarm/fast
    ```

    !!! warning "Arquivos no diretório montado"
        Por favor, observe que o diretório montado deve conter apenas o arquivo com as credenciais de autenticação.

## Exemplos de Arquivos .yml/.yaml com Parâmetros de Autenticação Definidos

Um conjunto de parâmetros definidos no arquivo `.yml`/`.yaml` depende do método de autenticação usado em seu aplicativo.

A seguir, são apresentados exemplos de definição dos métodos de autenticação mais comuns das solicitações da API:

* Os parâmetros `username` e `password` são passados no cabeçalho de solicitação `Cookie`

    ```
    modify:
        - HEADER_Cookie_COOKIE_username_value: "test_account"
        - HEADER_Cookie_COOKIE_password_value: "Qww3okei"
    ```

* O parâmetro `token` é passado no cabeçalho de solicitação `Cookie`

    ```
    modify:
        - HEADER_COOKIE_COOKIE_token_value: "fl49qam93mfu0uhgh00gilssj2"
    ```