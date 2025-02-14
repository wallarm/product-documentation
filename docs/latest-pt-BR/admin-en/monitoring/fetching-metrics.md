[link-network-plugin]:              https://collectd.org/wiki/index.php/Plugin:Network
[link-network-plugin-docs]:         https://www.collectd.org/documentation/manpages/collectd.conf.html
[link-collectd-networking]:         https://collectd.org/wiki/index.php/Networking_introduction
[link-influx-collectd-support]:     https://docs.influxdata.com/influxdb/v1.7/supported_protocols/collectd/
[link-plugin-table]:                https://collectd.org/wiki/index.php/Table_of_Plugins
[link-nagios-plugin-docs]:          https://www.collectd.org/documentation/manpages/collectd-nagios.html
[link-notif-common]:                https://collectd.org/wiki/index.php/Notifications_and_thresholds
[link-notif-details]:               https://www.collectd.org/documentation/manpages/collectd-threshold.html
[link-influxdb-collectd]:           https://docs.influxdata.com/influxdb/v1.7/supported_protocols/collectd/
[link-unixsock]:                    https://collectd.org/wiki/index.php/Plugin:UnixSock

[doc-network-plugin-example]:       network-plugin-influxdb.md
[doc-write-plugin-example]:         write-plugin-graphite.md
[doc-zabbix-example]:               collectd-zabbix.md
[doc-nagios-example]:               collectd-nagios.md

# Como buscar métricas

Estas instruções descrevem as formas de coletar métricas de um nó de filtragem.

## Exportando Métricas Diretamente do `collectd`

Você pode exportar as métricas coletadas pelo `collectd` diretamente para as ferramentas que suportam trabalhar com fluxos de dados do `collectd`.

!!! warning "Pré-requisitos"
    Todas as etapas seguintes devem ser realizadas como superusuário (por exemplo, `root`).

### Exportando Métricas via Plugin de Rede do `collectd`

Configure e conecte o [plugin de rede][link-network-plugin] ao `collectd`:
1. No diretório `/etc/collectd/collectd.conf.d/`, crie um arquivo com a extensão `.conf` (por exemplo, `export-via-network.conf`) e o seguinte conteúdo:

    ```
    LoadPlugin network

    <Plugin "network">
      Server "Endereço IPv4/v6 do servidor ou FQDN" "Porta do servidor"
    </Plugin>
    ```

    Conforme declarado neste arquivo, o plugin será carregado ao iniciar o `collectd`, operará no modo cliente e enviará os dados de métricas do nó de filtro para o servidor especificado.

2. Configure um servidor que receberá dados do cliente `collectd`. As etapas de configuração necessárias dependem do servidor selecionado (veja exemplos para [`collectd`][link-collectd-networking] e [InfluxDB][link-influxdb-collectd]).

    !!! info "Trabalhando com o Plugin de Rede"
        O plugin de rede funciona sobre UDP (consulte a [documentação do plugin][link-network-plugin-docs]). Certifique-se de que o servidor permite a comunicação via UDP para que a coleta de métricas esteja operacional.

3. Reinicie o serviço `collectd` executando o comando apropriado:

    --8<-- "../include-pt-BR/monitoring/collectd-restart-2.16.md"

!!! info "Exemplo"
    Leia um [exemplo de exportação de métricas][doc-network-plugin-example] para o InfluxDB via plugin de rede com subsequente visualização das métricas no Grafana.
    
### Exportando Métricas via os Plugins de Escrita do `collectd`

Para configurar a exportação de métricas via os [plugins de escrita][link-plugin-table] do `collectd`, consulte a documentação do plugin correspondente.


!!! info "Exemplo"
    Para obter informações básicas sobre o uso de plugins de escrita, leia um [exemplo de exportação de métricas][doc-write-plugin-example] para o Graphite com subsequente visualização das métricas no Grafana.

## Exportando Métricas Usando a Utilidade `collectd-nagios`

Para exportar métricas usando esse método:

1. Instale a utilidade `collectd-nagios` em um host com um nó de filtro executando o comando apropriado (para um nó de filtro instalado no Linux):

    --8<-- "../include-pt-BR/monitoring/install-collectd-utils.md"

    !!! info "Imagem Docker"
        A imagem Docker do nó de filtro vem com a utilidade `collectd-nagios` pré-instalada.

2. Certifique-se de que você pode executar esta utilidade com privilégios elevados, seja em nome de um superusuário (por exemplo, `root`) ou como um usuário normal. No último caso, adicione o usuário ao arquivo `sudoers` com a diretiva `NOPASSWD` e use o utilitário `sudo`.

    !!! info "Trabalhando com o contêiner Docker"
        Ao executar o utilitário `collectd-nagios` em um contêiner Docker com o nó de filtro, a elevação de privilégios não é necessária.

3. Conecte e configure o plugin [`UnixSock`][link-unixsock] para transmitir as métricas do `collectd` via um soquete de domínio Unix. Para fazer isso, crie o arquivo `/etc/collectd/collectd.conf.d/unixsock.conf` com o seguinte conteúdo:

    ```
    LoadPlugin unixsock

    <Plugin unixsock>
        SocketFile "/var/run/wallarm-collectd-unixsock"
        SocketGroup "root"
        SocketPerms "0770"
        DeleteSocket true
    </Plugin>
    ```

4. Reinicie o serviço `collectd` executando o comando apropriado:

    --8<-- "../include-pt-BR/monitoring/collectd-restart-2.16.md"

5. Obtenha o valor da métrica necessária executando o comando apropriado:

    --8<-- "../include-pt-BR/monitoring/collectd-nagios-fetch-metric.md"

    !!! info "Obtendo o ID do contêiner Docker"
        Você pode encontrar o valor do identificador do contêiner executando o comando `docker ps` (veja a coluna “CONTAINER ID”).

!!! info "Definindo Limites para a Utilidade `collectd-nagios`"
    Se necessário, você pode especificar um intervalo de valores para o qual a utilidade `collectd-nagios` retornará o status `WARNING` ou `CRITICAL` usando as opções `-w` e `-c` correspondentes (informações detalhadas estão disponíveis na [documentação do utilitário][link-nagios-plugin-docs]).

**Exemplos de uso da utilidade:**
*   Para obter o valor da métrica `wallarm_nginx/gauge-abnormal` (no momento em que o `collectd-nagios` foi chamado) no host Linux `node.example.local` com o nó de filtro, execute o seguinte comando:

    ```
    /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n wallarm_nginx/gauge-abnormal -H node.example.local
    ```

*   Para obter o valor da métrica `wallarm_nginx/gauge-abnormal` (na hora em que `collectd-nagios` foi chamado) para o nó de filtro rodando no contêiner Docker com o nome `wallarm-node` e o identificador `95d278317794`, execute o seguinte comando:

    ```
    docker exec wallarm-node /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n wallarm_nginx/gauge-abnormal -H 95d278317794
    ```

!!! info "Mais exemplos"
    Para obter informações básicas sobre o uso da utilidade `collectd-nagios`, leia exemplos de exportação de métricas
    
* [para o sistema de monitoramento Nagios][doc-nagios-example] e
* [para o sistema de monitoramento Zabbix][doc-zabbix-example].

## Enviando Notificações do `collectd`

As notificações são configuradas no seguinte arquivo:

--8<-- "../include-pt-BR/monitoring/notification-config-location.md"

Uma descrição geral de como as notificações funcionam está disponível [aqui][link-notif-common].

Mais informações detalhadas sobre como configurar notificações estão disponíveis [aqui][link-notif-details].

Métodos possíveis de envio de notificações:
* NSCA e NSCA-ng
* SNMP TRAP
* Mensagens de e-mail
* Scripts personalizados