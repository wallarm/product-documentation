[link-nginx-logging-docs]:  https://docs.nginx.com/nginx/admin-guide/monitoring/logging/
[doc-vuln-list]:            ../attacks-vulns-list.md
[doc-monitor-node]:         monitoring/intro.md
[doc-lom]:                  ../user-guides/rules/compiling.md


#   フィルターノードログの操作

フィルターノードは、`/var/log/wallarm`ディレクトリに次のログファイルを格納します。

*   `brute-detect.log`: フィルターノードクラスタ内の総力攻撃関連カウンターを取得するログ。
*   `export-attacks.log`: postanalyticsモジュールからWallarmクラウドへの攻撃データのエクスポートログ。
*   `export-counters.log`: カウンターデータのエクスポートログ（[“フィルターノードの監視”][doc-monitor-node]を参照）。
*   `export-environment.log`: インストールされたWallarmパッケージのバージョンを収集し、このデータをWallarmクラウドにアップロードして、Wallarmコンソールでフィルタリングノードの詳細に表示するログ。これらのプロセスは1時間ごとに実行されます。
*   `syncnode.log`: Wallarmクラウドとのフィルターノードの同期ログ（[LOM][doc-lom]およびproton.dbファイルをクラウドから取得する）。
*   `tarantool.log`: postanalyticsモジュールの操作ログ。
*   `sync-ip-lists.log`（以前のノードバージョンでは`sync-blacklist.log`）： [IPリスト](../user-guides/ip-lists/overview.md)に単一オブジェクトまたはサブネットとして追加されたIPアドレスでフィルタリングノードを同期するログ。
*   `sync-ip-lists-source.log`（以前のノードバージョンでは`sync-mmdb.log`）： [IPリスト](../user-guides/ip-lists/overview.md)内の国、地域、データセンターで登録されたIPアドレスでフィルタリングノードを同期するログ。
*   `appstructure.log`（Dockerコンテナー内のみ）： [APIディスカバリー](../about-wallarm/api-discovery.md)モジュールのアクティビティログ。
*   `registernode_loop.log`（Dockerコンテナ内のみ）： `register-node`スクリプトを実行するラッパースクリプトのアクティビティログ。成功するまで繰り返し実行されます。

    Wallarmノード画像4.0およびそれ以前のバージョンでは、ファイル名は`addnode_loop.log`です。
*   `weak-jwt-detect.log`： [JWT脆弱性](../attacks-vulns-list.md#weak-jwt)検出のログ。

##  NGINXベースのフィルターノードの拡張ロギングの設定

NGINXは、プロセス済みリクエスト（アクセスログ）のログを別のログファイルに書き込み、デフォルトで`combined`ログフォーマットを使用します。

```
log_format combined '$remote_addr - $remote_user [$time_local] '
                    '"$request" $request_id $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent" ';
```

フィルターノード変数（および必要に応じて他のNGINX変数）を含むカスタムログフォーマットを定義および使用できます。NGINXログファイルを使用すると、フィルターノードの診断がはるかに速くなります。

### フィルターノード変数

NGINXログフォーマットを定義する際に、次のフィルターノード変数を使用できます。

|名前|タイプ|値|
|---|---|---|
|`request_id`|文字列|リクエスト識別子<br>次の値形式があります: `a79199bcea606040cc79f913325401fb`|
|`wallarm_request_cpu_time`<br>（Wallarmノード3.6およびそれ以前では、`wallarm_request_time`）|浮動小数点数|リクエストを処理するフィルタリングノードを持つマシンのCPUにかかった秒単位の時間。|
|`wallarm_request_mono_time`|浮動小数点数|CPUがリクエストの処理にかかった時間+キュー内の時間。たとえば、リクエストがキュー内に3秒間あり、CPUが1秒間処理していた場合：<ul><li>`"wallarm_request_cpu_time":1`</li><li>`"wallarm_request_mono_time":4`</li></ul>|
|`wallarm_serialized_size`|整数|シリアル化されたリクエストのバイト単位のサイズ|
|`wallarm_is_input_valid`|整数|リクエストの有効性<br>`0`：リクエストは有効です。 リクエストはフィルターノードでチェックされ、LOMルールと一致しています。<br>`1`：リクエストは無効です。 リクエストはフィルターノードでチェックされ、LOMルールと一致しません。|
| `wallarm_attack_type_list` | 文字列 | [リクエストで検出された攻撃タイプ][doc-vuln-list]の[libproton](../about-wallarm/protecting-against-attacks.md#library-libproton)ライブラリ。 タイプはテキスト形式で示されます。<ul><li>xss</li><li>sqli</li><li>rce</li><li>xxe</li><li>ptrav</li><li>crlf</li><li>redir</li><li>nosqli</li><li>infoleak</li><li>overlimit_res</li><li>data_bomb</li><li>vpatch</li><li>ldapi</li><li>scanner</li><li>mass_assignment</li><li>ssrf</li><li>ssi</li><li>mail_injection</li><li>ssti</li><li>invalid_xml</li></ul>リクエストで複数の攻撃タイプが検出された場合、 `|`記号で一覧表示されます。 例： XSSとSQLi攻撃が検出された場合、変数の値は `xss|sqli` です。 |
|`wallarm_attack_type`|整数|[リクエストで検出された攻撃タイプ][doc-vuln-list]の[libproton](../about-wallarm/protecting-against-attacks.md#library-libproton)ライブラリ。 タイプはビット文字列形式で示されます。<ul><li>`0x00000000`: 攻撃なし: `"0"`</li><li>`0x00000002`: xss: `"2"`</li><li>`0x00000004`: sqli: `"4"`</li><li>`0x00000008`: rce: `"8"`</li><li>`0x00000010`: xxe: `"16"`</li><li>`0x00000020`: ptrav: `"32"`</li><li>`0x00000040`: crlf: `"64"`</li><li>`0x00000080`: redir: `"128"`</li><li>`0x00000100`: nosqli: `"256"`</li><li>`0x00000200`: infoleak: `"512"`</li><li>`0x20000000`: overlimit_res: `"536870912"`</li><li>`0x40000000`: data_bomb: `"1073741824"`</li><li>`0x80000000`: vpatch: `"2147483648"`</li><li>`0x00002000`: ldapi: `"8192"`</li><li>`0x4000`: scanner: `"16384"`</li><li>`0x20000`: mass_assignment: `"131072"`</li><li>`0x80000`: ssrf: `"524288"`</li><li>`0x02000000`: ssi: `"33554432"`</li><li>`0x04000000`: mail_injection: `"67108864"`</li><li>`0x08000000`: ssti: `"134217728"`</li><li>`0x10000000`: invalid_xml: `"268435456"`</li></ul>リクエストで複数の攻撃タイプが検出された場合、値が合計されます。 例： XSSとSQLi攻撃が検出された場合、変数の値は `6` です。 |### 設定例

次の変数を含む `wallarm_combined` という名前の拡張ログ形式を指定する必要があると仮定します：
*   `combined` 形式で使用されるすべての変数
*   すべてのフィルタノード変数

これを行うには、次の操作を行います：

1.  以下の行は、所望のログ形式を記述しています。NGINX 設定ファイルの `http` ブロックに追加してください。

    ```
    log_format wallarm_combined '$remote_addr - $remote_user [$time_local] '
                                '"$request" $request_id $status $body_bytes_sent '
                                '"$http_referer" "$http_user_agent" '
                                '$wallarm_request_cpu_time $wallarm_request_mono_time $wallarm_serialized_size $wallarm_is_input_valid $wallarm_attack_type $wallarm_attack_type_list';
    ```

2.  同じブロックに以下のディレクティブを追加することで、拡張ログ形式を有効にします（第1ステップと同じブロックです）：

    `access_log /var/log/nginx/access.log wallarm_combined;`
    
    処理済みリクエストログは、`wallarm_combined` 形式で `/var/log/nginx/access.log` ファイルに書き込まれます。
    
    !!! info "条件付きロギング"
        上記のディレクティブを使用すると、攻撃に関連しないリクエストも含むすべての処理済みリクエストがログファイルに記録されます。
        
        攻撃の一部であるリクエストのみのログを書き込むように条件付きロギングを設定できます（これらのリクエストの `wallarm_attack_type` 変数の値はゼロ以外です）。そのために、前述のディレクティブに条件を追加してください：`access_log /var/log/nginx/access.log wallarm_combined if=$wallarm_attack_type;`
        
        ログファイルサイズを減らす場合や、[SIEM ソリューション](https://www.wallarm.com/what/siem-whats-security-information-and-event-management-technology-part-1) のいずれかとフィルタノードを統合する場合に便利です。          
        
3.  使用している OS に応じて、次のコマンドのいずれかを実行して NGINX を再起動します：

    --8<-- "../include-ja/waf/restart-nginx-3.6.md"

!!! info "詳細情報"
    NGINX のログ設定に関する詳細情報については、次の[リンク][link-nginx-logging-docs]を参照してください。