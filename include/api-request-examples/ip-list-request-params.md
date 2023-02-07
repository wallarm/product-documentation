| Parameter | Description |
| --------- | ----------- |
| `WallarmApi-Token` | Token to [access Wallarm API][access-wallarm-api-docs], copy it from Wallarm Console → **Settings** → **API tokens**. |
| `clientid` | ID of an account in Wallarm Cloud to populate/read IP list.
| `ip_rule.list` | The IP list type to add objects, can be: `black` (for denylist), `white` (for allowlist), `gray` (for graylist). |
| `ip_rule.rule_type` | The type of objects to add to the list:<ul><li>`ip_range` if adding particular IPs or subnets</li><li>`country` if adding countries or regions</li><li>`proxy_type` if adding proxy services (`VPN`, `SES`, `PUB`, `WEB`, `TOR`)</li><li>`datacenter` for other source types (`rackspace`, `tencent`, `plusserver`, `ovh`, `oracle`, `linode`, `ibm`, `huawei`, `hetzner`, `gce`, `azure`, `aws`, `alibaba`)</li></ul> |
| `ip_rule.subnet`<br>(`rule_type:"ip_range"`) | IP or subnet to add to the list, e.g. `"1.1.1.1"`. |
| `ip_rule.source_values`<br>(for other `rule_type` values) | One of the options:<ul><li>If `rule_type:"country"` - array of countries in the [ISO-3166 format](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes), e.g. `["AX","AL"]`.</li><li>If `rule_type:"proxy_type"` - array of proxy services, e.g. `["VPN","PUB"]`.</li><li>If `rule_type:"datacenter"` - array of other source types, e.g. `["rackspace","huawei"]`.</li></ul> |
| `ip_rule.pools` | Array of [application IDs][application-docs] to allow or restrict access for IPs, e.g. `[3,4]` for applications IDs 3 and 4 or `[0]` for all applications.
| `ip_rule.expired_at` | [Unix Timestamp](https://www.unixtimestamp.com/) date for IPs to be removed from the list. The maximum value is forever (`33223139044`). |
| `reason` | Reason to allow or restrict access for IPs.
| `force` | If `true` and some objects specified in the request are already in the IP list, the script will overwrite them. |
