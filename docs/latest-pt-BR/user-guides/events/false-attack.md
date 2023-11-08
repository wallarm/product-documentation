[link-analyzing-attacks]:       analyze-attack.md

[img-false-attack]:             ../../images/user-guides/events/false-attack.png
[img-removed-attack-info]:      ../../images/user-guides/events/removed-attack-info.png


# Trabalhando com falsos ataques

**Falso positivo** ocorre quando sinais de ataque são detectados em uma solicitação legítima. Após analisar um ataque, você pode concluir que todas ou algumas solicitações neste ataque são falsos positivos. Para evitar que o nó de filtragem reconheça essas solicitações como ataques nas futuras análises de tráfego, você pode marcar várias solicitações ou todo o ataque como falso positivo.

## Como funciona a marca de falso positivo?

* Se uma marca de falso positivo for adicionada ao ataque de um tipo diferente de [Exposição de Informações](../../attacks-vulns-list.md#information-exposure), a regra que desativa a análise das mesmas solicitações para sinais de ataque detectados ([tokens](../../about-wallarm/protecting-against-attacks.md#library-libproton)) é automaticamente criada.
* Se uma marca de falso positivo for adicionada ao incidente com o tipo de ataque [Exposição de Informações](../../attacks-vulns-list.md#information-exposure), a regra que desativa a análise das mesmas solicitações para [sinais de vulnerabilidade](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-detection-methods) detectados é automaticamente criada.

A regra criada é aplicada ao analisar as solicitações ao aplicativo protegido. Essa regra não é exibida no Console da Wallarm e só pode ser alterada ou removida por meio de uma solicitação enviada ao [suporte técnico da Wallarm](mailto: support@wallarm.com).

## Marcar um hit como um falso positivo

Para marcar uma solicitação (hit) como falso positivo:

1. No Console da Wallarm → **Events**, expanda a lista de solicitações no ataque considerado um falso positivo.

    Para reduzir o tempo de análise da solicitação, você pode ocultar as solicitações que são precisamente maliciosas usando a [tag `!known`](../search-and-filters/use-search.md#search-by-known-attacks-cve-and-wellknown-exploits).
2. Defina uma solicitação válida e clique em **Falso** na coluna **Actions**.

    ![Hit Falso][img-false-attack]

## Marcar um ataque como falso positivo

Para marcar todas as solicitações (hits) no ataque como falsos positivos:

1. No Console da Wallarm → **Events**, selecione um ataque com solicitações válidas.

    Para reduzir o tempo de análise da solicitação, você pode ocultar as solicitações que são precisamente maliciosas usando a [tag `!known`](../search-and-filters/use-search.md#search-by-known-attacks-cve-and-wellknown-exploits).
2. Clique em **Marcar como positivo falso**.

    ![False attack](../../images/user-guides/events/analyze-attack.png)

!!! Aviso "Se um ataque for hits agrupados por IPs"
    Se um ataque consistir em hits [agrupados](../../about-wallarm/protecting-against-attacks.md#attack) por endereços IP, o botão **Marcar como falso positivo** não estará disponível. Você pode [marcar certos hits](#mark-a-hit-as-a-false-positive) como positivos falsos.

Se todas as solicitações do ataque forem marcadas como positivas falsas, as informações sobre esse ataque serão assim:

![Todo o ataque é marcado como falso][img-removed-attack-info]

## Remover uma marca de falso positivo

Para remover uma marca de falso positivo do hit ou ataque, envie uma solicitação ao [suporte técnico da Wallarm](mailto: support@wallarm.com). Além disso, você pode desfazer uma marca positiva falsa na caixa de diálogo no Console Wallarm em poucos segundos após a aplicação da marca.

## Exibindo falsos positivos na lista de ataques

O Console da Wallarm permite controlar a exibição de falsos positivos na lista de ataques por meio de um filtro separado. Existem as seguintes opções de filtro:

* **Visualização padrão**: apenas ataques reais
* **Com falsos positivos**: ataques reais e falsos positivos
* **Somente falsos positivos**

![Filtro positivo falso](../../images/user-guides/events/filter-for-falsepositive.png)
