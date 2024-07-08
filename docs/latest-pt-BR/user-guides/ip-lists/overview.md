# Tipos e lógica principal de listas de IP

Na seção **Listas de IP** do Console Wallarm, você pode controlar o acesso aos seus aplicativos ao permitir, negar e incluir em listas cinzas os endereços IP.

* **Lista de permissões** é uma lista de endereços IP confiáveis que têm permissão para acessar seus aplicativos mesmo que as solicitações originadas por eles contenham sinais de ataque.
* **Lista de bloqueios** é uma lista de endereços IP que não têm permissão para acessar seus aplicativos. O nó de filtragem bloqueia todas as solicitações originadas a partir de endereços IP na lista de bloqueios.
* **Lista cinza** é uma lista de endereços IP que têm permissão para acessar seus aplicativos apenas se as solicitações originadas por eles não contiverem sinais de ataque.

![Todas as listas de IP](../../images/user-guides/ip-lists/ip-lists-home-apps.png)

## Algoritmo de processamento de listas de IP

O nó de filtragem emprega diferentes abordagens com base no [modo](../../admin-en/configure-wallarm-mode.md) de operação selecionado para analisar as listas de IP. Em certos modos, ele avalia todos os três tipos de listas de IP, ou seja, listas de permissões, listas de bloqueios e listas cinzas. No entanto, em outros modos, concentra-se apenas em listas de IP específicas.

A imagem fornecida abaixo representa visualmente as prioridades e combinações de listas de IP em cada modo de operação, destacando quais listas são consideradas em cada caso:

![Prioridades da lista de IP](../../images/user-guides/ip-lists/ip-lists-priorities.png)

## Configuração de listas de IP

Para configurar listas de IP:

1. Se o nó Wallarm estiver localizado atrás de um balanceador de carga ou CDN, certifique-se de configurar seu nó Wallarm para relatar corretamente os endereços IP dos usuários finais:

    * [Instruções para nós Wallarm baseados em NGINX](../../admin-en/using-proxy-or-balancer-en.md) (incluindo imagens AWS / GCP e contêiner de nó Docker)
    * [Instruções para os nós de filtragem implantados como o controlador Wallarm Kubernetes Ingress](../../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)
2. Adicione fontes de solicitação às listas de IP:

    * [Lista de permissões](allowlist.md)
    * [Lista de bloqueios](denylist.md)
    * [Lista cinza](graylist.md)

!!! Aviso "Usando instalações adicionais de filtragem de tráfego"
    Observe que, se você usa instalações adicionais (software ou hardware) para filtrar e bloquear automaticamente o tráfego, recomenda-se que você configure uma lista de permissões com os endereços IP para o [Scanner Wallarm](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner). Isso permitirá que os componentes Wallarm digitalizem sem problemas seus recursos em busca de vulnerabilidades.

    * [Endereço IP do scanner registrado na Wallarm US Cloud](../../admin-en/scanner-addresses.md)
    * [Endereço IP do scanner registrado na Wallarm EU Cloud](../../admin-en/scanner-addresses.md)