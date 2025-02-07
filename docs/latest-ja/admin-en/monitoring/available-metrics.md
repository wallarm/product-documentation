[doc-nagios-details]:       fetching-metrics.md#exporting-metrics-using-the-collectd-nagios-utility

[doc-lom]:                  ../../glossary-en.md#custom-ruleset-the-former-term-is-lom

# 利用可能なメトリクス

* [メトリクス形式](#metric-format)
* [Wallarmメトリクスの種類](#types-of-wallarm-metrics)
* [NGINXメトリクスおよびNGINX Wallarmモジュールメトリクス](#nginx-metrics-and-nginx-wallarm-module-metrics)
* [Postanalyticsモジュールメトリクス](#postanalytics-module-metrics)

## メトリクス形式

collectdメトリクスは、次の形式で表示されます：

```
host/plugin[-plugin_instance]/type[-type_instance]
```

メトリクス形式の詳細な説明は、この[リンク](../monitoring/intro.md#metrics-format)でご覧になれます。

!!! note
    * 以下の利用可能なメトリクスのリストでは、ホスト名（`host/`部分）は省略されます。
    * collectd_nagiosユーティリティを使用する場合、ホスト名は省略されなければなりません。ホスト名は`-H`パラメーターを使用して個別に設定されます（詳細は[こちら][doc-nagios-details]をご確認ください）。

## Wallarmメトリクスの種類

以下に、許可されているWallarmメトリクスの種類について説明します。メトリクスの種類は、`type`パラメーターに格納されています。

* `gauge`は、測定値の数値表現です。値は増加および減少する可能性があります。
* `derive`は、前回の測定以降の測定値の変化率（導出値）です。値は増加および減少する可能性があります。
* `counter`は`gauge`メトリクスに類似しています。値は増加するのみです。

## NGINXメトリクスおよびNGINX Wallarmモジュールメトリクス 

### リクエスト数

フィルタノードのインストール以降に処理された全リクエストの数です。

* **メトリクス:** `curl_json-wallarm_nginx/gauge-abnormal`
* **メトリクス値:**
    * `0`（`off` [mode](../configure-wallarm-mode.md#available-filtration-modes)の場合）
    * `>0`（`monitoring`/`safe_blocking`/`block` [mode](../configure-wallarm-mode.md#available-filtration-modes)の場合）
* **トラブルシューティングの推奨事項:**
    1. フィルタノードの設定が正しいか確認してください。
    2. [手順](../installation-check-operation-en.md)に記載されたフィルタノードの動作を確認してください。テスト攻撃を1回送信した後、値が`1`ずつ増加することを確認してください。

### 失われたリクエスト数

postanalyticsモジュールで解析されず、Wallarm APIに送信されなかったリクエストの数です。これらのリクエストにはブロッキングルールが適用されますが、Wallarmアカウントには表示されず、次のリクエストの解析時に考慮されません。この数値は[`tnt_errors`][anchor-tnt]と[`api_errors`][anchor-api]の合計です。

* **メトリクス:** `curl_json-wallarm_nginx/gauge-requests_lost`
* **メトリクス値:** `0`（[`tnt_errors`][anchor-tnt]と[`api_errors`][anchor-api]の合計）
* **トラブルシューティングの推奨事項:** [`tnt_errors`][anchor-tnt]および[`api_errors`][anchor-api]に関する手順に従ってください。

#### postanalyticsモジュールで解析されなかったリクエスト数

postanalyticsモジュールで解析されなかったリクエストの数です。このメトリクスはpostanalyticsモジュールにリクエストを送信する設定がされている場合に収集されます（[`wallarm_upstream_backend tarantool`](../configure-parameters-en.md#wallarm_upstream_backend)）。これらのリクエストにはブロッキングルールが適用されますが、Wallarmアカウントには表示されず、次のリクエストの解析時に考慮されません。

* **メトリクス:** `curl_json-wallarm_nginx/gauge-tnt_errors`
* **メトリクス値:** `0`
* **トラブルシューティングの推奨事項:**
    * NGINXとTarantoolのログを取得し、エラーがあれば解析してください。
    * Tarantoolサーバのアドレス（[`wallarm_tarantool_upstream`](../configure-parameters-en.md#wallarm_tarantool_upstream)）が正しいか確認してください。
    * Tarantoolに十分なメモリが[割り当てられている](../configuration-guides/allocate-resources-for-node.md#tarantool)か確認してください。
    * 問題が解決されない場合は、[Wallarmサポートチーム](mailto:support@wallarm.com)に連絡し、上記のデータを提供してください。

#### Wallarm APIに送信されなかったリクエスト数

Wallarm APIに送信されなかったリクエストの数です。このメトリクスは、Wallarm APIへのリクエスト送信が設定されている場合に収集されます（[`wallarm_upstream_backend api`](../configure-parameters-en.md#wallarm_upstream_backend)）。これらのリクエストにはブロッキングルールが適用されますが、Wallarmアカウントには表示されず、次のリクエストの解析時に考慮されません。

* **メトリクス:** `curl_json-wallarm_nginx/gauge-api_errors`
* **メトリクス値:** `0`
* **トラブルシューティングの推奨事項:**
    * NGINXとTarantoolのログを取得し、エラーがあれば解析してください。
    * Wallarm APIの設定（[`wallarm_api_conf`](../configure-parameters-en.md#wallarm_api_conf)）が正しいか確認してください。
    * Tarantoolに十分なメモリが[割り当てられている](../configuration-guides/allocate-resources-for-node.md#tarantool)か確認してください。
    * 問題が解決されない場合は、[Wallarmサポートチーム](mailto:support@wallarm.com)に連絡し、上記のデータを提供してください。

### 異常終了したNGINXワーカープロセスの件数

NGINXワーカープロセスが異常終了した原因となる問題の数です。最も一般的な理由は、NGINXにおける重大なエラーです。

* **メトリクス:** `curl_json-wallarm_nginx/gauge-segfaults`
* **メトリクス値:** `0`
* **トラブルシューティングの推奨事項:**
    1. `/opt/wallarm/collect-info.sh`スクリプトを使用して現在の状態のデータを収集してください。
    2. 調査のために生成されたファイルを[Wallarmサポートチーム](mailto:support@wallarm.com)に提供してください。

### 仮想メモリ制限を超えた状況の数

仮想メモリ制限を超えた状況の数です。

* **メトリクス:**
    * システムの制限が超えた場合：`curl_json-wallarm_nginx/gauge-memfaults`
    * proton.db+lomの制限が超えた場合：`curl_json-wallarm_nginx/gauge-softmemfaults`（[`wallarm_general_ruleset_memory_limit`](../configure-parameters-en.md#wallarm_general_ruleset_memory_limit)に基づく）
* **メトリクス値:** `0`
* **トラブルシューティングの推奨事項:**
    1. `/opt/wallarm/collect-info.sh`スクリプトを使用して現在の状態のデータを収集してください。
    2. 調査のために生成されたファイルを[Wallarmサポートチーム](mailto:support@wallarm.com)に提供してください。

### proton.dbエラーの件数

仮想メモリ制限を超えた状況で発生したもの以外のproton.dbエラーの件数です。

* **メトリクス:** `curl_json-wallarm_nginx/gauge-proton_errors`
* **メトリクス値:** `0`
* **トラブルシューティングの推奨事項:**
    1. NGINXログからエラーコード（`wallarm: proton error: <ERROR_NUMBER>`）をコピーしてください。
    2. `/opt/wallarm/collect-info.sh`スクリプトを使用して現在の状態のデータを収集してください。
    3. 調査のため、収集したデータを[Wallarmサポートチーム](mailto:support@wallarm.com)に提供してください。

### proton.dbのバージョン

使用中のproton.dbのバージョンです。

* **メトリクス:** `curl_json-wallarm_nginx/gauge-db_id`
* **メトリクス値:** 制限なし

### proton.dbファイルの最終更新時刻

proton.dbファイルの最終更新のUnix時間です。

* **メトリクス:** `curl_json-wallarm_nginx/gauge-db_apply_time`
* **メトリクス値:** 制限なし

### カスタムルールセットのバージョン（旧称はLOM）

使用中の[カスタムルールセット][doc-lom]のバージョンです。

* **メトリクス:** `curl_json-wallarm_nginx/gauge-custom_ruleset_id`

    （Wallarmノード3.4以下では、`curl_json-wallarm_nginx/gauge-lom_id`が使用されています。この旧名称のメトリクスは依然として収集されますが、近いうちに廃止される予定です。）
* **メトリクス値:** 制限なし

### カスタムルールセットの最終更新時刻（旧称はLOM）

[カスタムルールセット][doc-lom]の最終更新のUnix時間です。

* **メトリクス:** `curl_json-wallarm_nginx/gauge-custom_ruleset_apply_time`

    （Wallarmノード3.4以下では、`curl_json-wallarm_nginx/gauge-lom_apply_time`が使用されています。この旧名称のメトリクスは依然として収集されますが、近いうちに廃止される予定です。）
* **メトリクス値:** 制限なし

### proton.dbとLOMのペア

#### proton.dbとLOMペアの数

使用中のproton.dbと[LOM][doc-lom]ペアの数です。

* **メトリクス:** `curl_json-wallarm_nginx/gauge-proton_instances-total`
* **メトリクス値:** `>0`
* **トラブルシューティングの推奨事項:**
    1. フィルタノードの設定が正しいか確認してください。
    2. proton.dbファイルのパスが正しく指定されているか確認してください（[`wallarm_protondb_path`](../configure-parameters-en.md#wallarm_protondb_path)）。
    3. LOMファイルのパスが正しく指定されているか確認してください（[`wallarm_custom_ruleset_path`](../configure-parameters-en.md#wallarm_custom_ruleset_path)）。

#### 正常にダウンロードされたproton.dbとLOMペアの数

正常にダウンロードされ読み取られたproton.dbと[LOM][doc-lom]ペアの数です。

* **メトリクス:** `curl_json-wallarm_nginx/gauge-proton_instances-success`
* **メトリクス値:** [`proton_instances-total`](#number-of-protondb-and-lom-pairs)と等しい
* **トラブルシューティングの推奨事項:**
    1. フィルタノードの設定が正しいか確認してください。
    2. proton.dbファイルのパスが正しく指定されているか確認してください（[`wallarm_protondb_path`](../configure-parameters-en.md#wallarm_protondb_path)）。
    3. LOMファイルのパスが正しく指定されているか確認してください（[`wallarm_custom_ruleset_path`](../configure-parameters-en.md#wallarm_custom_ruleset_path)）。

#### 最後に保存されたファイルからダウンロードされたproton.dbとLOMペアの数

最後に保存されたファイルからダウンロードされたproton.dbと[LOM][doc-lom]ペアの数です。これらのファイルは最後に正常にダウンロードされたペアを保存します。ペアが更新されたがダウンロードされなかった場合は、最後に保存されたファイルのデータが使用されます。

* **メトリクス:** `curl_json-wallarm_nginx/gauge-proton_instances-fallback`
* **メトリクス値:** `>0`
* **トラブルシューティングの推奨事項:**
    1. フィルタノードの設定が正しいか確認してください。
    2. proton.dbファイルのパスが正しく指定されているか確認してください（[`wallarm_protondb_path`](../configure-parameters-en.md#wallarm_protondb_path)）。
    3. LOMファイルのパスが正しく指定されているか確認してください（[`wallarm_custom_ruleset_path`](../configure-parameters-en.md#wallarm_custom_ruleset_path)）。

#### 読み取れなかったproton.dbとLOMペアの数

読み取りに失敗した接続済みのproton.dbと[LOM][doc-lom]ペアの数です。

* **メトリクス:** `curl_json-wallarm_nginx/gauge-proton_instances-failed`
* **メトリクス値:** `0`
* **トラブルシューティングの推奨事項:**
    1. フィルタノードの設定が正しいか確認してください。
    2. proton.dbファイルのパスが正しく指定されているか確認してください（[`wallarm_protondb_path`](../configure-parameters-en.md#wallarm_protondb_path)）。
    3. LOMファイルのパスが正しく指定されているか確認してください（[`wallarm_custom_ruleset_path`](../configure-parameters-en.md#wallarm_custom_ruleset_path)）。

## Postanalyticsモジュールメトリクス

### 最後に処理されたリクエストの識別子

最後に処理されたリクエストのIDです。値は増加および減少する可能性があります。

* **メトリクス:**
    * 値が増加する場合：`wallarm-tarantool/counter-last_request_id`
    * 値が増加または減少する場合：`wallarm-tarantool/gauge-last_request_id`
* **メトリクス値:** 制限なし
* **トラブルシューティングの推奨事項:** リクエストがあるにもかかわらず値が変化しない場合、フィルタノードの設定が正しいか確認してください。

### 削除されたリクエスト

#### 削除されたリクエストの表示

攻撃を含むリクエストがpostanalyticsモジュールから削除され、[cloud](../../about-wallarm/overview.md#cloud)に送信されなかったことを示すフラグです。

* **メトリクス:** `wallarm-tarantool/gauge-export_drops_flag`
* **メトリクス値:**
    * リクエストが削除されていない場合：`0`
    * リクエストが削除された場合：`1`（メモリ不足の場合、以下の手順に従ってください）
* **トラブルシューティングの推奨事項:**
    * Tarantoolに[より多くのメモリを割り当てる](../configuration-guides/allocate-resources-for-node.md#tarantool)。
    * これらの[手順](../installation-postanalytics-en.md)に従って、postanalyticsモジュールを別のサーバプールにインストールしてください。

#### 削除されたリクエスト数

攻撃を含むリクエストがpostanalyticsモジュールから削除され、[cloud](../../about-wallarm/overview.md#cloud)に送信されなかったリクエストの数です。リクエスト内の攻撃数は値に影響しません。このメトリクスは[`wallarm-tarantool/gauge-export_drops_flag: 1`](#indication-of-deleted-requests)の場合に収集されます。

監視通知を設定する際は、[`wallarm-tarantool/gauge-export_drops_flag`](#indication-of-deleted-requests)メトリクスを使用することを推奨します。

* **メトリクス:** `wallarm-tarantool/gauge-export_drops`
* **メトリクス値:** `0`
* **変化率:** `wallarm-tarantool/derive-export_drops`
* **トラブルシューティングの推奨事項:**
    * Tarantoolに[より多くのメモリを割り当てる](../configuration-guides/allocate-resources-for-node.md#tarantool)。
    * [手順](../installation-postanalytics-en.md)に従って、postanalyticsモジュールを別のサーバプールにインストールしてください。

### リクエストエクスポート遅延（秒単位）

postanalyticsモジュールによるリクエストの記録と、検出された攻撃に関する情報がWallarm cloudにダウンロードされるまでの遅延時間です。

* **メトリクス:** `wallarm-tarantool/gauge-export_delay`
* **メトリクス値:**
    * `<60`の場合は最適
    * `>60`の場合は警告
    * `>300`の場合は重大
* **トラブルシューティングの推奨事項:**
    * `/opt/wallarm/var/log/wallarm/wcli-out.log`ファイルのログを確認してください。値の増加は、フィルタノードからWallarmのAPIサービスへのネットワークスループットの低下が原因となる場合があります。
    * Tarantoolに十分なメモリが[割り当てられている](../configuration-guides/allocate-resources-for-node.md#tarantool)か確認してください。割り当てられたメモリを超えた場合、[`tnt_errors`][anchor-tnt]メトリクスも増加します。

### Postanalyticsモジュールでリクエストが保存される時間（秒単位）

postanalyticsモジュールがリクエストを保存する時間です。値は、postanalyticsモジュールに割り当てられたメモリの量および処理されたHTTPリクエストのサイズと特性に依存します。間隔が短いほど、検知アルゴリズムの性能は低下します—これは歴史的データに依存しているためです。その結果、間隔が短すぎると、攻撃者はより速く、かつ気付かれることなくブルートフォース攻撃を実行できるため、攻撃者の行動履歴データが少なくなります。

* **メトリクス:** `wallarm-tarantool/gauge-timeframe_size`
* **メトリクス値:**
    * `>900`の場合は最適
    * `<900`の場合は警告
    * `<300`の場合は重大
* **トラブルシューティングの推奨事項:**
    * Tarantoolに[より多くのメモリを割り当てる](../configuration-guides/allocate-resources-for-node.md#tarantool)。
    * [手順](../installation-postanalytics-en.md)に従って、postanalyticsモジュールを別のサーバプールにインストールしてください。