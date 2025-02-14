[img-collectd-nagios]:      ../../images/monitoring/collectd-nagios.png

[link-nagios]:              https://www.nagios.org/
[link-nagios-core]:         https://www.nagios.org/downloads/nagios-core/
[link-collectd-nagios]:     https://collectd.org/wiki/index.php/Collectd-nagios
[link-nagios-core-install]: https://support.nagios.com/kb/article/nagios-core-installing-nagios-core-from-source-96.html
[link-nrpe-docs]:           https://github.com/NagiosEnterprises/nrpe/blob/master/README.md
[link-visudo]:              https://www.sudo.ws/man/1.8.17/visudo.man.html
[link-collectd-docs]:       https://www.collectd.org/documentation/manpages/collectd-nagios.html
[link-nrpe-readme]:         https://github.com/NagiosEnterprises/nrpe
[link-nrpe-pdf]:            https://assets.nagios.com/downloads/nagioscore/docs/nrpe/NRPE.pdf
[link-metric]:              ../../admin-en/monitoring/available-metrics.md#number-of-requests

[doc-gauge-abnormal]:        available-metrics.md#number-of-requests
[doc-unixsock]:             fetching-metrics.md#exporting-metrics-using-the-collectd-nagios-utility

[anchor-header-7]:          #7-adicione-comandos-ao-arquivo-de-configuracao-do-servico-nrpe-no-no-de-filtro-para-obter-as-metricas-necessarias

#   Exportando Métricas para o Nagios através da Utilidade `collectd-nagios`

Este documento fornece um exemplo de exportação de métricas do nó de filtro para o sistema de monitoramento [Nagios][link-nagios] (sugere-se a edição [Nagios Core][link-nagios-core], no entanto, este documento é adequado para qualquer edição do Nagios) usando a utilidade [`collectd-nagios`][link-collectd-nagios].


!!! info "Suposições e requisitos"
    *   O serviço `collectd` deve ser configurado para funcionar através de um soquete de domínio Unix (veja [aqui][doc-unixsock] para detalhes).
    *   Presume-se que você já tenha a edição Nagios Core instalada.
        
        Se não, instale o Nagios Core (por exemplo, seguindo estas [instruções][link-nagios-core-install]).
    
        Você pode usar outra edição do Nagios, se necessário (por exemplo, o Nagios XI).
        
        O termo "Nagios" será usado aqui para se referir a qualquer edição do Nagios, a menos que seja indicado o contrário.
        
    *   Você deve ter a capacidade de se conectar ao nó de filtro e ao host do Nagios (por exemplo, via protocolo SSH) e trabalhar sob a conta `root` ou outra conta com direitos de superusuário.
    *   O serviço [Nagios Remote Plugin Executor][link-nrpe-docs] (que será referido como *NRPE* ao longo deste exemplo) deve estar instalado no nó de filtro.

##  Exemplo de Fluxo de Trabalho

--8<-- "../include-pt-BR/monitoring/metric-example.md"

![Exemplo de fluxo de trabalho][img-collectd-nagios]

O seguinte esquema de implantação é usado neste documento:
*   O nó de filtro Wallarm é implantado em um host acessível via o endereço IP `10.0.30.5` e o nome de domínio totalmente qualificado `node.example.local`.
*   O Nagios é instalado em um host separado acessível via o endereço IP `10.0.30.30`.
*   Para executar comandos em um host remoto, é usado o plugin NRPE. O plugin compreende
    *   O serviço `nrpe` que é instalado no host monitorado juntamente com o nó de filtro. Ele escuta na porta NRPE padrão `5666/TCP`.
    *   O plugin NRPE `check_nrpe` do Nagios que é instalado no host do Nagios e permite ao Nagios executar comandos no host remoto onde o serviço `nrpe` está instalado.
*   O NRPE será usado para chamar a utilidade `collectd_nagios` que fornece as métricas do `collectd` em um formato compatível com o Nagios.

##  Configurando a Exportação de Métricas para o Nagios


!!! info "Uma nota sobre este exemplo de instalação"
    Este documento descreve como instalar e configurar o plugin NRPE quando o Nagios já está instalado com parâmetros padrão (presume-se que o Nagios está instalado no diretório `/usr/local/nagios` e usa o usuário `nagios` para operar). Se você estiver fazendo uma instalação não padrão do plugin ou do Nagios, ajuste os comandos e instruções correspondentes do documento conforme necessário.

Para configurar a exportação de métricas do nó de filtro para o Nagios, siga estas etapas:

### 1.  Configure o NRPE para se Comunicar com o Host do Nagios 

Para fazer isso, em um host do nó de filtro: 
1.  Abra o arquivo de configuração do NRPE (padrão: `/usr/local/nagios/etc/nrpe.cfg`).
    
2.  Adicione o endereço IP ou nome de domínio totalmente qualificado do servidor Nagios à diretiva `allowed_hosts` neste arquivo. Por exemplo, se o host do Nagios usa o endereço IP `10.0.30.30`:
    
    ```
    allowed_hosts=127.0.0.1,10.0.30.30
    ```
    
3.  Reinicie o serviço NRPE executando o comando apropriado:

    --8<-- "../include-pt-BR/monitoring/nrpe-restart-2.16.md"

### 2.  Instale o Plugin NRPE do Nagios no Host do Nagios

Para fazer isso, no host do Nagios, siga as seguintes etapas:
1.  Baixe e descompacte os arquivos fonte para o plugin NRPE, e instale as utilidades necessárias para construir e instalar o plugin (consulte a [documentação do NRPE][link-nrpe-docs] para detalhes). 
2.  Vá para o diretório com o código fonte do plugin, construa a partir das fontes e, em seguida, instale o plugin.

    As etapas mínimas a serem tomadas são:
    
    ```
    ./configure
    make all
    make install-plugin
    ```
    
### 3.  Certifique-se de que o Plugin NRPE do Nagios Interage com Sucesso com o Serviço NRPE

Para fazer isso, execute o seguinte comando no host do Nagios:

``` bash
/usr/local/nagios/libexec/check_nrpe -H node.example.local
```

Se o NRPE estiver funcionando normalmente, a saída do comando deve conter uma versão NRPE (por exemplo, `NRPE v3.2.1`).

### 4.  Defina o Comando `check_nrpe` para Executar o Plugin NRPE do Nagios com um Único Argumento no Host do Nagios

Para fazer isso, adicione ao arquivo `/usr/local/nagios/etc/objects/commands.cfg` as seguintes linhas:

```
define command{
    command_name check_nrpe
    command_line $USER1$/check_nrpe -H $HOSTADDRESS$ -c $ARG1$
 }
```

### 5. Instale a Utilidade `collectd_nagios` no Host do Nó de Filtro

Execute um dos seguintes comandos:

--8<-- "../include-pt-BR/monitoring/install-collectd-utils.md"

### 6.  Configure a Utilidade `collectd-nagios` para Executar com Privilégios Elevados em Nome do Usuário `nagios`

Para fazer isso, realize as seguintes etapas no host do nó de filtro:
1.  Usando a utilidade [`visudo`][link-visudo], adicione a seguinte linha ao arquivo `/etc/sudoers`:
    
    ```
    nagios ALL=(ALL:ALL) NOPASSWD:/usr/bin/collectd-nagios
    ```
    
    Isso permite que o usuário `nagios` execute a utilidade `collectd-nagios` com privilégios de superusuário usando `sudo` sem a necessidade de fornecer quaisquer senhas.

    
    !!! info "Executando `collectd-nagios` com privilégios de superusuário"
        A utilidade deve ser executada com privilégios de superusuário porque ela usa o soquete de domínio Unix do `collectd` para receber dados. Apenas um superusuário pode acessar este soquete.

2.  Certifique-se de que o usuário `nagios` pode receber valores de métricas do `collectd` executando o seguinte comando de teste:
    
    ```
    sudo -u nagios sudo /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n wallarm_nginx/gauge-abnormal -H node.example.local
    ```
    
    Este comando permite que o usuário `nagios` obtenha o valor da métrica [`wallarm_nginx/gauge-abnormal`][link-metric] (o número de solicitações processadas) para o host `node.example.local`.
    
    **Exemplo de saída de comando:**
    
    ```
    OKAY: 0 critical, 0 warning, 1 okay | value=0.000000;;;;
    ```

3.  Adicione um prefixo ao arquivo de configuração do serviço NRPE para que ele possa executar comandos usando a utilidade `sudo`:
    
    ```
    command_prefix=/usr/bin/sudo
    ```

### 7.  Adicione Comandos ao Arquivo de Configuração do Serviço NRPE no Nó de Filtro para Obter as Métricas Necessárias

Por exemplo, para criar um comando chamado `check_wallarm_nginx_abnormal` que receberá a métrica `wallarm_nginx/gauge-abnormal` para o nó de filtro com o nome de domínio totalmente qualificado `node.example.local`, adicione a seguinte linha ao arquivo de configuração do serviço NRPE:

```
command[check_wallarm_nginx_abnormal]=/usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n wallarm_nginx/gauge-abnormal -H node.example.local
```


!!! info "Como definir valores de limiar para uma métrica"
    Se necessário, você pode especificar um intervalo de valores para os quais a utilidade `collectd-nagios` retornará o status `WARNING` ou `CRITICAL` usando as opções `-w` e `-c` correspondentes (informações detalhadas estão disponíveis na [documentação][link-collectd-docs] da utilidade).


Depois de adicionar todos os comandos necessários ao arquivo de configuração do serviço NRPE, reinicie o serviço executando o comando apropriado:

--8<-- "../include-pt-BR/monitoring/nrpe-restart-2.16.md"

### 8.  No Host do Nagios, Use os Arquivos de Configuração para Especificar o Host do Nó de Filtro e para Definir os Serviços a Monitorar


!!! info "Serviços e Métricas"
    Este documento presume que um serviço do Nagios é equivalente a uma métrica.


Por exemplo, isso pode ser feito da seguinte forma:
1.  Crie um arquivo `/usr/local/nagios/etc/objects/nodes.cfg` com o seguinte conteúdo:
    
    ```
    define host{
     use linux-server
     host_name node.example.local
     address 10.0.30.5
    }

    define service {
      use generic-service
      host_name node.example.local
      check_command check_nrpe!check_wallarm_nginx_abnormal
      max_check_attempts 5
      service_description wallarm_nginx_abnormal
    }
    ```

    Este arquivo define o host `node.example.local` com o endereço IP `10.0.30.5` e o comando para verificar o status do serviço `wallarm_nginx_abnormal`, que significa receber a métrica `wallarm_nginx/gauge-abnormal` do nó de filtro (veja a descrição do comando [`check_wallarm_nginx_abnormal`][anchor-header-7]).

2.  Adicione a seguinte linha ao arquivo de configuração do Nagios (por padrão, `/usr/local/nagios/etc/nagios.cfg`):
    
    ```
    cfg_file=/usr/local/nagios/etc/objects/nodes.cfg
    ```
    
    Isso é necessário para que o Nagios comece a usar os dados do arquivo `nodes.cfg` na próxima inicialização.

3.  Reinicie o serviço Nagios executando o comando apropriado:

--8<-- "../include-pt-BR/monitoring/nagios-restart-2.16.md"

## Configuração Está Completa

O Nagios agora está monitorando o serviço associado à métrica específica do nó de filtro. Se necessário, você pode definir outros comandos e serviços para verificar as métricas de seu interesse.


!!! info "Informações sobre o NRPE"
    Fontes de informações adicionais sobre o NRPE:
    
    *   [README][link-nrpe-readme] do NRPE no GitHub;
    *   Documentação do NRPE ([PDF][link-nrpe-pdf]).
