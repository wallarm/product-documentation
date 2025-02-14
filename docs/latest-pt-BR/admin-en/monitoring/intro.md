[link-collectd]:            https://collectd.org/

[av-bruteforce]:            ../../attacks-vulns-list.md#brute-force-attack
[doc-postanalitycs]:        ../installation-postanalytics-en.md

[link-collectd-naming]:     https://collectd.org/wiki/index.php/Naming_schema
[link-data-source]:         https://collectd.org/wiki/index.php/Data_source
[link-collectd-networking]: https://collectd.org/wiki/index.php/Networking_introduction
[link-influxdb]:            https://www.influxdata.com/products/influxdb-overview/
[link-grafana]:             https://grafana.com/
[link-graphite]:            https://github.com/graphite-project/graphite-web
[link-network-plugin]:      https://collectd.org/wiki/index.php/Plugin:Network
[link-write-plugins]:       https://collectd.org/wiki/index.php/Table_of_Plugins
[link-collectd-nagios]:     https://collectd.org/wiki/index.php/Collectd-nagios
[link-nagios]:              https://www.nagios.org/
[link-zabbix]:              https://www.zabbix.com/
[link-nagios-format]:       https://nagios-plugins.org/doc/guidelines.html#AEN200
[link-selinux]:             https://www.redhat.com/en/topics/linux/what-is-selinux

[doc-available-metrics]:    available-metrics.md
[doc-network-plugin]:       fetching-metrics.md#exporting-metrics-via-the-collectd-network-plugin
[doc-write-plugins]:        fetching-metrics.md#exporting-metrics-via-the-collectd-write-plugins
[doc-collectd-nagios]:      fetching-metrics.md#exporting-metrics-using-the-collectd-nagios-utility
[doc-collectd-notices]:     fetching-metrics.md#sending-notifications-from-collectd

[doc-selinux]:  ../configure-selinux.md

# Introdução ao monitoramento do nó de filtragem

Você pode monitorar o estado de um nó de filtro usando as métricas fornecidas pelo nó. Este artigo descreve como operar com as métricas coletadas pelo serviço [`collectd`][link-collectd] que é instalado em todos os nós de filtro Wallarm. O serviço `collectd` fornece várias maneiras de transferir dados e pode servir como uma fonte de métricas para muitos sistemas de monitoramento, oferecendo a você controle sobre o estado dos nós de filtro.

Além das métricas `collectd`, a Wallarm fornece um formato de métrica compatível com Prometheus e métricas JSON básicas. Leia sobre esses formatos [neste artigo](../configure-statistics-service.md).

!!! aviso "Suporte do serviço de monitoramento no nó CDN"
    Por favor, note que o serviço `collectd` não é suportado pelos [nós CDN da Wallarm](../../installation/cdn-node.md).

## Necessidade de Monitoramento

Falha ou trabalho instável no módulo Wallarm podem levar à negação total ou parcial do serviço para solicitações de usuário a um aplicativo protegido por um nó de filtro.

Falha ou trabalho instável no módulo de pós-análise pode levar à inacessibilidade das seguintes funcionalidades:
* Carregando dados de ataque na nuvem Wallarm. Como resultado, os ataques não serão exibidos no portal Wallarm.
* Detecção de ataques comportamentais (veja [ataques de força bruta][av-bruteforce]).
* Obtendo informações sobre a estrutura do aplicativo protegido.

Você pode monitorar tanto o módulo Wallarm quanto o módulo de pós-análise, mesmo que este último esteja [instalado separadamente][doc-postanalitycs].

!!! informação "Acordo de terminologia"

    Para monitorar o módulo Wallarm e o módulo de pós-análise, são utilizadas as mesmas ferramentas e métodos; portanto, ambos os módulos serão referidos como um “nó de filtro” ao longo deste guia, a menos que seja indicado o contrário.

    Todos os documentos que descrevem como configurar o monitoramento de um nó de filtro são adequados para

    *   módulos Wallarm implantados separadamente,
    *   módulos de pós-análise implantados separadamente, e
    *   módulos Wallarm and de pós-análise implantados conjuntamente.


## Pré-requisitos para Monitoramento

Para que o monitoramento funcione, é necessário que:
* O NGINX retorne as estatísticas para o nó de filtro (`wallarm_status on`),
* O modo de filtração esteja em `monitoramento`/`safe_blocking`/`block` [modo](../configure-wallarm-mode.md#available-filtration-modes).

Por padrão, este serviço está acessível em `http://127.0.0.8/wallarm-status`.

Se você [configurar](../configure-statistics-service.md#changing-an-ip-address-of-the-statistics-service) o serviço de estatísticas para estar disponível em um endereço não padrão:

1. Adicione o parâmetro `status_endpoint` com o novo valor de endereço ao arquivo `/etc/wallarm/node.yaml`, por exemplo:

    ```bash
    hostname: example-node-name
    uuid: ea1xa0xe-xxxx-42a0-xxxx-b1b446xxxxxx
    ...
    status_endpoint: 'http://127.0.0.2:8082/wallarm-status'
    ```
1. Corrija o parametro `URL` de acordo no arquivo de configuração `collectd`. A localização desse arquivo depende do tipo de distribuição do sistema operacional que você possui:

    --8<-- "../include-pt-BR/monitoring/collectd-config-location.md"

Se um endereço IP não padrão ou porta para Tarantool são usados, você precisará corrigir o arquivo de configuração do Tarantool. A localização deste arquivo depende do tipo de distribuição do sistema operacional que você possui:

--8<-- "../include-pt-BR/monitoring/tarantool-config-location.md"

Se o SELinux estiver instalado no host do nó de filtro, verifique se o SELinux está [configurado ou desativado][doc-selinux]. Para simplificar, este documento pressupõe que o SELinux está desativado.

## Como as Métricas Parecem

### Como as Métricas `collectd` Parecem

Um identificador de métrica `collectd` tem o seguinte formato:

```
host/plugin[-plugin_instance]/type[-type_instance]
```

Onde
*   `host`: o nome de domínio totalmente qualificado (FQDN) do host para o qual a métrica é obtida
*   `plugin`: o nome do plugin com o qual a métrica é obtida,
*   `-plugin_instance`: a instância do plugin, se houver uma,
*   `type`: o tipo do valor da métrica. Tipos permitidos:
    *   `counter`
    *   `derive`
    *   `gauge` 
    
    Informações detalhadas sobre os tipos de valor estão disponíveis [aqui][link-data-source].

*   `-type_instance`: uma instância do tipo, se houver uma. Tipo de instância é equivalente ao valor para o qual queremos obter a métrica.

Uma descrição completa dos formatos de métrica está disponível [aqui][link-collectd-naming].

### Como as Métricas Específicas da Wallarm `collectd` Parecem

O nó de filtro usa `collectd` para coletar métricas específicas da Wallarm.

Métricas do NGINX com o módulo Wallarm têm o seguinte formato:

```
host/wallarm_nginx/type-type_instance
```

Métricas do módulo de pós-análise têm o seguinte formato:

```
host/wallarm-tarantool/type-type_instance
```


!!! info "Exemplos de Métricas"
    Para um nó de filtro no host `node.example.local`:

    * `node.example.local/wallarm_nginx/gauge-abnormal` é a métrica do número de solicitações processadas;
    * `node.example.local/wallarm-tarantool/gauge-export_delay` é a métrica do atraso de exportação do Tarantool em segundos.
    
    Uma lista completa de métricas que podem ser monitoradas está disponível [aqui][doc-available-metrics].


## Métodos de Obtenção de Métricas

Você pode coletar métricas de um nó de filtro de várias maneiras:
*   Ao exportar dados diretamente do serviço `collectd`
    *   [via o plugin Network para `collectd`][doc-network-plugin].
    
        Este [plugin][link-network-plugin] permite que `collectd` baixe métricas de um nó de filtro para o servidor [`collectd`][link-collectd-networking] ou para o banco de dados [InfluxDB][link-influxdb].
        
        
        !!! info "InfluxDB"
            O InfluxDB pode ser usado para a agregação de métricas de `collectd` e outras fontes de dados com visualização subsequente (por exemplo, um sistema de monitoramento [Grafana][link-grafana] para visualizar as métricas armazenadas no InfluxDB).
        
    *   [via um dos plugins de escrita para `collectd`][doc-write-plugins].
  
        Por exemplo, você pode exportar dados coletados para [Graphite][link-graphite] usando o plugin `write_graphite`.
  
        
        !!! info "Graphite"
            O Graphite pode ser usado como uma fonte de dados para sistemas de monitoramento e visualização (por exemplo, [Grafana][link-grafana]).
        
  
    Este método é adequado para os seguintes tipos de implantação de nó de filtro:

    *   nas nuvens: Amazon AWS, Google Cloud;
    *   no Linux para plataformas NGINX/NGINX Plus.

*   [Ao exportar dados via `collectd-nagios`][doc-collectd-nagios].
  
    Esta [utilidade][link-collectd-nagios] recebe o valor da métrica dada de `collectd` e apresenta-a em um formato [compatível com Nagios][link-nagios-format].
  
    Você pode exportar métricas para sistemas de monitoramento [Nagios][link-nagios] ou [Zabbix][link-zabbix] usando esta utilidade.
  
    Este método é suportado por qualquer nó de filtro Wallarm, independentemente de como esse nó é implantado.
  
*   [Ao enviar notificações de `collectd`][doc-collectd-notices] quando uma métrica atingiu um valor de limite predeterminado.

    Este método é suportado por qualquer nó de filtro Wallarm, independentemente de como esse nó é implantado.