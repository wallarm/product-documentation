| Parametre | Açıklama |
| --------- | ----------- |
| `X-WallarmApi-Token` | Wallarm API'ye [erişim için token][access-wallarm-api-docs], kopyalayın Wallarm Console → **Ayarlar** → **API tokenleri**. |
| `clientid` | IP listesini doldurmak/okumak için Wallarm Cloud'daki bir hesabın kimliği. |
| `ip_rule.list` | Eklenecek nesnelerin IP listesi türü, olabilir: `black` (red listesi için), `white` (izin verme listesi için), `gray` (gri liste için). |
| `ip_rule.rule_type` | Listeye eklenecek nesne türü:<ul><li>`ip_range` belirli IP'ler veya alt ağlar ekleniyorsa</li><li>`country` ülkeler veya bölgeler ekleniyorsa</li><li>`proxy_type` eğer proxy hizmetleri ekleniyorsa (`VPN`, `SES`, `PUB`, `WEB`, `TOR`)</li><li>`datacenter` diğer kaynak türleri için (`rackspace`, `tencent`, `plusserver`, `ovh`, `oracle`, `linode`, `ibm`, `huawei`, `hetzner`, `gce`, `azure`, `aws`, `alibaba`)</li></ul> |
| `ip_rule.subnet`<br>(`rule_type:"ip_range"` için) | Listeye eklenecek IP veya alt ağ, ör. `"1.1.1.1"`. |
| `ip_rule.source_values`<br>(diğer `rule_type` değerleri için) | Seçeneklerden biri:<ul><li>Eğer `rule_type:"country"` - ülkelerin dizisi [ISO-3166 formatında](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes), ör. `["AX","AL"]`.</li><li>Eğer `rule_type:"proxy_type"` - proxy hizmetlerinin dizisi, ör. `["VPN","PUB"]`.</li><li>Eğer `rule_type:"datacenter"` - diğer kaynak türlerinin dizisi, ör. `["rackspace","huawei"]`.</li></ul> |
| `ip_rule.pools` | IP'lerin erişimine izin verme veya erişimini kısıtlama için [uygulama ID'leri][application-docs] dizisi, ör. `[3,4]` uygulamaların 3 ve 4 ID'leri için veya `[0]` bütün uygulamalar için. |
| `ip_rule.expired_at` | IP'lerin listeden kaldırılması için [Unix Timestamp](https://www.unixtimestamp.com/) tarihi. Maksimum değer sonsuzdur (`33223139044`). |
| `reason` | IP'lerin erişimine izin verme veya erişimini kısıtlama nedeni. |
| `force` | Eğer `true` ve talepte belirtilen bazı nesneler zaten IP listesindeyse, script onları üzerine yazar. |