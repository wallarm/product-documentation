[waf-mode-instr]: ../admin-en/configure-wallarm-mode.ja.md
[blocking-page-instr]: ../admin-en/configuration-guides/configure-block-page-and-code.ja.md
[logging-instr]: ../admin-en/configure-logging.ja.md
[proxy-balancer-instr]: ../admin-en/using-proxy-or-balancer-en.ja.md
[process-time-limit-instr]: ../admin-en/configure-parameters-en.ja.md#wallarm_process_time_limit
[allocating-memory-guide]: ../admin-en/configuration-guides/allocate-resources-for-node.ja.md
[ptrav-attack-docs]: ../attacks-vulns-list.ja.md#path-traversal
[attacks-in-ui-image]: ../images/admin-guides/test-attacks-quickstart.png
[nginx-process-time-limit-docs]: ../admin-en/configure-parameters-en.ja.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]: ../admin-en/configure-parameters-en.ja.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]: ../user-guides/rules/configure-overlimit-res-detection.ja.md
[graylist-docs]: ../user-guides/ip-lists/graylist.ja.md
[waf-mode-instr]: ../admin-en/configure-wallarm-mode.ja.md
[envoy-process-time-limit-docs]: ../admin-en/configuration-guides/envoy/fine-tuning.ja.md#process_time_limit
[envoy-process-time-limit-block-docs]: ../admin-en/configuration-guides/envoy/fine-tuning.ja.md#process_time_limit_block

# Docker NGINX-またはEnvoyベースのイメージのアップグレード

これらの手順は、Docker NGINX-またはEnvoyベースのイメージ4.xをバージョン4.4にアップグレードする手順を説明しています。

!!! warning "すでに存在するWallarmノードの資格情報の使用"
    既存のWallarmノードの前のバージョンを使用することはお勧めしません。代わりに、これらの手順に従って、 バージョン4.4の新しいフィルタリングノードを作成し、Dockerコンテナーとしてデプロイしてください。

サポート終了ノード（3.6以下）をアップグレードするには、[別の手順](older-versions/docker-container.ja.md) を使用してください。

## 要件

--8<-- "../include/waf/installation/requirements-docker-4.0.ja.md"

## ステップ1：更新されたフィルタリングノードイメージをダウンロードする

=== "NGINXベースのイメージ"
    ``` bash
    docker pull wallarm/node:4.4.5-1
    ```
=== "Envoyベースのイメージ"
    ``` bash
    docker pull wallarm/envoy:4.4.4-1
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
        * [NGINXベースのDockerコンテナー用の手順 →](../admin-en/installation-docker-en.ja.md#run-the-container-passing-the-environment-variables)
        * [EnvoyベースのDockerコンテナー用の手順 →](../admin-en/installation-guides/envoy/envoy-docker.ja.md#run-the-container-passing-the-environment-variables)
    * **マウントされた構成ファイルで**高度なフィルタリングノード構成を指定します
        * [NGINXベースのDockerコンテナー用の手順 →](../admin-en/installation-docker-en.ja.md#run-the-container-mounting-the-configuration-file)
        * [EnvoyベースのDockerコンテナー用の手順 →](../admin-en/installation-guides/envoy/envoy-docker.ja.md#run-the-container-mounting-envoyyaml)

## ステップ4：フィルタリングノードの操作をテストする

--8<-- "../include/waf/installation/test-waf-operation-no-stats.ja.md"

## ステップ5：前のバージョンのフィルタリングノードを削除する

バージョン4.4のデプロイされたイメージが正しく動作している場合、Wallarm Console → **ノード** で前のバージョンのフィルタリングノードを削除することができます。