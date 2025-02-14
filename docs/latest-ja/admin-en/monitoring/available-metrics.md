[doc-nagios-details]:       fetching-metrics.md#exporting-metrics-using-the-collectd-nagios-utility

[doc-lom]:                  ../../glossary-en.md#custom-ruleset-the-former-term-is-lom

[anchor-tnt]:               #number-of-requests-not-analyzed-by-the-postanalytics-module
[anchor-api]:               #number-of-requests-not-passed-to-the-wallarm-api
[anchor-metric-1]:          #indication-that-the-postanalytics-module-drops-requests

#   利用可能なメトリクス

* [メトリクスフォーマット](#metric-format)
* [Wallarmのメトリクスタイプ](#types-of-wallarm-metrics)
* [NGINXメトリクスおよびNGINX Wallarmモジュールメトリクス](#nginx-metrics-and-nginx-wallarm-module-metrics)
* [Postanalyticsモジュールメトリクス](#postanalytics-module-metrics)

!!! warning "削除されたメトリクスによる破壊的な変更"
    バージョン4.0から、Wallarmノードは以下のメトリクスを収集しません。：
    
    * `wallarm_nginx/gauge-requests` - 代わりに[`wallarm_nginx/gauge-abnormal`](#number-of-requests)メトリクスを使用できます
    * `wallarm_nginx/gauge-attacks`
    * `wallarm_nginx/gauge-blocked`
    * `wallarm_nginx/gauge-time_detect`
    * `wallarm_nginx/derive-requests`
    * `wallarm_nginx/derive-attacks`
    * `wallarm_nginx/derive-blocked`
    * `wallarm_nginx/derive-abnormal`
    * `wallarm_nginx/derive-requests_lost`
    * `wallarm_nginx/derive-tnt_errors`
    * `wallarm_nginx/derive-api_errors`
    * `wallarm_nginx/derive-segfaults`
    * `wallarm_nginx/derive-memfaults`
    * `wallarm_nginx/derive-softmemfaults`
    * `wallarm_nginx/derive-time_detect`

## メトリクスフォーマット

`collectd`メトリクスは次の形式を持っています。

```
host/plugin[-plugin_instance]/type[-type_instance]
```

メトリクスフォーマットの詳細な説明はこの[リンク](../monitoring/intro.md#how-metrics-look)で利用可能です。

!!! note
    * 下の利用可能なメトリクスのリストでは、ホスト名（`host/`部分）は省略されています。
    * `collectd_nagios`ユーティリティを使用する場合、ホスト名は省略する必要があります。それは`-H`パラメータを使用して別途設定されます（このユーティリティの使用については[詳細][doc-nagios-details]）。

## Warningのメトリクス類型

以下に示すように、許可されるWallarmメトリクスのタイプがあります。タイプは`type`メトリクスパラメータに保存されます。

* `gauge`は測定値の数値表現です。値は増減両方可能です。

* `derive`は前回の測定から測定値の変化率です（派生値）。値は増減両方可能です。

* `counter`は`gauge`メトリクスに似ています。値は増加するだけです。

##  NGINXメトリクスおよびNGINX Wallarmモジュールメトリクス 

### リクエストの数

フィルタノードがそのインストール以降に処理したすべてのリクエストの数。

* **メトリクス:** `wallarm_nginx/gauge-abnormal`
* **メトリクス値:**
    * `0`は`off` [モード](../configure-wallarm-mode.md#available-filtration-modes)の場合
    * `>0`は`monitoring`/`safe_blocking`/`block` [モード](../configure-wallarm-mode.md#available-filtration-modes)の場合
* **トラブルシューティングの推奨事項：**
    1. フィルターノード設定が正しいことを確認します。
    2. [手順](../installation-check-operation-en.md)に従ってフィルタノードの操作を確認します。1つのテストアタックを送信した後、値は`1`ずつ増加するはずです。

### 見落とされたリクエストの数

Postanalyticsモジュールによって分析されず、Wallarm APIに渡されなかったリクエストの数。これらのリクエストに対してはブロックルールが適用されますが、リクエストはWallarmアカウントに表示されず、次のリクエストの分析には考慮されません。値は[`tnt_errors`][anchor-tnt]および[`api_errors`][anchor-api]の合計です。

* **メトリクス:** `wallarm_nginx/gauge-requests_lost`
* **メトリクス値:** `0`、[`tnt_errors`][anchor-tnt]および[`api_errors`][anchor-api]の合計
* **トラブルシューティングの推奨事項:** [`tnt_errors`][anchor-tnt]と[`api_errors`][anchor-api]の手順に従ってください。

#### Postanalyticsモジュールによって解析されないリクエストの数

Postanalyticsモジュールによって解析されなかったリクエストの数。このメトリクスは、Postanalyticsモジュールへのリクエスト送信が設定されている場合に収集されます（[`wallarm_upstream_backend tarantool`](../configure-parameters-en.md#wallarm_upstream_backend)）。これらのリクエストに対してはブロックルールが適用されますが、リクエストはWallarmアカウントに表示されず、次のリクエストの分析には考慮されません。

* **メトリクス:** `wallarm_nginx/gauge-tnt_errors`
* **メトリクス値:** `0`
* **トラブルシューティングの推奨事項：**
    * NGINXとTarantoolのログを取得し、エラーがあれば分析します。
    * Tarantoolサーバーアドレス（[`wallarm_tarantool_upstream`](../configure-parameters-en.md#wallarm_tarantool_upstream)）が正しいことを確認します。
    * Tarantoolに十分なメモリが[割り当てられている](../configuration-guides/allocate-resources-for-node.md#tarantool)ことを確認します。
    * 問題が解決しない場合は、上記のデータを提供して[Wallarmサポートチーム](mailto:support@wallarm.com)に連絡します。

#### Wallarm APIに渡されなかったリクエストの数

Wallarm APIに渡されなかったリクエストの数。このメトリクスは、Wallarm APIへのリクエストの通過が設定されている場合に収集されます（[`wallarm_upstream_backend api`](../configure-parameters-en.md#wallarm_upstream_backend)）。これらのリクエストに対してはブロックルールが適用されますが、リクエストはWallarmアカウントに表示されず、次のリクエストの分析には考慮されません。

* **メトリクス:** `wallarm_nginx/gauge-api_errors`
* **メトリクス値:** `0`
* **トラブルシューティングの推奨事項：**
    * NGINXとTarantoolのログを取得し、エラーがあれば分析します。
    * Wallarm API設定（[`wallarm_api_conf`](../configure-parameters-en.md#wallarm_api_conf)）が正しいことを確認します。
    * Tarantoolに十分なメモリが[割り当てられている](../configuration-guides/allocate-resources-for-node.md#tarantool)ことを確認します。
    * 問題が解決しない場合は、上記のデータを提供して[Wallarmサポートチーム](mailto:support@wallarm.com)に連絡します。

### NGINX Workerプロセスが異常終了した問題の数

問題が発生し、それがNGINXワーカープロセスの異常終了につながった回数。異常終了の最も一般的な理由はNGINXの重大なエラーです。

* **メトリクス:** `wallarm_nginx/gauge-segfaults`
* **メトリクス値:** `0`
* **トラブルシューティングの推奨事項：**
    1. `/usr/share/wallarm-common/collect-info.sh`スクリプトを使用して現在の状態についてのデータを収集します。
    2. 調査のために生成されたファイルを[Wallarmサポートチーム](mailto:support@wallarm.com)に提供します。

### 仮想メモリ制限を超えた状況の数

仮想メモリ制限を超えた状況の数。

* **メトリクス：**
    * `wallarm_nginx/gauge-memfaults`あなたのシステムの制限が超えた場合
    * `wallarm_nginx/gauge-softmemfaults`プロトン.db + lomの制限が超えた場合([`wallarm_general_ruleset_memory_limit`](../configure-parameters-en.md#wallarm_general_ruleset_memory_limit))
* **メトリクス値:** `0`
* **トラブルシューティングの推奨事項：**
    1. `/usr/share/wallarm-common/collect-info.sh`スクリプトを使用して現在の状態についてのデータを収集します。
    2. 調査のために生成されたファイルを[Wallarmサポートチーム](mailto:support@wallarm.com)に提供します。

### proton.dbのエラーの数

仮想メモリの制限を超えた状況が原因となった以外のproton.dbのエラーの数。

* **メトリクス:** `wallarm_nginx/gauge-proton_errors`
* **メトリクス値:** `0`
* **トラブルシューティングの推奨事項：**
    1. NGINXログからエラーコードをコピーします（`wallarm: proton error: <ERROR_NUMBER>`）。
    1. `/usr/share/wallarm-common/collect-info.sh`スクリプトを使用して現在の状態についてのデータを収集します。
    1. 収集したデータを調査のために[Wallarmサポートチーム](mailto:support@wallarm.com)に提供します。

### proton.dbのバージョン

使用中のproton.dbのバージョン。

* **メトリクス:** `wallarm_nginx/gauge-db_id`
* **メトリクス値:** 制限無し

### proton.dbファイルの最終更新時間

proton.dbファイルの最終更新のUnix時間。

* **メトリクス:** `wallarm_nginx/gauge-db_apply_time`
* **メトリクス値:** 制限無し

### カスタムルールセットのバージョン（旧用語はLOM）

使用中の[custumルールセット][doc-lom]のバージョン。

* **メトリクス:** `wallarm_nginx/gauge-custom_ruleset_id`

    (Wallarmノード3.4およびそれ以下では、`wallarm_nginx/gauge-lom_id`。元の名前のメトリクスはまだ収集されていますが、まもなく非推奨となります。)
* **メトリクス値:** 制限無し

### カスタムルールセットの最終更新時間（旧用語はLOM）

[custumルールセット][doc-lom]の最終更新のUnix時間。

* **メトリクス:** `wallarm_nginx/gauge-custom_ruleset_apply_time`

    (Wallarmノード3.4およびそれ以下では、`wallarm_nginx/gauge-lom_apply_time`。元の名前のメトリクスはまだ収集されていますが、まもなく非推奨となります。)
* **メトリクス値:** 制限無し

### proton.dbとLOMのペア

#### proton.dbとLOMペアの数

使用中のproton.dbと[LOM][doc-lom]ペアの数。

* **メトリクス:** `wallarm_nginx/gauge-proton_instances-total`
* **メトリクス値:** `>0`
* **トラブルシューティングの推奨事項：**
    1. フィルターノードの設定が正しいか確認します。
    2. proton.dbファイルへのパスが正確に指定されていることを確認します（[`wallarm_protondb_path`](../configure-parameters-en.md#wallarm_protondb_path)）。
    3. LOMファイルへのパスが正確に指定されていることを確認します（[`wallarm_custom_ruleset_path`](../configure-parameters-en.md#wallarm_custom_ruleset_path)）。

#### 正常にダウンロードされたproton.dbとLOMペアの数

正常にダウンロードされ、読み込まれたproton.dbと[LOM][doc-lom]ペアの数。

* **メトリクス:** `wallarm_nginx/gauge-proton_instances-success`
* **メトリクス値:** [`proton_instances-total`](#number-of-protondb-and-lom-pairs)と等しい
* **トラブルシューティングの推奨事項：**
    1. フィルターノードの設定が正しいか確認します。
    2. proton.dbファイルへのパスが正確に指定されていることを確認します（[`wallarm_protondb_path`](../configure-parameters-en.md#wallarm_protondb_path)）。
    3. LOMファイルへのパスが正確に指定されていることを確認します([`wallarm_custom_ruleset_path`](../configure-parameters-en.md#wallarm_custom_ruleset_path))。

#### 最後に保存されたファイルからダウンロードされたproton.dbとLOMペアの数

最後に保存されたファイルからダウンロードされたproton.dbと[LOM][doc-lom]ペアの数。これらのファイルは、最後に正常にダウンロードされたペアを保存しています。ペアが更新されてダウンロードされなかった場合、最後に保存されたファイルのデータが使用されます。

* **メトリクス:** `wallarm_nginx/gauge-proton_instances-fallback`
* **メトリクス値:** `>0`
* **トラブルシューティングの推奨事項：**
    1. フィルターノードの設定が正しいか確認します。
    2. proton.dbファイルへのパスが正確に指定されていることを確認します([`wallarm_protondb_path`](../configure-parameters-en.md#wallarm_protondb_path)）。
    3. LOMファイルへのパスが正確に指定されていることを確認します([`wallarm_custom_ruleset_path`](../configure-parameters-en.md#wallarm_custom_ruleset_path))。

#### 非アクティブなproton.dbとLOMペアの数

読み取れなかった接続されたproton.dbと[LOM][doc-lom]ペアの数。

* **メトリクス:** `wallarm_nginx/gauge-proton_instances-failed`
* **メトリクス値:** `0`
* **トラブルシューティングの推奨事項：**
    1. フィルターノードの設定が正しいか確認します。
    2. proton.dbファイルへのパスが正確に指定されていることを確認します([`wallarm_protondb_path`](../configure-parameters-en.md#wallarm_protondb_path)）。
    3. LOMファイルへのパスが正確に指定されていることを確認します([`wallarm_custom_ruleset_path`](../configure-parameters-en.md#wallarm_custom_ruleset_path))。

##  Postanalyticsモジュールメトリクス

### 最後に処理されたリクエストの識別子

最後に処理されたリクエストのID。値は増加または減少することができます。

* **メトリクス：**
    * `wallarm-tarantool/counter-last_request_id`値が増加した場合
    * `wallarm-tarantool/gauge-last_request_id`値が増加または減少した場合
* **メトリクス値:** 製限なし
* **トラブルシューティングの推奨事項:** 受信リクエストがあるが値が変化しない場合は、フィルタノードの設定が正しいことを確認します。

### 削除されたリクエスト

#### リクエストの削除を示す指標

アタックを含むリクエストがpostanalyticsモジュールから削除され、[クラウド](../../about-wallarm/overview.md#cloud)に送信されなかったことを示すフラグ。

* **メトリクス:** `wallarm-tarantool/gauge-export_drops_flag`
* **メトリクス値：**
    * `0`リクエストが削除されていない場合
    * `1`リクエストが削除されている場合（メモリ不足、以下の手順に従ってください）
* **トラブルシューティングの推奨事項：**
    * [Tarantoolにより多くのメモリを割り当てます](../configuration-guides/allocate-resources-for-node.md#tarantool)。
    * これらの[手順](../installation-postanalytics-en.md)に従って、postanalyticsモジュールを別のサーバープールにインストールします。

#### 削除されたリクエストの数

アタックを含むリクエストがpostanalyticsモジュールから削除され、[クラウド](../../about-wallarm/overview.md#cloud)に送信されなかった数。リクエストに含まれる攻撃の数は値に影響しません。メトリクスは[`wallarm-tarantool/gauge-export_drops_flag: 1`](#indication-of-deleted-requests)の場合に収集されます。

モニタリング通知を設定する場合は、[`wallarm-tarantool/gauge-export_drops_flag`](#indication-of-deleted-requests)メトリクスを使用することをお勧めします。

* **メトリクス:** `wallarm-tarantool/gauge-export_drops`
* **メトリクス値:** `0`
* **変化率:** `wallarm-tarantool/derive-export_drops`
* **トラブルシューティングの推奨事項：**
    * [Tarantoolにより多くのメモリを割り当てます](../configuration-guides/allocate-resources-for-node.md#tarantool)。
    * これらの[手順](../installation-postanalytics-en.md)に従って、postanalyticsモジュールを別のサーバープールにインストールします。

### リクエストエクスポート遅延（秒）

postanalyticsモジュールによるリクエストの記録と、攻撃に関する情報をWallarmクラウドにダウンロードするまでの遅延。

* **メトリクス:** `wallarm-tarantool/gauge-export_delay`
* **メトリクス値:**
    * 最適：<60
    * 警告：>60
    * 重要：>300
* **トラブルシューティングの推奨事項：**
    * `/var/log/wallarm/export-attacks.log`ファイルからログを読み、エラーを分析します。値が増加する原因として、フィルターノードからWallarmのAPIサービスへのネットワークスループットが低い可能性があります。
    * Tarantoolに十分なメモリが[割り当てられている](../configuration-guides/allocate-resources-for-node.md#tarantool)ことを確認します。割り当てられたメモリが超過すると、[`tnt_errors`][anchor-tnt]メトリクスも増加します。

### リクエストをPostanalyticsモジュールに保存する時間（秒）

Postanalyticsモジュールがリクエストを保存する時間。値は、Postanalyticsモジュールに割り当てられたメモリの量と、処理されたHTTPリクエストのサイズと特性に依存します。間隔が短いほど、検出アルゴリズムの精度が悪くなります。これは、それらが履歴データに依存しているためです。したがって、間隔が短すぎる場合、攻撃者は早くブルートフォース攻撃を実行でき、気付かれずに済む可能性があります。この場合、攻撃者の行動履歴に関するデータが少なくなります。

* **メトリクス:** `wallarm-tarantool/gauge-timeframe_size`
* **メトリクス値:**
    * 最適：>900
    * 警告：<900
    * 重要：<300
* **トラブルシューティングの推奨事項：**
    * [Tarantoolにより多くのメモリを割り当てます](../configuration-guides/allocate-resources-for-node.md#tarantool)。
    * これらの[手順](../installation-postanalytics-en.md)に従って、postanalyticsモジュールを別のサーバープールにインストールします。