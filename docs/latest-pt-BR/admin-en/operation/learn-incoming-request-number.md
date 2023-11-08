# Aprendendo o número de solicitações por mês atendidas pela aplicação

Os métodos de licenciamento/faturamento primários da Wallarm são baseados no nível de solicitações atendidas pelos nós de filtragem de Wallarm implantados em seu ambiente. Este documento explica como aprender facilmente o número de solicitações atendidas pela aplicação.

## Equipes que têm acesso à informação

Normalmente, as seguintes equipes em uma empresa podem ter acesso fácil à informação:

* DevOps
* Operações Técnicas
* Operações na Nuvem
* Operações da Plataforma
* DevSecOps
* Administradores do Sistema
* Administradores de Aplicações
* NOC

## Métodos para aprender o número de solicitações

Existem vários métodos para procurar o número de solicitações atendidas pela aplicação:

* Clientes da AWS usando balanceadores de carga ELB ou ALB podem usar métricas de monitoramento da AWS dos balanceadores de carga para estimar o nível de solicitações diárias e semanais para aplicações atendidas pelos balanceadores de carga:

    ![Exemplo de monitoramento da AWS](../../images/operation/aws-requests-example.png)

    Por exemplo, se um gráfico mostra que a média de solicitações por minuto é de 350 e assumindo que há, em média, 730 horas em um mês, então o número de solicitações mensais é `350 * 60 * 730 = 15,330,000`.

* Usuários do GCP de balanceadores de carga HTTP podem usar a métrica de monitoramento **https/request_count**. A métrica não está disponível para Balanceadores de Carga de Rede.
* Usuários do Microsoft IIS podem confiar na métrica **Requests Per Sec** para calcular a média do número de solicitações por segundo e calcular o número de solicitações atendidas por um único servidor IIS por mês. No cálculo, assuma que há, em média, `730 * 3,600` segundos por mês.
* Usuários de serviços de Monitoramento de Performance de Aplicações como New Relic, Datadog, AppDynamics, SignalFX e outros podem obter a informação de suas consoles APM (apenas certifique-se de obter um valor agregado para todos os servidores envolvidos na camada de borda, e não apenas um servidor).
* Usuários de sistemas de monitoramento de infraestrutura baseados em nuvem como Datadog, AWS CloudWatch (e muitos outros) ou usuários de sistemas de monitoramento internos como Prometheus ou Nagios provavelmente já monitoram o nível de solicitações atendidas em sua localização de borda (balanceadores de carga, servidores web, servidores de aplicativos), e podem usar a informação para estimar facilmente a média do número de solicitações atendidas por mês.
* Outra abordagem é usar os logs de balanceadores de carga de borda ou servidores web para contar o número de registros de log em um período de tempo (idealmente - 24 horas) assumindo que há um registro de log por solicitações atendidas. Por exemplo, este servidor web rotaciona o arquivo de log de acesso do NGINX uma vez por dia, com 653.525 solicitações registradas no arquivo de log: 

    ```bash
    cd /var/log/nginx/
    zcat access.log.2.gz |wc -l
    # 653525
    ```

    * A estimativa de solicitações atendidas pelo servidor em um mês é `653,525 * 30 = 19,605,750`.
    * Sabendo o número total de servidores web usados torna possível estimar o número de solicitações atendidas pela aplicação inteira.

* Para aplicações web puras usando Google Analytics ou serviços similares de rastreamento e monitoramento de experiência do usuário, a informação sobre o número de páginas atendidas e todos os objetos embutidos podem ser extraídos dos serviços.