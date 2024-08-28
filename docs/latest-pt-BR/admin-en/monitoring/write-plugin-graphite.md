[img-write-plugin-graphite]:    ../../images/monitoring/write-plugin-graphite.png

[doc-grafana]:                  working-with-grafana.md

[link-docker-ce]:               https://docs.docker.com/install/
[link-docker-compose]:          https://docs.docker.com/compose/install/
[link-collectd-naming]:         https://collectd.org/wiki/index.php/Naming_schema
[link-write-plugin]:            https://www.collectd.org/documentation/manpages/collectd.conf.html#plugin_write_graphite

#   Exportando Métricas para Graphite via o Plugin de Escrita `collectd`

Este documento fornece um exemplo de uso do plugin de escrita `write_graphite` para exportar métricas para Graphite.

##  Fluxo de Trabalho Exemplar

--8<-- "../include-pt-BR/monitoring/metric-example.md"

![Fluxo de trabalho exemplar][img-write-plugin-graphite]

O seguinte esquema de implantação é utilizado neste documento:
*   O nó de filtro Wallarm é implantado em um host acessível através do endereço IP `10.0.30.5` e o nome de domínio completamente qualificado `node.example.local`.

    O plugin `write_graphite` para `collectd` no nó de filtro está configurado da seguinte maneira:

      *   Todas as métricas são enviadas para o servidor `10.0.30.30` que está ouvindo na porta `2003/TCP`.
      *   Alguns plugins Wallarm-específicos `collectd` suportam várias [instâncias][link-collectd-naming], então o plugin `write_graphite` contém o parâmetro `SeparateInstances` definido como `true`. O valor `true` significa que o plugin pode trabalhar com várias instâncias.
    
    Uma lista completa das opções do plugin está disponível [aqui][link-write-plugin].
    
*   Ambos os serviços `graphite` e `grafana` são implantados como contêineres Docker em um host separado com o endereço IP `10.0.30.30`.
    
    O serviço `graphite` com Graphite está configurado da seguinte maneira:

      *   Ele ouve conexões de entrada na porta `2003/TCP`, para a qual o `collectd` enviará as métricas do nó de filtro.
      *   Ele ouve para conexões de entrada na porta `8080/TCP`, através do qual a comunicação com Grafana ocorrerá.
      *   O serviço compartilha a rede Docker `sample-net` com o serviço `grafana`.

    O serviço `grafana` com Grafana está configurado da seguinte maneira:

      *   O console web de Grafana está disponível em `http://10.0.30.30:3000`.
      *   O serviço compartilha a rede Docker `sample-net` com o serviço `graphite`.

##  Configurando a Exportação de Métricas para Graphite

--8<-- "../include-pt-BR/monitoring/docker-prerequisites.md"

### Implantando Graphite e Grafana

Implante Graphite e Grafana no host Docker:
1.  Crie um arquivo `docker-compose.yaml` com o seguinte conteúdo:
    
    ```
    version: "3"
    
    services:
      grafana:
        image: grafana/grafana
        container_name: grafana
        restart: always
        ports:
          - 3000:3000
        networks:
          - sample-net
    
      graphite:
        image: graphiteapp/graphite-statsd
        container_name: graphite
        restart: always
        ports:
          - 8080:8080
          - 2003:2003
        networks:
          - sample-net
    
    networks:
      sample-net:
    ```
    
2.  Construa os serviços executando o comando `docker-compose build`.
    
3.  Execute os serviços com o comando `docker-compose up -d graphite grafana`.
    
Neste ponto, você deve ter o Graphite em funcionamento e pronto para receber métricas de `collectd`, e Grafana pronto para monitorar e visualizar os dados armazenados no Graphite.

### Configurando `collectd`

Configure `collectd` para baixar métricas para Graphite:
1.  Conecte-se ao nó de filtro (por exemplo, usando o protocolo SSH). Certifique-se de que você está logado como `root` ou outra conta com privilégios de superusuário.
2.  Crie um arquivo chamado `/etc/collectd/collectd.conf.d/export-to-graphite.conf` com o seguinte conteúdo:
    
    ```
    LoadPlugin write_graphite
    
    <Plugin write_graphite>
     <Node "node.example.local">
       Host "10.0.30.30"
       Port "2003"
       Protocol "tcp"
       SeparateInstances true
     </Node>
    </Plugin>
    ```
    
    As seguintes entidades estão configuradas aqui:
    
    1.  O nome do host do qual as métricas são coletadas (`node.example.local`).
    2.  O servidor para o qual as métricas devem ser enviadas (`10.0.30.30`).
    3.  A porta do servidor (`2003`) e o protocolo (`tcp`).
    4.  A lógica de transferência de dados: os dados de uma instância do plugin são separados dos dados de outra instância (`SeparateInstances true`).
    
3.  Reinicie o serviço `collectd` executando o comando apropriado:

    --8<-- "../include-pt-BR/monitoring/collectd-restart-2.16.md"

Agora o Graphite receberá todas as métricas do nó de filtro. Você pode visualizar as métricas que lhe interessam e monitorá-las [com o Grafana][doc-grafana].