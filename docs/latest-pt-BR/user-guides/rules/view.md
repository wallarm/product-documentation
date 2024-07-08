[img-rules-overview]: ../../images/user-guides/rules/rules-overview.png
[img-view-rules]: ../../images/user-guides/rules/view-rules.png

# Inspeção das regras do perfil da aplicação

Para ver as regras na estrutura da aplicação, vá para a seção **Regras** do Console Wallarm. Esta seção representa ramos e terminações já conhecidos.

![Visão geral da aba Regras][img-rules-overview]

O sistema agrupa automaticamente as regras por ramos, destacando condições comuns e construindo uma estrutura semelhante a uma árvore. Como resultado, um ramo pode ter ramos filhos. Para mostrar ou ocultar ramos aninhados, clique no círculo azul à esquerda da descrição do ramo.

Dois asteriscos `**` na descrição de um ramo referem-se a qualquer número de caminhos aninhados. Por exemplo, o ramo `/**/*.php` conterá tanto `/index.php` como `/app/admin/install.php`.

O tamanho do círculo azul indica a quantidade relativa de ramos aninhados. Sua cor indica a quantidade relativa de regras dentro do ramo e seus sub-ramos. Em cada nível de aninhamento, o tamanho e a cor dos círculos são independentes uns dos outros.

A direita da descrição do ramo, o sistema pode exibir um número laranja, que indica o número de regras naquele ramo (apenas os descendentes diretos, não as regras aninhadas). Se nenhum número for exibido, então aquele ramo é "virtual"&nbsp;— ele é usado apenas para agrupar sub-ramos similares.

Ramos sem regras disponíveis para o usuário (de acordo com o modelo de privilégio) são automaticamente ocultos.


## Exibição de Regra

Em cada ramo, o usuário pode ver a lista de regras anexadas a ele. Para ir para a página com a lista de regras, clique na descrição do ramo correspondente.

![Visualizando regras do ramo][img-view-rules]

As regras dentro de um ramo são agrupadas pelo campo *ponto*. As regras que afetam toda a solicitação, em vez de parâmetros individuais, são agrupadas em uma única linha. Para ver a lista completa, clique na linha.

Para cada regra, o sistema exibe os seguintes parâmetros: última modificação, quantidade, tipos e ponto.

## Regras padrão

Você pode criar regras com ação especificada, mas não vinculadas a nenhum endpoint - elas são chamadas **regras padrão**. Essas regras são aplicadas a todos os endpoints.

* Para criar uma regra padrão, siga o [procedimento padrão](rules.md), mas deixe o URI em branco. A nova regra não vinculada a nenhum endpoint será criada.
* Para ver a lista de regras padrão criadas, clique no botão **Regras padrão**.

!!! info "Regra padrão do modo de filtragem de tráfego"
    Wallarm automaticamente [cria](wallarm-mode-rule.md#default-instance-of-rule) a regra padrão `Definir modo de filtragem` para todos os clientes e define seu valor com base na configuração do [modo de filtragem geral](../../admin-en/configure-wallarm-mode.md#setting-up-the-general-filtration-rule-in-wallarm-console).

Regras padrão são [herdadas](#distinct-and-inherited-rules) por todos os ramos.

## Regras distintas e herdadas

As regras são herdadas ao longo do ramo de regras. Princípios:

* Todos os ramos herdam regras [padrão](#default-rules).
* Em um ramo, os endpoints filhos herdam regras do pai.
* Distinto tem prioridade sobre o herdado.
* Diretamente especificado tem prioridade sobre [regex](rules.md#condition-type-regex).
* Caso [sensível](rules.md#condition-type-equal) tem prioridade sobre [insensível](rules.md#condition-type-iequal-aa).

Aqui estão alguns detalhes de como trabalhar com o ramo de regras:

* Para expandir o endpoint, clique no círculo azul.
* Endpoints que não tem regras distintas estão esmaecidos e não são clicáveis.
    
    ![Ramo de endpoints](../../images/user-guides/rules/rules-branch.png)

* Para ver regras para o endpoint, clique nele. Primeiro, serão exibidas as regras distintas para esse endpoint.
* Ao visualizar a lista de regras para um endpoint específico, clique em **Regras distintas e herdadas** para exibir as herdadas. As regras herdadas serão exibidas junto com as distintas; elas estarão esmaecidas em comparação às distintas.

    ![Regras distintas e herdadas para o endpoint](../../images/user-guides/rules/rules-distinct-and-inherited.png)

## Chamadas de API para obter regras

Para obter regras personalizadas, você pode [chamar a API Wallarm diretamente](../../api/overview.md) além de usar a IU do Console Wallarm. Abaixo estão alguns exemplos de chamadas de API correspondentes.

**Obter todas as regras configuradas**

--8<-- "../include-pt-BR/api-request-examples/get-all-configured-rules.md"

**Obter apenas condições de todas as regras**

--8<-- "../include-pt-BR/api-request-examples/get-conditions.md"

**Obter regras anexadas a uma condição específica**

Para apontar para uma condição específica, use seu ID - você pode obtê-lo ao solicitar condições de todas as regras (veja acima).

--8<-- "../include-pt-BR/api-request-examples/get-rules-by-condition-id.md"