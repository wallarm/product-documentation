[waf-mode-instr]: ../admin-ja/configure-wallarm-mode.md
[blocking-page-instr]: ../admin-ja/configuration-guides/configure-block-page-and-code.md
[logging-instr]: ../admin-ja/configure-logging.md
[proxy-balancer-instr]: ../admin-ja/using-proxy-or-balancer-ja.md
[process-time-limit-instr]: ../admin-ja/configure-parameters-ja.md#wallarm_process_time_limit
[allocating-memory-guide]: ../admin-ja/configuration-guides/allocate-resources-for-node.md
[ptrav-attack-docs]: ../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]: ../images/admin-guides/test-attacks-quickstart.png
[nginx-process-time-limit-docs]: ../admin-ja/configure-parameters-ja.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]: ../admin-ja/configure-parameters-ja.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]: ../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]: ../user-guides/ip-lists/graylist.md
[waf-mode-instr]: ../admin-ja/configure-wallarm-mode.md
[envoy-process-time-limit-docs]: ../admin-ja/configuration-guides/envoy/fine-tuning.md#process_time_limit
[envoy-process-time-limit-block-docs]: ../admin-ja/configuration-guides/envoy/fine-tuning.md#process_time_limit_block

# Docker NGINX-またはEnvoyベースのイメージのアップグレード

これらの手順は、Docker NGINX-またはEnvoyベースのイメージ4.xをバージョン4.4にアップグレードする手順を説明しています。

!!! warning "すでに存在するWallarmノードの資格情報の使用"
    既存のWallarmノードの前のバージョンを使用することはお勧めしません。代わりに、これらの手順に従って、 バージョン4.4の新しいフィルタリングノードを作成し、Dockerコンテナーとしてデプロイしてください。

サポート終了ノード（3.6以下）をアップグレードするには、[別の手順](older-versions/docker-container.md) を使用してください。

## 要件

--8<-- "../include-ja/waf/installation/requirements-docker-4.0.md"

## ステップ1：更新されたフィルタリングノードイメージをダウンロードする

=== "NGINXベースのイメージ"
    ``` bash
    docker pull wallarm/node:4.4.5-1
    ```
=== "Envoyベースのイメージ"
    ``` bash
    docker pull wallarm/envoy:4.4.3-1
    ```

## ステップ2：実行中のコンテナを停止する

```bash
docker stop <RUNNING_CONTAINER_NAME>
```

## ステップ3：新しいイメージを使用してコンテナを実行する

1. Wallarm Console → **ノード** に進み、**Wallarmノード** を作成します。

    ![!Wallarmノードの作成](../images/user-guides/nodes/create-wallarm-node-name-specified.png)
1. 生成されたトークンをコピーします。
1. コピーしたトークンを使用して更新されたイメージを実行します。前のイメージバージョンを実行するときに渡された同じ構成パラメータを渡すことができます（ノードトークンを除く）。
    
    更新されたイメージを使用してコンテナを実行するには、2つのオプションがあります：

    * **環境変数で**基本的なフィルタリングノードの構成を指定します
        * [NGINXベースのDockerコンテナー用の手順 →](../admin-ja/installation-docker-ja.md#run-the-container-passing-the-environment-variables)
        * [EnvoyベースのDockerコンテナー用の手順 →](../admin-ja/installation-guides/envoy/envoy-docker.md#run-the-container-passing-the-environment-variables)
    * **マウントされた構成ファイルで**高度なフィルタリングノード構成を指定します
        * [NGINXベースのDockerコンテナー用の手順 →](../admin-ja/installation-docker-ja.md#run-the-container-mounting-the-configuration-file)
        * [EnvoyベースのDockerコンテナー用の手順 →](../admin-ja/installation-guides/envoy/envoy-docker.md#run-the-container-mounting-envoyyaml)

## ステップ4：フィルタリングノードの操作をテストする

--8<-- "../include-ja/waf/installation/test-waf-operation-no-stats.md"

## ステップ5：前のバージョンのフィルタリングノードを削除する

バージョン4.4のデプロイされたイメージが正しく動作している場合、Wallarm Console → **ノード** で前のバージョンのフィルタリングノードを削除することができます。