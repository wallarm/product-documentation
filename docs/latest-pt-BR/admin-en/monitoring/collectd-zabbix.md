[img-zabbix-scheme]:        ../../images/monitoring/zabbix-scheme.png

[link-zabbix]:              https://www.zabbix.com/
[link-collectd-nagios]:     https://collectd.org/wiki/index.php/Collectd-nagios
[link-zabbix-agent]:        https://www.zabbix.com/zabbix_agent
[link-zabbix-passive]:      https://www.zabbix.com/documentation/4.0/manual/appendix/items/activepassive
[link-zabbix-app]:          https://hub.docker.com/r/zabbix/zabbix-appliance
[link-docker-ce]:           https://docs.docker.com/install/
[link-zabbix-repo]:         https://www.zabbix.com/download
[link-allowroot]:           https://www.zabbix.com/documentation/4.0/manual/appendix/config/zabbix_agentd
[link-sed-docs]:            https://www.gnu.org/software/sed/manual/sed.html#sed-script-overview
[link-visudo]:              https://www.sudo.ws/man/1.8.17/visudo.man.html
[link-metric]:              available-metrics.md#number-of-requests

[doc-unixsock]:             fetching-metrics.md#exporting-metrics-using-the-collectd-nagios-utility

# Exportando Métricas para o Zabbix via a Utilidade `collectd-nagios`

Este documento fornece um exemplo de exportação de métricas do nó do filtro para o sistema de monitoramento [Zabbix][link-zabbix] usando a utilidades [`collectd-nagios`][link-collectd-nagios].

## Fluxo de trabalho do exemplo

--8<-- "../include-pt-BR/monitoring/metric-example.md"


![Fluxo de trabalho do exemplo][img-zabbix-scheme]

O seguinte esquema de implantação é usado neste documento:
*   O nó de filtro Wallarm é implantado em um host acessível via o endereço IP `10.0.30.5` e o nome de domínio totalmente qualificado `node.example.local`.
    
    O host possui o [agente Zabbix][link-zabbix-agent] 4.0 LTS implantado, que

    *   Faz o download das métricas do nó do filtro usando a utilidade `collectd-nagios`.
    *   Escuta as conexões de entrada na porta `10050/TCP` (assim, as [verificações passivas][link-zabbix-passive] serão realizadas com o uso do Zabbix Appliance).
    *   Passa os valores das métricas para o Zabbix Appliance. 
    
*   Em um host dedicado com o endereço IP `10.0.30.30` (daqui em diante referido como o host Docker), o [Zabbix Appliance][link-zabbix-app] 4.0 LTS é implantado na forma de um contêiner Docker.
    
    O Zabbix Appliance inclui
    
    *   Um servidor Zabbix que periodicamente consulta o agente Zabbix instalado no host do nó do filtro.

    
##  Como Configurar a Exportação de Métricas para o Zabbix


!!! info "Pré-requisitos"
    Está sendo assumido que

    *   O serviço `collectd` já foi configurado para funcionar via um Unix domain socket (veja [aqui][doc-unixsock] para mais detalhes).
    *   [Docker Community Edition][link-docker-ce] já está instalado no host Docker `10.0.30.30`.
    *   O nó do filtro `node.example.local` já foi deployado, configurado, está disponível para mais configurações (por exemplo, via protocolo SSH) e está funcionando.


### Implementando o Zabbix

Para implementar o Zabbix Appliance 4.0 LTS, execute o seguinte comando no host Docker:

``` bash
docker run --name zabbix-appliance -p 80:80 -d zabbix/zabbix-appliance:alpine-4.0-latest
```

Agora você tem uma função do sistema de monitoramento do Zabbix.

### Implementando o Agente Zabbix

Instale o agente Zabbix 4.0 LTS em um host com o nó do filtro:
1.  Conecte-se ao nó do filtro (por exemplo, utilizando o protocolo SSH). Certifique-se de que está sendo executado como `root` ou outra conta com privilégios de superusuário.
2.  Conecte o depósito do Zabbix (use a entrada "Instalar depósito Zabbix" das [instruções][link-zabbix-repo] para o seu sistema operacional).
3.  Instale o agente Zabbix executando o comando apropriado:

    --8<-- "../include-pt-BR/monitoring/install-zabbix-agent.md"

4.  Configure o agente Zabbix para trabalhar com o Zabbix Appliance. Para fazer isso, faça as seguintes mudanças no arquivo de configuração `/etc/zabbix/zabbix_agentd.conf`:
   
    ```
    Server=10.0.30.30             # Endereço IP do Zabbix
    Hostname=node.example.local   # FQDN do host com o nó do filtro
    ```
    
### Configurando a coleta de métricas usando o agente Zabbix

Conecte-se ao nó do filtro (por exemplo, usando o protocolo SSH) e configure a coleta de métricas usando o agente Zabbix. Execute as seguintes etapas no host com o nó do filtro:

####    1.  Instale a utilidade `collectd_nagios`
    
Execute o comando apropriado:

--8<-- "../include-pt-BR/monitoring/install-collectd-utils.md"


####    2.  Configure a utilidade `collectd-nagios` para executar com privilégios elevados em nome do usuário `zabbix`
   
Use a utilidade [`visudo`][link-visudo] para adicionar a seguinte linha ao arquivo `/etc/sudoers`:
    
```
zabbix ALL=(ALL:ALL) NOPASSWD:/usr/bin/collectd-nagios
```
    
Isso permite que o usuário `zabbix` execute a utilidade `collectd-nagios` com privilégios de superusuário usando a utilidade `sudo` sem a necessidade de fornecer uma senha.


!!! info "Executando `collectd-nagios` com privilégios superusuário"
    A utilidade deve ser executada com privilégios superusuário porque ela usa o `collectd` Unix domain socket para receber dados. Apenas um superusuário pode acessar este socket.
    
    Como uma alternativa para adicionar o usuário `zabbix` à lista `sudoers`, você pode configurar o agente Zabbix para executar como `root` (isso pode representar um risco de segurança, por isso não é recomendado). Isso pode ser realizado ativando a opção [`AllowRoot`][link-allowroot] no arquivo de configuração do agente.
        
####    3.  Garanta que o usuário `zabbix` possa receber valores de métricas do `collectd`
    
No nó do filtro, execute o seguinte comando de teste:
    
``` bash
sudo -u zabbix sudo /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n wallarm_nginx/gauge-abnormal -H node.example.local
```

Este comando chama o usuário `zabbix` para obter o valor da métrica [`wallarm_nginx/gauge-abnormal`][link-metric] para o host `node.example.local` com o nó do filtro.
    
**Exemplo de saída do comando:**

```
OKAY: 0 critical, 0 warning, 1 okay | value=0.000000;;;;
```
    
####    4.  Adicione parâmetros personalizados ao arquivo de configuração do agente Zabbix no host do nó do filtro para obter as métricas necessárias
    
Por exemplo, para criar um parâmetro personalizado `wallarm_nginx-gauge-abnormal` que corresponde à métrica `wallarm_nginx/gauge-abnormal` para um nó do filtro com o nome de domínio totalmente qualificado `node.example.local`, adicione a seguinte linha ao arquivo de configuração:
   
```
UserParameter=wallarm_nginx-gauge-abnormal, sudo /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n wallarm_nginx/gauge-abnormal -H node.example.local | sed -n "s/.*value\=\(.*\);;;;.*/\1/p"
```
!!! info "Extraindo um valor de métrica"
    Para extrair o valor de uma métrica que vem após `value=` na saída da utilidade `collectd-nagios` (por exemplo, `OKAY: 0 critical, 0 warning, 1 okay | value=0.000000;;;;), essa saída é canalizada para a utilidade `sed` que executa o script `sed` para remover caracteres desnecessários.
    
    Veja a [documentação `sed`][link-sed-docs] para mais informações sobre a sintaxe de seus scripts.

####    5.  Após todos os comandos necessários terem sido adicionados ao arquivo de configuração do agente Zabbix, reinicie o agente

--8<-- "../include-pt-BR/monitoring/zabbix-agent-restart-2.16.md"

##  Configuração Concluída

Agora, você pode monitorar parâmetros de usuário relacionados às métricas específicas da Wallarm com o Zabbix.