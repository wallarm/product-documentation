# Wallarm Nodeのリソース割り当て

フィルタリングノードに割り当てられるメモリとCPUリソースの量は、リクエスト処理の品質と速度を決定します。これらの指示には、フィルタリングノードのメモリを割り当てるための推奨事項が記述されています。

フィルタリングノードには、主に2つのメモリとCPUの使用者があります：

* [Tarantool](#tarantool)、または **postanalyticsモジュール** とも呼ばれています。これはローカルデータ分析のバックエンドであり、フィルタリングノードの主なメモリ消費者です。
* [NGINX](#nginx) は、主なフィルタリングノード及びリバースプロキシコンポーネントです。

NGINXのCPU使用は、RPSレベル、リクエストとレスポンスの平均サイズ、ノードが処理するカスタムルールセットのルールの数、Base64やデータ圧縮のような使用されるデータエンコーディングの種類や層など、多くの要因に依存します。

平均して、一つのCPUコアは約500RPSを処理できます。本番モードで稼働する場合、NGINXプロセスには少なくとも一つのCPUコアを、Tarantoolプロセスにも一つのCPUコアを割り当てることが推奨されます。多くの場合、フィルタリングノードを初めて設定する際には、リソースを余分に割り当てた方が良いでしょう。そして、実際の本番環境でのトラフィックレベルによるCPUやメモリ使用量を観察し、割り当てられたリソースを徐々に適切なレベル (トラフィックの急増やノードの冗長性のために少なくとも2倍の余裕を保つ) まで減らしていくことを推奨します。

## Tarantool

--8<-- "../include/allocate-resources-for-waf-node/tarantool-memory.md"

### Kubernetes Ingressコントローラーでのリソース割り当て

--8<-- "../include/allocate-resources-for-waf-node/tarantool-memory-ingress-controller.md"

### その他のデプロイメントオプションでのリソース割り当て

Tarantoolのメモリのサイズは、 `/etc/default/wallarm-tarantool` または `/etc/sysconfig/wallarm-tarantool` 設定ファイルの `SLAB_ALLOC_ARENA` 属性を使用して制御されます。

メモリを割り当てるには：

<ol start="1"><li>Tarantoolの設定ファイルを編集するために開きます：</li></ol>

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
=== "Amazon Linux 2.0.2021x 以前"
    ```bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```
=== "AlmaLinux, Rocky LinuxもしくはOracle Linux 8.x"
    ```bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```

<ol start="2"><li><code>SLAB_ALLOC_ARENA</code> 属性をメモリサイズに設定します。その値は整数または小数点(<code>.</code>は小数点記号)で表される浮動小数点数です。たとえば：</li></ol>

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

フィルタリングノードの現在の負荷レベルでTarantoolインスタンスがどれぐらいの期間トラフィックの詳細を保持できるかを知るためには、[`wallarm-tarantool/gauge-timeframe_size`](../monitoring/available-metrics.md#time-of-storing-requests-in-the-postanalytics-module-in-seconds) 監視メトリックを使用できます。

## NGINX

NGINXのメモリ消費は多くの要素に依存します。一般的には以下のように推定できます：

```
同時リクエスト数 * 平均リクエストサイズ * 3
```

例えば：

* フィルタリングノードがピーク時に10000の並列リクエストを処理している
* 平均リクエストサイズは5kB

NGINXのメモリ消費は次のように推定できます：

```
10000 * 5kB * 3 = 150000 kB (または ~150MB)
```

**メモリを割り当てる方法：**

* NGINX Ingressコントローラーポッド（ `ingress-controller`）の場合、 `values.yaml` ファイルの以下のセクションを `helm install` or `helm upgrade` の `--set` オプションで設定します：
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

    パラメータを変更するコマンドの例：

    === "Ingressコントローラーのインストール"
        ```bash
        helm install --set controller.resources.limits.cpu='2000m',controller.resources.limits.memory='3280Mi' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

        正確なIngressコントローラーのインストールに必要な[その他のパラメーター](../configure-kubernetes-en.md#additional-settings-for-helm-chart)もあります。これらも `--set` オプションで入力してください。
        
    === "Ingressコントローラーのパラメーターの更新"
        ```bash
        helm upgrade --reuse-values --set controller.resources.limits.cpu='2000m',controller.resources.limits.memory='3280Mi' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```
        
* その他のデプロイメントオプションの場合、NGINXの設定ファイルを使用します。

## トラブルシューティング

Wallarmノードが予想以上にメモリとCPUを消費する場合、リソースの使用を削減するための推奨事項を [CPU使用率の高いトラブルシューティング](../../faq/cpu.md) の記事から確認し、それに従ってください。