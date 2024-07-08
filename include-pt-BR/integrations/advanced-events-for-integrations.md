* [Hits](../../../glossary-en.md#hit) detectados, com exceção de:

    * Hits experimentais detectados com base na [expressão regular personalizada](../../rules/regex-rule.md). Hits não experimentais acionam notificações.
    * Hits não salvos na [amostra](../../events/analyze-attack.md#sampling-of-hits).

* Relacionados ao sistema:
    * Mudanças de [usuário](../../../user-guides/settings/users.md) (novo criado, excluído, mudança de função)
    * Mudanças de [integração](integrations-intro.md) (desativada, excluída)
    * Mudanças de [aplicação](../../../user-guides/settings/applications.md) (nova criada, excluída, mudança de nome)
* [Vulnerabilidades](../../../glossary-en.md#vulnerability) detectadas, todas por padrão ou apenas para o(s) nível(is) de risco selecionado(s) - alto, médio ou baixo.
* [Regras](../../../user-guides/rules/rules.md) e [gatilhos](../../../user-guides/triggers/triggers.md) alterados (criação, atualização ou exclusão da regra ou gatilho)
* [Escopo (ativos expostos)](../../scanner.md) alterado: atualizações em hosts, serviços e domínios
* De hora em hora, você pode receber uma notificação com o número de solicitações processadas durante a hora anterior