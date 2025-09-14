| Parametre | Açıklama |
| --------- | ----------- |
| `X-WallarmApi-Token` | [Wallarm API'ye erişim][access-wallarm-api-docs] için token, Wallarm Console → **Settings** → **API tokens** bölümünden kopyalayın. |
| `clientid` | IP listesini doldurmak/okumak için Wallarm Cloud'daki bir hesabın kimliği. |
| `ip_rule.list` | Nesnelerin ekleneceği IP liste türü; şunlar olabilir: `black` (engelleme listesi), `white` (izin listesi), `gray` (gri liste). |
| `ip_rule.rule_type` | Listeye eklenecek nesnelerin türü:<ul><li>`ip_range` belirli IP'ler veya alt ağlar ekleniyorsa</li><li>`country` ülkeler veya bölgeler ekleniyorsa</li><li>`proxy_type` proxy servisleri ekleniyorsa (`VPN`, `SES`, `PUB`, `WEB`, `TOR`)</li><li>`datacenter` diğer kaynak türleri için (`rackspace`, `tencent`, `plusserver`, `ovh`, `oracle`, `linode`, `ibm`, `huawei`, `hetzner`, `gce`, `azure`, `aws`, `alibaba`)</li></ul> |
| `ip_rule.subnet`<br>(`rule_type:"ip_range"`) | Listeye eklenecek IP veya alt ağ, ör. `"1.1.1.1"`. |
| `ip_rule.source_values`<br>(diğer `rule_type` değerleri için) | Seçeneklerden biri:<ul><li>Eğer `rule_type:"country"` ise - [ISO-3166 biçiminde](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes) ülke dizisi, ör. `["AX","AL"]`.</li><li>Eğer `rule_type:"proxy_type"` ise - proxy servisleri dizisi, ör. `["VPN","PUB"]`.</li><li>Eğer `rule_type:"datacenter"` ise - diğer kaynak türleri dizisi, ör. `["rackspace","huawei"]`.</li></ul> |
| `ip_rule.pools` | IP'ler için erişime izin vermek ya da kısıtlamak amacıyla [uygulama kimlikleri][application-docs] dizisi, ör. 3 ve 4 numaralı uygulamalar için `[3,4]` veya tüm uygulamalar için `[0]`. |
| `ip_rule.expired_at` | IP'lerin listeden kaldırılacağı [Unix Timestamp](https://www.unixtimestamp.com/) tarihi. Maksimum değer süresizdir (`33223139044`). |
| `reason` | IP’ler için erişime izin verme veya kısıtlama gerekçesi. |
| `force` | `true` ise ve istekte belirtilen bazı nesneler IP listesinde zaten varsa, betik bunların üzerine yazar. |