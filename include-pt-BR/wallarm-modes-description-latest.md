| Comportamento do nó Wallarm | `off` | `monitoramento` | `bloqueio_seguro` |`bloquear` |
| -------- | - | - | - | -|
| Analisa se as solicitações de entrada contêm cargas maliciosas dos seguintes tipos: [ataques de validação de entrada](../about-wallarm/protecting-against-attacks.md#input-validation-attacks), [ataques vpatch](../user-guides/rules/vpatch-rule.md), ou [ataques detectados com base em expressões regulares](../user-guides/rules/regex-rule.md) | - | + | + | + |
| Envia solicitações maliciosas para a Nuvem Wallarm para que sejam exibidas na lista de eventos | - | + | + | + |
| Bloqueia solicitações maliciosas | - | - | Apenas aquelas originadas de [IPs na lista cinza](../user-guides/ip-lists/graylist.md) | + |
| Bloqueia solicitações originadas de [IPs na lista de negação](../user-guides/ip-lists/denylist.md)<sup>veja exceções</sup> | + | + | + | + |
| Bloqueia solicitações originadas de [IPs na lista cinza](../user-guides/ip-lists/graylist.md) | Não analisa a lista cinza | - | Apenas aquelas contendo cargas maliciosas | Não analisa a lista cinza |
| Permite solicitações originadas de [IPs na lista de permissão](../user-guides/ip-lists/allowlist.md) | + | + | + | + |

!!! aviso "Exceções"
    Se [`wallarm_acl_access_phase off`][acl-access-phase], o nó Wallarm não analisa a lista de negação no modo `off` e não bloqueia solicitações de IPs na lista de negação no modo `monitoramento`.