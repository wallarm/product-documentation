[link-nginx-logging-docs]: https://docs.nginx.com/nginx/admin-guide/monitoring/logging/
[doc-vuln-list]: ../attacks-vulns-list.md
[doc-monitor-node]: monitoring/intro.md
[doc-lom]: ../user-guides/rules/rules.md

# フィルタノードログの操作

フィルタノードは、次のログファイルを `/var/log/wallarm` ディレクトリに保存します：

* `brute-detect.log`： フィルタノードクラスター内での強制アタック関連カウンタの取得ログ。
* `export-attacks.log`： ポストアナリティクスモジュールからWallarmクラウドへの攻撃データのエクスポートログ。
* `export-counters.log`： カウンタのデータをエクスポートするログ（[“フィルタノードのモニタリング”][doc-monitor-node]を参照）。
* `export-environment.log`： インストールしたWallarmパッケージのバージョン情報を収集し、このデータをWallarmクラウドにアップロードするログ。わぃWallarmコンソールでフィルターノード詳細に表示されます。これらのプロセスは1時間ごとに実行されます。
* `syncnode.log`： フィルタノードがWallarmクラウドと同期するログ（これには、クラウドから[LOM][doc-lom]とproton.dbファイルを取得する作業が含まれます）。
* `tarantool.log`： ポストアナリティクスモジュール操作のログ。
* `sync-ip-lists.log`（前のノードバージョンでは `sync-blacklist.log`と名付けられていました）： フィルタリングノードが単一のオブジェクトやサブネットとして[IPリスト](../user-guides/ip-lists/overview.md)に追加されたIPアドレスと同期するログ。
* `sync-ip-lists-source.log`（前のノードバージョンでは `sync-mmdb.log`と名付けられていました）： フィルタリングノードが国、地域、データセンターに登録されたIPアドレスと[IPリスト](../user-guides/ip-lists/overview.md)と同期するログ。
* `appstructure.log`（Dockerコンテナのみ）： [API Discovery](../about-wallarm/overview.md)モジュールの活動ログ。
* `registernode_loop.log`（Dockerコンテナのみ）： `register-node`スクリプトの実行を行うラッパースクリプトの活動ログ。 `register-node`スクリプトが成功するまで実行されます。
* `weak-jwt-detect.log`： [JWTの脆弱性](../attacks-vulns-list.md#weak-jwt)の検出ログ。

##  NGINXベースのフィルタノードに対する拡張ロギングの設定

NGINXは、処理済みのリクエストのログ（アクセスログ）を別のログファイルに記述し、デフォルトでは事前定義された `combined`ロギングフォーマットを使用します。

```
log_format combined '$remote_addr - $remote_user [$time_local] '
                    '"$request" $request_id $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent" ';
```

フィルタノードの変数（他のNGINX変数も必要な場合あり）を1つまたは複数含むカスタムログフォーマットを定義して使用することができます。 NGINXのログファイルは、フィルタノードの診断をはるかに迅速に行うことができます。

### フィルタノード変数

NGINXのログフォーマットを定義する際に使用できるフィルタノード変数は、次のとおりです。

|名前|タイプ|値|
|---|---|---|
|`request_id`|文字列|リクエスト識別子<br>以下の値の形式：`a79199bcea606040cc79f913325401fb`|
|`wallarm_request_cpu_time`|浮動小数点数|フィルタノードを含むマシンのCPUがリクエストの処理に費やした時間（秒）|
|`wallarm_request_mono_time`|浮動小数点数|CPUがリクエストの処理に費やした時間 + キュー内の時間。たとえば、リクエストが3秒間キューにいて、CPUが1秒間処理を行った場合、以下のようになります：<ul><li>`"wallarm_request_cpu_time":1`</li><li>`"wallarm_request_mono_time":4`</li></ul>|
|`wallarm_serialized_size`|整数|シリアライズされたリクエストのサイズ（バイト単位）|
|`wallarm_is_input_valid`|整数|リクエストの妥当性<br>`0`：リクエストは有効です。リクエストはフィルタノードによってチェックされ、LOMルールに一致します。<br>`1`：リクエストは無効です。リクエストはフィルタノードによってチェックされ、LOMルールに一致しません。|
|`wallarm_attack_type_list`|文字列|[libprotonライブラリ][doc-vuln-list]を使用してリクエストで検出された[攻撃タイプ][doc-vuln-list]。タイプはテキスト形式でプレゼンテーションされます:<ul><li>xss</li><li>sqli</li><li>rce</li><li>xxe</li><li>ptrav</li><li>crlf</li><li>redir</li><li>nosqli</li><li>infoleak</li><li>overlimit_res</li><li>data_bomb</li><li>vpatch</li><li>ldapi</li><li>scanner</li><li>mass_assignment</li><li>ssrf</li><li>ssi</li><li>mail_injection</li><li>ssti</li><li>invalid_xml</li></ul>リクエストに複数の攻撃タイプが検出された場合、それらは `|`シンボルでリストに表示されます。たとえば：XSSおよびSQLiの攻撃が検出された場合、変数値は `xss|sqli`となります。|
|`wallarm_attack_type`|整数|[libprotonライブラリ][doc-vuln-list]を使用してリクエストで検出された[攻撃タイプ][doc-vuln-list]。タイプはビット文字列の形式でプレゼンテーションされます:<ul><li>`0x00000000`：攻撃なし：`"0"`</li><li>`0x00000002`：xss：`"2"`</li><li>`0x00000004`：sqli：`"4"`</li><li>`0x00000008`：rce：`"8"`</li><li>`0x00000010`：xxe：`"16"`</li><li>`0x00000020`：ptrav：`"32"`</li><li>`0x00000040`：crlf：`"64"`</li><li>`0x00000080`：redir：`"128"`</li><li>`0x00000100`：nosqli：`"256"`</li><li>`0x00000200`：infoleak：`"512"`</li><li>`0x20000000`：overlimit_res：`"536870912"`</li><li>`0x40000000`：data_bomb：`"1073741824"`</li><li>`0x80000000`：vpatch：`"2147483648"`</li><li>`0x00002000`：ldapi：`"8192"`</li><li>`0x4000`：scanner：`"16384"`</li><li>`0x20000`：mass_assignment：`"131072"`</li><li>`0x80000`: ssrf："524288" </li><li>`0x02000000` ...