# Wallarm NGINXノードのためのリソース割当

Wallarm NGINXノードに割り当てるメモリおよびCPUリソースの量は、リクエスト処理の品質および速度を決定します。本手順書ではセルフホスト型NGINXノードへのメモリ割当の推奨事項について説明します。

フィルタリングノードには、主に次の2つのメモリおよびCPUリソースを消費するコンポーネントがあります。

* [Tarantool](#tarantool)（**postanalyticsモジュール**とも呼ばれます）。これはローカルデータ分析バックエンドであり、フィルタリングノードにおける主要なメモリ消費コンポーネントです。
* [NGINX](#nginx)は、主要なフィルタリングノードでありリバースプロキシコンポーネントです。

NGINXのCPU使用率は、RPSレベル、リクエストおよびレスポンスの平均サイズ、ノードで処理されるカスタムルールセットのルール数、Base64などのデータエンコーディングやデータ圧縮などの種類やレイヤにより大きく影響されます。

平均的に、1つのCPUコアは約500 RPSを処理できます。プロダクションモードで運用する場合、NGINXプロセスには少なくとも1つのCPUコア、Tarantoolプロセスには1つのコアを割り当てることを推奨します。多くの場合、初めはフィルタリングノードに対してリソースを多めに割当し、実際のプロダクショントラフィックレベルにおけるCPUおよびメモリ使用率を確認の上、リソース割当を適正なレベルに段階的に削減することを推奨します（トラフィックスパイクおよびノード冗長性に対して少なくとも2倍のヘッドルームが必要です）。

## Tarantool

--8<-- "../include/allocate-resources-for-waf-node/tarantool-memory.md"

### Kubernetes Ingress Controllerにおけるリソース割当

--8<-- "../include/allocate-resources-for-waf-node/tarantool-memory-ingress-controller.md"

### All-in-One Installerを使用している場合のリソース割当

Tarantoolのメモリサイズは、`/opt/wallarm/env.list`設定ファイルの`SLAB_ALLOC_ARENA`属性で制御されています。メモリを割当するには、以下の手順に従ってください。

1. `/opt/wallarm/env.list`ファイルを編集のために開きます:

    ```bash
    sudo vim /opt/wallarm/env.list
    ```
2. `SLAB_ALLOC_ARENA`属性にメモリサイズを設定します。値は整数または浮動小数点数で指定可能です（小数点はピリオド `.` を使用します）。例:

    ```
    SLAB_ALLOC_ARENA=1.0
    ```
3. Wallarmサービスを再起動します:

    ```
    sudo systemctl restart wallarm.service
    ```

### その他のデプロイメントオプションにおけるリソース割当

Tarantoolのメモリサイズは、`/etc/default/wallarm-tarantool`設定ファイルの`SLAB_ALLOC_ARENA`属性で制御されています。メモリを割当するには、以下の手順に従ってください。

<ol start="1"><li>Tarantoolの設定ファイルを編集のために開きます:</li></ol>

=== "Debian 10.x (buster)"
    ```bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "Debian 11.x (bullseye)"
    ```bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "Ubuntu 18.04 LTS (bionic)"
    ```bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "Ubuntu 20.04 LTS (focal)"
    ```bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "Ubuntu 22.04 LTS (jammy)"
    ```bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "CentOS 7.x"
    ```bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```
=== "Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```
=== "RHEL 8.x"
    ```bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```

<ol start="2"><li><code>SLAB_ALLOC_ARENA</code>属性にメモリサイズを設定します。値は整数または浮動小数点数で指定可能です（小数点は<code>.</code>を使用します）。例:</li></ol>

```
SLAB_ALLOC_ARENA=1.0
```

<ol start="3"><li>Tarantoolを再起動します:</li></ol>

=== "Debian 10.x (buster)"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "Debian 11.x (bullseye)"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "Ubuntu 18.04 LTS (bionic)"
    ```bash
    sudo service wallarm-tarantool restart
    ```
=== "Ubuntu 20.04 LTS (focal)"
    ```bash
    sudo service wallarm-tarantool restart
    ```
=== "Ubuntu 22.04 LTS (jammy)"
    ```bash
    sudo service wallarm-tarantool restart
    ```
=== "CentOS 7.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

現在のフィルタリングノードの負荷レベルにおいてTarantoolインスタンスがどの程度の期間、トラフィックの詳細を保持可能かを確認するには、[`wallarm-tarantool/gauge-timeframe_size`](../monitoring/available-metrics.md#time-of-storing-requests-in-the-postanalytics-module-in-seconds)監視メトリクスをご利用ください。

## NGINX

NGINXのメモリ消費は様々な要因に左右されます。平均的な消費量は、おおよそ以下のように見積もることができます:

```
同時接続リクエスト数 * 平均リクエストサイズ * 3
```

例:

* フィルタリングノードがピーク時に10000の同時リクエストを処理し、
* 平均リクエストサイズが5 kBの場合、

NGINXのメモリ消費は次のように見積もることができます:

```
10000 * 5 kB * 3 = 150000 kB (約150 MB)
```

**メモリ割当を行うには:**

* NGINX Ingress controller pod（`ingress-controller`）の場合、`values.yaml`ファイルの以下のセクションを`helm install`または`helm upgrade`の`--set`オプションを使用して設定します:
    ```
    controller:
      resources:
        limits:
          cpu: 400m
          memory: 3280Mi
        requests:
          cpu: 200m
          memory: 1640Mi
    ```

    パラメータを変更するコマンド例:

    === "Ingress controller installation"
        ```bash
        helm install --set controller.resources.limits.cpu='2000m',controller.resources.limits.memory='3280Mi' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

        また、正しいIngress controllerのインストールには[他のパラメータ](../configure-kubernetes-en.md#additional-settings-for-helm-chart)も必要です。これらも`--set`オプションで渡してください。
    === "Updating Ingress controller parameters"
        ```bash
        helm upgrade --reuse-values --set controller.resources.limits.cpu='2000m',controller.resources.limits.memory='3280Mi' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

* その他のデプロイメントオプションの場合、NGINXの設定ファイルを使用してください。

## トラブルシューティング

Wallarmノードが予想以上に多くのメモリおよびCPUリソースを消費している場合、リソース使用量を削減するため、[CPU高使用率のトラブルシューティング](../../faq/cpu.md)の記事をご確認の上、記載された手順に従ってください。