| Comportamento do nó Wallarm | `off` | `monitoring` | `safe_blocking` |`block` |
| -------- | - | - | - | -|
| Analisa se as solicitações recebidas contêm cargas úteis maliciosas dos seguintes tipos: [ataques de validação de entrada](../about-wallarm/protecting-against-attacks.md#input-validation-attacks), [ataques vpatch](../user-guides/rules/vpatch-rule.md), ou [ataques detectados com base em expressões regulares](../user-guides/rules/regex-rule.md) | - | + | + | + |
| Envia solicitações maliciosas para o Wallarm Cloud para que sejam exibidas na lista de eventos | - | + | + | + |
| Bloqueia solicitações maliciosas | - | - | Somente aquelas originadas de [IPs na lista cinza](../user-guides/ip-lists/graylist.md) | + |
| Bloqueia solicitações originadas de [IPs na lista negra](../user-guides/ip-lists/denylist.md)<sup>veja exceções</sup> | Não analisa a lista negra | - | + | + |
| Bloqueia solicitações originadas de [IPs na lista cinza](../user-guides/ip-lists/graylist.md) | Não analisa a lista cinza | - | Apenas aquelas contendo cargas úteis maliciosas | Não analisa a lista cinza |
| Permite solicitações originadas de [IPs na lista branca](../user-guides/ip-lists/allowlist.md) | Não analisa a lista branca | + | + | + |

!!! aviso "Exceções"
   Se [`wallarm_acl_access_phase on`][acl-access-phase], as solicitações dos IPs na lista negra são bloqueadas em qualquer modo, incluindo `off` e `monitoring`