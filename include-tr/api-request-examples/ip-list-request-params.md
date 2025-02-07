| Parameter | Açıklama |
| --------- | ----------- |
| `X-WallarmApi-Token` | [Wallarm API'ye erişim sağlamak için][access-wallarm-api-docs] kullanılan token, Wallarm Console → **Settings** → **API tokens** üzerinden kopyalayın. |
| `clientid` | IP listesini doldurmak/okumak için Wallarm Cloud'daki bir hesabın ID'si. |
| `ip_rule.list` | Nesneleri eklemek için IP listesi tipi, seçenekler: `black` (yasaklama listesi için), `white` (izin listesi için), `gray` (gri liste için). |
| `ip_rule.rule_type` | Listeye eklenecek nesnelerin tipi:<ul><li>`ip_range` – belirli IP'ler veya alt ağlar ekleniyorsa</li><li>`country` – ülkeler veya bölgeler ekleniyorsa</li><li>`proxy_type` – proxy servisleri ekleniyorsa (`VPN`, `SES`, `PUB`, `WEB`, `TOR`)</li><li>`datacenter` – diğer kaynak tipleri için (`rackspace`, `tencent`, `plusserver`, `ovh`, `oracle`, `linode`, `ibm`, `huawei`, `hetzner`, `gce`, `azure`, `aws`, `alibaba`)</li></ul> |
| `ip_rule.subnet`<br>(`rule_type:"ip_range"`) | Listeye eklenecek IP veya alt ağ, örn. `"1.1.1.1"`. |
| `ip_rule.source_values`<br>(for other `rule_type` values) | Seçeneklerden biri:<ul><li>Eğer `rule_type:"country"` ise – [ISO-3166 formatında](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes) ülkeler dizisi, örn. `["AX","AL"]`.</li><li>Eğer `rule_type:"proxy_type"` ise – proxy servisleri dizisi, örn. `["VPN","PUB"]`.</li><li>Eğer `rule_type:"datacenter"` ise – diğer kaynak tiplerinden oluşan dizi, örn. `["rackspace","huawei"]`.</li></ul> |
| `ip_rule.pools` | IP'lere erişimi izin vermek veya sınırlamak için [application IDs][application-docs] dizisi, örn. uygulama ID'leri 3 ve 4 için `[3,4]` veya tüm uygulamalar için `[0]`. |
| `ip_rule.expired_at` | IP'lerin listeden kaldırılacağı [Unix Timestamp](https://www.unixtimestamp.com/) tarihi. Maksimum değer sonsuza dek anlamına gelen (`33223139044`). |
| `reason` | IP'lere erişimin izin verilmesi veya kısıtlanması nedeni. |
| `force` | Eğer `true` ise ve istekte belirtilen bazı nesneler zaten IP listesinde mevcutsa, script bunların üzerine yazacaktır. |