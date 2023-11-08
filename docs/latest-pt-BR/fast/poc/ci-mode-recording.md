[doc-allowed-hosts]:                ../operations/env-variables.md#limiting-the-number-of-requests-to-be-recorded
[doc-get-token]:                    prerequisites.md#anchor-token
[doc-concurrent-pipelines]:         ci-mode-concurrent-pipelines.md
[doc-env-variables]:                ../operations/env-variables.md

[anchor-recording-variables]:       #environment-variables-in-recording-mode

[link-docker-compose]:              https://docs.docker.com/compose/
[link-docker-compose-install]:      https://docs.docker.com/compose/install/

# Executando um Nó FAST em Modo de Gravação

Neste modo, o nó FAST é executado antes de testar a aplicação alvo.

A origem das requisições é configurada para usar o nó FAST como um proxy e envia solicitações HTTP ou HTTPS para a aplicação alvo.

O nó FAST determina as solicitações de referência entre as proxy e as coloca em um registro de teste.

!!! info "Pré-requisitos do Capítulo"
    Para seguir as etapas descritas neste capítulo, você precisa obter um [token][doc-get-token].
    
    Os seguintes valores são usados como exemplos ao longo deste capítulo:

    * `token_Qwe12345` como um token.
    * `rec_0001` como um identificador de um registro de teste.

!!! info "Instale o `docker-compose`"
    A ferramenta [`docker-compose`][link-docker-compose] será usada em todo este capítulo para demonstrar como o nó FAST opera no modo de gravação.
    
    As instruções de instalação para esta ferramenta estão disponíveis [aqui][link-docker-compose-install].

## Variáveis de Ambiente no Modo de Gravação

A configuração do nó FAST é feita através de variáveis de ambiente. A tabela abaixo contém todas as variáveis de ambiente que podem ser usadas para configurar um nó FAST no modo de gravação.

| Variável de Ambiente   | Valor  | Obrigatório? |
|--------------------	| --------	| -----------	|
| `WALLARM_API_TOKEN`  	| Token para um nó. | Sim |
| `WALLARM_API_HOST`   	| O nome de domínio do servidor Wallarm API para usar. <br>Valores permitidos: <br>`us1.api.wallarm.com` para uso com a nuvem dos EUA; <br>`api.wallarm.com` para uso com a nuvem da UE.| Sim |
| `CI_MODE`            	| Modo de operação do nó FAST. <br>Valor necessário: `recording`. | Sim |
| `TEST_RECORD_NAME`   	| O nome de um novo registro de teste para criar. <br>O valor padrão está em um formato semelhante: “TestRecord Oct 08 12:18 UTC”. | Não |
| `INACTIVITY_TIMEOUT` 	| Se nenhuma solicitação de referência chegar ao nó FAST dentro do intervalo `INACTIVITY_TIMEOUT`, o processo de gravação é interrompido juntamente com o nó FAST. <br>Faixa de valor permitida: de 1 a 691200 segundos (1 semana) <br>Valor padrão: 600 segundos (10 minutos). | Não |
| `ALLOWED_HOSTS`       | O nó FAST gravará aquelas solicitações que direcionam qualquer host listado na variável de ambiente. <br>Valor padrão: string vazia (todas as solicitações recebidas serão gravadas). Veja [este][doc-allowed-hosts] documento para detalhes.| Não |
| `BUILD_ID`            | O identificador de um fluxo de trabalho CI/CD. Este identificador permite que vários nós FAST trabalhem simultaneamente usando o mesmo nó FAST na nuvem. Veja [este][doc-concurrent-pipelines] documento para detalhes.| Não |

!!! info "Veja também"
    As descrições das variáveis de ambiente que não são específicas para um determinado modo de operação do nó FAST estão disponíveis [aqui][doc-env-variables].

## Implantação de um Nó FAST em Modo de Gravação

Um arquivo de configuração `docker-compose.yaml` de exemplo será usado para demonstrar como o FAST opera no modo de gravação (note o valor da variável de ambiente `CI_MODE`):

```
version: '3'
  services:
    fast:                                        
      image: wallarm/fast
      environment:
        WALLARM_API_TOKEN: token_Qwe12345        # Especifique o valor do token aqui
        WALLARM_API_HOST: us1.api.wallarm.com    # O servidor da API da nuvem dos EUA está em uso aqui. Use api.wallarm.com para o servidor da API da nuvem da UE.
        CI_MODE: recording
      ports:
        - '8080:8080'                              
      networks:
        main:
          aliases:
            - fast

networks:
  main:
```

Para executar um contêiner Docker com o nó FAST, navegue até o diretório que contém o arquivo `docker-compose.yaml` e execute o comando `docker-compose up fast`.

Se o comando for executado com sucesso, uma saída de console semelhante à mostrada aqui será gerada:

```
  __      __    _ _
  \ \    / /_ _| | |__ _ _ _ _ __
   \ \/\/ / _` | | / _` | '_| '  \
    \_/\_/\__,_|_|_\__,_|_| |_|_|_|
             ___ _   ___ _____
            | __/_\ / __|_   _|
            | _/ _ \\__ \ | |
            |_/_/ \_\___/ |_|
 
 Carregando...
 [info] Nó conectado à nuvem Wallarm
 [info] Carregadas 0 extensões personalizadas para o scanner rápido
 [info] Carregadas 44 extensões padrão para o scanner rápido
 [info] TestRecord#rec_0001 TestRecord Oct 01 01:01 UTC começa a gravar

```

Esta saída nos informa que o nó FAST se conectou com sucesso à nuvem Wallarm e criou um registro de teste com o identificador `rec_0001` e o nome `TestRecord Oct 01 01:01 UTC.` Está pronto para receber solicitações e gravar as solicitações de referência.

!!! info "Uma Nota Sobre os Nomes de Registro de Teste"
    Para alterar o nome do registro de teste padrão, você precisa passar o valor necessário através da variável de ambiente `TEST_RECORD_NAME` ao iniciar o contêiner Docker do nó FAST.

!!! warning "Execução do Teste"
    É agora a hora de conduzir testes existentes para a aplicação alvo. FAST irá gravar as solicitações de referência e preencher o registro de teste com elas.

## Parando e Removendo o Contêiner Docker com o Nó FAST em Modo de Gravação

Quando todas as solicitações de referência necessárias são gravadas, o nó FAST será desligado por uma ferramenta CI/CD e retornará um código de saída.

Se o nó FAST não encontrar erros e o processo de gravação da referência terminar com sucesso, então o código de saída `0` é retornado.

Se o nó FAST encontrar alguns erros ou o processo de gravação da referência for interrompido devido ao tempo esgotado (veja a descrição da variável de ambiente [`INACTIVITY_TIMEOUT`][anchor-recording-variables]), então o nó FAST para automaticamente e o código de saída `1` é retornado.

Quando o nó FAST terminar o seu trabalho, o contêiner Docker correspondente precisará ser parado e removido.

Se o nó FAST não for interrompido automaticamente com o código de saída `1` e todas as solicitações de referência necessárias forem gravadas, então você pode parar o contêiner Docker do nó FAST executando o comando `docker-compose stop <nome do contêiner>` :

```
docker-compose stop fast
```

Para remover o contêiner do nó FAST, execute o comando `docker-compose rm <nome do contêiner>` :

```
docker-compose rm fast
```

Nos exemplos acima, `fast` é usado como o nome do contêiner Docker para parar ou remover.

Alternativamente, você pode usar o comando `docker-compose down`, que para e remove contêineres para todos os serviços descritos no arquivo `docker-compose.yaml`.