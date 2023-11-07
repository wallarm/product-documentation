[img-vpatch-example1]:      ../../images/user-guides/rules/vpatch-rule-1.png
[img-vpatch-example2]:      ../../images/user-guides/rules/vpatch-rule-2.png

# Correção Virtual

Uma correção virtual permite bloquear solicitações maliciosas mesmo nos modos de monitoramento e bloqueio seguro ou quando uma solicitação não parece conter nenhum vetor de ataque conhecido. As únicas solicitações que as correções virtuais não bloqueiam são as originadas dos IPs [na lista de permissões](../ip-lists/allowlist.md).

As correções virtuais são especialmente úteis em casos em que é impossível corrigir uma vulnerabilidade crítica no código ou instalar as atualizações de segurança necessárias rapidamente.

Se os tipos de ataque são selecionados, a solicitação será bloqueada somente se o nó de filtro detectar um ataque de um dos tipos listados no parâmetro correspondente.

Se a configuração *Qualquer solicitação* é selecionada, o sistema bloqueará as solicitações com o parâmetro definido, mesmo que ele não contenha um vetor de ataque.

## Criando e aplicando a regra

--8<-- "../include/waf/features/rules/rule-creation-options.md"

## Exemplo: Bloqueando Ataque SQLi no Parâmetro de Consulta `id` 

**Se** as seguintes condições ocorrerem:

* a aplicação está acessível no domínio *example.com*
* o parâmetro *id* da aplicação é vulnerável a ataques de injeção SQL
* o nó de filtro está configurado para o modo de monitoramento
* as tentativas de exploração da vulnerabilidade devem ser bloqueadas

**Então**, para criar uma correção virtual

1. Vá para a guia *Regras*
1. Encontre o ramo `example.com/**/*.*` e clique em *Adicionar regra*
1. Escolha *Criar uma correção virtual*
1. Escolha *SQLi* como o tipo de ataque
1. Selecione o parâmetro *QUERY* e insira seu valor `id` após *nesta parte da solicitação*

    --8<-- "../include/waf/features/rules/request-part-reference.md"

1. Clique em *Criar*

![Correção virtual para um determinado tipo de solicitação][img-vpatch-example1]


## Exemplo: Bloquear Todas as Solicitações Com o Parâmetro de Consulta `refresh` 

**Se** as seguintes condições acontecerem:

* a aplicação está acessível no domínio *example.com*
* a aplicação falha ao processar o parâmetro de consulta `refresh`
* as tentativas de exploração da vulnerabilidade devem ser bloqueadas

**Então**, para criar uma correção virtual

1. Vá para a guia *Regras*
1. Encontre o ramo `example.com/**/*.*` e clique em *Adicionar regra*
1. Escolha *Criar uma correção virtual*
1. Escolha *Qualquer solicitação*
1. Selecione o parâmetro *QUERY* e insira seu valor `refresh` após *nesta parte da solicitação*

    --8<-- "../include/waf/features/rules/request-part-reference.md"

1. Clique em *Criar*

![Correção virtual para qualquer tipo de solicitação][img-vpatch-example2]

## Chamadas API para criar a regra

Para criar a regra de correção virtual, você pode [chamar a API Wallarm diretamente](../../api/overview.md) além de usar o UI do Console Wallarm. Abaixo estão alguns exemplos de chamadas API correspondentes.

**Crie a correção virtual para bloquear todas as solicitações enviadas para `/my/api/*`**

--8<-- "../include/api-request-examples/create-rule-en.md"

**Crie a correção virtual para um ID de instância de aplicativo específico para bloquear todas as solicitações enviadas para `/my/api/*`**

Um aplicativo deve estar [configurado](../settings/applications.md) antes de enviar esta solicitação. Especifique um ID de um aplicativo existente em `action.point[instance].value`.

--8<-- "../include/api-request-examples/create-rule-for-app-id.md"