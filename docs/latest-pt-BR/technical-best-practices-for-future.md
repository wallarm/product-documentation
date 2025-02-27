# Melhores práticas para implantação e manutenção da solução Wallarm

Este artigo formula as melhores práticas para implantação e manutenção da solução Wallarm.


## Implante os nós de filtragem não apenas no ambiente de produção, mas também em testes e preparação - melhores práticas técnicas

A maioria dos contratos de serviço da Wallarm não limita o número de nós da Wallarm implantados pelo cliente, por isso não há motivo para não implantar os nós de filtragem em todos os seus ambientes, incluindo desenvolvimento, teste, preparação, etc.

Ao implantar e usar os nós de filtragem em todas as etapas de suas atividades de desenvolvimento de software e/ou operação de serviço, você tem uma chance melhor de testar adequadamente todo o fluxo de dados e minimizar o risco de quaisquer situações inesperadas em seu ambiente de produção crítico.

## Configure o relatório adequado de endereços IP do usuário final - melhores práticas técnicas, além disso, deve haver um link para isso em cada instrução de implantação

Para os nós de filtragem da Wallarm localizados atrás de um balanceador de carga ou CDN, certifique-se de configurar seus nós de filtragem para relatar adequadamente os endereços IP do usuário final (caso contrário, a [funcionalidade da lista de IP](../user-guides/ip-lists/overview.md), [Verificação de ameaça ativa](detecting-vulnerabilities.md#active-threat-verification), e alguns outros recursos não funcionarão):

* [Instruções para nós Wallarm baseados em NGINX](../admin-en/using-proxy-or-balancer-en.md) (incluindo imagens AWS / GCP e recipiente de nó Docker)
* [Instruções para os nós de filtragem implantados como o controlador de Ingress da Wallarm no Kubernetes](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)

## Ative o monitoramento adequado dos nós de filtragem - mover para a instrução de monitoramento e melhores práticas técnicas

É altamente recomendável ativar o monitoramento adequado dos nós de filtragem da Wallarm.

O método para configurar o monitoramento do nó de filtragem depende de sua opção de implantação:

* [Instruções para os nós de filtragem implantados como o controlador de Ingress da Wallarm no Kubernetes](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md)
* [Instruções para a imagem Docker baseada em NGINX](../admin-en/installation-docker-en.md#monitoring-configuration)

## Implemente a redundância adequada e funcionalidade de failover automático

Como com todos os outros componentes críticos em seu ambiente de produção, os nós da Wallarm devem ser arquitetados, implantados e operados com o nível adequado de redundância e failover automático. Você deve ter **pelo menos dois nós de filtragem Wallarm ativos** lidando com solicitações críticas do usuário final. Os seguintes artigos fornecem informações relevantes sobre o tópico:

* [Instruções para nós Wallarm baseados em NGINX](../admin-en/configure-backup-en.md) (incluindo imagens AWS / GCP, recipiente de nó Docker e sidecars Kubernetes)
* [Instruções para os nós de filtragem implantados como o controlador de Ingress da Wallarm no Kubernetes](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/high-availability-considerations.md)
