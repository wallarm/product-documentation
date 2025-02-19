| パラメータ | 説明 |
| --------- | ----------- |
| `X-WallarmApi-Token` | Wallarm APIへのアクセスに使用するトークンです。Wallarm Console→ **Settings** → **API tokens**からコピーしてください。 |
| `clientid` | IPリストへのデータ追加または読み込みに使用するWallarm CloudアカウントのIDです。 |
| `ip_rule.list` | オブジェクトを追加するIPリストの種類です。`black`（denylist用）、`white`（allowlist用）、`gray`（graylist用）のいずれかを指定できます。 |
| `ip_rule.rule_type` | リストに追加するオブジェクトの種類を指定します：<ul><li>`ip_range`：特定のIPやサブネットを追加する場合</li><li>`country`：国または地域を追加する場合</li><li>`proxy_type`：プロキシサービスを追加する場合（`VPN`、`SES`、`PUB`、`WEB`、`TOR`）</li><li>`datacenter`：その他のソースタイプを追加する場合（`rackspace`、`tencent`、`plusserver`、`ovh`、`oracle`、`linode`、`ibm`、`huawei`、`hetzner`、`gce`、`azure`、`aws`、`alibaba`）</li></ul> |
| `ip_rule.subnet`<br>(`rule_type:"ip_range"`) | リストに追加するIPまたはサブネットです。例：`"1.1.1.1"`。 |
| `ip_rule.source_values`<br>(for other `rule_type` values) | その他の`rule_type`値に対して使用します。次のオプションのいずれかです：<ul><li>`rule_type:"country"`の場合：[ISO-3166フォーマット](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes)の国コードの配列、例：`["AX","AL"]`。</li><li>`rule_type:"proxy_type"`の場合：プロキシサービスの配列、例：`["VPN","PUB"]`。</li><li>`rule_type:"datacenter"`の場合：その他のソースタイプの配列、例：`["rackspace","huawei"]`。</li></ul> |
| `ip_rule.pools` | IPのアクセスを許可または制限する[application IDs][application-docs]の配列です。例：アプリケーションIDが3と4の場合は`[3,4]`、すべてのアプリケーションの場合は`[0]`を指定します。 |
| `ip_rule.expired_at` | リストからIPを削除する日時を[Unix Timestamp](https://www.unixtimestamp.com/)形式で指定します。最大値は永続（`33223139044`）です。 |
| `reason` | IPのアクセス許可または制限の理由を指定します。 |
| `force` | `true`の場合、リクエストで指定された一部のオブジェクトが既にIPリストに存在する場合、スクリプトがそれらを上書きします。 |