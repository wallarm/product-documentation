[doc-testpolicy]:                   ../operations/internals.md#fast-test-policy
[doc-testpolicy-creation-example]:  ../qsg/test-preparation.md#2-create-a-test-policy-targeted-at-xss-vulnerabilities
[doc-waiting-for-tests]:            waiting-for-tests.md
[doc-get-token]:                    prerequisites.md#anchor-token
[doc-concurrent-pipelines]:         ci-mode-concurrent-pipelines.md
[doc-env-variables]:                ../operations/env-variables.md

[link-wl-portal-new-policy]:        https://us1.my.wallarm.com/testing/policies/new#general
[link-docker-compose]:              https://docs.docker.com/compose/
[link-docker-compose-install]:      https://docs.docker.com/compose/install/

[anchor-testing-mode]:              #deployment-of-a-fast-node-in-the-testing-mode
[anchor-testing-variables]:         #environment-variables-in-testing-mode
[anchor-stopping-fast-node]:        ci-mode-recording.md#stopping-and-removing-the-docker-container-with-the-fast-node-in-recording-mode
[anchor-testing-mode]:              #deployment-of-a-fast-node-in-the-testing-mode

#  Executando um Nó FAST no Modo de Teste

Enquanto estiver no modo de teste, o nó FAST cria uma execução de teste com base no registro de teste que foi preenchido com solicitações de linha de base no modo de gravação e executa o conjunto de testes de segurança para o aplicativo alvo.

!!! info "Pré-requisitos do Capítulo"
    Para seguir as etapas descritas neste capítulo, você precisa obter um [token][doc-get-token].
    
    Os seguintes valores são usados como exemplos ao longo deste capítulo:
        
    * `tr_1234` como um identificador de uma execução de teste
    * `rec_0001` como um identificador de um registro de teste
    * `bl_7777` como um identificador de uma solicitação de linha de base

!!! info "Instalar `docker-compose`"
    A ferramenta [`docker-compose`][link-docker-compose] será utilizada ao longo deste capítulo para demonstrar como o nó FAST opera no modo de teste.
    
    As instruções de instalação para esta ferramenta estão disponíveis [aqui][link-docker-compose-install].

## Variáveis de Ambiente no Modo de Teste

A configuração do nó FAST é feita através de variáveis de ambiente. A tabela abaixo contém todas as variáveis de ambiente que podem ser usadas para configurar um nó FAST no modo de teste.

| Variável de Ambiente   | Valor  | Obrigatório? |
|--------------------	| --------	| -----------	|
| `WALLARM_API_TOKEN`  	| O token para um nó. | Sim |
| `WALLARM_API_HOST`   	| O nome de domínio do servidor Wallarm API a ser usado. <br>Valores permitidos: <br>`us1.api.wallarm.com` para uso com a nuvem dos EUA;<br>`api.wallarm.com` para uso com a nuvem da UE.| Sim |
| `CI_MODE`            	| O modo de operação do nó FAST. <br>Valor necessário: `testing`. | Sim |
| `WORKERS` | O número de threads concorrentes que trabalham com várias solicitações de linha de base de maneira paralela.<br>Valor padrão: `10`.| Não |
| `TEST_RECORD_ID` | O identificador de um registro de teste.<br>Padrão: valor vazio. | Não |
| `TEST_RUN_NAME` | O nome da execução de teste.<br>O valor padrão está em um formato semelhante: “TestRun Sep 24 12:31 UTC”. | Não |
| `TEST_RUN_DESC` | A descrição da execução de teste.<br>O valor padrão: string vazia. | Não |
| `TEST_RUN_POLICY_ID` | O identificador da política de teste.<br>Se o parâmetro estiver ausente, então a política padrão entra em ação. | Não |
| `TEST_RUN_RPS` | O parâmetro especifica um limite no número de solicitações de teste (*RPS*, *requests per second*) a serem enviadas para o aplicativo alvo durante a execução da execução de teste.<br>Intervalo de valor permitido: de 1 a 1000 (solicitações por segundo)<br>Valor padrão: ilimitado. | Não |
| `TEST_RUN_STOP_ON_FIRST_FAIL` | Este parâmetro especifica o comportamento do FAST quando uma vulnerabilidade é detectada:<br>`true`: interrompe a execução da execução de teste na primeira vulnerabilidade detectada.<br>`false`: processa todas as solicitações de linha de base, independentemente de qualquer vulnerabilidade ser detectada.<br>Valor padrão: `false`. | Não |
| `TEST_RUN_URI` | Um URI do aplicativo alvo.<br>O endereço IP do aplicativo alvo pode mudar durante o processo CI/CD, então você pode usar o URI do aplicativo. <br>Por exemplo, o URI do aplicativo implantado via `docker-compose` pode parecer `http://app-test:3000`.  | Não |
| `BUILD_ID` | O identificador de um fluxo de trabalho CI/CD. Este identificador permite que vários nós FAST trabalhem simultaneamente usando o mesmo nó FAST na nuvem. Veja [este][doc-concurrent-pipelines] documento para detalhes.| Não |
| `FILE_EXTENSIONS_TO_EXCLUDE` | A lista de extensões de arquivos estáticos que devem ser excluídos do processo de avaliação durante o teste.<br>Você pode enumerar essas extensões usando o caractere <code>&#124;</code>: <br><code>FILE_EXTENSIONS_TO_EXCLUDE='jpg&#124;ico&#124;png'</code> | Não |
| `PROCESSES`            | O número de processos que podem ser usados pelo nó FAST. Cada processo usa o número de threads especificado na variável `WORKERS`.<br>Número padrão de processos: `1`.<br>Valor especial: `auto` igual à metade do número de CPU calculado usando o comando [nproc](https://www.gnu.org/software/coreutils/manual/html_node/nproc-invocation.html#nproc-invocation). | Não |

!!! info "Ver também"
    As descrições das variáveis de ambiente que não são específicas para um certo modo de operação do nó FAST estão disponíveis [aqui][doc-env-variables].

## Adquirindo um Identificador de Política de Teste

Se você planeja usar sua própria [política de teste][doc-testpolicy], então [crie uma][link-wl-portal-new-policy] na nuvem Wallarm. Depois, passe o identificador para o contêiner Docker do nó FAST através da variável de ambiente `TEST_RUN_POLICY_ID` ao executar o nó FAST no modo de teste. 

Caso contrário, se você optar por usar a política de teste padrão, não defina a variável de ambiente `TEST_RUN_POLICY_ID` para o contêiner.

!!! info "Como Criar uma Política de Teste"
    O guia "Início Rápido" contém [instruções passo a passo][doc-testpolicy-creation-example] sobre como criar uma política de teste de amostra.

## Obtendo um identificador de registro de teste
 
Para usar um registro de teste específico no modo de teste, você pode passar o identificador do registro de teste para o nó FAST usando o parâmetro [`TEST_RECORD_ID`][anchor-testing-variables]. Assim, não há necessidade de executar o nó FAST no modo de gravação primeiro. Em vez disso, você pode usar um registro de teste pré-formado para realizar os mesmos testes de segurança várias vezes em diferentes nós e execuções de teste.
 
Você pode obter o identificador do registro de teste na interface do portal Wallarm ou no log do nó FAST no modo de teste. Se você não usar o parâmetro `TEST_RECORD_ID`, então o nó FAST usará o último registro de teste do nó.

## Implantação de um Nó FAST no Modo de Teste

O arquivo `docker-compose.yaml` que foi criado anteriormente é adequado para executar um nó FAST no modo de teste.
Para isso, é necessário alterar o valor da variável de ambiente `CI_MODE` para `testing`.

Você pode alterar o valor da variável modificando-o no arquivo `docker-compose.yaml` ou passando a variável de ambiente com o valor necessário para o contêiner Docker através da opção `-e` do comando `docker-compose run`:

```
docker-compose run --rm -e CI_MODE=testing fast
```

!!! info "Obtendo o relatório sobre o teste"
    Para obter o relatório com os resultados do teste, monte o diretório para baixar o relatório através da opção `-v {DIRETÓRIO_PARA_RELATÓRIOS}:/opt/reports/` ao implantar o contêiner Docker do nó FAST.

    Quando o teste de segurança estiver concluído, você encontrará o breve relatório `<TEST RUN NAME>.<UNIX TIME>.txt` e o relatório detalhado `<TEST RUN NAME>.<UNIX TIME>.json` no diretório `{DIRETÓRIO_PARA_RELATÓRIOS}`.

!!! info "Opções do comando `docker-compose`"
    Você pode passar qualquer uma das variáveis de ambiente descritas acima para um contêiner Docker de nó FAST através da opção `-e`.

    A opção `--rm` também é usada no exemplo acima, para que o contêiner do nó FAST seja descartado automaticamente quando o nó for interrompido.

Se o comando for executado com sucesso, será gerado uma saída de console semelhante à mostrada aqui:

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
INFO synccloud[13]: Nova instância registrada 16dd487f-3d40-4834-xxxx-8ff17842d60b
INFO [1]: Carregadas 0 extensões personalizadas para o scanner rápido
INFO [1]: Carregadas 44 extensões padrão para o scanner rápido
INFO [1]: Usando TestRecord#rec_0001 para criar TestRun
INFO [1]: TestRun#tr_1234 criado
```

Esta saída nos informa que o registro de teste com o identificador `rec_0001` foi usado para criar uma execução de teste com o identificador `tr_1234`, e essa operação foi concluída com sucesso.

Em seguida, os testes de segurança são criados e executados pelo nó FAST para cada solicitação de linha de base no registro de teste que satisfaz a política de teste. A saída do console conterá mensagens semelhantes a estas:

```
INFO [1]: Executando um conjunto de testes para a linha de base #bl_7777
INFO [1]: O conjunto de testes para a linha de base #bl_7777 está sendo executado
INFO [1]: Recuperando a solicitação de linha de base Hit#["hits_production_202_20xx10_v_1", "AW2xxxxxW26"]
INFO [1]: Usando a Política de Teste com o nome 'Política Padrão'
```

Esta saída nos informa que o conjunto de testes está sendo executado para as solicitações de linha de base com o identificador `bl_7777`. Além disso, ele nos diz que a política de teste padrão está sendo usada devido à falta da variável de ambiente `TEST_RUN_POLICY_ID`.

## Parando e Removendo o Contêiner Docker com o Nó FAST no Modo de Teste

Dependendo dos resultados dos testes obtidos, os nós FAST podem terminar de maneiras diferentes.

Se algumas vulnerabilidades forem detectadas no aplicativo alvo, então o nó FAST mostra uma mensagem semelhante a esta:

```
INFO [1]: Encontradas 4 vulnerabilidades, marcando o conjunto de testes para a linha de base #bl_7777 como falho
ERROR [1]: TestRun#tr_1234 falhou
```

Neste caso, foram encontradas quatro vulnerabilidades. Um conjunto de testes para a linha de base com o identificador `bl_7777` é considerado falho. A execução de teste correspondente com o identificador `tr_1234` também é marcada como falha.

Se nenhuma vulnerabilidade for detectada no aplicativo alvo, o nó FAST mostra uma mensagem semelhante a esta:

```
INFO [1]: Nenhum problema encontrado. O conjunto de testes para a linha de base #bl_7777 foi aprovado.
INFO [1]: TestRun#tr_1234 passou
```

Neste caso, a execução de teste com o identificador `tr_1234` é considerada aprovada.

!!! warning "Sobre conjuntos de testes de segurança"
    Note que os exemplos acima não implicam que apenas um conjunto de testes foi executado. Um conjunto de testes é formado para cada solicitação de linha de base que está de acordo com a política de teste FAST.
    
    Uma única mensagem relacionada ao conjunto de testes é mostrada aqui para fins de demonstração.

Após o nó FAST concluir o processo de teste, ele termina e retorna um código de saída para o processo que é executado como parte de um trabalho CI/CD. 
* Se o status do teste de segurança for “aprovado” e o nó FAST não encontrar erros durante o processo de teste, então o código de saída `0` é retornado. 
* Caso contrário, se os testes de segurança falharem ou o nó FAST encontrar alguns erros durante o processo de teste, então o código de saída `1` é retornado.

O contêiner do nó FAST no modo de teste parará automaticamente após a conclusão do teste de segurança. No entanto, uma ferramenta CI/CD ainda pode estar no controle do ciclo de vida do nó e de seu contêiner pelos meios [descritos anteriormente][anchor-stopping-fast-node].

No [exemplo acima][anchor-testing-mode] o contêiner do nó FAST foi executado com a opção `--rm`. Isso significa que o contêiner parado é automaticamente removido.