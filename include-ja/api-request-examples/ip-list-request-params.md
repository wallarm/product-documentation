| パラメータ | 説明 |
| --------- | ----------- |
| `X-WallarmAPI-Secret` | [Wallarm APIにアクセスするためのシークレットキー][access-wallarm-api-docs]。Wallarm Console → **設定** → **プロファイル** → **API認証情報** からコピーしてください。 |
| `X-WallarmAPI-UUID` | [Wallarm APIにアクセスするためのUUID][access-wallarm-api-docs]。Wallarm Console → **設定** → **プロファイル** → **API認証情報** からコピーしてください。 |
| `clientid` | Wallarm Cloud内のアカウントIDで、IPリストを参照/登録します。|
| `ip_rule.list` | オブジェクトを追加するIPリストのタイプ。`black`（ブロックリスト用）、`white`（許可リスト用）、`gray`（グレーリスト用）のいずれかです。 |
| `ip_rule.rule_type` | リストに追加するオブジェクトのタイプ：<ul><li>`ip_range` - IPアドレスまたはサブネットを追加する場合</li><li>`country` - 国または地域を追加する場合</li><li>`proxy_type` - プロキシサービス（`VPN`、`SES`、`PUB`、`WEB`、`TOR`）を追加する場合</li><li>`datacenter` - その他のソースタイプ（`rackspace`、`tencent`、`plusserver`、`ovh`、`oracle`、`linode`、`ibm`、`huawei`、`hetzner`、`gce`、`azure`、`aws`、`alibaba`）を追加する場合</li></ul> |
| `ip_rule.subnet`<br>(`rule_type:"ip_range"` の場合) | リストに追加するIPまたはサブネット。例：`"1.1.1.1"`。 |
| `ip_rule.source_values`<br>(その他の `rule_type` の値に使用) | オプションのいずれか：<ul><li>`rule_type:"country"` の場合 - [ISO-3166形式](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes)の国の配列。例：`["AX","AL"]`。</li><li>`rule_type:"proxy_type"` の場合 - プロキシサービスの配列。例：`["VPN","PUB"]`。</li><li>`rule_type:"datacenter"` の場合 - その他のソースタイプの配列。例：`["rackspace","huawei"]`。</li></ul> |
| `ip_rule.pools` | IPのアクセスを許可/制限する[アプリケーションID][application-docs]の配列。例：アプリケーションID 3 と 4 の場合は`[3,4]`、すべてのアプリケーションの場合は`[0]`。|
| `ip_rule.expired_at` | IPがリストから削除される[Unix Timestamp](https://www.unixtimestamp.com/)日付。最大値は永遠 (`33223139044`)。 |
| `reason` | IPのアクセスを許可/制限する理由。|
| `force` | `true` の場合、リクエストで指定されたオブジェクトがすでにIPリストに存在する場合、スクリプトはそれらを上書きします。 |