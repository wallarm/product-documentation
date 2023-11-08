[anchor-node]:                      #implantação-do-contêiner-docker-com-o-node-fast
[anchor-testrun]:                   #obtenção-de-um-teste-executado
[anchor-testrun-creation]:          #criação-de-uma-execução-de-teste
[anchor-testrun-copying]:           #copiando-um-teste-executado

[doc-limit-requests]:               ../operations/env-variables.md#limitando-o-número-de-requisições-a-serem-registradas
[doc-get-token]:                    prerequisites.md#anchor-token
[doc-testpolicy]:                   ../operations/internals.md#política-de-teste-rápido
[doc-inactivity-timeout]:           ../operations/internals.md#test-run
[doc-allowed-hosts-example]:        ../qsg/deployment.md#3-prepare-um-arquivo-contendo-as-variáveis-de-ambiente-necessárias
[doc-testpolicy-creation-example]:  ../qsg/test-preparation.md#2-criar-uma-política-de-teste-direcionada-para-vulnerabilidades-XSS
[doc-docker-run-fast]:              ../qsg/deployment.md#4-implante-o-contêiner-docker-do-node-fast
[doc-state-description]:            ../operations/check-testrun-status.md
[doc-testing-scenarios]:            ../operations/internals.md#test-run
[doc-testrecord]:                   ../operations/internals.md#registro-de-teste
[doc-create-testrun]:               ../operations/create-testrun.md
[doc-copy-testrun]:                 ../operations/copy-testrun.md
[doc-waiting-for-tests]:            waiting-for-tests.md

[link-wl-portal-new-policy]:        https://us1.my.wallarm.com/testing/policies/new#geral

[link-docker-envfile]:              https://docs.docker.com/engine/reference/commandline/run/#definir-variáveis-de-ambiente--e---env---env-file
[link-docker-run]:                  https://docs.docker.com/engine/reference/commandline/run/
[link-docker-rm]:                   https://docs.docker.com/engine/reference/run/#limpeza---rm

[doc-integration-overview]:         integration-overview.md
[doc-integration-overview-api]:     integration-overview-api.md


#   Executando o Node FAST via a API Wallarm

!!! info "Pré-requisitos do Capítulo"
    Para seguir os passos descritos neste capítulo, você precisará obter um [token][doc-get-token].
    
    Os seguintes valores são utilizados como exemplos ao longo deste capítulo:
    
    * `token_Qwe12345` como um token.
    * `tr_1234` como um identificador de uma execução de teste.
    * `rec_0001` como um identificador de um registro de teste.

A execução e configuração do Node FAST compreende as seguintes etapas:
1.  [Implantação do Contêiner Docker com o Node FAST.][anchor-node]
2.  [Obtenção de uma Execução de Teste.][anchor-testrun]

##  Implantação do Contêiner Docker com o Node FAST

!!! warning "Conceder Acesso aos Servidores API Wallarm"
    É crucial para o funcionamento adequado do Node FAST ter acesso aos servidores API Wallarm `us1.api.wallarm.com` ou `api.wallarm.com` via protocolo HTTPS (`TCP/443`).
    
    Certifique-se que o seu firewall não restringe o host Docker de acessar os servidores API Wallarm.

Alguma configuração é necessária antes de executar o contêiner Docker com o Node FAST. Para configurar o node, coloque o token dentro do contêiner usando a variável de ambiente `WALLARM_API_TOKEN`. Adicionalmente, você poderia usar a variável `ALLOWED_HOSTS` se você precisar [limitar o número de solicitações a serem registradas][doc-limit-requests].

Para passar as variáveis de ambiente para o contêiner, coloque as variáveis em um arquivo de texto e especifique o caminho para o arquivo usando o parâmetro [`--env-file`][link-docker-envfile] do comando [`docker run`][link-docker-run] (veja as [instruções][doc-docker-run-fast] no guia "Início Rápido").

Execute um contêiner com o Node FAST executando o seguinte comando:

```
docker run \ 
--rm \
--name <name> \
--env-file=<environment variables file> \
-p <target port>:8080 \
wallarm/fast 
```

Este guia assume que o contêiner é executado apenas uma vez para o job CI/CD fornecido e é removido quando o job termina. Portanto, o parâmetro [`--rm`][link-docker-rm] foi adicionado ao comando listado acima.

Por favor, consulte o guia "Início Rápido" para uma [descrição detalhada][doc-docker-run-fast] dos parâmetros do comando.

??? info "Exemplo"
    Este exemplo pressupõe que o Node FAST usa o token `token_Qwe12345` e está configurado para registrar todas as solicitações de base que tenham `example.local` como uma substring do valor do cabeçalho `Host`.  

    O conteúdo de um arquivo com variáveis de ambiente é mostrado no seguinte exemplo:

    | fast.cfg |
    | -------- |
    | `WALLARM_API_TOKEN=token_Qwe12345`<br>`ALLOWED_HOSTS=example.local` |

    O comando abaixo executa o contêiner Docker chamado `fast-poc-demo` com o seguinte comportamento:
    
    * O contêiner é removido após a conclusão do seu trabalho.
    * As variáveis de ambiente são passadas para o contêiner usando o arquivo `fast.cfg`. 
    * A porta `8080` do contêiner é publicada para a porta `9090` do host Docker.

    ```
    docker run --rm --name fast-poc-demo --env-file=fast.cfg -p 9090:8080  wallarm/fast
    ```

Se a implantação do Node FAST for bem-sucedida, o console do contêiner e o arquivo de log conterão as seguintes mensagens informativas:

```
[info] Nó conectado à Wallarm Cloud
[info] Aguardando TestRun para verificar…
```

Agora o Node FAST está ouvindo no endereço IP do host Docker, e na porta que você especificou anteriormente com o parâmetro `-p` do comando `docker run`.

##  Obtenção de uma Execução de Teste

Você precisa ou [criar][anchor-testrun-creation] uma execução de teste ou [copiar][anchor-testrun-copying] uma. A escolha depende do [cenário de criação de teste][doc-testing-scenarios] que é adequado para você.

### Adquirindo um Identificador de Política de Teste

Se você planeja empregar sua própria [política de teste][doc-testpolicy], então [crie uma][link-wl-portal-new-policy] e obtenha o identificador da política. Depois, passe o identificador para o parâmetro `policy_id` ao fazer uma chamada de API para criar ou copiar a execução de teste. 

Caso contrário, se você optar por usar a política de teste padrão, o parâmetro `policy_id` deve ser omitido da chamada API.

!!! info "Exemplo de Política de Teste"
    O guia "Início Rápido" contém [instruções passo-a-passo][doc-testpolicy-creation-example] sobre como criar uma política de teste de amostra.

### Criando uma Execução de Teste

Quando uma execução de teste é criada, um novo [registro de teste][doc-testrecord] também é criado.

Este método de criação de execução de teste deve ser usado se for necessário testar uma aplicação alvo juntamente com o registro de solicitações de base.

!!! info "Como Criar uma Execução de Teste"
    Este processo é descrito em detalhes [aqui][doc-create-testrun].

O Node FAST precisa de um certo tempo para passar após a criação da execução do teste, a fim de registrar solicitações.

Certifique-se de que o Node FAST esteja pronto para registrar solicitações antes de enviar qualquer solicitação à aplicação alvo usando a ferramenta de teste.

Para fazer isso, verifique periodicamente o status da execução do teste enviando a solicitação GET para a URL `https://us1.api.wallarm.com/v1/test_run/test_run_id`:

--8<-- "../include-pt-BR/fast/poc/api-check-testrun-status-recording.md"

Se a solicitação ao servidor API for bem-sucedida, você receberá a resposta do servidor. Esta resposta fornece informações úteis, incluindo o estado do processo de registro (o valor do parâmetro `ready_for_recording`).

Se o valor do parâmetro for `true`, então o Node FAST está pronto para registro e você pode lançar sua ferramenta de teste para começar a enviar solicitações para a aplicação alvo.

Caso contrário, emita a mesma chamada API repetidamente até que o nó esteja pronto.


### Copiando uma Execução de Teste

Quando uma execução de teste está sendo copiada, um [registro de teste][doc-testrecord] existente é reutilizado.

Este método de criação de execução de teste deve ser usado se for necessário testar uma aplicação alvo usando solicitações de base já registradas.

!!! info "Como Copiar uma Execução de Teste"
    Este processo é descrito em detalhes [aqui][doc-copy-testrun].

Desde que a execução de teste tenha sido criada com sucesso, o Node FAST começa a testar imediatamente. Não há necessidade de realizar nenhuma ação adicional.

## Próximos passos

O processo de teste pode levar muito tempo para ser concluído. Use as informações deste [documento][doc-waiting-for-tests] para determinar se o teste de segurança com FAST foi concluído.

Você pode referir-se aos documentos [“Implantação via API”][doc-integration-overview-api] ou [“Fluxo de trabalho CI/CD com FAST”][doc-integration-overview], se necessário.