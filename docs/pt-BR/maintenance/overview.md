# Manutenção

Esta seção fornece orientações abrangentes sobre manutenção, monitoramento e atualização de sua implantação do Wallarm para garantir desempenho e segurança ideais.

## O que está incluído

* **Nós e Infraestrutura**
    * [Visão geral dos nós](../user-guides/nodes/nodes.md) - Gerenciar e monitorar seus nós Wallarm
    * [Alocação de recursos](../admin-en/configuration-guides/allocate-resources-for-node.md) - Configurar recursos de CPU e memória
    * [Sincronização na nuvem](../admin-en/configure-cloud-node-synchronization-en.md) - Configurar sincronização de nós com Wallarm Cloud
    * [Configuração de proxy](../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md) - Configurar proxy para acesso à API Wallarm
    * [Configuração da página de bloqueio](../admin-en/configuration-guides/configure-block-page-and-code.md) - Personalizar páginas de bloqueio e códigos de resposta
    * [Tratamento de cabeçalhos inválidos](../admin-en/configuration-guides/handling-invalid-headers.md) - Configurar comportamento para cabeçalhos HTTP inválidos
    * [Impressão digital JA3](../admin-en/enabling-ja3.md) - Habilitar impressão digital TLS para segurança aprimorada
    * [Provedor Terraform](../admin-en/managing/terraform-provider.md) - Gerenciar infraestrutura Wallarm como código

* **Monitoramento e Métricas**
    * **Métricas de Nó NGINX**
        * [Visão Geral](../admin-en/monitoring/intro.md) - Introdução ao sistema de coleta de métricas
        * [Como Buscar Métricas](../admin-en/monitoring/fetching-metrics.md) - Métodos para recuperar métricas de nó
        * [Métricas Disponíveis](../admin-en/monitoring/available-metrics.md) - Lista completa de métricas disponíveis
        * **Exemplos de Exportação e Trabalho com Métricas**
            * **Grafana**
                * [Exportando Métricas para InfluxDB via Plugin de Rede collectd](../admin-en/monitoring/network-plugin-influxdb.md) - Usando plugin de rede collectd
                * [Exportando Métricas para Graphite via Plugin de Escrita collectd](../admin-en/monitoring/write-plugin-graphite.md) - Usando plugin de escrita collectd
                * [Trabalhando com Métricas do Nó de Filtro no Grafana](../admin-en/monitoring/working-with-grafana.md) - Visualizar métricas de nó
            * **Nagios**
                * [Exportando Métricas para Nagios via Utilitário collectd-nagios](../admin-en/monitoring/collectd-nagios.md) - Usando utilitário collectd-nagios
                * [Trabalhando com Métricas do Nó de Filtro no Nagios](../admin-en/monitoring/working-with-nagios.md) - Monitorar métricas de nó
            * **Zabbix**
                * [Exportando Métricas para Zabbix via Utilitário collectd-nagios](../admin-en/monitoring/collectd-zabbix.md) - Usando utilitário collectd-nagios
                * [Trabalhando com o Nó de Filtro no Zabbix](../admin-en/monitoring/working-with-zabbix.md) - Monitorar métricas de nó
    * [Serviço de Estatísticas](../admin-en/configure-statistics-service.md) - Configurar coleta de estatísticas
    * [Registro de Nó](../admin-en/configure-logging.md) - Configurar níveis de log e saída
    * [Configuração de Failover](../admin-en/configure-backup-en.md) - Configurar mecanismos de failover
    * [Verificação de Saúde](../admin-en/uat-checklist-en.md) - Verificar integridade e funcionalidade do nó

* **Atualizações e migração**
    * [Política de versionamento](../updating-migrating/versioning-policy.md) - Entender o versionamento e ciclo de vida de suporte do Wallarm
    * [Recomendações gerais](../updating-migrating/general-recommendations.md) - Melhores práticas para atualizações
    * [O que há de novo](../updating-migrating/what-is-new.md) - Principais mudanças e guia de migração para novas versões
    * **Changelogs**
        * [Changelog do nó NGINX](../updating-migrating/node-artifact-versions.md) - Notas de versão para nós baseados em NGINX
        * [Changelog do nó nativo](../updating-migrating/native-node/node-artifact-versions.md) - Notas de versão para nós nativos
        * [Pacote de código do conector](../installation/connectors/code-bundle-inventory.md) - Notas de versão do conector
    * **Atualizações de nó NGINX**
        * [Pacotes DEB/RPM](../updating-migrating/nginx-modules.md)
        * [Módulo Postanalytics](../updating-migrating/separate-postanalytics.md)
        * [Instalador tudo-em-um](../updating-migrating/all-in-one.md)
        * [Imagem Docker](../updating-migrating/docker-container.md)
        * [Controlador Ingress](../updating-migrating/ingress-controller.md)
        * [Aposentadoria do controlador Ingress](../updating-migrating/nginx-ingress-retirement.md)
        * [Proxy Sidecar](../updating-migrating/sidecar-proxy.md)
        * [Imagem em nuvem](../updating-migrating/cloud-image.md)
        * [Nó multilocatário](../updating-migrating/multi-tenant.md)
    * **Atualizações de nó nativo**
        * [Instalador tudo-em-um](../updating-migrating/native-node/all-in-one.md)
        * [Gráfico Helm](../updating-migrating/native-node/helm-chart.md)
        * [Imagem Docker](../updating-migrating/native-node/docker-image.md)

* **Operações**
    * [Volume de solicitações de aprendizado](../admin-en/operation/learn-incoming-request-number.md) - Determinar volume de solicitações de API para faturamento e planejamento de capacidade
    * [Endereços IP do scanner](../admin-en/scanner-addresses.md) - Endereços IP do scanner Wallarm para lista de permissões

* **Solução de problemas**
    * [Visão geral](../troubleshooting/overview.md) - Orientação geral de solução de problemas
    * [Detecção e bloqueio](../troubleshooting/detection-and-blocking.md) - Solucionar problemas de detecção de ataques
    * [Ferramentas de detecção](../troubleshooting/detection-tools-tuning.md) - Ajustar mecanismos de detecção
    * [Desempenho](../troubleshooting/performance.md) - Resolver problemas de desempenho
    * [IP real do cliente](../admin-en/using-proxy-or-balancer-en.md) - Configurar detecção correta de IP do cliente
    * [Problemas do usuário final](../faq/common-errors-after-installation.md) - Erros comuns pós-instalação
    * [Controlador Ingress Wallarm](../faq/ingress-installation.md) - Problemas específicos do Ingress
    * [Wallarm Cloud está inativo](../faq/wallarm-cloud-down.md) - Lidar com indisponibilidade da nuvem
    * [Alertas do painel OWASP](../faq/node-issues-on-owasp-dashboards.md) - Resolver alertas do painel
    * [Log de erros NGINX](../troubleshooting/wallarm-issues-in-nginx-error-log.md) - Interpretar mensagens de erro NGINX
    * [DNS dinâmico no NGINX](../admin-en/configure-dynamic-dns-resolution-nginx.md) - Configurar resolução de DNS dinâmico
