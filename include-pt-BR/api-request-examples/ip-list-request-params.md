| Parâmetro | Descrição |
| --------- | ----------- |
| `X-WallarmApi-Token` | Token para [acessar API Wallarm][access-wallarm-api-docs], copie-o do Wallarm Console → **Configurações** → **Tokens de API**. |
| `clientid` | ID de uma conta no Wallarm Cloud para preencher/ler a lista de IPs.
| `ip_rule.list` | O tipo de lista de IPs para adicionar objetos, pode ser: `black` (para a lista de negação), `white` (para a lista de permissões), `gray` (para a lista cinza). |
| `ip_rule.rule_type` | O tipo de objetos a adicionar à lista:<ul><li>`ip_range` se estiver adicionando IPs ou sub-redes específicas</li><li>`country` se estiver adicionando países ou regiões</li><li>`proxy_type` se estiver adicionando serviços proxy (`VPN`, `SES`, `PUB`, `WEB`, `TOR`)</li><li>`datacenter` para outros tipos de fontes (`rackspace`, `tencent`, `plusserver`, `ovh`, `oracle`, `linode`, `ibm`, `huawei`, `hetzner`, `gce`, `azure`, `aws`, `alibaba`)</li></ul> |
| `ip_rule.subnet`<br>(`rule_type:"ip_range"`) | IP ou sub-rede para adicionar à lista, por exemplo, `"1.1.1.1"`. |
| `ip_rule.source_values`<br>(para outros valores `rule_type`) | Uma das opções:<ul><li>Se `rule_type:"country"` - array de países no [formato ISO-3166](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes), por exemplo, `["AX","AL"]`.</li><li>Se `rule_type:"proxy_type"` - array de serviços proxy, por exemplo, `["VPN","PUB"]`.</li><li>Se `rule_type:"datacenter"` - array de outros tipos de fontes, por exemplo, `["rackspace","huawei"]`.</li></ul> |
| `ip_rule.pools` | Array de [IDs de aplicações][application-docs] para permitir ou restringir o acesso para IPs, por exemplo, `[3,4]` para IDs de aplicações 3 e 4 ou `[0]` para todas as aplicações.
| `ip_rule.expired_at` | Data do [Unix Timestamp](https://www.unixtimestamp.com/) para remover os IPs da lista. O valor máximo é para sempre (`33223139044`). |
| `reason` | Motivo para permitir ou restringir o acesso para IPs.
| `force` | Se `true` e alguns objetos especificados na solicitação já estão na lista de IPs, o script sobrescreverá-os. |
