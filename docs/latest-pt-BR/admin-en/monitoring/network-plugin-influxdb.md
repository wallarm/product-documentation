[img-network-plugin-influxdb]:     ../../images/monitoring/network-plugin-influxdb.png

[doc-grafana]:                     working-with-grafana.md

[link-collectd-networking]:        https://collectd.org/wiki/index.php/Networking_introduction
[link-network-plugin]:             https://www.collectd.org/documentation/manpages/collectd.conf.html
[link-typesdb]:                    https://www.collectd.org/documentation/manpages/types.db.html
[link-typesdb-file]:               https://github.com/collectd/collectd/blob/master/src/types.db

#   Exportando Métricas para InfluxDB via o Plugin de Rede `collectd`

Este documento fornece um exemplo de uso do plugin de rede para exportar métricas para o banco de dados temporal InfluxDB. Ele também demonstrará como visualizar as métricas coletadas no InfluxDB usando o Grafana.

##  Fluxo de Trabalho Exemplificado

--8<-- "../include-pt-BR/monitoring/metric-example.md"

![Fluxo de Trabalho Exemplificado][img-network-plugin-influxdb]

O seguinte esquema de implementação é usado neste documento:
*   O nó de filtro Wallarm é implantado em um host acessível via o endereço IP `10.0.30.5` e o nome de domínio completamente qualificado `node.example.local`.
    
    O plugin `network` para `collectd` no nó de filtro está configurado de tal forma que todas as métricas serão enviadas para o servidor InfluxDB `10.0.30.30` na porta `25826/UDP`.
    
      
    !!! info "Recursos do plugin de rede"
        Por favor note que o plugin opera através de UDP (veja os [exemplos de uso][link-collectd-networking] e a [documentação][link-network-plugin] do plugin `network`).
    
    
*   Os serviços `influxdb` e grafana são implantados como containers Docker em um host separado com o endereço IP `10.0.30.30`.

    O serviço `influxdb` com o banco de dados InfluxDB está configurado da seguinte forma:

      * Uma fonte de dados `collectd` foi criada (a entrada `collectd` de acordo com a terminologia do InfluxDB), que escuta na porta `25826/UDP` e escreve métricas recebidas em um banco de dados chamado `collectd`.
      * A comunicação com a API do InfluxDB ocorre via a porta `8086/TCP`.
      * O serviço compartilha uma rede Docker `sample-net` com o serviço `grafana`.
    
    
    
    O serviço `grafana` com o Grafana está configurado da seguinte forma:
    
      * O console da web do Grafana está disponível em `http://10.0.30.30:3000`.
      * O serviço compartilha a rede Docker `sample-net` com o serviço `influxdb`.

##  Configurando a Exportação de Métricas para o InfluxDB

--8<-- "../include-pt-BR/monitoring/docker-prerequisites.md"

### Implantando o InfluxDB e o Grafana

Implante o InfluxDB e o Grafana no host Docker:
1.  Crie um diretório de trabalho, por exemplo, `/tmp/influxdb-grafana`, e navegue até ele:
    
    ```
    mkdir /tmp/influxdb-grafana
    cd /tmp/influxdb-grafana
    ```
    
2.  Para que a fonte de dados do InfluxDB funcione, você precisará de um arquivo chamado `types.db` que contém os tipos de valores do `collectd`.
    
    Este arquivo descreve as especificações do conjunto de dados usados pelo `collectd`. Tais conjuntos de dados incluem definições de tipos mensuráveis. Há informações detalhadas sobre este arquivo disponíveis [aqui][link-typesdb].
    
    [Baixe o arquivo `types.db`][link-typesdb-file] do repositório GitHub do projeto `collectd` e coloque-o no diretório de trabalho.
    
3.  Obtenha o arquivo de configuração básico do InfluxDB executando o seguinte comando: 
    
    ```
    docker run --rm influxdb influxd config > influxdb.conf
    ```
    
4.  Habilite a fonte de dados `collectd` no arquivo de configuração `influxdb.conf` do InfluxDB alterando o valor do parâmetro `enabled` na seção `[[collectd]]` de `false` para `true`.
    
    Deixe os outros parâmetros inalterados.
   
    A seção deve parecer com isto:
   
    ```
    [[collectd]]
      enabled = true
      bind-address = ":25826"
      database = "collectd"
      retention-policy = ""
      batch-size = 5000
      batch-pending = 10
      batch-timeout = "10s"
      read-buffer = 0
      typesdb = "/usr/share/collectd/types.db"
      security-level = "none"
      auth-file = "/etc/collectd/auth_file"
      parse-multivalue-plugin = "split"  
    ```
    
5.  Crie um arquivo `docker-compose.yaml` no diretório de trabalho com o seguinte conteúdo:
   
    ```
    version: "3"
    
    services:
      influxdb:
        image: influxdb
        container_name: influxdb
        ports:
          - 8086:8086
          - 25826:25826/udp
        networks:
          - sample-net
        volumes:
          - ./:/var/lib/influxdb
          - ./influxdb.conf:/etc/influxdb/influxdb.conf:ro
          - ./types.db:/usr/share/collectd/types.db:ro
    
      grafana:
        image: grafana/grafana
        container_name: grafana
        restart: always
        ports:
          - 3000:3000
        networks:
          - sample-net
    
    networks:
      sample-net:
    ```

    De acordo com as configurações em `volumes:`, InfluxDB usará
    1.  O diretório de trabalho como armazenamento para o banco de dados.
    2.  O arquivo de configuração `influxdb.conf` que está localizado no diretório de trabalho.
    3.  O arquivo `types.db` com os tipos de valores mensuráveis que está localizado no diretório de trabalho.  
    
6.  Construa os serviços executando o comando `docker-compose build`.
    
7.  Execute os serviços com o comando `docker-compose up -d influxdb grafana`.
    
8.  Crie um banco de dados chamado `collectd` para a respectiva fonte de dados InfluxDB executando o seguinte comando:
   
    ```
    curl -i -X POST http://10.0.30.30:8086/query --data-urlencode "q=CREATE DATABASE collectd"
    ```
    
    O servidor InfluxDB deve retornar uma resposta similar a:
   
    ```
    HTTP/1.1 200 OK
    Content-Type: application/json
    Request-Id: 23604241-b086-11e9-8001-0242ac190002
    X-Influxdb-Build: OSS
    X-Influxdb-Version: 1.7.7
    X-Request-Id: 23604241-b086-11e9-8001-0242ac190002
    Date: Sat, 27 Jul 2019 15:49:37 GMT
    Transfer-Encoding: chunked
    
    {"results":[{"statement_id":0}]}
    ```
    
Neste ponto, o InfluxDB deve estar em funcionamento, pronto para receber métricas do `collectd`, e o Grafana deve estar pronto para monitorar e visualizar os dados armazenados no InfluxDB.

### Configurando `collectd`

Configure `collectd` para exportar métricas ao InfluxDB:
1. Conecte-se ao nó do filtro (por exemplo, usando o protocolo SSH). Certifique-se de que você está logado como root ou outra conta com privilégios de superusuário.
2. Crie um arquivo chamado `/etc/collectd/collectd.conf.d/export-to-influxdb.conf`com o seguinte conteúdo:
   
    ```
    LoadPlugin network
    
    <Plugin "network">
        Server "10.0.30.30" "25826"
    </Plugin>
    ```
    
    As seguintes entidades estão configuradas aqui:

    1.  O servidor, para enviar métricas para (`10.0.30.30`)
    2.  A porta na qual o servidor está ouvindo (`25826/UDP`)
    
3. Reinicie o serviço `collectd` executando o comando apropriado:

    --8<-- "../include-pt-BR/monitoring/collectd-restart-2.16.md"

Agora InfluxDB recebe todas as métricas do nó do filtro. Você pode visualizar as métricas de seu interesse e monitorá-las [com o Grafana][doc-grafana].