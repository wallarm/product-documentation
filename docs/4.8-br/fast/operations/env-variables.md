[doc-dsl-ext]:              ../dsl/intro.md
[doc-record-mode]:          ../poc/ci-mode-recording.md
[doc-test-mode]:            ../poc/ci-mode-testing.md

[anchor-allowed-hosts]:     #limiting-the-number-of-requests-to-be-recorded

# Lista de Variáveis de Ambiente Utilizadas por um Nó FAST

Vários parâmetros são usados para configurar o nó FAST. Os valores desses parâmetros podem ser alterados através das respectivas variáveis de ambiente.

Você pode definir os valores das variáveis de ambiente e passar essas variáveis para o nó FAST, seja
* através do argumento `-e`
    
    ```
    docker run --name <nome do container> \
    -e <variável de ambiente 1>=<valor> \
    ... 
    -e <variável de ambiente N>=<valor> \
    -p <porta de destino>:8080 wallarm/fast
    ```
    
* ou através do argumento `--env-file` que especifica o caminho para um arquivo contendo as variáveis de ambiente

    ```
    docker run --name <nome do container> \
    --env-file=<arquivo com as variáveis de ambiente> \
    -p <porta de destino>:8080 wallarm/fast
    ```
    
    Esse arquivo deve conter a lista de variáveis de ambiente, uma variável por linha:

    ```
    # O arquivo de exemplo com as variáveis de ambiente

    WALLARM_API_TOKEN=token_Qwe12345            # Este é o valor de exemplo - use um valor real de token
    ALLOWED_HOSTS=google-gruyere.appspot.com    # As solicitações que chegam destinadas a este domínio serão gravadas em um registro de teste
    ```

Todos os parâmetros configuráveis estão listados na tabela abaixo:

| Parâmetro             | Valor     | Obrigatório? |
|--------------------	| --------	| -----------	|
| `WALLARM_API_TOKEN`  	| Um token do Wallarm cloud. | Sim |
| `WALLARM_API_HOST`   	| Endereço do servidor API Wallarm. <br>Valores permitidos: <br>`us1.api.wallarm.com` para o servidor na Wallarm US cloud e <br>`api.wallarm.com` para o servidor na Wallarm EU cloud. | Sim |
| `ALLOWED_HOSTS`       | Uma lista dos hosts do aplicativo de destino. As solicitações recebidas que são direcionadas a estes hosts serão gravadas em um registro de teste.<br>Todas as solicitações recebidas são gravadas por padrão.<br>Veja mais detalhes [aqui][anchor-allowed-hosts].| Não |
| `WALLARM_API_USE_SSL` | Define se deve ou não usar SSL ao se conectar a um dos servidores API da Wallarm.<br>Valores permitidos: `true` e `false`.<br>Valor padrão: `true`. | Não |
| `WORKERS`             | O número de threads que processam solicitações de linha de base e realizam testes de segurança.<br>Valor padrão: `10`. | Não |
| `GIT_EXTENSIONS`      | O link para um repositório Git contendo [extensões FAST DSL personalizadas][doc-dsl-ext] (este repositório deve ser acessível pelo contêiner do nó FAST) | Não |
| `CI_MODE`             | O modo de operação do nó FAST ao integrar-se ao CI/CD. <br>Os valores permitidos são: <br>`recording` para o [modo de gravação][doc-record-mode] e <br>`testing` para o [modo de teste][doc-test-mode]. | Não |
| `BACKEND_HTTPS_PORTS` | O(s) número(s) de porta HTTPS em uso pelo aplicativo de destino se porta(s) não padrão estiver(em) configurada(s) para o aplicativo.<br>Várias portas podem ser listadas no valor deste parâmetro, por exemplo: <br>`BACKEND_HTTPS_PORTS='443;3000;8091'`<br>Valor padrão: `443` | Não |
| `WALLARM_API_CA_VERIFY` | Define se o certificado CA do servidor API da Wallarm deve ser validado.<br>Valores permitidos: `true` e `false`.<br>Valor padrão: `false`. | Não |
| `CA_CERT`             | O caminho para um certificado CA a ser usado pelo nó FAST.<br>Valor padrão: `/etc/nginx/ssl/nginx.crt`. | Não |
| `CA_KEY`              | O caminho para uma chave privada CA a ser usada pelo nó FAST. <br>Valor padrão: `/etc/nginx/ssl/nginx.key`. | Não |


## Limitando o Número de Solicitações a serem Gravadas

Por padrão, o nó FAST trata todas as solicitações recebidas como solicitações de base. Portanto, ele grava e cria e executa testes de segurança com base nessas solicitações. No entanto, é possível que solicitações estranhas, que não devem ser reconhecidas como solicitações de base, passem pelo nó FAST para o aplicativo de destino.

Você pode limitar o número de solicitações a serem gravadas pelo nó FAST, filtrando todas as solicitações que não são direcionadas ao aplicativo (note que o nó FAST faz proxy das solicitações filtradas, mas não as grava). Essa limitação reduz a carga aplicada ao nó FAST e ao aplicativo de destino, além de acelerar o processo de teste. Para aplicar essa limitação, você precisa saber quais hosts a fonte da solicitação interage durante o teste.

Você pode filtrar todas as solicitações não básicas, configurando a variável de ambiente `ALLOWED_HOSTS`.

--8<--  "../include/fast/operations/env-vars-allowed-hosts.md"

O nó FAST usa essa variável de ambiente da seguinte maneira:
* Se o valor do cabeçalho `Host` da solicitação recebida corresponder ao valor especificado na variável `ALLOWED_HOSTS`, então o nó FAST considerará a solicitação como uma solicitação de base. A solicitação é gravada e direcionada para fazer proxy.
* Todas as outras solicitações passam pelo proxy do nó FAST, mas não são gravadas.

!!! info "Exemplo de Uso da Variável de Ambiente ALLOWED_HOSTS"
    Se a variável for definida como `ALLOWED_HOSTS=google-gruyere.appspot.com`, então as solicitações direcionadas ao domínio `google-gruyere.appspot.com` serão consideradas solicitações de base.