```markdown
[link-nginx-logging-docs]:  https://docs.nginx.com/nginx/admin-guide/monitoring/logging/
[doc-vuln-list]:            ../attacks-vulns-list.md
[doc-monitor-node]:         monitoring/intro.md
[doc-lom]:                  ../user-guides/rules/rules.md#ruleset-lifecycle

# フィルタノードログの操作

本記事では、Wallarmフィルタノードのログファイルの場所を確認する方法について説明します。

ログファイルは`/opt/wallarm/var/log/wallarm`ディレクトリに配置されています。以下は、扱うログファイルと各ファイルに含まれる情報の概要です:

* `api-firewall-out.log`: [API specification enforcement](../api-specification-enforcement/overview.md)のログです。
* `appstructure-out.log`（Dockerコンテナのみ）: [API Discovery](../api-discovery/overview.md)モジュールの動作ログです。
* `tarantool-out.log`: postanalyticsモジュールの操作ログです。
* `wcli-out.log`: ブルートフォース検出、Cloudへの攻撃エクスポート、Cloudとのノード同期状態などを含む、ほとんどのWallarmサービスのログです。
* `go-node.log`: [Native Node](../installation/nginx-native-node-internals.md#native-node)のログです。

## NGINXベースのフィルタノードにおける拡張ログ設定

NGINXは、定義済みの`combined`ログ形式を使用して、処理済みリクエスト（アクセスログ）を別個のログファイルに記録します。

```
log_format combined '$remote_addr - $remote_user [$time_local] '
                    '"$request" $request_id $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent" ';
```

必要に応じて、1つまたは複数のフィルタノード変数（およびその他のNGINX変数も）を含めることでカスタムログ形式を定義して利用できます。NGINXのログファイルにより、フィルタノードの診断が大幅に高速化されます。

### フィルタノード変数

以下のフィルタノード変数をNGINXログ形式の定義時に利用できます:

| 名前 | 型 | 値 |
|---|---|---|
| `request_id` | String | リクエスト識別子<br>値の形式は `a79199bcea606040cc79f913325401fb` です。 |
| `wallarm_request_cpu_time` | Float | フィルタノードのマシンのCPUがリクエスト処理に費やした時間（秒単位）です。 |
| `wallarm_request_mono_time` | Float | リクエストのCPU処理時間とキュー待機時間の合計（秒単位）です。たとえば、リクエストが3秒キューにあり、1秒CPUで処理された場合は以下のようになります: <ul><li>`"wallarm_request_cpu_time":1`</li><li>`"wallarm_request_mono_time":4`</li></ul> |
| `wallarm_serialized_size` | Integer | シリアライズされたリクエストのサイズ（バイト単位）です。 |
| `wallarm_is_input_valid` | Integer | リクエストの有効性です。<br>`0`: リクエストは有効です。フィルタノードでチェックされ、LOMルールに一致します。<br>`1`: リクエストは無効です。フィルタノードでチェックされ、LOMルールに一致しません。 |
| `wallarm_attack_type_list` | String | リクエスト中で[Attack types][doc-vuln-list]が[libproton](../about-wallarm/protecting-against-attacks.md#library-libproton)ライブラリを用いて検出された際の攻撃タイプの一覧です。攻撃タイプはテキスト形式で表記されます:<ul><li>xss</li><li>sqli</li><li>rce</li><li>xxe</li><li>ptrav</li><li>crlf</li><li>redir</li><li>nosqli</li><li>infoleak</li><li>overlimit_res</li><li>data_bomb</li><li>vpatch</li><li>ldapi</li><li>scanner</li><li>mass_assignment</li><li>ssrf</li><li>ssi</li><li>mail_injection</li><li>ssti</li><li>invalid_xml</li></ul>複数の攻撃タイプが検出された場合、シンボル `|` で区切って表示されます。たとえば、XSSとSQLiが検出された場合、変数の値は `xss|sqli` となります。 |
| `wallarm_attack_type` | Integer | リクエスト中で[Attack types][doc-vuln-list]が[libproton](../about-wallarm/protecting-against-attacks.md#library-libproton)ライブラリを用いて検出された際の攻撃タイプです。攻撃タイプはビット文字列形式で表記されます:<ul><li>`0x00000000`: 攻撃なし: `"0"`</li><li>`0x00000002`: xss: `"2"`</li><li>`0x00000004`: sqli: `"4"`</li><li>`0x00000008`: rce: `"8"`</li><li>`0x00000010`: xxe: `"16"`</li><li>`0x00000020`: ptrav: `"32"`</li><li>`0x00000040`: crlf: `"64"`</li><li>`0x00000080`: redir: `"128"`</li><li>`0x00000100`: nosqli: `"256"`</li><li>`0x00000200`: infoleak: `"512"`</li><li>`0x20000000`: overlimit_res: `"536870912"`</li><li>`0x40000000`: data_bomb: `"1073741824"`</li><li>`0x80000000`: vpatch: `"2147483648"`</li><li>`0x00002000`: ldapi: `"8192"`</li><li>`0x4000`: scanner: `"16384"`</li><li>`0x20000`: mass_assignment: `"131072"`</li><li>`0x80000`: ssrf: `"524288"`</li><li>`0x02000000`: ssi: `"33554432"`</li><li>`0x04000000`: mail_injection: `"67108864"`</li><li>`0x08000000`: ssti: `"134217728"`</li><li>`0x10000000`: invalid_xml: `"268435456"`</li></ul>複数の攻撃タイプが検出された場合、値は合算されます。たとえば、XSSとSQLiが検出された場合、変数の値は `6` となります。 |
| `wallarm_attack_point_list` (NGINXノード5.2.1以降) | String | 悪意のあるペイロードを含むリクエストのポイントを列挙します。1つのポイントが複数の[パーサ](../user-guides/rules/request-processing.md)で順次処理された場合、それらすべてが含まれます。複数の悪意のあるペイロードを含むポイントは `|` で連結されます。<br>例: `[post][json][json_obj, 'data'][base64]` は、JSON内のbase64エンコードされた`data`ボディパラメータで悪意のあるペイロードが検出されたことを示します。<br>このログデータはWallarm Console UIに表示される簡易なユーザーフレンドリービューと異なる場合があります。 |
| `wallarm_attack_stamp_list` (NGINXノード5.2.1以降) | String | リクエスト中で検出された各攻撃サインに対する内部Wallarm IDを列挙します。複数のサインIDは `|` で連結されます。同じ攻撃サインが複数のパーシング段階で検出された場合、IDが重複することがあります。例として、`union+select+1`のようなSQLi攻撃では `7|7` が返され、複数回検出されたことを示します。<br>このログデータはWallarm Console UIに表示される簡易なユーザーフレンドリービューと異なる場合があります。 |

### 設定例

以下の変数を含む`wallarm_combined`と名付けられた拡張ログ形式を指定する必要があると仮定します:
* `combined`形式で使用されるすべての変数
* すべてのフィルタノード変数

これを実現するには、以下の手順を実行します:

1.  以下の記述は、目的のログ形式を表します。これらをNGINX設定ファイルの`http`ブロックに追加します。

    ```
    log_format wallarm_combined '$remote_addr - $remote_user [$time_local] '
                                '"$request" $request_id $status $body_bytes_sent '
                                '"$http_referer" "$http_user_agent" '
                                '$wallarm_request_cpu_time $wallarm_request_mono_time $wallarm_serialized_size $wallarm_is_input_valid $wallarm_attack_type $wallarm_attack_type_list $wallarm_attack_point_list $wallarm_attack_stamp_list';
    ```

2.  拡張ログ形式を有効にするため、同じブロック内に以下のディレクティブを追加します:

    `access_log /var/log/nginx/access.log wallarm_combined;`
    
    処理済みリクエストのログは、`wallarm_combined`形式で`/var/log/nginx/access.log`ファイルに記録されます。
    
    !!! info "条件付きログ"
        上記のディレクティブを使用すると、攻撃に関連しないリクエストも含め、すべての処理済みリクエストがログファイルに記録されます。
        
        条件付きログを設定することで、攻撃に該当するリクエストのみをログとして記録できます（これらのリクエストでは`wallarm_attack_type`変数の値がゼロではありません）。そのためには、前述のディレクティブに条件を追加します: `access_log /var/log/nginx/access.log wallarm_combined if=$wallarm_attack_type;`
        
        ログファイルのサイズを削減したい場合や、フィルタノードを[SIEM solutions](https://www.wallarm.com/what/siem-whats-security-information-and-event-management-technology-part-1)のいずれかと統合する場合に有用です。
        
3.  使用しているOSに応じて、以下のいずれかのコマンドを実行し、NGINXを再起動します:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"

!!! info "詳細情報"
    NGINXにおけるログ設定の詳細情報については、この[リンク][link-nginx-logging-docs]を参照してください。
```