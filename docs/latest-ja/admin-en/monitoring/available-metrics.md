[doc-nagios-details]: fetching-metrics.md#exporting-metrics-using-the-collectd-nagios-utility

[doc-lom]: ../../glossary-en.md#custom-ruleset-the-former-term-is-lom

[anchor-tnt]: #number-of-requests-not-analyzed-by-the-postanalytics-module
[anchor-api]: #number-of-requests-not-passed-to-the-wallarm-api
[anchor-metric-1]: #indication-that-the-postanalytics-module-drops-requests

#   利用可能なメトリクス

* [メトリック形式](#metric-format)
* [Wallarm のメトリックの種類](#types-of-wallarm-metrics)
* [NGINX メトリックと NGINX Wallarm モジュールメトリック](#nginx-metrics-and-nginx-wallarm-module-metrics)
* [Postanalytics モジュールのメトリック](#postanalytics-module-metrics)

!!! warning "削除されたメトリックによる互換性のない変更"
    バージョン 4.0 から、Wallarm ノードは次のメトリックを収集しません。
    
    * `curl_json-wallarm_nginx/gauge-requests` - 代わりに [`curl_json-wallarm_nginx/gauge-abnormal`](#number-of-requests) メトリックを使用できます
    * `curl_json-wallarm_nginx/gauge-attacks`
    * `curl_json-wallarm_nginx/gauge-blocked`
    * `curl_json-wallarm_nginx/gauge-time_detect`
    * `curl_json-wallarm_nginx/derive-requests`
    * `curl_json-wallarm_nginx/derive-attacks`
    * `curl_json-wallarm_nginx/derive-blocked`
    * `curl_json-wallarm_nginx/derive-abnormal`
    * `curl_json-wallarm_nginx/derive-requests_lost`
    * `curl_json-wallarm_nginx/derive-tnt_errors`
    * `curl_json-wallarm_nginx/derive-api_errors`
    * `curl_json-wallarm_nginx/derive-segfaults`
    * `curl_json-wallarm_nginx/derive-memfaults`
    * `curl_json-wallarm_nginx/derive-softmemfaults`
    * `curl_json-wallarm_nginx/derive-time_detect`

## メトリック形式

`collectd` メトリックは次の表示があります:

```
host/plugin[-plugin_instance]/type[-type_instance]
```

メトリック形式の詳細はこの[リンク](../monitoring/intro.md#how-metrics-look)で利用可能です。

!!! note
    * 以下に利用可能なメトリックのリストには、ホスト名（`host/` 部分）が省略されています。
    * `collectd_nagios` ユーティリティを使用する場合、ホスト名は省略する必要があります。これは、`-H` パラメータを使用して別途設定されます（このユーティリティの使用に関する詳細情報は[doc-nagios-details]で）。

## Wallarm メトリックの種類

許可される Wallarm メトリックのタイプは以下のとおりです。タイプは `type` メトリックパラメータに格納されます。

* `gauge`は、測定値の数値表現です。値は増加と減少の両方ができます。

* `derive`は、前回の測定値から測定値の変化率です（導出値）。値は増加と減少の両方ができます。

* `counter`は `gauge` メトリックに似ています。値は増加するだけです。

##  NGINX メトリックおよび NGINX Wallarm モジュールのメトリック

### リクエスト数

フィルタノードのインストール以降、フィルタノードによって処理されたすべてのリクエストの数。

* **メトリック:** `curl_json-wallarm_nginx/gauge-abnormal`
* **メトリック値:**
    * `0` は `off` [モード](../configure-wallarm-mode.md#available-filtration-modes)
    * `>0` は `monitoring`/`safe_blocking`/`block` [モード](../configure-wallarm-mode.md#available-filtration-modes)
* **トラブルシューティングの推奨事項:**
    1. フィルタノードの設定が正しいことを確認してください。
    2. フィルタノードの操作を、[指示書](../installation-check-operation-en.md)に記載されているように確認します。テストアタックを 1 つ送信した後、値が `1` 増加する必要があります。

### 失われたリクエスト数

Postanalyticsモジュールによって解析されず、Wallarm APIに渡されなかったリクエスト数。これらのリクエストにはブロックルールが適用されますが、リクエストはWallarmアカウントには表示されず、次のリクエストの分析には考慮されません。この数値は、[`tnt_errors`] [anchor-tnt] と [`api_errors`] [anchor-api] の合計です。

* **メトリック:** `curl_json-wallarm_nginx/gauge-requests_lost`
* **メトリック値:** `0`, [`tnt_errors`][anchor-tnt] と [`api_errors`][anchor-api]の合計
* **トラブルシューティングの推奨事項:** [`tnt_errors`][anchor-tnt] と [`api_errors`][anchor-api] の指示に従ってください。

#### Postanalytics モジュールによって解析されなかったリクエスト数

Postanalytics モジュールによって解析されなかったリクエスト数。このメトリックは、Postanalytics モジュールへのリクエストの送信が設定されている場合に収集されます（[`wallarm_upstream_backend tarantool`](../configure-parameters-en.md#wallarm_upstream_backend)）。これらのリクエストにはブロックルールが適用されますが、リクエストはWallarmアカウントに表示されず、次のリクエストの分析には考慮されません。

* **メトリック:** `curl_json-wallarm_nginx/gauge-tnt_errors`
* **メトリック値:** `0`
* **トラブルシューティングの推奨事項:**
    * NGINX と Tarantool のログを取得し、エラーがあれば分析してください。
    * Tarantool サーバーアドレス（[`wallarm_tarantool_upstream`](../configure-parameters-en.md#wallarm_tarantool_upstream)）が正しいことを確認してください。
    * Tarantool に十分なメモリが[割り当てられていることを確認](../configuration-guides/allocate-resources-for-node.md#tarantool)してください。
    * 問題が解決されない場合は、[Wallarm サポートチーム](mailto:support@wallarm.com)に連絡して、上記のデータを提供してください。

#### Wallarm API に渡されなかったリクエスト数

Wallarm APIに渡されなかったリクエスト数。このメトリックは、Wallarm APIへのリクエストの渡し設定がある場合に収集されます（[`wallarm_upstream_backend api`](../configure-parameters-en.md#wallarm_upstream_backend)）。これらのリクエストにはブロックルールが適用されますが、リクエストはWallarmアカウントに表示されず、次のリクエストの分析には考慮されません。

* **メトリック:** `curl_json-wallarm_nginx/gauge-api_errors`
* **メトリック値:** `0`
* **トラブルシューティングの推奨事項:**
    * NGINX と Tarantool のログを取得し、エラーがあれば分析してください。
    * Wallarm API 設定（[`wallarm_api_conf`](../configure-parameters-en.md#wallarm_api_conf)）が正しいことを確認してください。
    * Tarantool に十分なメモリが[割り当てられていることを確認](../configuration-guides/allocate-resources-for-node.md#tarantool)してください。
    * 問題が解決されない場合は、[Wallarm サポートチーム](mailto:support@wallarm.com)に連絡して、上記のデータを提供してください。

### NGINX ワーカープロセスが異常終了した問題の数

NGINX ワーカープロセスが異常終了したための問題の数。異常終了の最も一般的な理由は、NGINXの致命的なエラーです。

* **メトリック:** `curl_json-wallarm_nginx/gauge-segfaults`
* **メトリック値:** `0`
* **トラブルシューティングの推奨事項:**
    1. `/usr/share/wallarm-common/collect-info.sh` スクリプトを使用して、現在の状態のデータを収集します。
    2. [Wallarm サポートチーム](mailto:support@wallarm.com)に調査のために生成されたファイルを提供してください。

### 仮想メモリ制限を超えた状況の数

仮想メモリ制限を超えた状況の数です。

* **メトリック:**
    * `curl_json-wallarm_nginx/gauge-memfaults` システムで制限を超えた場合
    * `curl_json-wallarm_nginx/gauge-softmemfaults` proton.db +lom の制限を超えた場合（[`wallarm_general_ruleset_memory_limit`](../configure-parameters-en.md#wallarm_general_ruleset_memory_limit)）
* **メトリック値:** `0`
* **トラブルシューティングの推奨事項:**
    1. `/usr/share/wallarm-common/collect-info.sh` スクリプトを使用して、現在の状態のデータを収集します。
    2. [Wallarm サポートチーム](mailto:support@wallarm.com)に調査のために生成されたファイルを提供してください。### proton.dbエラーの数

[仮想メモリ制限を超えた](#number-of-situations-exceeding-the-virtual-memory-limit)場合を除く、proton.dbエラーの数。

* **メトリック：** `curl_json-wallarm_nginx/gauge-proton_errors`
* **メトリック値：** `0`
* **トラブルシューティングの推奨事項：**
    1. NGINXログからエラーコードをコピーします（`wallarm: proton error: <ERROR_NUMBER>`）。
    1. `/usr/share/wallarm-common/collect-info.sh`スクリプトを使用して、現在の状態に関するデータを収集します。
    1. 収集したデータを[Wallarmサポートチーム](mailto:support@wallarm.com)に提供し、調査を依頼します。

### proton.dbのバージョン

使用中のproton.dbのバージョン。

* **メトリック：** `curl_json-wallarm_nginx/gauge-db_id`
* **メトリック値：** 制限なし

### proton.dbファイルの最後の更新時刻

proton.dbファイルの最後の更新時刻のUnix時間。

* **メトリック：** `curl_json-wallarm_nginx/gauge-db_apply_time`
* **メトリック値：** 制限なし

### カスタムルールセットのバージョン（以前の用語はLOM）

使用中の[カスタムルールセット][doc-lom]のバージョン。

* **メトリック：** `curl_json-wallarm_nginx/gauge-custom_ruleset_id`

    （Wallarmノード3.4およびそれ以降のバージョンでは、`curl_json-wallarm_nginx/gauge-lom_id`。旧名のメトリックはまだ収集されていますが、間もなく非推奨になります。）
* **メトリック値：** 制限なし

### カスタムルールセットの最後の更新時刻（以前の用語はLOM）

[カスタムルールセット][doc-lom]の最後の更新時刻のUnix時間。

* **メトリック：** `curl_json-wallarm_nginx/gauge-custom_ruleset_apply_time`

    （Wallarmノード3.4およびそれ以前のバージョンでは、`curl_json-wallarm_nginx/gauge-lom_apply_time`。旧名のメトリックはまだ収集されていますが、間もなく非推奨になります。）
* **メトリック値：** 制限なし

### proton.dbとLOMのペア

#### proton.dbおよびLOMペアの数

使用中のproton.dbおよび[LOM][doc-lom]ペアの数。

* **メトリック：** `curl_json-wallarm_nginx/gauge-proton_instances-total`
* **メトリック値：** `>0`
* **トラブルシューティングの推奨事項：**
    1. フィルターノードの設定が正しいことを確認してください。
    2. proton.dbファイルへのパスが正しく指定されていることを確認してください（[`wallarm_protondb_path`](../configure-parameters-en.md#wallarm_protondb_path)）。
    3. LOMファイルへのパスが正しく指定されていることを確認してください（[`wallarm_custom_ruleset_path`](../configure-parameters-en.md#wallarm_custom_ruleset_path)）。

#### 正常にダウンロードされたproton.dbおよびLOMペアの数

正常にダウンロードおよび読み取りが行われたproton.dbおよび[LOM][doc-lom]ペアの数。

* **メトリック：** `curl_json-wallarm_nginx/gauge-proton_instances-success`
* **メトリック値：** [`proton_instances-total`](#number-of-protondb-and-lom-pairs)と等しい
* **トラブルシューティングの推奨事項：**
    1. フィルターノードの設定が正しいことを確認してください。
    2. proton.dbファイルへのパスが正しく指定されていることを確認してください（[`wallarm_protondb_path`](../configure-parameters-en.md#wallarm_protondb_path)）。
    3. LOMファイルへのパスが正しく指定されていることを確認してください（[`wallarm_custom_ruleset_path`](../configure-parameters-en.md#wallarm_custom_ruleset_path)）。

#### 最後に保存されたファイルからダウンロードされたproton.dbおよびLOMペアの数

最後に保存されたファイルからダウンロードされたproton.dbおよび[LOM][doc-lom]ペアの数。これらのファイルには、最後に正常にダウンロードされたペアが保存されています。ペアが更新されたがダウンロードされなかった場合、最後に保存されたファイルからのデータが使用されます。

* **メトリック：** `curl_json-wallarm_nginx/gauge-proton_instances-fallback`
* **メトリック値：** `>0`
* **トラブルシューティングの推奨事項：**
    1. フィルターノードの設定が正しいことを確認してください。
    2. proton.dbファイルへのパスが正しく指定されていることを確認してください（[`wallarm_protondb_path`](../configure-parameters-en.md#wallarm_protondb_path)）。
    3. LOMファイルへのパスが正しく指定されていることを確認してください（[`wallarm_custom_ruleset_path`](../configure-parameters-en.md#wallarm_custom_ruleset_path)）。

#### 非アクティブなproton.dbおよびLOMペアの数

接続されているものの読み込めないproton.dbおよび[LOM][doc-lom]ペアの数。

* **メトリック：** `curl_json-wallarm_nginx/gauge-proton_instances-failed`
* **メトリック値：** `0`
* **トラブルシューティングの推奨事項：**
    1. フィルターノードの設定が正しいことを確認してください。
    2. proton.dbファイルへのパスが正しく指定されていることを確認してください（[`wallarm_protondb_path`](../configure-parameters-en.md#wallarm_protondb_path)）。
    3. LOMファイルへのパスが正しく指定されていることを確認してください（[`wallarm_custom_ruleset_path`](../configure-parameters-en.md#wallarm_custom_ruleset_path)）。

##  Postanalyticsモジュールのメトリック

### 最後に処理されたリクエストの識別子

最後に処理されたリクエストのID。値は増減します。

* **メトリック：**
    * `wallarm-tarantool/counter-last_request_id`（値が増加した場合）
    * `wallarm-tarantool/gauge-last_request_id`（値が増加または減少した場合）
* **メトリック値：** 制限なし
* **トラブルシューティングの推奨事項：** 入力リクエストがあるのに値が変わらない場合は、フィルターノードの設定が正しいことをチェックしてください

### 削除されたリクエスト

#### 削除されたリクエストの表示

攻撃が含まれたリクエストがpostanalyticsモジュールから削除され、[クラウド](../../about-wallarm/overview.md#cloud)に送信されなかったことを示すフラグ。

* **メトリック：** `wallarm-tarantool/gauge-export_drops_flag`
* **メトリック値：**
    * `0`（リクエストが削除されていない場合）
    * `1`（リクエストが削除された場合（メモリ不足、以下の手順に従ってください））
* **トラブルシューティングの推奨事項：**
    * [Tarantoolにより多くのメモリを割り当てます](../configuration-guides/allocate-resources-for-node.md#tarantool)。
    * これらの[指示](../installation-postanalytics-en.md)に従って、別のサーバプールにpostanalyticsモジュールをインストールします。

#### 削除されたリクエストの数

攻撃が含まれたリクエストがpostanalyticsモジュールから削除され、[クラウド](../../about-wallarm/overview.md#cloud)に送信されなかったリクエストの数。リクエストの攻撃数は値に影響しません。メトリックは、[`wallarm-tarantool/gauge-export_drops_flag: 1`](#indication-of-deleted-requests)の場合に収集されます。

モニタリング通知の設定時には、[`wallarm-tarantool/gauge-export_drops_flag`](#indication-of-deleted-requests)メトリックを使用することをお勧めします。

* **メトリック：** `wallarm-tarantool/gauge-export_drops`
* **メトリック値：** `0`
* **変化率：** `wallarm-tarantool/derive-export_drops`
* **トラブルシューティングの推奨事項：**
    * [Tarantoolにより多くのメモリを割り当てます](../configuration-guides/allocate-resources-for-node.md#tarantool)。
    * これらの[指示](../installation-postanalytics-en.md)に従って、別のサーバプールにpostanalyticsモジュールをインストールします。

### リクエストのエクスポート遅延（秒単位）

postanalyticsモジュールによるリクエストの記録と、検出された攻撃に関する情報がWallarmクラウドにダウンロードされるまでの遅延。

* **メトリック：** `wallarm-tarantool/gauge-export_delay`
* **メトリック値：**
    * 最適な場合は`<60`
    * 警告の場合は`>60`
    * クリティカルな場合は`>300`
* **トラブルシューティングの推奨事項：**
    * `/var/log/wallarm/export-attacks.log`ファイルからのログを読んでエラーを分析します。値が増加する原因として、フィルタノードからWallarmのAPIサービスへのネットワーク帯域幅が低いことが考えられます。
    * Tarantoolに十分なメモリが[割り当てられていることを確認してください](../configuration-guides/allocate-resources-for-node.md#tarantool)。割り当てられたメモリが超過した場合、[`tnt_errors`][anchor-tnt]メトリックも増加します。### Postanalyticsモジュールでのリクエストの保存時間（秒）

Postanalyticsモジュールがリクエストを保存している時間。この値は、post analyticsモジュールに割り当てられたメモリ量と、処理されるHTTPリクエストのサイズやプロパティに依存します。間隔が短いほど、検出アルゴリズムの性能が低下します。これは、アルゴリズムが履歴データに依存しているためです。結果として、間隔が短すぎると、攻撃者はブルートフォース攻撃を速く、かつ気づかれずに実行できます。この場合、攻撃者の行動履歴に関するデータが少なくなります。

* **メトリック:** `wallarm-tarantool/gauge-timeframe_size`
* **メトリック値:**
    * 最適: `>900`
    * 警告: `<900`
    * 危険: `<300`
* **トラブルシューティング推奨事項:**
    * [Tarantoolにより多くのメモリを割り当てる](../configuration-guides/allocate-resources-for-node.md#tarantool)。
    * Postanalyticsモジュールを別のサーバープールにインストールし、[手順](../installation-postanalytics-en.md)に従ってください。