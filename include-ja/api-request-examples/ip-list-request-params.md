| パラメータ | 説明 |
| --------- | ----------- |
| `X-WallarmApi-Token` | [Wallarm APIにアクセス][access-wallarm-api-docs]するためのトークンです。Wallarm Console → **Settings** → **API tokens**からコピーします。 |
| `clientid` | IPリストの追加や参照を行うためのWallarm CloudのアカウントIDです。 |
| `ip_rule.list` | オブジェクトを追加するIPリストの種類です。指定可能な値: `black`（拒否リスト）、`white`（許可リスト）、`gray`（グレーリスト）。 |
| `ip_rule.rule_type` | リストに追加するオブジェクトの種類です:<ul><li>特定のIPまたはサブネットを追加する場合は`ip_range`</li><li>国または地域を追加する場合は`country`</li><li>プロキシサービスを追加する場合は`proxy_type`（`VPN`、`SES`、`PUB`、`WEB`、`TOR`）</li><li>その他の送信元タイプの場合は`datacenter`（`rackspace`、`tencent`、`plusserver`、`ovh`、`oracle`、`linode`、`ibm`、`huawei`、`hetzner`、`gce`、`azure`、`aws`、`alibaba`）</li></ul> |
| `ip_rule.subnet`<br>(`rule_type:"ip_range"`) | リストに追加するIPまたはサブネットです。例: `"1.1.1.1"`。 |
| `ip_rule.source_values`<br>（他の`rule_type`の値の場合） | 次のいずれかです:<ul><li>`rule_type:"country"`の場合: [ISO-3166形式](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes)の国の配列です（例: `["AX","AL"]`）。</li><li>`rule_type:"proxy_type"`の場合: プロキシサービスの配列です（例: `["VPN","PUB"]`）。</li><li>`rule_type:"datacenter"`の場合: その他の送信元タイプの配列です（例: `["rackspace","huawei"]`）。</li></ul> |
| `ip_rule.pools` | IPへのアクセスを許可または制限する対象の[アプリケーションID][application-docs]の配列です。例: アプリケーションIDが3と4の場合は[3,4]、すべてのアプリケーションの場合は[0]。 |
| `ip_rule.expired_at` | リストからIPを削除する日時を表す[Unixタイムスタンプ](https://www.unixtimestamp.com/)です。最大値は無期限（`33223139044`）です。 |
| `reason` | IPへのアクセスを許可または制限する理由です。 |
| `force` | `true`で、リクエストで指定したオブジェクトの一部がすでにIPリストに存在する場合は、スクリプトがそれらを上書きします。 |