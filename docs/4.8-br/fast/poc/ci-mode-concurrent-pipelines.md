[doc-ci-recording]:             ci-mode-recording.md
[doc-ci-recording-example]:     ci-mode-recording.md#deployment-of-a-fast-node-in-recording-mode
[doc-ci-testing]:               ci-mode-testing.md
[doc-ci-testing-example]:       ci-mode-testing.md#deployment-of-a-fast-node-in-the-testing-mode

#   Usando FAST em Fluxos de Trabalho CI/CD Simultâneos

!!! info "Dados necessários"
    Os seguintes valores são usados como exemplos neste documento:

    * `token_Qwe12345` como um token.
    * `rec_1111` e `rec_2222` como identificadores de registros de teste.

Vários nós FAST podem ser implantados simultaneamente em fluxos de trabalho CI/CD simultâneos. Esses nós compartilham o mesmo token e trabalham com um único nó FAST na nuvem.

Este esquema de implantação é aplicável aos nós FAST que operam em ambos os modos [recording][doc-ci-recording] e [testing][doc-ci-testing].

Para evitar conflitos durante a operação de nós FAST simultâneos, a variável de ambiente `BUILD_ID` é passada para o contêiner de cada nó. Esta variável serve aos seguintes propósitos:
1.  É usada como um identificador adicional para um registro de teste que é criado por um nó FAST no modo de gravação.
2.  Ele permite determinar qual registro de teste deve ser usado por uma execução de teste que é criada por um nó FAST no modo de teste (então a execução do teste torna-se vinculada ao registro do teste). 
3.  Identifica um certo fluxo de trabalho CI/CD.

A variável de ambiente `BUILD_ID` pode compreender qualquer combinação de letras e números como seu valor.

Em seguida, será dado um exemplo de como executar dois nós FAST simultaneamente: primeiro no modo de gravação, depois no modo de teste. A abordagem descrita abaixo é escalável (você pode usar quantos nós precisar, o número de nós não é limitado a dois como no exemplo abaixo) e é aplicável a um fluxo de trabalho CI/CD real.

##  Executando o Nó FAST em Modo de Gravação para Utilizar em Fluxos de Trabalho CI/CD Simultâneos

!!! info "Observação sobre os exemplos"
    Os exemplos abaixo usam apenas o conjunto essencial de variáveis de ambiente, o suficiente para um contêiner do nó FAST estar em funcionamento. Isso é para simplicidade.

Execute o seguinte comando para executar o primeiro contêiner do nó FAST em modo de gravação:

```
docker run --rm --name fast-node-1 \    # Este comando executa o contêiner fast-node-1
-e WALLARM_API_HOST=api.wallarm.com \   # Host do servidor API da Wallarm (neste caso, o host está localizado na nuvem europeia da Wallarm)
-e WALLARM_API_TOKEN='qwe_12345' \      # O token para se conectar ao nó FAST na nuvem
-e CI_MODE=recording \                  # Este nó operará em modo de gravação
-e BUILD_ID=1 \                         # O valor de BUILD_ID (deve ser diferente de outro para a pipeline concorrente)
-p 8080:8080 wallarm/fast               # O mapeamento de portas é feito aqui. Além disso, a imagem Docker a ser usada é especificada aqui.
```

Execute o seguinte comando para executar o segundo contêiner do nó FAST simultaneamente em modo de gravação:

```
docker run --rm --name fast-node-2 \
-e WALLARM_API_HOST=api.wallarm.com \
-e WALLARM_API_TOKEN='qwe_12345' \      # O valor do token deve ser idêntico ao usado para o primeiro nó FAST
-e CI_MODE=recording \
-e BUILD_ID=2 \                         # O valor de BUILD_ID difere do usado para o primeiro nó FAST em outro fluxo de trabalho CI/CD.
-p 8000:8080 wallarm/fast
```

!!! info "Nota sobre os comandos `docker run`"
    Os comandos mencionados são para serem executados no mesmo host Docker, então, além dos diferentes valores de `BUILD_ID`, esses comandos têm nomes de contêiner distintos (`fast-node-1` e `fast-node-2`) e valores de portas alvo (`8080` e `8000`).
    
    Se você executa contêineres de nó FAST em hosts Docker separados, então os comandos `docker run` podem diferir apenas nos valores de `BUILD_ID`.

Após executar esses dois comandos, dois nós FAST operarão em modo de gravação usando o mesmo nó FAST na nuvem, mas **registros de testes distintos serão criados**.

A saída do console da ferramenta CI/CD será semelhante à descrita [aqui][doc-ci-recording-example].

Quando os registros de teste estiverem preenchidos com todas as solicitações de linha de base necessárias, desligue os nós FAST correspondentes e inicie outros nós no modo de teste.

##  Executando o Nó FAST em Modo de Teste para Utilizar em Fluxos de Trabalho CI/CD Simultâneos

Vamos supor que os registros de teste `rec_1111` e `rec_2222` foram preparados durante a operação dos nós FAST `fast-node-1` e `fast-node-2` em modo de gravação.  

Então, para direcionar um nó FAST em modo de teste para usar o registro de teste `rec_1111`, passe a variável de ambiente `BUILD_ID=1` para o contêiner do nó. Da mesma forma, passe a variável de ambiente `BUILD_ID=2` para usar o registro de teste `rec_2222`. Use os comandos `docker run` correspondentes abaixo para executar nós FAST em modo de teste.

Execute o seguinte comando para executar o primeiro contêiner do nó FAST em modo de teste:

```
docker run --rm --name fast-node-1 \
-e WALLARM_API_HOST=api.wallarm.com \
-e WALLARM_API_TOKEN='qwe_12345' \
-e CI_MODE=testing \                    # Este nó operará em modo de teste
-e BUILD_ID=1 \                         # A variável `BUILD_ID=1` corresponde ao registro de teste `rec_1111`
wallarm/fast
```

Execute o seguinte comando para executar o segundo contêiner do nó FAST simultaneamente em modo de gravação:

```
docker run --rm --name fast-node-2 \
-e WALLARM_API_HOST=api.wallarm.com \
-e WALLARM_API_TOKEN='qwe_12345' \
-e CI_MODE=testing \                    # Este nó operará em modo de teste
-e BUILD_ID=2 \                         # A variável `BUILD_ID=2` corresponde ao registro de teste `rec_2222`
wallarm/fast
```

A saída do console da ferramenta CI/CD será semelhante à descrita [aqui][doc-ci-testing-example].

Como resultado da passagem dos valores correspondentes da variável de ambiente `BUILD_ID` para os nós FAST, **duas execuções de teste começarão a ser executadas simultaneamente**, cada uma trabalhando com um registro de teste distinto.

Assim, você pode executar alguns nós FAST para fluxos de trabalho CI/CD simultâneos especificando a variável de ambiente `BUILD_ID` sem criar nenhum conflito entre os nós (um novo teste criado não abortará a execução de um teste em execução).
