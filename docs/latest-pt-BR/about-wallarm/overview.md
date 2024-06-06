# Visão geral da plataforma Wallarm

A plataforma Wallarm é especialmente adequada para proteger suas aplicações em nuvem e APIs. Sua arquitetura híbrida protege seus recursos ao oferecer:

* [Proteção contra ataques de hackers](protecting-against-attacks.md) com falsos positivos ultra baixos
* [Proteção contra bots que realizam abuso de API](../api-abuse-prevention/overview.md)
* [Descoberta de API](api-discovery.md)
* [Detecção automática de vulnerabilidades](detecting-vulnerabilities.md)

A Wallarm consiste nos seguintes componentes principais:

* O nó de filtragem Wallarm
* A Nuvem Wallarm

## Nó de Filtragem

O nó de filtragem Wallarm faz o seguinte:

* Analisa todo o tráfego de rede da empresa e mitiga solicitações maliciosas
* Coleta as métricas de tráfego da rede e carrega as métricas na Nuvem Wallarm
* Baixa as regras de segurança específicas do recurso que você definiu na Nuvem Wallarm e as aplica durante a análise de tráfego

Você implanta o nó de filtragem Wallarm em uma infraestrutura de rede por uma das [opções de implantação suportadas](../installation/supported-deployment-options.md).

## Nuvem

A Nuvem Wallarm faz o seguinte:

* Processa as métricas que o nó de filtragem carrega
* Compila regras de segurança personalizadas específicas do recurso
* Varre os ativos expostos da empresa para detectar vulnerabilidades
* Constrói a estrutura da API com base nas métricas de tráfego recebidas do nó de filtragem

A Wallarm administra instâncias de nuvem [americana](#us-cloud) e [europeia](#eu-cloud), com cada Cloud sendo completamente separada em termos de bancos de dados, endpoints de API, contas de cliente, etc. Um cliente registrado em uma Nuvem Wallarm não pode usar outra Nuvem Wallarm para gerenciar ou obter acesso aos seus dados armazenados na primeira Nuvem.

Ao mesmo tempo, você pode usar ambas as Nuvens Wallarm. Neste caso, você precisará usar contas diferentes na Wallarm Console e endpoints da API para acessar e gerenciar suas informações nas Nuvens individuais.

Os endpoints para as Nuvens Wallarm são fornecidos abaixo.

### Nuvem dos EUA

Localizada fisicamente nos EUA.

* https://us1.my.wallarm.com/ para criar conta Wallarm
* `https://us1.api.wallarm.com/` para chamar métodos API

### Nuvem da UE

Localizada fisicamente na Holanda.

* https://my.wallarm.com/ para criar conta Wallarm
* `https://api.wallarm.com/` para chamar métodos API
