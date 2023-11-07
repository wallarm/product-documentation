| Comportamento do nó Wallarm | `off` | `monitoramento` | `bloqueio_seguro` |`bloquear` |
| -------- | - | - | - | -|
| Analisa se as solicitações recebidas contêm payloads maliciosos dos seguintes tipos: [ataques de validação de entrada](../about-wallarm/protecting-against-attacks.md#input-validation-attacks), [ataques vpatch](../user-guides/rules/vpatch-rule.md), ou [ataques detectados com base em expressões regulares](../user-guides/rules/regex-rule.md) | - | + | + | + |
| Envia solicitações maliciosas para a nuvem Wallarm para que sejam exibidas na lista de eventos | - | + | + | + |
| Bloqueia solicitações maliciosas | - | - | Somente aquelas originadas de [IPs na lista cinza](../user-guides/ip-lists/graylist.md) | + |
| Bloqueia solicitações originadas de [IPs na lista de negação](../user-guides/ip-lists/denylist.md) | Não analisa a lista de negação | - | + | + |
| Bloqueia solicitações originadas de [IPs na lista cinza](../user-guides/ip-lists/graylist.md) | Não analisa a lista cinza | - | Somente aquelas com payloads maliciosos | Não analisa a lista cinza |
| Permite solicitações originadas de [IPs na lista de permissões](../user-guides/ip-lists/allowlist.md) | Não analisa a lista de permissões | + | + | + |