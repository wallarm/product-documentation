[link-nginx-logging-docs]:  https://docs.nginx.com/nginx/admin-guide/monitoring/logging/
[doc-vuln-list]:            ../attacks-vulns-list.md
[doc-lom]:                  ../user-guides/rules/rules.md#ruleset-lifecycle
[antibot]:                  ../api-abuse-prevention/overview.md
[resource-overlimit]:        ../attacks-vulns-list.md/#resource-overlimit
[acl]:                       ../user-guides/ip-lists/overview.md

#   フィルタリングノードのログの操作

本記事では、Wallarmフィルタリングノードのログファイルの場所を確認する方法を説明します。

ログファイルは`/opt/wallarm/var/log/wallarm`ディレクトリにあります。以下に、存在するログファイルと各ファイルに含まれる情報の概要を示します。

* `api-firewall-out.log`: [API specification enforcement](../api-specification-enforcement/overview.md)のログです。
* `appstructure-out.log`(Dockerコンテナでのみ): [API Discovery](../api-discovery/overview.md)モジュールの動作ログです。
* `wstore-out.log`([NGINX Node 5.x and earlier](../updating-migrating/what-is-new.md#replacing-tarantool-with-wstore-for-postanalytics)では`tarantool-out.log`): postanalyticsモジュールの動作ログです。
* `wcli-out.log`: ブルートフォース検知、Cloudへの攻撃エクスポート、Cloudとのノード同期状況など、大半のWallarmサービスのログです。
* `supervisord-out.log`: サービスの起動、ステータス変更、警告など、Supervisorのプロセス管理に関するログです。
* `go-node.log`: [Native Node](../installation/nginx-native-node-internals.md#native-node)のログです。

##  NGINX‑ベースのフィルタノードの拡張ロギングの設定

NGINXは処理済みリクエスト(アクセスログ)のログを、既定の`combined`ロギングフォーマットを使用して別のログファイルに書き込みます。

```
log_format combined '$remote_addr - $remote_user [$time_local] '
                    '"$request" $request_id $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent" ';
```

必要に応じて他のNGINX変数と同様に、1つ以上のフィルタノード変数を含めたカスタムのロギングフォーマットを定義して使用できます。NGINXのログファイルからフィルタノードの診断をより迅速に実施できるようになります。

### フィルタノード変数

NGINXのロギングフォーマットを定義する際に、以下のフィルタノード変数を使用できます。

|名前|型|値|
|---|---|---|
|`request_id`|String|リクエスト識別子<br>値の形式は次のとおりです: `a79199bcea606040cc79f913325401fb`|
|`wallarm_request_cpu_time`|Float|フィルタリングノードが動作するマシンのCPUがリクエスト処理に費やした時間(秒)。|
|`wallarm_request_mono_time`|Float|CPUがリクエスト処理に費やした時間+キュー内での待機時間(秒)。例えば、リクエストがキューで3秒待機し、CPUで1秒処理された場合は、次のとおりです: <ul><li>`"wallarm_request_cpu_time":1`</li><li>`"wallarm_request_mono_time":4`</li></ul>|
|`wallarm_serialized_size`|Integer|シリアライズされたリクエストのサイズ(バイト)。|
|`wallarm_is_input_valid`|Integer|リクエストの正当性<br>`0` - リクエストは有効です。リクエストはフィルタノードで検査され、LOMルールに一致しています。<br>`1` - リクエストは無効です。リクエストはフィルタノードで検査され、LOMルールに一致していません。|
| `wallarm_attack_type_list` | String | リクエストで検出された[攻撃タイプ][doc-vuln-list]。タイプはテキスト形式で示されます:<ul><li>xss</li><li>sqli</li><li>rce</li><li>xxe</li><li>ptrav</li><li>crlf</li><li>redir</li><li>nosqli</li><li>infoleak</li><li>overlimit_res</li><li>data_bomb</li><li>vpatch</li><li>ldapi</li><li>scanner</li><li>mass_assignment</li><li>ssrf</li><li>ssi</li><li>mail_injection</li><li>ssti</li><li>invalid_xml</li><li>file_upload_violation</li><li>[API仕様違反](../api-specification-enforcement/overview.md):<ul><li>undefined_endpoint</li><li>undefined_parameter</li><li>missing_auth</li><li>missing_parameter</li><li>invalid_parameter_value</li><li>invalid_request</li><li>processing_overlimit</li></ul></li><li>blocked_source</li><li>GraphQL攻撃:<ul><li>gql_aliases</li><li>gql_debug</li><li>gql_depth</li><li>gql_doc_size</li><li>gql_docs_per_batch</li><li>gql_introspection</li><li>gql_value_size</li></ul></li><li>[トリガー](../user-guides/triggers/triggers.md)に基づく攻撃(オリジンがトリガーによりdenylistまたはgraylistに入れられた場合にのみ返されるタイプ):<ul><li>brute</li><li>dirbust</li><li>bola</li><li>[vectors](configuration-guides/protecting-with-thresholds.md)</li></ul></li><li>[API Abuse](../api-abuse-prevention/overview.md)(モジュールがオリジンをdenylistまたはgraylistに入れた場合にのみ返されるタイプ):<ul><li>bot</li><li>api_abuse</li><li>account_takeover</li><li>security_crawlers</li><li>scraping</li><li>resource_consumption</li></ul></li><li>credential_stuffing</li></ul>1つのリクエストで複数の攻撃タイプが検出された場合は、記号`|`で連結されます。例えばXSSとSQLiが検出された場合、変数の値は`xss|sqli`です。 |
|`wallarm_attack_type`|Integer|リクエストで検出された[攻撃タイプ][doc-vuln-list]。タイプはビット列形式で示されます:<ul><li>`0x00000000` - no attack - `"0"`</li><li>`0x00000002` - xss - `"2"`</li><li>`0x00000004` - sqli - `"4"`</li><li>`0x00000008` - rce - `"8"`</li><li>`0x00000010` - xxe - `"16"`</li><li>`0x00000020` - ptrav - `"32"`</li><li>`0x00000040` - crlf - `"64"`</li><li>`0x00000080` - redir - `"128"`</li><li>`0x00000100` - nosqli - `"256"`</li><li>`0x00000200` - infoleak - `"512"`</li><li>`0x20000000` - overlimit_res - `"536870912"`</li><li>`0x40000000` - data_bomb - `"1073741824"`</li><li>`0x80000000` - vpatch - `"2147483648"`</li><li>`0x00002000` - ldapi - `"8192"`</li><li>`0x4000` - scanner - `"16384"`</li><li>`0x20000` - mass_assignment - `"131072"`</li><li>`0x80000` - ssrf - `"524288"`</li><li>`0x02000000`- ssi - `"33554432"`</li><li>`0x04000000` - mail_injection - `"67108864"`</li><li>`0x08000000` - ssti - `"134217728"`</li><li>`0x10000000` - invalid_xml - `"268435456"`</li><li>`0x8000000000000`- file_upload_violation - `2251799813685248`</li><li>API悪用(bot攻撃): <ul><li>`0x10000000000000` - resource_consumption - `4503599627370496`</li></ul></li><li>[API仕様違反](../api-specification-enforcement/overview.md):<ul><li>`0x100000000` - undefined_endpoint - `"4294967296"`</li><li>`0x200000000` - undefined_parameter - `"8589934592"`</li><li>`0x400000000`- missing_auth - `"17179869184"`</li><li>`0x800000000`- missing_parameter - `"34359738368"`</li><li>`0x1000000000` - invalid_parameter_value - `"68719476736"`</li><li>`0x2000000000` - invalid_request - `"137438953472"`</li><li>`0x4000000000` - processing_overlimit - `"274877906944"`</li></ul></li><li>`0x100000` - blocked_source - `"1048576"`</li><li>GraphQL攻撃: <ul><li>`0x20000000000` - gql_aliases - `"2199023255552"`</li><li>`0x200000000000` - gql_debug - `"35184372088832"`</li><li>`0x8000000000` - gql_depth - `"549755813888"`</li><li>`0x40000000000` - gql_doc_size - `"4398046511104"`</li><li>`0x80000000000` - gql_docs_per_batch - `"8796093022208"`</li><li>`0x100000000000` - gql_introspection - `"17592186044416"`</li><li>`0x10000000000` - gql_value_size - `"1099511627776"`</li></ul></li><li>[トリガー](../user-guides/triggers/triggers.md)に基づく攻撃(オリジンがトリガーによりdenylistまたはgraylistに入れられた場合にのみ返されるタイプ):<ul><li>`0x400` - brute - `"1024"`</li><li>`0x800` - dirbust - `"2048"`</li><li>`0x10000` - bola - `"65536"`</li><li>`0x400000` - [vectors](configuration-guides/protecting-with-thresholds.md) - `"4194304"`</li></ul></li><li>[API Abuse](../api-abuse-prevention/overview.md)(モジュールがオリジンをdenylistまたはgraylistに入れた場合にのみ返されるタイプ):<ul><li>`0x8000` - bot - `"32768"`</li><li>`0x200000` - api_abuse - `"2097152"`</li><li>`0x400000000000` - account_takeover - `"70368744177664"`</li><li>`0x800000000000` - security_crawlers - `"140737488355328"`</li><li>`0x1000000000000` - scraping - `"281474976710656"`</li></ul></li><li>`0x1000000` - credential_stuffing - `"16777216"`</li></ul>1つのリクエストで複数の攻撃タイプが検出された場合は、値が加算されます。例えばXSSとSQLiが検出された場合、変数の値は`6`です。 |
| `wallarm_attack_point_list` (NGINXノード5.2.1以降) | String | 悪意のあるペイロードを含むリクエストのポイントを列挙します。1つのポイントが複数の[パーサー](../user-guides/rules/request-processing.md)で順次処理される場合、それらすべてが値に含まれます。複数のポイントに悪意のあるペイロードが含まれる場合は、`|`で連結されます。<br>例: `[post][json][json_obj, 'data'][base64]`は、JSONの`data`ボディパラメータに含まれるbase64エンコードされた悪意のあるペイロードを示します。<br>このログデータは、Wallarm Console UIに表示される簡略化されたユーザーフレンドリーな表示と異なる場合があります。 |
| `wallarm_attack_stamp_list` (NGINXノード5.2.1以降) | String | リクエストで検出された各攻撃シグンの内部Wallarm IDを列挙します。複数のシグンIDは`|`で連結されます。同一の攻撃シグンが複数の解析段階で検出された場合、IDが重複することがあります。例えば、`union+select+1`のようなSQLi攻撃では、複数回の検出を示す`7|7`が返ることがあります。<br>このログデータは、Wallarm Console UIに表示される簡略化されたユーザーフレンドリーな表示と異なる場合があります。 |
|`wallarm_block_reason` (NGINXノード6.4.0以降)|String|ブロック理由(該当する場合)。理由はテキスト形式で示されます: <ul><li>`not blocked` - リクエストはブロックされませんでした(例: [allowlisted IP][acl]から送信された場合)。</li><li>`antibot` - リクエストは[API Abuse Preventionモジュール][antibot]によりブロックされました。</li><li>`attack mask=<MASK>` - 攻撃が検出されました。`MASK`は攻撃タイプを表すビット列です(例: `mask=0000000000000020`はptrav攻撃を示します)。すべての攻撃タイプは上記の`wallarm_attack_type`セクションに記載されています。</li><li>`overlimit` - マスク内で[resource overlimit][resource-overlimit]攻撃が検出されました。</li><li>`acl blacklist SRC TYPE` - [denylistに登録されたリクエストソースが原因][acl]でリクエストがブロックされました。可変部分には次の値が入ります: <ul>`SRC`:<ul><li>`ip`</li><li>`country`</li><li>`proxy`</li><li>`datacenter`</li><li>`tor`</li></ul></li><li>`TYPE`: <ul><li>`blocked_source`</li><li>`brute`</li><li>`dirbust`</li><li>`bola`</li><li>`bot`</li><li>`api_abuse`</li><li>`vectors`</li><li>`account_takeover`</li><li>`security_crawlers`</li><li>`scraping`</li><li>`resource_consumption`</li><li>`session_anomaly`</li><li>`enum`</li><li>`rate_limit`</li><li>`query_anomaly`</li><li>`ai_prompt_injection`</li><li>`ai_prompt_retrieval`</li></ul></li></ul>|

### 設定例

`wallarm_combined`という名前の拡張ロギングフォーマットを定義し、次の変数を含めるとします。
*   `combined`フォーマットで使用されているすべての変数
*   すべてのフィルタノード変数

この場合、次の手順を実行します。

1.  以下の行は目的のロギングフォーマットを示します。NGINX構成ファイルの`http`ブロックに追加します。

    ```
    log_format wallarm_combined '$remote_addr - $remote_user [$time_local] '
                                '"$request" $request_id $status $body_bytes_sent '
                                '"$http_referer" "$http_user_agent" '
                                '$wallarm_request_cpu_time $wallarm_request_mono_time $wallarm_serialized_size $wallarm_is_input_valid $wallarm_attack_type $wallarm_attack_type_list $wallarm_attack_point_list $wallarm_attack_stamp_list';
    ```

2.  同じブロックに次のディレクティブを追加して、拡張ロギングフォーマットを有効にします。

    `access_log /var/log/nginx/access.log wallarm_combined;`
    
    処理済みリクエストのログは、`/var/log/nginx/access.log`ファイルに`wallarm_combined`フォーマットで書き込まれます。
    
    !!! info "条件付きロギング"
        上記のディレクティブでは、攻撃に関連しないものを含め、すべての処理済みリクエストがログファイルに記録されます。
        
        条件付きロギングを設定して、攻撃の一部であるリクエスト(これらのリクエストでは`wallarm_attack_type`変数の値がゼロではありません)のみを記録することもできます。その場合は、前述のディレクティブに条件を追加します: `access_log /var/log/nginx/access.log wallarm_combined if=$wallarm_attack_type;`
        
        ログファイルのサイズを抑えたい場合や、フィルタノードを[SIEMソリューション](https://www.wallarm.com/what/siem-whats-security-information-and-event-management-technology-part-1)のいずれかと連携する場合に役立ちます。          
        
3.  使用しているOSに応じて、次のいずれかのコマンドを実行してNGINXを再起動します。

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"

!!! info "詳細情報"
    NGINXでのロギング設定の詳細は、この[リンク][link-nginx-logging-docs]をご覧ください。


<!-- wallarm_attack_type_list - notes causing questions

not released yet (do not know yet whether with the mitigation control release they will be available or not):
ai_prompt_injection
ai_prompt_retrieval
session_anomaly - not sure if they really exist
query_anomaly - not sure if they really exist
enum


once file upload restriction policy and unrestricted resource consumption are released and announced in 6.3:

wallarm_attack_type_list - the following new values:
<li>resource_consumption</li><li>file_upload_violation</li>

wallarm_attack_type - the following new values:
<li>0x10000000000000: resource_consumption: 4503599627370496</li><li>0x8000000000000: file_upload_violation: 2251799813685248</li>
-->