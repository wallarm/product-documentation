[img-influxdb-query-graphical]:     ../../images/monitoring/grafana-influx-1.png
[img-influxdb-query-plaintext]:     ../../images/monitoring/grafana-influx-2.png
[img-query-visualization]:          ../../images/monitoring/grafana-query-visualization.png
[img-grafana-0-attacks]:            ../../images/monitoring/grafana-0-attacks.png
[img-grafana-16-attacks]:           ../../images/monitoring/grafana-16-attacks.png

[link-grafana]:                     https://grafana.com/

[doc-network-plugin-influxdb]:      network-plugin-influxdb.md
[doc-network-plugin-graphite]:      write-plugin-graphite.md
[doc-gauge-abnormal]:                available-metrics.md#number-of-requests
[doc-available-metrics]:            available-metrics.md

[anchor-query]:                     #fetching-the-required-metrics-from-the-data-source
[anchor-verify-monitoring]:         #verifying-monitoring

#   Trabalhando com as métricas do nó de Filtro no Grafana

Se você configurou a exportação de métricas no InfluxDB ou Graphite, você pode visualizar as métricas com o [Grafana][link-grafana].


!!! info "Algumas suposições"
    Este documento pressupõe que você tenha implementado o Grafana junto ao [InfluxDB][doc-network-plugin-influxdb] ou [Graphite][doc-network-plugin-graphite].
    
    A métrica [`wallarm_nginx/gauge-abnormal`][doc-gauge-abnormal], que mostra o número de solicitações processadas pelo nó de filtro `node.example.local`, é usada como exemplo.
    
    No entanto, você pode monitorar qualquer [métrica suportada][doc-available-metrics]. 

No seu navegador, vá para `http://10.0.30.30:3000` para abrir o console web do Grafana, em seguida, faça o login no console usando o nome de usuário padrão (`admin`) e a senha (`admin`). 

Para monitorar um nó de filtro usando o Grafana, você precisará:
1.  Conectar uma fonte de dados.
2.  Obter as métricas necessárias da fonte de dados.
3.  Configurar a visualização de métricas. 

Está implícito que você está usando uma das seguintes fontes de dados:
*   InfluxDB
*   Graphite

##  Conectando uma Fonte de Dados

### InfluxDB

Para conectar um servidor InfluxDB como a fonte de dados, siga as etapas a seguir:
1.  Na página principal do console do Grafana, clique no botão *Adicionar fonte de dados*.
2.  Selecione "InfluxDB" como tipo de fonte de dados.
3.  Preencha os parâmetros necessários:
    *   Nome: InfluxDB
    *   URL: `http://influxdb:8086`
    *   Banco de dados: `collectd`
    *   Usuário: `root`
    *   Senha: `root`
4.  Clique no botão *Salvar & Testar*.



### Graphite

Para conectar um servidor Graphite como fonte de dados, siga estas etapas:
1.  Na página principal do console Grafana, clique no botão *Adicionar fonte de dados*.
2.  Selecione "Graphite" como o tipo de fonte de dados.
3.  Preencha os parâmetros necessários:
    *   Nome: Graphite
    *   URL: `http://graphite:8080`.
    *   Versão: selecione a versão mais recente disponível na lista suspensa.
4.  Clique no botão *Salvar & Testar*.


!!! info "Verificando o Status da Fonte de Dados"
    Se uma fonte de dados foi conectada com sucesso, a mensagem "Fonte de Dados está funcionando" deve aparecer.


### Ações Posteriores

Realize as seguintes ações para permitir que o Grafana monitore as métricas:
1.  Clique no ícone *Grafana* no canto superior esquerdo do console para retornar à página principal.
2.  Crie um novo painel clicando no botão *Novo Painel*. Em seguida, [adicione uma consulta][anchor-query] para buscar uma métrica para o painel clicando no botão *Adicionar Consulta*. 

##  Extraindo as Métricas Necessárias da Fonte de Dados

### InfluxDB

Para buscar uma métrica da fonte de dados InfluxDB, faça o seguinte:
1.  Selecione a recém-criada fonte de dados "InfluxDB" a partir da lista suspensa de *Consulta*.
2.  Crie uma consulta para o InfluxDB
    *   seja usando a ferramenta gráfica de criação de consultas,

        ![Ferramenta gráfica de criação de consultas][img-influxdb-query-graphical]

    *   ou preenchendo manualmente uma consulta em texto puro (para fazer isso, clique no botão *Alternar edição de texto*, que está destacado na captura de tela abaixo).

        ![Ferramenta de criação de consulta em texto puro][img-influxdb-query-plaintext]



A consulta para buscar a métrica `wallarm_nginx/gauge-abnormal` é:
```
SELECT value FROM curl_json_value WHERE (host = 'node.example.local' AND instance = 'wallarm_nginx' AND type = 'gauge' AND type_instance = 'abnormal')    
```



### Graphite

Para buscar uma métrica da fonte de dados Graphite, faça o seguinte:

1.  Selecione a recém-criada fonte de dados "Graphite" a partir da lista suspensa de *Consulta*.
2.  Selecione os elementos da métrica necessária de maneira sequencial ao clicar no botão *selecionar métrica* para o elemento métrica na linha *Séries*.

    Os elementos da métrica `wallarm_nginx/gauge-abnormal` são os seguintes:

    1.  O nome do host, conforme definido no arquivo de configuração do plugin `write_graphite`.
   
        O caractere `_` serve como delimitador por padrão neste plugin; portanto, o nome do domínio `node.example.local` será representado como `node_example_local` na consulta.
   
    2.  O nome do plugin `collectd` que fornece um valor específico. Para essa métrica, o plugin é `curl_json`.
    3.  O nome da instância do plugin. Para essa métrica, o nome é `wallarm_nginx`.
    4.  O tipo de valor. Para essa métrica, o tipo é `gauge`.
    5.  O nome do valor. Para essa métrica, o nome é `abnormal`.

### Ações Posteriores

Após a criação da consulta, configure uma visualização para a métrica correspondente.

##  Configurando a Visualização de Métrica

Mude da guia *Consulta* para a guia *Visualização*, e selecione a visualização desejada para a métrica.

Para a métrica `wallarm_nginx/gauge-abnormal`, recomendamos o uso da visualização "Medidor":
*   Selecione a opção *Calc: Último* para exibir o valor atual da métrica.
*   Se necessário, você pode configurar limites e outros parâmetros. 

![Configurar visualização][img-query-visualization]

### Ações Posteriores

Após configurar a visualização, siga as etapas a seguir:
*   Conclua a configuração da consulta clicando no botão *“←”* no canto superior esquerdo do console.  
*   Salve as alterações feitas no painel.
*   Verifique e confirme que o Grafana está monitorando a métrica com sucesso.

##  Verificando o Monitoramento

Depois de ter conectado uma das fontes de dados e configurado a consulta e a visualização para a métrica `wallarm_nginx/gauge-abnormal`, verifique a operação de monitoramento:
1.  Ative atualizações automáticas de métricas a intervalos de cinco segundos (selecione um valor da lista suspensa no canto superior direito do console Grafana).
2.  Certifique-se de que o número atual de solicitações no painel do Grafana corresponde à saída de `wallarm-status` no nó de filtro:

    --8<-- "../include-pt-BR/monitoring/wallarm-status-check-latest.md"
    
    ![Verificando o contador de ataques][img-grafana-0-attacks]
    
3.  Execute um ataque de teste em um aplicativo protegido pelo nó de filtro. Para fazer isso, você pode enviar uma solicitação maliciosa para o aplicativo usando a utilidade `curl` ou um navegador.

    --8<-- "../include-pt-BR/monitoring/sample-malicious-request.md"
    
4.  Certifique-se de que o contador de solicitações aumentou tanto na saída `wallarm-status` quanto no painel do Grafana:

    --8<-- "../include-pt-BR/monitoring/wallarm-status-output-padded-latest.md"

    ![Verificando o contador de ataques][img-grafana-16-attacks]

O painel do Grafana agora exibe os valores da métrica `wallarm_nginx/gauge-abnormal` para o nó de filtro `node.example.local`.