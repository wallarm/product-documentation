[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[blocking-page-instr]:              ../admin-en/configuration-guides/configure-block-page-and-code.md
[logging-instr]:                    ../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[allocating-memory-guide]:          ../admin-en/configuration-guides/allocate-resources-for-node.md
[ptrav-attack-docs]:                ../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../images/admin-guides/test-attacks-quickstart.png
[nginx-process-time-limit-docs]:    ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../user-guides/ip-lists/graylist.md
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[envoy-process-time-limit-docs]:    ../admin-en/configuration-guides/envoy/fine-tuning.md#process_time_limit
[envoy-process-time-limit-block-docs]: ../admin-en/configuration-guides/envoy/fine-tuning.md#process_time_limit_block

# Docker NGINX-またはEnvoyベースのイメージのアップグレード

これらの指示は、実行中のDocker NGINX-またはEnvoyベースのイメージ4.xをバージョン4.6にアップグレードする手順を説明します。

!!! warning "既存のWallarmノードの資格情報の使用"
    前のバージョンの既存のWallarmノードを使用することはお勧めしません。新しいフィルタリングノードをバージョン4.6で作成し、それをDockerコンテナとしてデプロイするためにこれらの指示に従ってください。

End‑of‑lifeノード（3.6以下）をアップグレードするには、[別の指示](older-versions/docker-container.md)を使用してください。

## 要件

--8<-- "../include/waf/installation/requirements-docker-4.0.md"

## ステップ1：更新されたフィルタリングノードイメージのダウンロード

=== "NGINXベースのイメージ"
    ``` bash
    docker pull wallarm/node:4.6.2-1
    ```
=== "Envoyベースのイメージ"
    ``` bash
    docker pull wallarm/envoy:4.6.2-1
    ```

## ステップ2：Wallarmブロックページの更新（NGINXベースのイメージをアップグレードする場合）

新しいノードバージョンでは、Wallarmのサンプルブロックページが[変更されました](what-is-new.md#new-blocking-page)。ページ上のロゴとサポートメールはデフォルトで空になります。

Dockerコンテナがブロックされたリクエストに対して`&/usr/share/nginx/html/wallarm_blocked.html`ページを返すように設定されていた場合、この設定を以下のように変更します：

1. サンプルページの新しいバージョンを[コピーしてカスタマイズします](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)。
1. 次のステップで新しいDockerコンテナにカスタマイズしたページとNGINX設定ファイルを[マウントします](../admin-en/configuration-guides/configure-block-page-and-code.md#path-to-the-htm-or-html-file-with-the-blocking-page-and-error-code)。

## ステップ3：実行中のコンテナの停止

```bash
docker stop <RUNNING_CONTAINER_NAME>
```

## ステップ4：新しいイメージを使用してコンテナを実行する

1. Wallarm Consoleに進み、**Nodes**を選択し、**Wallarmノード**を作成します。

    ![!Wallarmノードの作成](../images/user-guides/nodes/create-wallarm-node-name-specified.png)
1. 生成されたトークンをコピーします。
1. コピーしたトークンを使用して、更新されたイメージを実行します。前のイメージバージョンの実行時に渡された同じ設定パラメータを渡すことができます（ノードトークンを除く）。
    
    更新されたイメージを使ってコンテナを実行するには二つの方法があります：

    * 基本的なフィルタリングノードの設定を指定する**環境変数を使用して**
        * [NGINXベースのDockerコンテナの手順 →](../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables)
        * [EnvoyベースのDockerコンテナの手順 →](../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-passing-the-environment-variables)
    * 高度なフィルタリングノード設定を指定する**マウントされた設定ファイル**
        * [NGINXベースのDockerコンテナの手順 →](../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file)
        * [EnvoyベースのDockerコンテナの手順 →](../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-mounting-envoyyaml)

## ステップ5：フィルタリングノード操作のテスト

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## ステップ6：前のバージョンのフィルタリングノードの削除

バージョン4.6のデプロイされたイメージが正常に動作している場合、Wallarm Consoleの**Nodes**で前のバージョンのフィルタリングノードを削除できます。
