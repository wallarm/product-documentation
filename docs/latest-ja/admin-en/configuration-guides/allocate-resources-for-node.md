# Wallarm NGINXノードのリソース割り当て

Wallarm NGINXノードに割り当てるメモリおよびCPUリソースの量は、リクエスト処理の品質と速度を左右します。本ドキュメントでは、セルフホスト型NGINXノードのメモリ割り当てに関する推奨事項を説明します。

NGINXフィルタリングノードの主なメモリおよびCPUの消費源は次の2つです。

* [wstore](#wstore)、別名**postanalyticsモジュール**です。これはローカルのデータ分析バックエンドであり、フィルタリングノードにおける主なメモリ消費源です。
* [NGINX](#nginx)は、フィルタリングノードおよびリバースプロキシの主要コンポーネントです。

NGINXのCPU使用率は、RPSの水準、リクエストおよびレスポンスの平均サイズ、ノードが処理するカスタムルールセットのルール数、Base64やデータ圧縮などのデータエンコーディングの種類やレイヤーなど、多くの要因に依存します。

平均すると、CPUコア1つで約500 RPSを処理できます。本番モードでの運用時は、NGINXプロセスに少なくともCPUコア1つ、wstoreプロセスにコア1つを割り当てることを推奨します。多くの場合、最初はフィルタリングノードを過剰にプロビジョニングし、実際の本番トラフィックレベルにおけるCPUとメモリの使用状況を確認したうえで、割り当てリソースを徐々に適正水準まで減らすことを推奨します（トラフィックのスパイクやノード冗長性に備えて、最低でも2倍の余裕を確保します）。

## wstore

--8<-- "../include/allocate-resources-for-waf-node/wstore-memory.md"

### Kubernetes Ingress Controllerでのリソース割り当て

--8<-- "../include/allocate-resources-for-waf-node/wstore-memory-ingress-controller.md"

### All-in-One Installerを使用する場合のリソース割り当て

wstoreのメモリサイズは、`/opt/wallarm/env.list`構成ファイル内の`SLAB_ALLOC_ARENA`属性で制御します。以下の手順でメモリを割り当てます。

1. 編集のために`/opt/wallarm/env.list`ファイルを開きます：

    ```bash
    sudo vim /opt/wallarm/env.list
    ```
1. メモリサイズを指定するように`SLAB_ALLOC_ARENA`属性を設定します。値には整数または浮動小数点数を使用できます（小数点はドット`.`です）。例：
    ```
    SLAB_ALLOC_ARENA=1.0
    ```
1. Wallarmサービスを再起動します：
    ```
    sudo systemctl restart wallarm.service
    ```

### Amazon Machine Imageを使用する場合のリソース割り当て

* Wallarmノードは、割り当てられたリソースをwstoreとNGINXの間で自動的に分配します。
* [Wallarm NGINX Node AMI](https://aws.amazon.com/marketplace/pp/prodview-5rl4dgi4wvbfe)からWallarmノードインスタンスを起動する場合、テスト用途には`t3.medium`インスタンスタイプ、本番には`m4.xlarge`の使用を推奨します。

## NGINX

NGINXのメモリ消費は多くの要因に左右されます。平均的には次の式で見積もれます。

```
Number of concurrent request * Average request size * 3
```

例：

* フィルタリングノードはピーク時に10000件の同時リクエストを処理し、
* リクエストの平均サイズは5 kBです。

NGINXのメモリ消費は次のように見積もれます。

```
10000 * 5 kB * 3 = 150000 kB (or ~150 MB)
```

**メモリ量を割り当てるには：**

* NGINX Ingress controllerのPod（`ingress-controller`）の場合、`helm install`または`helm upgrade`の`--set`オプションを使用して、`values.yaml`ファイル内で次のセクションを設定します。
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

    パラメータを変更するコマンドの例：

    === "Ingress controllerのインストール"
        ```bash
        helm install --set controller.resources.limits.cpu='2000m',controller.resources.limits.memory='3280Mi' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

        正しくIngress controllerをインストールするには、[その他のパラメータ](../configure-kubernetes-en.md#additional-settings-for-helm-chart)も必要です。これらも`--set`オプションで指定してください。
    === "Ingress controllerのパラメータ更新"
        ```bash
        helm upgrade --reuse-values --set controller.resources.limits.cpu='2000m',controller.resources.limits.memory='3280Mi' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

* その他のデプロイ方法では、NGINXの構成ファイルを使用します。

## トラブルシューティング

Wallarmノードが想定以上のメモリやCPUを消費する場合は、リソース使用量を削減するために、[CPU高負荷のトラブルシューティング](../../troubleshooting/performance.md#wallarm-node-consumes-too-much-cpu)に記載された推奨事項を確認し、適用してください。