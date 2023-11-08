[anchor-report-mode]:              #executando-o-node-fast-em-modo-de-relatorio

[doc-ci-mode-testing-report]:      ../poc/ci-mode-testing.md#obtendo-o-relatorio-sobre-o-teste
[doc-ci-mode-testing]:             ../poc/ci-mode-testing.md
[doc-get-token]:                   create-node.md
[deploy-docker-with-fast-node]:    ../qsg/deployment.md#4-implante-o-container-docker-do-node-fast

# Obtendo o Relatório com Resultados de Testes

O node FAST permite que você obtenha os resultados dos testes nos formatos TXT e JSON:

* O arquivo TXT contém resultados de testes breves — estatísticas de linha de base e lista de vulnerabilidades detectadas.
* O arquivo JSON contém resultados de testes detalhados — detalhes sobre o teste de segurança e pedidos básicos, além da lista de vulnerabilidades detectadas. O conteúdo do arquivo JSON corresponde aos dados fornecidos na sua conta do Wallarm > **Execuções de teste**.

Para obter o relatório, selecione o método de geração de relatórios e siga as instruções abaixo:

* [Executando o node FAST em modo de relatório][anchor-report-mode]
* [Executando o node FAST em modo de teste com a opção de baixar um relatório][doc-ci-mode-testing-report]

## Executando o Node FAST em Modo de Relatório

Para executar o node FAST em modo de relatório, execute as seguintes etapas ao [implantar o contêiner Docker][deploy-docker-with-fast-node]:

<ol start="1"><li>Defina as variáveis de ambiente:</li></ol>

| Variável             	| Descrição 	| Obrigatório 	|
|--------------------	| --------	| -----------	|
| `WALLARM_API_TOKEN`  	| Um [token][doc-get-token] do Wallarm cloud. | Sim |
| `WALLARM_API_HOST`   	| O endereço do servidor API do Wallarm.<br>Valores permitidos:<br>`us1.api.wallarm.com` para o servidor na nuvem Wallarm US e<br>`api.wallarm.com` para o servidor na nuvem Wallarm EU. | Sim |
| `CI_MODE`            	| O modo de operação do node FAST.<br>Deve ser `report`. | Sim |
| `TEST_RUN_ID`      	| O ID da execução do teste necessário para obter o relatório.<br>O ID é exibido na sua conta Wallarm > **Execuções de teste** e nos logs de execução do node FAST em modo de teste.<br>Por padrão, o ID da última execução de teste é usado. | Não |

<ol start="2"><li>Passe o caminho para a pasta de relatórios por meio da opção <code>-v {DIRETORIO_PARA_RELATORIOS}:/opt/reports/</code>.</li></ol>

**Exemplo de comando para executar o contêiner Docker do node FAST em modo de relatório:**

```
docker run  --rm -e WALLARM_API_HOST=us1.api.wallarm.com -e WALLARM_API_TOKEN=qwe53UTb2 -e CI_MODE=report -e TEST_RUN_ID=9012 -v documentos/relatorios:/opt/reports/ wallarm/fast
```

## Obtendo o Relatório

Se o comando foi executado com sucesso, você obterá dados breves sobre a execução do teste no terminal:

--8<-- "../include-pt-BR/fast/console-include/operations/node-in-ci-mode-report.md"

Quando a geração do relatório estiver concluída, você encontrará os seguintes arquivos com relatórios na pasta `DIRETORIO_PARA_RELATORIOS`:

* `<NOME DA EXECUÇÃO DO TESTE>.<TEMPO UNIX>.txt`
* `<NOME DA EXECUÇÃO DO TESTE>.<TEMPO UNIX>.json`