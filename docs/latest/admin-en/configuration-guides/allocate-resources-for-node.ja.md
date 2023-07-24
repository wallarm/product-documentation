# Wallarm Nodeのリソース割り当て

フィルタリングノードに割り当てられるメモリ量は、リクエスト処理の品質と速度に影響します。これらの指示には、フィルタリングノードのメモリ割り当てに関する推奨事項が説明されています。

フィルタリングノードには、2つの主なメモリ消費者があります。

* [Tarantool](#tarantool) は、**postanalyticsモジュール** とも呼ばれています。これは、フィルタリングノード内での主なメモリ消費者であるローカルデータ分析バックエンドです。
* [NGINX](#nginx) は、主要なフィルタリングノードであり、リバースプロキシコンポーネントです。

## タランツール

--8<-- "../include/allocate-resources-for-waf-node/tarantool-memory.ja.md"

### Kubernetes Ingress Controller のリソース割り当て

--8<-- "../include/allocate-resources-for-waf-node/tarantool-memory-ingress-controller.ja.md"

### その他のデプロイメントオプションでのリソース割り当て

Tarantoolのメモリ割り当ては、`/etc/default/wallarm-tarantool`設定ファイルの`SLAB_ALLOC_ARENA`属性を使用して制御されます。メモリを割り当てるには：

<ol start="1"><li>Tarantoolの構成ファイルを編集用に開きます：</li></ol>

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

<ol start="2"><li><code>SLAB_ALLOC_ARENA</code> 属性をメモリサイズに設定します。整数または小数（ドット <code>.</code> が小数点区切り）の値で指定できます。例：</li></ol>

```
SLAB_ALLOC_ARENA=10.4
```

<ol start="3"><li>Tarantoolを再起動します：</li></ol>

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

現在のフィルタリングノードの負荷レベルで、Tarantoolインスタンスがトラフィックの詳細をどのくらいの期間保持できるかを知るには、[`wallarm-tarantool/gauge-timeframe_size`](../monitoring/available-metrics.md#time-of-storing-requests-in-the-postanalytics-module-in-seconds)モニタリングメトリックを使用できます。

## NGINX

NGINXのメモリ消費量は多くの要因に依存します。平均的には以下のように推定できます。

```
同時リクエスト数 * 平均リクエストサイズ * 3
```

例：

* フィルタリングノードは、ピーク時に10000の同時リクエストを処理しています。
* 平均リクエストサイズは5kBです。

NGINXのメモリ消費量は次のように推定できます。

```
10000 * 5 kB * 3 = 150000 kB（または〜150 MB）
```

**メモリ量を割り当てるには：**

* NGINX Ingressコントローラーポッド (`ingress-controller`) に対しては、`helm install`または`helm upgrade` の `--set` オプションを使用して、`values.yaml` ファイルの以下のセクションを設定します：
    ```
    controller:
      resources:
        limits:
          cpu: 1000m
          memory: 1640Mi
        requests:
          cpu: 1000m
          memory: 1640Mi
    ```

    パラメーターを変更するコマンドの例 :

    === "Ingress controller installation"
        ```bash
        helm install --set controller.resources.limits.cpu='2000m',controller.resources.limits.memory='3280Mi' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

        正しい Ingress コントローラのインストールには、[その他のパラメーター](../configure-kubernetes-en.md#additional-settings-for-helm-chart)が必要です。`--set`オプションでもそれらを渡してください。
    === "Updating Ingress controller parameters"
        ```bash
        helm upgrade --reuse-values --set controller.resources.limits.cpu='2000m',controller.resources.limits.memory='3280Mi' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

* 他のデプロイメントオプションでは、NGINXの設定ファイルを使用します。

!!! info "CPU利用率の観点からの推奨事項"
    本番モードで実行する場合、NGINXプロセスに少なくとも1つのCPUコアを割り当て、Tarantoolプロセスに1つのコアを割り当てることを推奨します。

    実際のNGINX CPU利用率は、RPSレベル、リクエストとレスポンスの平均サイズ、ノードが処理するLOMルールの数、Base64やデータ圧縮などのデータエンコーディングの種類とレイヤーといったさまざまな要因によります。平均して、1つのCPUコアは約500 RPSを処理できます。大半の場合、初期にフィルタリングノードを過割り、実際の本番トラフィックレベルでのCPUおよびメモリ使用量を確認し、合理的なレベルまで割り当てリソースを徐々に減らすことが推奨されます（トラフィックのピークおよびノード冗長のため、少なくとも2倍のヘッドルームを確保）。