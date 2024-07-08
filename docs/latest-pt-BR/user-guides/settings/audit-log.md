# Registro de atividades do usuário

Na guia **Configurações** → **Registro de atividades** do Console Wallarm, você pode verificar o histórico de ações do usuário no sistema Wallarm. Os registros incluem informações sobre a criação, atualização e exclusão dos seguintes objetos:

* Endereço IP ou sub-rede a partir dos [ativos expostos](../scanner.md)
* Domínios do perímetro de rede
* Serviços (portas) do perímetro de rede
* Domínios e endereços IP associados do perímetro de rede
* [Autenticação de dois fatores](account.md#enabling-two-factor-authentication)
* [Tokens da API](api-tokens.md)
* [Usuários](users.md)
* Regras de processamento de tráfego [regras](../rules/rules.md)
* [Backups de conjunto de regras personalizado](../rules/rules.md)
* [Nós do Wallarm](../nodes/nodes.md)
* [Nós da CDN](../nodes/cdn-node.md)
* [Gatilhos](../triggers/triggers.md)
* [Integrações](integrations/integrations-intro.md)
* [Endereço IP bloqueado](../ip-lists/denylist.md)
* [Amostragem de acertos](../events/analyze-attack.md#sampling-of-hits)

Os registros também incluem informações sobre as seguintes ações e objetos:

* [Vulnerabilidade marcada como falso positivo](../vulnerabilities.md#marking-vulnerabilities-as-false-positives)
* [Ataque reexaminado](../events/verify-attack.md)

![Registro de atividades](../../images/user-guides/settings/audit-log.png)

**Para filtrar os registros de atividades**, você pode usar os seguintes parâmetros:

* Dados sensíveis ao maiúsculas e minúsculas sobre o usuário que realizou a ação

      Se a ação foi realizada pela equipe de suporte técnico da Wallarm, o nome de usuário é `Suporte técnico`. Esse valor não pode ser usado para classificar os registros de atividades.
* Tipo de ação
* Nome do objeto em que a ação foi realizada
* Data em que a ação foi realizada